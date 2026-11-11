/** Cleared FAQ copy. Visible set is short; the rest lives under More questions. */

import { OUTSIDE_AREA, SERVICE_AREA } from "./coverage";

export const faqPageTitle = "Acadiana Bathrooms FAQ";

export const faqPageIntro =
  "Straight answers on cost, service area, materials and how to get your free quote.";

/** General how-it-works line (no town). Town pages add the town name. */
export const FAQ_HOW_IT_WORKS =
  "Justin calls you first to discuss your project, then sets a time to come out to your home to take measurements, go over your design options and give you your exact price.";

export function faqHowItWorksInTown(town: string) {
  return `Justin calls you first to discuss your project, then sets a time to come out to your home in ${town} to take measurements, go over your design options and give you your exact price.`;
}

export const geoFaqs = [
  {
    q: "How much does a bathroom remodel cost in South Louisiana?",
    a: "Starting at $5K, with most projects $5K–$30K+, depending on the size of the room and the finishes you love. See your new bathroom before you spend a dime. Justin will call to discuss your project, then set a time to take measurements, walk you through your design options and give you your exact price right there at that visit.",
    link: { text: "See your new bathroom", href: "/design" },
  },
  {
    q: "How does a quote work?",
    a: `Tell us about your project and the best day and time to reach you. ${FAQ_HOW_IT_WORKS} When you're ready to move forward, Justin manages your project from design to the finished bathroom.`,
  },
  {
    q: "What areas do you serve?",
    a: `${SERVICE_AREA} ${OUTSIDE_AREA}`,
  },
  {
    q: "What happens when Justin calls?",
    a: "He'll call around the time you picked to discuss your project, your style and what you have in mind. Then he sets a time to come out to your home to take measurements, go over your design options and give you your exact price right there at that visit.",
  },
  {
    q: "What do you install?",
    a: "We remodel bathrooms: custom walk-in showers, tile (including handmade zellige), quartz, quartzite and marble, and solid-surface walls and showers. We do not install granite. Justin matches the right materials to your room and your budget.",
  },
  {
    q: "Do you work outside your service area?",
    a: OUTSIDE_AREA,
  },
  {
    q: "How much does a walk-in shower cost in Louisiana?",
    a: "Bathroom remodels starting at $5K, with most projects $5K–$30K+. The exact number is given when Justin takes measurements and looks at the space, the materials, and the work involved. A simple refresh and a fully custom walk-in with handmade tile or a quartzite vanity are priced differently, so Justin prices your project to your room and your finishes. Use Design My Bathroom or the quote form, tell us the best day and time to reach you, and Justin will call to discuss your project and set a time to take measurements. You get your exact price right there at that visit.",
  },
  {
    q: "Do you have an office in my town?",
    a: "There isn't a public office to visit. Send the quote form or use Design My Bathroom, and Justin will call to discuss your project, then set a time to take measurements at your home.",
  },
  {
    q: "What does Acadiana Bathrooms do?",
    a: "We remodel bathrooms: custom walk-in showers, tile (including handmade zellige), quartz, quartzite and marble, and solid-surface walls and showers. We do not install granite. Justin will call to discuss your project, then set a time to take measurements, walk you through the design, and give you your exact price right there at that visit.",
  },
  {
    q: "What materials do you use?",
    a: "For seamless walls, we install solid surface, and Onyx is a preferred material. For tile, think handmade zellige, patterned floors and stone-look slabs, plus quartz, quartzite and marble. Justin matches the right materials to your room and your budget.",
  },
  {
    q: "What is zellige tile?",
    a: "Zellige is handmade glazed tile with an uneven, glossy surface. Light hits each piece a little differently, which is the point. It is a strong choice for a shower wall or a color-drenched bath when you want the room to have texture, not a flat factory look. Justin will help you pick colors and grout when he takes measurements, and you can preview grout colors on our custom tile page.",
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
    a: "Solid surface is a seamless, non-porous material for shower walls and surrounds. It can take clean lines and even a soft arch, without a full grid of grout. People choose it when they want a calm, easy-to-wipe look. It can also be combined with tile or stone at the vanity. Justin brings options when he takes measurements.",
  },
  {
    q: "How do I get a quote?",
    a: "Use Design My Bathroom on the site, fill out the quote form, or call (337) 522-0023. You can also send a photo of your shower. Tell us the best day and time to reach you. Justin will call to discuss your project and set a time to take measurements. You get your exact price right there at that visit. Starting at $5K, with most projects $5K–$30K+.",
  },
  {
    q: "Can I see a design before we start?",
    a: "Yes. Design My Bathroom lets you upload a photo of your shower and see a redesign in your own space, free. The photos on this site are design inspiration, not past jobs, and Justin will walk you through real materials and options when he takes measurements.",
  },
] as const;

export const faqVisibleQuestions = [
  "How much does a bathroom remodel cost in South Louisiana?",
  "How does a quote work?",
  "What areas do you serve?",
  "What happens when Justin calls?",
  "What do you install?",
  "Do you work outside your service area?",
] as const;

function faqsFor(questions: readonly string[]) {
  return questions.map((question) => {
    const item = geoFaqs.find((faq) => faq.q === question);
    if (!item) throw new Error(`Missing FAQ: ${question}`);
    return item;
  });
}

export const faqVisible = faqsFor(faqVisibleQuestions);

export const faqMore = geoFaqs.filter((faq) => !faqVisibleQuestions.includes(faq.q as (typeof faqVisibleQuestions)[number]));

/** Kept for older imports; home no longer shows a FAQ block. */
export const homeFaqQuestions = faqVisibleQuestions;

export const homeFaqs = faqVisible;
