/** Customer-facing copy. No invented prices or coverage terms. */

import { OUTSIDE_AREA, SERVICE_AREA } from "./coverage";
import { warrantyStandBehind } from "./warranty";

export const brand = {
  name: "Acadiana Bathrooms and Countertops",
  phone: "(337) 522-0023",
  phoneHref: "tel:+13375220023",
  email: "acadianabathandcounter@gmail.com",
  emailHref: "mailto:acadianabathandcounter@gmail.com",
  website: "abclafayette.com",
  websiteHref: "https://abclafayette.com",
} as const;

export const services = [
  "Showers",
  "Tubs",
  "Lavatories",
  "Flooring",
  "Toilets",
  "Wallpaper",
] as const;

export const cardClaims = {
  consult: "Get My Free Quote",
} as const;

export const hero = {
  eyebrow: "Lafayette, Louisiana",
  title: "Bring a little beautiful to every day.",
  support:
    "From seamless solid surface, where Onyx is a preferred material, to handmade tile, quartz, quartzite and marble, we match the right materials to your space and your budget.",
  primary: "Get My Free Quote",
  secondary: "(337) 522-0023",
} as const;

/** Home hero headline pool. Shuffled per visit with a random start; add lines here later. */
export const heroHeadlines = [
  "Your bathroom shouldn't be boring.",
  "Tile with soul. Style that shows.",
  "Stone that stops people at the door.",
  "Warm, handmade, one of a kind.",
  "Bold floors. Zero regrets.",
  "Let's get stylish.",
  "The bathroom your friends will ask about.",
  "Color that makes mornings better.",
  "Handmade tile, made for your room.",
] as const;

export const heroHeadlineReduced = "Your bathroom shouldn't be boring.";

export const heroSubhead =
  `Custom showers, tile, quartz, quartzite and marble, planned carefully for your space. ${SERVICE_AREA}`;

export const heroDesignCta = "Design My Bathroom";

export const quoteCta = "Get My Free Quote";

export const trustLine =
  "Free quote. We'll call to discuss your project, your style and what you have in mind, then set a time to take measurements. When your consultant measures, they'll go over design options with you, and you'll get your exact price right then.";

/** Later mentions on pages that already used trustLine or another first mention. */
export const trustLineFollow =
  "Free quote. We'll call to discuss your project, your style and what you have in mind, then set a time to take measurements. When your consultant measures, they'll go over design options with you, and you'll get your exact price right then.";

export const heroQuoteLine = "Starting at $7K · Free quote.";

export const editorial = {
  eyebrow: "The room, considered",
  title: "Less stepping over. More stepping into.",
  body: "A shower, a tub, a lavatory, the floor underfoot. We plan every detail with you and manage your project from design to the finished bathroom, so you have one point of contact from the first call to the last day on site.",
} as const;

export const reasons = [
  {
    title: "Made for your room.",
    body: "Niches where you need them, a bench if you want one, and an entry with no step when the space allows.",
  },
  {
    title: "Style you choose.",
    body: "Zellige, patterned floors, quartz, quartzite or seamless solid surface. Bold or calm, it's your call.",
  },
  {
    title: "Easy to live with.",
    body: "Low-grout options and finishes chosen to stand up to South Louisiana humidity.",
  },
] as const;

export const material = {
  title: "Tile or solid surface? We'll help you choose.",
  body: "Solid surface gives you clean lines and almost no grout. Custom tile gives you color, texture and pattern. We lay out the look, the budget and the upkeep of each, so you choose with confidence.",
  close:
    "Find the look that feels like home. When your consultant measures, they'll go over materials and design options with you.",
} as const;

export const care = {
  title: "Less fuss on cleaning day.",
  body: "A simple weekly cleaning is enough.",
} as const;

export const stepsTitle = "How a quote works.";

export const steps = [
  { title: "Tell us about your project and the best day and time to reach you.", body: "" },
  { title: "We'll call to discuss your project, your style and what you have in mind, and set a time to take measurements.", body: "" },
  { title: "When your consultant measures, they'll go over design options with you, and you'll get your exact price right then.", body: "" },
  { title: "When you're ready to move forward, we manage your project from design to the finished bathroom.", body: "" },
] as const;

