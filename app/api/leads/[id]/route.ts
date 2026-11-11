import { NextResponse } from "next/server";
import { MAX_PHOTOS, updateLeadExtras, type LeadPhoto } from "@/lib/leads";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

function text(form: FormData, key: string) {
  const value = form.get(key);
  return typeof value === "string" ? value : "";
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ ok: false, error: "Send the extras as a form." }, { status: 400 });
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

  const extras = {
    width: text(form, "width"),
    depth: text(form, "depth"),
    height: text(form, "height"),
    measurements: text(form, "measurements"),
    preferredCallDay: text(form, "preferredCallDay"),
    preferredCallTime: text(form, "preferredCallTime"),
    photos,
  };

  if (
    !extras.width.trim() &&
    !extras.depth.trim() &&
    !extras.height.trim() &&
    !extras.measurements.trim() &&
    !extras.preferredCallTime.trim() &&
    !extras.photos.length
  ) {
    return NextResponse.json({ ok: false, error: "Add a preferred call time, measurements, or photos first." }, { status: 400 });
  }

  try {
    const result = await updateLeadExtras(id, extras);
    if (!result.ok) {
      return NextResponse.json(
        { ok: false, error: result.error, errors: "errors" in result ? result.errors : undefined },
        { status: result.status },
      );
    }
    return NextResponse.json({
      ok: true,
      id: result.id,
      emailSent: result.emailSent,
      emailError: result.emailSent ? undefined : result.emailError,
      photoCount: result.photoCount,
    });
  } catch (error) {
    console.error("lead extras failed", error instanceof Error ? error.name : "unknown");
    return NextResponse.json(
      { ok: false, error: "We couldn't save those extras. Your original request is still saved." },
      { status: 500 },
    );
  }
}
