import { createHash, randomBytes } from "node:crypto";
import type { Pool } from "pg";
import { getPool } from "./leads";

/** Caps from the PRD: 2 looks per phone/device, 3 renders per IP per day, about 125 renders (DESIGN_DAILY_USD_CAP) per day overall. */
export const LOOKS_PER_PERSON = Number(process.env.DESIGN_LOOKS_PER_PERSON || 2);
export const RENDERS_PER_IP_PER_DAY = Number(process.env.DESIGN_IP_DAILY_CAP || 3);
export const DAILY_RENDER_CAP = Number(process.env.DESIGN_DAILY_RENDER_CAP || 125);
export const DAILY_USD_CAP = Number(process.env.DESIGN_DAILY_USD_CAP || 10);

let ready: Promise<void> | null = null;

export function designDb() {
  return getPool();
}

export async function ensureDesignSchema(db: Pool) {
  if (!ready) {
    ready = db
      .query(`
        CREATE TABLE IF NOT EXISTS design_sessions (
          id uuid PRIMARY KEY,
          created_at timestamptz NOT NULL DEFAULT now(),
          ip_hash text NOT NULL,
          device_id text NOT NULL DEFAULT '',
          style_key text NOT NULL,
          model text NOT NULL DEFAULT '',
          cost_usd numeric(10,4) NOT NULL DEFAULT 0,
          latency_ms integer NOT NULL DEFAULT 0,
          status text NOT NULL,
          error text NOT NULL DEFAULT '',
          is_test boolean NOT NULL DEFAULT false,
          before bytea,
          extra bytea,
          after bytea,
          lead_id uuid,
          phone_digits text NOT NULL DEFAULT '',
          unlock_token text NOT NULL DEFAULT '',
          unlocked_at timestamptz
        );
        ALTER TABLE design_sessions ADD COLUMN IF NOT EXISTS budget text NOT NULL DEFAULT '';
        CREATE INDEX IF NOT EXISTS design_sessions_created_idx ON design_sessions (created_at);
        CREATE INDEX IF NOT EXISTS design_sessions_ip_idx ON design_sessions (ip_hash, created_at);
        CREATE INDEX IF NOT EXISTS design_sessions_phone_idx ON design_sessions (phone_digits);
      `)
      .then(() => undefined)
      .catch((error) => {
        ready = null;
        throw error;
      });
  }
  await ready;
}

export function hashIp(ip: string) {
  return createHash("sha256")
    .update(`${process.env.DESIGN_SALT || "acadiana-design"}:${ip || "unknown"}`)
    .digest("hex")
    .slice(0, 32);
}

export function newToken() {
  return randomBytes(24).toString("hex");
}

const CT_MIDNIGHT = `(date_trunc('day', now() AT TIME ZONE 'America/Chicago') AT TIME ZONE 'America/Chicago')`;

export type LimitCheck =
  | { ok: true }
  | { ok: false; code: "busy" | "ip" | "person"; message: string };

export async function checkLimits(
  db: Pool,
  input: { ipHash: string; deviceId: string; phoneDigits: string; skipIp: boolean },
): Promise<LimitCheck> {
  const today = await db.query<{ count: string; cost: string }>(
    `SELECT count(*)::text AS count, coalesce(sum(cost_usd),0)::text AS cost
       FROM design_sessions WHERE created_at >= ${CT_MIDNIGHT} AND status <> 'blocked'`,
  );
  const count = Number(today.rows[0]?.count ?? 0);
  const cost = Number(today.rows[0]?.cost ?? 0);
  if (count >= DAILY_RENDER_CAP || cost >= DAILY_USD_CAP) {
    return {
      ok: false,
      code: "busy",
      message: "Our designer is booked up for today. Leave your info with a free consult request and we'll follow up.",
    };
  }
  if (!input.skipIp) {
    const ip = await db.query<{ count: string }>(
      `SELECT count(*)::text AS count FROM design_sessions
        WHERE ip_hash = $1 AND created_at > now() - interval '24 hours' AND status IN ('rendering','done')`,
      [input.ipHash],
    );
    if (Number(ip.rows[0]?.count ?? 0) >= RENDERS_PER_IP_PER_DAY) {
      return { ok: false, code: "ip", message: "You've used today's free designs from this network. Try again tomorrow." };
    }
  }
  const person = await db.query<{ count: string }>(
    `SELECT count(*)::text AS count FROM design_sessions
      WHERE status = 'done' AND is_test = false
        AND ((device_id <> '' AND device_id = $1) OR ($2 <> '' AND phone_digits = $2))`,
    [input.deviceId, input.phoneDigits],
  );
  if (!input.skipIp && Number(person.rows[0]?.count ?? 0) >= LOOKS_PER_PERSON) {
    return {
      ok: false,
      code: "person",
      message: `You've used your ${LOOKS_PER_PERSON} free looks. Book a free consult and Justin can walk you through more options.`,
    };
  }
  return { ok: true };
}

export function phoneDigits(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return digits.length === 11 && digits.startsWith("1") ? digits.slice(1) : digits;
}

/** True when the request carries the DESIGN_TEST_TOKEN header (QA only). */
export function isTestRequest(request: Request) {
  const token = process.env.DESIGN_TEST_TOKEN;
  if (!token || token.length < 16) return false;
  return request.headers.get("x-design-test") === token;
}

export function testRecipients() {
  return (process.env.DESIGN_TEST_EMAIL || "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
}

export function clientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return request.headers.get("x-real-ip") || "unknown";
}

export function readCookie(request: Request, name: string) {
  const raw = request.headers.get("cookie") || "";
  for (const part of raw.split(";")) {
    const [key, ...rest] = part.trim().split("=");
    if (key === name) return decodeURIComponent(rest.join("="));
  }
  return "";
}

export const DEVICE_COOKIE = "abc_design_device";
