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
  eyebrow: "Lafayette, Louisiana",
  title: "Bring a little beautiful to every day.",
  support:
    "Onyx Collection showers, tubs, and lavatories for the bathroom you actually want. Tell us what you want to change, and let’s explore the options for your space.",
  primary: "Free Consult",
  secondary: "337-522-0023",
} as const;

export const editorial = {
  eyebrow: "The room, considered",
  title: "Less stepping over. More stepping into.",
  body: "A shower, a tub, a lavatory, the floor underfoot. Acadiana Bathrooms and Countertops plans the work with Onyx Collection solid-surface products, and Justin reviews the scope with you.",
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
    body: "Justin confirms measurements and project scope, then you get a clear proposal.",
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

export const beforeAfter = {
  title: "Before and after",
  body: "A shower refresh and a tub-to-shower conversion, shown before and after.",
} as const;

export const gallery = {
  title: "Showers, tubs, and lavatories",
  body: "Walk-in showers, tub surrounds, and vanities in finishes homeowners actually want.",
} as const;

export const patterns = {
  title: "Wall patterns",
  body: "Onyx Collection solid-surface wall patterns. Justin will confirm what can be made for your room.",
  items: [
    {
      id: "gloss",
      name: "Gloss smooth",
      note: "Onyx calls this its most popular finish: a smooth surface cared for with non-abrasive cleaners.",
    },
    {
      id: "subway",
      name: "Subway tile",
      note: "A smooth panel molded with the look of subway tile and shallow grout lines.",
    },
    {
      id: "stone",
      name: "Stone tile",
      note: "A panel molded from a stone-tile pattern, cast as a solid surface.",
    },
    {
      id: "wavy",
      name: "Wavy tile",
      note: "A vertical wave texture across the panel.",
    },
    {
      id: "shiplap",
      name: "Shiplap",
      note: "A smooth panel with recessed grooves.",
    },
    {
      id: "artisan",
      name: "Artisan tile",
      note: "A larger tile look with molded grout lines.",
    },
  ],
} as const;

export const swatches = {
  title: "Colors",
  body: "Onyx Collection colors, labeled with the names Onyx publishes. Confirm a finish with a physical sample.",
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
  { id: "showers", label: "Showers", detail: "Including Onyx Collection solid-surface showers." },
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
