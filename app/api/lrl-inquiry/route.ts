import { NextResponse } from "next/server";
import { Resend } from "resend";
import {
  buildLrlInquiryEmail,
  lrlInquiryRecipients,
  validateLrlInquiry,
  type LrlInquiryInput,
} from "@/lib/lrl-inquiry";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const hits = new Map<string, number[]>();

function clientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return request.headers.get("x-real-ip") || "unknown";
}

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((time) => now - time < RATE_WINDOW_MS);
  if (recent.length >= RATE_LIMIT) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  return false;
}

function readBody(raw: unknown): Partial<LrlInquiryInput> & { company_fax?: string } {
  if (!raw || typeof raw !== "object") return {};
  const body = raw as Record<string, unknown>;
  const text = (key: string) => (typeof body[key] === "string" ? body[key] : "");
  return {
    name: text("name"),
    phone: text("phone"),
    email: text("email"),
    business: text("business"),
    topic: text("topic"),
    reachTime: text("reachTime"),
    comment: text("comment"),
    sourceSite: text("sourceSite"),
    sourcePage: text("sourcePage"),
    company_fax: text("company_fax"),
  };
}

export async function POST(request: Request) {
  if (rateLimited(clientIp(request))) {
    return NextResponse.json({ ok: false, error: "Please wait a few minutes and try again." }, { status: 429 });
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "We couldn't read that. Please try again." }, { status: 400 });
  }

  const body = readBody(raw);
  if (body.company_fax?.trim()) {
    return NextResponse.json({ ok: true });
  }

  const parsed = validateLrlInquiry({
    ...body,
    sourceSite: body.sourceSite || "Acadiana Bathrooms",
    sourcePage: body.sourcePage || request.headers.get("referer") || "",
  });
  if (!parsed.ok) {
    return NextResponse.json({ ok: false, error: parsed.error }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.LRL_RESEND_FROM || process.env.RESEND_FROM;
  const to = lrlInquiryRecipients(process.env.LRL_INQUIRY_EMAIL);
  if (!apiKey) return NextResponse.json({ ok: false, error: "This form isn't ready yet. Please email Shaun directly." }, { status: 500 });
  if (!from) return NextResponse.json({ ok: false, error: "This form isn't ready yet. Please email Shaun directly." }, { status: 500 });
  if (!to.length) return NextResponse.json({ ok: false, error: "This form isn't ready yet. Please email Shaun directly." }, { status: 500 });

  const message = buildLrlInquiryEmail(parsed.value);
  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to,
    subject: message.subject,
    html: message.html,
    text: message.text,
    replyTo: parsed.value.email || undefined,
  });

  if (error) {
    console.error("LRL inquiry email failed");
    return NextResponse.json({ ok: false, error: "We couldn't send that. Please try again or email Shaun." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
