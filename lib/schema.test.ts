import assert from "node:assert/strict";
import { test } from "node:test";
import { brand, faqs, heroQuoteLine, solidPath } from "./copy";
import { llmsTxt } from "./llms-txt";
import { buildRobots } from "./robots-config";
import {
  assertSafeJsonLd,
  businessJsonLd,
  customTileServiceJsonLd,
  faqPageJsonLd,
  solidSurfaceServiceJsonLd,
} from "./schema";
import { AI_SEARCH_USER_AGENTS, EXCLUDED_SERVICE_AREAS, SCHEMA_SERVICE_AREA, SITE_NAME, SITE_PHONE, SITE_SHORT_NAME, SITE_TELEPHONE } from "./site";
import { towns } from "./towns";
import sitemap from "../app/sitemap";

const requiredCities = [
  "Lafayette",
  "Lake Charles",
  "Alexandria",
  "Baton Rouge",
  "Prairieville",
  "Gonzales",
  "Houma",
  "Thibodaux",
];

test("business JSON-LD is a service-area HomeAndConstructionBusiness", () => {
  const data = businessJsonLd();
  assert.equal(data["@type"], "HomeAndConstructionBusiness");
  assert.equal(data.name, brand.name);
  assert.equal(data.name, SITE_NAME);
  assert.equal(data.alternateName, SITE_SHORT_NAME);
  assert.equal(data.telephone, SITE_TELEPHONE);
  assert.match(data.telephone, /337-522-0023/);
  assert.equal(SITE_PHONE, "337-522-0023");
  assert.ok(data.url);
  assert.ok(data.logo);
  assert.equal(data.address["@type"], "PostalAddress");
  assert.equal(data.address.addressLocality, "Lafayette");
  assert.equal(data.address.addressRegion, "LA");
  assert.equal("streetAddress" in data.address, false);
  assert.equal("aggregateRating" in data, false);
  assert.deepEqual(assertSafeJsonLd(data), []);
  const names = JSON.stringify(data.areaServed);
  for (const city of requiredCities) {
    assert.match(names, new RegExp(city));
  }
  assert.match(names, /Acadiana/);
  assert.match(names, /Calcasieu Parish/);
  assert.equal(data.description.includes(SCHEMA_SERVICE_AREA), true);
  for (const excluded of EXCLUDED_SERVICE_AREAS) {
    assert.equal(names.includes(excluded), false, excluded);
    assert.equal(data.description.includes(excluded), false, excluded);
  }
});

test("service JSON-LD is present for both service paths and has no reviews", () => {
  const solid = solidSurfaceServiceJsonLd();
  const tile = customTileServiceJsonLd();
  assert.equal(solid["@type"], "Service");
  assert.equal(tile["@type"], "Service");
  assert.match(solid.url, /\/solid-surface$/);
  assert.match(tile.url, /\/custom-tile$/);
  assert.match(solid.description, /Lifetime material warranty on solid surface/);
  assert.equal(tile.description.includes("warranty"), false);
  assert.deepEqual(assertSafeJsonLd(solid), []);
  assert.deepEqual(assertSafeJsonLd(tile), []);
  assert.equal(solid.provider.name, brand.name);
  assert.equal(solid.provider.telephone, SITE_TELEPHONE);
});

test("FAQPage schema is built only from the visible questions passed in", () => {
  const empty = faqPageJsonLd([]);
  assert.equal(empty["@type"], "FAQPage");
  assert.equal(empty.mainEntity.length, 0);
  const home = faqPageJsonLd(faqs);
  assert.equal(home.mainEntity.length, faqs.length);
  assert.equal(home.mainEntity[0]["@type"], "Question");
  assert.equal(home.mainEntity[0].acceptedAnswer["@type"], "Answer");
  assert.equal(home.mainEntity[0].name, faqs[0].q);
  assert.equal(home.mainEntity[0].acceptedAnswer.text, faqs[0].a);
  assert.deepEqual(assertSafeJsonLd(home), []);
});

test("preview robots.txt is disallow-all and hides the sitemap", () => {
  const preview = buildRobots(false);
  assert.deepEqual(preview.rules, { userAgent: "*", disallow: "/" });
  assert.equal("sitemap" in preview, false);
});

test("go-live robots.txt allows AI crawlers and advertises the sitemap", () => {
  const live = buildRobots(true);
  const rules = Array.isArray(live.rules) ? live.rules : [live.rules];
  const agents = rules.map((rule) => rule.userAgent);
  for (const agent of AI_SEARCH_USER_AGENTS) {
    assert.ok(agents.includes(agent), agent);
  }
  assert.ok(agents.includes("*"));
  for (const rule of rules) {
    assert.equal(rule.allow, "/");
    assert.ok(rule.disallow?.includes("/windows"));
    assert.ok(rule.disallow?.includes("/api/"));
  }
  assert.match(String(live.sitemap), /\/sitemap.xml$/);
});

test("sitemap lists public pages and omits windows, api, and empty town routes", () => {
  const urls = sitemap().map((entry) => entry.url);
  assert.ok(urls.some((url) => url.endsWith("onrender.com") || url.endsWith("onrender.com/")));
  for (const path of ["/solid-surface", "/custom-tile", "/design", "/estimate", "/privacy"]) {
    assert.ok(urls.some((url) => url.endsWith(path)), path);
  }
  assert.equal(urls.some((url) => url.includes("/windows")), false);
  assert.equal(urls.some((url) => url.includes("/api/")), false);
  assert.equal(towns.length, 0);
  assert.equal(urls.some((url) => url.includes("/areas/")), false);
});

test("llms.txt summarizes the business without banned claims", () => {
  const text = llmsTxt();
  assert.match(text, new RegExp(SITE_NAME));
  assert.match(text, /337-522-0023/);
  assert.match(text, /\/solid-surface/);
  assert.match(text, /\/custom-tile/);
  assert.match(text, /\/estimate/);
  assert.match(text, /Lagniappe Realm Labs LLC/);
  assert.equal(text.includes(SCHEMA_SERVICE_AREA), true);
  for (const excluded of EXCLUDED_SERVICE_AREAS) {
    assert.equal(text.includes(excluded), false, excluded);
  }
  assert.match(text, new RegExp(heroQuoteLine.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.match(text, new RegExp(solidPath.warranty.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  for (const banned of [
    "Onyx",
    "Pella",
    "licensed",
    "insured",
    "deposit",
    "timeline",
    "weeks",
    "days to complete",
    "aggregateRating",
  ]) {
    assert.equal(text.toLowerCase().includes(banned.toLowerCase()), false, banned);
  }
});
