const CATEGORY_LABELS = {
  no_presence: "No Digital Presence",
  app_dev: "App Dev Lead",
  seo_ads: "SEO / Ads Lead",
  social_media: "Social Media Lead",
  reputation: "Reputation Management",
  high_value: "High Value",
  newly_opened: "Newly Opened",
  at_risk: "Closed / At Risk",
};

export function exportToCSV(leads) {
  const headers = [
    "Category",
    "Business Name",
    "Rating",
    "Reviews",
    "Phone",
    "Website",
    "Address",
    "Score",
    "Verdict",
    "Pitch Angle",
    "Maps URL",
  ];

  const rows = leads.map((lead) => [
    CATEGORY_LABELS[lead.category] || lead.category || "",
    `"${(lead.name || "").replace(/"/g, '""')}"`,
    lead.rating || "",
    lead.user_ratings_total || 0,
    lead.formatted_phone_number || "",
    lead.website || "",
    `"${(lead.formatted_address || "").replace(/"/g, '""')}"`,
    lead.score,
    lead.verdict,
    `"${(lead.pitchAngle || "").replace(/"/g, '""')}"`,
    lead.url || "",
  ]);

  const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
