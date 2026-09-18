import { City } from "country-state-city";

const MAX_CITIES = 1000;

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const country = searchParams.get("country");
  const state = searchParams.get("state");

  if (!country) {
    return Response.json({ error: "country is required" }, { status: 400 });
  }

  const raw = state ? City.getCitiesOfState(country, state) : City.getCitiesOfCountry(country) || [];

  const cities = raw
    .map((c) => c.name)
    .sort((a, b) => a.localeCompare(b))
    .slice(0, MAX_CITIES);

  return Response.json({ cities, truncated: raw.length > MAX_CITIES });
}
