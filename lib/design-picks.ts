import type { DesignStyle } from "./design-styles";
import type { StartingLook } from "./starting-looks";

/** Visitor picks for the Design My Bathroom flow. Photo comes last. */
export type DesignPicksInput = {
  layout: string;
  wall: string;
  floor: string;
  finish: string;
  budget?: string;
};

export type LayoutQa = {
  mayRemoveTub: boolean;
  mayAddTub: boolean;
  mayRemoveShower: boolean;
  mayAddShower: boolean;
  mayGoCurbless: boolean;
  mayBeFreestanding: boolean;
  mayBeCombo: boolean;
  mayBeSeparateTubAndShower: boolean;
};

export type DesignLayout = {
  key: string;
  name: string;
  blurb: string;
  image: string;
  alt: string;
  prompt: string;
  qa: LayoutQa;
  family: "shower" | "tub" | "both";
};

export type DesignWall = {
  key: string;
  name: string;
  blurb: string;
  image: string;
  alt: string;
  path: "solid-surface" | "custom-tile";
  project: string;
  spec: string;
  family: "zellige" | "marble" | "patterned-tile" | "solid-surface";
};

export type DesignFloor = {
  key: string;
  name: string;
  blurb: string;
  image: string;
  alt: string;
  spec: string;
};

export type DesignFinish = {
  key: string;
  name: string;
  blurb: string;
  image: string;
  alt: string;
  spec: string;
};

export type RelatedLook = {
  key: string;
  name: string;
  src: string;
  alt: string;
  href: string;
  walls: string[];
  layouts: string[];
  floors: string[];
  finishes: string[];
  path: "solid-surface" | "custom-tile";
};

export type ResolvedPicks = {
  layout: DesignLayout;
  wall: DesignWall;
  floor: DesignFloor;
  finish: DesignFinish;
};

export type TalkingPoints = {
  good: string;
  better: string;
  best: string;
};

const SHOWER_LAYOUTS = ["tub-to-shower", "keep-shower", "curbless"];
const TUB_LAYOUTS = ["keep-tub", "shower-to-tub", "combo", "freestanding-tub"];
const BOTH_LAYOUTS = ["tub-and-shower"];

