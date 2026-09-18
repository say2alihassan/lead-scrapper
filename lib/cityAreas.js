// Hardcoded neighbourhood lists for major cities.
// Each entry gives ~30-50 areas so we can run one sub-query per area.
// OpenAI is used as fallback for any city not listed here.

export const CITY_AREAS = {
  // Pakistan
  lahore: [
    "DHA Phase 1", "DHA Phase 2", "DHA Phase 3", "DHA Phase 4", "DHA Phase 5", "DHA Phase 6",
    "Gulberg 1", "Gulberg 2", "Gulberg 3", "Gulberg Lahore", "Model Town", "Garden Town",
    "Johar Town", "Faisal Town", "Bahria Town Lahore", "Wapda Town", "Township",
    "Cantt Lahore", "Cavalry Ground", "Askari", "PECHS Lahore", "Shadman",
    "Mall Road Lahore", "Old City Lahore", "Ichra", "Samanabad", "Allama Iqbal Town",
    "Ravi Road", "Shahdara", "Badami Bagh", "Shalimar", "GT Road Lahore",
    "Chungi Amar Sadhu", "Manga Mandi", "Raiwind", "Kot Lakhpat",
  ],
  karachi: [
    "DHA Karachi Phase 1", "DHA Karachi Phase 2", "DHA Karachi Phase 5", "DHA Karachi Phase 6",
    "Clifton", "Bath Island", "Defence", "Korangi", "Gulshan-e-Iqbal", "North Nazimabad",
    "Federal B Area", "Nazimabad", "Saddar Karachi", "Garden Karachi", "Lyari",
    "Kemari", "Baldia", "SITE Karachi", "Malir", "Landhi", "Shah Faisal Colony",
    "Gulistan-e-Johar", "Scheme 33", "University Road Karachi", "Johar More",
    "Orangi Town", "Liaquatabad", "Paposh Nagar", "North Karachi", "Surjani Town",
    "Gulberg Karachi", "Bahadurabad", "Tariq Road", "Bahadurabad", "Pechs Karachi",
  ],
  islamabad: [
    "F-6", "F-7", "F-8", "F-10", "F-11", "G-6", "G-7", "G-8", "G-9", "G-10", "G-11",
    "Blue Area Islamabad", "Centaurus Islamabad", "Bahria Town Islamabad",
    "DHA Islamabad", "Margalla Hills", "Bani Gala", "Sector E-7", "Sector E-11",
    "Rawalpindi Saddar", "Rawalpindi Cantt", "Chaklala", "Westridge",
    "I-8 Islamabad", "I-10 Islamabad", "H-9 Islamabad", "Tarlai",
  ],
  // UAE
  dubai: [
    "Downtown Dubai", "Dubai Marina", "JBR Jumeirah Beach Residence", "Palm Jumeirah",
    "Business Bay Dubai", "DIFC Dubai", "Deira Dubai", "Bur Dubai", "Jumeirah Dubai",
    "Al Quoz Dubai", "Mirdif Dubai", "Dubai Silicon Oasis", "Dubai Academic City",
    "Dubai International City", "Discovery Gardens Dubai", "JLT Dubai",
    "Al Barsha Dubai", "Tecom Dubai", "Motor City Dubai", "Dubai Sports City",
    "Arabian Ranches Dubai", "Emirates Hills Dubai",
    "Al Karama Dubai", "Al Satwa Dubai", "Al Mankhool Dubai", "Oud Metha Dubai",
    "Al Garhoud Dubai", "Al Qusais Dubai", "Rashidiya Dubai", "Al Warqa Dubai",
    "Al Nahda Dubai", "Umm Suqeim Dubai", "Jumeirah 1 Dubai", "Jumeirah 3 Dubai",
    "Dubai Hills", "Nad Al Sheba Dubai",
  ],
  "abu dhabi": [
    "Al Reem Island", "Yas Island", "Saadiyat Island", "Corniche Abu Dhabi",
    "Al Khalidiyah", "Al Mushrif", "Khalifa City", "Mohammed Bin Zayed City",
    "Al Reef", "Al Ghadeer", "Al Maryah Island", "Tourist Club Area",
    "Al Wahda Abu Dhabi", "Al Zaab", "Al Manaseer", "Electra Street",
    "Hamdan Street", "Muroor Road", "Airport Road Abu Dhabi",
    "Al Shamkha", "Baniyas", "Al Falah", "Madinat Zayed",
  ],
  // UK
  london: [
    "Mayfair", "Soho", "Covent Garden", "Chelsea", "Kensington", "Notting Hill",
    "Canary Wharf", "Shoreditch", "Hackney", "Brixton", "Clapham", "Peckham",
    "Greenwich", "Lewisham", "Woolwich", "Stratford", "Bethnal Green",
    "Islington", "Finsbury Park", "Holloway", "Crouch End", "Muswell Hill",
    "Hammersmith", "Fulham", "Putney", "Wimbledon", "Richmond",
    "Kingston upon Thames", "Croydon", "Bromley", "Lewisham", "Catford",
    "Harrow", "Wembley", "Ealing", "Acton", "Chiswick", "Brentford",
    "Tottenham", "Wood Green", "Edmonton", "Enfield", "Barnet", "Finchley",
    "Camden", "Kentish Town", "Belsize Park", "Hampstead",
  ],
  manchester: [
    "City Centre Manchester", "Deansgate", "Northern Quarter", "Ancoats",
    "Spinningfields", "Piccadilly Manchester", "Salford", "Salford Quays",
    "Stretford", "Trafford", "Old Trafford", "Chorlton", "Didsbury",
    "Withington", "Fallowfield", "Moss Side", "Hulme", "Ardwick",
    "Longsight", "Levenshulme", "Gorton", "Openshaw", "Beswick",
    "Collyhurst", "Moston", "Newton Heath", "Miles Platting", "Rochdale Road",
    "Stockport", "Cheadle", "Altrincham", "Sale Manchester",
  ],
  birmingham: [
    "City Centre Birmingham", "Digbeth", "Jewellery Quarter", "Edgbaston",
    "Harborne", "Moseley", "Kings Heath", "Stirchley", "Selly Oak",
    "Bournville", "Northfield", "Longbridge", "Erdington", "Sutton Coldfield",
    "Great Barr", "Perry Barr", "Handsworth", "Lozells", "Aston",
    "Nechells", "Small Heath", "Sparkhill", "Sparkbrook", "Acocks Green",
    "Yardley", "Sheldon", "Bordesley Green", "Saltley",
  ],
  // US
  "new york": [
    "Manhattan", "Brooklyn", "Queens", "Bronx", "Staten Island",
    "Midtown Manhattan", "Upper East Side", "Upper West Side", "Harlem",
    "Lower East Side", "SoHo", "Tribeca", "Financial District",
    "Williamsburg Brooklyn", "Park Slope", "Bushwick", "Astoria Queens",
    "Flushing Queens", "Jamaica Queens", "Long Island City",
    "Riverdale Bronx", "Fordham", "Bay Ridge Brooklyn",
  ],
  "los angeles": [
    "Hollywood", "Beverly Hills", "Santa Monica", "Venice Beach", "Malibu",
    "West Hollywood", "Silver Lake", "Echo Park", "Downtown LA", "Koreatown",
    "Compton", "Inglewood", "Culver City", "El Segundo", "Torrance",
    "Long Beach", "Pasadena", "Glendale", "Burbank", "Van Nuys",
    "Sherman Oaks", "Studio City", "North Hollywood", "Chatsworth",
  ],
  // Asia
  bangkok: [
    "Sukhumvit", "Silom", "Sathorn", "Ratchada", "Ari", "Phrom Phong",
    "Thong Lo", "Ekkamai", "On Nut", "Bearing", "Bang Na",
    "Chatuchak", "Victory Monument", "Pahurat", "Chinatown Bangkok",
    "Khao San Road", "Rattanakosin", "Dusit", "Bang Rak", "Bangkapi",
    "Lat Phrao", "Min Buri", "Nonthaburi", "Samut Prakan",
  ],
  // Australia
  sydney: [
    "CBD Sydney", "Surry Hills", "Newtown", "Glebe", "Pyrmont",
    "Darlinghurst", "Paddington", "Bondi", "Bondi Junction", "Coogee",
    "Manly", "Mosman", "Neutral Bay", "Cremorne", "North Sydney",
    "Parramatta", "Penrith", "Liverpool", "Chatswood", "Hornsby",
    "Hurstville", "Bankstown", "Auburn", "Strathfield", "Burwood",
  ],
  // India
  mumbai: [
    "Bandra", "Andheri", "Juhu", "Powai", "Goregaon", "Malad", "Borivali",
    "Kandivali", "Dahisar", "Mira Road", "Kurla", "Ghatkopar", "Mulund",
    "Thane", "Navi Mumbai", "Vashi", "Belapur", "Kharghar",
    "Dadar", "Parel", "Lower Parel", "Worli", "Nariman Point",
    "Colaba", "Fort Mumbai", "Marine Lines", "Chembur", "Vikhroli",
  ],
  delhi: [
    "Connaught Place", "Karol Bagh", "Lajpat Nagar", "Khan Market",
    "Hauz Khas", "Vasant Kunj", "Dwarka", "Rohini", "Pitampura",
    "Janakpuri", "Rajouri Garden", "Punjabi Bagh", "Saket", "Malviya Nagar",
    "Greater Kailash", "South Extension", "Defence Colony", "Noida Sector 18",
    "Noida Sector 62", "Gurugram Sector 29", "Gurugram DLF",
    "Shahdara Delhi", "Laxmi Nagar", "Preet Vihar",
  ],
};

