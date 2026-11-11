import { NextResponse } from "next/server";
import { findStyle } from "@/lib/design-styles";
import { normalizePhoto, renderDesign, RenderError, teaser } from "@/lib/design-render";
import {
  checkLimits,
  clientIp,
  DEVICE_COOKIE,
  designDb,
  ensureDesignSchema,
  hashIp,
  isTestRequest,
  newToken,
  readCookie,
} from "@/lib/design-sessions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 180;

const MAX_UPLOAD = 4 * 1024 * 1024;
const ALLOWED = /^image\/(jpeg|png|webp)$/;

function fail(error: string, status: number, extra: Record<string, unknown> = {}) {
  return NextResponse.json({ ok: false, error, ...extra }, { status });
}

async function readPhoto(entry: FormDataEntryValue | null) {
  if (!(entry instanceof File) || entry.size === 0) return null;
  if (entry.size > MAX_UPLOAD) throw new RenderError("too big", "That photo is too large. Try another one.", false);
  if (!ALLOWED.test(entry.type)) throw new RenderError("type", "Use a JPEG, PNG or WebP photo.", false);
  return normalizePhoto(Buffer.from(await entry.arrayBuffer()));
}

export async function POST(request: Request) {
  const db = designDb();
  if (!db) return fail("The designer is offline right now.", 503);
  if (!process.env.XAI_API_KEY) return fail("The designer is offline right now.", 503);

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return fail("Send the photo as a form.", 400);
  }
  // Honeypot: real people never see this field.
  const trap = form.get("company_fax");
  if (typeof trap === "string" && trap.trim()) return fail("We couldn't start that design.", 400);

  const style = findStyle(String(form.get("style") || ""));
  if (!style) return fail("Pick a look first.", 400);

  let before: Buffer | null;
  let extra: Buffer | null = null;
  try {
    before = await readPhoto(form.get("photo"));
    extra = await readPhoto(form.get("photo2")).catch(() => null);
  } catch (error) {
    return fail(error instanceof RenderError ? error.userMessage : "We couldn't open that photo.", 400);
  }
  if (!before) return fail("Add a photo of your shower or bathroom.", 400);

  const test = isTestRequest(request);
  const ipHash = hashIp(clientIp(request));
  const existingDevice = readCookie(request, DEVICE_COOKIE);
  const deviceId = /^[0-9a-f]{32}$/.test(existingDevice) ? existingDevice : newToken().slice(0, 32);

  await ensureDesignSchema(db);

  // A returning visitor who already unlocked sends their token so the phone cap applies.
  let phone = "";
  const priorToken = String(form.get("token") || "");
  if (/^[0-9a-f]{48}$/.test(priorToken)) {
    const prior = await db.query<{ phone_digits: string }>(
      `SELECT phone_digits FROM design_sessions WHERE unlock_token = $1 LIMIT 1`,
      [priorToken],
    );
    phone = prior.rows[0]?.phone_digits ?? "";
  }

  const limits = await checkLimits(db, { ipHash, deviceId, phoneDigits: phone, skipIp: test });
  if (!limits.ok) return fail(limits.message, 429, { code: limits.code, retryable: false });

  const id = crypto.randomUUID();
  await db.query(
    `INSERT INTO design_sessions (id, ip_hash, device_id, style_key, status, is_test, before, extra, phone_digits)
     VALUES ($1,$2,$3,$4,'rendering',$5,$6,$7,$8)`,
    [id, ipHash, deviceId, style.key, test, before, extra, phone],
  );

  try {
    const result = await renderDesign(before, style);
    const preview = await teaser(result.after);
    await db.query(
      `UPDATE design_sessions SET status='done', after=$2, cost_usd=$3, latency_ms=$4, model=$5 WHERE id=$1`,
      [id, result.after, result.costUsd.toFixed(4), result.latencyMs, result.model],
    );
    console.log(`design render ok style=${style.key} ms=${result.latencyMs} usd=${result.costUsd.toFixed(4)}`);
    const response = NextResponse.json({
      ok: true,
      id,
      teaser: `data:image/jpeg;base64,${preview.toString("base64")}`,
      latencyMs: result.latencyMs,
      ...(test ? { costUsd: result.costUsd } : {}),
    });
    response.cookies.set(DEVICE_COOKIE, deviceId, {
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
    });
    return response;
  } catch (error) {
    const known = error instanceof RenderError ? error : null;
    await db
      .query(`UPDATE design_sessions SET status=$2, error=$3, cost_usd=$4, before=NULL, extra=NULL WHERE id=$1`, [
        id,
        known && !known.retryable ? "rejected" : "failed",
        (known?.message || (error instanceof Error ? error.name : "unknown")).slice(0, 200),
        (known?.costUsd ?? 0).toFixed(4),
      ])
      .catch(() => undefined);
    console.error("design render failed", known?.message || (error instanceof Error ? error.name : "unknown"));
    return fail(known?.userMessage || "The designer hit a snag. Let's try again.", known && !known.retryable ? 422 : 502, {
      retryable: known ? known.retryable : true,
    });
  }
}
