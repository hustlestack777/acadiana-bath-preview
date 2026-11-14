import assert from "node:assert/strict";
import { test } from "node:test";
import {
  computeWindowEstimate,
  formatRange,
  GET_MY_CUSTOM_QUOTE,
  parseWindowCount,
  WINDOW_PRICE_LINE,
  WINDOWS_CONSENT_TEXT,
  windowLeadSubject,
} from "./windows";

test("public window pricing does not use the bathroom starting price", () => {
  assert.equal(WINDOW_PRICE_LINE, "Window pricing depends on how many windows you need and their size. Get an estimate.");
  assert.equal(/\$5K|\$5,000|\b5,?000\b|Starting at|free|licensed|kitchen/i.test(WINDOW_PRICE_LINE), false);
});

test("button text is a single constant", () => {
  assert.equal(GET_MY_CUSTOM_QUOTE, "Get My Custom Quote");
});

test("consent text matches the approved wording", () => {
  assert.equal(
    WINDOWS_CONSENT_TEXT,
    "By submitting, you agree Acadiana Bathrooms may contact you about your quote by phone or email.",
  );
});

test("one vinyl window uses the v1 band", () => {
  const estimate = computeWindowEstimate({ standardCount: 1, bayBowCount: 0, material: "vinyl" });
  assert.ok(estimate);
  assert.equal(estimate.low, 450);
  assert.equal(estimate.high, 1350);
  assert.equal(formatRange(estimate.low, estimate.high), formatRange(450, 1350));
});

test("no minimum: a single window is a valid estimate", () => {
  assert.ok(computeWindowEstimate({ standardCount: 1, bayBowCount: 0, material: "premium" }));
});

test("15 fiberglass or wood windows", () => {
  const estimate = computeWindowEstimate({ standardCount: 15, bayBowCount: 0, material: "fiberglass-wood" });
  assert.ok(estimate);
  assert.equal(estimate.low, 6000);
  assert.equal(estimate.high, 33000);
});

test("impact-resistant glass replaces the material band", () => {
  const estimate = computeWindowEstimate({ standardCount: 10, bayBowCount: 0, material: "impact" });
  assert.ok(estimate);
  assert.equal(estimate.low, 8000);
  assert.equal(estimate.high, 20000);
});

test("bay and bow openings are added separately", () => {
  const estimate = computeWindowEstimate({ standardCount: 10, bayBowCount: 1, material: "fiberglass-wood" });
  assert.ok(estimate);
  assert.equal(estimate.standardLow, 4000);
  assert.equal(estimate.standardHigh, 22000);
  assert.equal(estimate.bayLow, 2000);
  assert.equal(estimate.bayHigh, 8000);
  assert.equal(estimate.low, 6000);
  assert.equal(estimate.high, 30000);
  assert.equal(estimate.openHigh, true);
});

test("30 windows and 30+ still multiply the same band", () => {
  const thirty = computeWindowEstimate({ standardCount: 30, bayBowCount: 0, material: "vinyl" });
  const more = computeWindowEstimate({ standardCount: 36, bayBowCount: 0, material: "vinyl" });
  assert.ok(thirty && more);
  assert.equal(thirty.low, 13500);
  assert.equal(thirty.high, 40500);
  assert.equal(more.low, 16200);
  assert.equal(more.high, 48600);
});

test("unsure count yields no dollar range", () => {
  assert.equal(parseWindowCount("unsure"), null);
  assert.equal(computeWindowEstimate({ standardCount: null, bayBowCount: 1, material: "vinyl" }), null);
});

test("not-sure material uses vinyl low through premium high", () => {
  const estimate = computeWindowEstimate({ standardCount: 1, bayBowCount: 0, material: "unsure" });
  assert.ok(estimate);
  assert.equal(estimate.low, 450);
  assert.equal(estimate.high, 3500);
});

test("test lead subjects are tagged", () => {
  const subject = windowLeadSubject("TEST Murray", "Lafayette", 8, "vinyl");
  assert.match(subject, /^\[TEST\] New window lead · TEST Murray · Lafayette · 8 windows · vinyl$/);
});
