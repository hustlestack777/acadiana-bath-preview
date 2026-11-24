import {
  CHAT_ANSWERS,
  GIGI_CALLS_FIRST,
  GIGI_JUSTIN_BRIDGE,
  GIGI_SYSTEM_PROMPT,
  prefersScriptedReply,
  respond,
  shouldUseWindowPrice,
  type GigiPhase,
  type GigiResponse,
  type GigiSession,
} from "./chat";
const XAI_CHAT = "https://api.x.ai/v1/chat/completions";
const DEFAULT_MODEL = "grok-4.20-0309-non-reasoning";
export const GIGI_CHAT_TIMEOUT_MS = 18_000;

const PHASES = new Set<GigiPhase>(["intro", "project", "look", "location", "offer", "callTime", "callDay"]);

const KITCHEN_LINE = "We focus on bathrooms. What's going on with yours?";
const PRICE_LINE = `Bathrooms start at $5K, and the exact price comes after measurements. ${GIGI_JUSTIN_BRIDGE}`;
const CREDENTIAL_LINE = `Our team can go over that when we set a time. ${GIGI_JUSTIN_BRIDGE}`;

const HIDDEN_DIGITS = ["337", "405", "9945"].join("");
const ALLOWED_PHONES = new Set(["3375220023", "8006699867"]);

export type GigiLiveSource = "model" | "fallback" | "script";

export type GigiLiveResult = GigiResponse & { source: GigiLiveSource };

export type GigiHistoryTurn = { role: "user" | "assistant"; content: string };

type FetchLike = typeof fetch;

function chatModel() {
  return process.env.GIGI_CHAT_MODEL || DEFAULT_MODEL;
}

export function parseGigiSession(value: unknown): GigiSession {
  const raw = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  const phase = typeof raw.phase === "string" && PHASES.has(raw.phase as GigiPhase) ? (raw.phase as GigiPhase) : "intro";
  const session: GigiSession = { phase };
  if (typeof raw.project === "string" && raw.project.trim()) session.project = raw.project.trim().slice(0, 80);
  if (typeof raw.look === "string" && raw.look.trim()) session.look = raw.look.trim().slice(0, 80);
  if (typeof raw.location === "string" && raw.location.trim()) session.location = raw.location.trim().slice(0, 80);
  if (raw.callTime === "morning" || raw.callTime === "afternoon" || raw.callTime === "evening") session.callTime = raw.callTime;
  if (raw.callDay === "weekday" || raw.callDay === "weekend" || raw.callDay === "any") session.callDay = raw.callDay;
  return session;
}

export function parseGigiHistory(value: unknown): GigiHistoryTurn[] {
  if (!Array.isArray(value)) return [];
  const turns: GigiHistoryTurn[] = [];
  for (const item of value.slice(-8)) {
    if (!item || typeof item !== "object") continue;
    const raw = item as Record<string, unknown>;
    const role = raw.role === "assistant" ? "assistant" : raw.role === "user" ? "user" : null;
    const content = typeof raw.content === "string" ? raw.content.trim().slice(0, 500) : "";
    if (!role || !content) continue;
    turns.push({ role, content });
  }
  return turns;
}

function clip(text: string) {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= 700) return clean;
  const slice = clean.slice(0, 700);
  const end = Math.max(slice.lastIndexOf("."), slice.lastIndexOf("!"), slice.lastIndexOf("?"));
  return (end > 200 ? slice.slice(0, end + 1) : slice).trim();
}

function readContent(json: unknown) {
  const choices = (json as { choices?: Array<{ message?: { content?: unknown } }> } | null)?.choices;
  const content = choices?.[0]?.message?.content;
  if (typeof content === "string") return content.trim();
  if (!Array.isArray(content)) return "";
  return content
    .map((part) => {
      if (typeof part === "string") return part;
      if (part && typeof part === "object" && typeof (part as { text?: unknown }).text === "string") {
        return (part as { text: string }).text;
      }
      return "";
    })
    .join("")
    .trim();
}

function containsHiddenPhone(text: string) {
  return text.replace(/\D/g, "").includes(HIDDEN_DIGITS);
}

function hasDisallowedPhone(text: string) {
  if (containsHiddenPhone(text)) return true;
  const matches = text.match(/(?:\+?1[\s.-]*)?\(?\d{3}\)?[\s.-]*\d{3}[\s.-]*\d{4}/g) ?? [];
  return matches.some((match) => {
    const digits = match.replace(/\D/g, "");
    const last10 = digits.slice(-10);
    return !ALLOWED_PHONES.has(last10);
  });
}

