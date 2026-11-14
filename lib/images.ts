/** Bathroom photographs used as remodel examples. */

export type Photo = {
  src: string;
  width: number;
  height: number;
  alt: string;
  caption: string;
  /** JPEG fallback for newer looks that ship WebP + JPG. */
  jpg?: string;
};

export type LookCard = {
  label: string;
  href: string;
  src: string;
  alt: string;
  jpg?: string;
};

const archPhoto: Photo = {
  src: "/images/shower-arch.webp",
  width: 1536,
  height: 2048,
  alt: "Warm speckled shower with an arched mirror, a bench, and frameless glass.",
  caption: "Walk-in shower",
};

export const heroSlides: Photo[] = [
  {
    src: "/images/hero-tub.webp",
    width: 1571,
    height: 1047,
    alt: "Bright bathroom with a freestanding tub beside a glass shower, a dark vanity, and a light wood-look floor.",
    caption: "Tub and shower",
  },
  archPhoto,
  {
    src: "/images/hero-walkin.webp",
    width: 1350,
    height: 1800,
    alt: "Walk-in shower with light horizontal wall panels, a corner seat, a glass door, and a dark vanity.",
    caption: "Walk-in shower",
  },
  {
    src: "/images/hero-rain.webp",
    width: 1356,
    height: 1800,
    alt: "Corner shower with a ceiling-mounted rain head, a recessed niche, and frameless glass.",
    caption: "Walk-in shower",
  },
];

export const beforeAfterPhotos: Photo[] = [
  {
    src: "/images/before-after-shower.webp",
    width: 1266,
    height: 610,
    alt: "Before and after of a bathroom: an opened wall beside a toilet, then a finished vanity and glass shower.",
    caption: "Shower remodel",
  },
  {
    src: "/images/before-after-tub.webp",
    width: 950,
    height: 634,
    alt: "Before and after of a bathroom: a tub with sliding doors, then a glass shower.",
    caption: "Tub-to-shower conversion",
  },
];

export const galleryPhotos: Photo[] = [
  heroSlides[0],
  archPhoto,
  heroSlides[2],
  heroSlides[3],
  {
    src: "/images/shower-barn.webp",
    width: 1200,
    height: 1600,
    alt: "Shower with horizontal panels, a black barn-style glass door, a corner seat, and a recessed niche.",
    caption: "Walk-in shower",
  },
  {
    src: "/images/shower-warm.webp",
    width: 1200,
    height: 1600,
    alt: "Walk-in shower with a warm speckled surround, black glass clamps, and a half wall of bronze-toned tile.",
    caption: "Walk-in shower",
  },
  {
    src: "/images/shower-niche.webp",
    width: 1200,
    height: 1600,
    alt: "Speckled shower with a tall recessed niche, a bench, and a handheld shower.",
    caption: "Walk-in shower",
  },
  {
    src: "/images/tub-surround.webp",
    width: 1200,
    height: 1600,
    alt: "Bathtub with a speckled wall surround, black grab bar, and black-framed glass.",
    caption: "Tub surround",
  },
  {
    src: "/images/tub-alcove.webp",
    width: 1200,
    height: 1600,
    alt: "Alcove bathtub with a speckled surround fitted under a sloped ceiling.",
    caption: "Tub surround",
  },
  {
    src: "/images/lav-vanity.webp",
    width: 1275,
    height: 1700,
    alt: "Double lavatory with light speckled tops, white cabinets, and mirrors.",
    caption: "Vanity",
  },
  {
    src: "/images/finish-wavy.webp",
    width: 762,
    height: 1007,
    alt: "Narrow shower lined with a vertical wavy texture, white corner shelves, and matte black fixtures.",
    caption: "Walk-in shower",
  },
];

/** Nov 11 textured looks. Masters are 4:5 except the landscape zellige extra. */
function look(file: string, alt: string, caption: string, size: { width: number; height: number } = { width: 1280, height: 1600 }): Photo {
  return {
    src: `/images/looks/${file}.webp`,
    jpg: `/images/looks/${file}.jpg`,
    width: size.width,
    height: size.height,
    alt,
    caption,
  };
}