export const designLayouts: DesignLayout[] = [
  {
    key: "tub-to-shower",
    name: "Tub-to-shower (walk-in)",
    blurb: "Swap the tub for a walk-in shower.",
    image: "/images/ai/ss-tub-to-shower.webp",
    alt: "Alcove converted to a walk-in shower with a glass door and a built-in bench.",
    family: "shower",
    prompt:
      "Convert the existing bathtub into a walk-in shower in the same alcove and footprint. Remove the tub and the tub spout. Build a shower base in that same space, with a shower valve and shower head on the wet wall and clear glass. Do not leave the old tub in place.",
    qa: {
      mayRemoveTub: true,
      mayAddTub: false,
      mayRemoveShower: false,
      mayAddShower: true,
      mayGoCurbless: false,
      mayBeFreestanding: false,
      mayBeCombo: false,
      mayBeSeparateTubAndShower: false,
    },
  },
  {
    key: "shower-to-tub",
    name: "Shower-to-tub",
    blurb: "Turn the shower into a soaking tub.",
    image: "/images/ai/ss-tub-walls.webp",
    alt: "Alcove bathtub with a seamless surround and recessed shelves.",
    family: "tub",
    prompt:
      "Convert the existing shower into a soaking bathtub in the same alcove and footprint. Add a tub and a tub filler or spout. A shower head and a clear glass screen over the tub are allowed. Do not leave it as a shower-only stall.",
    qa: {
      mayRemoveTub: false,
      mayAddTub: true,
      mayRemoveShower: true,
      mayAddShower: false,
      mayGoCurbless: false,
      mayBeFreestanding: false,
      mayBeCombo: true,
      mayBeSeparateTubAndShower: false,
    },
  },
  {
    key: "keep-tub",
    name: "Keep tub (new tile surround)",
    blurb: "Keep the tub. Refresh the surround.",
    image: "/images/tub-surround.webp",
    alt: "Bathtub with a speckled wall surround and a framed glass door.",
    family: "tub",
    prompt:
      "Keep the existing bathtub in the same place and size. Refresh the tub surround, walls and floor with the new finishes. Replace an old curtain or framed door with clear glass over the tub. Keep the tub spout.",
    qa: {
      mayRemoveTub: false,
      mayAddTub: false,
      mayRemoveShower: false,
      mayAddShower: false,
      mayGoCurbless: false,
      mayBeFreestanding: false,
      mayBeCombo: true,
      mayBeSeparateTubAndShower: false,
    },
  },
  {
    key: "keep-shower",
    name: "Keep shower (refresh)",
    blurb: "Same shower footprint, new finishes.",
    image: "/images/shower-warm.webp",
    alt: "Walk-in shower with a warm surround, glass clamps, and a half wall of tile.",
    family: "shower",
    prompt:
      "Keep the existing shower footprint, walls and opening in the same place. Refresh the shower walls, floor and glass with the new finishes. Do not add or remove a tub.",
    qa: {
      mayRemoveTub: false,
      mayAddTub: false,
      mayRemoveShower: false,
      mayAddShower: false,
      mayGoCurbless: false,
      mayBeFreestanding: false,
      mayBeCombo: false,
      mayBeSeparateTubAndShower: false,
    },
  },
  {
    key: "tub-and-shower",
    name: "Tub + separate shower",
    blurb: "A tub and a walk-in shower in the same bath.",
    image: "/images/hero-tub.webp",
    alt: "Bright bathroom with a freestanding tub beside a glass shower.",
    family: "both",
    prompt:
      "Design a bathroom with both a bathtub and a separate walk-in shower. If the photo already has both, keep them in the same places and refresh the finishes. If the photo has only a tub, add a separate shower in a natural wet-area opening without moving the toilet, vanity, windows or doors, and keep a tub. If the photo has only a shower, add a separate tub in an open floor area without moving the toilet, vanity, windows or doors. Give the shower clear glass.",
    qa: {
      mayRemoveTub: false,
      mayAddTub: true,
      mayRemoveShower: false,
      mayAddShower: true,
      mayGoCurbless: false,
      mayBeFreestanding: true,
      mayBeCombo: false,
      mayBeSeparateTubAndShower: true,
    },
  },
  {
    key: "freestanding-tub",
    name: "Freestanding tub",
    blurb: "A statement soaking tub.",
    image: "/images/design/checker.webp",
    alt: "Freestanding tub on a soft checkerboard floor.",
    family: "tub",
    prompt:
      "Place a freestanding soaking tub as the bathing fixture. If there is an alcove tub, replace it with a freestanding tub in the same bathing area. If there is only a shower, add a freestanding tub in an open floor area without moving the toilet, vanity, windows or doors, and keep a refreshed shower with clear glass if it still fits. Add a floor- or wall-mounted tub filler at the tub.",
    qa: {
      mayRemoveTub: true,
      mayAddTub: true,
      mayRemoveShower: false,
      mayAddShower: false,
      mayGoCurbless: false,
      mayBeFreestanding: true,
      mayBeCombo: false,
      mayBeSeparateTubAndShower: true,
    },
  },
  {
    key: "curbless",
    name: "Curbless / walk-in spa shower",
    blurb: "Step-free entry with a linear drain.",
    image: "/images/design-picks/curbless-spa.webp",
    alt: "Curbless walk-in shower with stone-look walls, a linear drain, and a teak bench.",
    family: "shower",
    prompt:
      "Build a curbless, step-free walk-in spa shower in the existing wet area. If a tub is present, remove it and use that same footprint. Use a low, almost flush shower floor with a linear drain and no step-up curb. Use clear glass. A bench is allowed if it fits the existing footprint without moving walls, windows or doors.",
    qa: {
      mayRemoveTub: true,
      mayAddTub: false,
      mayRemoveShower: false,
      mayAddShower: true,
      mayGoCurbless: true,
      mayBeFreestanding: false,
      mayBeCombo: false,
      mayBeSeparateTubAndShower: false,
    },
  },
  {
    key: "combo",
    name: "Tub/shower combo with glass",
    blurb: "A tub with a shower and clear glass.",
    image: "/images/tub-surround.webp",
    alt: "Alcove tub with a surround and a glass door in a tub/shower combination.",
    family: "tub",
    prompt:
      "Keep a tub/shower combination in the same alcove: a bathtub with a shower head and clear glass (not a curtain) over the tub. If the photo is a shower-only stall, add a tub in that alcove. If it is already a combo, keep the tub and replace the old door or curtain with clear glass. Keep the tub spout and a shower head on the wet wall.",
    qa: {
      mayRemoveTub: false,
      mayAddTub: true,
      mayRemoveShower: false,
      mayAddShower: true,
      mayGoCurbless: false,
      mayBeFreestanding: false,
      mayBeCombo: true,
      mayBeSeparateTubAndShower: false,
    },
  },
];

