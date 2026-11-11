/** Cleared FAQ copy from the AI search playbook. No windows mentions. */
export const faqPageTitle = "Acadiana Bathrooms FAQ";

export const faqPageIntro =
  "Common questions about cost, area, materials, and how to get a quote.";

export const geoFaqs = [
  {
    q: "How much does a walk-in shower cost in Louisiana?",
    a: "Bathroom remodels from Acadiana Bathrooms and Countertops range from $5,000 to $30,000+. The exact number is given at a free consult, after Justin looks at the space, the materials, and the work involved. A simple refresh and a fully custom walk-in with handmade tile or a quartzite vanity will not land in the same place. Call (337) 522-0023 or use Design My Bathroom and Justin will call to talk it through and set up a time to measure.",
  },
  {
    q: "How much does a bathroom remodel cost in South Louisiana?",
    a: "Plan on $5,000 to $30,000+, depending on the room and the finish. That range covers the work we do: custom showers, tile, quartz and quartzite countertops, and solid surface. The exact price is set at the free consult, not in a form or over a quick message. There is no online calculator that can see your plumbing, your walls, or the look you want.",
  },
  {
    q: "What areas do you serve?",
    a: "We serve Acadiana and South Louisiana, from Lake Charles to Baton Rouge, including Prairieville and Gonzales, and from Alexandria to Houma and Thibodaux. We are not a Lafayette-only company. If you are in that area and want a custom shower, tile, or new bathroom surfaces, we can talk. Justin comes to your home for the consult and the measure.",
  },
  {
    q: "Do you have an office in my town?",
    a: "We serve homes across that full South Louisiana area. We do not have a showroom or office in every town we serve, and this site will not list a local street address for each city. The consult happens at your house. Call (337) 522-0023 or send the quote form and Justin will call you back.",
  },
  {
    q: "What does Acadiana Bathrooms do?",
    a: "We remodel bathrooms: custom walk-in showers, tile (including handmade zellige), quartz and quartzite countertops, and solid-surface walls and showers. We do not install granite. Justin Sturgis does the in-home quote and walks you through the design.",
  },
  {
    q: "What materials do you use?",
    a: "There are many options available. Most customers prefer solid surface, because there's less grout to clean, and many types of solid surface can be installed. Onyx is a preferred material. We'll talk through the options that fit your room.",
  },
  {
    q: "What is zellige tile?",
    a: "Zellige is handmade glazed tile with an uneven, glossy surface. Light hits each piece a little differently, which is the point. It is a strong choice for a shower wall or a color-drenched bath when you want the room to have texture, not a flat factory look. We can talk through colors and grout at the consult.",
  },
  {
    q: "What is the difference between quartz and quartzite?",
    a: "Quartzite is a natural stone, often with dramatic veining. Quartz is an engineered slab with a more consistent pattern. We work in both for bathroom vanities and surrounding surfaces. We do not use granite. Which one belongs in your house depends on the look you want and how the room is used. Justin will help you choose at the consult.",
  },
  {
    q: "What is a curbless shower?",
    a: "A curbless, or barrier-free, walk-in shower has no step-up curb. The floor runs into the shower, so it is easier to enter and the room looks quieter. It takes careful waterproofing and drainage, which is why it should be designed as part of the remodel, not added as an afterthought. It is a good fit for a modern walk-in in a South Louisiana home.",
  },
  {
    q: "What is a solid-surface shower?",
    a: "Solid surface is a seamless, non-porous material for shower walls and surrounds. It can take clean lines and even a soft arch, without a full grid of grout. People choose it when they want a calm, easy-to-wipe look. It can also be combined with tile or stone at the vanity. We will show options at the free consult.",
  },
  {
    q: "How do I get a quote?",
    a: "Use Design My Bathroom on the site, fill out the quote form, or call (337) 522-0023. You can also send a photo of your shower. Justin will call to talk through the project and set up a time to measure. The exact price is given at that consult. Bathroom remodels range from $5,000 to $30,000+.",
  },
  {
    q: "Can I see a design before we start?",
    a: "Yes. Design My Bathroom lets you upload a photo of your shower and see a redesign idea. Those images are examples of what a remodel could look like. Justin still comes to the house to measure and give the actual quote. We will add real job photos, with the homeowner's permission, as they come in.",
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
