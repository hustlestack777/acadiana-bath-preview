import { NextResponse } from "next/server";
import { gigiLiveReply } from "@/lib/gigi-live";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

const WINDOW_MS = 60_000;
const MAX_CHATS = 20;
const hits = new Map<string, number[]>();

function clientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return request.headers.get("x-real-ip") || "unknown";
}

function allowChat(ip: string, now = Date.now()) {
  const recent = (hits.get(ip) ?? []).filter((stamp) => now - stamp < WINDOW_MS);
  if (recent.length >= MAX_CHATS) {
    hits.set(ip, recent);
    return false;
  }
  recent.push(now);
  hits.set(ip, recent);
  return true;
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Send a message." }, { status: 400 });
  }
  const raw = body && typeof body === "object" ? (body as Record<string, unknown>) : {};
  const message = typeof raw.message === "string" ? raw.message.trim() : "";
  if (!message || message.length > 240) {
    return NextResponse.json({ ok: false, error: "Send a shorter message." }, { status: 400 });
  }
  const limited = !allowChat(clientIp(request));
  const result = await gigiLiveReply({
    message,
    session: raw.session,
    pathname: raw.pathname,
    history: raw.history,
    fetchImpl: limited
      ? async () => {
          throw new Error("chat unavailable");
        }
      : undefined,
  });
  return NextResponse.json({
    ok: true,
    source: limited ? "fallback" : result.source,
    text: result.text,
    chips: result.chips,
    session: result.session,
  });
}
