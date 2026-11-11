/** Looks a visitor can start from, mapped onto Design My Bathroom picks. */

export const LOOK_STORAGE_KEY = "abc-starting-look";

export type StartingLook = {
  id: string;
  name: string;
  src: string;
  jpg?: string;
  alt: string;
  path: "/custom-tile" | "/solid-surface";
  /** Other gallery files that should resolve to this same look. */
  aliases?: string[];
  wall?: string;
  floor?: string;
  finish?: string;
  /** Only set when the photo itself is clearly that conversion. */
  layout?: string;
  promptHint?: string;
};

export type DesignOpenStep = "layout" | "walls" | "floor" | "finish" | "budget" | "photos";

export const startingLooks: StartingLook[] = [
  {
    id: "calacatta",
    name: "Calacatta marble slab",
    src: "/images/looks/tm_01_1600.webp",
    jpg: "/images/looks/tm_01_1600.jpg",
    alt: "Walk-in shower with book-matched polished Calacatta marble slab walls with gray and gold veining, a marble-lined niche, a brass valve and a ceiling-mounted brass rain head.",
    path: "/custom-tile",
    aliases: ["/images/design-picks/calacatta.webp"],
    wall: "calacatta",
    floor: "mosaic",
    finish: "brass",
    promptHint: "Match the book-matched Calacatta marble slab walls with soft gray and gold veining.",
  },
  {
    id: "fluted",
    name: "Fluted 3D tile",
    src: "/images/looks/tm_03_1600.webp",
    jpg: "/images/looks/tm_03_1600.jpg",
    alt: "Vanity wall in terracotta fluted 3D tile behind a walnut floating vanity with a white marble top, an undermount basin, a centered brass wall faucet and a round brass mirror.",
    path: "/custom-tile",
    aliases: ["/images/design-picks/fluted.webp"],
    wall: "fluted",
    floor: "encaustic",
    finish: "brass",
    promptHint: "Match the terracotta or warm clay-tone fluted 3D wall tile that catches the light.",
  },
  {
    id: "ss-white",
    name: "White walk-in",
    src: "/images/looks/tm_10_1600.webp",
    jpg: "/images/looks/tm_10_1600.jpg",
    alt: "Walk-in shower with seamless warm-white solid surface walls and base, a sage-backed niche, a corner seat, brushed brass valve, shower head and handheld, and a frameless glass door.",
    path: "/solid-surface",
    aliases: ["/images/design-picks/ss-white.webp", "/images/design/ss-walkin.webp", "/images/ai/ss-walkin.webp"],
    wall: "ss-white",
    floor: "porcelain",
    finish: "brass",
    promptHint: "Use seamless warm-white solid surface walls with almost no grout, and a soft sage-backed niche.",
  },
  {
    id: "stacked-skinny",
    name: "Stacked skinny tile",
    src: "/images/looks/tm_04_1600.webp",
    jpg: "/images/looks/tm_04_1600.jpg",
    alt: "Walk-in shower in glossy blush pink skinny tile laid in a vertical stack, with a marble-lined styled niche, a brass cross-handle valve, a brass shower head and a frameless glass door.",
    path: "/custom-tile",
    aliases: ["/images/design-picks/stacked-skinny.webp"],
    wall: "stacked-skinny",
    floor: "mosaic",
    finish: "brass",
    promptHint: "Match the glossy blush skinny wall tile stacked vertically, with a marble-lined niche.",
  },
  {
    id: "patterned-floor",
    name: "Patterned floor",
    src: "/images/looks/tm_06_1600.webp",
    jpg: "/images/looks/tm_06_1600.jpg",
    alt: "Terracotta, sage and cream star-pattern encaustic-look floor tile under a white clawfoot tub with a brass floor-mounted tub filler beside a window.",
    path: "/custom-tile",
    aliases: ["/images/design-picks/encaustic.webp"],
    wall: "fluted",
    floor: "encaustic",
    finish: "brass",
    promptHint: "The star of this look is the terracotta, sage and cream star-pattern encaustic-look floor.",
  },
  {
    id: "ss-stone",
    name: "Stone-look solid surface",
    src: "/images/looks/tm_11_1600.webp",
    jpg: "/images/looks/tm_11_1600.jpg",
    alt: "Tub-to-shower conversion with seamless cream stone-look solid surface walls, two styled recessed shelves, a matte black valve, rain head and handheld, and a sliding glass door.",
    path: "/solid-surface",
    aliases: ["/images/design-picks/ss-stone.webp"],
    wall: "ss-stone",
    floor: "porcelain",
    finish: "matte-black",
    promptHint: "Use seamless cream stone-look solid surface walls with nothing to scrub between, and matte black fixtures.",
  },
  {
    id: "herringbone",
    name: "Herringbone or chevron",
    src: "/images/looks/tm_05_1600.webp",
    jpg: "/images/looks/tm_05_1600.jpg",
    alt: "Walk-in shower with matte white chevron wall tile, a matte black valve and square rain head, an oak floating bench, a marble-lined niche and a honed marble floor with a linear drain.",
    path: "/custom-tile",
    aliases: ["/images/design-picks/herringbone.webp"],
    wall: "herringbone",
    floor: "porcelain",
    finish: "matte-black",
    promptHint: "Match the matte white chevron or herringbone wall tile with matte black fixtures.",
  },
  {
    id: "black-hex",
    name: "Black hex",
    src: "/images/looks/tm_08_1600.webp",
    jpg: "/images/looks/tm_08_1600.jpg",
    alt: "Walk-in shower with matte black hex mosaic on the floor and lower walls, white marble-look tile above, matte black valve, rain head and handheld, and a hex-lined niche.",
    path: "/custom-tile",
    aliases: ["/images/design-picks/black-hex.webp"],
    wall: "black-hex",
    floor: "hex",
    finish: "matte-black",
    promptHint: "Match the matte black hex mosaic on the lower walls and floor, with marble-look tile above.",
  },
  {
    id: "curbless-spa",
    name: "Curbless spa",
    src: "/images/looks/tm_12_1600.webp",
    jpg: "/images/looks/tm_12_1600.jpg",
    alt: "Curbless walk-in shower with seamless warm-gray stone-look solid surface walls, a linear drain, a lit long niche, a floating teak bench and aged brass fixtures.",
    path: "/solid-surface",
    aliases: ["/images/design-picks/curbless-spa.webp", "/images/design/curbless.webp"],
    wall: "ss-stone",
    floor: "porcelain",
    finish: "brass",
    layout: "curbless",
    promptHint: "Build a curbless, step-free spa shower with a linear drain and a floating teak or tiled bench.",
  },
  {
    id: "terrazzo",
    name: "Terrazzo",
    src: "/images/looks/tm_07_1600.webp",
    jpg: "/images/looks/tm_07_1600.jpg",
    alt: "Walk-in shower in large cream terrazzo tile with terracotta, sage and blush chips, a sage tile niche, brushed brass valve, shower head and handheld.",
    path: "/custom-tile",
    aliases: ["/images/design-picks/terrazzo.webp"],
    wall: "terrazzo",
    floor: "porcelain",
    finish: "brass",
    promptHint: "Match the large cream terrazzo-look tile with terracotta, sage and blush chips.",
  },
  {
    id: "quartzite-vanity",
    name: "Quartzite vanity",
    src: "/images/looks/tm_09_1600.webp",
    jpg: "/images/looks/tm_09_1600.jpg",
    alt: "Floating white-oak vanity with a thick sea-green and white quartzite countertop and full-height quartzite wall, a centered undermount basin, a brass wall faucet and an oval brass mirror.",
    path: "/custom-tile",
    finish: "brass",
    promptHint:
      "If a vanity is visible, use a thick sea-green and white quartzite-look countertop and a matching full-height quartzite backsplash wall. Do not invent a vanity if the photo has none.",
  },
  {
    id: "green-zellige",
    name: "Green zellige",
    src: "/images/ai/tile-01.webp",
    alt: "Walk-in shower in handmade deep-green zellige tile with brass fixtures and a frameless glass panel.",
    path: "/custom-tile",
    aliases: [
      "/images/looks/extra_green_zellige_1600.webp",
      "/images/design/zellige.webp",
      "/images/design/emerald.webp",
      "/images/design-picks/zellige-hex.webp",
    ],
    wall: "zellige",
    floor: "hex",
    finish: "brass",
    promptHint: "Match the glossy handmade deep-green zellige wall tile with thin light grout.",
  },
  {
    id: "tub-walls",
    name: "Tub walls",
    src: "/images/ai/ss-tub-walls.webp",
    alt: "Alcove tub with a seamless white solid surface surround with soft veining and two recessed shelves.",
    path: "/solid-surface",
    wall: "ss-white",
    floor: "porcelain",
    finish: "chrome",
    layout: "keep-tub",
    promptHint: "Keep the tub and refresh the surround with seamless white solid surface walls and recessed shelves.",
  },
  {
    id: "carrara-mosaic",
    name: "Carrara mosaic floor",
    src: "/images/looks/tm_02_1600.webp",
    jpg: "/images/looks/tm_02_1600.jpg",
    alt: "Honed white Carrara basketweave mosaic floor with gray dot inserts under a freestanding white tub with a brass floor-mounted tub filler.",
    path: "/custom-tile",
    aliases: ["/images/design-picks/marble-mosaic.webp"],
    wall: "calacatta",
    floor: "mosaic",
    finish: "brass",
    promptHint: "The star of this look is a honed white Carrara basketweave mosaic floor.",
  },
  {
    id: "sage",
    name: "Sage",
    src: "/images/home/sage-tile-tub.webp",
    alt: "Sage handmade tile shower with a frameless glass door beside a freestanding tub.",
    path: "/custom-tile",
    finish: "brass",
    promptHint: "Use handmade sage or soft green tile on the shower walls, with clear glass.",
  },
  {
    id: "penny-tile",
    name: "Penny tile",
    src: "/images/home/penny-drain.webp",
    alt: "Brass square decorative drain set flush in white penny round tile.",
    path: "/custom-tile",
    floor: "mosaic",
    finish: "brass",
    promptHint: "Use a white penny-round mosaic floor with a decorative drain if a drain is visible.",
  },
  {
    id: "tub-to-shower",
    name: "Tub-to-shower",
    src: "/images/ai/ss-tub-to-shower.webp",
    alt: "Tub alcove converted to a walk-in shower with greige solid surface walls, a bench and a sliding glass door.",
    path: "/solid-surface",
    wall: "ss-stone",
    floor: "porcelain",
    finish: "chrome",
    layout: "tub-to-shower",
    promptHint: "Convert the tub into a walk-in shower with seamless greige or stone-look solid surface walls and a bench if it fits.",
  },
  {
    id: "black-brass",
    name: "Black & brass",
    src: "/images/ai/tile-06.webp",
    alt: "Spa shower in dark stone-look tile with a brass rain head and a warm wood bench.",
    path: "/custom-tile",
    finish: "brass",
    promptHint: "Use dark stone-look wall tile with warm brass fixtures and a warm wood bench if the footprint allows.",
  },
  {
    id: "marble-look",
    name: "Marble-look",
    src: "/images/home/marble-glass.webp",
    alt: "Shower with a marble-look back wall, white subway-style side walls, a long niche and a frameless glass door.",
    path: "/custom-tile",
    wall: "calacatta",
    floor: "porcelain",
    finish: "chrome",
    promptHint: "Use a marble-look feature wall with quieter side walls, a long niche and clear glass.",
  },
  {
    id: "butter-yellow-vanity",
    name: "Butter yellow tile",
    src: "/images/hero/hero-33-1600.webp",
    alt: "Floating oak vanity against a glossy butter-yellow tile wall with a round brass mirror.",
    path: "/custom-tile",
    finish: "brass",
    promptHint: "If a vanity wall is visible, use glossy butter-yellow handmade tile behind it. Do not invent a vanity if the photo has none.",
  },
  {
    id: "teal-tile",
    name: "Teal tile",
    src: "/images/hero/hero-35-1600.webp",
    alt: "Walk-in shower in glossy teal tile with a niche, brass fixtures and a white bench outside the glass.",
    path: "/custom-tile",
    finish: "brass",
    promptHint: "Use glossy teal handmade-look wall tile with a niche and brass fixtures.",
  },
  {
    id: "butter-yellow-zellige",
    name: "Butter yellow zellige",
    src: "/images/ai/tile-21.webp",
    alt: "Butter yellow zellige shower and backsplash beside a light wood vanity.",
    path: "/custom-tile",
    finish: "brass",
    promptHint: "Use glossy butter-yellow zellige-look tile on the shower walls.",
  },
  {
    id: "ss-arch",
    name: "Arched walk-in",
    src: "/images/ai/ss-arch.webp",
    alt: "Arched walk-in shower with seamless warm-white solid surface walls, a bench, a linear drain and brass fixtures.",
    path: "/solid-surface",
    wall: "ss-white",
    floor: "porcelain",
    finish: "brass",
    promptHint: "Use seamless warm-white solid surface walls. Keep an existing arched opening if the photo has one; do not invent a new arch.",
  },
  {
    id: "cobalt",
    name: "Cobalt color-drenched bath",
    src: "/images/ai/tile-20.webp",
    alt: "Cobalt blue handmade tile covering the walls and floor around a freestanding tub and glass shower.",
    path: "/custom-tile",
    finish: "brass",
    promptHint: "Use cobalt blue handmade tile on the walls, keeping the existing layout of the room.",
  },
  {
    id: "neo-deco",
    name: "Neo Deco marble look",
    src: "/images/ai/tile-14.webp",
    alt: "Walk-in shower with dramatic burgundy marble-look walls, a lit arched niche and brass fixtures.",
    path: "/custom-tile",
    wall: "calacatta",
    floor: "porcelain",
    finish: "brass",
    promptHint: "Use dramatic burgundy or wine marble-look slab walls with a lit niche and brass fixtures.",
  },
  {
    id: "graphic-tile",
    name: "Graphic tile floor",
    src: "/images/ai/tile-27.webp",
    alt: "Black-and-white graphic tile bath with a fluted black vanity, brass fixtures and an octagon-and-dot floor.",
    path: "/custom-tile",
    floor: "encaustic",
    finish: "brass",
    promptHint: "Use a black-and-white graphic or octagon-and-dot floor if a floor is visible, with brass fixtures.",
  },
  {
    id: "arched-niches",
    name: "Arched niches",
    src: "/images/ai/tile-10.webp",
    alt: "Glossy sand-colored handmade tile with two arched niches and an aged-brass valve.",
    path: "/custom-tile",
    finish: "brass",
    promptHint: "Use glossy sand-colored handmade tile. Keep existing niches; do not add a new arched niche unless one is already in the photo.",
  },
  {
    id: "arched-opening",
    name: "Arched shower opening",
    src: "/images/ai/tile-09.webp",
    alt: "Arched travertine-look shower opening with large stone-look wall tile and brass fixtures.",
    path: "/custom-tile",
    floor: "porcelain",
    finish: "brass",
    promptHint: "Use large travertine or stone-look wall tile. Keep an existing arched opening if the photo has one; do not invent a new arch.",
  },
  {
    id: "full-remodel",
    name: "Full remodel",
    src: "/images/ai/tile-08.webp",
    alt: "Wide view of a remodeled bathroom with a freestanding tub, a glass walk-in shower and a floating double vanity.",
    path: "/custom-tile",
    floor: "wood-look",
    finish: "brass",
    layout: "tub-and-shower",
    promptHint: "This look is a full bathroom with both a freestanding tub and a separate glass shower, if the room allows without moving the toilet, vanity, windows or doors.",
  },
  {
    id: "hero-tub",
    name: "Tub + separate shower",
    src: "/images/hero-tub.webp",
    alt: "Bright bathroom with a freestanding tub beside a glass shower, a dark vanity, and a light wood-look floor.",
    path: "/custom-tile",
    wall: "calacatta",
    floor: "wood-look",
    finish: "chrome",
    layout: "tub-and-shower",
    promptHint: "A freestanding tub beside a separate glass shower on a light wood-look floor, if the room allows without moving the toilet, vanity, windows or doors.",
  },
];

