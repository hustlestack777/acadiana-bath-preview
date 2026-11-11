import { Pool } from "pg";
import { Resend } from "resend";
import { validateDetails, validateExtras, validateStreet, validateZip } from "./estimate";
import { checkCity } from "./coverage";
import { buildCustomerConfirmation } from "./customer-email";
import { buildLeadEmail } from "./lead-email";
import {
  isTeamTestLead,
  leadNotificationRoute,
  withTestSubject,
} from "./lead-notify";
import { fetchStreetViewImage, resolveHouseMapLinks } from "./street-view";
import { fullAddress } from "./lead-display";
import { sanitizeAttribution } from "./lead-attribution";

// Photos are resized in the browser (about 1600 px JPEG, usually 200-600 KB).
// 8 x 2 MB worst case stays well under Resend's 40 MB email limit after base64,
// and keeps the free Postgres (1 GB) from filling with large blobs.
export const MAX_PHOTOS = 8;
export const MAX_PHOTO_BYTES = 2 * 1024 * 1024;
export const MAX_TOTAL_PHOTO_BYTES = 12 * 1024 * 1024;
const RATE_LIMIT = 5;

export type LeadPhoto = {
  filename: string;
  contentType: string;
  bytes: Buffer;
};

export type LeadInput = {
  sourcePage: string;
  street: string;
  latitude: number | null;
  longitude: number | null;
  city: string;
  zip: string;
  project: string;
  notSure: boolean;
  width: string;
  depth: string;
  height: string;
  measurements: string;
  finish: string;
  features: string;
  name: string;
  phone: string;
  email: string;
  preferred: string;
  marketing: boolean;
  timing: string;
  budget: string;
  homeowner: string;
  payment: string;
  consent: boolean;
  consentAt?: Date | null;
  consentText?: string;
  preferredCallTime: string;
  formPage?: string;
  landingPage?: string;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  photos: LeadPhoto[];
};

export type LeadExtras = {
  width: string;
  depth: string;
  height: string;
  measurements: string;
  preferredCallTime: string;
  photos: LeadPhoto[];
};

let pool: Pool | null = null;
let schemaReady: Promise<void> | null = null;

export function databaseConfigured() {
  return Boolean(process.env.DATABASE_URL);
}

export function getPool() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) return null;
  if (!pool) {
    const needsSsl = /sslmode=require|\.render\.com/i.test(connectionString);
    pool = new Pool({
      connectionString,
      ssl: needsSsl ? { rejectUnauthorized: false } : undefined,
      max: 3,
    });
  }
  return pool;
}

