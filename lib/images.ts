/** Real Onyx Collection photographs. Not this business's completed jobs. */

export type Photo = {
  src: string;
  width: number;
  height: number;
  alt: string;
  caption: string;
  source: string;
  page: string;
};

const showerPage = "https://onyxcollection.com/shower-gallery/";
const panelPage = "https://onyxcollection.com/shower-wall-panels/";
const tubPage = "https://onyxcollection.com/tub-surround-tub-deck-gallery/";
const lavPage = "https://onyxcollection.com/lavatory-gallery/";
const colorPage = "https://onyxcollection.com/color-selection/";

const archPhoto: Photo = {
  src: "/images/shower-arch.webp",
  width: 1536,
  height: 2048,
  alt: "Warm speckled shower with an arched mirror, a bench, and frameless glass. Onyx Collection shower-gallery example.",
  caption: "Shower gallery example",
  source: "https://onyxcollection.com/wp-content/uploads/2026/01/OW_G_CustomShower88.png",
  page: showerPage,
};

export const heroSlides: Photo[] = [
  {
    src: "/images/hero-tub.webp",
    width: 1571,
    height: 1047,
    alt: "Bright bathroom with a freestanding tub beside a glass shower, a dark vanity, and a light wood-look floor. Onyx Collection gloss wall-panel example.",
    caption: "Gloss smooth wall panels",
    source: "https://onyxcollection.com/wp-content/uploads/2023/10/WP_Gloss_main2.jpg",
    page: panelPage,
  },
  archPhoto,
  {
    src: "/images/hero-walkin.webp",
    width: 1350,
    height: 1800,
    alt: "Walk-in shower with light horizontal wall panels, a corner seat, a glass door, and a dark vanity. Onyx Collection shower-gallery example.",
    caption: "Shower gallery example",
    source: "https://onyxcollection.com/wp-content/uploads/2026/01/OW_G_CustomShower104.jpg",
    page: showerPage,
  },
  {
    src: "/images/hero-rain.webp",
    width: 1356,
    height: 1800,
    alt: "Corner shower with a ceiling-mounted rain head, a recessed niche, and frameless glass. Onyx Collection shower-gallery example.",
    caption: "Shower gallery example",
    source: "https://onyxcollection.com/wp-content/uploads/2026/02/OW_G_StandardShower84-scaled.jpg",
    page: showerPage,
  },
];

export const beforeAfterPhotos: Photo[] = [
  {
    src: "/images/before-after-shower.webp",
    width: 1266,
    height: 610,
    alt: "Onyx Collection composite labeled Before and After: an opened wall beside a toilet, then a finished vanity and glass shower.",
    caption: "Shower example, labeled by Onyx",
    source: "https://onyxcollection.com/wp-content/uploads/2023/09/OW_Before_after01.jpg",
    page: "https://onyxcollection.com/wp-content/uploads/2023/09/OW_Before_after01.jpg",
  },
  {
    src: "/images/before-after-tub.webp",
    width: 950,
    height: 634,
    alt: "Onyx Collection composite labeled Before and After: a tub with sliding doors, then a glass shower.",
    caption: "Tub-to-shower example, labeled by Onyx",
    source: "https://onyxcollection.com/wp-content/uploads/2024/01/OW_Before_after07.jpg",
    page: "https://onyxcollection.com/wp-content/uploads/2024/01/OW_Before_after07.jpg",
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
    alt: "Shower with horizontal panels, a black barn-style glass door, a corner seat, and a recessed niche. Onyx Collection shower-gallery example.",
    caption: "Shower gallery example",
    source: "https://onyxcollection.com/wp-content/uploads/2026/09/OW_G_StandardShower101.jpg",
    page: showerPage,
  },
  {
    src: "/images/shower-warm.webp",
    width: 1200,
    height: 1600,
    alt: "Walk-in shower with a warm speckled surround, black glass clamps, and a half wall of bronze-toned tile. Onyx Collection shower-gallery example.",
    caption: "Shower gallery example",
    source: "https://onyxcollection.com/wp-content/uploads/2026/01/OW_G_CustomShower73.jpg",
    page: showerPage,
  },
  {
    src: "/images/shower-niche.webp",
    width: 1200,
    height: 1600,
    alt: "Speckled shower with a tall recessed niche, a bench, and a handheld shower. Onyx Collection shower-gallery example.",
    caption: "Shower gallery example",
    source: "https://onyxcollection.com/wp-content/uploads/2026/05/OW_G_CustomShower109.jpg",
    page: showerPage,
  },
  {
    src: "/images/tub-surround.webp",
    width: 1200,
    height: 1600,
    alt: "Bathtub with a speckled wall surround, black grab bar, and black-framed glass. Onyx Collection tub-surround example.",
    caption: "Tub surround example",
    source: "https://onyxcollection.com/wp-content/uploads/2024/01/Tub_gallery-34.jpg",
    page: tubPage,
  },
  {
    src: "/images/tub-alcove.webp",
    width: 1200,
    height: 1600,
    alt: "Alcove bathtub with a speckled surround fitted under a sloped ceiling. Onyx Collection tub-surround example.",
    caption: "Tub surround example",
    source: "https://onyxcollection.com/wp-content/uploads/2026/07/Tub_gallery-40-scaled.jpeg",
    page: tubPage,
  },
  {
    src: "/images/lav-vanity.webp",
    width: 1275,
    height: 1700,
    alt: "Double lavatory with light speckled tops, white cabinets, and mirrors. Onyx Collection lavatory-gallery example.",
    caption: "Lavatory gallery example",
    source: "https://onyxcollection.com/wp-content/uploads/2026/07/lav_bowl_oval3.jpg",
    page: lavPage,
  },
  {
    src: "/images/finish-wavy.webp",
    width: 762,
    height: 1007,
    alt: "Narrow shower lined with a vertical wavy texture, white corner shelves, and matte black fixtures. Onyx Collection wavy-tile wall-panel example.",
    caption: "Wavy tile wall panels",
    source: "https://onyxcollection.com/wp-content/uploads/2022/10/WP_Wavy_main1.jpg",
    page: panelPage,
  },
];

