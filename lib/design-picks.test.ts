import assert from "node:assert/strict";
import { test } from "node:test";
import {
  STARTING_AT,
  composeSpec,
  designFloors,
  designLabel,
  designWalls,
  findLayout,
  layoutAllowsFixtureChange,
  leadFeatureLines,
  relatedLooksFor,
  resolvePicks,
  talkingPoints,
} from "./design-picks";

const sample = () => resolvePicks({ layout: "walk-in", wall: "zellige", floor: "hex", finish: "brass" });

test("floor and wall pickers include penny tile and geometric shapes", () => {
  for (const key of ["penny", "hex", "herringbone", "chevron", "arabesque", "porcelain", "mosaic", "encaustic", "wood-look"]) {
    const floor = designFloors.find((item) => item.key === key);
    assert.ok(floor, key);
    assert.match(floor!.image, /\.webp$/);
    assert.ok(floor!.alt.length > 12);
  }
  for (const key of ["penny", "herringbone", "chevron", "arabesque", "black-hex"]) {
    const wall = designWalls.find((item) => item.key === key);
    assert.ok(wall, key);
    assert.match(wall!.image, /\.webp$/);
    assert.ok(wall!.alt.length > 12);
  }
});

test("walk-in is an alias for tub-to-shower and resolves the v3 test picks", () => {
  assert.equal(findLayout("walk-in")?.key, "tub-to-shower");
  const picks = sample();
  assert.ok(picks);
  assert.equal(picks!.layout.key, "tub-to-shower");
  assert.equal(picks!.wall.name, "Green zellige");
  assert.equal(picks!.floor.key, "hex");
  assert.equal(picks!.finish.key, "brass");
  assert.match(designLabel(picks!), /Tub-to-shower \(walk-in\)/);
  assert.match(composeSpec(picks!), /Convert the existing bathtub into a walk-in shower/i);
  assert.match(composeSpec(picks!), /hex mosaic floor/i);
  assert.match(composeSpec(picks!), /brushed brass/i);
  assert.match(composeSpec(picks!), /Do not use granite\./);
});

test("QA may remove a tub only when the picked layout says so", () => {
  const convert = findLayout("tub-to-shower")!;
  const keep = findLayout("keep-tub")!;
  assert.equal(layoutAllowsFixtureChange(convert, "the tub was removed from the alcove"), true);
  assert.equal(layoutAllowsFixtureChange(keep, "the tub was removed from the alcove"), false);
  assert.equal(layoutAllowsFixtureChange(findLayout("shower-to-tub")!, "a new tub was added in the alcove"), true);
  assert.equal(layoutAllowsFixtureChange(findLayout("curbless")!, "the curb was removed for a curbless linear drain"), true);
});

test("talking points list the conversion, stay inside Starting at $5K, and never mention granite or AI", () => {
  const tile = talkingPoints(sample()!);
  assert.match(tile.good, /tub-to-shower/i);
  assert.match(tile.good, /green zellige/i);
  assert.equal(tile.good.includes(STARTING_AT), true);
  assert.match(tile.better, /marble-lined niche/i);
  assert.match(tile.best, /curbless/i);
  const solid = talkingPoints(resolvePicks({ layout: "tub-to-shower", wall: "ss-white", floor: "porcelain", finish: "brass" })!);
  assert.match(solid.better, /tile accent wall|tiled niche/i);
  for (const text of [tile.good, tile.better, tile.best, solid.good, solid.better, solid.best].join("\n")) {
    assert.doesNotMatch(text, /granite|AI design|licensed|insured|deposit|timeline|about a minute/i);
  }
  const money = [tile.good, tile.better, tile.best, solid.good, solid.better, solid.best].join(" ");
  assert.equal(money.replaceAll(STARTING_AT, "").includes("$"), false);
});

test("related looks return 2-3 existing images for the green zellige walk-in hex brass picks", () => {
  const related = relatedLooksFor(sample()!);
  assert.ok(related.length >= 2 && related.length <= 3);
  assert.ok(related.every((item) => item.src.startsWith("/images/")));
  assert.ok(related.some((item) => /zellige/i.test(item.name) || item.walls.includes("zellige")));
  const lines = leadFeatureLines(sample()!, related, ["Starting look: Fluted 3D tile"]);
  assert.ok(lines.some((line) => line.startsWith("Conversion: Tub-to-shower")));
  assert.ok(lines.some((line) => line.startsWith("Talking point (Good):")));
  assert.ok(lines.some((line) => line.startsWith("Related looks shown:")));
  assert.ok(lines.some((line) => line === "Starting look: Fluted 3D tile"));
});
