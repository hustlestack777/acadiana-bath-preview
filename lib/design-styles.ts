/** Style cards for the Design My Bathroom tool. Images are AI examples, never Justin's jobs. */
export type DesignStyle = {
  key: string;
  /** Boogie's image number (boogie_NN in /workspace/abc_build/ai_photos), or "ss" for ss_walkin_stylecard. Used by lib/budget.ts. */
  boogie: string;
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
    boogie: "ss",
    name: "Solid surface walk-in",
    blurb: "Smooth warm-white walls, almost no grout.",
    image: "/images/design/ss-walkin.webp",
    alt: "Warm-white solid surface walk-in shower with frameless glass and brass fixtures.",
    path: "solid-surface",
    project: "ss-shower-walls",
    spec: "smooth seamless warm-white solid surface shower wall panels with no grout lines, a matching solid surface shower base, one recessed niche, frameless clear glass, brushed brass fixture finish",
  },
  {
    key: "ss-arch",
    boogie: "13",
    name: "Solid surface arch",
    blurb: "Soft arch, clean cream walls, built-in bench.",
    image: "/images/design/ss-arch.webp",
    alt: "Cream solid surface shower with an arched opening and a built-in bench.",
    path: "solid-surface",
    project: "ss-shower-walls",
    spec: "seamless cream solid surface shower walls with no grout lines, one soft arched recessed niche, a matching solid surface tub or shower surround, brushed brass fixture finish",
  },
  {
    key: "zellige",
    boogie: "01",
    name: "Green zellige",
    blurb: "Glossy handmade-look green tile and brass.",
    image: "/images/design/zellige.webp",
    alt: "Deep-green zellige-look tile shower with brass fixtures and frameless glass.",
    path: "custom-tile",
    project: "tile-shower",
    spec: "deep green glossy handmade zellige-look square wall tile with thin light grout, a recessed niche, small light hex mosaic shower floor, frameless clear glass, brushed brass fixture finish",
  },
  {
    key: "curbless",
    boogie: "04",
    name: "Curbless walk-in",
    blurb: "Step-free entry, grab bar and handheld. Accessible design.",
    image: "/images/design/curbless.webp",
    alt: "Light stone-look tile curbless shower with a linear drain, grab bar and handheld shower.",
    path: "custom-tile",
    project: "tile-shower",
    spec: "light warm-grey large-format stone-look porcelain wall and floor tile, a low-profile tiled shower floor if it is already a walk-in shower, one recessed niche, a frameless clear glass panel, matte black fixture finish",
  },
  {
    key: "dark-spa",
    boogie: "06",
    name: "Dark stone spa",
    blurb: "Moody charcoal tile, rain head, wood bench.",
    image: "/images/design/dark-spa.webp",
    alt: "Charcoal stone-look tile spa shower with a rain head and a wood bench.",
    path: "custom-tile",
    project: "tile-shower",
    spec: "charcoal large-format stone-look porcelain wall and floor tile, warm soft lighting from the existing light fixtures, frameless clear glass, brushed brass fixture finish",
  },
  {
    key: "warm-arch",
    boogie: "09",
    name: "Warm arch",
    blurb: "Travertine-look tile and a curved opening.",
    image: "/images/design/warm-arch.webp",
    alt: "Arched shower opening finished in warm travertine-look tile with brass fixtures.",
    path: "custom-tile",
    project: "tile-shower",
    spec: "warm beige travertine-look porcelain tile walls and floor, one soft arched recessed niche, brushed brass fixture finish, frameless clear glass",
  },
  {
    key: "sand-niche",
    boogie: "10",
    name: "Sand tile + arched niches",
    blurb: "Glossy sand tile with soft arched niches.",
    image: "/images/design/sand-niche.webp",
    alt: "Glossy sand-colored square tile shower wall with two lit arched niches.",
    path: "custom-tile",
    project: "tile-shower",
    spec: "glossy sand-colored handmade-look square wall tile, one arched recessed niche on the valve wall, aged brass fixture finish, light pebble-look shower floor, frameless clear glass",
  },
  {
    key: "neo-deco",
    boogie: "14",
    name: "Neo Deco marble look",
    blurb: "Bold burgundy marble-look slabs and brass.",
    image: "/images/design/neo-deco.webp",
    alt: "Burgundy marble-look slab shower with a lit arched niche and brass fixtures.",
    path: "custom-tile",
    project: "tile-shower",
    spec: "bold burgundy marble-look large porcelain slab walls with cream veining, one arched recessed niche, brushed brass fixture finish, cream stone-look floor tile, frameless clear glass",
  },
  {
    key: "limewash",
    boogie: "16",
    name: "Limewash walls",
    blurb: "Soft plaster-look walls, calm and simple.",
    image: "/images/design/limewash.webp",
    alt: "Calm bathroom with limewash-look walls, a stone-look ledge and a vessel basin.",
    path: "custom-tile",
    project: "tile-bathroom",
    spec: "soft warm-white limewash-look walls, simple large light stone-look shower wall tile, a recessed niche, light stone-look floor, frameless clear glass, brushed brass fixture finish",
  },
  {
    key: "pink-zellige",
    boogie: "17",
    name: "Pink zellige accent",
    blurb: "Blush handmade-look tile and warm wood.",
    image: "/images/design/pink-zellige.webp",
    alt: "Blush pink zellige-look tile walls with a light wood vanity and brass fixtures.",
    path: "custom-tile",
    project: "tile-shower",
    spec: "blush pink glossy handmade zellige-look square wall tile in the shower, light warm floor tile, frameless clear glass, brushed brass fixture finish",
  },
  {
    key: "butter",
    boogie: "21",
    name: "Butter yellow zellige",
    blurb: "A cheerful pop of soft yellow tile.",
    image: "/images/design/butter.webp",
    alt: "Butter-yellow zellige-look shower tile with brass fixtures and a light vanity.",
    path: "custom-tile",
    project: "tile-shower",
    spec: "soft butter-yellow glossy handmade zellige-look square wall tile in the shower, light cream floor tile, frameless clear glass, brushed brass fixture finish",
  },
  {
    key: "checker",
    boogie: "15",
    name: "Soft checkerboard floor",
    blurb: "Muted sage-and-cream checkerboard floor.",
    image: "/images/design/checker.webp",
    alt: "Muted sage and cream checkerboard floor with a freestanding tub.",
    path: "custom-tile",
    project: "tile-floor",
    spec: "a muted sage-green and cream diagonal checkerboard floor tile, clean warm-white shower walls in large light tile, frameless clear glass, brushed brass fixture finish",
  },
  {
    key: "bold-checker",
    boogie: "22",
    name: "Bold checkerboard floor",
    blurb: "Terracotta-and-cream checkerboard underfoot.",
    image: "/images/design/bold-checker.webp",
    alt: "Terracotta and cream checkerboard floor with a freestanding tub.",
    path: "custom-tile",
    project: "tile-floor",
    spec: "a terracotta and cream diagonal checkerboard floor tile, clean warm-white shower walls in large light tile, frameless clear glass, brushed brass fixture finish",
  },
  {
    key: "emerald",
    boogie: "18",
    name: "Emerald zellige",
    blurb: "Rich glossy emerald tile, floor to ceiling.",
    image: "/images/design/emerald.webp",
    alt: "Emerald-green zellige-look tile shower with a linear drain and brass fixtures.",
    path: "custom-tile",
    project: "tile-shower",
    spec: "rich emerald-green glossy handmade zellige-look wall tile floor to ceiling in the shower, one recessed niche, light floor tile, frameless clear glass panel, brushed brass fixture finish",
  },
  {
    key: "cobalt",
    boogie: "20",
    name: "Cobalt color drench",
    blurb: "Deep blue tile wrapped all around.",
    image: "/images/design/cobalt.webp",
    alt: "Cobalt-blue tile shower and walls with brass fixtures.",
    path: "custom-tile",
    project: "tile-bathroom",
    spec: "deep cobalt-blue glossy square tile on the shower walls and floor, frameless clear glass, brushed brass fixture finish",
  },
  {
    key: "terracotta",
    boogie: "19",
    name: "Terracotta handmade tile",
    blurb: "Warm clay-tone tile and natural wood.",
    image: "/images/design/terracotta.webp",
    alt: "Terracotta handmade-look tile shower with a herringbone terracotta floor.",
    path: "custom-tile",
    project: "tile-shower",
    spec: "warm terracotta handmade-look square wall tile in the shower, a terracotta herringbone floor, frameless clear glass, brushed brass fixture finish",
  },
  {
    key: "quartzite",
    boogie: "24",
    name: "Quartzite-look vanity + green tile",
    blurb: "Stone-look vanity top with deep green tile.",
    image: "/images/design/quartzite.webp",
    alt: "Quartzite-look vanity top under deep green glossy tile and a brass mirror.",
    path: "custom-tile",
    project: "tile-bathroom",
    spec: "deep green glossy handmade zellige-look wall tile, a warm quartzite-look stone vanity top if a vanity is visible in the photo, matching green tile in the shower, frameless clear glass, brushed brass fixture finish",
  },
];

