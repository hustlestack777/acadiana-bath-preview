import assert from "node:assert/strict";
import { test } from "node:test";
import { campaignLine, cleanPath, isSitePath, leadSourceLabel, sanitizeAttribution, sourceLine } from "./lead-attribution";

test("site paths include town and product pages", () => {
  assert.equal(isSitePath("/custom-tile"), true);
  assert.equal(isSitePath("/serving-houma"), true);
  assert.equal(isSitePath("/design"), true);
  assert.equal(isSitePath("/windows"), true);
  assert.equal(isSitePath("/"), true);
  assert.equal(isSitePath("https://evil.example"), false);
  assert.equal(isSitePath("/../etc"), false);
});

test("cleanPath strips query and hash", () => {
  assert.equal(cleanPath("/serving-houma?utm_source=fb#quote"), "/serving-houma");
});

test("sanitize keeps source, referrer, and UTM fields", () => {
  const attr = sanitizeAttribution({
    sourcePage: "/serving-houma",
    formPage: "/estimate",
    landingPage: "/serving-houma",
    referrer: "https://www.google.com/",
    src: "test",
    utmSource: "google",
    utmMedium: "cpc",
    utmCampaign: "spring",
  });
  assert.equal(attr.sourcePage, "/serving-houma");
  assert.equal(attr.formPage, "/estimate");
  assert.equal(attr.referrer, "https://www.google.com/");
  assert.equal(attr.src, "test");
  assert.equal(attr.utmSource, "google");
  assert.equal(leadSourceLabel(attr.src, attr.utmSource), "test");
  assert.equal(leadSourceLabel("", "google"), "google");
  assert.equal(leadSourceLabel("", ""), "direct");
  assert.equal(sourceLine(attr.sourcePage, attr.formPage), "/serving-houma (form /estimate)");
  assert.equal(sourceLine("/design", "/design"), "/design");
  assert.equal(campaignLine("google", "cpc", "spring"), "google / cpc / spring");
});

test("unknown source pages fall back to the form page", () => {
  const attr = sanitizeAttribution({ sourcePage: "javascript:alert(1)", formPage: "/windows" }, "/windows");
  assert.equal(attr.sourcePage, "/windows");
});
