/** Customer-facing copy. No invented prices or coverage terms. */

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
  consult: "Free Consult",
} as const;

export const hero = {
  eyebrow: "Lafayette, Louisiana",
  title: "Bring a little beautiful to every day.",
  support:
    "There are many options for your shower, tub, and bathroom. Many types of solid surface can be installed, and Onyx is a preferred material — we'll walk through the options for your space.",
  primary: "Free Consult",
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
  "Handmade tile. Zero boring.",
] as const;

export const heroHeadlineReduced = "Your bathroom shouldn't be boring.";

export const heroSubhead =
  "Custom showers, tile and quartz from people who sweat the details. Serving Acadiana and South Louisiana, from Lake Charles to Baton Rouge.";

export const heroDesignCta = "Design My Bathroom";

export const heroQuoteLine = "Bathroom remodels from $5,000. Free in-home quote.";

export const editorial = {
  eyebrow: "The room, considered",
  title: "Less stepping over. More stepping into.",
  body: "A shower, a tub, a lavatory, the floor underfoot. Acadiana Bathrooms and Countertops plans the work with you, and Justin reviews the scope.",
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
    body: "Low-grout options and finishes picked for Louisiana humidity.",
  },
] as const;

export const material = {
  title: "Tile or solid surface? We'll help you pick.",
  body: "Solid surface gives you clean lines and almost no grout. Custom tile gives you color, texture and pattern. Many types of solid surface can be installed, and Justin will help you weigh the look, the budget and the upkeep.",
  close:
    "Find the look that feels like home. Talk through the details with Justin before deciding what goes into your bathroom.",
} as const;

export const care = {
  title: "Less fuss on cleaning day.",
  body: "A simple weekly cleaning is enough.",
} as const;

export const stepsTitle = "Three easy steps to a bathroom you love.";

export const steps = [
  {
    title: "Snap your shower.",
    body: "Upload a photo and pick a look, or tell us what you want to change.",
  },
  {
    title: "Meet Justin at home.",
    body: "A free consult to measure, talk finishes and see what fits.",
  },
  {
    title: "Get your real number.",
    body: "A clear proposal with the exact price before any work starts.",
  },
] as const;

export const area = {
  title: "Where we work",
  intro:
    "Serving Acadiana and South Louisiana, from Lake Charles to Baton Rouge, including Prairieville and Gonzales, and from Alexandria down to Houma and Thibodaux.",
  townsLabel: "Towns people often ask about",
  outside: "Don't see your town? Ask anyway. If we can get there, we'll come to you.",
  faq: "Serving Acadiana and South Louisiana, from Lake Charles to Baton Rouge, including Prairieville and Gonzales, and from Alexandria down to Houma and Thibodaux. Don't see your town? Ask anyway. If we can get there, we'll come to you.",
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
  title: "Rather talk it through?",
  body: "Send a photo and a quick note, and Justin will reach out. Or email acadianabathandcounter@gmail.com.",
} as const;

export const close = {
  title: "Start with the bathroom you have.",
  body: "Tell us what you want to change and, if you want, share a few photos. The request is saved for follow-up. It is not a final quote.",
} as const;

export const lead = {
  title: "Free Consult",
  subhead:
    "Four quick steps. Tell us where you are, what you want to change, and how to reach you. Justin follows up — this is not a final quote.",
  submit: "Request My Free Consult",
  thanks: "Thanks — Justin has this consult and will follow up.",
  savedNote: "No payment was collected. Final pricing follows what he sees on site.",
  savedTitle: "Request saved",
  photosTitle: "Their photos",
  addressLabel: "Street address",
  addressHint: "So we can find the house for the visit. Start typing and pick your address.",
  extrasTitle: "Want to help Justin prepare?",
  extrasBody:
    "Optional: pick a good time to call, add rough measurements, and share up to 8 photos. Rough numbers are fine. Justin measures everything in person.",
  extrasSubmit: "Save extras for Justin",
  extrasSaved: "Extras saved. Justin will see them with your request.",
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
  { id: "financing", label: "Interested in financing" },
  { id: "not-sure", label: "Not sure yet" },
] as const;