export const looks = {
  tm01: look(
    "tm_01_1600",
    "Walk-in shower with book-matched polished Calacatta marble slab walls with gray and gold veining, a marble-lined niche, a brass valve and a ceiling-mounted brass rain head.",
    "Book-matched Calacatta with veins that meet in the middle.",
  ),
  tm02: look(
    "tm_02_1600",
    "Honed white Carrara basketweave mosaic floor with gray dot inserts under a freestanding white tub with a brass floor-mounted tub filler.",
    "Carrara basketweave underfoot, soft as a Sunday morning.",
  ),
  tm03: look(
    "tm_03_1600",
    "Vanity wall in terracotta fluted 3D tile behind a walnut floating vanity with a white marble top, an undermount basin, a centered brass wall faucet and a round brass mirror.",
    "Terracotta ribs that pick up every shadow.",
  ),
  tm04: look(
    "tm_04_1600",
    "Walk-in shower in glossy blush pink skinny tile laid in a vertical stack, with a marble-lined styled niche, a brass cross-handle valve, a brass shower head and a frameless glass door.",
    "Blush skinny tile, stacked tall and glossy.",
  ),
  tm05: look(
    "tm_05_1600",
    "Walk-in shower with matte white chevron wall tile, a matte black valve and square rain head, an oak floating bench, a marble-lined niche and a honed marble floor with a linear drain.",
    "Crisp white chevron with matte black and warm oak.",
  ),
  tm06: look(
    "tm_06_1600",
    "Terracotta, sage and cream star-pattern encaustic-look floor tile under a white clawfoot tub with a brass floor-mounted tub filler beside a window.",
    "Terracotta and sage stars under a classic clawfoot.",
  ),
  tm07: look(
    "tm_07_1600",
    "Walk-in shower in large cream terrazzo tile with terracotta, sage and blush chips, a sage tile niche, brushed brass valve, shower head and handheld.",
    "Confetti terrazzo in terracotta, sage and blush.",
  ),
  tm08: look(
    "tm_08_1600",
    "Walk-in shower with matte black hex mosaic on the floor and lower walls, white marble-look tile above, matte black valve, rain head and handheld, and a hex-lined niche.",
    "Black hex below, marble above, matte black throughout.",
  ),
  tm09: look(
    "tm_09_1600",
    "Floating white-oak vanity with a thick sea-green and white quartzite countertop and full-height quartzite wall, a centered undermount basin, a brass wall faucet and an oval brass mirror.",
    "Sea-green quartzite from the counter to the ceiling.",
  ),
  tm10: look(
    "tm_10_1600",
    "Walk-in shower with seamless warm-white solid surface walls and base, a sage-backed niche, a corner seat, brushed brass valve, shower head and handheld, and a frameless glass door.",
    "Seamless warm white with a pop of sage.",
  ),
  tm11: look(
    "tm_11_1600",
    "Tub-to-shower conversion with seamless cream stone-look solid surface walls, two styled recessed shelves, a matte black valve, rain head and handheld, and a sliding glass door.",
    "The look of stone with nothing to scrub between.",
  ),
  tm12: look(
    "tm_12_1600",
    "Curbless walk-in shower with seamless warm-gray stone-look solid surface walls, a linear drain, a lit long niche, a floating teak bench and aged brass fixtures.",
    "Step-free spa calm in soft warm gray.",
  ),
  greenZellige: look(
    "extra_green_zellige_1600",
    "Walk-in shower in glossy emerald green handmade zellige tile with a marble-lined niche, a brass valve, rain head and handheld, and a honed marble hex floor.",
    "Handmade green zellige that catches the morning light.",
    { width: 1600, height: 900 },
  ),
} as const;

const ssTubWalls: Photo = {
  src: "/images/ai/ss-tub-walls.webp",
  width: 864,
  height: 1152,
  alt: "Alcove tub with a seamless white solid surface surround with soft veining and two recessed shelves.",
  caption: "Tub walls",
};

const ssArch: Photo = {
  src: "/images/ai/ss-arch.webp",
  width: 1280,
  height: 720,
  alt: "Arched walk-in shower with seamless warm-white solid surface walls, a bench, a linear drain and brass fixtures.",
  caption: "Arched walk-in shower",
};

const ssTubToShower: Photo = {
  src: "/images/ai/ss-tub-to-shower.webp",
  width: 1152,
  height: 864,
  alt: "Tub alcove converted to a walk-in shower with greige solid surface walls, a bench and a sliding glass door.",
  caption: "Tub-to-shower conversion",
};


/**
 * Home "Looks we can build" gallery: leads with new textured looks.
 * 4 of 14 are solid surface (29%). One solid-surface photo sits in the first row.
 * Design examples, never presented as completed jobs.
 */
