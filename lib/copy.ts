/** Customer-facing copy. No invented prices or coverage terms. */

export const brand = {
  name: "Acadiana Bathrooms and Countertops",
  phone: "337-522-0023",
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
    "There are many options for your shower, tub, and bathroom. Most customers prefer solid surface, because there's less grout to clean, and many types of solid surface can be installed. Onyx is a preferred material — we'll walk through the options for your space.",
  primary: "Free Consult",
  secondary: "337-522-0023",
} as const;

export const editorial = {
  eyebrow: "The room, considered",
  title: "Less stepping over. More stepping into.",
  body: "A shower, a tub, a lavatory, the floor underfoot. Acadiana Bathrooms and Countertops plans the work with you, and Justin reviews the scope.",
} as const;

export const reasons = [
  {
    title: "Custom fit",
    body: "Custom-fit showers and bathroom work for the space you actually want.",
  },
  {
    title: "Many options",
    body: "Most customers prefer solid surface, because there's less grout to clean. Many types of solid surface can be installed.",
  },
  {
    title: "Easy cleaning",
    body: "A simple weekly cleaning is enough.",
  },
] as const;

export const material = {
  title: "The surface that fits your room.",
  body: "Most customers prefer solid surface for a cleaner look with less grout. Many types of solid surface can be installed, and we'll help you choose the right one for your bathroom.",
  close:
    "Find the look that feels like home. Talk through the details with Justin before deciding what goes into your bathroom.",
} as const;

export const care = {
  title: "Less fuss on cleaning day.",
  body: "A simple weekly cleaning is enough.",
} as const;

export const steps = [
  {
    title: "Show us your space.",
    body: "Share photos and tell us what you want to change.",
  },
  {
    title: "Explore your options.",
    body: "Discuss the layout, finishes and features that matter to you.",
  },
  {
    title: "Get a clear proposal.",
    body: "Justin confirms measurements and project scope, then you get a clear proposal.",
  },
] as const;

export const area = {
  title: "Where we work",
  intro:
    "Based in Lafayette, serving Acadiana and South Louisiana, from Lake Charles to Baton Rouge and Alexandria to Houma.",
  townsLabel: "Towns people often ask about",
  outside: "Don't see your town? Ask anyway. Justin confirms every visit.",
  faq: "Based in Lafayette, serving Acadiana and South Louisiana, from Lake Charles to Baton Rouge and Alexandria to Houma. Don't see your town? Ask anyway. Justin confirms every visit.",
} as const;

export const beforeAfter = {
  title: "Before and after",
} as const;

export const gallery = {
  eyebrow: "Gallery",
  title: "Looks we can build for you",
} as const;

export const faqs = [
  {
    q: "What materials do you use?",
    a: "There are many options available. Most customers prefer solid surface, because there's less grout to clean, and many types of solid surface can be installed. Onyx is a preferred material. We'll talk through the options that fit your room.",
  },
  {
    q: "Can photos give me an exact quote?",
    a: "Photos help start the conversation. Final pricing depends on measurements, selected materials, installation scope and conditions that may not be visible in a photo. Justin confirms the proposal before work begins.",
  },
  {
    q: "What does a remodel cost?",
    a: "Your layout, selections and scope determine the price. Share your project details so we can help you understand your options.",
  },
  {
    q: "What areas do you cover?",
    a: area.faq,
  },
] as const;

export const talk = {
  title: "Talk about your project",
  body: "Call or email when you would rather talk than fill out the review.",
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
  "Choose every option that applies. Tub-to-shower is listed first because most homeowners start there. Listing a wish does not mean every option is available until the visit.";

export const featureNote =
  "Describe the layout, finishes, and features you want to talk about. Listing something here does not mean it is available. Justin confirms the options.";

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
  cardBody: "The affordable, faster route. Tub-to-shower conversions and tub or shower walls with less grout to scrub.",
  title: "Clean lines. Less grout. Less to scrub.",
  support:
    "Most customers prefer solid surface for less grout. Many types of solid surface can be installed, with many colors and finishes to choose from.",
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
  warranty: "Lifetime material warranty on solid surface. If the material has a defect or fails, we'll handle the replacement.",
  care: "A simple weekly cleaning is enough.",
  formTitle: "Solid surface quote",
  formBody: "One short form. Justin follows up to talk through your space. This is not a final quote.",
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
  formBody: "One short form. Tell us the look you want and Justin follows up. Every tile project is quoted after a visit.",
} as const;

export const ideas = {
  eyebrow: "Finishing touches",
  title: "Ideas for the rest of the room",
  body: "Browse these brands for inspiration, then bring what you like to your consult. Justin will tell you what fits your project.",
  note: "Ideas only. Acadiana Bathrooms and Countertops is not a dealer for or partner of these brands.",
  items: [
    { name: "Wallism", topic: "Accent walls & wallpaper", body: "Mural wallpaper for a feature wall behind a tub or vanity.", href: "https://wallism.com/us", image: "/images/ai/finish-wallpaper-tub.webp", alt: "Freestanding white tub in front of a magnolia mural accent wall." },
    { name: "Pella", topic: "Windows & doors", body: "A bigger, better window can change how a bathroom feels.", href: "https://www.pella.com/", image: "/images/ai/finish-window-floor.webp", alt: "Bathroom with a large black-framed window over a double vanity and a wood-look floor." },
    { name: "Flooret", topic: "Flooring", body: "Wood-look and waterproof plank options for floors next to the bath.", href: "https://www.flooret.com/", image: "/images/ai/finish-floor.webp", alt: "Warm oak-look plank floor running from a bathroom into a bedroom." },
    { name: "TileBar", topic: "Tile", body: "Large selection of wall and floor tile looks to save and share.", href: "https://www.tilebar.com/", image: "/images/ai/tile-02.webp", alt: "Patterned encaustic-look floor tile under a freestanding tub." },
    { name: "Riad Tile", topic: "Handmade tile", body: "Zellige and handmade tile looks for walls that glow.", href: "https://riadtile.com/", image: "/images/ai/tile-01.webp", alt: "Deep-green handmade zellige walk-in shower with brass fixtures." },
  ],
} as const;

/** Approved by Shaun 11/10/2026. The only price wording on the site. Do not add others. */
export const priceRange =
  "Complete bathroom remodels typically run $5,000 to $30,000+, depending on size, materials and layout. Your free consult gets you an exact number.";
