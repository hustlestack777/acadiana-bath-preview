import { Pool } from "pg";
import { Resend } from "resend";
import { validateDetails, validateZip } from "./estimate";
import { checkCity } from "./coverage";

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
  photos: LeadPhoto[];
};

let pool: Pool | null = null;
let schemaReady: Promise<void> | null = null;

export function databaseConfigured() {
  return Boolean(process.env.DATABASE_URL);
}

function getPool() {
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

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => {
    const map: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return map[character] ?? character;
  });
}

export function validateLead(input: LeadInput) {
  const errors = validateDetails(input);
  const zipError = validateZip(input.zip);
  if (zipError) errors.zip = zipError;
  const coverage = checkCity(input.city);
  if (coverage.status === "empty") errors.city = "Enter the city first.";
  if (coverage.status === "unknown") {
    errors.city = "Enter one planned city. ZIP codes are not used to approve a town.";
  }
  if (coverage.status === "excluded") {
    errors.city = `${coverage.name} is outside the planned coverage.`;
  }
  if (input.sourcePage !== "/" && input.sourcePage !== "/estimate") {
    errors.sourcePage = "Unknown source page.";
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

export async function saveLead(input: LeadInput, ip: string) {
  const db = getPool();
  if (!db) {
    return { ok: false as const, status: 503, error: "Lead storage is not configured. DATABASE_URL is missing." };
  }
  await ensureSchema(db);
  const recent = await db.query<{ count: string }>(
    `SELECT count(*)::text AS count FROM leads WHERE ip = $1 AND created_at > now() - interval '1 hour'`,
    [ip || "unknown"],
  );
  if (Number(recent.rows[0]?.count ?? 0) >= RATE_LIMIT) {
    return { ok: false as const, status: 429, error: "Too many requests from this network. Please wait and try again." };
  }

  const id = crypto.randomUUID();
  const createdAt = new Date();
  const client = await db.connect();
  try {
    await client.query("BEGIN");
    await client.query(
      `INSERT INTO leads (
        id, created_at, source_page, name, phone, email, preferred, city, zip, project,
        not_sure, width, depth, finish, features, timing, budget, marketing, ip, email_status,
        height, measurements
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,'pending',$20,$21
      )`,
      [
        id,
        createdAt.toISOString(),
        input.sourcePage,
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
        input.finish,
        input.features.trim(),
        input.timing,
        input.budget.trim(),
        input.marketing,
        ip || "unknown",
        input.height.trim(),
        input.measurements.trim(),
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

  const notification = await notifyLead(id, createdAt, input);
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

export const DEFAULT_LEAD_NOTIFY_EMAIL = "shaun.brasher@gmail.com,shaun@lagniapperealmlabs.com";

/** Comma-separated LEAD_NOTIFY_EMAIL, trimmed. Empty pieces are dropped. */
export function leadNotifyRecipients(raw = process.env.LEAD_NOTIFY_EMAIL || DEFAULT_LEAD_NOTIFY_EMAIL) {
  const recipients = raw
    .split(",")
    .map((address) => address.trim())
    .filter(Boolean);
  if (recipients.length) return recipients;
  return DEFAULT_LEAD_NOTIFY_EMAIL.split(",").map((address) => address.trim());
}

function inches(value: string) {
  const trimmed = value.trim();
  return trimmed ? `${trimmed} in (customer estimate)` : "(not given)";
}

async function notifyLead(id: string, createdAt: Date, input: LeadInput) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;
  const to = leadNotifyRecipients();
  if (!apiKey) return { sent: false, error: "RESEND_API_KEY is not set." };
  if (!from) return { sent: false, error: "RESEND_FROM is not set." };

  const lines = [
    `Lead ${id}`,
    `Saved at: ${createdAt.toISOString()}`,
    `Source page: ${input.sourcePage}`,
    `Name: ${input.name.trim()}`,
    `Phone: ${input.phone.trim() || "(none)"}`,
    `Email: ${input.email.trim() || "(none)"}`,
    `Preferred contact: ${input.preferred}`,
    `City: ${input.city.trim()}`,
    `ZIP: ${input.zip.trim() || "(none)"}`,
    `Services: ${input.project}`,
    `Width: ${inches(input.width)}`,
    `Depth: ${inches(input.depth)}`,
    `Height: ${inches(input.height)}`,
    `Measurements / notes: ${input.measurements.trim() || "(none)"}`,
    `Finish direction: ${input.finish}`,
    `Features: ${input.features.trim() || "(none)"}`,
    `Timing: ${input.timing}`,
    `Budget note: ${input.budget.trim() || "(none)"}`,
    `Marketing opt-in: ${input.marketing ? "yes" : "no"}`,
    `Photos: ${input.photos.length}${input.photos.length ? " (attached to this email, also saved with the lead)" : ""}`,
  ];
  const text = lines.join("\n");
  const html = `<pre>${escapeHtml(text)}</pre>`;
  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send(
    {
      from,
      to,
      subject: `${input.name.trim().toUpperCase().startsWith("TEST") ? "[TEST] " : ""}Bathroom lead ${id.slice(0, 8)}: ${input.name.trim()}, ${input.city.trim()}${input.photos.length ? ` (${input.photos.length} photo${input.photos.length === 1 ? "" : "s"})` : ""}`,
      text,
      html,
      attachments: input.photos.map((photo, index) => ({
        filename: `${String(index + 1).padStart(2, "0")}-${photo.filename}`,
        content: photo.bytes.toString("base64"),
        contentType: photo.contentType,
      })),
    },
    { idempotencyKey: `lead/${id}` },
  );
  if (error) return { sent: false, error: error.message };
  return { sent: true as const, error: undefined };
}
