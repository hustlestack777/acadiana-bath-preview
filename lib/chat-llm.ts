import {
  CHAT_KEY_ENV,
  checkIpLimit,
  enforceOutput,
  estimateUsd,
  isOffTopic,
  noteSpend,
  renderCorePrompt,
  resolveChatModel,
  spendBlocked,
  trimHistory,
  type GuardContext,
} from "./chat-core";
import { gigiBrand } from "./gigi-brand";
import { respond, type GigiChip, type GigiResponse, type GigiSession } from "./chat";

const XAI = "https://api.x.ai/v1";

export type ChatHistoryTurn = { role: "assistant" | "user" | "you"; text: string };

export type GigiTurnResult = GigiResponse & {
  source: "model" | "fallback";
  missingEnv?: string;
};

type FetchLike = (input: string, init?: RequestInit) => Promise<Response>;

export function notesFor(session: GigiSession) {
  const bits = [
    session.project ? `project: ${session.project}` : "",
    session.material ? `material: ${session.material}` : "",
    session.placement ? `placement: ${session.placement}` : "",
    session.location ? `town: ${session.location}` : "",
    session.lookWaived ? "they are not sure about the look" : "",
    session.name ? `name: ${session.name}` : "",
    session.callTime ? `time: ${session.callTime}` : "",
  ].filter(Boolean);
  return bits.join("; ");
}

export function guardContext(message: string, session: GigiSession, pathname?: string): GuardContext {
  const windows =
    session.project === "Windows" ||
    (/\bwindows?\b/i.test(message) && !/\b(bathrooms?|showers?|tubs?|tile)\b/i.test(message)) ||
    ((pathname || "").replace(/\/+$/, "") === "/windows" && !/\b(bathrooms?|showers?|tubs?|tile)\b/i.test(message));
  return {
    userText: message,
    windows,
    offTopic: isOffTopic(message, gigiBrand),
    ownerIntroduced: Boolean(session.ownerIntroduced),
    asked: session.asked ?? [],
    pack: gigiBrand,
  };
}

const ALLOWED_HREF = /^\/(design|estimate|windows|custom-tile|solid-surface|faq)(\b|\/|\?|#|$)/;

export function sanitizeChips(raw: unknown): GigiChip[] | null {
  if (!Array.isArray(raw)) return null;
  const chips: GigiChip[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const label = String((item as { label?: unknown }).label || "").replace(/\s+/g, " ").trim().slice(0, 40);
    if (!label) continue;
    const message = String((item as { message?: unknown }).message || label).replace(/\s+/g, " ").trim().slice(0, 80);
    const hrefRaw = (item as { href?: unknown }).href;
    const href = typeof hrefRaw === "string" && ALLOWED_HREF.test(hrefRaw) ? hrefRaw : undefined;
    chips.push(href ? { label, href } : { label, message });
    if (chips.length === 3) break;
  }
  return chips.length ? chips : null;
}

export function parseModelContent(content: string): { text: string; chips: GigiChip[] | null } {
  const trimmed = content.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
  try {
    const parsed = JSON.parse(trimmed) as { text?: unknown; chips?: unknown };
    if (typeof parsed.text === "string" && parsed.text.trim()) {
      return { text: parsed.text.trim(), chips: sanitizeChips(parsed.chips) };
    }
  } catch {
    const match = trimmed.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        const parsed = JSON.parse(match[0]) as { text?: unknown; chips?: unknown };
        if (typeof parsed.text === "string" && parsed.text.trim()) {
          return { text: parsed.text.trim(), chips: sanitizeChips(parsed.chips) };
        }
      } catch {
        /* use the raw text */
      }
    }
  }
  return { text: trimmed, chips: null };
}

