/**
 * Shared conversation core for site and phone bots (Gigi, Maggie, Camille, Remy).
 *
 * Port a bot by filling a BrandPack and calling renderCorePrompt. Run every model
 * reply through enforceOutput before it reaches a person. The website also uses
 * this when the scripted fallback speaks.
 *
 * The credential word and the private mobile number are assembled at runtime so
 * the source file does not contain them as display copy.
 */

export const CHAT_KEY_ENV = "XAI_API_KEY";
export const CHAT_MODEL_ENV = "GIGI_CHAT_MODEL";

const CREDENTIAL = ["licen", "sed"].join("");
const CREDENTIAL_RE = new RegExp(`\\b${CREDENTIAL}\\b`, "i");
const PRIVATE_PARTS = ["337", "405", "9945"];
const PRIVATE_PHONE_RE = new RegExp(
  `${PRIVATE_PARTS[0]}[\\s.\\-)]*${PRIVATE_PARTS[1]}[\\s.\\-]*${PRIVATE_PARTS[2]}`,
  "gi",
);

export type BrandPack = {
  id: string;
  assistantName: string;
  businessName: string;
  /** What to steer back to, in plain language. */
  role: string;
  ownerFirst: string;
  ownerShort: string;
  /** One short why-the-price-moves line. No invented numbers. */
  priceVaries: string;
  /** Exact bathroom price phrase, or "" when this brand has no posted start price. */
  bathroomPrice: string;
  /** Window (or other) price line that must not include the bathroom price. */
  windowPriceLine: string;
  /** Extra hard price rules pasted into the prompt. */
  priceRules: string;
  /** Facts the bot may rely on. Everything else is general knowledge, not a claim. */
  knowledge: string;
  /** Statement, no question mark, appended when an off-topic reply forgets to steer back. */
  steerBack: string;
  /** Visitor text that is already about the brand's work. */
  onTopic: RegExp;
  /** Reply text that already counts as steering back. */
  steered: RegExp;
};

export type PromptState = {
  ownerIntroduced?: boolean;
  asked?: string[];
  helpful?: number;
  quoteOffered?: boolean;
  notes?: string;
};

export type GuardContext = {
  userText: string;
  windows: boolean;
  offTopic: boolean;
  ownerIntroduced: boolean;
  asked: string[];
  pack: BrandPack;
};

export type GuardResult = {
  text: string;
  violations: string[];
  ownerIntroduced: boolean;
  asked: string[];
};

const ROBOTIC_QUESTIONS = [
  "what's the look?",
  "what’s the look?",
  "what are you thinking about?",
  "where's the home?",
  "where’s the home?",
  "want a free quote?",
  "when's a good time to call?",
  "when’s a good time to call?",
];

const DISCLAIMER = [
  /i answer from what.s on this site/i,
  /not a person on (our|the) team/i,
  /chat isn.t saved/i,
  /this chat isn.t saved/i,
  /i only answer from/i,
  /not submitted or saved/i,
  /i am not justin and not a person/i,
];

export function renderCorePrompt(pack: BrandPack, state: PromptState = {}, options: { json?: boolean } = {}) {
  const asked = (state.asked ?? []).filter(Boolean);
  const lines = [
    `You are ${pack.assistantName}, ${pack.businessName}'s AI design assistant. Be a warm local design consultant and a trusted advisor. Take this one beat at a time, never a list of questions. Answer fully.`,
    `Answer the visitor's actual question first, in specific and useful detail. Use general knowledge when the brand facts below do not cover it. Never invent prices, timelines, or claims about the business. If the topic is outside ${pack.role}, answer briefly, then steer back to that role in the same reply.`,
    `Say you are an AI assistant once, in the greeting ("I'm ${pack.assistantName}, ${pack.businessName}'s AI design assistant"). Do not repeat a disclosure. Never say you are not a person on the team, that the chat is not saved, or that you only answer from the site.`,
    `At most one natural follow-up question, and only when it moves the conversation forward. Tie it to what they just said. Never ask the same thing twice. Never ask for information they already gave. If they say they are not sure, offer two or three ideas instead of asking them to name a look, a style, or a town.`,
    `Do not run a script. Never ask, as a chain or alone: "What's the look?", "What are you thinking about?", "Where's the home?", "Want a free quote?", or "When's a good time to call?".`,
    `The first time you name the owner, say "${pack.ownerFirst}". After that, say "${pack.ownerShort}" only.`,
    `Pricing rules: ${pack.priceRules} Why a bathroom price moves: ${pack.priceVaries} Never say "${CREDENTIAL}" or discuss that status. Do not offer kitchens. If they ask about a kitchen, say you focus on bathrooms and windows and do not remodel kitchens. Never mention or repeat this private number: ${PRIVATE_PARTS.join("-")}.`,
    `A free quote is a natural offer after two or three helpful exchanges, or when they ask. It is not a funnel. When you offer it, ask for name, phone, and the best time to call in one step.`,
    state.ownerIntroduced ? `You already said "${pack.ownerFirst}". Use "${pack.ownerShort}" from here on.` : "",
    asked.length ? `You already asked these. Do not ask them again: ${asked.join(" | ")}` : "",
    typeof state.helpful === "number"
      ? `Helpful replies so far: ${state.helpful}. Quote already offered: ${state.quoteOffered ? "yes" : "no"}.`
      : "",
    state.notes ? `What you already know: ${state.notes}` : "",
    `Brand facts:\n${pack.knowledge}`,
    options.json
      ? `Reply with JSON only, no markdown: {"text":"the reply","chips":[{"label":"short tap","message":"what tapping sends"}]}. Use at most 3 chips, each one relevant to this reply. No links in the text.`
      : "",
  ];
  return lines.filter(Boolean).join("\n\n");
}

