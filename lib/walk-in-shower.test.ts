import assert from "node:assert/strict";
import { test } from "node:test";
import { walkInPage } from "./copy";
import { llmsTxt } from "./llms-txt";
import { assertSafeJsonLd, businessJsonLd, walkInShowerServiceJsonLd } from "./schema";
import { buildSitemap } from "./sitemap-config";
import { WALK_IN_SHOWER_PATH, WALK_IN_SHOWER_URL } from "./site";

test("walk-in shower service JSON-LD is Lafayette and the public page", () => {
  const data = walkInShowerServiceJsonLd();
  assert.equal(data["@type"], "Service");
  assert.equal(data.name, "Walk-in showers in Lafayette");
  assert.equal(data.serviceType, "Custom walk-in showers");
  assert.equal(data.url, WALK_IN_SHOWER_URL);
  assert.equal(data.url, "https://abclafayette.com/walk-in-shower-lafayette");
  assert.equal(data.areaServed["@type"], "City");
  assert.equal(data.areaServed.name, "Lafayette");
  assert.equal("address" in data, false);
  assert.equal("streetAddress" in data, false);
  assert.deepEqual(assertSafeJsonLd(data), []);
  assert.equal(walkInPage.price, "Starting at $7K");
  assert.equal(walkInPage.path, WALK_IN_SHOWER_PATH);
  const catalog = businessJsonLd().hasOfferCatalog.itemListElement.find(
    (item: { serviceType: string; url: string }) => item.serviceType === "Custom walk-in showers",
  );
  assert.ok(catalog);
  assert.equal(catalog.url, "https://abclafayette.com/walk-in-shower-lafayette");
});

test("sitemap and llms.txt include the Lafayette walk-in page", () => {
  const urls = buildSitemap(false).map((entry) => entry.url);
  assert.ok(urls.some((url) => url.endsWith(WALK_IN_SHOWER_PATH)));
  assert.match(llmsTxt(), /\/walk-in-shower-lafayette/);
});
