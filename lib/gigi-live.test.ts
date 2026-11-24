import assert from "node:assert/strict";
import { test } from "node:test";
import { CHAT_ANSWERS, GIGI_JUSTIN_BRIDGE, GIGI_SYSTEM_PROMPT, respond } from "./chat";
import { gigiLiveReply, type GigiHistoryTurn } from "./gigi-live";
import { WINDOW_PRICE_LINE } from "./windows";

const hiddenPhone = ["337", "405", "9945"].join("-");
const licenseWord = ["licen", "sed"].join("");
const insuredWord = ["insu", "red"].join("");
const kitchenWord = ["kit", "chen"].join("");

function modelReply(content: string, status = 200): typeof fetch {
  return async (_url, init) => {
    const body = JSON.parse(String(init?.body ?? "{}")) as {
      messages?: Array<{ role?: string; content?: string }>;
      model?: string;
    };
    const headers = new Headers(init?.headers);
    const key = process.env.XAI_API_KEY ?? "";
    assert.equal(headers.get("authorization"), `Bearer ${key}`);
    assert.equal(JSON.stringify(body).includes(key), false);
    assert.equal(body.messages?.[0]?.role, "system");
    assert.match(body.messages?.[0]?.content ?? "", /Open conversation and steer-back/);
    assert.match(body.messages?.[0]?.content ?? "", /Justin is the owner/);
    assert.equal(/do not name a person as the owner/i.test(body.messages?.[0]?.content ?? ""), false);
    return new Response(JSON.stringify({ choices: [{ message: { content } }] }), {
      status,
      headers: { "Content-Type": "application/json" },
    });
  };
}

async function withQuietConsole(run: () => Promise<void>) {
  const key = "test-key-value";
  const previous = process.env.XAI_API_KEY;
  const methods = ["log", "info", "warn", "error", "debug"] as const;
  const originals = methods.map((method) => [method, console[method]] as const);
  const lines: string[] = [];
  process.env.XAI_API_KEY = key;
  for (const method of methods) {
    console[method] = (...args: unknown[]) => {
      lines.push(args.map((arg) => String(arg)).join(" "));
    };
  }
  try {
    await run();
    assert.equal(lines.some((line) => line.includes(key)), false);
  } finally {
    if (previous === undefined) delete process.env.XAI_API_KEY;
    else process.env.XAI_API_KEY = previous;
    for (const [method, original] of originals) console[method] = original;
  }
}

