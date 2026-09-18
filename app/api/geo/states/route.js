import { State } from "country-state-city";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const country = searchParams.get("country");

  if (!country) {
    return Response.json({ error: "country is required" }, { status: 400 });
  }

  const states = State.getStatesOfCountry(country)
    .map((s) => ({ name: s.name, isoCode: s.isoCode }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return Response.json({ states });
}
