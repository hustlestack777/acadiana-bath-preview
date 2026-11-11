import assert from "node:assert/strict";
import { test } from "node:test";
import { galleryPagePhotos, homeGalleryPhotos, inspiringLooks, shopLooks, solidPhotos, tilePhotos } from "./images";
import { composeSpec, resolvePicks } from "./design-picks";
import {
  designHref,
  findStartingLook,
  findStartingLookBySrc,
  firstOpenStep,
  pathHrefForLook,
  picksFromLook,
  startingLooks,
} from "./starting-looks";

test("fluted, stacked skinny and a solid-surface look resolve to design picks", () => {
  const fluted = findStartingLook("fluted");
  const stacked = findStartingLook("stacked-skinny");
  const solid = findStartingLook("ss-white");
  assert.ok(fluted && stacked && solid);
  assert.equal(fluted.name, "Fluted 3D tile");
  assert.equal(stacked.name, "Stacked skinny tile");
  assert.equal(solid.path, "/solid-surface");
  assert.equal(picksFromLook(fluted).wall, "fluted");
  assert.equal(picksFromLook(stacked).wall, "stacked-skinny");
  assert.equal(picksFromLook(solid).wall, "ss-white");
  assert.equal(firstOpenStep(fluted), "layout");
  assert.equal(pathHrefForLook(fluted), "/custom-tile?look=fluted");
  assert.equal(designHref("fluted"), "/design?look=fluted");
  assert.equal(designHref(""), "/design");
});

test("every shop, inspiring, gallery and path-grid photo maps to a starting look", () => {
  const groups = [
    shopLooks.map((item) => item.src),
    inspiringLooks.map((item) => item.src),
    homeGalleryPhotos.map((item) => item.src),
    galleryPagePhotos.map((item) => item.src),
    tilePhotos.map((item) => item.src),
    solidPhotos.map((item) => item.src),
  ];
  for (const srcs of groups) {
    for (const src of srcs) {
      assert.ok(findStartingLookBySrc(src), `missing starting look for ${src}`);
    }
  }
  assert.ok(new Set(startingLooks.map((look) => look.id)).size === startingLooks.length);
});

test("composeSpec includes the starting look for the render prompt", () => {
  const picks = resolvePicks({ layout: "tub-to-shower", wall: "fluted", floor: "encaustic", finish: "brass" });
  assert.ok(picks);
  const spec = composeSpec(picks, findStartingLook("fluted"));
  assert.match(spec, /Fluted 3D tile/);
  assert.match(spec, /fluted 3D wall tile/i);
  assert.match(spec, /Do not use granite\./);
});