export function findStyle(key: string) {
  return designStyles.find((style) => style.key === key) ?? null;
}

export const designCopy = {
  cta: "Design My Bathroom",
  headline: "Your new bathroom, before you spend a dime.",
  sub: "Pick a look, snap your shower, and see it come to life in your own space.",
  /** The only fine print in the tool (Shaun, 11/10/2026). */
  finePrint: "Design preview. Final pricing at your free consult.",
  tips: "Stand in the doorway, phone at chest height, lights on, whole shower in frame.",
  steps: ["Scanning your bathroom…", "Clearing the clutter…", "Designing…", "Polishing…", "Checking every detail…"],
  /** Shown instead of an image when no render passes the automatic QA check. */
  customTitle: "Justin will put together a custom design for you.",
  customBody: (look: string) =>
    `Your bathroom deserves a closer look than our quick preview can give. Tell us where to send it, and Justin will design the ${look} look for your space himself.`,
  customThanks: (look: string) =>
    `Justin has your photos and the ${look} look you picked. He'll put together a custom design for your bathroom and reach out about your free quote.`,
  smsConsent:
    "Yes, Acadiana Bathrooms and Countertops may call or text me about my project at the number above, including automated texts. Consent isn't a condition of purchase. Msg & data rates may apply. Reply STOP to opt out.",
  privacy:
    "What we collect: your name, contact info, address, photos and the look you picked. Your photos and design go to Acadiana Bathrooms and Countertops so Justin can prepare your estimate. We never sell your information.",
};