export async function completeChat(
  input: {
    system: string;
    messages: { role: "user" | "assistant"; content: string }[];
  },
  deps: { env?: NodeJS.ProcessEnv; fetchImpl?: FetchLike } = {},
): Promise<{ ok: true; content: string } | { ok: false; missingEnv?: string; error: string }> {
  const env = deps.env ?? process.env;
  const key = env[CHAT_KEY_ENV];
  if (!key || !String(key).trim()) {
    return { ok: false, missingEnv: CHAT_KEY_ENV, error: `${CHAT_KEY_ENV} is not set` };
  }
  const fetchImpl = deps.fetchImpl ?? fetch;
  const model = resolveChatModel(env);
  try {
    const response = await fetchImpl(`${XAI}/chat/completions`, {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        temperature: 0.6,
        messages: [{ role: "system", content: input.system }, ...input.messages],
      }),
      signal: AbortSignal.timeout(25_000),
    });
    if (!response.ok) return { ok: false, error: `chat http ${response.status}` };
    const json = (await response.json().catch(() => null)) as { choices?: Array<{ message?: { content?: string } }> } | null;
    const content = json?.choices?.[0]?.message?.content;
    if (!content || !content.trim()) return { ok: false, error: "empty model reply" };
    return { ok: true, content };
  } catch (error) {
    const name = error instanceof Error ? error.name : "Error";
    return { ok: false, error: name === "TimeoutError" ? "chat timeout" : "chat request failed" };
  }
}

function toModelRole(role: ChatHistoryTurn["role"]): "user" | "assistant" {
  return role === "assistant" ? "assistant" : "user";
}

export async function gigiTurn(
  message: string,
  session: GigiSession = { phase: "intro" },
  context: { pathname?: string; history?: ChatHistoryTurn[]; ip?: string } = {},
  deps: { env?: NodeJS.ProcessEnv; fetchImpl?: FetchLike } = {},
): Promise<GigiTurnResult> {
  const env = deps.env ?? process.env;
  const scripted = respond(message, session, { pathname: context.pathname });
  if (context.ip && !checkIpLimit(context.ip).ok) {
    return {
      text: "That's a lot of messages from this connection. Call (337) 522-0023 or use the quote form, and try the chat again later.",
      chips: [{ label: "Get my free quote", href: "/estimate#start" }],
      session,
      source: "fallback",
    };
  }
  if (!env[CHAT_KEY_ENV] || !String(env[CHAT_KEY_ENV]).trim()) {
    return { ...scripted, source: "fallback", missingEnv: CHAT_KEY_ENV };
  }
  if (spendBlocked(env)) return { ...scripted, source: "fallback" };
  const history = trimHistory(context.history ?? []).map((turn) => ({
    role: toModelRole(turn.role),
    content: turn.text.slice(0, 2000),
  }));
  const prior = history.filter((turn, index) => !(index === history.length - 1 && turn.role === "user" && turn.content === message));
  const messages = [...prior, { role: "user" as const, content: message.slice(0, 2000) }];
  const system = renderCorePrompt(
    gigiBrand,
    {
      ownerIntroduced: session.ownerIntroduced,
      asked: session.asked,
      helpful: session.helpful,
      quoteOffered: session.quoteOffered,
      notes: notesFor(session),
    },
    { json: true },
  );
  const completed = await completeChat({ system, messages }, { ...deps, env });
  if (!completed.ok) return { ...scripted, source: "fallback", missingEnv: completed.missingEnv };
  noteSpend(estimateUsd(system.length / 4, completed.content.length / 4, env));
  const parsed = parseModelContent(completed.content);
  const guarded = enforceOutput(parsed.text, guardContext(message, session, context.pathname));
  if (!guarded.text.trim()) return { ...scripted, source: "fallback" };
  return {
    text: guarded.text,
    chips: parsed.chips ?? scripted.chips,
    session: {
      ...scripted.session,
      ownerIntroduced: guarded.ownerIntroduced || scripted.session.ownerIntroduced,
      asked: guarded.asked,
    },
    source: "model",
  };
}
