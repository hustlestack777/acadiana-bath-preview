/**
 * Town / service-area pages. Schema is areaServed only — no storefront address.
 * Justin has no public storefront yet (a Broussard warehouse is pending).
 */

export type TownFaq = { q: string; a: string };

export type TownSection = { title: string; body: string };

export type TownPageContent = {
  slug: string;
  name: string;
  title: string;
  description: string;
  intro: readonly string[];
  servicesTitle: string;
  services: readonly string[];
  sections: readonly TownSection[];
  close: string;
  faqs: readonly TownFaq[];
  /** Extra cities this page also covers, for areaServed only. */
  alsoServes?: readonly string[];
};

export function townPath(slug: string): string {
  return `/serving-${slug}`;
}

export const towns: TownPageContent[] = [
  {
    slug: "lake-charles",
    name: "Lake Charles",
    title: "Bathroom Remodels Serving Lake Charles",
    description: "Bathroom Remodels Serving Lake Charles | Acadiana Bathrooms",
    intro: [
      "We serve Lake Charles with custom walk-in showers, tile, quartz and quartzite countertops, and solid surface. Acadiana Bathrooms and Countertops works across Acadiana and South Louisiana, from Lake Charles to Baton Rouge, including Prairieville and Gonzales, and from Alexandria down to Houma and Thibodaux. Bathroom remodels starting at $5K, with most projects $5K–$30K+. The exact number is set at a free consult, when Justin comes to your home to measure.",
      "Lake Charles homes work hard in the heat and humidity. A bathroom that still has a stepped-in tub, tired grout, or a vanity that cannot take the steam is a room people stop enjoying. A curbless walk-in, handmade tile with a little glaze in the light, or a quiet solid-surface surround can change that without turning the house into a showroom.",
      "Justin comes to you. He serves Lake Charles and Southwest Louisiana as part of our full service area, and your consult happens right at your house, where he can see the room and measure. Have a place in Sulphur or elsewhere on the west end too? Cover both on the same call.",
    ],
    servicesTitle: "What we build for Lake Charles homes",
    services: [
      "Custom walk-in showers, including curbless entries when the space allows",
      "Tile work, including handmade zellige and color-drenched walls",
      "Quartz and quartzite vanities",
      "Seamless solid-surface walls and surrounds",
      "Niches, arches, and the finishing details that make a shower feel like a room",
    ],
    sections: [
      {
        title: "What a project usually looks like",
        body: "Start with Design My Bathroom or the quote form, or send a photo. Justin calls you back to talk through the room and set a time to measure. He gives the exact price at that visit. Jobs start at $5K, with most projects $5K–$30K+, because a smaller refresh and a fully custom stone-and-tile bath are not the same job.",
      },
      {
        title: "A note on style",
        body: "Warm, earthy rooms are what people are asking for: sage and olive, terracotta, soft pink tile, brushed brass or matte-black fixtures, and vanities that look like furniture. Checkerboard floors can carry a room if the walls stay calmer. If you want the bathroom your guests notice, we can go bold. If you want quiet, we can do that too.",
      },
    ],
    close: "Ready to talk about a Lake Charles bathroom? Use Design My Bathroom or the quote form, and Justin will call you to set up a measure.",
    faqs: [
      { q: "Do you serve Lake Charles?", a: "Yes. We serve Lake Charles as part of our Acadiana and South Louisiana area. The consult is in your home." },
      { q: "How much does a remodel cost?", a: "Starting at $5K, with most projects $5K–$30K+. The exact number is given at the free consult." },
      { q: "Is there a Lake Charles office?", a: "We come to you. Justin meets you at your home in Lake Charles for the consult." },
    ],
    alsoServes: ["Sulphur"],
  },
  {
    slug: "baton-rouge",
    name: "Baton Rouge",
    title: "Bathroom Remodels Serving Baton Rouge",
    description: "Bathroom Remodels Serving Baton Rouge | Acadiana Bathrooms",
    intro: [
      "We serve Baton Rouge with custom showers, tile, quartz and quartzite, and solid surface. We work across Acadiana and South Louisiana, from Lake Charles to Baton Rouge, including Prairieville and Gonzales, and from Alexandria down to Houma and Thibodaux. Bathroom remodels starting at $5K. The exact price is set at a free consult, and Justin follows up with your price.",
      "People in the capital region often want a bathroom that feels designed, not just replaced: a walk-in instead of a tub surround, a quartzite vanity with real veining, or a handmade tile wall with color. We also serve nearby Prairieville and Gonzales as part of the same area, so one conversation can cover a house in any of those communities.",
      "Justin comes to you. He travels to your home to look at the room, talk through the design, and measure.",
    ],
    servicesTitle: "What we build",
    services: [
      "Custom and curbless walk-in showers",
      "Handmade tile and zellige, including richer color on the walls",
      "Quartz and quartzite countertops and bathroom surfaces",
      "Solid-surface surrounds for a seamless, low-grout look",
      "Niches, arched openings, and brass or matte-black finishes",
    ],
    sections: [
      {
        title: "Cost, plainly",
        body: "There is no single Baton Rouge price, because the room and the materials decide it. Jobs start at $5K, with most projects $5K–$30K+. A tighter refresh and a full custom shower with stone and handmade tile are priced differently, so Justin gives you the exact figure after he has seen the space.",
      },
      {
        title: "If you are in Prairieville or Gonzales",
        body: "You're in our service area. Start with Design My Bathroom or the quote form, and Justin will come to you.",
      },
    ],
    close: "Upload a photo of your shower or use Design My Bathroom, and Justin will call to set up a time to measure.",
    faqs: [
      { q: "Do you serve Baton Rouge?", a: "Yes, along with Prairieville, Gonzales, and the rest of our South Louisiana area." },
      { q: "Do you have a Baton Rouge shop?", a: "We come to you. Your consult happens right at your home." },
      { q: "How do I get a price?", a: "Free consult and measure. Starting at $5K, with most projects $5K–$30K+. The exact number is given at that visit." },
    ],
    alsoServes: ["Prairieville", "Gonzales"],
  },
  {
    slug: "houma",
    name: "Houma",
    title: "Bathroom Remodels Serving Houma",
    description: "Bathroom Remodels Serving Houma | Acadiana Bathrooms",
    intro: [
      "We serve Houma with custom walk-in showers, tile, quartz and quartzite countertops, and solid surface. Acadiana Bathrooms and Countertops works across Acadiana and South Louisiana, from Lake Charles to Baton Rouge, including Prairieville and Gonzales, and from Alexandria down to Houma and Thibodaux. Bathroom remodels starting at $5K, with most projects $5K–$30K+. Justin gives the exact number at a free consult in your home.",
      "Houma bathrooms have to handle humidity and real daily use. A curbless walk-in designed for proper drainage, tile that still looks good when the light hits it, or a solid-surface surround that wipes clean will do more for the house than a trendy look that cannot take the climate. We can still make it stylish: warm color, handmade glaze, a stone vanity, or a simple, calm room.",
      "We also serve Thibodaux as part of the same area. Justin comes to you: the measure and the quote happen right at your house.",
    ],
    servicesTitle: "What we build for Houma and nearby homes",
    services: [
      "Custom walk-in and curbless showers",
      "Tile, including handmade zellige",
      "Quartz and quartzite vanities",
      "Solid-surface walls and surrounds",
      "Niches, edges, and finishing details",
    ],
    sections: [
      {
        title: "How a quote works",
        body: "Start with Design My Bathroom or the quote form. Justin uses your photos to prep, then comes out to measure and gives you the exact price. Bathroom remodels starting at $5K.",
      },
    ],
    close: "If you are deciding between tile and solid surface, or between quartz and quartzite, bring that question to the consult. The right answer is the one that fits your house and how you use the room.",
    faqs: [
      { q: "Do you serve Houma and Thibodaux?", a: "Yes. Both are in our South Louisiana service area." },
      { q: "Is there a Houma address?", a: "We come to you. Justin meets you at your home for the measure and the quote." },
      { q: "How much will it cost?", a: "Starting at $5K, with most projects $5K–$30K+, with the exact number at the free consult." },
    ],
    alsoServes: ["Thibodaux"],
  },
];

export function getTown(slug: string): TownPageContent | undefined {
  return towns.find((town) => town.slug === slug);
}
