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
      "We serve Lake Charles with custom walk-in showers, tile, quartz and quartzite countertops, and solid surface. Acadiana Bathrooms & Countertops works across Acadiana and South Louisiana, from Lake Charles to Baton Rouge, including Prairieville and Gonzales, and from Alexandria to Houma and Thibodaux. Bathroom remodels range from $5,000 to $30,000+. The exact number is set at a free consult, when Justin comes to your home to measure.",
      "Lake Charles homes work hard in the heat and humidity. A bathroom that still has a stepped-in tub, tired grout, or a vanity that cannot take the steam is a room people stop enjoying. A curbless walk-in, handmade tile with a little glaze in the light, or a quiet solid-surface surround can change that without turning the house into a showroom.",
      "We do not have a storefront in Lake Charles, and we will not list a local street address here. Justin Sturgis serves this part of Southwest Louisiana as part of the full service area, and the consult happens at your house. If you also have a place in Sulphur or elsewhere in the western end of our area, we can talk about that at the same call.",
    ],
    servicesTitle: "What we build for Lake Charles homes",
    services: [
      "Custom walk-in showers, including curbless entries when the space allows",
      "Tile work, including handmade zellige and color-drenched walls",
      "Quartz and quartzite vanities — no granite",
      "Seamless solid-surface walls and surrounds",
      "Niches, arches, and the finishing details that make a shower feel like a room",
    ],
    sections: [
      {
        title: "What a project usually looks like",
        body: "You send a photo or start with Design My Bathroom, or you call (337) 522-0023. Justin calls you back to talk through the room and set a time to measure. He gives the exact price at that visit. The range stays $5,000 to $30,000+ because a smaller refresh and a fully custom stone-and-tile bath are not the same job.",
      },
      {
        title: "A note on style",
        body: "Warm, earthy rooms are what people are asking for: sage and olive, terracotta, soft pink tile, brushed brass or matte-black fixtures, and vanities that look like furniture. Checkerboard floors can carry a room if the walls stay calmer. If you want the bathroom your guests notice, we can go bold. If you want quiet, we can do that too.",
      },
    ],
    close: "Ready to talk about a Lake Charles bathroom? Call (337) 522-0023, or use Design My Bathroom and Justin will call you to set up a measure.",
    faqs: [
      { q: "Do you serve Lake Charles?", a: "Yes. We serve Lake Charles as part of our Acadiana and South Louisiana area. The consult is in your home." },
      { q: "How much does a remodel cost?", a: "$5,000 to $30,000+. The exact number is given at the free consult." },
      { q: "Is there a Lake Charles office?", a: "No. We do not list a local office or street address in Lake Charles. Justin comes to you." },
    ],
    alsoServes: ["Sulphur"],
  },
  {
    slug: "baton-rouge",
    name: "Baton Rouge",
    title: "Bathroom Remodels Serving Baton Rouge",
    description: "Bathroom Remodels Serving Baton Rouge | Acadiana Bathrooms",
    intro: [
      "We serve Baton Rouge with custom showers, tile, quartz and quartzite, and solid surface. Acadiana Bathrooms & Countertops is not a Baton Rouge storefront and not a Lafayette-only company. We work across Acadiana and South Louisiana, from Lake Charles to Baton Rouge, including Prairieville and Gonzales, and from Alexandria to Houma and Thibodaux. Bathroom remodels range from $5,000 to $30,000+, with the exact price set at a free in-home consult.",
      "People in the capital region often want a bathroom that feels designed, not just replaced: a walk-in instead of a tub surround, a quartzite vanity with real veining, or a handmade tile wall with color. We also serve nearby Prairieville and Gonzales as part of the same area, so one conversation can cover a house in any of those communities.",
      "We will not put a Baton Rouge street address on this page, and we do not claim a branch office there. Justin travels to your home to look at the room, talk through the design, and measure.",
    ],
    servicesTitle: "What we build",
    services: [
      "Custom and curbless walk-in showers",
      "Handmade tile and zellige, including richer color on the walls",
      "Quartz and quartzite countertops and bathroom surfaces — never granite",
      "Solid-surface surrounds for a seamless, low-grout look",
      "Niches, arched openings, and fixture finishes in brass or matte black, with no brand names on the site",
    ],
    sections: [
      {
        title: "Cost, plainly",
        body: "There is no single Baton Rouge price, because the room and the materials decide it. The published range is $5,000 to $30,000+. A tighter refresh and a full custom shower with stone and handmade tile will not land on the same number. Justin gives the exact figure after he has seen the space.",
      },
      {
        title: "If you are in Prairieville or Gonzales",
        body: "You are in the service area. You do not need a separate \"local office\" to get a quote. Use the same number, (337) 522-0023, or the same Design My Bathroom form. We also have a dedicated page for Prairieville and Gonzales when that page goes live.",
      },
    ],
    close: "Call (337) 522-0023, or upload a photo of your shower and Justin will call to set up a time to measure.",
    faqs: [
      { q: "Do you serve Baton Rouge?", a: "Yes, along with Prairieville, Gonzales, and the rest of our South Louisiana area." },
      { q: "Do you have a Baton Rouge shop?", a: "No. There is no local address on this page. The consult is at your home." },
      { q: "How do I get a price?", a: "Free consult and measure. Remodels range from $5,000 to $30,000+. The exact number is given at that visit." },
    ],
    alsoServes: ["Prairieville", "Gonzales"],
  },
  {
    slug: "houma",
    name: "Houma",
    title: "Bathroom Remodels Serving Houma",
    description: "Bathroom Remodels Serving Houma | Acadiana Bathrooms",
    intro: [
      "We serve Houma with custom walk-in showers, tile, quartz and quartzite countertops, and solid surface. Acadiana Bathrooms & Countertops works across Acadiana and South Louisiana, from Lake Charles to Baton Rouge, including Prairieville and Gonzales, and from Alexandria to Houma and Thibodaux. Bathroom remodels range from $5,000 to $30,000+. Justin gives the exact number at a free consult in your home.",
      "Houma bathrooms have to handle humidity and real daily use. A curbless walk-in designed for proper drainage, tile that still looks good when the light hits it, or a solid-surface surround that wipes clean will do more for the house than a trendy look that cannot take the climate. We can still make it stylish: warm color, handmade glaze, a stone vanity, or a simple, calm room.",
      "We also serve Thibodaux as part of the same area. We do not have a Houma office or showroom, and we will not list a local street address here. The measure and the quote happen at your house.",
    ],
    servicesTitle: "What we build for Houma and nearby homes",
    services: [
      "Custom walk-in and curbless showers",
      "Tile, including handmade zellige",
      "Quartz and quartzite vanities — no granite",
      "Solid-surface walls and surrounds",
      "Niches, edges, and finishing details",
    ],
    sections: [
      {
        title: "How a quote works",
        body: "Call (337) 522-0023, fill out the quote form, or start with Design My Bathroom and a photo of the room. Justin will call to talk through the project and set up a time to measure. He will not give a final price from a photo alone. The published range stays $5,000 to $30,000+ until he has seen the work.",
      },
    ],
    close: "If you are deciding between tile and solid surface, or between quartz and quartzite, bring that question to the consult. The right answer is the one that fits your house and how you use the room.",
    faqs: [
      { q: "Do you serve Houma and Thibodaux?", a: "Yes. Both are in our South Louisiana service area." },
      { q: "Is there a Houma address?", a: "No. We do not list a local office or street address in Houma. Justin comes to you." },
      { q: "How much will it cost?", a: "$5,000 to $30,000+, with the exact number at the free consult." },
    ],
    alsoServes: ["Thibodaux"],
  },
];

export function getTown(slug: string): TownPageContent | undefined {
  return towns.find((town) => town.slug === slug);
}