export const area = {
  title: "Where we work",
  intro: SERVICE_AREA,
  townsLabel: "Towns we serve include",
  outside: OUTSIDE_AREA,
  faq: `${SERVICE_AREA} ${OUTSIDE_AREA}`,
} as const;

export const beforeAfter = {
  title: "Before and after",
} as const;

export const gallery = {
  eyebrow: "Gallery",
  title: "Looks we can build for you",
} as const;

export { homeFaqs as faqs } from "./faq-page";

export const talk = {
  title: "Want to discuss your project?",
  body: "Send a photo and a quick note, and we'll call you. Prefer email? Write acadianabathandcounter@gmail.com.",
} as const;

export const close = {
  title: "Start with the bathroom you have.",
  body: "Tell us what you want to change, the best day and time to reach you, and share a few photos if you have them. We'll call you to discuss your project and set a time to take measurements. When your consultant measures, they'll go over design options with you, and you'll get your exact price right then.",
} as const;

export const lead = {
  title: "Free Quote",
  subhead:
    "Tell us about your project and the best day and time to reach you. We'll call you to discuss your project and set a time to take measurements. When your consultant measures, they'll go over design options with you, and you'll get your exact price right then.",
  submit: "Get My Free Quote",
  thanks: "You're all set. We'll call you in the one-hour window you picked to discuss your project. Save the Acadiana Bathrooms and Countertops number so you know it's us calling: (337) 522-0023.",
  savedNote: "Nothing to pay today.",
  savedTitle: "Got it!",
  photosTitle: "Their photos",
  addressLabel: "Street address",
  addressHint: "So we know where the project is. Start typing and pick your address.",
  extrasTitle: "Want to help us prepare?",
  extrasBody:
    "Optional: add rough measurements and share up to 8 photos. Rough numbers are fine. We'll call you to discuss your project and set a time to take measurements.",
  extrasSubmit: "Save extras",
  extrasSaved: "Extras saved. We'll see them with your request.",
} as const;

export const projects = [
  { id: "tub-to-shower", label: "Tub-to-shower conversion", detail: "Replace a tub with a walk-in shower." },
  { id: "showers", label: "Showers", detail: "Walk-in showers and shower updates." },
  { id: "tubs", label: "Tubs", detail: "Tub work in the bathroom." },
  { id: "lavatories", label: "Lavatories", detail: "Sinks and the surrounding area." },
  { id: "flooring", label: "Flooring", detail: "Flooring in the bathroom." },
  { id: "toilets", label: "Toilets", detail: "Toilet work in the room." },
  { id: "wallpaper", label: "Wallpaper", detail: "Wall covering in the room." },
] as const;

export const homeowners = [
  { id: "own", label: "I own this home" },
  { id: "rent", label: "I rent" },
] as const;

export const payments = [
  { id: "cash", label: "Cash / check / card" },
  { id: "not-sure", label: "Not sure yet" },
] as const;

export const paymentNote =
  "Pick whatever fits today. Nothing here checks your credit.";

export const consentLabel =
  "I agree that Acadiana Bathrooms and Countertops may contact me about this project request by phone or email.";

export const callTimeNote =
  "Pick a good time to call. We'll use this to plan our call to you."

export const finishes = [
  { id: "unsure", label: "Not sure yet" },
  { id: "lighter", label: "Lighter finishes" },
  { id: "warmer", label: "Warmer finishes" },
  { id: "deeper", label: "Deeper finishes" },
  { id: "with-owner", label: "I’ll decide with your team" },
] as const;

export const timings = [
  { id: "exploring", label: "Just exploring" },
  { id: "ready", label: "Ready to review options" },
  { id: "later", label: "Planning for later" },
] as const;

export const projectNote =
  "Pick everything you'd like. When your consultant measures, they'll go over design options with you, and you'll get your exact price right then.";

export const featureNote =
  "Pick everything you'd like. When your consultant measures, they'll go over design options with you, and you'll get your exact price right then.";

export const photoNote =
  "Optional photos: one wide bathroom view, the shower or tub, and any problem areas. Leave out people and personal documents. Up to 8 photos. They are resized in your browser before sending.";

export const dimensionNote =
  "Rough numbers are fine. We'll call you to discuss your project and set a time to take measurements.";

/** Two clear paths. No prices on either path until pricing is supplied. */