export const patternPhotos: Record<string, Photo> = {
  gloss: heroSlides[0],
  subway: {
    src: "/images/finish-subway.webp",
    width: 1600,
    height: 1200,
    alt: "Close view of a white subway-pattern wall panel with a corner shelf. Onyx Collection subway tile example.",
    caption: "Subway tile wall panels",
    source: "https://onyxcollection.com/wp-content/uploads/2023/10/WP_Subway_Main.jpg",
    page: panelPage,
  },
  stone: {
    src: "/images/finish-stone.webp",
    width: 1007,
    height: 1007,
    alt: "Shower with a gray stone-tile pattern, recessed niches, and dark grab bars. Onyx Collection stone tile wall-panel example.",
    caption: "Stone tile wall panels",
    source: "https://onyxcollection.com/wp-content/uploads/2023/10/WP_Stone_main2.jpg",
    page: panelPage,
  },
  wavy: galleryPhotos[9],
  shiplap: {
    src: "/images/finish-shiplap.webp",
    width: 1125,
    height: 1500,
    alt: "Shower corner with horizontal grooved panels, recessed niches, and corner shelves. Onyx Collection shiplap wall-panel example.",
    caption: "Shiplap wall panels",
    source: "https://onyxcollection.com/wp-content/uploads/2023/10/WP_Shiplap_main2.jpg",
    page: panelPage,
  },
  artisan: {
    src: "/images/finish-artisan.webp",
    width: 1125,
    height: 1500,
    alt: "White large-format tiled shower corner with a recessed niche and a brass handheld shower. Onyx Collection artisan tile example.",
    caption: "Artisan tile wall panels",
    source: "https://onyxcollection.com/wp-content/uploads/2023/10/OW_ArtisanTile03.png",
    page: panelPage,
  },
};

export const colorChips: Photo[] = [
  ["color-white-onyx.webp", "White Onyx", "WhiteOnyx-1.jpg"],
  ["color-carrara.webp", "Carrara", "Carrara-1.jpg"],
  ["color-feather.webp", "Feather", "Feather-1.jpg"],
  ["color-sandstone.webp", "Sandstone", "Sandstone-1.jpg"],
  ["color-travertine.webp", "Travertine", "Travertine-1.jpg"],
  ["color-tiramisu.webp", "Tiramisu", "Tiramisu-1.jpg"],
  ["color-henna.webp", "Henna", "Henna-1.jpg"],
  ["color-charcoal.webp", "Charcoal", "Charcoal-1.jpg"],
].map(([src, name, file]) => ({
  src: `/images/${src}`,
  width: 177,
  height: 95,
  alt: `${name} color-selector photograph from the Onyx Collection. Photography does not reliably show the physical color.`,
  caption: name,
  source: `https://onyxcollection.com/wp-content/uploads/2025/06/${file}`,
  page: colorPage,
}));
