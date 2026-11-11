/** Bathroom photographs used as remodel examples. */

export type Photo = {
  src: string;
  width: number;
  height: number;
  alt: string;
  caption: string;
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

const home = (name: string, width: number, height: number, alt: string, caption: string): Photo => ({
  src: `/images/home/${name}.webp`,
  width,
  height,
  alt,
  caption,
});

/** Home "Looks we can build" gallery: about 30% solid surface, the rest tile and architectural looks. AI examples, never presented as completed jobs. */
export const homeGalleryPhotos: Photo[] = [
  home("travertine-arch", 1600, 1200, "Walk-in shower behind a plastered arched opening, travertine-look tile, a bench, an arched niche and a frameless glass door.", "Arched shower opening"),
  heroSlides[3],
  home("marble-glass", 1200, 1600, "Shower with a marble-look back wall, white subway-style side walls, a long niche and a frameless glass door.", "Marble-look shower"),
  home("zellige-arch-niche", 1200, 1600, "Arched entry into a white zellige shower with an arched niche, a rain head and a marble-look bench.", "Zellige shower"),
  home("penny-drain", 1200, 1600, "Brass square decorative drain set flush in white penny round tile.", "Penny tile and drain"),
  home("sage-tile-tub", 1200, 1600, "Sage handmade tile shower with a frameless glass door beside a freestanding tub.", "Sage tile shower"),
  heroSlides[0],
  home("bookmatch-stone", 1200, 1600, "Curbless shower with book-matched stone-look walls, a lit niche, a floating bench and brass fixtures.", "Stone-look shower"),
  home("blush-tile", 1200, 1600, "Blush handmade tile shower with a cross-handle valve, a niche and a frameless glass door.", "Blush tile shower"),
  home("arch-shower-vanity", 1600, 900, "Arched zellige shower with a bench and niche beside a white-oak double vanity with arched mirrors.", "Arched shower and vanity"),
];

/** AI-generated example images (docs/image-sources.md). Never presented as completed jobs. */
export const solidPhotos: Photo[] = [
  {
    src: "/images/ai/ss-walkin.webp",
    width: 1280,
    height: 720,
    alt: "Warm-white solid surface walk-in shower with frameless glass, a niche, a bench and brass fixtures.",
    caption: "Walk-in shower",
  },
  {
    src: "/images/ai/ss-arch.webp",
    width: 1280,
    height: 720,
    alt: "Arched walk-in shower with seamless warm-white solid surface walls, a bench, a linear drain and brass fixtures.",
    caption: "Arched walk-in shower",
  },
  {
    src: "/images/ai/ss-tub-walls.webp",
    width: 864,
    height: 1152,
    alt: "Alcove tub with a seamless white solid surface surround with soft veining and two recessed shelves.",
    caption: "Tub walls",
  },
  {
    src: "/images/ai/ss-tub-to-shower.webp",
    width: 1152,
    height: 864,
    alt: "Tub alcove converted to a walk-in shower with greige solid surface walls, a bench and a sliding glass door.",
    caption: "Tub-to-shower conversion",
  },
  galleryPhotos[4],
  galleryPhotos[6],
  galleryPhotos[7],
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

export const tilePhotos: Photo[] = [
  tile("08", "Wide view of a remodeled bathroom with a freestanding tub, a glass walk-in shower and a floating double vanity.", "Full remodel"),
  tile("01", "Walk-in shower in handmade deep-green zellige tile with brass fixtures and a frameless glass panel.", "Zellige shower"),
  tile("02", "Patterned encaustic-look floor tile under a freestanding soaking tub in window light.", "Patterned floor"),
  tile("06", "Spa shower in dark stone-look tile with a brass rain head and a warm wood bench.", "Spa shower"),
  tile("07", "Bright bath with a fluted-tile accent wall and a gold-framed mirror over a white vanity.", "Fluted accent wall"),
  tile("05", "Herringbone floor tile with a furniture-style vintage vanity and an oval brass mirror.", "Herringbone floor"),
  tile("04", "Curbless walk-in shower with a linear drain, bench, niche and a matte-black grab bar.", "Curbless shower"),
  tile("03", "Marble-look large-format wall tile behind a floating walnut double vanity.", "Marble-look walls"),
  tile("09", "Arched travertine-look shower opening with large stone-look wall tile and brass fixtures.", "Arched shower opening"),
  tile("10", "Glossy sand-colored handmade tile with two arched niches and an aged-brass valve.", "Arched niches"),
  tile("14", "Walk-in shower with dramatic burgundy marble-look walls, a lit arched niche and brass fixtures.", "Neo Deco marble look"),
  tile("15", "Muted sage and cream checkerboard floor tile under a freestanding tub with an arched doorway.", "Checkerboard floor"),
  tile("20", "Cobalt blue handmade tile covering the walls and floor around a freestanding tub and glass shower.", "Cobalt color-drenched bath"),
  tile("21", "Butter yellow zellige shower and backsplash beside a light wood vanity.", "Butter yellow zellige"),
  tile("23", "Soft pink and cream star-and-cross pattern tile on a shower wall and floor.", "Geometric pattern"),
];