export const pathProjects = [
  { id: "ss-tub-to-shower", label: "Solid surface: tub-to-shower conversion", short: "Tub-to-shower conversion" },
  { id: "ss-shower-walls", label: "Solid surface: shower walls", short: "Shower walls" },
  { id: "ss-tub-walls", label: "Solid surface: tub walls / surround", short: "Tub walls / surround" },
  { id: "tile-shower", label: "Custom tile: shower", short: "Custom tile shower" },
  { id: "tile-bathroom", label: "Custom tile: full bathroom", short: "Full bathroom" },
  { id: "tile-floor", label: "Custom tile: floor", short: "Tile floor" },
  { id: "tile-accent", label: "Custom tile: accent wall or backsplash", short: "Accent wall or backsplash" },
] as const;

export const solidPath = {
  slug: "/solid-surface",
  eyebrow: "Path one · Solid surface",
  cardTitle: "Solid surface showers & tub walls",
  cardBody: "The affordable, low-grout route. Tub-to-shower conversions and fresh shower or tub walls that wipe clean.",
  title: "Clean lines. Less grout. Less to scrub.",
  support:
    "Seamless walls, soft arches, and almost no grout to scrub, in a wide range of colors and finishes. We'll help you pick the one that fits your space and budget.",
  cta: "Get a solid surface quote",
  whyTitle: "Why most customers start here",
  why: [
    { title: "Less grout", body: "Large panels mean far fewer grout lines than a tiled wall." },
    { title: "The right material", body: "Onyx is a preferred material, and we install other quality solid surface options too, so your walls fit your style and your budget." },
    { title: "Easy care", body: "A simple weekly cleaning is enough." },
  ],
  servicesTitle: "What this path covers",
  services: [
    { title: "Tub-to-shower conversions", body: "Swap a tub you step over for a walk-in shower." },
    { title: "Shower walls", body: "New walls for an existing shower, with niches and a seat if the space allows." },
    { title: "Tub walls and surrounds", body: "Keep the tub and refresh the walls around it." },
  ],
  warranty: warrantyStandBehind,
  care: "A simple weekly cleaning is enough.",
  formTitle: "Solid surface quote",
  formBody: "A few quick questions, and we'll call to discuss your project and set a time to take measurements.",
} as const;

export const tilePath = {
  slug: "/custom-tile",
  eyebrow: "Path two · Custom tile",
  cardTitle: "Custom tile showers & bathrooms",
  cardBody: "Handmade zellige, patterned floors, bold grout. A designer bathroom planned around the look you love.",
  title: "Tile with a point of view.",
  support:
    "Zellige walls, patterned cement-look floors, arched niches and grout colors that make the tile sing. Bring your inspiration and we'll plan it together.",
  cta: "Get My Free Tile Quote",
  looksTitle: "Looks people ask for",
  looks: [
    { title: "Handmade zellige", body: "Glossy, irregular tile that catches the light. Stacked, offset or herringbone." },
    { title: "Patterned floors", body: "Encaustic and cement-look patterns that set the mood for the whole room." },
    { title: "Statement niches", body: "Arched or full-height niches, benches and curbless entries where the space allows." },
    { title: "Grout as a design choice", body: "Match the tile for a calm wall, or contrast it for a bold grid." },
  ],
  groutTitle: "Pick a grout color",
  groutBody:
    "Colors from the Mapei grout and caulk palette. Tap a swatch to preview it and add it to your tile request.",
  groutNote: "Screen colors are approximate.",
  formTitle: "Custom tile quote",
  formBody: "Tell us the look you love. We'll call to discuss your project, then your consultant will bring real samples when they take measurements.",
} as const;

