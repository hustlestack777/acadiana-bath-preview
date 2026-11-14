/** Cleared FAQ copy. Visible set is short; the rest lives under More questions. */

import { OUTSIDE_AREA, SERVICE_AREA } from "./coverage";

export const faqPageTitle = "Acadiana Bathrooms FAQ";

export const faqPageIntro =
  "Straight answers on cost, service area, materials and how to get your free quote.";

/** General how-it-works line (no town). Town pages add the town name. */
export const FAQ_HOW_IT_WORKS =
  "We'll call you first to discuss your project and set a time to take measurements. When your consultant measures, they'll go over design options with you, and you'll get your exact price right then.";

export function faqHowItWorksInTown(town: string) {
  return `We'll call you first to discuss your project and set a time to take measurements in ${town}. When your consultant measures, they'll go over design options with you, and you'll get your exact price right then.`;
}

export const geoFaqs = [
  {
    q: "How much does a bathroom remodel cost in South Louisiana?",
    a: "Starting at $5K, with most projects $5,000 to $30,000+, depending on the size of the room and the finishes you love. See your new bathroom before you spend a dime. We'll call you to discuss your project and set a time to take measurements. When your consultant measures, they'll go over design options with you, and you'll get your exact price right then.",
    link: { text: "See your new bathroom", href: "/design" },
  },
  {
    q: "How does a quote work?",
    a: `Tell us about your project and the best day and time to reach you. ${FAQ_HOW_IT_WORKS} When you're ready to move forward, we manage your project from design to the finished bathroom.`,
  },
  {
    q: "What areas do you serve?",
    a: `${SERVICE_AREA} ${OUTSIDE_AREA}`,
  },
  {
    q: "What happens when we call?",
    a: "We'll call around the time you picked to discuss your project, your style and what you have in mind, and set a time to take measurements. When your consultant measures, they'll go over design options with you, and you'll get your exact price right then.",
  },
  {
    q: "What do you install?",
    a: "We remodel bathrooms: custom walk-in showers, tile (including handmade zellige), quartz, quartzite and marble, and solid-surface walls and showers. We do not install granite. We match the right materials to your room and your budget.",
  },
  {
    q: "Do you work outside your service area?",
    a: OUTSIDE_AREA,
  },
  {
    q: "How much does a walk-in shower cost in Louisiana?",
    a: "Bathroom remodels starting at $5K, with most projects $5,000 to $30,000+. The exact number is given when your consultant takes measurements and looks at the space, the materials, and the work involved. A simple refresh and a fully custom walk-in with handmade tile or a quartzite vanity are priced differently, so we price your project to your room and your finishes. Use Design My Bathroom or the quote form, tell us the best day and time to reach you, and we'll call to discuss your project and set a time to take measurements. When your consultant measures, you'll get your exact price right then.",
  },
  {
    q: "Do you have an office in my town?",
    a: "There isn't a public office to visit. Send the quote form or use Design My Bathroom, and we'll call to discuss your project and set a time to take measurements.",
  },
  {
    q: "What does Acadiana Bathrooms do?",
    a: "We remodel bathrooms: custom walk-in showers, tile (including handmade zellige), quartz, quartzite and marble, and solid-surface walls and showers. We do not install granite. We'll call to discuss your project and set a time to take measurements. When your consultant measures, they'll go over design options with you, and you'll get your exact price right then.",
  },
  {
    q: "What materials do you use?",
    a: "For seamless walls, we install solid surface, and Onyx is a preferred material. For tile, think handmade zellige, patterned floors and stone-look slabs, plus quartz, quartzite and marble. We match the right materials to your room and your budget.",
  },
  {
    q: "What is zellige tile?",
    a: "Zellige is handmade glazed tile with an uneven, glossy surface. Light hits each piece a little differently, which is the point. It is a strong choice for a shower wall or a color-drenched bath when you want the room to have texture, not a flat factory look. Your consultant will help you pick colors and grout when they take measurements, and you can preview grout colors on our custom tile page.",
  },
  {
    q: "What is the difference between quartz and quartzite?",
    a: "Quartzite is a natural stone, often with dramatic veining. Quartz is an engineered slab with a more consistent pattern. We work in both for bathroom vanities and surrounding surfaces. We'll help you choose the right one for the look you want and how you use the room.",
  },
  {
    q: "What is a curbless shower?",
    a: "A curbless, or barrier-free, walk-in shower has no step-up curb. The floor runs into the shower, so it is easier to enter and the room looks quieter. It takes careful waterproofing and drainage, which is why it should be designed as part of the remodel, not added as an afterthought. It is a good fit for a modern walk-in in a South Louisiana home.",
  },
  {
    q: "What is a solid-surface shower?",
    a: "Solid surface is a seamless, non-porous material for shower walls and surrounds. It can take clean lines and even a soft arch, without a full grid of grout. People choose it when they want a calm, easy-to-wipe look. It can also be combined with tile or stone at the vanity. Your consultant brings options when they take measurements.",
  },
  {
    q: "How do I get a quote?",
    a: "Use Design My Bathroom on the site, fill out the quote form, or call (337) 522-0023. You can also send a photo of your shower. Tell us the best day and time to reach you. We'll call you to discuss your project and set a time to take measurements. When your consultant measures, you'll get your exact price right then. Starting at $5K, with most projects $5,000 to $30,000+.",
  },
  {
    q: "Can I see a design before we start?",
    a: "Yes. Design My Bathroom lets you upload a photo of your shower and see a redesign in your own space, free. The photos on this site are design inspiration, not past jobs, and when your consultant measures, they'll go over real materials and options with you.",
  },
] as const;

export const faqVisibleQuestions = [
  "How much does a bathroom remodel cost in South Louisiana?",
  "How does a quote work?",
  "What areas do you serve?",
  "What happens when we call?",
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
