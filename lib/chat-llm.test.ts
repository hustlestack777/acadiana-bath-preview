import assert from "node:assert/strict";
import test from "node:test";
import { checkIpLimit, IP_PER_HOUR, resetSpend, spendBlocked } from "./chat-core";
import { gigiTurn } from "./chat-llm";

test("the daily spend kill switch uses the scripted reply and does not call the model", async () => {
  resetSpend();
  let called = false;
  const result = await gigiTurn("penny tile?", { phase: "intro" }, {}, {
    env: { XAI_API_KEY: "present", CHAT_DAILY_USD_CAP: "0" } as NodeJS.ProcessEnv,
    fetchImpl: async () => {
      called = true;
      throw new Error("should not call");
    },
  });
  assert.equal(called, false);
  assert.equal(result.source, "fallback");
  assert.match(result.text, /penny/i);
  assert.equal(spendBlocked({ CHAT_DAILY_USD_CAP: "0" } as NodeJS.ProcessEnv), true);
  resetSpend();
});

test("a missing model key is reported by env var name and falls back", async () => {
  const result = await gigiTurn("hello", { phase: "intro" }, {}, {
    env: {} as NodeJS.ProcessEnv,
    fetchImpl: async () => {
      throw new Error("should not call");
    },
  });
  assert.equal(result.missingEnv, "XAI_API_KEY");
  assert.equal(result.source, "fallback");
  assert.equal(result.text.includes("XAI_API_KEY"), false);
});

test("per-IP abuse limit blocks after the hourly cap", () => {
  const store = new Map();
  const now = Date.now();
  for (let i = 0; i < IP_PER_HOUR; i += 1) {
    assert.equal(checkIpLimit("203.0.113.5", now, store).ok, true);
  }
  const blocked = checkIpLimit("203.0.113.5", now, store);
  assert.equal(blocked.ok, false);
  if (!blocked.ok) assert.equal(blocked.reason, "hour");
  assert.equal(checkIpLimit("203.0.113.9", now, store).ok, true);
});
