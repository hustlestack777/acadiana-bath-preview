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

The review form validates the fields, rejects a filled honeypot, and rate-limits by IP. It stores the lead, including photos, when `DATABASE_URL` is set. It emails every field, the timestamp, and the source page when both `RESEND_API_KEY` and `RESEND_FROM` are set.

`LEAD_NOTIFY_EMAIL` defaults to `shaun.brasher@gmail.com,shaun@lagniapperealmlabs.com`. A comma-separated list is split, trimmed, and every address receives the lead email. `RESEND_FROM` must be an address on a domain verified in Resend. If email is not configured, the lead can still be stored and the response says the notification was not sent. The page does not claim success when storage fails.

Photographs in `public/images` are Onyx Collection product and gallery files. Sources are listed in `public/images/SOURCES.md`. They are not completed jobs by this business.

## Render

`render.yaml` describes a free web service in Virginia and the free `acadiana-leads` Postgres database. Do not point a custom domain at this preview.
