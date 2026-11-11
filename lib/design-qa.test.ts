import assert from "node:assert/strict";
import { test } from "node:test";
import {
  isExistingPhotoText,
  isMinorFixtureDrift,
  isUsableRedesign,
  rankUsableAttempts,
  softenQaVerdict,
} from "./design-qa";

test("no_text ignores logos that were already in the original photo", () => {
  assert.equal(isExistingPhotoText("TV brand logo 'PHILIPS' is visible on the TV bezel"), true);
  assert.equal(isExistingPhotoText("TV brand logo visible on the wall-mounted TV in upper left"), true);
  assert.equal(isExistingPhotoText("TV shows visible 'PHILIPS' logo on upper left wall"), true);
  assert.equal(isExistingPhotoText("a new watermark in the corner of B"), false);
  assert.equal(isExistingPhotoText("added text along the tile"), false);

  const softened = softenQaVerdict({
    failed: ["no_text"],
    reasons: [
      "TV shows visible 'PHILIPS' logo on upper left wall; no_text is false",
      "TV brand logo 'PHILIPS' is visible on the TV bezel",
    ],
    disallowed: ["TV brand logo 'PHILIPS' is visible on the TV bezel"],
  });
  assert.deepEqual(softened.failed, []);
  assert.deepEqual(softened.disallowed, []);
  assert.equal(softened.reasons.length, 0);
});

test("fixtures_kept tolerates small TV and doorway drift, not a missing tub", () => {
  assert.equal(
    isMinorFixtureDrift("TV on wall appears slightly larger or repositioned minimally in upper left"),
    true,
  );
  assert.equal(
    isMinorFixtureDrift("open doorway to hallway appears slightly narrower with altered perspective on distant door in background"),
    true,
  );
  assert.equal(isMinorFixtureDrift("the tub was removed from the alcove"), false);
  assert.equal(isMinorFixtureDrift("the vanity is missing from B"), false);
  assert.equal(isMinorFixtureDrift("the door was relocated to the left wall"), false);

  const softened = softenQaVerdict({
    failed: ["fixtures_kept"],
    reasons: [
      "TV on wall appears slightly larger or repositioned minimally",
      "open doorway to hallway appears slightly narrower with altered perspective on distant door",
    ],
  });
  assert.deepEqual(softened.failed, []);

  const hard = softenQaVerdict({
    failed: ["fixtures_kept"],
    reasons: ["the tub was removed from the alcove"],
  });
  assert.deepEqual(hard.failed, ["fixtures_kept"]);
});

test("a usable redesign can be shown when QA still fails on minor checks", () => {
  assert.equal(isUsableRedesign(["no_text"], true), true);
  assert.equal(isUsableRedesign(["fixtures_kept"], true), true);
  assert.equal(isUsableRedesign(["no_people"], true), false);
  assert.equal(isUsableRedesign(["geometry_ok", "realistic"], true), false);
  assert.equal(isUsableRedesign(["fixtures_kept"], false), false);

  const ranked = rankUsableAttempts([
    { attempt: 1, after: Buffer.from("a"), verdict: { failed: ["no_text", "fixtures_kept"] as const } },
    { attempt: 2, after: Buffer.from("b"), verdict: { failed: ["no_text"] as const } },
    { attempt: 3, after: null, verdict: { failed: [] } },
  ]);
  assert.equal(ranked[0]?.attempt, 2);
});
