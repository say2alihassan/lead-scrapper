export const CATEGORIES = [
  "Restaurants", "Cafes", "Salons & Spas", "Gyms & Fitness", "Dental Clinics",
  "Medical Clinics", "Hotels", "Retail Shops", "Real Estate Agents", "Law Firms",
  "Accountants", "Auto Repair Shops", "Spray Tanning", "Pet Grooming",
  "Photographers", "Wedding Venues", "Schools & Tutors", "Contractors",
  "Plumbers", "Electricians",
];

export function buildQuery(category, city, stateName, countryName) {
  if (!category || !city) return "";
  const place = [city, stateName, countryName].filter(Boolean).join(", ");
  return `${category} in ${place}`;
}