function promisesCall(text: string) {
  if (/\bI(?:'|’)ll call\b|\bI will call\b|\bI can call\b|\bI(?:'|’)m going to call\b|\bI am going to call\b|\bexpect a call from me\b|\bI(?:'|’)ll phone\b/i.test(text)) {
    return true;
  }
  const withoutProcess = text.replaceAll(GIGI_CALLS_FIRST, "");
  return /\b(we(?:'|’)ll|we will|justin will|he will|she will) call\b/i.test(withoutProcess);
}

function bannedCredential(text: string) {
  const licenseWord = ["licen", "sed"].join("");
  const coverWord = ["insu", "red"].join("");
  return new RegExp(`\\b(${licenseWord}|${coverWord})\\b`, "i").test(text);
}

function offersKitchen(text: string) {
  const normalized = text.toLowerCase();
  if (!normalized.includes("kitchen")) return false;
  if (/\b(don't|do not|dont|never|not|no)\b[^.]{0,48}\bkitchens?\b/.test(normalized)) return false;
  if (/\bkitchens?\b[^.]{0,48}\b(don't|do not|dont|never)\b/.test(normalized)) return false;
  return /\b(we (do|remodel|install|offer|handle|can)|kitchens? (remodel|install|design)|yes)\b/.test(normalized);
}

function offersGranite(text: string) {
  const normalized = text.toLowerCase();
  if (!normalized.includes("granite")) return false;
  if (/do not install granite|don't install granite|dont install granite|not install granite|no granite/.test(normalized)) {
    return false;
  }
  return /we (install|do|offer)|yes[, ]/.test(normalized);
}

function hasOtherDollarAmount(text: string) {
  const grouped = (head: string, tail: string) => `$${head},${tail}`;
  const five = grouped("5", "000");
  const thirty = grouped("30", "000");
  const stripped = text
    .replaceAll("Starting at $5K", "")
    .replaceAll(`${five} to ${thirty}+`, "")
    .replaceAll(five, "")
    .replaceAll(`${thirty}+`, "")
    .replaceAll(thirty, "")
    .replaceAll("$5K", "");
  return /\$\s?\d/.test(stripped);
}

function hasBathroomStartingPrice(text: string) {
  const normalized = text.toLowerCase();
  const five = `$${["5", "000"].join(",")}`.toLowerCase();
  return normalized.includes("$5k") || normalized.includes(five);
}

function claimsFinalPrice(text: string) {
  return /exact price is|your exact price|final price|price is locked|locked in at|the price (?:is|will be) \$|your price (?:is|will be)|it(?:'|’)ll cost|it will cost you/i.test(text);
}

function asksMoney(text: string) {
  return /\b(ballpark|costs?|prices?|priced|pricing|how much|budget)\b/i.test(text);
}

function stripFree(text: string) {
  return text
    .replace(/\bfree\b/gi, "")
    .replace(/\s{2,}/g, " ")
    .replace(/\s+([,.!?])/g, "$1")
    .trim();
}

function steersBack(text: string) {
  return /design my bathroom|\/design\b|justin|measurement|take a look|what(?:'|’)s going on with yours|windows page|how many windows/i.test(text);
}

function withBridge(text: string) {
  const trimmed = text.trim();
  if (!trimmed) return GIGI_JUSTIN_BRIDGE;
  if (steersBack(trimmed)) return trimmed;
  const end = /[.!?]$/.test(trimmed) ? "" : ".";
  return `${trimmed}${end} ${GIGI_JUSTIN_BRIDGE}`;
}

/** Keep a live reply inside the locked rules. Null means the canned answer should be used instead. */
export function enforceGigiRules(message: string, pathname: string | undefined, raw: string) {
  let text = clip(raw);
  if (!text) return null;
  if (hasDisallowedPhone(text) || promisesCall(text)) return GIGI_JUSTIN_BRIDGE;
  if (bannedCredential(text)) return CREDENTIAL_LINE;
  if (offersKitchen(text)) return KITCHEN_LINE;
  if (offersGranite(text)) return CHAT_ANSWERS.stone;
  const windowQuestion = shouldUseWindowPrice(message, pathname);
  if (windowQuestion && (hasBathroomStartingPrice(text) || hasOtherDollarAmount(text) || claimsFinalPrice(text))) {
    return CHAT_ANSWERS.windows;
  }
  if (claimsFinalPrice(text) || hasOtherDollarAmount(text)) return PRICE_LINE;
  text = stripFree(text);
  if (!text) return null;
  // A window price that never mentions windows gets the canned line. One that already does is left as she said it.
  if (windowQuestion && asksMoney(message) && !/window/i.test(text)) return CHAT_ANSWERS.windows;
  return withBridge(text);
}

function leaksSecret(text: string, key: string | undefined) {
  return Boolean(key && key.length >= 8 && text.includes(key));
}

async function callGrok(message: string, history: GigiHistoryTurn[], fetchImpl: FetchLike) {
  const key = process.env.XAI_API_KEY;
  if (!key) throw new Error("chat unavailable");
  const prior = history.filter((turn) => !(turn.role === "user" && turn.content === message));
  const response = await fetchImpl(XAI_CHAT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: chatModel(),
      temperature: 0.4,
      max_tokens: 220,
      messages: [{ role: "system", content: GIGI_SYSTEM_PROMPT }, ...prior, { role: "user", content: message }],
    }),
    signal: AbortSignal.timeout(GIGI_CHAT_TIMEOUT_MS),
  });
  if (!response.ok) throw new Error("chat unavailable");
  const json = (await response.json().catch(() => null)) as unknown;
  const content = readContent(json);
  if (!content || leaksSecret(content, key)) throw new Error("chat unavailable");
  return content;
}

export async function gigiLiveReply(input: {
  message: string;
  session?: unknown;
  pathname?: unknown;
  history?: unknown;
  fetchImpl?: FetchLike;
}): Promise<GigiLiveResult> {
  const message = input.message.trim().slice(0, 240);
  const session = parseGigiSession(input.session);
  const pathname = typeof input.pathname === "string" ? input.pathname.slice(0, 200) : "/";
  const scripted = respond(message, session, { pathname });
  if (!message || prefersScriptedReply(message, session)) {
    return { ...scripted, source: "script" };
  }
  try {
    const raw = await callGrok(message, parseGigiHistory(input.history), input.fetchImpl ?? fetch);
    const text = enforceGigiRules(message, pathname, raw);
    if (!text || leaksSecret(text, process.env.XAI_API_KEY)) return { ...scripted, source: "fallback" };
    return { text, chips: scripted.chips, session: scripted.session, source: "model" };
  } catch {
    return { ...scripted, source: "fallback" };
  }
}