async function ensureSchema(db: Pool) {
  if (!schemaReady) {
    schemaReady = db
      .query(`
        CREATE TABLE IF NOT EXISTS leads (
          id uuid PRIMARY KEY,
          created_at timestamptz NOT NULL DEFAULT now(),
          source_page text NOT NULL,
          name text NOT NULL,
          phone text NOT NULL DEFAULT '',
          email text NOT NULL DEFAULT '',
          preferred text NOT NULL,
          city text NOT NULL,
          zip text NOT NULL DEFAULT '',
          project text NOT NULL,
          not_sure boolean NOT NULL,
          width text NOT NULL DEFAULT '',
          depth text NOT NULL DEFAULT '',
          finish text NOT NULL,
          features text NOT NULL DEFAULT '',
          timing text NOT NULL,
          budget text NOT NULL DEFAULT '',
          marketing boolean NOT NULL,
          ip text NOT NULL DEFAULT '',
          email_status text NOT NULL,
          email_error text NOT NULL DEFAULT ''
        );
        CREATE TABLE IF NOT EXISTS lead_photos (
          id uuid PRIMARY KEY,
          lead_id uuid NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
          filename text NOT NULL,
          content_type text NOT NULL,
          bytes bytea NOT NULL
        );
        ALTER TABLE leads ADD COLUMN IF NOT EXISTS height text NOT NULL DEFAULT '';
        ALTER TABLE leads ADD COLUMN IF NOT EXISTS measurements text NOT NULL DEFAULT '';
        ALTER TABLE leads ADD COLUMN IF NOT EXISTS homeowner text NOT NULL DEFAULT '';
        ALTER TABLE leads ADD COLUMN IF NOT EXISTS payment text NOT NULL DEFAULT '';
        ALTER TABLE leads ADD COLUMN IF NOT EXISTS consent boolean NOT NULL DEFAULT false;
        ALTER TABLE leads ADD COLUMN IF NOT EXISTS preferred_call_time text NOT NULL DEFAULT '';
        ALTER TABLE leads ADD COLUMN IF NOT EXISTS street text NOT NULL DEFAULT '';
        ALTER TABLE leads ADD COLUMN IF NOT EXISTS latitude double precision;
        ALTER TABLE leads ADD COLUMN IF NOT EXISTS longitude double precision;
        ALTER TABLE leads ADD COLUMN IF NOT EXISTS consent_at timestamptz;
        ALTER TABLE leads ADD COLUMN IF NOT EXISTS consent_text text NOT NULL DEFAULT '';
        ALTER TABLE leads ADD COLUMN IF NOT EXISTS form_page text NOT NULL DEFAULT '';
        ALTER TABLE leads ADD COLUMN IF NOT EXISTS landing_page text NOT NULL DEFAULT '';
        ALTER TABLE leads ADD COLUMN IF NOT EXISTS referrer text NOT NULL DEFAULT '';
        ALTER TABLE leads ADD COLUMN IF NOT EXISTS utm_source text NOT NULL DEFAULT '';
        ALTER TABLE leads ADD COLUMN IF NOT EXISTS utm_medium text NOT NULL DEFAULT '';
        ALTER TABLE leads ADD COLUMN IF NOT EXISTS utm_campaign text NOT NULL DEFAULT '';
        ALTER TABLE lead_photos ADD COLUMN IF NOT EXISTS size_bytes integer NOT NULL DEFAULT 0;
      `)
      .then(() => undefined)
      .catch((error) => {
        schemaReady = null;
        throw error;
      });
  }
  await schemaReady;
}

export function validateLead(input: LeadInput) {
  const errors = validateDetails(input);
  const streetError = validateStreet(input.street);
  if (streetError) errors.street = streetError;
  const zipError = validateZip(input.zip);
  if (zipError) errors.zip = zipError;
  const coverage = checkCity(input.city);
  if (coverage.status === "empty") errors.city = "Enter your town or ZIP.";
  if (coverage.status === "invalid") errors.city = "Keep the town under 80 characters.";
  const attr = sanitizeAttribution({
    sourcePage: input.sourcePage,
    formPage: input.formPage,
    landingPage: input.landingPage,
    referrer: input.referrer,
    utmSource: input.utmSource,
    utmMedium: input.utmMedium,
    utmCampaign: input.utmCampaign,
  }, input.sourcePage || "/estimate");
  if (!attr.sourcePage) {
    errors.sourcePage = "Unknown source page.";
  }
  // Design My Bathroom asks only name, phone, address and email; own/rent is optional there.
  // SMS consent is optional there too (the design is still emailed and Justin may call back about the request).
  if (input.sourcePage === "/design") {
    if (!input.homeowner) delete errors.homeowner;
    delete errors.consent;
  }
  if (input.sourcePage === "/windows") {
    delete errors.project;
    delete errors.payment;
    delete errors.timing;
    delete errors.finish;
    delete errors.features;
    delete errors.measurements;
    if (!input.homeowner) delete errors.homeowner;
    if (!input.email.trim()) errors.email = "Enter a valid email.";
    if (!input.consent) errors.consent = "Please check the box to continue.";
  }
  if (input.photos.length > MAX_PHOTOS) {
    errors.photos = `Send up to ${MAX_PHOTOS} photos.`;
  }
  if (input.photos.some((photo) => photo.bytes.length > MAX_PHOTO_BYTES)) {
    errors.photos = "Each photo must be 2 MB or smaller.";
  }
  if (input.photos.reduce((sum, photo) => sum + photo.bytes.length, 0) > MAX_TOTAL_PHOTO_BYTES) {
    errors.photos = "The photos are too large together. Remove one or two and try again.";
  }
  if (input.photos.some((photo) => !/^image\/(jpeg|png|webp|gif)$/.test(photo.contentType))) {
    errors.photos = "Use JPEG, PNG, WebP, or GIF photos.";
  }
  return { errors, town: coverage.status === "supported" ? coverage.name : "" };
}