export const paymentNote =
  "Pick whatever fits today. Financing can be discussed on the consult — nothing here screens credit.";

export const consentLabel =
  "I agree that Acadiana Bathrooms and Countertops may contact me about this project request by phone, text, or email.";

export const callTimeNote =
  "Pick a good time to call. This is a preference, not a booked appointment."

export const finishes = [
  { id: "unsure", label: "Not sure yet" },
  { id: "lighter", label: "Lighter finishes" },
  { id: "warmer", label: "Warmer finishes" },
  { id: "deeper", label: "Deeper finishes" },
  { id: "with-justin", label: "I’ll decide with Justin" },
] as const;

export const timings = [
  { id: "exploring", label: "Just exploring" },
  { id: "ready", label: "Ready to review options" },
  { id: "later", label: "Planning for later" },
] as const;

export const projectNote =
  "Pick everything you'd like. Justin will go over what fits at your visit.";

export const featureNote =
  "Pick everything you'd like. Justin will go over what fits at your visit.";

export const photoNote =
  "Optional photos: one wide bathroom view, the shower or tub, and any problem areas. Leave out people and personal documents. Up to 8 photos. They are resized in your browser before sending.";

export const dimensionNote =
  "Rough numbers are fine. Justin measures everything in person.";

/** Two clear paths. No prices on either path until Justin sends his pricing. */

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
    "Seamless walls, soft arches, and almost no grout to scrub. Many types of solid surface can be installed, in lots of colors and finishes.",
  cta: "Get a solid surface quote",
  whyTitle: "Why most customers start here",
  why: [
    { title: "Less grout", body: "Large panels mean far fewer grout lines than a tiled wall." },
    { title: "Many options", body: "Many types of solid surface can be installed. Onyx is a preferred material, and there are many others." },
    { title: "Easy care", body: "A simple weekly cleaning is enough." },
  ],
  servicesTitle: "What this path covers",
  services: [
    { title: "Tub-to-shower conversions", body: "Swap a tub you step over for a walk-in shower." },
    { title: "Shower walls", body: "New walls for an existing shower, with niches and a seat if the space allows." },
    { title: "Tub walls and surrounds", body: "Keep the tub and refresh the walls around it." },
  ],
  warranty: "Lifetime Guarantee. Ask Justin for the details at your free consult.",
  care: "A simple weekly cleaning is enough.",
  formTitle: "Solid surface quote",
  formBody: "A few quick questions. Justin will reach out to set up your free consult.",
} as const;

export const tilePath = {
  slug: "/custom-tile",
  eyebrow: "Path two · Custom tile",
  cardTitle: "Custom tile showers & bathrooms",
  cardBody: "Handmade zellige, patterned floors, bold grout. A designer bathroom planned around the look you love.",
  title: "Tile with a point of view.",
  support:
    "Zellige walls, patterned cement-look floors, arched niches and grout colors that make the tile sing. Bring your inspiration and we'll plan it together.",
  cta: "Request a free tile consult",
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
  groutNote: "Screen colors are approximate. Justin brings real samples to compare in your light.",
  formTitle: "Custom tile consult",
  formBody: "Tell us the look you love. Justin will reach out and bring samples to your free consult.",
} as const;

export const ideas = {
  eyebrow: "Finishing touches",
  title: "Ideas for the rest of the room",
  body: "Save what you love, then bring it to your consult. Justin will tell you what fits your space.",
  note: "Ideas to spark your style. Justin works with some of these brands and will tell you what fits your project.",
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
        { src: "/images/ai/ideas/tilebar-03-muted-checkerboard.webp", alt: "Muted sage and cream checkerboard floor in a bathroom with a tub and oak vanity." },
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

/** Approved by Shaun 11/10/2026. Used in chat and on the path pages. */
export const priceRange =
  "Complete bathroom remodels typically run $5,000 to $30,000+, depending on size, materials and layout. Your free consult gets you an exact number.";
