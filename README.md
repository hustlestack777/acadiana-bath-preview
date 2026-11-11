# Acadiana Bathrooms and Countertops

Marketing site and project review for Acadiana Bathrooms and Countertops. The design is the Live Oak palette: warm cream and forest pine. Search engines are asked not to index it.

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

The review form validates the fields, rejects a filled honeypot, and rate-limits by IP. It stores the lead, including the street address and photos, when `DATABASE_URL` is set. When both `RESEND_API_KEY` and `RESEND_FROM` are set, it emails Justin at `acadianabathandcounter@gmail.com` and CCs Shaun at `shaun.brasher@gmail.com` (plus any other non-Justin addresses in `LEAD_NOTIFY_EMAIL`). If the customer left an email, they also get a short confirmation that Justin will call soon, signed Acadiana Bathrooms and Countertops, (337) 522-0023. Design confirmations can include the before-and-after. Confirmations never promise a timeline or deposit, and they don't claim licensed or insured or name a product brand.

`LEAD_NOTIFY_EMAIL` defaults to `acadianabathandcounter@gmail.com,shaun.brasher@gmail.com,shaun@lagniapperealmlabs.com`. Justin is always the To address on a real lead; the other listed addresses are CC'd. `RESEND_FROM` must be an address on a domain verified in Resend. If email is not configured, the lead can still be stored and the response says the notification was not sent. The page does not claim success when storage fails.

The notification is a phone-readable card: source page (and form page if different), referrer and UTM campaign when present, name, call and email buttons, street address, project, size, home, timing, payment, and notes that were actually filled in. Times are America/Chicago. Photos are shown in the email and also attached as files. The public thank-you page does not show the street address or a house photo.

### Team test mode

A lead is treated as a test when the phone uses a 555 exchange (for example `337-555-xxxx`) or the email is at a Grok Bot inbox domain (`mail.grokbot.com` or `grokbot.com`). For those leads:

- every email subject is prefixed with `[TEST]`
- Justin's copy goes to Shaun at `shaun.brasher@gmail.com` only, never to Justin
- the customer confirmation still goes to the email they entered
- nobody is texted
- the usual 5-leads-per-hour cap does not apply, so the team can keep testing

Use a 555 number (and a Grok Bot inbox if you want to see the confirmation) so fake team leads never reach Justin. A name that starts with `TEST` still gets the `[TEST]` subject prefix, but only the 555 number or Grok Bot inbox reroutes the mail.

Every submission is written to the Render Postgres database `acadiana-leads` (table `leads`, photos in `lead_photos`, design sessions in `design_sessions`) before any email is sent. If email fails, the server logs it and retries once; the customer still sees success. There is no admin UI yet — Shaun can view leads in the emails and in the `acadiana-leads` Postgres instance on Render.

Each stored lead includes the source page path (for example `/custom-tile`, `/design`, `/serving-houma`, `/windows`), the first landing page, the document referrer, and `utm_source` / `utm_medium` / `utm_campaign` when those are present. A Free Consult click from a town or product page stashes that path so a lead submitted on `/estimate` still records where they came from. Those fields are also printed on Justin's and Shaun's lead email.

Street suggestions use the same keyless stack as firewood.delivery checkout: ArcGIS World Geocoding, then Photon, biased to Louisiana. Nominatim is not used for autocomplete (its usage policy bans that). No Google Places key. Suggestions only run while the customer is typing, so browser autofill is not overwritten. If `GOOGLE_MAPS_API_KEY` is set (Street View Static API; also read from `GOOGLE_MAPS_KEY`, `GOOGLE_STREET_VIEW_API_KEY`, `GOOGLE_STREETVIEW_API_KEY`, or `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` when one of those is already present), the lead email embeds a Street View snapshot. Without a key, the email still includes a one-tap Street View link: the server geocodes the address once with OpenStreetMap Nominatim (no Google key, 4s timeout) and links to `map_action=pano`. If geocoding fails, that link falls back to a Google Maps search of the address. A plain Open in Google Maps link is always included. Geocoding never blocks or fails the lead. The image is never scraped.

Customers can add up to 8 photos (camera or library). The browser resizes each one to about 1600 px JPEG before upload. Photos are stored in the `lead_photos` table (2 MB per photo, 12 MB per lead cap). Width, depth, and height are optional, with a free-text measurements note. AI dimension estimates from photos are a TODO, not built.

Every Free Consult button links to `/estimate#start`. The form scrolls fully into view under the fixed header and focuses the first field.

The home hero is a looping muted background video in `public/video`. Shot sources are listed in `docs/video-sources.md`.

Photographs in `public/images` are used with permission. Sources are listed in `docs/image-sources.md`.


## Search indexing (go-live)

The preview stays out of search indexes until Shaun says go-live.

`SITE_INDEXABLE` defaults to unset or `false`. While it is not exactly `true`:

- Every public page sends `noindex, nofollow`
- `robots.txt` is `User-agent: *` / `Disallow: /`
- `/sitemap.xml` is generated but not advertised in `robots.txt`

AI-search and SEO groundwork is already in the build:

- JSON-LD `HomeAndConstructionBusiness` on every page (service-area business, no street address)
- `Service` schema on `/solid-surface` and `/custom-tile`
- `FAQPage` schema only where a visible FAQ is rendered (`FaqSection`)
- `/llms.txt` and a dynamic `/sitemap.xml`
- Town pages can be added in `lib/towns.ts` and use the `/areas/[slug]` template

To go live, only after Shaun OKs it:

1. Set `SITE_INDEXABLE` to `true` on the Render service `srv-dboqbjnf3r2c73c0d0n0` (and in `render.yaml` if you want the blueprint to match).
2. Redeploy so metadata, `robots.txt` and HTML are rebuilt.
3. Confirm `https://acadiana-bathrooms.onrender.com/robots.txt` allows crawlers, lists `/sitemap.xml`, and that the home page no longer has `noindex`.

`/windows` stays noindex with the rest of the preview, then is allowed and indexable at go-live like the other public pages. It is not listed in the sitemap. `/api/` stays disallowed.

Optional: `SITE_URL` overrides the canonical origin. It defaults to `https://acadiana-bathrooms.onrender.com`.

## Render

`render.yaml` describes a free web service in Virginia and the free `acadiana-leads` Postgres database. Do not point a custom domain at this preview.