test("Gigi's prompt may name Justin and keeps the steer-back rules", () => {
  assert.match(GIGI_SYSTEM_PROMPT, /Justin is the owner, and you may name him/);
  assert.match(GIGI_SYSTEM_PROMPT, new RegExp(GIGI_JUSTIN_BRIDGE.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.equal(/do not name a person as the owner/i.test(GIGI_SYSTEM_PROMPT), false);
  assert.match(GIGI_SYSTEM_PROMPT, /Open conversation and steer-back/);
  assert.match(GIGI_SYSTEM_PROMPT, /You are chat only/);
  assert.match(GIGI_SYSTEM_PROMPT, /Never use the word free/);
  assert.match(GIGI_SYSTEM_PROMPT, /never windows/i);
  assert.match(GIGI_SYSTEM_PROMPT, /exact price comes after measurements/i);
  assert.match(GIGI_SYSTEM_PROMPT, /Never offer kitchen work/);
  assert.equal(new RegExp(`\\b${licenseWord}\\b`, "i").test(GIGI_SYSTEM_PROMPT), false);
  assert.equal(GIGI_SYSTEM_PROMPT.includes(hiddenPhone), false);
});

test("an off-topic message is answered and steered back to Justin or Design My Bathroom", async () => {
  const message = "who's going to win the saints game this weekend?";
  await withQuietConsole(async () => {
    const seen: string[] = [];
    const result = await gigiLiveReply({
      message,
      history: [{ role: "assistant", content: "Hey! I’m Gigi." }] satisfies GigiHistoryTurn[],
      fetchImpl: async (url, init) => {
        seen.push(String(url));
        const body = JSON.parse(String(init?.body ?? "{}")) as { messages?: Array<{ role?: string; content?: string }> };
        assert.equal(body.messages?.at(-1)?.content, message);
        assert.equal(body.messages?.some((turn) => turn.role === "assistant" && turn.content === "Hey! I’m Gigi."), true);
        return modelReply("Hard to say this early. Geaux Saints.")(url, init);
      },
    });
    assert.equal(seen.length, 1);
    assert.equal(result.source, "model");
    assert.match(result.text, /Geaux Saints/);
    assert.match(result.text, new RegExp(GIGI_JUSTIN_BRIDGE.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    assert.notEqual(result.text, respond(message).text);
    assert.equal(result.session.phase, respond(message).session.phase);
  });
});

test("a live reply that already steers back is kept", async () => {
  const steered = "That's a full house. Want to see what a walk-in shower would look like? Tap Design My Bathroom.";
  await withQuietConsole(async () => {
    const result = await gigiLiveReply({
      message: "having the whole family over for thanksgiving",
      fetchImpl: modelReply(steered),
    });
    assert.equal(result.source, "model");
    assert.equal(result.text, steered);
    assert.equal(result.text.includes(GIGI_JUSTIN_BRIDGE), false);
  });
});

test("an API error or timeout falls back to the canned answer", async () => {
  const message = "tell me something about the weather in lafayette";
  const canned = respond(message);
  await withQuietConsole(async () => {
    const errored = await gigiLiveReply({
      message,
      fetchImpl: async () => new Response("nope", { status: 500 }),
    });
    assert.equal(errored.source, "fallback");
    assert.equal(errored.text, canned.text);
    assert.deepEqual(errored.chips, canned.chips);
    assert.deepEqual(errored.session, canned.session);

    const timedOut = await gigiLiveReply({
      message,
      fetchImpl: async () => {
        throw new DOMException("The operation was aborted due to timeout", "TimeoutError");
      },
    });
    assert.equal(timedOut.source, "fallback");
    assert.equal(timedOut.text, canned.text);

    const previous = process.env.XAI_API_KEY;
    delete process.env.XAI_API_KEY;
    let called = false;
    const missing = await gigiLiveReply({
      message,
      fetchImpl: async () => {
        called = true;
        return new Response("{}", { status: 200 });
      },
    });
    if (previous === undefined) delete process.env.XAI_API_KEY;
    else process.env.XAI_API_KEY = previous;
    assert.equal(called, false);
    assert.equal(missing.source, "fallback");
    assert.equal(missing.text, canned.text);
  });
});

test("live replies keep the locked rules", async () => {
  await withQuietConsole(async () => {
    const credential = await gigiLiveReply({
      message: `are you ${licenseWord} and ${insuredWord}?`,
      fetchImpl: modelReply(`Yes, we are ${licenseWord} and ${insuredWord}.`),
    });
    assert.equal(credential.source, "model");
    assert.equal(credential.text, CREDENTIAL_LINE());
    assert.equal(new RegExp(licenseWord, "i").test(credential.text), false);
    assert.equal(new RegExp(insuredWord, "i").test(credential.text), false);

    const kitchen = await gigiLiveReply({
      message: `do you remodel ${kitchenWord}s?`,
      fetchImpl: modelReply(`Yes, we remodel ${kitchenWord}s too.`),
    });
    assert.equal(kitchen.text, "We focus on bathrooms. What's going on with yours?");
    assert.equal(new RegExp(kitchenWord, "i").test(kitchen.text), false);

    const refusedKitchen = await gigiLiveReply({
      message: `what about a ${kitchenWord}?`,
      fetchImpl: modelReply(`We do not do ${kitchenWord}s. We focus on bathrooms.`),
    });
    assert.match(refusedKitchen.text, /focus on bathrooms/i);
    assert.match(refusedKitchen.text, /Justin to come take a look/);

    const windows = await gigiLiveReply({
      message: "how much do windows cost?",
      fetchImpl: modelReply("Windows start at $5K, same as a bathroom."),
    });
    assert.equal(windows.text, CHAT_ANSWERS.windows);
    assert.equal(/\$5K|\$5,000/.test(windows.text), false);
    assert.match(windows.text, new RegExp(WINDOW_PRICE_LINE.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));

    const phone = await gigiLiveReply({
      message: "can you call me?",
      fetchImpl: modelReply(`I'll call you this afternoon at ${hiddenPhone}.`),
    });
    assert.equal(phone.text, GIGI_JUSTIN_BRIDGE);
    assert.equal(phone.text.includes(hiddenPhone), false);
    assert.equal(/\bI(?:'|’)ll call\b/i.test(phone.text), false);

    const free = await gigiLiveReply({
      message: "is the visit free?",
      fetchImpl: modelReply("Yes, the visit is free."),
    });
    assert.equal(/\bfree\b/i.test(free.text), false);
    assert.match(free.text, /Justin to come take a look/);

    const price = await gigiLiveReply({
      message: "how much does a bathroom remodel cost?",
      fetchImpl: modelReply("Your exact price is $14,500 and that is the final price."),
    });
    assert.equal(price.source, "model");
    assert.match(price.text, /Bathrooms start at \$5K/);
    assert.match(price.text, /exact price comes after measurements/);
    assert.equal(price.text.includes("14,500"), false);
    assert.equal(/final price/i.test(price.text), false);
    assert.equal(price.session.phase, "project");
  });
});

test("lead capture steps stay on the canned flow and do not call xAI", async () => {
  await withQuietConsole(async () => {
    let called = false;
    const result = await gigiLiveReply({
      message: "Morning",
      session: { phase: "callTime", project: "Tub to shower", look: "Modern & clean", location: "Lafayette" },
      fetchImpl: async () => {
        called = true;
        throw new Error("should not call");
      },
    });
    assert.equal(called, false);
    assert.equal(result.source, "script");
    assert.equal(result.text, CHAT_ANSWERS.callDay);
    assert.equal(result.session.phase, "callDay");
    assert.equal(result.session.callTime, "morning");
  });
});

function CREDENTIAL_LINE() {
  return `Our team can go over that when we set a time. ${GIGI_JUSTIN_BRIDGE}`;
}