export const designWalls: DesignWall[] = [
  {
    key: "zellige",
    name: "Green zellige",
    blurb: "Glossy handmade-look green tile.",
    image: "/images/design/zellige.webp",
    alt: "Deep-green zellige-look tile shower with brass fixtures and frameless glass.",
    path: "custom-tile",
    project: "tile-shower",
    family: "zellige",
    spec: "deep green glossy handmade zellige-look square wall tile with thin light grout, a recessed niche",
  },
  {
    key: "calacatta",
    name: "Calacatta marble",
    blurb: "Book-matched marble-look slab walls.",
    image: "/images/design-picks/calacatta.webp",
    alt: "Walk-in shower with book-matched Calacatta marble slab walls and brass fixtures.",
    path: "custom-tile",
    project: "tile-shower",
    family: "marble",
    spec: "book-matched polished Calacatta marble-look slab walls with soft gray and gold veining, a marble-lined recessed niche",
  },
  {
    key: "fluted",
    name: "Fluted tile",
    blurb: "3D ribbed tile that catches the light.",
    image: "/images/design-picks/fluted.webp",
    alt: "Terracotta fluted 3D tile wall behind a walnut vanity with a brass faucet.",
    path: "custom-tile",
    project: "tile-shower",
    family: "patterned-tile",
    spec: "terracotta or warm clay-tone fluted 3D wall tile, a recessed niche",
  },
  {
    key: "herringbone",
    name: "Herringbone",
    blurb: "Crisp chevron or herringbone tile.",
    image: "/images/design-picks/herringbone.webp",
    alt: "Walk-in shower with matte white chevron wall tile, matte black fixtures, and an oak bench.",
    path: "custom-tile",
    project: "tile-shower",
    family: "patterned-tile",
    spec: "matte white or soft stone-look chevron or herringbone wall tile, a recessed niche",
  },
  {
    key: "stacked-skinny",
    name: "Stacked skinny",
    blurb: "Glossy skinny tile stacked tall.",
    image: "/images/design-picks/stacked-skinny.webp",
    alt: "Walk-in shower in glossy blush skinny tile stacked vertically, with a marble niche and brass fixtures.",
    path: "custom-tile",
    project: "tile-shower",
    family: "patterned-tile",
    spec: "glossy blush or soft-color skinny wall tile laid in a vertical stack, a marble-lined recessed niche",
  },
  {
    key: "black-hex",
    name: "Black hex",
    blurb: "Matte black hex on the lower walls.",
    image: "/images/design-picks/black-hex.webp",
    alt: "Walk-in shower with matte black hex mosaic on the floor and lower walls and marble-look tile above.",
    path: "custom-tile",
    project: "tile-shower",
    family: "patterned-tile",
    spec: "matte black hex mosaic on the lower walls with large white marble-look tile above, a hex-lined recessed niche",
  },
  {
    key: "terrazzo",
    name: "Terrazzo-style",
    blurb: "Large cream tile with soft chips.",
    image: "/images/design-picks/terrazzo.webp",
    alt: "Walk-in shower in cream terrazzo-look tile with terracotta, sage and blush chips.",
    path: "custom-tile",
    project: "tile-shower",
    family: "patterned-tile",
    spec: "large cream terrazzo-look wall tile with terracotta, sage and blush chips, a recessed niche",
  },
  {
    key: "ss-white",
    name: "Solid surface white",
    blurb: "Seamless warm-white walls, almost no grout.",
    image: "/images/design-picks/ss-white.webp",
    alt: "Walk-in shower with seamless warm-white solid surface walls, a sage niche, and brass fixtures.",
    path: "solid-surface",
    project: "ss-shower-walls",
    family: "solid-surface",
    spec: "smooth seamless warm-white solid surface wall panels with no grout lines, a matching solid surface base, one recessed niche",
  },
  {
    key: "ss-stone",
    name: "Stone-look solid surface",
    blurb: "The look of stone with nothing to scrub between.",
    image: "/images/design-picks/ss-stone.webp",
    alt: "Tub-to-shower conversion with seamless cream stone-look solid surface walls and matte black fixtures.",
    path: "solid-surface",
    project: "ss-shower-walls",
    family: "solid-surface",
    spec: "seamless cream stone-look solid surface wall panels with no grout lines, two recessed shelves or one niche, a matching solid surface base",
  },
];

