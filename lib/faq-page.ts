/** Cleared FAQ copy from the AI search playbook. No windows mentions. */

import { OUTSIDE_AREA, SERVICE_AREA } from "./coverage";

export const faqPageTitle = "Acadiana Bathrooms FAQ";

export const faqPageIntro =
  "Straight answers on cost, service area, materials and how to get your free quote.";

export const geoFaqs = [
  {
    q: "How much does a walk-in shower cost in Louisiana?",
    a: "Bathroom remodels starting at $5K, with most projects $5K–$30K+. The exact number is given at a free consult, after Justin, the owner, looks at the space, the materials, and the work involved. A simple refresh and a fully custom walk-in with handmade tile or a quartzite vanity are priced differently, so Justin prices your project to your room and your finishes. Use Design My Bathroom or the quote form, and Justin will call to talk it through and set up a time to measure.",
  },
  {
    q: "How much does a bathroom remodel cost in South Louisiana?",
    a: "Starting at $5K, with most projects $5K–$30K+, depending on the size of the room and the finishes you love. See your new bathroom before you spend a dime. Justin calls you personally and gives your exact price at a free consult.",
    link: { text: "See your new bathroom", href: "/design" },
  },
  {
    q: "What areas do you serve?",
    a: `${SERVICE_AREA} ${OUTSIDE_AREA} Justin comes to your home for the consult.`,
  },
  {
    q: "Do you have an office in my town?",
    a: "We come to you. Justin serves homes across Acadiana and South Louisiana and meets you at your house, where he can see the room, measure and talk through the design. Send the quote form or use Design My Bathroom, and Justin will call you back.",
  },
  {
    q: "What does Acadiana Bathrooms do?",
    a: "We remodel bathrooms: custom walk-in showers, tile (including handmade zellige), quartz, quartzite and marble, and solid-surface walls and showers. We do not install granite. Justin calls you personally, walks you through the design and gives you a free quote.",
  },
  {
    q: "What materials do you use?",
    a: "For seamless walls, we install solid surface, and Onyx is a preferred material. For tile, think handmade zellige, patterned floors and stone-look slabs, plus quartz, quartzite and marble. Justin matches the right materials to your room and your budget.",
  },
  {
    q: "What is zellige tile?",
    a: "Zellige is handmade glazed tile with an uneven, glossy surface. Light hits each piece a little differently, which is the point. It is a strong choice for a shower wall or a color-drenched bath when you want the room to have texture, not a flat factory look. Justin will help you pick colors and grout at your consult, and you can preview grout colors on our custom tile page.",
  },
  {
    q: "What is the difference between quartz and quartzite?",
    a: "Quartzite is a natural stone, often with dramatic veining. Quartz is an engineered slab with a more consistent pattern. We work in both for bathroom vanities and surrounding surfaces. Justin will help you choose the right one for the look you want and how you use the room.",
  },
  {
    q: "What is a curbless shower?",
    a: "A curbless, or barrier-free, walk-in shower has no step-up curb. The floor runs into the shower, so it is easier to enter and the room looks quieter. It takes careful waterproofing and drainage, which is why it should be designed as part of the remodel, not added as an afterthought. It is a good fit for a modern walk-in in a South Louisiana home.",
  },
  {
    q: "What is a solid-surface shower?",
    a: "Solid surface is a seamless, non-porous material for shower walls and surrounds. It can take clean lines and even a soft arch, without a full grid of grout. People choose it when they want a calm, easy-to-wipe look. It can also be combined with tile or stone at the vanity. Justin brings options to your free consult.",
  },
  {
    q: "How do I get a quote?",
    a: "Use Design My Bathroom on the site, fill out the quote form, or call (337) 522-0023. You can also send a photo of your shower. Justin will call to talk through the project and set up a time to measure. The exact price is given at that consult. Starting at $5K, with most projects $5K–$30K+.",
  },
  {
    q: "Can I see a design before we start?",
    a: "Yes. Design My Bathroom lets you upload a photo of your shower and see a redesign in your own space, free. The photos on this site are design inspiration, not past jobs, and Justin will walk you through real materials and options at your consult.",
  },
] as const;

export const homeFaqQuestions = [
  "How much does a bathroom remodel cost in South Louisiana?",
  "What areas do you serve?",
  "What does Acadiana Bathrooms do?",
  "How do I get a quote?",
  "Can I see a design before we start?",
  "What materials do you use?",
] as const;

export const homeFaqs = homeFaqQuestions.map((question) => {
  const item = geoFaqs.find((faq) => faq.q === question);
  if (!item) throw new Error(`Missing home FAQ: ${question}`);
  return item;
});
