# LeadScraper

A Next.js 14 app that finds business leads using the Google Maps Places API, scores them, and splits them into **App Dev** and **Web Service** categories.

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Setup: Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing)
3. Navigate to **APIs & Services → Library**
4. Enable both:
   - **Places API** (Legacy)
   - **Maps JavaScript API** (optional, for future map view)
5. Go to **APIs & Services → Credentials**
6. Click **Create Credentials → API Key**
7. (Recommended) Restrict the key to your server IP and the Places API
8. Copy the key into `.env.local`:

```
GOOGLE_MAPS_API_KEY=AIza...your_key_here
```

9. Restart the dev server: `npm run dev`

## Example Searches

| Query | What you'll find |
|---|---|
| `restaurants in Gulberg Lahore` | Restaurant leads in Lahore |
| `salons in Dubai` | Beauty salon leads in Dubai |
| `gyms in Karachi` | Fitness center leads |
| `dental clinics in London` | Dental practice leads |
| `hotels in Bangkok` | Hotel/hospitality leads |
| `retail shops in Islamabad` | Retail store leads |
| `real estate agents in Karachi` | Property agency leads |

## Lead Scoring

Each lead is scored 0–100 based on:
- **Review count** (up to +30 points)
- **Rating** (up to +20 points)
- **Has phone number** (+10 points)
- **Has opening hours** (+5 points)
- **Bonus** for high review count + high rating (+10 points)

**Verdict:**
- `STRONG` — High-priority lead, worth pursuing immediately
- `MAYBE` — Moderate potential, worth a follow-up
- `SKIP` — Low priority

## Tabs

- **App Dev Leads** — Businesses WITH a website. Pitch them a mobile app.
- **Web Service Leads** — Businesses WITHOUT a website. Pitch web development.

## Export

Click **Export CSV** to download all leads as a spreadsheet, ready for outreach.

## Tech Stack

- [Next.js 14](https://nextjs.org/) App Router
- [Tailwind CSS](https://tailwindcss.com/) v4
- [shadcn/ui](https://ui.shadcn.com/) components
- Google Maps Places API (Legacy)

# lead-scrapper