export type LeadNotifyOptions = {
  /** @deprecated Routing is handled by leadNotificationRoute. Ignored for test leads. */
  recipients?: string[];
  subject?: string;
  /** Header-based QA flag. Team test mode also trips on a 555 phone or Grok Bot inbox. */
  test?: boolean;
};

export async function saveLead(input: LeadInput, ip: string, options: LeadNotifyOptions = {}) {
  const db = getPool();
  if (!db) {
    return { ok: false as const, status: 503, error: "Lead storage is not configured. DATABASE_URL is missing." };
  }
  await ensureSchema(db);
  const testLead = isTeamTestLead(input.phone, input.email) || Boolean(options.test);
  // Real leads stay at 5/hour per IP. Team test leads (555 / Grok Bot inbox) are not
  // counted in that cap so QA can run without being locked out, and they never email Justin.
  if (!testLead) {
    const recent = await db.query<{ count: string }>(
      `SELECT count(*)::text AS count FROM leads WHERE ip = $1 AND created_at > now() - interval '1 hour'`,
      [ip || "unknown"],
    );
    if (Number(recent.rows[0]?.count ?? 0) >= RATE_LIMIT) {
      return { ok: false as const, status: 429, error: "Too many requests from this network. Please wait and try again." };
    }
  }

  const id = crypto.randomUUID();
  const createdAt = new Date();
  const attr = sanitizeAttribution({
    sourcePage: input.sourcePage,
    formPage: input.formPage,
    landingPage: input.landingPage,
    referrer: input.referrer,
    utmSource: input.utmSource,
    utmMedium: input.utmMedium,
    utmCampaign: input.utmCampaign,
  }, input.sourcePage || "/estimate");
  const stored = { ...input, ...attr };
  const client = await db.connect();
  try {
    await client.query("BEGIN");
    await client.query(
      `INSERT INTO leads (
        id, created_at, source_page, name, phone, email, preferred, city, zip, project,
        not_sure, width, depth, finish, features, timing, budget, marketing, ip, email_status,
        height, measurements, homeowner, payment, consent, preferred_call_time,
        street, latitude, longitude, consent_at, consent_text,
        form_page, landing_page, referrer, utm_source, utm_medium, utm_campaign
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,'pending',$20,$21,$22,$23,$24,$25,$26,$27,$28,$29,$30,$31,$32,$33,$34,$35,$36
      )`,
      [
        id,
        createdAt.toISOString(),
        stored.sourcePage,
        input.name.trim(),
        input.phone.trim(),
        input.email.trim(),
        input.preferred,
        input.city.trim(),
        input.zip.trim(),
        input.project,
        input.notSure,
        input.width.trim(),
        input.depth.trim(),
        input.finish || "unsure",
        input.features.trim(),
        input.timing,
        input.budget.trim(),
        input.marketing,
        ip || "unknown",
        input.height.trim(),
        input.measurements.trim(),
        input.homeowner,
        input.payment,
        input.consent,
        input.preferredCallTime.trim(),
        input.street.trim(),
        input.latitude,
        input.longitude,
        input.consentAt ? new Date(input.consentAt).toISOString() : input.consent ? new Date().toISOString() : null,
        (input.consentText || "").trim(),
        stored.formPage,
        stored.landingPage,
        stored.referrer,
        stored.utmSource,
        stored.utmMedium,
        stored.utmCampaign,
      ],
    );
    for (const photo of input.photos) {
      await client.query(
        `INSERT INTO lead_photos (id, lead_id, filename, content_type, bytes, size_bytes) VALUES ($1,$2,$3,$4,$5,$6)`,
        [crypto.randomUUID(), id, photo.filename, photo.contentType, photo.bytes, photo.bytes.length],
      );
    }
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }

  const notification = await notifyLead(id, createdAt, stored, options);
  await db.query(`UPDATE leads SET email_status = $2, email_error = $3 WHERE id = $1`, [
    id,
    notification.sent ? "sent" : "failed",
    notification.error ?? "",
  ]);
  return {
    ok: true as const,
    status: 200,
    id,
    emailSent: notification.sent,
    emailError: notification.error,
  };
}