export const ideas = {
  eyebrow: "Finishing touches",
  title: "Ideas for the rest of the room",
  body: "Save what you love and bring it when your consultant takes measurements. They'll show you how to pull it together in your space.",
  note: "Ideas to spark your style. Bring your favorites when your consultant takes measurements, and they'll match the right materials to your space and budget.",
  items: [
    {
      name: "Wallism",
      topic: "Accent walls & wallpaper",
      body: "Mural wallpaper for a feature wall behind a tub or vanity.",
      href: "https://wallism.com/us",
      images: [
        { src: "/images/ai/ideas/wallism-01-forest-landscape.webp", alt: "Freestanding white tub in front of a forest-green vintage landscape mural." },
        { src: "/images/ai/ideas/wallism-02-soft-abstract.webp", alt: "Light-oak vanity against a soft beige flowing abstract wallpaper." },
        { src: "/images/ai/ideas/wallism-03-linen-blossoms.webp", alt: "Freestanding tub in front of a cream linen wallpaper with delicate white blossoms." },
        { src: "/images/ai/ideas/wallism-04-sage-ginkgo.webp", alt: "Powder room with a stone basin and sage ginkgo-leaf wallpaper." },
      ],
    },
    {
      name: "Pella",
      topic: "Windows & doors",
      body: "A bigger, better window can change how a bathroom feels.",
      href: "https://www.pella.com/",
      images: [
        { src: "/images/ai/ideas/pella-01-black-grid-window.webp", alt: "White-oak double vanity beside a tall black-framed window looking onto a live oak." },
        { src: "/images/ai/ideas/pella-02-tub-garden-window.webp", alt: "Freestanding tub in front of a floor-to-ceiling black-framed window onto a garden." },
        { src: "/images/ai/ideas/pella-03-shower-casement.webp", alt: "Walk-in shower next to a black-framed casement window with a transom." },
        { src: "/images/ai/ideas/pella-04-powder-corner-windows.webp", alt: "Powder room with black-framed casement windows meeting in a sunlit corner." },
      ],
    },
    {
      name: "Flooret",
      topic: "Flooring",
      body: "Wood-look and waterproof plank options for floors next to the bath.",
      href: "https://www.flooret.com/",
      images: [
        { src: "/images/ai/ideas/flooret-01-plank-into-bedroom.webp", alt: "Warm oak-look plank floor running from a bathroom into a bedroom." },
        { src: "/images/ai/ideas/flooret-02-pale-oak-herringbone.webp", alt: "Pale oak-look herringbone floor under a freestanding tub." },
        { src: "/images/ai/ideas/flooret-03-walnut-vanity-planks.webp", alt: "Walnut-tone wood-look planks under a walnut vanity beside a glass shower." },
        { src: "/images/ai/ideas/flooret-04-white-oak-tub.webp", alt: "Soft white-oak plank floor in a sunlit bathroom with a freestanding tub." },
      ],
    },
    {
      name: "TileBar",
      topic: "Tile",
      body: "Large selection of wall and floor tile looks to save and share.",
      href: "https://www.tilebar.com/",
      images: [
        { src: "/images/ai/ideas/tilebar-01-encaustic-floor.webp", alt: "Patterned sage and terracotta cement-look floor tile under a freestanding tub." },
        { src: "/images/ai/ideas/tilebar-02-bookmatched-marble.webp", alt: "Bookmatched cream marble-look shower walls with brass fixtures." },
        { src: "/images/hero/hero-34-1600.webp", alt: "White tile walls and a freestanding tub on a blue, rust and cream patterned floor." },
        { src: "/images/ai/ideas/tilebar-04-fluted-accent.webp", alt: "Fluted cream tile accent wall behind a floating oak vanity." },
      ],
    },
    {
      name: "Riad Tile",
      topic: "Handmade tile",
      body: "Zellige and handmade tile looks for walls that glow.",
      href: "https://riadtile.com/",
      images: [
        { src: "/images/ai/ideas/riad-01-emerald-zellige.webp", alt: "Emerald handmade zellige walk-in shower with brass fixtures and a stone bench." },
        { src: "/images/ai/ideas/riad-02-cream-zellige-niche.webp", alt: "Cream handmade zellige shower with an arched niche and brass fixtures." },
        { src: "/images/ai/ideas/riad-03-terracotta-zellige.webp", alt: "Terracotta handmade zellige shower wall in warm afternoon light." },
        { src: "/images/ai/ideas/riad-04-sage-zellige-drench.webp", alt: "Sage handmade zellige shower wrapping to a backsplash beside an oak vanity." },
      ],
    },
  ],
} as const;

/** Approved price wording (Shaun, 11/12/2026). Used in chat and on the path pages. */
export const priceRange =
  "Starting at $7K, with most projects $7,000 to $30,000+, depending on size, materials and layout. Tell us about your project and the best day and time to reach you. We'll call to discuss your project, your style and what you have in mind, then set a time to take measurements. When your consultant measures, they'll go over design options with you, and you'll get your exact price right then. When you're ready to move forward, we manage your project from design to the finished bathroom.";