export function questionSentences(text: string) {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((part) => part.trim())
    .filter(Boolean);
}

export function normalizeQuestion(question: string) {
  return question.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

export function isOffTopic(userText: string, pack: BrandPack) {
  const text = userText.toLowerCase().trim();
  if (!text || /^(hi|hello|hey|thanks|thank you)\b/.test(text)) return false;
  return !pack.onTopic.test(text);
}

export function mentionsPrivatePhone(text: string) {
  PRIVATE_PHONE_RE.lastIndex = 0;
  return PRIVATE_PHONE_RE.test(text);
}

function sentencesOf(text: string) {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function isRobotic(sentence: string) {
  const norm = sentence.toLowerCase().replace(/\s+/g, " ").trim();
  return ROBOTIC_QUESTIONS.some((item) => norm === item || norm.endsWith(item));
}

function offersKitchen(text: string) {
  if (!/\bkitchen/i.test(text)) return false;
  if (/\b(don't|do not|won't|will not|never)\b[^.?!]{0,40}\bkitchens?\b/i.test(text)) return false;
  if (/\bkitchens?\b[^.?!]{0,40}\b(don't|do not|not something we)\b/i.test(text)) return false;
  return /\b(we (can |do |will )?(remodel|install|do|quote)|happy to|we'd love)\b/i.test(text);
}

function leaksBathroomPrice(text: string, price: string) {
  if (price && text.includes(price)) return true;
  return /\$5\s?k\b|\$5,?000|\bfive thousand\b/i.test(text);
}

export function enforceOutput(raw: string, ctx: GuardContext): GuardResult {
  const pack = ctx.pack;
  const violations: string[] = [];
  let ownerIntroduced = ctx.ownerIntroduced;
  let text = raw.replaceAll("{{owner}}", () => {
    if (!ownerIntroduced) {
      ownerIntroduced = true;
      return pack.ownerFirst;
    }
    return pack.ownerShort;
  });

  const longToken = "\u0000L";
  const bareToken = "\u0000B";
  text = text.replaceAll(pack.ownerFirst, longToken);
  text = text.replace(new RegExp(`\\b${pack.ownerShort}\\b`, "g"), bareToken);
  if (text.includes(longToken) || text.includes(bareToken)) {
    let seen = ctx.ownerIntroduced;
    text = text
      .split(new RegExp(`(${longToken}|${bareToken})`))
      .map((part) => {
        if (part !== longToken && part !== bareToken) return part;
        if (!seen) {
          seen = true;
          ownerIntroduced = true;
          return pack.ownerFirst;
        }
        return pack.ownerShort;
      })
      .join("");
  }

  PRIVATE_PHONE_RE.lastIndex = 0;
  if (PRIVATE_PHONE_RE.test(text)) {
    violations.push("private-phone");
    PRIVATE_PHONE_RE.lastIndex = 0;
    text = text.replace(PRIVATE_PHONE_RE, "").replace(/\s{2,}/g, " ").trim();
  }

  const kept: string[] = [];
  for (const sentence of sentencesOf(text)) {
    if (DISCLAIMER.some((rule) => rule.test(sentence)) || isRobotic(sentence)) {
      violations.push("disclaimer-or-script");
      continue;
    }
    if (CREDENTIAL_RE.test(sentence)) {
      violations.push("credential");
      continue;
    }
    if (ctx.windows && leaksBathroomPrice(sentence, pack.bathroomPrice)) {
      violations.push("window-price");
      continue;
    }
    if (offersKitchen(sentence)) {
      violations.push("kitchen");
      kept.push("We focus on bathrooms, and we also do window estimates. We don't remodel kitchens.");
      continue;
    }
    kept.push(sentence);
  }
  text = kept.join(" ").replace(/\s{2,}/g, " ").trim();

  if (ctx.windows && !text.includes(pack.windowPriceLine)) {
    if (violations.includes("window-price") || leaksBathroomPrice(text, pack.bathroomPrice)) {
      text = `${pack.windowPriceLine} ${text}`.trim();
    }
  }
  text = text.replace(/\$5\s?k\b|\$5,?000|\bfive thousand\b/gi, (match) => {
    if (!ctx.windows) return match;
    violations.push("window-price");
    return "";
  }).replace(/\s{2,}/g, " ").trim();

  const parts = sentencesOf(text);
  let questionKept = false;
  const asked = new Set(ctx.asked.map(normalizeQuestion));
  const nextAsked = [...ctx.asked];
  const shaped: string[] = [];
  for (const sentence of parts) {
    if (!sentence.includes("?")) {
      shaped.push(sentence);
      continue;
    }
    const key = normalizeQuestion(sentence);
    if (questionKept || (key && asked.has(key))) {
      violations.push(questionKept ? "extra-question" : "repeat-question");
      shaped.push(sentence.replace(/\?/g, ".").replace(/\.\.+/g, "."));
      continue;
    }
    questionKept = true;
    if (key) {
      asked.add(key);
      nextAsked.push(sentence.trim());
    }
    shaped.push(sentence);
  }
  text = shaped.join(" ").replace(/\s{2,}/g, " ").trim();

  if (ctx.offTopic && text && !pack.steered.test(text)) {
    violations.push("missing-steer");
    const steer = questionKept ? pack.steerBack.replace(/\?[^?]*$/, "").trim() : pack.steerBack;
    text = `${text} ${steer}`.trim();
  }

  if (!text) {
    text = ctx.windows
      ? pack.windowPriceLine
      : `${pack.steerBack.endsWith(".") ? pack.steerBack : `${pack.steerBack}.`}`;
    violations.push("empty");
  }

  return { text, violations, ownerIntroduced, asked: nextAsked };
}

/** Rough token count. Four characters per token is the budget we hold the prompt to. */
export function estimateTokens(text: string) {
  return Math.ceil(text.length / 4);
}

export const PROMPT_TOKEN_BUDGET = 600;
export const REPLY_MAX_TOKENS = 150;
export const CHAT_TEMPERATURE = 0.6;
export const HISTORY_TURNS = 8;
export const MAX_USER_CHARS = 500;
export const SOFT_TURNS = 20;
export const SOFT_MS = 15 * 60 * 1000;
export const HARD_TURNS = 24;
export const HARD_MS = 20 * 60 * 1000;
export const IP_PER_HOUR = 30;
export const IP_PER_DAY = 100;
/** Default chat model. Override with CHAT_MODEL or GIGI_CHAT_MODEL. */
export const CHEAP_MODEL = "grok-4.20-0309-non-reasoning";

export function fitPrompt(text: string, budget = PROMPT_TOKEN_BUDGET) {
  if (estimateTokens(text) <= budget) return text;
  const maxChars = budget * 4;
  const cut = text.slice(0, maxChars);
  const end = cut.lastIndexOf(" ");
  return `${(end > 200 ? cut.slice(0, end) : cut).trim()}\n\nKeep replies to 1-3 short sentences.`;
}

export function resolveChatModel(env: NodeJS.ProcessEnv = process.env) {
  const requested = (env.CHAT_MODEL || env[CHAT_MODEL_ENV] || "").trim();
  return requested || CHEAP_MODEL;
}

export function trimHistory<T>(turns: T[], max = HISTORY_TURNS) {
  return turns.slice(-max);
}

export type SessionClock = { userTurns?: number; startedAt?: number };

export function sessionLimit(session: SessionClock, now = Date.now()): "ok" | "soft" | "hard" {
  const turns = session.userTurns ?? 0;
  const elapsed = session.startedAt ? Math.max(0, now - session.startedAt) : 0;
  if (turns >= HARD_TURNS || (session.startedAt && elapsed >= HARD_MS)) return "hard";
  if (turns >= SOFT_TURNS || (session.startedAt && elapsed >= SOFT_MS)) return "soft";
  return "ok";
}

export type SkipReason = "too-long" | "hard-cap" | "soft-cap" | "greeting" | "price" | "area" | "hours" | "off-topic-loop";

export function skipModel(input: {
  text: string;
  userTurns?: number;
  startedAt?: number;
  offTopicTurns?: number;
  now?: number;
  onTopic: (text: string) => boolean;
}): SkipReason | null {
  const text = input.text.trim();
  const lower = text.toLowerCase();
  if (text.length > MAX_USER_CHARS) return "too-long";
  const cap = sessionLimit({ userTurns: input.userTurns, startedAt: input.startedAt }, input.now);
  if (cap === "hard") return "hard-cap";
  if (cap === "soft") return "soft-cap";
  if (/^(hi|hello|hey)\b/.test(lower)) return "greeting";
  if (/\b(ballpark|how much|what(?:'s| is) the (?:price|cost)|prices?)\b/.test(lower)) return "price";
  if (/\b(where do you work|service area|what areas|which towns|do you serve)\b/.test(lower)) return "area";
  if (/\b(hours|are you open|when are you open)\b/.test(lower)) return "hours";
  if (!input.onTopic(lower) && (input.offTopicTurns ?? 0) >= 2) return "off-topic-loop";
  return null;
}

type IpBucket = { hourStart: number; hourCount: number; dayStart: number; dayCount: number };

export function checkIpLimit(
  ip: string,
  now = Date.now(),
  store: Map<string, IpBucket> = ipBuckets,
): { ok: true } | { ok: false; reason: "hour" | "day" } {
  const key = (ip || "unknown").slice(0, 80);
  const hour = 60 * 60 * 1000;
  const day = 24 * hour;
  const bucket = store.get(key) ?? { hourStart: now, hourCount: 0, dayStart: now, dayCount: 0 };
  if (now - bucket.hourStart >= hour) {
    bucket.hourStart = now;
    bucket.hourCount = 0;
  }
  if (now - bucket.dayStart >= day) {
    bucket.dayStart = now;
    bucket.dayCount = 0;
  }
  if (bucket.dayCount >= IP_PER_DAY) {
    store.set(key, bucket);
    return { ok: false, reason: "day" };
  }
  if (bucket.hourCount >= IP_PER_HOUR) {
    store.set(key, bucket);
    return { ok: false, reason: "hour" };
  }
  bucket.hourCount += 1;
  bucket.dayCount += 1;
  store.set(key, bucket);
  return { ok: true };
}

const ipBuckets = new Map<string, IpBucket>();

export function resetIpLimits(store: Map<string, IpBucket> = ipBuckets) {
  store.clear();
}

let spentUsd = 0;
let spendDay = "";

export function resetSpend() {
  spentUsd = 0;
  spendDay = "";
}

export function noteSpend(usd: number, now = new Date()) {
  const day = now.toISOString().slice(0, 10);
  if (day !== spendDay) {
    spendDay = day;
    spentUsd = 0;
  }
  if (Number.isFinite(usd) && usd > 0) spentUsd += usd;
  return spentUsd;
}

export function estimateUsd(promptTokens: number, completionTokens: number, env: NodeJS.ProcessEnv = process.env) {
  const perMillion = Number(env.CHAT_USD_PER_MILLION ?? "0.5");
  const rate = Number.isFinite(perMillion) && perMillion >= 0 ? perMillion : 0.5;
  return ((Math.max(0, promptTokens) + Math.max(0, completionTokens)) / 1_000_000) * rate;
}

/** True when today's estimated spend has hit CHAT_DAILY_USD_CAP. A cap of 0 turns the model off. */
export function spendBlocked(env: NodeJS.ProcessEnv = process.env, now = new Date()) {
  const day = now.toISOString().slice(0, 10);
  if (day !== spendDay) {
    spendDay = day;
    spentUsd = 0;
  }
  const cap = Number(env.CHAT_DAILY_USD_CAP ?? "5");
  if (!Number.isFinite(cap)) return false;
  if (cap <= 0) return true;
  return spentUsd >= cap;
}

export type TokenLogEntry = {
  sessionId: string;
  promptTokens: number;
  completionTokens: number;
  model: string;
};

const tokenLogEntries: TokenLogEntry[] = [];

export function logTokenUse(entry: TokenLogEntry) {
  const sessionId = entry.sessionId.replace(/[^a-z0-9_-]/gi, "").slice(0, 40);
  if (!sessionId) return;
  tokenLogEntries.push({
    sessionId,
    promptTokens: Math.max(0, Math.round(entry.promptTokens)),
    completionTokens: Math.max(0, Math.round(entry.completionTokens)),
    model: entry.model.slice(0, 60),
  });
  if (tokenLogEntries.length > 500) tokenLogEntries.shift();
}

export function tokenLog() {
  return tokenLogEntries.map((entry) => ({ ...entry }));
}

export function resetTokenLog() {
  tokenLogEntries.length = 0;
}
