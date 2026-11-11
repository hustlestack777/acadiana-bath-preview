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
  townAreaJsonLd,
} from "./schema";
import { AI_SEARCH_USER_AGENTS, EXCLUDED_SERVICE_AREAS, SCHEMA_PRICE_RANGE, SCHEMA_SERVICE_AREA, SITE_NAME, SITE_PHONE, SITE_SHORT_NAME, SITE_TELEPHONE, VISIBLE_SERVICES } from "./site";
import { geoFaqs, homeFaqs } from "./faq-page";
import { buildSitemap } from "./sitemap-config";
import { townPath, towns } from "./towns";

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
  assert.equal(SITE_PHONE, "(337) 522-0023");
  assert.ok(data.url);
  assert.ok(data.logo);
  assert.equal("address" in data, false);
  assert.equal("aggregateRating" in data, false);
  assert.equal(data.priceRange, SCHEMA_PRICE_RANGE);
  assert.equal(data.hasOfferCatalog["@type"], "OfferCatalog");
  const serviceNames = data.hasOfferCatalog.itemListElement.map((item: { name: string }) => item.name);
  for (const service of VISIBLE_SERVICES) {
    assert.ok(serviceNames.includes(service.name), service.name);
  }
  assert.equal(serviceNames.some((name: string) => /window/i.test(name)), false);
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
  assert.match(solid.description, /Lifetime Guarantee/);
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
  assert.equal(homeFaqs.length, 6);
  assert.equal(homeFaqs[5].q, "What materials do you use?");
  assert.match(homeFaqs[5].a, /Onyx is a preferred material/);
  for (const item of homeFaqs) {
    assert.ok(geoFaqs.some((faq) => faq.q === item.q && faq.a === item.a), item.q);
  }
  const cost = geoFaqs.find((faq) => faq.q === "How much does a bathroom remodel cost in South Louisiana?");
  assert.ok(cost);
  assert.match(cost.a, /Starting at \$5K, with most projects \$5K–\$30K\+/);
  assert.match(cost.a, /See your new bathroom in about a minute\. Justin follows up with your exact price at a free consult\./);
  assert.equal(cost.link?.text, "See your new bathroom");
  assert.equal(cost.link?.href, "/design");
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
    assert.equal(rule.disallow?.includes("/windows"), false);
    assert.ok(rule.disallow?.includes("/api/"));
  }
  assert.match(String(live.sitemap), /\/sitemap.xml$/);
});

test("sitemap lists public pages, includes lastmod, and omits town pages until go-live", () => {
  const preview = buildSitemap(false);
  const urls = preview.map((entry) => entry.url);
  assert.ok(preview.every((entry) => entry.lastModified));
  assert.ok(urls.some((url) => url.endsWith("onrender.com") || url.endsWith("onrender.com/")));
  for (const path of ["/solid-surface", "/custom-tile", "/design", "/estimate", "/faq", "/privacy"]) {
    assert.ok(urls.some((url) => url.endsWith(path)), path);
  }
  assert.equal(urls.some((url) => url.includes("/windows")), false);
  assert.equal(urls.some((url) => url.includes("/api/")), false);
  assert.equal(urls.some((url) => url.includes("/serving-")), false);

  const live = buildSitemap(true).map((entry) => entry.url);
  assert.equal(towns.length, 3);
  for (const town of towns) {
    assert.ok(live.some((url) => url.endsWith(townPath(town.slug))), town.slug);
  }
  assert.equal(live.some((url) => url.includes("/windows")), false);
});

test("cleared FAQ and town copy has no windows mentions and town schema is area-only", () => {
  const blob = [geoFaqs, towns].map((value) => JSON.stringify(value)).join("\n");
  assert.equal(/window/i.test(blob), false);
  assert.equal(geoFaqs.length, 12);
  for (const town of towns) {
    const data = townAreaJsonLd(town);
    assert.equal(data["@type"], "WebPage");
    assert.equal("address" in data, false);
    assert.equal(JSON.stringify(data).includes("streetAddress"), false);
    assert.match(data.url, new RegExp(`/serving-${town.slug}$`));
    assert.deepEqual(assertSafeJsonLd(data), []);
  }
});

test("llms.txt summarizes the business without banned claims", () => {
  const text = llmsTxt();
  assert.match(text, new RegExp(SITE_NAME));
  assert.match(text, /\(337\) 522-0023/);
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
  assert.match(text, /\/faq/);
  assert.match(text, /\/serving-lake-charles/);
  assert.match(text, /\/serving-baton-rouge/);
  assert.match(text, /\/serving-houma/);
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
    "window",
  ]) {
    assert.equal(text.toLowerCase().includes(banned.toLowerCase()), false, banned);
  }
});