// Extract city name from a query like "restaurants in DHA Lahore"
export function extractCity(query) {
  const q = query.toLowerCase();

  // Direct city name match
  for (const city of Object.keys(CITY_AREAS)) {
    if (q.includes(city)) return city;
  }

  // Common aliases
  const aliases = {
    "new york city": "new york", "nyc": "new york", "la": "los angeles",
    "karachi city": "karachi", "lahore city": "lahore",
    "dha lahore": "lahore", "dha karachi": "karachi", "dha islamabad": "islamabad",
    "gulberg": "lahore", "clifton": "karachi",
    "uk": "london", "england": "london",
  };
  for (const [alias, city] of Object.entries(aliases)) {
    if (q.includes(alias)) return city;
  }

  return null;
}

// Build area sub-queries from a base query + city
export function buildAreaQueries(baseQuery, city) {
  const areas = CITY_AREAS[city];
  if (!areas) return null;

  // Use the LAST "in" as the split point so queries like
  // "nail salons specializing in nail art in Downtown Dubai"
  // correctly extract "nail salons specializing in nail art" as the business type
  const lastInIdx = baseQuery.toLowerCase().lastIndexOf(" in ");
  const businessType = lastInIdx !== -1
    ? baseQuery.slice(0, lastInIdx).trim()
    : baseQuery;

  return areas.map((area) => `${businessType} in ${area}`);
}
