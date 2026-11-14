import { NextResponse } from "next/server";
import { clientIp } from "@/lib/design-sessions";
import { gigiTurn, type ChatHistoryTurn } from "@/lib/chat-llm";
import type { GigiSession } from "@/lib/chat";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: {
    message?: unknown;
    session?: GigiSession;
    pathname?: unknown;
    history?: ChatHistoryTurn[];
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Send JSON." }, { status: 400 });
  }
  const message = typeof body.message === "string" ? body.message.trim() : "";
  if (!message) return NextResponse.json({ ok: false, error: "Empty message." }, { status: 400 });
  const result = await gigiTurn(message, body.session ?? { phase: "intro" }, {
    pathname: typeof body.pathname === "string" ? body.pathname : "/",
    history: Array.isArray(body.history) ? body.history.slice(-8) : [],
    ip: clientIp(request),
  });
  return NextResponse.json({
    ok: true,
    text: result.text,
    chips: result.chips,
    session: result.session,
    source: result.source,
    missingEnv: result.missingEnv,
  });
}