export const designFloors: DesignFloor[] = [
  {
    key: "porcelain",
    name: "Large porcelain",
    blurb: "Clean large-format stone-look tile.",
    image: "/images/design/curbless.webp",
    alt: "Light stone-look large porcelain floor in a walk-in shower with a linear drain.",
    spec: "large-format light warm-grey or cream stone-look porcelain floor tile",
  },
  {
    key: "mosaic",
    name: "Marble mosaic",
    blurb: "Honed marble mosaic underfoot.",
    image: "/images/design-picks/marble-mosaic.webp",
    alt: "Honed white Carrara basketweave mosaic floor under a freestanding tub.",
    spec: "honed white Carrara or marble-look basketweave mosaic floor tile",
  },
  {
    key: "hex",
    name: "Hex",
    blurb: "A classic hex mosaic floor.",
    image: "/images/design-picks/zellige-hex.webp",
    alt: "Honed marble hex shower floor under a green zellige walk-in shower.",
    spec: "small honed light marble or stone-look hex mosaic floor tile",
  },
  {
    key: "encaustic",
    name: "Patterned / encaustic",
    blurb: "A patterned floor with a little personality.",
    image: "/images/design-picks/encaustic.webp",
    alt: "Terracotta, sage and cream star-pattern encaustic-look floor under a clawfoot tub.",
    spec: "terracotta, sage and cream star-pattern or encaustic-look floor tile",
  },
  {
    key: "wood-look",
    name: "Wood-look",
    blurb: "Warm wood-look planks, made for wet rooms.",
    image: "/images/ai/ideas/flooret-04-white-oak-tub.webp",
    alt: "Light wood-look plank floor around a freestanding tub.",
    spec: "light white-oak wood-look porcelain plank floor tile",
  },
];

export const designFinishes: DesignFinish[] = [
  {
    key: "brass",
    name: "Brass",
    blurb: "Warm brushed or aged brass.",
    image: "/images/design-picks/finish-brass.jpg",
    alt: "Warm brushed brass metal finish.",
    spec: "brushed brass fixture finish on faucets, shower trim, handles and visible metal",
  },
  {
    key: "matte-black",
    name: "Matte black",
    blurb: "Soft black, modern and quiet.",
    image: "/images/design-picks/finish-black.jpg",
    alt: "Matte black metal finish.",
    spec: "matte black fixture finish on faucets, shower trim, handles and visible metal",
  },
  {
    key: "chrome",
    name: "Chrome / nickel",
    blurb: "Classic polished chrome or nickel.",
    image: "/images/design-picks/finish-chrome.jpg",
    alt: "Polished chrome or nickel metal finish.",
    spec: "polished chrome or brushed nickel fixture finish on faucets, shower trim, handles and visible metal",
  },
];