const byId = new Map(startingLooks.map((look) => [look.id, look]));
const bySrc = new Map<string, StartingLook>();
for (const look of startingLooks) {
  bySrc.set(look.src, look);
  if (look.jpg) bySrc.set(look.jpg, look);
  for (const alias of look.aliases ?? []) bySrc.set(alias, look);
}
// JPEG twins of the WebP look masters and of the green zellige extra.
for (const look of startingLooks) {
  if (look.src.startsWith("/images/looks/") && look.src.endsWith(".webp")) {
    bySrc.set(look.src.replace(/\.webp$/, ".jpg"), look);
  }
}

export function findStartingLook(id: string | null | undefined) {
  if (!id) return null;
  return byId.get(id.trim()) ?? null;
}

export function findStartingLookBySrc(src: string | null | undefined) {
  if (!src) return null;
  return bySrc.get(src) ?? null;
}

export function pathHrefForLook(look: StartingLook) {
  return `${look.path}?look=${encodeURIComponent(look.id)}`;
}

export function designHref(lookId?: string | null) {
  const look = findStartingLook(lookId);
  return look ? `/design?look=${encodeURIComponent(look.id)}` : "/design";
}

export function picksFromLook(look: StartingLook) {
  return {
    layout: look.layout ?? "",
    wall: look.wall ?? "",
    floor: look.floor ?? "",
    finish: look.finish ?? "",
  };
}

/** Layout is asked first even when a look preselects it, so the visitor can confirm or change it. */
export function firstOpenStep(look?: StartingLook | null): DesignOpenStep {
  void look;
  return "layout";
}

export const LOOK_CHANGE_EVENT = "abc-starting-look";

function notifyLookChange() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(LOOK_CHANGE_EVENT));
}

export function persistStartingLook(id: string) {
  if (typeof window === "undefined") return;
  if (!findStartingLook(id)) return;
  try {
    sessionStorage.setItem(LOOK_STORAGE_KEY, id);
    notifyLookChange();
  } catch {
    // Private mode can throw; the URL param is enough.
  }
}

export function readStartingLook() {
  if (typeof window === "undefined") return "";
  try {
    return sessionStorage.getItem(LOOK_STORAGE_KEY) || "";
  } catch {
    return "";
  }
}

export function clearStartingLook() {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(LOOK_STORAGE_KEY);
    notifyLookChange();
  } catch {
    // Ignore a blocked store.
  }
}

export function resolveLookParam(raw: string | null | undefined) {
  const fromId = findStartingLook(raw);
  if (fromId) return fromId;
  return findStartingLookBySrc(raw || "");
}
