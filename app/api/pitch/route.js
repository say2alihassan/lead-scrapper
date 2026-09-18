const OPENAI_KEY = process.env.OPENAI_API_KEY;

export async function POST(request) {
  if (!OPENAI_KEY) {
    return Response.json({ error: "OPENAI_API_KEY is not configured." }, { status: 500 });
  }

  const { lead, query } = await request.json();
  if (!lead) return Response.json({ error: "Lead is required" }, { status: 400 });

  const prompt = `You are a professional cold outreach copywriter for a digital agency.

Write a short, personalized cold email to pitch digital services to this business.

Business details:
- Name: ${lead.name}
- Category: ${lead.category}
- Rating: ${lead.rating || "N/A"} stars
- Reviews: ${lead.user_ratings_total || 0}
- Has website: ${lead.website ? "Yes (" + lead.website + ")" : "No"}
- Address: ${lead.formatted_address || "N/A"}
- Search context: "${query}"
- Recommended pitch angle: ${lead.pitchAngle}

Rules:
- Max 120 words
- Start with a specific observation about their business (use their name, rating, or review count)
- One clear value proposition tied to the pitch angle
- One soft CTA (e.g. "Would you be open to a quick 10-minute call?")
- Friendly, human tone — not salesy
- Do NOT use placeholders like [Your Name] — end with just "Best regards"
- Return ONLY the email body, no subject line`;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 300,
      temperature: 0.7,
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    return Response.json({ error: err.error?.message || "OpenAI error" }, { status: 500 });
  }

  const data = await res.json();
  const email = data.choices?.[0]?.message?.content?.trim();
  return Response.json({ email });
}
