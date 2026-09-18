const OPENAI_KEY = process.env.OPENAI_API_KEY;

export async function POST(request) {
  if (!OPENAI_KEY) {
    return Response.json({ error: "OPENAI_API_KEY is not configured." }, { status: 500 });
  }

  const { query } = await request.json();
  if (!query?.trim()) return Response.json({ error: "Query is required" }, { status: 400 });

  const prompt = `A user is searching for business leads using this query: "${query}"

Suggest 5 more specific, targeted variations of this search query that would find higher-quality, more niche leads.

Rules:
- Each suggestion should be more specific than the original (add area, type, or qualifier)
- Keep the same city/location if one was mentioned
- Make each one different — vary by neighbourhood, business type, or audience
- Return ONLY a JSON array of 5 strings, no explanation
- Example format: ["query 1", "query 2", "query 3", "query 4", "query 5"]`;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 200,
      temperature: 0.8,
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    return Response.json({ error: err.error?.message || "OpenAI error" }, { status: 500 });
  }

  const data = await res.json();
  const raw = data.choices?.[0]?.message?.content?.trim();

  try {
    const suggestions = JSON.parse(raw);
    return Response.json({ suggestions });
  } catch {
    return Response.json({ error: "Failed to parse suggestions" }, { status: 500 });
  }
}
