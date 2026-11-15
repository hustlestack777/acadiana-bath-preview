import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { GoogleReviews } from "../components/google-reviews";
import { businessJsonLd } from "./schema";
import {
  GOOGLE_BUSINESS_URL,
  GOOGLE_PLACE_ID,
  GOOGLE_REVIEWS,
  GOOGLE_REVIEWS_READ_URL,
  GOOGLE_WRITE_REVIEW_URL,
  SCHEMA_PRICE_RANGE,
} from "./site";
import { socialProfiles } from "./social";

const BANNED_PLACE_ID = "ChIJE5QseWJ1V6oR60AQJjTIOEI";

test("Google review summary is the verified rating and count", () => {
  assert.deepEqual(GOOGLE_REVIEWS, { rating: 5, count: 2 });
  assert.equal(GOOGLE_PLACE_ID, "ChIJy8M1qHT6IA4RDVwX3-vb_p0");
  assert.equal(GOOGLE_REVIEWS_READ_URL, "https://search.google.com/local/reviews?placeid=ChIJy8M1qHT6IA4RDVwX3-vb_p0");
  assert.equal(GOOGLE_WRITE_REVIEW_URL, "https://search.google.com/local/writereview?placeid=ChIJy8M1qHT6IA4RDVwX3-vb_p0");
  assert.equal(GOOGLE_BUSINESS_URL, "https://g.page/r/CQ1cF9_r2_6dEBM");
  assert.equal(SCHEMA_PRICE_RANGE, "$5,000 to $30,000+");
  const published = [GOOGLE_PLACE_ID, GOOGLE_REVIEWS_READ_URL, GOOGLE_WRITE_REVIEW_URL, GOOGLE_BUSINESS_URL].join("\n");
  assert.equal(published.includes(BANNED_PLACE_ID), false);
});

test("the reviews section and footer show only those facts", () => {
  const section = renderToStaticMarkup(createElement(GoogleReviews));
  assert.match(section, /Google reviews/);
  assert.match(section, /5-star rating on Google/);
  assert.match(section, /2 reviews/);
  assert.match(section, /Read our reviews on Google/);
  assert.match(section, /Leave us a review/);
  assert.match(section, new RegExp(GOOGLE_REVIEWS_READ_URL.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.match(section, new RegExp(GOOGLE_WRITE_REVIEW_URL.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.equal(section.includes(BANNED_PLACE_ID), false);
  assert.equal(/aggregateRating|reviewBody|reviewer/i.test(section), false);

  const footer = readFileSync(new URL("../components/site-footer.tsx", import.meta.url), "utf8");
  assert.match(footer, /Leave a review/);
  assert.match(footer, /GOOGLE_WRITE_REVIEW_URL/);
  assert.match(footer, /<SocialLinks/);
  const social = readFileSync(new URL("../components/social-link.tsx", import.meta.url), "utf8");
  assert.match(social, /Facebook and the one Google Business listing/);
  const profiles = socialProfiles();
  assert.deepEqual(profiles.map((profile) => profile.kind), ["facebook", "google"]);
  assert.equal(profiles[1]?.href, GOOGLE_BUSINESS_URL);
});

test("business JSON-LD still has no review markup and the same price range", () => {
  const data = businessJsonLd();
  const blob = JSON.stringify(data);
  assert.equal(data.priceRange, SCHEMA_PRICE_RANGE);
  assert.equal(blob.includes("aggregateRating"), false);
  assert.equal(blob.includes("reviewBody"), false);
  assert.equal(blob.includes(GOOGLE_WRITE_REVIEW_URL), false);
  assert.equal(blob.includes(BANNED_PLACE_ID), false);
});
