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
  lifetime: "Lifetime material warranty. If the material has a defect or fails, we'll handle the replacement.",
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

export const warranty = {
  title: "Lifetime material warranty",
  body: "Lifetime material warranty. If the material has a defect or fails, we'll handle the replacement.",
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
  body: "Examples of what your remodel could look like",
} as const;

export const gallery = {
  title: "Showers, tubs, and lavatories",
  body: "Examples of what your remodel could look like",
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
  {
    q: "What is the lifetime material warranty?",
    a: warranty.body,
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
