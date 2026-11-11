/** Style cards for the Design My Bathroom tool. Images are AI examples, never Justin's jobs. */
export type DesignStyle = {
  key: string;
  name: string;
  blurb: string;
  image: string;
  alt: string;
  /** Path the lead belongs to. */
  path: "solid-surface" | "custom-tile";
  /** Lead project id from lib/copy.ts pathProjects. */
  project: string;
  /** What the render should build. Surfaces only; never prices or claims. */
  spec: string;
};

export const designStyles: DesignStyle[] = [
  {
    key: "ss-walkin",
    name: "Solid surface walk-in",
    blurb: "Smooth warm-white walls, almost no grout.",
    image: "/images/design/ss-walkin.webp",
    alt: "Warm-white solid surface walk-in shower with frameless glass and brass fixtures.",
    path: "solid-surface",
    project: "ss-shower-walls",
    spec: "smooth seamless warm-white solid surface shower wall panels with no grout lines, a matching solid surface shower base, one recessed niche, frameless clear glass, brushed brass shower fixtures",
  },
  {
    key: "ss-arch",
    name: "Solid surface arch",
    blurb: "Soft arch, clean cream walls, built-in bench.",
    image: "/images/design/ss-arch.webp",
    alt: "Cream solid surface shower with an arched opening and a built-in bench.",
    path: "solid-surface",
    project: "ss-shower-walls",
    spec: "seamless cream solid surface shower walls with no grout lines, a soft arched shower opening if the shower opening allows it, a low built-in bench, matching solid surface base, brushed brass fixtures",
  },
  {
    key: "zellige",
    name: "Green zellige",
    blurb: "Glossy handmade-look green tile and brass.",
    image: "/images/design/zellige.webp",
    alt: "Deep-green zellige-look tile shower with brass fixtures and frameless glass.",
    path: "custom-tile",
    project: "tile-shower",
    spec: "deep green glossy handmade zellige-look square wall tile with thin light grout, a recessed niche, small light hex mosaic shower floor, frameless clear glass, brushed brass fixtures",
  },
  {
    key: "curbless",
    name: "Curbless walk-in",
    blurb: "Step-free entry, grab bar and handheld. Accessible design.",
    image: "/images/design/curbless.webp",
    alt: "Light stone-look tile curbless shower with a linear drain, grab bar and handheld shower.",
    path: "custom-tile",
    project: "tile-shower",
    spec: "light warm-grey large-format stone-look porcelain wall tile, a step-free curbless shower floor with a linear drain, a matte black grab bar, handheld shower on a slide bar, a recessed niche, frameless clear glass panel",
  },
  {
    key: "dark-spa",
    name: "Dark stone spa",
    blurb: "Moody charcoal tile, rain head, wood bench.",
    image: "/images/design/dark-spa.webp",
    alt: "Charcoal stone-look tile spa shower with a rain head and a wood bench.",
    path: "custom-tile",
    project: "tile-shower",
    spec: "charcoal large-format stone-look porcelain wall and floor tile, a ceiling rain shower head plus handheld, a floating teak bench, warm recessed lighting, frameless clear glass, brushed brass fixtures",
  },
  {
    key: "warm-arch",
    name: "Warm arch",
    blurb: "Travertine-look tile and a curved opening.",
    image: "/images/design/warm-arch.webp",
    alt: "Arched shower opening finished in warm travertine-look tile with brass fixtures.",
    path: "custom-tile",
    project: "tile-shower",
    spec: "warm beige travertine-look porcelain tile walls and floor, a soft arched shower opening if the opening allows it, a recessed niche, brushed brass fixtures, frameless clear glass",
  },
  {
    key: "sand-niche",
    name: "Sand tile + arched niches",
    blurb: "Glossy sand tile with soft arched niches.",
    image: "/images/design/sand-niche.webp",
    alt: "Glossy sand-colored square tile shower wall with two lit arched niches.",
    path: "custom-tile",
    project: "tile-shower",
    spec: "glossy sand-colored handmade-look square wall tile, two arched recessed niches on the valve wall, aged brass fixtures, light pebble-look shower floor, frameless clear glass",
  },
  {
    key: "neo-deco",
    name: "Neo Deco marble look",
    blurb: "Bold burgundy marble-look slabs and brass.",
    image: "/images/design/neo-deco.webp",
    alt: "Burgundy marble-look slab shower with a lit arched niche and brass fixtures.",
    path: "custom-tile",
    project: "tile-shower",
    spec: "bold burgundy marble-look large porcelain slab walls with cream veining, a lit arched niche, brushed brass fixtures, cream stone-look floor tile, frameless clear glass",
  },
  {
    key: "slab-vanity",
    name: "Quartzite-look slab vanity",
    blurb: "Bright slab-look walls and a wide stone-look vanity top.",
    image: "/images/design/slab-vanity.webp",
    alt: "Bright bathroom with white quartzite-look slab walls and a double vanity.",
    path: "custom-tile",
    project: "tile-bathroom",
    spec: "white quartzite-look large slab walls with soft grey veining in the shower, a matching quartzite-look vanity top if a vanity is visible in the photo, frameless clear glass, brushed nickel fixtures",
  },
];

export function findStyle(key: string) {
  return designStyles.find((style) => style.key === key) ?? null;
}

export const designCopy = {
  cta: "Design My Bathroom",
  headline: "Your new bathroom, before you spend a dime.",
  sub: "Snap your shower, pick a look, and see it in your own space in about a minute.",
  label: "AI design idea, not a quote or final result.",
  examples: "Examples of what your remodel could look like.",
  tips: "Stand in the doorway, phone at chest height, lights on, whole shower in frame.",
  steps: ["Scanning your bathroom…", "Clearing the clutter…", "Designing…", "Polishing…"],
  smsConsent:
    "Yes, Acadiana Bathrooms and Countertops may call or text me about my project at the number above, including automated texts. Consent isn't a condition of purchase. Msg & data rates may apply. Reply STOP to opt out.",
  privacy:
    "What we collect: your name, contact info, address, photos and the look you picked. Your photos and design go to Acadiana Bathrooms and Countertops so Justin can prepare your estimate. We never sell your information.",
};