export const homeGalleryPhotos: Photo[] = [
  looks.tm01,
  looks.tm10,
  looks.tm03,
  looks.tm04,
  looks.tm06,
  looks.tm08,
  looks.tm07,
  looks.tm11,
  looks.tm09,
  looks.greenZellige,
  looks.tm05,
  looks.tm02,
  looks.tm12,
  ssTubWalls,
];

/**
 * Dedicated /gallery page: all 12 new looks plus the landscape zellige and a few
 * strong existing shots. 6 of 20 are solid surface (30%).
 */
export const galleryPagePhotos: Photo[] = [
  looks.tm01,
  looks.tm10,
  looks.tm03,
  looks.tm04,
  looks.tm06,
  looks.tm08,
  looks.tm07,
  looks.tm11,
  looks.tm09,
  looks.greenZellige,
  looks.tm05,
  looks.tm02,
  looks.tm12,
  ssTubWalls,
  {
    src: "/images/ai/tile-21.webp",
    width: 1280,
    height: 720,
    alt: "Butter yellow zellige shower and backsplash beside a light wood vanity.",
    caption: "Butter yellow zellige",
  },
  ssArch,
  {
    src: "/images/ai/tile-20.webp",
    width: 1280,
    height: 720,
    alt: "Cobalt blue handmade tile covering the walls and floor around a freestanding tub and glass shower.",
    caption: "Cobalt color-drenched bath",
  },
  ssTubToShower,
  {
    src: "/images/ai/tile-14.webp",
    width: 1280,
    height: 720,
    alt: "Walk-in shower with dramatic burgundy marble-look walls, a lit arched niche and brass fixtures.",
    caption: "Neo Deco marble look",
  },
  {
    src: "/images/ai/tile-27.webp",
    width: 1280,
    height: 720,
    alt: "Black-and-white graphic tile bath with a fluted black vanity, brass fixtures and an octagon-and-dot floor.",
    caption: "Graphic tile floor",
  },
];

/** Manufacturer walk-in photographs already on the site. Never presented as completed jobs. */
export const walkInPhotos: Photo[] = galleryPhotos.filter((photo) => photo.caption === "Walk-in shower");

/** AI-generated example images (docs/image-sources.md). Never presented as completed jobs. */

export const solidPhotos: Photo[] = [
  looks.tm10,
  looks.tm11,
  looks.tm12,
  ssArch,
  ssTubWalls,
  ssTubToShower,
];

export const tileHero = {
  src: "/images/ai/tile-01.webp",
  alt: "Walk-in shower in handmade deep-green zellige tile with brass fixtures and a frameless glass panel.",
};

const tile = (n: string, alt: string, caption: string): Photo => ({
  src: `/images/ai/tile-${n}.webp`,
  width: 1280,
  height: 720,
  alt,
  caption,
});

/** Custom tile gallery: new textured looks first, then unique existing color and trend shots. */
export const tilePhotos: Photo[] = [
  looks.greenZellige,
  looks.tm01,
  looks.tm03,
  looks.tm04,
  looks.tm06,
  looks.tm05,
  looks.tm07,
  looks.tm08,
  looks.tm09,
  looks.tm02,
  tile("14", "Walk-in shower with dramatic burgundy marble-look walls, a lit arched niche and brass fixtures.", "Neo Deco marble look"),
  tile("20", "Cobalt blue handmade tile covering the walls and floor around a freestanding tub and glass shower.", "Cobalt color-drenched bath"),
  tile("21", "Butter yellow zellige shower and backsplash beside a light wood vanity.", "Butter yellow zellige"),
  tile("27", "Black-and-white graphic tile bath with a fluted black vanity, brass fixtures and an octagon-and-dot floor.", "Graphic tile floor"),
  tile("10", "Glossy sand-colored handmade tile with two arched niches and an aged-brass valve.", "Arched niches"),
  tile("09", "Arched travertine-look shower opening with large stone-look wall tile and brass fixtures.", "Arched shower opening"),
  tile("08", "Wide view of a remodeled bathroom with a freestanding tub, a glass walk-in shower and a floating double vanity.", "Full remodel"),
  tile("06", "Spa shower in dark stone-look tile with a brass rain head and a warm wood bench.", "Spa shower"),
  tile("01", "Walk-in shower in handmade deep-green zellige tile with brass fixtures and a frameless glass panel.", "Zellige shower"),
];

