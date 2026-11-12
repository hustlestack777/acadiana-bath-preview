/** LRL credit-form inquiries. These are not client leads and must never reach a client inbox. */

export const SHAUN_INQUIRY_EMAILS = [
  "shaun.brasher@gmail.com",
  "shaun@lagniapperealmlabs.com",
] as const;

/** Client or vendor inboxes that must never receive an LRL inquiry, even if listed in env. */
export const BLOCKED_INQUIRY_EMAILS = [
  "acadianabathandcounter@gmail.com",
] as const;

export const LRL_TOPICS = [
  { value: "website", label: "Website" },
  { value: "leads", label: "Getting more leads" },
  { value: "ai", label: "AI or automation" },
  { value: "other", label: "Something else" },
] as const;

export const LRL_REACH_TIMES = [
  { value: "morning", label: "Morning" },
  { value: "afternoon", label: "Afternoon" },
  { value: "evening", label: "Evening" },
  { value: "anytime", label: "Anytime" },
] as const;

export type LrlTopic = (typeof LRL_TOPICS)[number]["value"];
export type LrlReachTime = (typeof LRL_REACH_TIMES)[number]["value"];

export const LRL_TOPIC_VALUES = LRL_TOPICS.map((item) => item.value) as LrlTopic[];
export const LRL_REACH_TIME_VALUES = LRL_REACH_TIMES.map((item) => item.value) as LrlReachTime[];

export type LrlInquiryInput = {
  name: string;
  phone: string;
  email: string;
  business: string;
  topic: string;
  reachTime: string;
  comment: string;
  sourceSite: string;
  sourcePage: string;
};

export type LrlInquiryParsed = {
  name: string;
  phone: string;
  email: string;
  business: string;
  topic: LrlTopic;
  reachTime: LrlReachTime;
  comment: string;
  sourceSite: string;
  sourcePage: string;
};

const MAX_TEXT = 200;
const MAX_COMMENT = 2000;
const MAX_PAGE = 300;

export function clip(value: string, max: number) {
  return value.trim().slice(0, max);
}

export function phoneDigits(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return digits.length === 11 && digits.startsWith("1") ? digits.slice(1) : digits;
}

export function isValidEmail(email: string) {
  const trimmed = email.trim();
  if (!trimmed) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed) && trimmed.length <= MAX_TEXT;
}

function uniqueAddresses(addresses: string[]) {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const address of addresses) {
    const trimmed = address.trim();
    if (!trimmed) continue;
    const key = trimmed.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(trimmed);
  }
  return result;
}

function isBlocked(address: string) {
  const key = address.trim().toLowerCase();
  return BLOCKED_INQUIRY_EMAILS.some((blocked) => blocked.toLowerCase() === key);
}

/**
 * Recipients for an LRL inquiry: Shaun only.
 * Env values are allowed, but known client inboxes are always stripped.
 * If nothing safe remains, fall back to Shaun's Gmail.
 */
export function lrlInquiryRecipients(envList?: string | null) {
  const fromEnv = (envList ?? "")
    .split(/[,;]+/)
    .map((item) => item.trim())
    .filter(Boolean);
  const source = fromEnv.length ? fromEnv : [...SHAUN_INQUIRY_EMAILS];
  const allowed = uniqueAddresses(source.filter((address) => !isBlocked(address)));
  return allowed.length ? allowed : [SHAUN_INQUIRY_EMAILS[0]];
}

export function topicLabel(value: string) {
  return LRL_TOPICS.find((item) => item.value === value)?.label ?? "";
}

export function reachTimeLabel(value: string) {
  return LRL_REACH_TIMES.find((item) => item.value === value)?.label ?? "";
}

export function validateLrlInquiry(raw: Partial<LrlInquiryInput>): { ok: true; value: LrlInquiryParsed } | { ok: false; error: string } {
  const name = clip(String(raw.name ?? ""), MAX_TEXT);
  const phone = clip(String(raw.phone ?? ""), MAX_TEXT);
  const email = clip(String(raw.email ?? ""), MAX_TEXT);
  const business = clip(String(raw.business ?? ""), MAX_TEXT);
  const topic = clip(String(raw.topic ?? ""), 40);
  const reachTime = clip(String(raw.reachTime ?? ""), 40);
  const comment = clip(String(raw.comment ?? ""), MAX_COMMENT);
  const sourceSite = clip(String(raw.sourceSite ?? ""), MAX_TEXT) || "Website";
  const sourcePage = clip(String(raw.sourcePage ?? ""), MAX_PAGE);

  if (!name) return { ok: false, error: "Please add your name." };
  if (phoneDigits(phone).length < 10) return { ok: false, error: "Please add a phone number we can reach you at." };
  if (email && !isValidEmail(email)) return { ok: false, error: "That email doesn't look right." };
  if (!(LRL_TOPIC_VALUES as string[]).includes(topic)) return { ok: false, error: "Please choose what this is about." };
  if (!(LRL_REACH_TIME_VALUES as string[]).includes(reachTime)) return { ok: false, error: "Please choose the best time to reach you." };

  return {
    ok: true,
    value: {
      name,
      phone,
      email,
      business,
      topic: topic as LrlTopic,
      reachTime: reachTime as LrlReachTime,
      comment,
      sourceSite,
      sourcePage,
    },
  };
}

function esc(value: string) {
  return value.replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[char]!));
}

export function buildLrlInquiryEmail(inquiry: LrlInquiryParsed) {
  const subject = `LRL inquiry from ${inquiry.sourceSite}: ${inquiry.name}`;
  const rows: [string, string][] = [
    ["Name", inquiry.name],
    ["Phone", inquiry.phone],
    ["Email", inquiry.email],
    ["Business", inquiry.business],
    ["What's it about", topicLabel(inquiry.topic)],
    ["Best time to reach them", reachTimeLabel(inquiry.reachTime)],
    ["Anything else", inquiry.comment],
    ["Source site", inquiry.sourceSite],
    ["Source page", inquiry.sourcePage],
  ].filter(([, value]) => value.trim()) as [string, string][];

  const table = rows
    .map(
      ([label, value]) =>
        `<tr><td style="border-bottom:1px solid #e5e5e5;color:#555;white-space:nowrap;vertical-align:top;padding:6px 10px 6px 0"><b>${esc(label)}</b></td><td style="border-bottom:1px solid #e5e5e5;padding:6px 0">${esc(value).replace(/\n/g, "<br>")}</td></tr>`,
    )
    .join("");

  const html = `<div style="font:15px/1.45 Arial,sans-serif;color:#222;max-width:560px">
<p style="margin:0 0 4px;color:#666;font-size:12px;letter-spacing:.04em;text-transform:uppercase"><b>LRL inquiry</b> — not a client lead</p>
<h2 style="margin:0 0 12px">Someone reached out from the site credit</h2>
<table cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%">${table}</table>
<p style="margin:16px 0 0;color:#555">This came from the Lagniappe Realm Labs credit on ${esc(inquiry.sourceSite)}. It was not added to a client lead inbox.</p>
</div>`;

  const text = [
    "LRL inquiry — not a client lead",
    `Someone reached out from the site credit on ${inquiry.sourceSite}.`,
    "",
    ...rows.map(([label, value]) => `${label}: ${value}`),
    "",
    "This was not added to a client lead inbox.",
  ].join("\n");

  return { subject, html, text };
}