export async function updateLeadExtras(id: string, extras: LeadExtras) {
  const db = getPool();
  if (!db) {
    return { ok: false as const, status: 503, error: "Lead storage is not configured. DATABASE_URL is missing." };
  }
  if (!/^[0-9a-f-]{36}$/i.test(id)) {
    return { ok: false as const, status: 400, error: "Unknown request." };
  }

  await ensureSchema(db);
  const existing = await db.query<{
    id: string;
    name: string;
    city: string;
    zip: string;
    street: string;
    latitude: number | null;
    longitude: number | null;
    phone: string;
    email: string;
    project: string;
    homeowner: string;
    payment: string;
    timing: string;
    features: string;
    budget: string;
    photo_count: string;
  }>(
    `SELECT l.id, l.name, l.city, l.zip, l.street, l.latitude, l.longitude, l.phone, l.email, l.project,
            l.homeowner, l.payment, l.timing, l.features, l.budget,
            (SELECT count(*)::text FROM lead_photos p WHERE p.lead_id = l.id) AS photo_count
     FROM leads l WHERE l.id = $1`,
    [id],
  );
  const row = existing.rows[0];
  if (!row) {
    return { ok: false as const, status: 404, error: "That request was not found." };
  }

  const fieldErrors = validateExtras(extras);
  if (Object.keys(fieldErrors).length) {
    return { ok: false as const, status: 400, error: "Check the highlighted fields.", errors: fieldErrors };
  }

  const already = Number(row.photo_count ?? 0);
  if (already + extras.photos.length > MAX_PHOTOS) {
    return {
      ok: false as const,
      status: 400,
      error: `You can add up to ${MAX_PHOTOS} photos total. This request already has ${already}.`,
    };
  }
  if (extras.photos.some((photo) => photo.bytes.length > MAX_PHOTO_BYTES)) {
    return { ok: false as const, status: 400, error: "Each photo must be 2 MB or smaller." };
  }
  if (extras.photos.reduce((sum, photo) => sum + photo.bytes.length, 0) > MAX_TOTAL_PHOTO_BYTES) {
    return { ok: false as const, status: 400, error: "The photos are too large together. Remove one or two and try again." };
  }
  if (extras.photos.some((photo) => !/^image\/(jpeg|png|webp|gif)$/.test(photo.contentType))) {
    return { ok: false as const, status: 400, error: "Use JPEG, PNG, WebP, or GIF photos." };
  }

  const client = await db.connect();
  try {
    await client.query("BEGIN");
    await client.query(
      `UPDATE leads SET
        width = CASE WHEN $2 <> '' THEN $2 ELSE width END,
        depth = CASE WHEN $3 <> '' THEN $3 ELSE depth END,
        height = CASE WHEN $4 <> '' THEN $4 ELSE height END,
        measurements = CASE WHEN $5 <> '' THEN $5 ELSE measurements END,
        preferred_call_time = CASE WHEN $6 <> '' THEN $6 ELSE preferred_call_time END
       WHERE id = $1`,
      [
        id,
        extras.width.trim(),
        extras.depth.trim(),
        extras.height.trim(),
        extras.measurements.trim(),
        extras.preferredCallTime.trim(),
      ],
    );
    for (const photo of extras.photos) {
      await client.query(
        `INSERT INTO lead_photos (id, lead_id, filename, content_type, bytes, size_bytes) VALUES ($1,$2,$3,$4,$5,$6)`,
        [crypto.randomUUID(), id, photo.filename, photo.contentType, photo.bytes, photo.bytes.length],
      );
    }
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }

  const updated = await db.query<{
    width: string;
    depth: string;
    height: string;
    measurements: string;
    preferred_call_time: string;
  }>(`SELECT width, depth, height, measurements, preferred_call_time FROM leads WHERE id = $1`, [id]);
  const current = updated.rows[0];
  const allPhotos = await db.query<{ filename: string; content_type: string; bytes: Buffer }>(
    `SELECT filename, content_type, bytes FROM lead_photos WHERE lead_id = $1 ORDER BY filename`,
    [id],
  );

  const notification = await notifyLeadExtras(id, {
    name: row.name,
    city: row.city,
    zip: row.zip,
    street: row.street,
    latitude: coordinate(row.latitude, -90, 90),
    longitude: coordinate(row.longitude, -180, 180),
    phone: row.phone,
    email: row.email,
    project: row.project,
    homeowner: row.homeowner,
    payment: row.payment,
    timing: row.timing,
    features: row.features,
    budget: row.budget,
    width: current?.width ?? "",
    depth: current?.depth ?? "",
    height: current?.height ?? "",
    measurements: current?.measurements ?? "",
    preferredCallTime: current?.preferred_call_time ?? "",
    photos: allPhotos.rows.map((photo) => ({
      filename: photo.filename,
      contentType: photo.content_type,
      bytes: photo.bytes,
    })),
    newPhotoCount: extras.photos.length,
  });

  return {
    ok: true as const,
    status: 200,
    id,
    emailSent: notification.sent,
    emailError: notification.error,
    photoCount: allPhotos.rows.length,
  };
}

