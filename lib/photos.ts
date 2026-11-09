/** Onyx Collection photographs. Captions credit the manufacturer, never a local job. */

export type Photo = {
  src: string;
  width: number;
  height: number;
  alt: string;
  caption: string;
  sourceUrl: string;
  sourcePage: string;
  span?: string;
};

const showerGallery = "https://onyxcollection.com/shower-gallery/";
const wallPanels = "https://onyxcollection.com/shower-wall-panels/";
const tubGallery = "https://onyxcollection.com/tub-surround-tub-deck-gallery/";
const lavGallery = "https://onyxcollection.com/lavatory-gallery/";

export const heroPhoto: Photo = {
  src: "/images/gloss-bath.webp",
  width: 1571,
  height: 1048,
  alt: "Onyx Collection gloss wall panels in a bright bathroom with a freestanding tub, walk-in shower, and integrated lavatory.",
  caption: "Onyx Collection gloss wall panels",
  sourceUrl: "https://onyxcollection.com/wp-content/uploads/2023/10/WP_Gloss_main2.jpg",
  sourcePage: wallPanels,
};

export const featurePhoto: Photo = {
  src: "/images/panel-stone.webp",
  width: 1600,
  height: 1200,
  alt: "Onyx Collection stone tile wall panels in an open shower beside a freestanding tub and a window.",
  caption: "Onyx Collection stone tile wall panels",
  sourceUrl: "https://onyxcollection.com/wp-content/uploads/2023/10/WP_Stone11-scaled.jpg",
  sourcePage: wallPanels,
};

export const panelPhotos: Photo[] = [
  heroPhoto,
  {
    src: "/images/panel-subway.webp",
    width: 1400,
    height: 1866,
    alt: "Onyx Collection subway tile wall panels in a glass-enclosed shower with a bench.",
    caption: "Onyx Collection subway tile wall panels",
    sourceUrl: "https://onyxcollection.com/wp-content/uploads/2023/10/WP_Subway12-scaled.jpg",
    sourcePage: wallPanels,
  },
  featurePhoto,
  {
    src: "/images/panel-wavy.webp",
    width: 1125,
    height: 1500,
    alt: "Onyx Collection wavy tile wall panels in an open shower with a niche and a linear texture.",
    caption: "Onyx Collection wavy tile wall panels",
    sourceUrl: "https://onyxcollection.com/wp-content/uploads/2023/10/WP_Wavy11.jpg",
    sourcePage: wallPanels,
  },
  {
    src: "/images/panel-shiplap.webp",
    width: 1399,
    height: 1866,
    alt: "Onyx Collection shiplap wall panels with recessed niches and a corner shelf.",
    caption: "Onyx Collection shiplap wall panels",
    sourceUrl: "https://onyxcollection.com/wp-content/uploads/2023/10/WP_Shiplap_main2.jpg",
    sourcePage: wallPanels,
  },
  {
    src: "/images/panel-artisan.webp",
    width: 1400,
    height: 1866,
    alt: "Onyx Collection artisan tile wall panels in a white shower with a recessed niche.",
    caption: "Onyx Collection artisan tile wall panels",
    sourceUrl: "https://onyxcollection.com/wp-content/uploads/2023/10/OW_ArtisanTile03.png",
    sourcePage: wallPanels,
  },
];