/** Existing gallery and look images only — never a new render. */
export const relatedLookCatalog: RelatedLook[] = [
  {
    key: "zellige-green",
    name: "Green zellige",
    src: "/images/design/zellige.webp",
    alt: "Deep-green zellige-look tile shower with brass fixtures and frameless glass.",
    href: "/custom-tile",
    walls: ["zellige"],
    layouts: SHOWER_LAYOUTS,
    floors: ["hex"],
    finishes: ["brass"],
    path: "custom-tile",
  },
  {
    key: "zellige-hex-look",
    name: "Green zellige + hex floor",
    src: "/images/design-picks/zellige-hex.webp",
    alt: "Green zellige walk-in shower with a honed marble hex floor and brass fixtures.",
    href: "/custom-tile",
    walls: ["zellige"],
    layouts: SHOWER_LAYOUTS,
    floors: ["hex"],
    finishes: ["brass"],
    path: "custom-tile",
  },
  {
    key: "emerald-zellige",
    name: "Emerald zellige",
    src: "/images/design/emerald.webp",
    alt: "Emerald-green zellige-look tile shower with a linear drain and brass fixtures.",
    href: "/custom-tile",
    walls: ["zellige"],
    layouts: ["curbless", "tub-to-shower", "keep-shower"],
    floors: ["porcelain", "hex"],
    finishes: ["brass"],
    path: "custom-tile",
  },
  {
    key: "calacatta",
    name: "Calacatta marble",
    src: "/images/design-picks/calacatta.webp",
    alt: "Book-matched Calacatta marble walk-in shower with brass fixtures.",
    href: "/custom-tile",
    walls: ["calacatta"],
    layouts: SHOWER_LAYOUTS,
    floors: ["mosaic", "porcelain"],
    finishes: ["brass"],
    path: "custom-tile",
  },
  {
    key: "marble-mosaic",
    name: "Carrara mosaic floor",
    src: "/images/design-picks/marble-mosaic.webp",
    alt: "Honed Carrara basketweave mosaic floor under a freestanding tub with a brass filler.",
    href: "/custom-tile",
    walls: ["calacatta"],
    layouts: TUB_LAYOUTS,
    floors: ["mosaic"],
    finishes: ["brass"],
    path: "custom-tile",
  },
  {
    key: "fluted",
    name: "Fluted tile",
    src: "/images/design-picks/fluted.webp",
    alt: "Terracotta fluted 3D tile wall with brass fixtures.",
    href: "/custom-tile",
    walls: ["fluted"],
    layouts: [...SHOWER_LAYOUTS, ...TUB_LAYOUTS],
    floors: ["encaustic", "porcelain"],
    finishes: ["brass"],
    path: "custom-tile",
  },
  {
    key: "herringbone",
    name: "White herringbone",
    src: "/images/design-picks/herringbone.webp",
    alt: "Matte white chevron shower with matte black fixtures and an oak bench.",
    href: "/custom-tile",
    walls: ["herringbone"],
    layouts: SHOWER_LAYOUTS,
    floors: ["porcelain", "mosaic"],
    finishes: ["matte-black"],
    path: "custom-tile",
  },
  {
    key: "stacked-skinny",
    name: "Stacked skinny tile",
    src: "/images/design-picks/stacked-skinny.webp",
    alt: "Blush skinny stacked tile walk-in shower with a marble niche and brass fixtures.",
    href: "/custom-tile",
    walls: ["stacked-skinny"],
    layouts: SHOWER_LAYOUTS,
    floors: ["mosaic", "porcelain"],
    finishes: ["brass"],
    path: "custom-tile",
  },
  {
    key: "black-hex",
    name: "Black hex",
    src: "/images/design-picks/black-hex.webp",
    alt: "Matte black hex shower with marble-look walls above and matte black fixtures.",
    href: "/custom-tile",
    walls: ["black-hex"],
    layouts: SHOWER_LAYOUTS,
    floors: ["hex"],
    finishes: ["matte-black"],
    path: "custom-tile",
  },
  {
    key: "terrazzo",
    name: "Terrazzo-style",
    src: "/images/design-picks/terrazzo.webp",
    alt: "Cream terrazzo-look walk-in shower with brass fixtures.",
    href: "/custom-tile",
    walls: ["terrazzo"],
    layouts: SHOWER_LAYOUTS,
    floors: ["porcelain", "encaustic"],
    finishes: ["brass"],
    path: "custom-tile",
  },
  {
    key: "encaustic",
    name: "Patterned floor",
    src: "/images/design-picks/encaustic.webp",
    alt: "Terracotta and sage encaustic-look floor under a clawfoot tub.",
    href: "/custom-tile",
    walls: ["fluted", "terrazzo"],
    layouts: TUB_LAYOUTS,
    floors: ["encaustic"],
    finishes: ["brass"],
    path: "custom-tile",
  },
  {
    key: "ss-white",
    name: "White solid surface walk-in",
    src: "/images/design-picks/ss-white.webp",
    alt: "Seamless warm-white solid surface walk-in shower with a sage niche and brass fixtures.",
    href: "/solid-surface",
    walls: ["ss-white"],
    layouts: SHOWER_LAYOUTS,
    floors: ["porcelain"],
    finishes: ["brass"],
    path: "solid-surface",
  },
  {
    key: "ss-stone",
    name: "Stone-look solid surface",
    src: "/images/design-picks/ss-stone.webp",
    alt: "Cream stone-look solid surface tub-to-shower conversion with matte black fixtures.",
    href: "/solid-surface",
    walls: ["ss-stone"],
    layouts: ["tub-to-shower", "keep-shower", "combo"],
    floors: ["porcelain"],
    finishes: ["matte-black"],
    path: "solid-surface",
  },
  {
    key: "ss-curbless",
    name: "Curbless spa",
    src: "/images/design-picks/curbless-spa.webp",
    alt: "Curbless stone-look solid surface spa shower with a linear drain and aged brass fixtures.",
    href: "/solid-surface",
    walls: ["ss-stone", "ss-white"],
    layouts: ["curbless", "tub-to-shower"],
    floors: ["porcelain"],
    finishes: ["brass"],
    path: "solid-surface",
  },
  {
    key: "ss-walkin",
    name: "Solid surface walk-in",
    src: "/images/design/ss-walkin.webp",
    alt: "Warm-white solid surface walk-in shower with frameless glass and brass fixtures.",
    href: "/solid-surface",
    walls: ["ss-white"],
    layouts: SHOWER_LAYOUTS,
    floors: ["porcelain"],
    finishes: ["brass"],
    path: "solid-surface",
  },
  {
    key: "curbless-tile",
    name: "Curbless walk-in",
    src: "/images/design/curbless.webp",
    alt: "Light stone-look tile curbless shower with a linear drain, grab bar and handheld.",
    href: "/custom-tile",
    walls: ["herringbone", "calacatta", "terrazzo"],
    layouts: ["curbless", "tub-to-shower", "keep-shower"],
    floors: ["porcelain"],
    finishes: ["matte-black", "brass"],
    path: "custom-tile",
  },
  {
    key: "hero-tub",
    name: "Tub + separate shower",
    src: "/images/hero-tub.webp",
    alt: "Freestanding tub beside a glass shower on a light wood-look floor.",
    href: "/custom-tile",
    walls: ["calacatta", "herringbone"],
    layouts: ["tub-and-shower", "freestanding-tub"],
    floors: ["wood-look", "porcelain"],
    finishes: ["chrome", "brass"],
    path: "custom-tile",
  },
  {
    key: "checker-tub",
    name: "Freestanding tub",
    src: "/images/design/checker.webp",
    alt: "Freestanding tub on a muted sage and cream checkerboard floor.",
    href: "/custom-tile",
    walls: ["calacatta", "herringbone"],
    layouts: ["freestanding-tub", "tub-and-shower"],
    floors: ["encaustic", "mosaic"],
    finishes: ["brass"],
    path: "custom-tile",
  },
];

