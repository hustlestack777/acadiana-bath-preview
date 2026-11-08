/** Customer-facing copy. Prices stay the placeholder token. */

export const brand = {
  name: "[BUSINESS NAME]",
  phone: "[PHONE]",
  email: "[EMAIL]",
  priceRange: "[PRICE RANGE]",
} as const;

export const hero = {
  eyebrow: "Onyx Collection showers",
  title: "A shower you’ll love looking at—and won’t dread cleaning.",
  support:
    "Custom-fit Onyx Collection showers for the bathroom you actually want. Tell us what you want to change, share a few photos, and let’s explore the options for your space.",
  primary: "Explore My Shower Options",
  secondary: "Talk About My Project",
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
  body: "The Onyx Collection publishes a manufacturer product warranty. Its published statement says that if its product fails, it will provide a new item or refund the cost. Ask us to review the manufacturer’s current terms with you. Installation workmanship and any labor coverage are separate and must be confirmed with Justin.",
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

export const gallery = {
  title: "Room for the real photographs",
  body: "These frames are empty on purpose. They are not completed projects, not manufacturer photos, and not pictures of people. Genuine project photos belong here only with permission. A manufacturer image would be labeled as an example, not as finished work.",
  frames: [
    "Wide view",
    "Shower wall",
    "Tub edge",
    "Niche",
    "Corner",
    "Finish direction",
  ],
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
  body: "Call or email when you would rather talk than fill out the review. This prototype does not place a call or send a message for you.",
} as const;

export const close = {
  title: "Start with the bathroom you have.",
  body: "Tell us what you want to change and, if you want, share a few photos. Justin can help narrow the options after a real review is connected.",
} as const;

export const lead = {
  title: "What could your bathroom upgrade cost?",
  subhead:
    "Show us your space and tell us what you have in mind. Start with the details below so Justin can help narrow down the options.",
  submit: "Request My Project Review",
  thanks:
    "Thanks—your project details are ready for review. Justin will follow up to discuss options and the next step. This is not a final quote or a confirmed appointment.",
  prototype:
    "Prototype: nothing you entered was submitted or saved, and Justin was not contacted. Follow-up happens only after a real lead endpoint is connected.",
  rangeLabel: "Estimated project range",
  rangeNote:
    "This is a placeholder, not a dollar amount, and not a calculated range. A tested range engine is not connected.",
  rangeDisclaimer:
    "Based on the options and approximate dimensions you selected. This is a planning estimate, not a binding quote. Final pricing follows scope and measurement confirmation; hidden damage, plumbing changes and other work outside the stated scope may change the proposal. Inclusions and exclusions have not been supplied, so none are listed here. Justin confirms them before any work.",
} as const;

export const projects = [
  {
    id: "half-bath",
    label: "Half bath",
    detail: "A smaller room you want changed.",
  },
  {
    id: "full-bath",
    label: "Full bath",
    detail: "A full bathroom.",
  },
  {
    id: "primary-bath",
    label: "Primary bath",
    detail: "The main bathroom.",
  },
  {
    id: "shower-only",
    label: "Shower only",
    detail: "Only the shower.",
  },
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
  "These four project types are the choices on this prototype. Justin confirms which services he installs before any work is scheduled.";

export const featureNote =
  "Describe the layout, finishes, and features you want to talk about. Listing something here does not mean it is available. Justin confirms the options.";

export const photoNote =
  "Optional photos: one wide bathroom view, the shower or tub, and visible problem areas. Do not include people, financial documents, or unrelated personal information. Photos help; they are not required to ask a question. Previews stay in this browser and are not uploaded.";

export const dimensionNote =
  "Approximate existing shower or tub width and depth, in inches. Choose Not sure if you don’t have a number. A state estimate is fine for this first review.";
