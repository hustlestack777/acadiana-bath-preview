import { NextResponse } from "next/server";
import { saveLead, validateLead } from "@/lib/leads";
import { designCopy, findStyle } from "@/lib/design-styles";
import {
  clientIp,
  designDb,
  ensureDesignSchema,
  isTestRequest,
  newToken,
  phoneDigits,
} from "@/lib/design-sessions";
import { isTeamTestLead, withTestSubject } from "@/lib/lead-notify";
import { consentRecord } from "@/lib/lead-consent";
import { formatChicago } from "@/lib/lead-display";
import { budgetTag } from "@/lib/budget";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function text(form: FormData, key: string, max = 300) {
  const value = form.get(key);
  return typeof value === "string" ? value.slice(0, max) : "";
}

function coordinate(raw: string, min: number, max: number) {
  if (!raw.trim()) return null;
  const value = Number(raw);
  return Number.isFinite(value) && value >= min && value <= max ? value : null;
}

function fail(error: string, status: number, errors?: Record<string, string>) {
  return NextResponse.json({ ok: false, error, errors }, { status });
}

const jpeg = (bytes: Buffer) => `data:image/jpeg;base64,${bytes.toString("base64")}`;

export async function POST(request: Request) {
  const db = designDb();
  if (!db) return fail("Lead storage is not configured.", 503);
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return fail("Send the form again.", 400);
  }
  if (text(form, "company_fax").trim()) return fail("We couldn't submit that.", 400);

  const id = text(form, "id", 40);
  if (!/^[0-9a-f-]{36}$/i.test(id)) return fail("That design was not found. Start a new one.", 404);
  await ensureDesignSchema(db);
  const found = await db.query<{
    style_key: string;
    status: string;
    before: Buffer | null;
    extra: Buffer | null;
    after: Buffer | null;
    lead_id: string | null;
    unlock_token: string;
    is_test: boolean;
    budget: string;
  }>(`SELECT style_key, status, before, extra, after, lead_id, unlock_token, is_test, budget FROM design_sessions WHERE id = $1`, [id]);
  const session = found.rows[0];
  // qa_failed = every render failed the automatic QA, so no image was shown. We still take the lead
  // (their photos + the look they picked) and Justin puts a custom design together.
  const qaFailed = session?.status === "qa_failed";
  if (!session || !session.before || (!qaFailed && (session.status !== "done" || !session.after))) {
    return fail("That design was not found. Start a new one.", 404);
  }
  const style = findStyle(session.style_key);
  if (!style) return fail("That design was not found. Start a new one.", 404);

  const name = text(form, "name", 120);
  const phone = text(form, "phone", 40);
  const email = text(form, "email", 200);
  const street = text(form, "street", 200);
  const city = text(form, "city", 80);
  const zip = text(form, "zip", 10);
  const smsConsent = text(form, "smsConsent") === "true";
  const homeowner = ["own", "rent"].includes(text(form, "homeowner")) ? text(form, "homeowner") : "";

  const errors: Record<string, string> = {};
  if (phoneDigits(phone).length !== 10) errors.phone = "Enter a 10-digit mobile number.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) errors.email = "Enter a valid email.";

  const full = session.after;
  const before = session.before;
  const photos = [
    { filename: "1-before-their-photo.jpg", contentType: "image/jpeg", bytes: before },
    ...(full ? [{ filename: `2-after-design-preview-${style.key}.jpg`, contentType: "image/jpeg", bytes: full }] : []),
    ...(session.extra ? [{ filename: "3-their-second-photo.jpg", contentType: "image/jpeg", bytes: session.extra }] : []),
  ];

  const ip = clientIp(request);
  const now = new Date();
  const features = [
    "Path: Design My Bathroom",
    `Style picked: ${style.name} (${style.path === "solid-surface" ? "Solid surface" : "Custom tile"})`,
    qaFailed
      ? "qa_failed: CUSTOM DESIGN NEEDED. Our preview didn't pass the automatic quality check, so they saw no image and were told Justin will put together a custom design. Their photo(s) are attached."
      : "Photo 1 is their bathroom. Photo 2 is the design preview we made from it.",
    smsConsent
      ? `SMS consent: YES at ${formatChicago(now)} from IP ${ip} (checkbox text v1 on /design: "${designCopy.smsConsent.slice(0, 60)}…")`
      : "SMS consent: no (call or email only).",
  ].join("\n");

  const input = {
    sourcePage: text(form, "sourcePage", 80) || "/design",
    formPage: text(form, "formPage", 80) || "/design",
    landingPage: text(form, "landingPage", 80),
    referrer: text(form, "referrer", 500),
    utmSource: text(form, "utmSource", 200),
    utmMedium: text(form, "utmMedium", 200),
    utmCampaign: text(form, "utmCampaign", 200),
    street,
    latitude: coordinate(text(form, "latitude"), -90, 90),
    longitude: coordinate(text(form, "longitude"), -180, 180),
    city,
    zip,
    project: style.project,
    notSure: false,
    width: "",
    depth: "",
    height: "",
    measurements: "",
    finish: "unsure",
    features: features.slice(0, 600),
    name,
    phone,
    email,
    preferred: "phone",
    marketing: false,
    timing: "exploring",
    budget: budgetTag(session.budget) || "Budget: skipped",
    homeowner,
    payment: "not-sure",
    consent: smsConsent,
    consentAt: smsConsent ? now : null,
    consentText: smsConsent ? consentRecord(designCopy.smsConsent, text(form, "formPage", 80) || "/design") : "",
    preferredCallTime: "",
    photos,
  };
  const validation = validateLead(input);
  Object.assign(errors, validation.errors);
  delete errors.features;
  if (Object.keys(errors).length) return fail("Check the highlighted fields.", 400, errors);

  const test = isTestRequest(request) || isTeamTestLead(phone, email);
  const subject = withTestSubject(
    `${qaFailed ? "[qa_failed: custom design needed] " : ""}New Design My Bathroom lead: ${name.trim()}, ${city.trim()}: ${style.name}`,
    test || /^test/i.test(name.trim()),
  );

  let leadId = session.lead_id;
  let emailSent = true;
  if (!leadId) {
    try {
      const result = await saveLead(input, ip, { subject, test });
      if (!result.ok) return fail(result.error, result.status);
      leadId = result.id;
      emailSent = result.emailSent;
      if (!result.emailSent) console.error("design lead email failed", result.emailError);
    } catch (error) {
      console.error("design lead save failed", error instanceof Error ? error.name : "unknown");
      return fail("We couldn't save your request. Nothing was sent.", 500);
    }
  }
  const token = session.unlock_token || newToken();
  await db.query(
    `UPDATE design_sessions SET lead_id=$2, phone_digits=$3, unlock_token=$4, unlocked_at=coalesce(unlocked_at, now()) WHERE id=$1`,
    [id, leadId, phoneDigits(phone), token],
  );

  if (qaFailed || !full) {
    return NextResponse.json({ ok: true, token, emailSent, style: style.name, custom: true });
  }
  return NextResponse.json({
    ok: true,
    token,
    emailSent,
    style: style.name,
    before: jpeg(before),
    after: jpeg(full),
  });
}
