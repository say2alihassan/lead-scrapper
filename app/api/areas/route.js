import { extractCity, buildAreaQueries } from "@/lib/cityAreas";

const OPENAI_KEY = process.env.OPENAI_API_KEY;

export async function POST(request) {
  const { query } = await request.json();
  if (!query?.trim()) return Response.json({ error: "Query required" }, { status: 400 });

  // Try hardcoded list first (free, instant)
  const city = extractCity(query);
  if (city) {
    const queries = buildAreaQueries(query, city);
    if (queries) return Response.json({ queries, city, source: "hardcoded" });
  }

  // Fall back to OpenAI for unknown cities
  if (!OPENAI_KEY) {
    return Response.json({ queries: null, city: null, source: "none" });
  }

  try {
    const lastInIdx = query.toLowerCase().lastIndexOf(" in ");
    const location = lastInIdx !== -1 ? query.slice(lastInIdx + 4).trim() : query;
    const businessType = lastInIdx !== -1 ? query.slice(0, lastInIdx).trim() : query;

    const prompt = `List the 35 most distinct neighbourhoods, districts, or areas in "${location}" that a local business search would cover.

Rules:
- Each should be a real, specific area name (not just "North ${location}")
- Cover the full city — mix central, suburban, and outer areas
- Return ONLY a JSON array of strings, no explanation
- Format each as: "${businessType} in [Area Name]"
- Example: ["${businessType} in Mayfair", "${businessType} in Shoreditch"]`;

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

    return Response.json({ queries, city: location, source: "ai" });
  } catch {
    return Response.json({ queries: null, city: null, source: "none" });
  }
}
