import assert from "node:assert/strict";
import { test } from "node:test";
import { brand, faqs, heroQuoteLine, solidPath } from "./copy";
import { warrantyPlainText } from "./warranty";
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
import { MAIN_TOWNS, OUTSIDE_AREA } from "./coverage";
import { AI_SEARCH_USER_AGENTS, EXCLUDED_SERVICE_AREAS, SCHEMA_PARISHES, SCHEMA_PRICE_RANGE, SCHEMA_SERVICE_AREA, SITE_NAME, SITE_PHONE, SITE_SAME_AS, SITE_SHORT_NAME, SITE_TELEPHONE, VISIBLE_SERVICES } from "./site";
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
  assert.equal("founder" in data, false);
  assert.equal(data.hasOfferCatalog["@type"], "OfferCatalog");
  const serviceNames = data.hasOfferCatalog.itemListElement.map((item: { name: string }) => item.name);
  for (const service of VISIBLE_SERVICES) {
    assert.ok(serviceNames.includes(service.name), service.name);
  }
  assert.ok(serviceNames.includes("Window replacement"));
  assert.deepEqual(data.sameAs, [...SITE_SAME_AS]);
  assert.deepEqual(assertSafeJsonLd(data), []);
  const names = JSON.stringify(data.areaServed);
  for (const city of requiredCities) {
    assert.match(names, new RegExp(city));
  }
  for (const city of MAIN_TOWNS) {
    assert.match(names, new RegExp(city));
  }
  assert.match(names, /Acadiana/);
  for (const parish of SCHEMA_PARISHES) {
    assert.match(names, new RegExp(`${parish} Parish`));
  }
  assert.match(names, /Cameron Parish/);
  assert.match(names, /Avoyelles Parish/);
  assert.match(names, /Pointe Coupee Parish/);
  assert.equal(data.description.includes(SCHEMA_SERVICE_AREA), true);
  for (const excluded of EXCLUDED_SERVICE_AREAS) {
    assert.equal(names.includes(excluded), false, excluded);
    assert.equal(data.description.includes(excluded), false, excluded);
  }
  assert.equal(names.includes("Jefferson Parish"), false);
  assert.equal(data.description.includes("Jefferson Parish"), false);
});

test("service JSON-LD is present for both service paths and has no reviews", () => {
  const solid = solidSurfaceServiceJsonLd();
  const tile = customTileServiceJsonLd();
  assert.equal(solid["@type"], "Service");
  assert.equal(tile["@type"], "Service");
  assert.match(solid.url, /\/solid-surface$/);
  assert.match(tile.url, /\/custom-tile$/);
  assert.match(solid.description, /We stand behind our work/);
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
  assert.equal(homeFaqs[5].q, "Do you work outside your service area?");
  assert.match(homeFaqs[5].a, /Outside our area\? Ask for a quote\./);
  for (const item of homeFaqs) {
    assert.ok(geoFaqs.some((faq) => faq.q === item.q && faq.a === item.a), item.q);
  }
  const cost = geoFaqs.find((faq) => faq.q === "How much does a bathroom remodel cost in South Louisiana?");
  assert.ok(cost);
  assert.match(cost.a, /Starting at \$7K, with most projects \$7,000 to \$30,000\+/);
  assert.match(cost.a, /See your new bathroom before you spend a dime/);
  assert.match(cost.a, /you'll get your exact price right then/);
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
  for (const path of ["/solid-surface", "/custom-tile", "/gallery", "/design", "/estimate", "/faq", "/areas", "/privacy", "/windows"]) {
    assert.ok(urls.some((url) => url.endsWith(path)), path);
  }
  assert.equal(urls.some((url) => url.includes("/api/")), false);
  assert.equal(urls.some((url) => url.includes("/serving-")), false);

  const live = buildSitemap(true).map((entry) => entry.url);
  assert.equal(towns.length, 25);
  for (const town of towns) {
    assert.ok(live.some((url) => url.endsWith(townPath(town.slug))), town.slug);
  }
  assert.ok(live.some((url) => url.endsWith("/windows")));
});

test("cleared FAQ and town copy has no windows mentions and town schema is area-only", () => {
  const blob = [geoFaqs, towns].map((value) => JSON.stringify(value)).join("\n");
  assert.equal(/window/i.test(blob), false);
  assert.equal(/older home|remodeling an older|historic home/i.test(blob), false);
  assert.equal(blob.includes("Don't see your town"), false);
  assert.equal(/hotel/i.test(blob), false);
  for (const excluded of EXCLUDED_SERVICE_AREAS) {
    assert.equal(blob.includes(excluded), false, excluded);
  }
  assert.equal(geoFaqs.length, 16);
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
  assert.match(text, /\/windows/);
  assert.match(text, /Lagniappe Realm Labs LLC/);
  assert.equal(text.includes(SCHEMA_SERVICE_AREA), true);
  for (const excluded of EXCLUDED_SERVICE_AREAS) {
    assert.equal(text.includes(excluded), false, excluded);
  }
  assert.match(text, new RegExp(heroQuoteLine.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.match(text, new RegExp(solidPath.warranty.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.match(text, new RegExp(warrantyPlainText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.match(text, /\/faq/);
  assert.match(text, /\/areas/);
  assert.match(text, /\/about/);
  assert.equal(text.includes("Owned and run by Justin"), false);
  for (const town of towns) {
    assert.match(text, new RegExp(`/serving-${town.slug}`));
  }
  assert.equal(text.includes(OUTSIDE_AREA), true);
  assert.equal(OUTSIDE_AREA, "Outside our area? Ask for a quote.");
  assert.equal(text.includes("Don't see your town"), false);
  assert.equal(text.includes("hotel"), false);
  assert.equal(/travel/i.test(text), false);
  const publicBlob = [geoFaqs, towns, text, businessJsonLd().description].map((value) => JSON.stringify(value)).join("\n");
  assert.equal(/travel built into|Reach out anyway|outside the area/i.test(publicBlob), false);
  assert.equal(/\btravel/i.test(publicBlob), false);
  const withoutWarranty = text.replaceAll(warrantyPlainText, "");
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
    assert.equal(withoutWarranty.toLowerCase().includes(banned.toLowerCase()), false, banned);
  }
});

test("JSON-LD has no consult or in-home wording, and town meta descriptions are short and unique", () => {
  const business = JSON.stringify(businessJsonLd());
  const faqsSchema = JSON.stringify(faqPageJsonLd(geoFaqs));
  const townSchema = towns.map((town) => JSON.stringify(townAreaJsonLd(town))).join("\n");
  const blob = [business, faqsSchema, townSchema, JSON.stringify(geoFaqs)].join("\n");
  assert.equal(/consult(?!ant)/i.test(blob), false);
  assert.equal(/in your home|in-home|comes to your home/i.test(blob), false);
  const descriptions = towns.map((town) => town.description);
  assert.equal(new Set(descriptions).size, towns.length);
  for (const town of towns) {
    assert.ok(town.description.length <= 180, town.slug);
    assert.match(town.description, new RegExp(town.name));
    assert.equal(/consult(?!ant)|in your home|older home/i.test(town.description), false, town.slug);
  }
});