/** "Find a starting point" strip: 19 unique looks, doubled in the UI for looping. */
export const shopLooks: LookCard[] = [
  { label: "Calacatta marble slab", href: "/custom-tile", src: looks.tm01.src, jpg: looks.tm01.jpg, alt: looks.tm01.alt },
  { label: "Fluted / 3D tile", href: "/custom-tile", src: looks.tm03.src, jpg: looks.tm03.jpg, alt: looks.tm03.alt },
  { label: "White walk-in", href: "/solid-surface", src: looks.tm10.src, jpg: looks.tm10.jpg, alt: looks.tm10.alt },
  { label: "Stacked skinny tile", href: "/custom-tile", src: looks.tm04.src, jpg: looks.tm04.jpg, alt: looks.tm04.alt },
  { label: "Patterned floor", href: "/custom-tile", src: looks.tm06.src, jpg: looks.tm06.jpg, alt: looks.tm06.alt },
  { label: "Stone-look solid surface", href: "/solid-surface", src: looks.tm11.src, jpg: looks.tm11.jpg, alt: looks.tm11.alt },
  { label: "Herringbone or chevron", href: "/custom-tile", src: looks.tm05.src, jpg: looks.tm05.jpg, alt: looks.tm05.alt },
  { label: "Black hex", href: "/custom-tile", src: looks.tm08.src, jpg: looks.tm08.jpg, alt: looks.tm08.alt },
  { label: "Curbless spa", href: "/solid-surface", src: looks.tm12.src, jpg: looks.tm12.jpg, alt: looks.tm12.alt },
  { label: "Terrazzo", href: "/custom-tile", src: looks.tm07.src, jpg: looks.tm07.jpg, alt: looks.tm07.alt },
  { label: "Quartzite vanity", href: "/custom-tile", src: looks.tm09.src, jpg: looks.tm09.jpg, alt: looks.tm09.alt },
  {
    label: "Green zellige",
    href: "/custom-tile",
    src: "/images/ai/tile-01.webp",
    alt: "Walk-in shower in handmade deep-green zellige tile with brass fixtures and a frameless glass panel.",
  },
  { label: "Tub walls", href: "/solid-surface", src: ssTubWalls.src, alt: ssTubWalls.alt },
  { label: "Carrara mosaic floor", href: "/custom-tile", src: looks.tm02.src, jpg: looks.tm02.jpg, alt: looks.tm02.alt },
  {
    label: "Sage",
    href: "/custom-tile",
    src: "/images/home/sage-tile-tub.webp",
    alt: "Sage handmade tile shower with a frameless glass door beside a freestanding tub.",
  },
  {
    label: "Penny tile",
    href: "/custom-tile",
    src: "/images/home/penny-drain.webp",
    alt: "Brass square decorative drain set flush in white penny round tile.",
  },
  { label: "Tub-to-shower", href: "/solid-surface", src: ssTubToShower.src, alt: ssTubToShower.alt },
  {
    label: "Black & brass",
    href: "/custom-tile",
    src: "/images/ai/tile-06.webp",
    alt: "Spa shower in dark stone-look tile with a brass rain head and a warm wood bench.",
  },
  {
    label: "Marble-look",
    href: "/custom-tile",
    src: "/images/home/marble-glass.webp",
    alt: "Shower with a marble-look back wall, white subway-style side walls, a long niche and a frameless glass door.",
  },
];

/** "New & inspiring" row: newer textured looks plus two unique existing color shots. */
export const inspiringLooks: Array<Pick<Photo, "src" | "alt" | "jpg">> = [
  { src: looks.tm01.src, jpg: looks.tm01.jpg, alt: looks.tm01.alt },
  {
    src: "/images/hero/hero-33-1600.webp",
    alt: "Floating oak vanity against a glossy butter-yellow tile wall with a round brass mirror.",
  },
  { src: looks.tm03.src, jpg: looks.tm03.jpg, alt: looks.tm03.alt },
  { src: looks.tm06.src, jpg: looks.tm06.jpg, alt: looks.tm06.alt },
  { src: looks.tm09.src, jpg: looks.tm09.jpg, alt: looks.tm09.alt },
  { src: looks.tm12.src, jpg: looks.tm12.jpg, alt: looks.tm12.alt },
  { src: looks.tm04.src, jpg: looks.tm04.jpg, alt: looks.tm04.alt },
  {
    src: "/images/hero/hero-35-1600.webp",
    alt: "Walk-in shower in glossy teal tile with a niche, brass fixtures and a white bench outside the glass.",
  },
  { src: looks.tm07.src, jpg: looks.tm07.jpg, alt: looks.tm07.alt },
  { src: looks.tm08.src, jpg: looks.tm08.jpg, alt: looks.tm08.alt },
];

