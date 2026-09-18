const OPENAI_KEY = process.env.OPENAI_API_KEY;

export async function POST(request) {
  if (!OPENAI_KEY) {
    return Response.json({ error: "OPENAI_API_KEY is not configured." }, { status: 500 });
  }

  const { query, leads } = await request.json();
  if (!leads?.length) return Response.json({ error: "No leads provided" }, { status: 400 });

  const noWebsite = leads.filter((l) => !l.website).length;
  const hasWebsite = leads.filter((l) => l.website).length;
  const strong = leads.filter((l) => l.verdict === "STRONG").length;
  const avgRating = (leads.reduce((s, l) => s + (l.rating || 0), 0) / leads.length).toFixed(1);
  const avgReviews = Math.round(leads.reduce((s, l) => s + (l.user_ratings_total || 0), 0) / leads.length);
  const categories = {};
  for (const l of leads) categories[l.category] = (categories[l.category] || 0) + 1;
  const topCategory = Object.entries(categories).sort((a, b) => b[1] - a[1])[0];

  const prompt = `You are a lead generation analyst. Summarize this market data in 2–3 sentences for a digital agency salesperson.

Search: "${query}"
Total leads found: ${leads.length}
Without website: ${noWebsite} (${Math.round((noWebsite / leads.length) * 100)}%)
With website: ${hasWebsite}
Strong leads: ${strong}
Average rating: ${avgRating} stars
Average reviews: ${avgReviews}
Biggest opportunity category: ${topCategory?.[0]?.replace(/_/g, " ")} (${topCategory?.[1]} businesses)

Rules:
- Be specific with numbers
- Highlight the biggest opportunity
- End with one actionable insight
- Max 60 words
- No bullet points, just flowing sentences`;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 120,
      temperature: 0.5,
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    return Response.json({ error: err.error?.message || "OpenAI error" }, { status: 500 });
  }

  const data = await res.json();
  const summary = data.choices?.[0]?.message?.content?.trim();
  return Response.json({ summary });
}
