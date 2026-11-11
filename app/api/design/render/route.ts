import { NextResponse } from "next/server";
import { findBudget } from "@/lib/budget";
import { parsePicks, styleFromPicks, resolvePicks } from "@/lib/design-picks";
import { normalizePhoto, renderDesign, RenderError, teaser, type RenderResult, type RenderStage } from "@/lib/design-render";
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
export const maxDuration = 300;

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

  const resolved = resolvePicks(
    parsePicks({
      layout: String(form.get("layout") || ""),
      wall: String(form.get("wall") || form.get("style") || ""),
      floor: String(form.get("floor") || ""),
      finish: String(form.get("finish") || ""),
      budget: String(form.get("budget") || ""),
    }),
  );
  if (!resolved) return fail("Pick your layout, walls, floor and finish first.", 400);
  const style = styleFromPicks(resolved);
  const picks = {
    layout: resolved.layout.key,
    wall: resolved.wall.key,
    floor: resolved.floor.key,
    finish: resolved.finish.key,
    budget: String(form.get("budget") || ""),
  };

  let before: Buffer | null;
  let extra: Buffer | null = null;
  try {
    before = await readPhoto(form.get("photo"));
    extra = await readPhoto(form.get("photo2")).catch(() => null);
  } catch (error) {
    return fail(error instanceof RenderError ? error.userMessage : "We couldn't open that photo.", 400);
  }
  if (!before) return fail("Add a photo of your shower or bathroom.", 400);

  const budget = findBudget(String(form.get("budget") || ""))?.id ?? "";
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
  if (!limits.ok) {
    // Keep the existing cap values. Save their photos so Justin can design by hand; this status does not count toward render caps.
    const id = crypto.randomUUID();
    await db.query(
      `INSERT INTO design_sessions (id, ip_hash, device_id, style_key, status, is_test, before, extra, phone_digits, budget, picks)
       VALUES ($1,$2,$3,$4,'capped',$5,$6,$7,$8,$9,$10)`,
      [id, ipHash, deviceId, style.key, test, before, extra, phone, budget, JSON.stringify(picks)],
    );
    const response = NextResponse.json({ ok: true, id, capped: true, code: limits.code });
    response.cookies.set(DEVICE_COOKIE, deviceId, {
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
    });
    return response;
  }

  const id = crypto.randomUUID();
  await db.query(
    `INSERT INTO design_sessions (id, ip_hash, device_id, style_key, status, is_test, before, extra, phone_digits, budget, picks)
     VALUES ($1,$2,$3,$4,'rendering',$5,$6,$7,$8,$9,$10)`,
    [id, ipHash, deviceId, style.key, test, before, extra, phone, budget, JSON.stringify(picks)],
  );


  const stream = request.headers.get("x-design-progress") === "1" || (request.headers.get("accept") || "").includes("application/x-ndjson");
  const cookie = {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: true,
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
  };

  const finish = async (result: RenderResult) => {
    for (const attempt of result.attempts) {
      const verdict = attempt.verdict;
      console.log(
        `design qa session=${id} style=${style.key} attempt=${attempt.attempt} ${verdict?.pass ? "PASS" : "FAIL"} edit_ms=${attempt.editMs} qa_ms=${verdict?.latencyMs ?? 0} failed=${verdict?.failed.join(",") || attempt.error || verdict?.error || ""} reasons=${JSON.stringify(verdict?.reasons ?? [])}${test ? " test" : ""}`,
      );
      await db
        .query(
          `INSERT INTO design_qa_log (session_id, attempt, pass, failed, reasons, error, qa_model, edit_ms, qa_ms, cost_usd, style_key, is_test)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`,
          [
            id,
            attempt.attempt,
            verdict?.pass === true,
            verdict?.failed ?? [],
            JSON.stringify(verdict?.reasons ?? []),
            (attempt.error || verdict?.error || "").slice(0, 200),
            verdict?.model ?? "",
            attempt.editMs,
            verdict?.latencyMs ?? 0,
            attempt.costUsd.toFixed(4),
            style.key,
            test,
          ],
        )
        .catch((error) => console.error("design qa log failed", error instanceof Error ? error.name : "unknown"));
    }
    const debug = test
      ? {
          costUsd: result.costUsd,
          scan: result.scan,
          attempts: result.attempts.map((attempt) => ({
            attempt: attempt.attempt,
            editMs: attempt.editMs,
            costUsd: attempt.costUsd,
            error: attempt.error,
            verdict: attempt.verdict,
            image: attempt.after ? `data:image/jpeg;base64,${attempt.after.toString("base64")}` : null,
          })),
        }
      : {};
    if (!result.after) {
      await db.query(
        `UPDATE design_sessions SET status='qa_failed', qa_failed=true, attempts=$2, cost_usd=$3, latency_ms=$4, model=$5 WHERE id=$1`,
        [id, result.attempts.length, result.costUsd.toFixed(4), result.latencyMs, result.model],
      );
      console.log(`design render qa_failed style=${style.key} attempts=${result.attempts.length} ms=${result.latencyMs} usd=${result.costUsd.toFixed(4)}`);
      return { ok: true, id, qaFailed: true, latencyMs: result.latencyMs, ...debug };
    }
    const preview = await teaser(result.after);
    await db.query(
      `UPDATE design_sessions SET status='done', after=$2, cost_usd=$3, latency_ms=$4, model=$5, attempts=$6 WHERE id=$1`,
      [id, result.after, result.costUsd.toFixed(4), result.latencyMs, result.model, result.attempts.length],
    );
    console.log(`design render ok style=${style.key} attempts=${result.attempts.length} ms=${result.latencyMs} usd=${result.costUsd.toFixed(4)}`);
    return {
      ok: true,
      id,
      teaser: `data:image/jpeg;base64,${preview.toString("base64")}`,
      latencyMs: result.latencyMs,
      ...debug,
    };
  };

  const failRender = async (error: unknown) => {
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
    return {
      ok: false as const,
      error: known?.userMessage || "The designer hit a snag. Let's try again.",
      status: known && !known.retryable ? 422 : 502,
      retryable: known ? known.retryable : true,
    };
  };

  if (stream) {
    const encoder = new TextEncoder();
    const body = new ReadableStream({
      async start(controller) {
        const send = (payload: Record<string, unknown>) => {
          controller.enqueue(encoder.encode(`${JSON.stringify(payload)}\n`));
        };
        try {
          send({ stage: "preparing" as RenderStage });
          const result = await renderDesign(before, style, (stage) => send({ stage }), resolved.layout);
          const payload = await finish(result);
          send({ stage: "done", ...payload });
        } catch (error) {
          const failed = await failRender(error);
          send({ stage: "error", ok: false, error: failed.error, retryable: failed.retryable, status: failed.status });
        } finally {
          controller.close();
        }
      },
    });
    const response = new NextResponse(body, {
      headers: {
        "Content-Type": "application/x-ndjson; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
    response.cookies.set(DEVICE_COOKIE, deviceId, cookie);
    return response;
  }

  try {
    const result = await renderDesign(before, style, undefined, resolved.layout);
    const payload = await finish(result);
    const response = NextResponse.json(payload);
    response.cookies.set(DEVICE_COOKIE, deviceId, cookie);
    return response;
  } catch (error) {
    const failed = await failRender(error);
    return fail(failed.error, failed.status, { retryable: failed.retryable });
  }
}