export const galleryPhotos: Photo[] = [
  {
    src: "/images/shower-arch.webp",
    width: 1536,
    height: 2048,
    alt: "Onyx Collection shower gallery photo of a walk-in shower with an arched glass opening, a seat, and niches.",
    caption: "Onyx Collection shower gallery",
    sourceUrl: "https://onyxcollection.com/wp-content/uploads/2026/01/OW_G_CustomShower88.png",
    sourcePage: showerGallery,
    span: "col-span-2 md:col-span-4",
  },
  {
    src: "/images/shower-subway.webp",
    width: 1536,
    height: 2048,
    alt: "Onyx Collection shower gallery photo of a white subway-pattern walk-in shower with a seat and a window.",
    caption: "Onyx Collection shower gallery",
    sourceUrl: "https://onyxcollection.com/wp-content/uploads/2026/01/OW_G_CustomShower104.jpg",
    sourcePage: showerGallery,
    span: "col-span-1 md:col-span-2",
  },
  {
    src: "/images/shower-cream.webp",
    width: 1536,
    height: 2048,
    alt: "Onyx Collection shower gallery photo of a cream walk-in shower with a low curb and a sliding glass door.",
    caption: "Onyx Collection shower gallery",
    sourceUrl: "https://onyxcollection.com/wp-content/uploads/2026/10/OW_G_CustomShower122.png",
    sourcePage: showerGallery,
    span: "col-span-1 md:col-span-2",
  },
  {
    src: "/images/shower-seat.webp",
    width: 1536,
    height: 2048,
    alt: "Onyx Collection shower gallery photo of a speckled shower with a seat, a niche, and a grab bar.",
    caption: "Onyx Collection shower gallery",
    sourceUrl: "https://onyxcollection.com/wp-content/uploads/2026/08/OW_G_CustomShower118.jpg",
    sourcePage: showerGallery,
    span: "col-span-1 md:col-span-2",
  },
  {
    src: "/images/shower-warm.webp",
    width: 1400,
    height: 1866,
    alt: "Onyx Collection shower gallery photo of a white shower enclosure against warm painted walls.",
    caption: "Onyx Collection shower gallery",
    sourceUrl: "https://onyxcollection.com/wp-content/uploads/2026/01/OW_G_CustomShower96.jpg",
    sourcePage: showerGallery,
    span: "col-span-1 md:col-span-2",
  },
  {
    src: "/images/shower-neo.webp",
    width: 1536,
    height: 2048,
    alt: "Onyx Collection shower gallery photo of a neo-angle shower base next to a bathtub.",
    caption: "Onyx Collection shower gallery",
    sourceUrl: "https://onyxcollection.com/wp-content/uploads/2026/08/OW_G_CustomShower116.jpg",
    sourcePage: showerGallery,
    span: "col-span-2 md:col-span-2",
  },
  {
    src: "/images/shower-room.webp",
    width: 1536,
    height: 2048,
    alt: "Onyx Collection shower gallery photo of a subway-pattern shower in a bathroom with a freestanding tub.",
    caption: "Onyx Collection shower gallery",
    sourceUrl: "https://onyxcollection.com/wp-content/uploads/2026/07/OW_G_CustomShower113.jpg",
    sourcePage: showerGallery,
    span: "col-span-2 md:col-span-4",
  },
  {
    src: "/images/tub-detail.webp",
    width: 1240,
    height: 1856,
    alt: "Onyx Collection tub surround with a recessed niche above a bathtub.",
    caption: "Onyx Collection tub surround",
    sourceUrl: "https://onyxcollection.com/wp-content/uploads/2024/10/Tub_gallery-36.jpg",
    sourcePage: tubGallery,
    span: "col-span-1 md:col-span-2",
  },
  {
    src: "/images/tub-room.webp",
    width: 1600,
    height: 1064,
    alt: "Onyx Collection tub surround in a bathroom with a bathtub, window, and double lavatory.",
    caption: "Onyx Collection tub surround",
    sourceUrl: "https://onyxcollection.com/wp-content/uploads/2023/02/Tub_gallery-28.jpg",
    sourcePage: tubGallery,
    span: "col-span-2 md:col-span-4",
  },
  {
    src: "/images/lavatory.webp",
    width: 1400,
    height: 1866,
    alt: "Onyx Collection lavatory, a rectangular bowl integrated into a vanity top.",
    caption: "Onyx Collection lavatory",
    sourceUrl: "https://onyxcollection.com/wp-content/uploads/2026/08/lav_bowl_rectangular63.png",
    sourcePage: lavGallery,
    span: "col-span-2 md:col-span-2",
  },
];

export const beforeAfterPhotos: Photo[] = [
  {
    src: "/images/before-after-shower.webp",
    width: 1266,
    height: 610,
    alt: "Onyx Collection before-and-after example showing a shower replacement. The photograph is labeled Before and After by the manufacturer.",
    caption: "Onyx Collection before-and-after example",
    sourceUrl: "https://onyxcollection.com/wp-content/uploads/2023/09/OW_Before_after01.jpg",
    sourcePage: "https://onyxcollection.com/wp-content/uploads/2023/09/OW_Before_after01.jpg",
  },
  {
    src: "/images/before-after-tub.webp",
    width: 950,
    height: 634,
    alt: "Onyx Collection before-and-after example showing a tub-to-shower change. The photograph is labeled Before and After by the manufacturer.",
    caption: "Onyx Collection before-and-after example",
    sourceUrl: "https://onyxcollection.com/wp-content/uploads/2024/01/OW_Before_after07.jpg",
    sourcePage: "https://onyxcollection.com/wp-content/uploads/2024/01/OW_Before_after07.jpg",
  },
];

export const estimatePhoto = galleryPhotos[2];
