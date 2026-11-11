import { NextResponse } from "next/server";
import { clientIp } from "@/lib/design-sessions";
import { fetchStreetViewImage } from "@/lib/street-view";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const hits = new Map<string, { count: number; start: number }>();
const HOUR = 60 * 60 * 1000;
const MAX_PER_HOUR = 8;

function limited(ip: string) {
  const now = Date.now();
  const current = hits.get(ip);
  if (!current || now - current.start > HOUR) {
    hits.set(ip, { count: 1, start: now });
    return false;
  }
  current.count += 1;
  return current.count > MAX_PER_HOUR;
}

export async function POST(request: Request) {
  const ip = clientIp(request);
  if (limited(ip)) {
    return NextResponse.json({ ok: false, error: "Please wait and try again." }, { status: 429 });
  }
  let body: { street?: string; city?: string; zip?: string; latitude?: number | null; longitude?: number | null };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ ok: false, error: "Send an address." }, { status: 400 });
  }
  const street = String(body.street || "").trim().slice(0, 200);
  const city = String(body.city || "").trim().slice(0, 80);
  const zip = String(body.zip || "").trim().slice(0, 10);
  const address = [street, city, zip].filter(Boolean).join(", ");
  if (!street || address.length < 8) {
    return NextResponse.json({ ok: false, error: "Enter a full street address." }, { status: 400 });
  }
  const lat = typeof body.latitude === "number" && Number.isFinite(body.latitude) ? body.latitude : null;
  const lon = typeof body.longitude === "number" && Number.isFinite(body.longitude) ? body.longitude : null;
  const image = await fetchStreetViewImage({ address, lat, lon });
  if (!image) {
    return NextResponse.json(
      { ok: true, found: false, image: null },
      { headers: { "Cache-Control": "private, no-store" } },
    );
  }
  return NextResponse.json(
    {
      ok: true,
      found: true,
      image: `data:${image.contentType};base64,${image.bytes.toString("base64")}`,
      attribution: "Photo from Google Street View",
    },
    { headers: { "Cache-Control": "private, no-store" } },
  );
}