export const DEFAULT_LEAD_NOTIFY_EMAIL = "acadianabathandcounter@gmail.com,shaun.brasher@gmail.com,shaun@lagniapperealmlabs.com";

/** Comma-separated LEAD_NOTIFY_EMAIL, trimmed. Empty pieces are dropped. */
export function leadNotifyRecipients(raw = process.env.LEAD_NOTIFY_EMAIL || DEFAULT_LEAD_NOTIFY_EMAIL) {
  const recipients = raw
    .split(",")
    .map((address) => address.trim())
    .filter(Boolean);
  if (recipients.length) return recipients;
  return DEFAULT_LEAD_NOTIFY_EMAIL.split(",").map((address) => address.trim());
}

function coordinate(value: unknown, min: number, max: number) {
  if (value == null || value === "") return null;
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < min || parsed > max) return null;
  return parsed;
}

async function housePreview(input: { street: string; city: string; zip: string; latitude: number | null; longitude: number | null }) {
  const address = fullAddress(input.street, input.city, input.zip);
  if (!input.street.trim() || !address) return null;
  return fetchStreetViewImage({ address, lat: input.latitude, lon: input.longitude });
}

async function sendWithRetry<T extends { error?: unknown }>(
  label: string,
  send: () => Promise<T>,
): Promise<T> {
  const first = await send();
  if (!first.error) return first;
  console.error(`${label} failed, retrying once`, first.error);
  const second = await send();
  if (second.error) console.error(`${label} retry failed`, second.error);
  return second;
}

