import assert from "node:assert/strict";
import test from "node:test";
import { GOOGLE_BUSINESS_URL, SITE_SAME_AS } from "./site";
import { facebookProfile, socialProfiles } from "./social";

test("schema sameAs is Facebook plus Justin's one Google listing", () => {
  assert.deepEqual(
    [...SITE_SAME_AS],
    ["https://www.facebook.com/profile.php?id=61596069587015", GOOGLE_BUSINESS_URL],
  );
  assert.equal(GOOGLE_BUSINESS_URL, "https://g.page/r/CQ1cF9_r2_6dEBM");
});

test("icons use only those two profiles, with the Google label", () => {
  const profiles = socialProfiles();
  assert.deepEqual(
    profiles.map((profile) => profile.kind),
    ["facebook", "google"],
  );
  assert.equal(facebookProfile(), "https://www.facebook.com/profile.php?id=61596069587015");
  assert.equal(profiles[1]?.href, GOOGLE_BUSINESS_URL);
  assert.equal(profiles[1]?.label, "Acadiana Bathrooms on Google");
});
