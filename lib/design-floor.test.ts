import assert from "node:assert/strict";
import { access } from "node:fs/promises";
import path from "node:path";
import { test } from "node:test";
import { composeSpec, designFloors, findFloor, floorPrompt, resolvePicks, styleFromPicks } from "./design-picks";
import { buildEditPrompt, editPayloadImages, type RoomScan } from "./design-render";
import { findStartingLook, picksFromLook, startingLooks } from "./starting-looks";

const scan: RoomScan = {
  is_bathroom: true,
  has_person: false,
  camera: "eye level",
  layout: "shower on the back wall",
  lighting: "window light from the left",
  clutter: [],
  fixtures: ["one shower head on the back wall"],
  sinkCount: 0,
};

const added = [
  {
    key: "marble-hex",
    material: "honed white Carrara marble",
    shape: "hexagon mosaic",
    color: "white with soft gray veining and light gray grout",
    size: "small mosaic",
  },
  {
    key: "marble-hex-3",
    material: "honed white Carrara marble",
    shape: "hexagon",
    color: "white with soft gray veining and light gray grout",
    size: "3 inch",
  },
  {
    key: "marble-penny",
    material: "honed white Carrara marble",
    shape: "penny round",
    color: "white with soft gray veining and light gray grout",
  },
  {
    key: "classic-penny",
    material: "glossy glazed ceramic",
    shape: "penny round",
    color: "white tile with dark charcoal grout",
  },
  {
    key: "river-rock",
    material: "natural river rock",
    shape: "flat pebble",
    color: "mixed warm gray, tan and charcoal with gray grout",
  },
  {
    key: "dark-slate",
    material: "honed dark charcoal slate",
    shape: "small rectangle or square",
    color: "dark charcoal with a natural cleft texture and dark grout",
  },
] as const;

test("existing shower floors stay first and the added floors follow", () => {
  assert.deepEqual(
    designFloors.map((floor) => floor.key),
    ["porcelain", "mosaic", "hex", "encaustic", "wood-look", "marble-hex", "marble-hex-3", "marble-penny", "classic-penny", "river-rock", "dark-slate"],
  );
});

test("each new floor names material, shape and color in the render prompt and image parameters", async () => {
  for (const expected of added) {
    const floor = findFloor(expected.key);
    assert.ok(floor);
    assert.equal(floor.material, expected.material);
    assert.equal(floor.shape, expected.shape);
    assert.equal(floor.color, expected.color);
    assert.equal(floor.size, "size" in expected ? expected.size : undefined);
    assert.equal(floor.sample, true);
    await access(path.join(process.cwd(), "public", floor.image.slice(1)));

    const picks = resolvePicks({ layout: "tub-to-shower", wall: "zellige", floor: expected.key, finish: "brass" });
    assert.ok(picks);
    const line = floorPrompt(floor);
    assert.match(line, new RegExp(`Material: ${expected.material}\\.`));
    assert.match(line, new RegExp(`Shape: ${expected.shape}\\.`));
    assert.match(line, new RegExp(`Color: ${expected.color}\\.`));
    if ("size" in expected && expected.size) assert.match(line, new RegExp(`Size: ${expected.size}\\.`));
    assert.match(composeSpec(picks), new RegExp(escapeRegExp(line)));

    const style = styleFromPicks(picks);
    assert.equal(style.floorSample, floor.image);
    const prompt = buildEditPrompt(style, scan, picks.layout);
    assert.match(prompt, new RegExp(`Material: ${escapeRegExp(expected.material)}`));
    assert.match(prompt, new RegExp(`Shape: ${escapeRegExp(expected.shape)}`));
    assert.match(prompt, new RegExp(`Color: ${escapeRegExp(expected.color)}`));
    assert.match(prompt, /<IMAGE_2> is the shower floor they picked/);
    assert.match(prompt, /exact material, shape and color/);

    const images = editPayloadImages("data:image/jpeg;base64,photo", "data:image/jpeg;base64,wall", "data:image/jpeg;base64,floor");
    assert.equal(images.length, 3);
    assert.equal(images[2]?.url, "data:image/jpeg;base64,floor");
  }
});

test("the existing hex floor keeps its prompt text and does not send a floor swatch image", () => {
  const picks = resolvePicks({ layout: "walk-in", wall: "zellige", floor: "hex", finish: "brass" });
  assert.ok(picks);
  assert.match(floorPrompt(picks.floor), /hex mosaic floor tile/);
  assert.match(floorPrompt(picks.floor), /Material: honed light marble or stone-look tile/);
  assert.match(floorPrompt(picks.floor), /Shape: hexagon mosaic/);
  assert.match(floorPrompt(picks.floor), /Color: light neutral stone/);
  const style = styleFromPicks(picks);
  assert.equal(style.floorSample, undefined);
  const prompt = buildEditPrompt(style, scan, picks.layout);
  assert.match(prompt, /hex mosaic floor tile/);
  assert.doesNotMatch(prompt, /<IMAGE_2>/);
  assert.equal(editPayloadImages("photo", "wall").length, 2);
});

test("zellige is a wall finish and cannot be selected as a floor", () => {
  assert.equal(findFloor("zellige"), null);
  assert.equal(findFloor("pink-zellige"), null);
  assert.equal(findFloor("emerald-zellige"), null);
  assert.equal(
    designFloors.some((floor) => /zellige/i.test([floor.key, floor.name, floor.material, floor.shape, floor.color, floor.spec, floor.size ?? ""].join(" "))),
    false,
  );
  for (const look of startingLooks) {
    assert.equal(/zellige/i.test(look.floor ?? ""), false, look.id);
    if (look.floor) assert.ok(findFloor(look.floor), look.id);
  }
  const picks = resolvePicks({ layout: "tub-to-shower", wall: "zellige", floor: "marble-hex", finish: "brass" });
  assert.ok(picks);
  assert.equal(picks.floor.key, "marble-hex");
  const spec = composeSpec(picks);
  assert.match(spec, /from the floor line to the ceiling on the walls only/);
  assert.match(spec, /Zellige is walls only, from the floor to the ceiling\. Do not put zellige on the floor\./);
  assert.match(spec, /Size: small mosaic/);
  assert.doesNotMatch(spec, /zellige (?:hex|mosaic|penny|floor tile)/i);
  const prompt = buildEditPrompt(styleFromPicks(picks), scan, picks.layout);
  assert.match(prompt, /Do not put zellige on the floor/);
  assert.match(prompt, /Size: small mosaic/);
});

test("zellige wall presets default the floor to small Carrara hex", () => {
  for (const id of ["green-zellige", "sage", "teal-tile", "butter-yellow-zellige", "cobalt"]) {
    const look = findStartingLook(id);
    assert.ok(look);
    assert.equal(picksFromLook(look).floor, "marble-hex", id);
    assert.match(look.promptHint || "", /Carrara/);
    assert.match(look.promptHint || "", /not put|Do not continue/i);
  }
});

test("the penny tile starting look selects classic penny, not the basketweave mosaic", () => {
  const look = findStartingLook("penny-tile");
  assert.ok(look);
  assert.equal(picksFromLook(look).floor, "classic-penny");
});

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