const LAYOUT_ALIASES: Record<string, string> = {
  "walk-in": "tub-to-shower",
  walkin: "tub-to-shower",
  "tub to shower": "tub-to-shower",
};

export const STARTING_AT = "Starting at $5K";

export function findLayout(key: string) {
  const resolved = LAYOUT_ALIASES[key.trim().toLowerCase()] || key;
  return designLayouts.find((item) => item.key === resolved) ?? null;
}

export function findWall(key: string) {
  return designWalls.find((item) => item.key === key) ?? null;
}

export function findFloor(key: string) {
  return designFloors.find((item) => item.key === key) ?? null;
}

export function findFinish(key: string) {
  return designFinishes.find((item) => item.key === key) ?? null;
}

export function resolvePicks(input: Partial<DesignPicksInput> | null | undefined): ResolvedPicks | null {
  if (!input) return null;
  const layout = findLayout(String(input.layout || ""));
  const wall = findWall(String(input.wall || ""));
  const floor = findFloor(String(input.floor || ""));
  const finish = findFinish(String(input.finish || ""));
  if (!layout || !wall || !floor || !finish) return null;
  return { layout, wall, floor, finish };
}

export function parsePicks(raw: unknown): DesignPicksInput | null {
  if (!raw || typeof raw !== "object") return null;
  const data = raw as Record<string, unknown>;
  const layout = typeof data.layout === "string" ? data.layout : "";
  const wall = typeof data.wall === "string" ? data.wall : typeof data.style === "string" ? data.style : "";
  const floor = typeof data.floor === "string" ? data.floor : "";
  const finish = typeof data.finish === "string" ? data.finish : "";
  const budget = typeof data.budget === "string" ? data.budget : "";
  if (!findLayout(layout) || !findWall(wall) || !findFloor(floor) || !findFinish(finish)) return null;
  return { layout: findLayout(layout)!.key, wall, floor, finish, budget };
}

