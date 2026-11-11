/**
 * Town / service-area pages. Schema is areaServed only — no storefront address.
 * Justin has no public storefront yet (a Broussard warehouse is pending).
 * Local landmarks and neighborhood names are place references only.
 * Do not pitch remodeling older or historic homes.
 */

import { SERVICE_AREA } from "./coverage";

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

const priceClose =
  "Bathroom remodels starting at $5K, with most projects $5K–$30K+. The exact number is set at a free consult, when Justin comes to your home to measure.";

export const towns: TownPageContent[] = [
  {
    slug: "lake-charles",
    name: "Lake Charles",
    title: "Bathroom Remodels Serving Lake Charles",
    description: "Bathroom Remodels Serving Lake Charles | Acadiana Bathrooms",
    intro: [
      `We serve Lake Charles with custom walk-in showers, tile, quartz and quartzite countertops, and solid surface. ${SERVICE_AREA} ${priceClose}`,
      "Lake Charles includes the Charpentier Historic District, and we also serve nearby Sulphur, Westlake and Moss Bluff, with Gillis just north of Moss Bluff. The city has been rebuilding since Hurricanes Laura and Delta in 2020. A curbless walk-in, handmade tile with a little glaze in the light, or a quiet solid-surface surround can change how the room feels without turning the house into a showroom.",
      "Justin comes to you. He serves Lake Charles and Southwest Louisiana as part of our full service area, and your consult happens right at your house, where he can see the room and measure. Have a place in Sulphur, Westlake or Moss Bluff too? Cover both on the same call.",
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
      { q: "Do you serve Lake Charles?", a: "Yes. We serve Lake Charles, plus Sulphur, Westlake and Moss Bluff, as part of our Acadiana and South Louisiana area. The consult is in your home." },
      { q: "How much does a remodel cost?", a: "Starting at $5K, with most projects $5K–$30K+. The exact number is given at the free consult." },
      { q: "Is there a Lake Charles office?", a: "We come to you. Justin meets you at your home in Lake Charles for the consult." },
    ],
    alsoServes: ["Sulphur", "Westlake", "Moss Bluff"],
  },
  {
    slug: "baton-rouge",
    name: "Baton Rouge",
    title: "Bathroom Remodels Serving Baton Rouge",
    description: "Bathroom Remodels Serving Baton Rouge | Acadiana Bathrooms",
    intro: [
      `We serve Baton Rouge with custom showers, tile, quartz and quartzite, and solid surface. ${SERVICE_AREA} Bathroom remodels starting at $5K. The exact price is set at a free consult, and Justin follows up with your price.`,
      "We serve homes around the Garden District, Mid City and Shenandoah, and we also serve Gonzales and Prairieville to the south. People in the capital region often want a bathroom that feels designed, not just replaced: a walk-in instead of a tub surround, a quartzite vanity with real veining, or a handmade tile wall with color.",
      "Justin comes to you. He comes to your home to look at the room, talk through the design, and measure.",
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
      `We serve Houma with custom walk-in showers, tile, quartz and quartzite countertops, and solid surface. ${SERVICE_AREA} Bathroom remodels starting at $5K, with most projects $5K–$30K+. Justin gives the exact number at a free consult in your home.`,
      "Houma is the seat of Terrebonne Parish, with neighborhoods along Bayou Terrebonne. We also serve Thibodaux, next door in Lafourche Parish near Nicholls State. Houma bathrooms have to handle humidity and real daily use. A curbless walk-in designed for proper drainage, tile that still looks good when the light hits it, or a solid-surface surround that wipes clean will do more for the house than a trendy look that cannot take the climate. We can still make it stylish: warm color, handmade glaze, a stone vanity, or a simple, calm room.",
      "Justin comes to you: the measure and the quote happen right at your house.",
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
      { q: "Do you serve Houma and Thibodaux?", a: "Yes. Both are in our South Louisiana service area. Thibodaux is next door in Lafourche Parish, near Nicholls State." },
      { q: "Is there a Houma address?", a: "We come to you. Justin meets you at your home for the measure and the quote." },
      { q: "How much will it cost?", a: "Starting at $5K, with most projects $5K–$30K+, with the exact number at the free consult." },
    ],
    alsoServes: ["Thibodaux"],
  },
  {
    slug: "alexandria",
    name: "Alexandria",
    title: "Bathroom Remodels Serving Alexandria",
    description: "Bathroom Remodels Serving Alexandria | Acadiana Bathrooms",
    intro: [
      `We serve Alexandria with custom walk-in showers, tile, quartz and quartzite countertops, and solid surface. ${SERVICE_AREA} ${priceClose}`,
      "Alexandria is the heart of Central Louisiana, with the Garden District as one of the city's well-known neighborhoods and Pineville just across the Red River. If you want a walk-in shower, handmade tile, or a quartz or quartzite vanity, Justin will come to your home to look at the room and measure.",
      "Justin comes to you. The consult happens at your house in Alexandria, where he can see the space and talk through the design.",
    ],
    servicesTitle: "What we build for Alexandria homes",
    services: [
      "Custom walk-in showers, including curbless entries when the space allows",
      "Tile work, including handmade zellige and color-drenched walls",
      "Quartz and quartzite vanities",
      "Seamless solid-surface walls and surrounds",
      "Niches, arches, and finishing details",
    ],
    sections: [
      {
        title: "How a quote works",
        body: "Start with Design My Bathroom or the quote form, or send a photo. Justin calls you back to talk through the room and set a time to measure. He gives the exact price at that visit. Jobs start at $5K, with most projects $5K–$30K+.",
      },
      {
        title: "A note on style",
        body: "Warm, earthy rooms are what people are asking for: sage and olive, terracotta, handmade tile, brushed brass or matte-black fixtures, and vanities that look like furniture. If you want the bathroom your guests notice, we can go bold. If you want quiet, we can do that too.",
      },
    ],
    close: "Ready to talk about an Alexandria bathroom? Use Design My Bathroom or the quote form, and Justin will call you to set up a measure.",
    faqs: [
      { q: "Do you serve Alexandria?", a: "Yes. We serve Alexandria as part of our Acadiana and South Louisiana area. The consult is in your home." },
      { q: "How much does a remodel cost?", a: "Starting at $5K, with most projects $5K–$30K+. The exact number is given at the free consult." },
      { q: "Is there an Alexandria office?", a: "We come to you. Justin meets you at your home in Alexandria for the consult." },
    ],
  },
  {
    slug: "new-iberia",
    name: "New Iberia",
    title: "Bathroom Remodels Serving New Iberia",
    description: "Bathroom Remodels Serving New Iberia | Acadiana Bathrooms",
    intro: [
      `We serve New Iberia with custom walk-in showers, tile, quartz and quartzite countertops, and solid surface. ${SERVICE_AREA} ${priceClose}`,
      "New Iberia sits along Bayou Teche, with Main Street and Shadows-on-the-Teche at the center of town. It is close to Lafayette, Youngsville and Broussard, so one conversation can cover a house in any of those communities.",
      "Justin comes to you. He meets you at your home in New Iberia to look at the room, talk through the design, and measure.",
    ],
    servicesTitle: "What we build for New Iberia homes",
    services: [
      "Custom walk-in showers, including curbless entries when the space allows",
      "Tile work, including handmade zellige and color-drenched walls",
      "Quartz and quartzite vanities",
      "Seamless solid-surface walls and surrounds",
      "Niches, arches, and finishing details",
    ],
    sections: [
      {
        title: "How a quote works",
        body: "Start with Design My Bathroom or the quote form, or send a photo. Justin calls you back to talk through the room and set a time to measure. He gives the exact price at that visit. Jobs start at $5K, with most projects $5K–$30K+.",
      },
    ],
    close: "Ready to talk about a New Iberia bathroom? Use Design My Bathroom or the quote form, and Justin will call you to set up a measure.",
    faqs: [
      { q: "Do you serve New Iberia?", a: "Yes. New Iberia is in our Acadiana and South Louisiana service area. The consult is in your home." },
      { q: "How much does a remodel cost?", a: "Starting at $5K, with most projects $5K–$30K+. The exact number is given at the free consult." },
      { q: "Is there a New Iberia office?", a: "We come to you. Justin meets you at your home in New Iberia for the consult." },
    ],
  },
  {
    slug: "gonzales",
    name: "Gonzales",
    title: "Bathroom Remodels Serving Gonzales",
    description: "Bathroom Remodels Serving Gonzales | Acadiana Bathrooms",
    intro: [
      `We serve Gonzales with custom walk-in showers, tile, quartz and quartzite countertops, and solid surface. ${SERVICE_AREA} ${priceClose}`,
      "Gonzales is in Ascension Parish and is known as the Jambalaya Capital of the World. We also serve nearby Prairieville, just south of Baton Rouge. Whether you want a curbless walk-in, handmade tile, or a quartz vanity, Justin comes to your home to measure and give you a price.",
      "Justin comes to you. The consult happens at your house, where he can see the room and talk through the design.",
    ],
    servicesTitle: "What we build for Gonzales homes",
    services: [
      "Custom and curbless walk-in showers",
      "Handmade tile and zellige, including richer color on the walls",
      "Quartz and quartzite vanities",
      "Solid-surface surrounds for a seamless, low-grout look",
      "Niches, arched openings, and finishing details",
    ],
    sections: [
      {
        title: "If you are in Prairieville",
        body: "You're in our service area too. Start with Design My Bathroom or the quote form, and Justin will come to you.",
      },
      {
        title: "How a quote works",
        body: "Start with Design My Bathroom or the quote form, or send a photo. Justin calls you back to talk through the room and set a time to measure. He gives the exact price at that visit. Jobs start at $5K, with most projects $5K–$30K+.",
      },
    ],
    close: "Ready to talk about a Gonzales bathroom? Use Design My Bathroom or the quote form, and Justin will call you to set up a measure.",
    faqs: [
      { q: "Do you serve Gonzales?", a: "Yes, along with Prairieville and the rest of our South Louisiana area. The consult is in your home." },
      { q: "How much does a remodel cost?", a: "Starting at $5K, with most projects $5K–$30K+. The exact number is given at the free consult." },
      { q: "Is there a Gonzales office?", a: "We come to you. Justin meets you at your home in Gonzales for the consult." },
    ],
    alsoServes: ["Prairieville"],
  },
  {
    slug: "prairieville",
    name: "Prairieville",
    title: "Bathroom Remodels Serving Prairieville",
    description: "Bathroom Remodels Serving Prairieville | Acadiana Bathrooms",
    intro: [
      `We serve Prairieville with custom walk-in showers, tile, quartz and quartzite countertops, and solid surface. ${SERVICE_AREA} ${priceClose}`,
      "Prairieville is a growing community in Ascension Parish, just south of Baton Rouge, with many newer subdivisions. We also serve nearby Gonzales. If you are planning a walk-in shower, tile, or a new vanity, Justin will come to your house to measure and talk through the design.",
      "Justin comes to you. The consult happens at your home in Prairieville, where he can see the room and give you a price.",
    ],
    servicesTitle: "What we build for Prairieville homes",
    services: [
      "Custom and curbless walk-in showers",
      "Handmade tile and zellige, including richer color on the walls",
      "Quartz and quartzite vanities",
      "Solid-surface surrounds for a seamless, low-grout look",
      "Niches, arched openings, and finishing details",
    ],
    sections: [
      {
        title: "If you are in Gonzales",
        body: "You're in our service area too. Start with Design My Bathroom or the quote form, and Justin will come to you.",
      },
      {
        title: "How a quote works",
        body: "Start with Design My Bathroom or the quote form, or send a photo. Justin calls you back to talk through the room and set a time to measure. He gives the exact price at that visit. Jobs start at $5K, with most projects $5K–$30K+.",
      },
    ],
    close: "Ready to talk about a Prairieville bathroom? Use Design My Bathroom or the quote form, and Justin will call you to set up a measure.",
    faqs: [
      { q: "Do you serve Prairieville?", a: "Yes, along with Gonzales and the rest of our South Louisiana area. The consult is in your home." },
      { q: "How much does a remodel cost?", a: "Starting at $5K, with most projects $5K–$30K+. The exact number is given at the free consult." },
      { q: "Is there a Prairieville office?", a: "We come to you. Justin meets you at your home in Prairieville for the consult." },
    ],
    alsoServes: ["Gonzales"],
  },
];

export function getTown(slug: string): TownPageContent | undefined {
  return towns.find((town) => town.slug === slug);
}
