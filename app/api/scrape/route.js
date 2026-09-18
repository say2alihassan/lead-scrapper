import { scoreLead, getVerdict, getPitchAngle, categorizeLead } from "@/lib/scoring";
import { extractCity, buildAreaQueries } from "@/lib/cityAreas";

const MAPS_KEY = process.env.GOOGLE_MAPS_API_KEY;
const OPENAI_KEY = process.env.OPENAI_API_KEY;
const DETAILS_FIELDS =
  "name,formatted_phone_number,website,rating,user_ratings_total,types,opening_hours,business_status,url,formatted_address";

async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

// Fetch up to 3 pages for a single sub-query (max 60 results)
async function fetchQueryResults(subQuery) {
  const results = [];
  let url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(subQuery)}&key=${MAPS_KEY}`;

  for (let page = 0; page < 3; page++) {
    const data = await fetchJSON(url);

    if (page === 0) {
      if (data.status === "REQUEST_DENIED") {
        throw Object.assign(
          new Error(data.error_message || "Check your API key and enabled APIs."),
          { code: 403 }
        );
      }
      if (!["OK", "ZERO_RESULTS"].includes(data.status)) {
        throw new Error(`Google Maps API error: ${data.status}. ${data.error_message || ""}`);
      }
    }

    results.push(...(data.results || []));
    if (!data.next_page_token) break;

    // Google requires ~2s delay before next_page_token activates
    await new Promise((r) => setTimeout(r, 2000));
    url = `https://maps.googleapis.com/maps/api/place/textsearch/json?pagetoken=${data.next_page_token}&key=${MAPS_KEY}`;
  }

  return results;
}

// Fetch place details in parallel batches of 10
async function fetchPlaceDetails(places) {
  const results = [];
  const BATCH = 10;
  for (let i = 0; i < places.length; i += BATCH) {
    const batch = places.slice(i, i + BATCH);
    const details = await Promise.all(
      batch.map(async (place) => {
        try {
          const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=${DETAILS_FIELDS}&key=${MAPS_KEY}`;
          const data = await fetchJSON(url);
          return data.status === "OK" ? data.result : null;
        } catch {
          return null;
        }
      })
    );
    results.push(...details.filter(Boolean));
  }
  return results;
}

function processPlace(place, query) {
  const hasWebsite = Boolean(place.website);
  const score = scoreLead(place);
  const verdict = getVerdict(score, hasWebsite);
  const category = categorizeLead({ ...place, score });
  const pitchAngle = getPitchAngle(query, { ...place, score, category });
  return { ...place, score, verdict, category, pitchAngle };
}

function sseMessage(data) {
  return `data: ${JSON.stringify(data)}\n\n`;
}

// Get area sub-queries for a city — hardcoded first, AI fallback
async function getAreaQueries(query) {
  // Try hardcoded map (free, instant)
  const city = extractCity(query);
  if (city) {
    const queries = buildAreaQueries(query, city);
    if (queries) return { queries, city, source: "hardcoded" };
  }

  // AI fallback for unknown cities
  if (!OPENAI_KEY) return { queries: null, city: null, source: "none" };

  try {
    const lastInIdx = query.toLowerCase().lastIndexOf(" in ");
    const location = lastInIdx !== -1 ? query.slice(lastInIdx + 4).trim() : query;
    const businessType = lastInIdx !== -1 ? query.slice(0, lastInIdx).trim() : query;

    const prompt = `List the 35 most distinct neighbourhoods or districts in "${location}" for a local business search.

Return ONLY a JSON array where each item is a search query string.
Format: "${businessType} in [Area Name]"
Example: ["${businessType} in Mayfair", "${businessType} in Shoreditch"]
No explanation, just the JSON array.`;

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 800,
        temperature: 0.3,
      }),
    });

    const data = await res.json();
    const raw = data.choices?.[0]?.message?.content?.trim();
    const queries = JSON.parse(raw);
    return { queries, city: location, source: "ai" };
  } catch {
    return { queries: null, city: null, source: "none" };
  }
}

export async function POST(request) {
  const { query } = await request.json();

  if (!query?.trim()) {
    return Response.json({ error: "Query is required" }, { status: 400 });
  }

  if (!MAPS_KEY) {
    return Response.json(
      { error: "GOOGLE_MAPS_API_KEY is not configured. Add it to .env.local and restart the dev server." },
      { status: 500 }
    );
  }

  const encoder = new TextEncoder();
  const seenIds = new Set();

  const stream = new ReadableStream({
    async start(controller) {
      function send(data) {
        controller.enqueue(encoder.encode(sseMessage(data)));
      }

      try {
        // --- Step 1: Get area-based sub-queries ---
        send({ type: "status", message: "Detecting city areas…" });

        const { queries: areaQueries, city, source } = await getAreaQueries(query);

        // Build final query list: base query + area queries (or A-Z fallback)
        let subQueries;
        if (areaQueries && areaQueries.length > 0) {
          // Dedupe in case base query overlaps with an area query
          subQueries = [query, ...areaQueries.filter((q) => q !== query)];
          send({ type: "strategy", city, areas: areaQueries.length, source });
        } else {
          // Fallback to A-Z if city not recognised and OpenAI unavailable
          const SUFFIXES = "abcdefghijklmnopqrstuvwxyz".split("");
          subQueries = [query, ...SUFFIXES.map((l) => `${query} ${l}`)];
          send({ type: "strategy", city: null, areas: 26, source: "az_fallback" });
        }

        const total = subQueries.length;
        send({ type: "progress", area: "base", done: 0, total });

        // --- Step 2: Run each sub-query ---
        for (let i = 0; i < subQueries.length; i++) {
          const subQuery = subQueries[i];
          const label = i === 0 ? "base query" : subQuery;

          send({ type: "progress", area: label, done: i, total });

          let subResults = [];
          try {
            subResults = await fetchQueryResults(subQuery);
          } catch (err) {
            if (i === 0) {
              // Base query failed — fatal
              send({ type: "error", message: err.message });
              controller.close();
              return;
            }
            // Area sub-query failed — skip and continue
          }

          const newPlaces = subResults.filter((p) => !seenIds.has(p.place_id));
          newPlaces.forEach((p) => seenIds.add(p.place_id));

          if (newPlaces.length > 0) {
            // Fetch details in parallel batches of 10
            const details = await fetchPlaceDetails(newPlaces);
            const leads = details.map((p) => processPlace(p, query));
            send({ type: "leads", leads });
          }

          send({ type: "progress", area: label, done: i + 1, total });
        }

        send({ type: "done", total: seenIds.size });
      } catch (err) {
        send({ type: "error", message: err.message || "Unknown error" });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