async function notifyLead(id: string, createdAt: Date, input: LeadInput, options: LeadNotifyOptions = {}) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;
  const route = leadNotificationRoute({
    phone: input.phone,
    email: input.email,
    notifyList: leadNotifyRecipients(),
    forceTest: options.test,
  });
  const to = route.to;
  const cc = route.cc;
  if (!apiKey) return { sent: false, error: "RESEND_API_KEY is not set." };
  if (!from) return { sent: false, error: "RESEND_FROM is not set." };

  const address = fullAddress(input.street, input.city, input.zip);
  // Geocode only for the email/links. A timeout or failure must not block or fail the lead.
  const mapLinks = await resolveHouseMapLinks(address, input.latitude, input.longitude);
  const houseImage = await housePreview({
    ...input,
    latitude: mapLinks.latitude,
    longitude: mapLinks.longitude,
  });
  const message = buildLeadEmail({
    kind: "new",
    id,
    createdAt,
    name: input.name,
    phone: input.phone,
    email: input.email,
    street: input.street,
    city: input.city,
    zip: input.zip,
    latitude: mapLinks.latitude,
    longitude: mapLinks.longitude,
    project: input.project,
    width: input.width,
    depth: input.depth,
    height: input.height,
    measurements: input.measurements,
    features: input.features,
    budget: input.budget,
    homeowner: input.homeowner,
    payment: input.payment,
    timing: input.timing,
    preferredCallTime: input.preferredCallTime,
    photos: input.photos,
    houseImage,
    consent: input.consent,
    consentAt: input.consentAt ?? (input.consent ? createdAt : null),
    consentText: input.consentText || "",
    test: route.test,
    sourcePage: input.sourcePage,
    formPage: input.formPage || "",
    referrer: input.referrer || "",
    utmSource: input.utmSource || "",
    utmMedium: input.utmMedium || "",
    utmCampaign: input.utmCampaign || "",
  });
  const resend = new Resend(apiKey);
  const subject = withTestSubject(options.subject || message.subject, route.test);
  const { error } = await sendWithRetry("lead email", () =>
    resend.emails.send(
      {
        from,
        to,
        cc: cc.length ? cc : undefined,
        subject,
        text: message.text,
        html: message.html,
        attachments: message.attachments,
      },
      { idempotencyKey: `lead/${id}` },
    ),
  );
  if (error) return { sent: false, error: error.message };

  const customer = input.email.trim();
  if (customer) {
    const confirmation = buildCustomerConfirmation({
      name: input.name,
      sourcePage: input.sourcePage,
      photos: input.photos,
      test: route.test,
    });
    const confirmResult = await sendWithRetry("customer confirmation", () =>
      resend.emails.send(
        {
          from,
          to: [customer],
          subject: confirmation.subject,
          text: confirmation.text,
          html: confirmation.html,
          attachments: confirmation.attachments,
        },
        { idempotencyKey: `lead-confirm/${id}` },
      ),
    );
    if (confirmResult.error) {
      console.error("customer confirmation failed", confirmResult.error.message);
      return { sent: true as const, error: undefined, customerEmailSent: false, customerEmailError: confirmResult.error.message };
    }
  }
  return { sent: true as const, error: undefined, customerEmailSent: Boolean(customer) };
}

async function notifyLeadExtras(
  id: string,
  input: {
    name: string;
    city: string;
    zip: string;
    street: string;
    latitude: number | null;
    longitude: number | null;
    phone: string;
    email: string;
    project: string;
    homeowner: string;
    payment: string;
    timing: string;
    features: string;
    budget: string;
    width: string;
    depth: string;
    height: string;
    measurements: string;
    preferredCallTime: string;
    photos: LeadPhoto[];
    newPhotoCount: number;
  },
) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;
  const route = leadNotificationRoute({
    phone: input.phone,
    email: input.email,
    notifyList: leadNotifyRecipients(),
  });
  const to = route.to;
  const cc = route.cc;
  if (!apiKey) return { sent: false, error: "RESEND_API_KEY is not set." };
  if (!from) return { sent: false, error: "RESEND_FROM is not set." };

  const address = fullAddress(input.street, input.city, input.zip);
  const mapLinks = await resolveHouseMapLinks(address, input.latitude, input.longitude);
  const houseImage = await housePreview({
    ...input,
    latitude: mapLinks.latitude,
    longitude: mapLinks.longitude,
  });
  const message = buildLeadEmail({
    kind: "update",
    id,
    createdAt: new Date(),
    name: input.name,
    phone: input.phone,
    email: input.email,
    street: input.street,
    city: input.city,
    zip: input.zip,
    latitude: mapLinks.latitude,
    longitude: mapLinks.longitude,
    project: input.project,
    width: input.width,
    depth: input.depth,
    height: input.height,
    measurements: input.measurements,
    features: input.features,
    budget: input.budget,
    homeowner: input.homeowner,
    payment: input.payment,
    timing: input.timing,
    preferredCallTime: input.preferredCallTime,
    photos: input.photos,
    newPhotoCount: input.newPhotoCount,
    houseImage,
    test: route.test,
  });
  const resend = new Resend(apiKey);
  const { error } = await sendWithRetry("lead update email", () =>
    resend.emails.send(
      {
        from,
        to,
        cc: cc.length ? cc : undefined,
        subject: withTestSubject(message.subject, route.test),
        text: message.text,
        html: message.html,
        attachments: message.attachments,
      },
      { idempotencyKey: `lead-extras/${id}/${Date.now()}` },
    ),
  );
  if (error) return { sent: false, error: error.message };
  return { sent: true as const, error: undefined };
}
