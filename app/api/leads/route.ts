import { NextResponse } from "next/server";
import { MAX_PHOTOS, saveLead, validateLead, type LeadPhoto } from "@/lib/leads";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

function text(form: FormData, key: string) {
  const value = form.get(key);
  return typeof value === "string" ? value : "";
}

function clientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return request.headers.get("x-real-ip") || "unknown";
}

export async function POST(request: Request) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ ok: false, error: "Send the review as a form." }, { status: 400 });
  }

  if (text(form, "company_fax").trim()) {
    return NextResponse.json({ ok: false, error: "We couldn't submit that." }, { status: 400 });
  }

  const photos: LeadPhoto[] = [];
  const entries = form.getAll("photos");
  if (entries.length > MAX_PHOTOS) {
    return NextResponse.json({ ok: false, error: `Send up to ${MAX_PHOTOS} photos.` }, { status: 400 });
  }
  for (const entry of entries) {
    if (!(entry instanceof File) || entry.size === 0) continue;
    const contentType = entry.type || "application/octet-stream";
    if (!ALLOWED_TYPES.has(contentType)) {
      return NextResponse.json({ ok: false, error: "Use JPEG, PNG, WebP, or GIF photos." }, { status: 400 });
    }
    const bytes = Buffer.from(await entry.arrayBuffer());
    const filename = entry.name.replace(/[/\\]/g, "").slice(0, 120) || "photo";
    photos.push({ filename, contentType, bytes });
  }

  const preferredRaw = text(form, "preferred");
  const phone = text(form, "phone");
  const email = text(form, "email");
  const preferred =
    preferredRaw === "phone" || preferredRaw === "email"
      ? preferredRaw
      : phone.trim()
        ? "phone"
        : "email";

  const input = {
    sourcePage: text(form, "sourcePage") || "/estimate",
    city: text(form, "city"),
    zip: text(form, "zip"),
    project: text(form, "project"),
    notSure: text(form, "notSure") === "true",
    width: text(form, "width"),
    depth: text(form, "depth"),
    height: text(form, "height"),
    measurements: text(form, "measurements"),
    finish: text(form, "finish") || "unsure",
    features: text(form, "features"),
    name: text(form, "name"),
    phone,
    email,
    preferred,
    marketing: text(form, "marketing") === "true",
    timing: text(form, "timing"),
    budget: text(form, "budget"),
    homeowner: text(form, "homeowner"),
    payment: text(form, "payment"),
    consent: text(form, "consent") === "true",
    preferredCallTime: text(form, "preferredCallTime"),
    photos,
  };
  const { errors } = validateLead(input);
  if (Object.keys(errors).length) {
    return NextResponse.json({ ok: false, error: "Check the highlighted fields.", errors }, { status: 400 });
  }

  try {
    const result = await saveLead(input, clientIp(request));
    if (!result.ok) {
      return NextResponse.json({ ok: false, error: result.error }, { status: result.status });
    }
    return NextResponse.json({
      ok: true,
      id: result.id,
      emailSent: result.emailSent,
      emailError: result.emailSent ? undefined : result.emailError,
    });
  } catch (error) {
    console.error("lead save failed", error instanceof Error ? error.name : "unknown");
    return NextResponse.json(
      { ok: false, error: "We couldn't save your request. Nothing was confirmed." },
      { status: 500 },
    );
  }
}
