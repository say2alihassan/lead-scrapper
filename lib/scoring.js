export function scoreLead(place) {
  const reviews = place.user_ratings_total || 0;
  const rating = place.rating || 0;
  let score = 0;

  if (reviews >= 500) score += 30;
  else if (reviews >= 200) score += 25;
  else if (reviews >= 100) score += 20;
  else if (reviews >= 50) score += 15;
  else if (reviews >= 20) score += 8;
  else if (reviews >= 10) score += 4;

  if (rating >= 4.8) score += 20;
  else if (rating >= 4.5) score += 15;
  else if (rating >= 4.0) score += 10;
  else if (rating >= 3.5) score += 5;

  if (place.formatted_phone_number) score += 10;
  if (place.opening_hours) score += 5;
  if (reviews >= 100 && rating >= 4.5) score += 10;

  return Math.min(score, 100);
}

export function getVerdict(score, hasWebsite) {
  if (hasWebsite) {
    if (score >= 65) return "STRONG";
    if (score >= 40) return "MAYBE";
    return "SKIP";
  } else {
    if (score >= 50) return "STRONG";
    if (score >= 30) return "MAYBE";
    return "SKIP";
  }
}

// Returns one of 8 category keys
export function categorizeLead(place) {
  const hasWebsite = Boolean(place.website);
  const reviews = place.user_ratings_total || 0;
  const rating = place.rating || 0;
  const score = place.score || scoreLead(place);
  const isOperational = !place.business_status || place.business_status === "OPERATIONAL";

  // Closed or temporarily closed businesses
  if (!isOperational) return "at_risk";

  // Brand new / barely visible businesses
  if (reviews < 10) return "newly_opened";

  // No website at all — hottest web/digital prospect
  if (!hasWebsite) return "no_presence";

  // Poor reputation — lots of reviews but low rating
  if (reviews >= 30 && rating > 0 && rating < 3.9) return "reputation";

  // High value enterprise target
  if (score >= 65 && reviews >= 500) return "high_value";

  // Low review count in a competitive space — needs SEO/Ads
  if (reviews < 50) return "seo_ads";

  // Weak social/online signal despite having a site
  if (rating < 4.0 || reviews < 80) return "social_media";

  // Has website, good presence — pitch a mobile app
  return "app_dev";
}

export function getPitchAngle(query, place) {
  const hasWebsite = Boolean(place.website);
  const reviews = place.user_ratings_total || 0;
  const rating = place.rating || 0;
  const category = place.category || categorizeLead(place);
  const q = query.toLowerCase();

  if (category === "at_risk") {
    return `Listed as ${place.business_status?.replace(/_/g, " ").toLowerCase()} — pitch a digital relaunch: new website, Google listing cleanup, reputation rebuild`;
  }

  if (category === "newly_opened") {
    return `Only ${reviews} review${reviews !== 1 ? "s" : ""} — brand new business. Pitch: launch package — website, Google profile setup, social media starter kit`;
  }

  if (category === "no_presence") {
    const reviewText = reviews > 0 ? `${reviews} Google reviews` : "Google presence";
    return `${reviewText} but NO website — losing leads every day. Pitch: website + online booking + Google Business setup`;
  }

  if (category === "reputation") {
    return `${rating}★ from ${reviews} reviews — customers are complaining. Pitch: reputation management, review response system, customer feedback loop`;
  }

  if (category === "high_value") {
    if (/restaurant|cafe|food|diner|bistro|pizza|burger|bbq|grill/.test(q))
      return "High-traffic venue — pitch: loyalty app, online ordering system, table reservation + POS integration";
    if (/salon|spa|beauty|barber|hair|nail|wax/.test(q))
      return "Established salon — pitch: branded booking app, loyalty points, automated review collection";
    if (/gym|fitness|yoga|pilates|crossfit|sport/.test(q))
      return "High-volume gym — pitch: member management app, class scheduling, push notifications";
    if (/hotel|resort|hostel|motel|inn/.test(q))
      return "Established property — pitch: mobile check-in, concierge app, upsell automation";
    if (/clinic|doctor|dental|dentist|medical|health|pharmacy|physio/.test(q))
      return "High-demand clinic — pitch: patient portal, appointment reminders, telemedicine module";
    return `${reviews}+ reviews, strong presence — pitch: custom enterprise solution, CRM integration, loyalty system`;
  }

  if (category === "seo_ads") {
    return `Only ${reviews} reviews despite being in a competitive space — pitch: local SEO audit, Google Ads campaign, Google Business Profile optimisation`;
  }

  if (category === "social_media") {
    return `Has a website but weak online engagement (${rating}★, ${reviews} reviews) — pitch: social media management, content calendar, Instagram/TikTok growth`;
  }

  // app_dev — has website, decent presence
  if (/restaurant|cafe|food|diner|bistro|pizza|burger|bbq|grill/.test(q))
    return "Online ordering + loyalty rewards app";
  if (/salon|spa|beauty|barber|hair|nail|wax/.test(q))
    return "Appointment booking + loyalty points app";
  if (/gym|fitness|yoga|pilates|crossfit|sport/.test(q))
    return "Class scheduling + member tracking app";
  if (/hotel|resort|hostel|motel|inn/.test(q))
    return "Mobile check-in + concierge app";
  if (/clinic|doctor|dental|dentist|medical|health|pharmacy|physio/.test(q))
    return "Patient appointment + reminder app";
  if (/school|academy|tutor|college|institute|training|education/.test(q))
    return "Student portal + progress tracking app";
  if (/property|real estate|realty|estate agent|realtor/.test(q))
    return "Tenant portal + maintenance requests app";
  if (/shop|store|retail|boutique|market|mall/.test(q))
    return "E-commerce + loyalty + push offers app";
  return "Custom mobile app — booking, loyalty, push notifications";
}
