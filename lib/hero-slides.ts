/** Paired home-hero stills and headlines. Photos rotate; each headline stays with its photo. */

export type HeroSlide = {
  n: string;
  position: string;
  headline: string;
};

export const HERO_SLIDES: readonly HeroSlide[] = [
  { n: "17", position: "42% center", headline: "Your bathroom shouldn't be boring." },
  { n: "33", position: "58% center", headline: "Color that makes mornings better." },
  { n: "18", position: "55% center", headline: "See your new bathroom before you spend a dime." },
  { n: "34", position: "62% center", headline: "Bold floors, zero regrets." },
  { n: "24", position: "50% center", headline: "Your bathroom shouldn't be boring." },
  { n: "35", position: "64% center", headline: "Handmade tile, made for your room." },
  { n: "19", position: "30% center", headline: "See your new bathroom before you spend a dime." },
  { n: "26", position: "58% center", headline: "The bathroom your friends will ask about." },
] as const;

export const HERO_LONGEST_HEADLINE = "See your new bathroom before you spend a dime.";

export const HERO_WIDTHS = [960, 1600, 2560] as const;

export const heroSrcSet = (n: string, ext: "avif" | "webp" | "jpg") =>
  HERO_WIDTHS.map((w) => `/images/hero/hero-${n}-${w}.${ext} ${w}w`).join(", ");

const first = HERO_SLIDES[0];

/** Preload the first still so the opening slide paints quickly. AVIF first; WebP is the fallback. */
export const FIRST_HERO_PRELOAD = {
  href: `/images/hero/hero-${first.n}-1600.avif`,
  srcSet: heroSrcSet(first.n, "avif"),
  type: "image/avif",
  fallbackHref: `/images/hero/hero-${first.n}-1600.webp`,
  fallbackSrcSet: heroSrcSet(first.n, "webp"),
  fallbackType: "image/webp",
} as const;