export function composeSpec(picks: ResolvedPicks, startingLook?: StartingLook | null) {
  const inspiration = startingLook
    ? `The customer started from this inspiration look: ${startingLook.name}. ${startingLook.promptHint || startingLook.alt}`
    : "";
  return [
    inspiration,
    picks.layout.prompt,
    `Walls: ${picks.wall.spec}.`,
    `Floor: ${picks.floor.spec}.`,
    `Fixture finish: ${picks.finish.spec}.`,
    "Do not use granite.",
  ].filter(Boolean).join(" ");
}

export function designLabel(picks: ResolvedPicks) {
  return `${picks.layout.name} · ${picks.wall.name}`;
}

export function designSummary(picks: ResolvedPicks) {
  return `${picks.layout.name}, ${picks.wall.name} walls, ${picks.floor.name} floor, ${picks.finish.name} fixtures`;
}

/** A DesignStyle-shaped object so the render path can keep using style.key for the wall reference image. */
export function styleFromPicks(picks: ResolvedPicks, startingLook?: StartingLook | null): DesignStyle {
  return {
    key: picks.wall.key,
    boogie: "",
    name: picks.wall.name,
    blurb: picks.wall.blurb,
    image: picks.wall.image,
    alt: picks.wall.alt,
    path: picks.wall.path,
    project: picks.wall.project,
    spec: composeSpec(picks, startingLook),
  };
}

export function talkingPoints(picks: ResolvedPicks): TalkingPoints {
  const good = `They picked a ${picks.layout.name.toLowerCase()} with ${picks.wall.name.toLowerCase()} walls, a ${picks.floor.name.toLowerCase()} floor, and ${picks.finish.name.toLowerCase()} fixtures. ${STARTING_AT}.`;

  const betterBits: string[] = [];
  if (picks.wall.path === "solid-surface") {
    betterBits.push("a tile accent wall or a tiled niche for a little contrast");
  } else {
    betterBits.push("a marble-lined niche");
    if (picks.finish.key !== "brass") betterBits.push("a brass fixture upgrade");
  }
  if (picks.layout.key === "tub-to-shower" || picks.layout.key === "keep-shower" || picks.layout.key === "combo") {
    betterBits.push("frameless clear glass");
  }
  if (picks.layout.key === "keep-tub" || picks.layout.key === "combo") {
    betterBits.push("clear glass in place of a curtain");
  }
  if (picks.layout.key === "shower-to-tub" || picks.layout.key === "freestanding-tub") {
    betterBits.push("a floor-mounted tub filler");
  }
  if (picks.layout.key === "tub-and-shower") {
    betterBits.push("frameless glass on the shower and a feature wall at the tub");
  }
  if (picks.layout.key === "curbless") {
    betterBits.push("a long niche and a teak or tiled bench");
  }
  const better = `Upgrade to discuss: ${unique(betterBits).slice(0, 3).join(", ")}.`;

  const bestBits: string[] = [];
  if (picks.layout.key !== "curbless" && picks.layout.family === "shower") {
    bestBits.push("going curbless with a linear drain");
  }
  if (picks.layout.key === "curbless") {
    bestBits.push("a handheld shower and a floating bench");
  }
  if (picks.layout.family === "tub" && picks.layout.key !== "freestanding-tub" && picks.layout.key !== "tub-and-shower") {
    bestBits.push("a freestanding tub or a separate walk-in shower if the room allows");
  }
  if (picks.layout.key === "tub-to-shower" || picks.layout.key === "keep-shower") {
    bestBits.push("a bench and a handheld");
  }
  if (picks.wall.path === "custom-tile") {
    bestBits.push("a statement marble niche or a book-matched accent wall");
  } else {
    bestBits.push("a tiled niche or a short tile accent so the solid surface still feels custom");
  }
  if (picks.layout.key === "tub-and-shower" || picks.layout.key === "freestanding-tub") {
    bestBits.push("a floor-mounted filler and a quiet feature wall behind the tub");
  }
  const best = `If they want the full treatment: ${unique(bestBits).slice(0, 3).join(", ")}.`;

  return { good, better, best };
}

