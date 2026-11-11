# Acadiana Bathrooms and Countertops

Marketing site and project review for Acadiana Bathrooms and Countertops. The design is the Maison Acadiana palette: cream, terracotta, and aubergine. Search engines are asked not to index it.

## Run it

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://127.0.0.1:4317](http://127.0.0.1:4317). The project review is at [http://127.0.0.1:4317/estimate](http://127.0.0.1:4317/estimate).

```bash
npm test
npm run build
npm start
```

## Leads

The review form validates the fields, rejects a filled honeypot, and rate-limits by IP. It stores the lead, including the street address and photos, when `DATABASE_URL` is set. It emails Justin at `acadianabathandcounter@gmail.com`, plus Shaun at the addresses listed in `LEAD_NOTIFY_EMAIL`, when both `RESEND_API_KEY` and `RESEND_FROM` are set. The customer is not emailed.

`LEAD_NOTIFY_EMAIL` defaults to `acadianabathandcounter@gmail.com,shaun.brasher@gmail.com,shaun@lagniapperealmlabs.com`. A comma-separated list is split, trimmed, and every address receives the lead email. `RESEND_FROM` must be an address on a domain verified in Resend. If email is not configured, the lead can still be stored and the response says the notification was not sent. The page does not claim success when storage fails.

The notification is a phone-readable card: name, call and email buttons, street address, project, size, home, timing, payment, and notes that were actually filled in. A name that starts with `TEST` keeps the `[TEST]` subject prefix. Times are America/Chicago. Photos are shown in the email and also attached as files. The public thank-you page does not show the street address or a house photo.

Street suggestions use ArcGIS World Geocoding, then Photon, then Nominatim. No Google Places key. If `GOOGLE_MAPS_API_KEY` is set (Street View Static API; also read from `GOOGLE_MAPS_KEY`, `GOOGLE_STREET_VIEW_API_KEY`, `GOOGLE_STREETVIEW_API_KEY`, or `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` when one of those is already present), the lead email embeds a Street View snapshot. Without a key, the email links to Street View when a pin was saved, otherwise to Google Maps. The image is never scraped.

Customers can add up to 8 photos (camera or library). The browser resizes each one to about 1600 px JPEG before upload. Photos are stored in the `lead_photos` table (2 MB per photo, 12 MB per lead cap). Width, depth, and height are optional, with a free-text measurements note. AI dimension estimates from photos are a TODO, not built.

Every Free Consult button links to `/estimate#start`. The form scrolls fully into view under the fixed header and focuses the first field.

The home hero is a looping muted background video in `public/video`. Shot sources are listed in `docs/video-sources.md`.

Photographs in `public/images` are used with permission. Sources are listed in `docs/image-sources.md`.

## Render

`render.yaml` describes a free web service in Virginia and the free `acadiana-leads` Postgres database. Do not point a custom domain at this preview.
