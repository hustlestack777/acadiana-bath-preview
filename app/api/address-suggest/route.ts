import { NextResponse } from "next/server";
import { resolveAddress, suggestAddresses, type AddressHit } from "@/lib/address-suggest";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const WINDOW_MS = 60_000;
const MAX_LOOKUPS = 40;
const hits = new Map<string, number[]>();

function clientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return request.headers.get("x-real-ip") || "unknown";
}

function allowLookup(ip: string, now = Date.now()) {
  const recent = (hits.get(ip) ?? []).filter((stamp) => now - stamp < WINDOW_MS);
  if (recent.length >= MAX_LOOKUPS) {
    hits.set(ip, recent);
    return false;
  }
  recent.push(now);
  hits.set(ip, recent);
  return true;
}

export async function GET(request: Request) {
  if (!allowLookup(clientIp(request))) {
    return NextResponse.json({ ok: false, error: "Too many address lookups. Please wait a moment." }, { status: 429 });
  }
  const query = new URL(request.url).searchParams.get("q")?.trim() ?? "";
  if (query.length > 200) {
    return NextResponse.json({ ok: false, error: "That address is too long." }, { status: 400 });
  }
  const suggestions = await suggestAddresses(query);
  return NextResponse.json({ ok: true, suggestions });
}

export async function POST(request: Request) {
  if (!allowLookup(clientIp(request))) {
    return NextResponse.json({ ok: false, error: "Too many address lookups. Please wait a moment." }, { status: 429 });
  }
  let body: Partial<AddressHit> & { label?: string };
  try {
    body = (await request.json()) as Partial<AddressHit> & { label?: string };
  } catch {
    return NextResponse.json({ ok: false, error: "Send the selected address." }, { status: 400 });
  }
  const label = typeof body.label === "string" ? body.label.trim() : "";
  if (!label || label.length > 300) {
    return NextResponse.json({ ok: false, error: "Choose an address from the list." }, { status: 400 });
  }
  const resolved = await resolveAddress({
    id: typeof body.id === "string" ? body.id : undefined,
    label,
    street: typeof body.street === "string" ? body.street : "",
    city: typeof body.city === "string" ? body.city : "",
    region: typeof body.region === "string" ? body.region : "",
    zip: typeof body.zip === "string" ? body.zip : "",
    lat: typeof body.lat === "number" ? body.lat : null,
    lon: typeof body.lon === "number" ? body.lon : null,
    magicKey: typeof body.magicKey === "string" ? body.magicKey : undefined,
  });
  return NextResponse.json({ ok: true, address: resolved });
}