export function relatedLooksFor(picks: ResolvedPicks, count = 3): RelatedLook[] {
  const scored = relatedLookCatalog
    .map((item) => {
      let score = 0;
      if (item.walls.includes(picks.wall.key)) score += 6;
      else if (item.path === picks.wall.path) score += 2;
      if (item.layouts.includes(picks.layout.key)) score += 4;
      else if (item.layouts.some((key) => familyOf(key) === picks.layout.family)) score += 2;
      if (item.floors.includes(picks.floor.key)) score += 3;
      if (item.finishes.includes(picks.finish.key)) score += 2;
      // Prefer a close cousin over the exact wall thumbnail as every card.
      if (item.walls.length === 1 && item.walls[0] === picks.wall.key && item.floors.includes(picks.floor.key) && item.finishes.includes(picks.finish.key)) {
        score += 1;
      }
      return { item, score };
    })
    .sort((a, b) => b.score - a.score || a.item.name.localeCompare(b.item.name));

  const picked: RelatedLook[] = [];
  for (const row of scored) {
    if (picked.length >= count) break;
    if (picked.some((item) => item.src === row.item.src)) continue;
    picked.push(row.item);
  }
  return picked.slice(0, count);
}

export function leadFeatureLines(picks: ResolvedPicks, related: RelatedLook[], extra: string[] = []) {
  const points = talkingPoints(picks);
  const path = picks.wall.path === "solid-surface" ? "Solid surface" : "Custom tile";
  return [
    ...extra,
    `Conversion: ${picks.layout.name}`,
    `Walls: ${picks.wall.name} (${path})`,
    `Floor: ${picks.floor.name}`,
    `Fixture finish: ${picks.finish.name}`,
    `Talking point (Good): ${points.good}`,
    `Talking point (Better): ${points.better}`,
    `Talking point (Best): ${points.best}`,
    related.length ? `Related looks shown: ${related.map((item) => item.name).join(", ")}` : "",
  ].filter(Boolean);
}

export function layoutAllowsFixtureChange(layout: DesignLayout, reason: string) {
  const text = reason.toLowerCase();
  const mentionsTub = /\btubs?\b/.test(text);
  const mentionsShower = /\bshowers?\b/.test(text) && !/shower (head|valve|glass|door|curtain|trim)/.test(text);
  const removed = /\b(missing|removed|relocated|gone|deleted|replaced|converted|missing from b)\b/.test(text);
  const added = /\b(added|new tub|new shower|extra tub|became a|converted (in)?to|now a)\b/.test(text);
  const curb = /\b(curb|curbless|linear drain|step-free|step free)\b/.test(text);
  const freestanding = /\bfreestanding\b/.test(text);
  if (mentionsTub && removed && layout.qa.mayRemoveTub) return true;
  if (mentionsTub && added && layout.qa.mayAddTub) return true;
  if (mentionsShower && removed && layout.qa.mayRemoveShower) return true;
  if (mentionsShower && added && layout.qa.mayAddShower) return true;
  if (curb && layout.qa.mayGoCurbless) return true;
  if (freestanding && (layout.qa.mayBeFreestanding || layout.qa.mayAddTub || layout.qa.mayRemoveTub)) return true;
  if (/\bcombo\b/.test(text) && layout.qa.mayBeCombo) return true;
  if (/separate (tub|shower)/.test(text) && layout.qa.mayBeSeparateTubAndShower) return true;
  return false;
}

export function layoutQaNotes(layout: DesignLayout) {
  const allowed: string[] = [];
  if (layout.qa.mayRemoveTub) allowed.push("the tub may be removed and replaced with a shower in the same footprint");
  if (layout.qa.mayAddTub) allowed.push("a tub may be added in the shower alcove or a natural open bathing area");
  if (layout.qa.mayRemoveShower) allowed.push("a shower-only stall may become a tub");
  if (layout.qa.mayAddShower) allowed.push("a shower may be added as described by the conversion");
  if (layout.qa.mayGoCurbless) allowed.push("the shower may become curbless with a linear drain and no curb");
  if (layout.qa.mayBeFreestanding) allowed.push("an alcove tub may be replaced with a freestanding tub in the same bathing area");
  if (layout.qa.mayBeCombo) allowed.push("a tub/shower combination with clear glass over the tub is allowed");
  if (layout.qa.mayBeSeparateTubAndShower) allowed.push("the room may show both a tub and a separate shower");
  return allowed;
}

function familyOf(key: string): "shower" | "tub" | "both" {
  if (BOTH_LAYOUTS.includes(key)) return "both";
  if (TUB_LAYOUTS.includes(key)) return "tub";
  return "shower";
}

function unique(items: string[]) {
  return [...new Set(items.filter(Boolean))];
}
