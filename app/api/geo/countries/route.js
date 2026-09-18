import { Country } from "country-state-city";

export async function GET() {
  const countries = Country.getAllCountries()
    .map((c) => ({ name: c.name, isoCode: c.isoCode }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return Response.json({ countries });
}
