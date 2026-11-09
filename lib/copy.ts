/** Customer-facing copy. No invented prices or coverage terms. */

export const brand = {
  name: "Acadiana Bathrooms and Countertops",
  phone: "337-522-0023",
  phoneHref: "tel:+13375220023",
  website: "abclafayette.com",
  websiteHref: "https://abclafayette.com",
  onyx: "Onyx Collection",
  onyxHref: "https://onyxcollection.com",
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
  lifetime: "Lifetime Guarantee",
} as const;

export const hero = {
  eyebrow: "Lafayette",
  title: "Bring a little beautiful to every day.",
  line: "Less stepping over. More stepping into.",
  pull: "A shower you’ll love looking at—and won’t dread cleaning.",
  support:
    "Custom-fit Onyx Collection showers for the bathroom you actually want. Tell us what you want to change, share a few photos, and let’s explore the options for your space.",
  primary: cardClaims.consult,
  secondary: brand.phone,
} as const;

export const reasons = [
  {
    title: "Custom fit",
    body: "Custom-fit Onyx Collection showers for the bathroom you actually want.",
  },
  {
    title: "The look",
    body: "A cast bathroom material with a range of colors. The Onyx Collection combines mineral-derived alumina trihydrate with a specially formulated resin.",
  },
  {
    title: "Easy cleaning",
    body: "Onyx says a simple weekly cleaning is often enough. Follow the manufacturer’s care instructions and use non-abrasive cleaners.",
  },
] as const;

export const material = {
  title: "Meet your next shower surface.",
  body: "The Onyx Collection combines mineral-derived alumina trihydrate with a specially formulated resin. The result is a cast bathroom material with a range of colors and a finish designed for regular care with non-abrasive cleaners.",
  close:
    "Find the look that feels like home. Choose your finish and talk through the details with Justin before deciding what goes into your bathroom.",
} as const;

export const care = {
  title: "Less fuss on cleaning day.",
  body: "Onyx says a simple weekly cleaning is often enough to keep its showers looking new. Follow the manufacturer’s care instructions and use non-abrasive cleaners to protect the finish.",
} as const;

export const warranty = {
  title: "A manufacturer that stands behind its products.",
  body: "Acadiana Bathrooms and Countertops states Lifetime Guarantee. That phrase is not expanded with extra terms here. The Onyx Collection publishes a manufacturer product warranty. Its published statement says that if its product fails, it will provide a new item or refund the cost. Ask us to review the manufacturer’s current terms with you. Installation workmanship and any labor coverage are separate and must be confirmed before work begins.",
  asideTitle: "Separate from installation",
  aside:
    "The manufacturer product warranty covers the product. It is not a labor promise. Workmanship and any labor coverage must be confirmed with Justin. This site does not add installer labor coverage.",
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
    body: "Justin confirms measurements and project scope before you approve the work.",
  },
] as const;

export const area = {
  title: "Where a project can be planned",
  intro:
    "Planned coverage for Justin to confirm. These are towns, not office locations.",
  corridorLabel: "I-10 corridor, west to east",
  stop: "The corridor stops at Baton Rouge. It does not continue toward Prairieville or Gonzales.",
  alsoLabel: "Also on the planned list",
  faq: "Planned coverage for Justin to confirm: Lake Charles, Jennings, Crowley, Lafayette, Broussard, Youngsville, New Iberia, Opelousas, Alexandria, Franklin, Morgan City, Thibodaux, Houma and Baton Rouge. Prairieville and Gonzales are not included. This is not an office in each town.",
} as const;

export const finishesLook = {
  title: "Wall panel finishes",
  body: "The Onyx Collection publishes wall panels in gloss, subway tile, stone tile, wavy tile, shiplap, and artisan tile. These photographs show those finishes. Justin confirms which options fit your room.",
} as const;

export const gallery = {
  title: "Examples from the Onyx Collection",
  body: "These photographs are published by the Onyx Collection. They are product and installation examples, not completed jobs by Acadiana Bathrooms and Countertops. Colors are not named here, because the manufacturer says photography and lighting make color lists inaccurate. Some shower gallery pictures show Onyx wall panels and/or ceramic tile walls.",
} as const;

export const beforeAfter = {
  title: "Before and after, as Onyx published it",
  body: "These pairs are before-and-after photographs published by the Onyx Collection, already labeled Before and After. They are examples, not completed jobs by Acadiana Bathrooms and Countertops.",
} as const;

export const faqs = [
  {
    q: "Is Onyx natural stone?",
    a: "No. The Onyx Collection describes its product as 63% alumina trihydrate, a mineral-derived ingredient, and 37% specially formulated polyester resin. It is not a slab of quarried natural onyx.",
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
  {
    q: "What does the manufacturer product warranty cover?",
    a: warranty.body,
  },
] as const;

export const talk = {
  title: "Talk about your project",
  body: "Call when you would rather talk than fill out the review. There is no email address on the card, so this site does not list one.",
} as const;

export const close = {
  title: "Start with the bathroom you have.",
  body: "Tell us what you want to change and, if you want, share a few photos. The request is saved for follow-up. It is not a final quote.",
} as const;

export const lead = {
  title: "What could your bathroom upgrade cost?",
  subhead:
    "Show us your space and tell us what you have in mind. Start with the details below so Justin can help narrow down the options.",
  submit: "Request My Project Review",
  thanks:
    "Thanks—your project details are saved. Acadiana Bathrooms and Countertops will follow up to discuss options and the next step. This is not a final quote or a confirmed appointment.",
  savedTitle: "We saved your project review.",
} as const;

export const projects = [
  { id: "showers", label: "Showers", detail: "Including Onyx Collection solid-surface showers." },
  { id: "tubs", label: "Tubs", detail: "Tub work in the bathroom." },
  { id: "lavatories", label: "Lavatories", detail: "Sinks and the surrounding area." },
  { id: "flooring", label: "Flooring", detail: "Flooring in the bathroom." },
  { id: "toilets", label: "Toilets", detail: "Toilet work in the room." },
  { id: "wallpaper", label: "Wallpaper", detail: "Wall covering in the room." },
] as const;

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
  "These are the services on the Acadiana Bathrooms and Countertops card. Choose every one that applies. Listing a wish does not mean every option is available until the visit.";

export const featureNote =
  "Describe the layout, finishes, and features you want to talk about. Listing something here does not mean it is available. Justin confirms the options.";

export const photoNote =
  "Optional photos: one wide bathroom view, the shower or tub, and visible problem areas. Do not include people, financial documents, or unrelated personal information. Photos help; they are not required. Up to four images, 1.5 MB each, are saved with the request.";

export const dimensionNote =
  "Approximate existing shower or tub width and depth, in inches. Choose Not sure if you don’t have a number. A state estimate is fine for this first review.";
