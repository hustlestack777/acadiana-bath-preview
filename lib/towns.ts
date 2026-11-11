/**
 * Town / service-area pages. Schema is areaServed only — no storefront address.
 * Justin has no public storefront yet (a Broussard warehouse is pending).
 * Local landmarks, neighborhoods and subdivisions are place references only.
 * Do not pitch remodeling older or historic homes, and do not claim past jobs.
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
  "Bathroom remodels starting at $5K, with most projects $5K–$30K+. The exact number is set at a free consult, when Justin, the owner, comes to your home to measure.";

const servicesCore = [
  "Custom walk-in showers, including curbless entries when the space allows",
  "Tile work, including handmade zellige and color-drenched walls",
  "Quartz and quartzite vanities",
  "Seamless solid-surface walls and surrounds",
  "Niches, arches, and finishing details",
] as const;

function quoteSection(): TownSection {
  return {
    title: "How a quote works",
    body: "Start with Design My Bathroom or the quote form, or send a photo. Justin calls you back to talk through the room and set a time to measure. He gives the exact price at that visit. Jobs start at $5K, with most projects $5K–$30K+.",
  };
}

export const towns: TownPageContent[] = [
  {
    slug: "lafayette",
    name: "Lafayette",
    title: "Bathroom Remodels Serving Lafayette",
    description: "Bathroom Remodels Serving Lafayette | Acadiana Bathrooms",
    intro: [
      `We serve Lafayette with custom walk-in showers, tile, quartz and quartzite countertops, and solid surface. ${SERVICE_AREA} ${priceClose}`,
      "We work with homeowners in River Ranch, the Saint Streets, Sterling Grove, Bendel Gardens, Greenbriar, and the Oil Center area.",
      "Justin comes to you. The consult happens at your house in Lafayette, where he can see the room and talk through the design.",
    ],
    servicesTitle: "What we build for Lafayette homes",
    services: servicesCore,
    sections: [quoteSection()],
    close: "Ready to talk about a Lafayette bathroom? Use Design My Bathroom or the quote form, and Justin will call you to set up a measure.",
    faqs: [
      { q: "Do you serve Lafayette?", a: "Yes. Lafayette is our home base, and the consult is in your home." },
      { q: "How much does a remodel cost?", a: "Starting at $5K, with most projects $5K–$30K+. The exact number is given at the free consult." },
      { q: "Is there a public office?", a: "We come to you. Justin meets you at your home in Lafayette for the consult." },
    ],
  },
  {
    slug: "youngsville",
    name: "Youngsville",
    title: "Bathroom Remodels Serving Youngsville",
    description: "Bathroom Remodels Serving Youngsville | Acadiana Bathrooms",
    intro: [
      `We serve Youngsville with custom walk-in showers, tile, quartz and quartzite countertops, and solid surface. ${SERVICE_AREA} ${priceClose}`,
      "Youngsville has grown quickly in recent years. We work with homeowners in Sugar Mill Pond, Southlake Plantation, Highland Plantation, Copperfield, and Laurel Grove.",
      "Justin comes to you. He meets you at your home in Youngsville to look at the room, talk through the design, and measure.",
    ],
    servicesTitle: "What we build for Youngsville homes",
    services: servicesCore,
    sections: [quoteSection()],
    close: "Ready to talk about a Youngsville bathroom? Use Design My Bathroom or the quote form, and Justin will call you to set up a measure.",
    faqs: [
      { q: "Do you serve Youngsville?", a: "Yes. Youngsville is in our Acadiana service area. The consult is in your home." },
      { q: "How much does a remodel cost?", a: "Starting at $5K, with most projects $5K–$30K+. The exact number is given at the free consult." },
      { q: "Is there a Youngsville office?", a: "We come to you. Justin meets you at your home in Youngsville for the consult." },
    ],
  },
  {
    slug: "broussard",
    name: "Broussard",
    title: "Bathroom Remodels Serving Broussard",
    description: "Bathroom Remodels Serving Broussard | Acadiana Bathrooms",
    intro: [
      `We serve Broussard with custom walk-in showers, tile, quartz and quartzite countertops, and solid surface. ${SERVICE_AREA} ${priceClose}`,
      "We work with homeowners in Le Triomphe, Cypress Meadows, and Vintage Park, just southeast of Lafayette.",
      "Justin comes to you. The consult happens at your house in Broussard, where he can see the space and talk through the design.",
    ],
    servicesTitle: "What we build for Broussard homes",
    services: servicesCore,
    sections: [quoteSection()],
    close: "Ready to talk about a Broussard bathroom? Use Design My Bathroom or the quote form, and Justin will call you to set up a measure.",
    faqs: [
      { q: "Do you serve Broussard?", a: "Yes. Broussard is in our Acadiana service area. The consult is in your home." },
      { q: "How much does a remodel cost?", a: "Starting at $5K, with most projects $5K–$30K+. The exact number is given at the free consult." },
      { q: "Is there a Broussard office?", a: "We come to you. Justin meets you at your home in Broussard for the consult." },
    ],
  },
  {
    slug: "carencro",
    name: "Carencro",
    title: "Bathroom Remodels Serving Carencro",
    description: "Bathroom Remodels Serving Carencro | Acadiana Bathrooms",
    intro: [
      `We serve Carencro with custom walk-in showers, tile, quartz and quartzite countertops, and solid surface. ${SERVICE_AREA} ${priceClose}`,
      "Carencro sits just north of Lafayette along I-49. We work with homeowners in Barrington Place, Couret Farms, Oak Path, La Bon Vie, and downtown Carencro.",
      "Justin comes to you. He meets you at your home in Carencro to look at the room and measure.",
    ],
    servicesTitle: "What we build for Carencro homes",
    services: servicesCore,
    sections: [quoteSection()],
    close: "Ready to talk about a Carencro bathroom? Use Design My Bathroom or the quote form, and Justin will call you to set up a measure.",
    faqs: [
      { q: "Do you serve Carencro?", a: "Yes. Carencro is in our Acadiana service area. The consult is in your home." },
      { q: "How much does a remodel cost?", a: "Starting at $5K, with most projects $5K–$30K+. The exact number is given at the free consult." },
      { q: "Is there a Carencro office?", a: "We come to you. Justin meets you at your home in Carencro for the consult." },
    ],
  },
  {
    slug: "opelousas",
    name: "Opelousas",
    title: "Bathroom Remodels Serving Opelousas",
    description: "Bathroom Remodels Serving Opelousas | Acadiana Bathrooms",
    intro: [
      `We serve Opelousas with custom walk-in showers, tile, quartz and quartzite countertops, and solid surface. ${SERVICE_AREA} ${priceClose}`,
      "We work with homeowners in downtown Opelousas, around the St. Landry Parish Courthouse and Bellevue Street.",
      "Justin comes to you. The consult happens at your house in Opelousas, where he can see the room and talk through the design.",
    ],
    servicesTitle: "What we build for Opelousas homes",
    services: servicesCore,
    sections: [quoteSection()],
    close: "Ready to talk about an Opelousas bathroom? Use Design My Bathroom or the quote form, and Justin will call you to set up a measure.",
    faqs: [
      { q: "Do you serve Opelousas?", a: "Yes. Opelousas is in our Acadiana and South Louisiana service area. The consult is in your home." },
      { q: "How much does a remodel cost?", a: "Starting at $5K, with most projects $5K–$30K+. The exact number is given at the free consult." },
      { q: "Is there an Opelousas office?", a: "We come to you. Justin meets you at your home in Opelousas for the consult." },
    ],
  },
  {
    slug: "new-iberia",
    name: "New Iberia",
    title: "Bathroom Remodels Serving New Iberia",
    description: "Bathroom Remodels Serving New Iberia | Acadiana Bathrooms",
    intro: [
      `We serve New Iberia with custom walk-in showers, tile, quartz and quartzite countertops, and solid surface. ${SERVICE_AREA} ${priceClose}`,
      "New Iberia sits along Bayou Teche. We work with homeowners downtown and in the East Main Street Historic District, near Shadows-on-the-Teche, and in the West End. It is close to Lafayette, Youngsville and Broussard, so one conversation can cover a house in any of those communities.",
      "Justin comes to you. He meets you at your home in New Iberia to look at the room, talk through the design, and measure.",
    ],
    servicesTitle: "What we build for New Iberia homes",
    services: servicesCore,
    sections: [quoteSection()],
    close: "Ready to talk about a New Iberia bathroom? Use Design My Bathroom or the quote form, and Justin will call you to set up a measure.",
    faqs: [
      { q: "Do you serve New Iberia?", a: "Yes. New Iberia is in our Acadiana and South Louisiana service area. The consult is in your home." },
      { q: "How much does a remodel cost?", a: "Starting at $5K, with most projects $5K–$30K+. The exact number is given at the free consult." },
      { q: "Is there a New Iberia office?", a: "We come to you. Justin meets you at your home in New Iberia for the consult." },
    ],
  },
  {
    slug: "crowley",
    name: "Crowley",
    title: "Bathroom Remodels Serving Crowley",
    description: "Bathroom Remodels Serving Crowley | Acadiana Bathrooms",
    intro: [
      `We serve Crowley with custom walk-in showers, tile, quartz and quartzite countertops, and solid surface. ${SERVICE_AREA} ${priceClose}`,
      "Crowley is known as the Rice Capital of America. We work with homeowners in the Crowley Historic District, around North Parkerson Avenue, and in South Crowley.",
      "Justin comes to you. He meets you at your home in Crowley to look at the room and measure.",
    ],
    servicesTitle: "What we build for Crowley homes",
    services: servicesCore,
    sections: [quoteSection()],
    close: "Ready to talk about a Crowley bathroom? Use Design My Bathroom or the quote form, and Justin will call you to set up a measure.",
    faqs: [
      { q: "Do you serve Crowley?", a: "Yes. Crowley is in our Acadiana and South Louisiana service area. The consult is in your home." },
      { q: "How much does a remodel cost?", a: "Starting at $5K, with most projects $5K–$30K+. The exact number is given at the free consult." },
      { q: "Is there a Crowley office?", a: "We come to you. Justin meets you at your home in Crowley for the consult." },
    ],
  },
  {
    slug: "jennings",
    name: "Jennings",
    title: "Bathroom Remodels Serving Jennings",
    description: "Bathroom Remodels Serving Jennings | Acadiana Bathrooms",
    intro: [
      `We serve Jennings with custom walk-in showers, tile, quartz and quartzite countertops, and solid surface. ${SERVICE_AREA} ${priceClose}`,
      "We work with homeowners downtown along Main Street and Cary Avenue, and in the Jennings Historical District. Louisiana's first oil well was brought in near Jennings in 1901.",
      "Justin comes to you. The consult happens at your house in Jennings, where he can see the room and talk through the design.",
    ],
    servicesTitle: "What we build for Jennings homes",
    services: servicesCore,
    sections: [quoteSection()],
    close: "Ready to talk about a Jennings bathroom? Use Design My Bathroom or the quote form, and Justin will call you to set up a measure.",
    faqs: [
      { q: "Do you serve Jennings?", a: "Yes. Jennings is in our Acadiana and South Louisiana service area. The consult is in your home." },
      { q: "How much does a remodel cost?", a: "Starting at $5K, with most projects $5K–$30K+. The exact number is given at the free consult." },
      { q: "Is there a Jennings office?", a: "We come to you. Justin meets you at your home in Jennings for the consult." },
    ],
  },
  {
    slug: "lake-charles",
    name: "Lake Charles",
    title: "Bathroom Remodels Serving Lake Charles",
    description: "Bathroom Remodels Serving Lake Charles | Acadiana Bathrooms",
    intro: [
      `We serve Lake Charles with custom walk-in showers, tile, quartz and quartzite countertops, and solid surface. ${SERVICE_AREA} ${priceClose}`,
      "We work with homeowners in the Charpentier District, Graywood, the Country Club area, Prien, and Margaret Place. We also serve nearby Sulphur, Westlake and Moss Bluff, with Gillis just north of Moss Bluff. The city has been rebuilding since Hurricanes Laura and Delta in 2020. A curbless walk-in, handmade tile with a little glaze in the light, or a quiet solid-surface surround can change how the room feels without turning the house into a showroom.",
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
    slug: "sulphur",
    name: "Sulphur",
    title: "Bathroom Remodels Serving Sulphur",
    description: "Bathroom Remodels Serving Sulphur | Acadiana Bathrooms",
    intro: [
      `We serve Sulphur with custom walk-in showers, tile, quartz and quartzite countertops, and solid surface. ${SERVICE_AREA} ${priceClose}`,
      "We work with homeowners in Maplewood and downtown Sulphur, just west of Lake Charles. Like the rest of the west end, the city has been rebuilding since Hurricane Laura in 2020.",
      "Justin comes to you. He meets you at your home in Sulphur to look at the room and measure. Have a place in Westlake or Lake Charles too? Cover both on the same call.",
    ],
    servicesTitle: "What we build for Sulphur homes",
    services: servicesCore,
    sections: [quoteSection()],
    close: "Ready to talk about a Sulphur bathroom? Use Design My Bathroom or the quote form, and Justin will call you to set up a measure.",
    faqs: [
      { q: "Do you serve Sulphur?", a: "Yes, along with Lake Charles, Westlake and Moss Bluff. The consult is in your home." },
      { q: "How much does a remodel cost?", a: "Starting at $5K, with most projects $5K–$30K+. The exact number is given at the free consult." },
      { q: "Is there a Sulphur office?", a: "We come to you. Justin meets you at your home in Sulphur for the consult." },
    ],
    alsoServes: ["Westlake", "Lake Charles"],
  },
  {
    slug: "westlake",
    name: "Westlake",
    title: "Bathroom Remodels Serving Westlake",
    description: "Bathroom Remodels Serving Westlake | Acadiana Bathrooms",
    intro: [
      `We serve Westlake with custom walk-in showers, tile, quartz and quartzite countertops, and solid surface. ${SERVICE_AREA} ${priceClose}`,
      "Westlake sits across the Calcasieu River from Lake Charles. We work with homeowners in West Trace, Augusta Village, and downtown Westlake. The city has been rebuilding since Hurricane Laura in 2020.",
      "Justin comes to you. The consult happens at your house in Westlake, where he can see the room and talk through the design.",
    ],
    servicesTitle: "What we build for Westlake homes",
    services: servicesCore,
    sections: [quoteSection()],
    close: "Ready to talk about a Westlake bathroom? Use Design My Bathroom or the quote form, and Justin will call you to set up a measure.",
    faqs: [
      { q: "Do you serve Westlake?", a: "Yes, along with Lake Charles, Sulphur and Moss Bluff. The consult is in your home." },
      { q: "How much does a remodel cost?", a: "Starting at $5K, with most projects $5K–$30K+. The exact number is given at the free consult." },
      { q: "Is there a Westlake office?", a: "We come to you. Justin meets you at your home in Westlake for the consult." },
    ],
    alsoServes: ["Sulphur", "Lake Charles"],
  },
  {
    slug: "moss-bluff",
    name: "Moss Bluff",
    title: "Bathroom Remodels Serving Moss Bluff",
    description: "Bathroom Remodels Serving Moss Bluff | Acadiana Bathrooms",
    intro: [
      `We serve Moss Bluff with custom walk-in showers, tile, quartz and quartzite countertops, and solid surface. ${SERVICE_AREA} ${priceClose}`,
      "Moss Bluff sits just north of Lake Charles, with wooded lots and newer subdivisions, and Gillis just to the north. We work with homeowners throughout Moss Bluff and the surrounding north Calcasieu area.",
      "Justin comes to you. He meets you at your home in Moss Bluff to look at the room and measure.",
    ],
    servicesTitle: "What we build for Moss Bluff homes",
    services: servicesCore,
    sections: [quoteSection()],
    close: "Ready to talk about a Moss Bluff bathroom? Use Design My Bathroom or the quote form, and Justin will call you to set up a measure.",
    faqs: [
      { q: "Do you serve Moss Bluff?", a: "Yes, along with Lake Charles, Sulphur and Westlake. The consult is in your home." },
      { q: "How much does a remodel cost?", a: "Starting at $5K, with most projects $5K–$30K+. The exact number is given at the free consult." },
      { q: "Is there a Moss Bluff office?", a: "We come to you. Justin meets you at your home in Moss Bluff for the consult." },
    ],
    alsoServes: ["Lake Charles"],
  },
  {
    slug: "alexandria",
    name: "Alexandria",
    title: "Bathroom Remodels Serving Alexandria",
    description: "Bathroom Remodels Serving Alexandria | Acadiana Bathrooms",
    intro: [
      `We serve Alexandria with custom walk-in showers, tile, quartz and quartzite countertops, and solid surface. ${SERVICE_AREA} ${priceClose}`,
      "Alexandria is the heart of Central Louisiana. We work with homeowners in the Garden District and downtown, with Pineville just across the Red River. If you want a walk-in shower, handmade tile, or a quartz or quartzite vanity, Justin will come to your home to look at the room and measure.",
      "Justin comes to you. The consult happens at your house in Alexandria, where he can see the space and talk through the design.",
    ],
    servicesTitle: "What we build for Alexandria homes",
    services: servicesCore,
    sections: [
      quoteSection(),
      {
        title: "A note on style",
        body: "Warm, earthy rooms are what people are asking for: sage and olive, terracotta, handmade tile, brushed brass or matte-black fixtures, and vanities that look like furniture. If you want the bathroom your guests notice, we can go bold. If you want quiet, we can do that too.",
      },
    ],
    close: "Ready to talk about an Alexandria bathroom? Use Design My Bathroom or the quote form, and Justin will call you to set up a measure.",
    faqs: [
      { q: "Do you serve Alexandria?", a: "Yes, along with Pineville across the Red River. The consult is in your home." },
      { q: "How much does a remodel cost?", a: "Starting at $5K, with most projects $5K–$30K+. The exact number is given at the free consult." },
      { q: "Is there an Alexandria office?", a: "We come to you. Justin meets you at your home in Alexandria for the consult." },
    ],
    alsoServes: ["Pineville"],
  },
  {
    slug: "pineville",
    name: "Pineville",
    title: "Bathroom Remodels Serving Pineville",
    description: "Bathroom Remodels Serving Pineville | Acadiana Bathrooms",
    intro: [
      `We serve Pineville with custom walk-in showers, tile, quartz and quartzite countertops, and solid surface. ${SERVICE_AREA} ${priceClose}`,
      "Pineville sits just across the Red River from Alexandria. We work with homeowners in central Pineville, Kingsville, and Beau Chene, and we also serve nearby Tioga.",
      "Justin comes to you. The consult happens at your house in Pineville, where he can see the room and talk through the design.",
    ],
    servicesTitle: "What we build for Pineville homes",
    services: servicesCore,
    sections: [quoteSection()],
    close: "Ready to talk about a Pineville bathroom? Use Design My Bathroom or the quote form, and Justin will call you to set up a measure.",
    faqs: [
      { q: "Do you serve Pineville?", a: "Yes, along with Alexandria across the Red River. The consult is in your home." },
      { q: "How much does a remodel cost?", a: "Starting at $5K, with most projects $5K–$30K+. The exact number is given at the free consult." },
      { q: "Is there a Pineville office?", a: "We come to you. Justin meets you at your home in Pineville for the consult." },
    ],
    alsoServes: ["Alexandria"],
  },
  {
    slug: "baton-rouge",
    name: "Baton Rouge",
    title: "Bathroom Remodels Serving Baton Rouge",
    description: "Bathroom Remodels Serving Baton Rouge | Acadiana Bathrooms",
    intro: [
      `We serve Baton Rouge with custom showers, tile, quartz and quartzite, and solid surface. ${SERVICE_AREA} Bathroom remodels starting at $5K. The exact price is set at a free consult, and Justin, the owner, follows up with your price.`,
      "We work with homeowners in Mid City, the Garden District, Shenandoah, Southdowns, Old Goodwood, and Jefferson Terrace, and we also serve Gonzales and Prairieville to the south. People in the capital region often want a bathroom that feels designed, not just replaced: a walk-in instead of a tub surround, a quartzite vanity with real veining, or a handmade tile wall with color.",
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
    slug: "gonzales",
    name: "Gonzales",
    title: "Bathroom Remodels Serving Gonzales",
    description: "Bathroom Remodels Serving Gonzales | Acadiana Bathrooms",
    intro: [
      `We serve Gonzales with custom walk-in showers, tile, quartz and quartzite countertops, and solid surface. ${SERVICE_AREA} ${priceClose}`,
      "Gonzales is in Ascension Parish and is known as the Jambalaya Capital of the World. We work with homeowners in downtown Gonzales and nearby Dutchtown, just south of Baton Rouge. We also serve Prairieville.",
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
      quoteSection(),
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
      "Prairieville is a growing community in Ascension Parish, just south of Baton Rouge, with many newer subdivisions. We work with homeowners in Lake Crossing, Lakes at Oak Grove, and the Hollows of Dutchtown, and in nearby Dutchtown and Galvez. We also serve Gonzales.",
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
      quoteSection(),
    ],
    close: "Ready to talk about a Prairieville bathroom? Use Design My Bathroom or the quote form, and Justin will call you to set up a measure.",
    faqs: [
      { q: "Do you serve Prairieville?", a: "Yes, along with Gonzales and the rest of our South Louisiana area. The consult is in your home." },
      { q: "How much does a remodel cost?", a: "Starting at $5K, with most projects $5K–$30K+. The exact number is given at the free consult." },
      { q: "Is there a Prairieville office?", a: "We come to you. Justin meets you at your home in Prairieville for the consult." },
    ],
    alsoServes: ["Gonzales"],
  },
  {
    slug: "plaquemine",
    name: "Plaquemine",
    title: "Bathroom Remodels Serving Plaquemine",
    description: "Bathroom Remodels Serving Plaquemine | Acadiana Bathrooms",
    intro: [
      `We serve Plaquemine with custom walk-in showers, tile, quartz and quartzite countertops, and solid surface. ${SERVICE_AREA} ${priceClose}`,
      "Plaquemine is the seat of Iberville Parish. We work with homeowners in historic downtown Plaquemine and around the Plaquemine Lock.",
      "Justin comes to you. He meets you at your home in Plaquemine to look at the room and measure.",
    ],
    servicesTitle: "What we build for Plaquemine homes",
    services: servicesCore,
    sections: [quoteSection()],
    close: "Ready to talk about a Plaquemine bathroom? Use Design My Bathroom or the quote form, and Justin will call you to set up a measure.",
    faqs: [
      { q: "Do you serve Plaquemine?", a: "Yes. Plaquemine is in our South Louisiana service area. The consult is in your home." },
      { q: "How much does a remodel cost?", a: "Starting at $5K, with most projects $5K–$30K+. The exact number is given at the free consult." },
      { q: "Is there a Plaquemine office?", a: "We come to you. Justin meets you at your home in Plaquemine for the consult." },
    ],
  },
  {
    slug: "houma",
    name: "Houma",
    title: "Bathroom Remodels Serving Houma",
    description: "Bathroom Remodels Serving Houma | Acadiana Bathrooms",
    intro: [
      `We serve Houma with custom walk-in showers, tile, quartz and quartzite countertops, and solid surface. ${SERVICE_AREA} Bathroom remodels starting at $5K, with most projects $5K–$30K+. Justin, the owner, gives the exact number at a free consult in your home.`,
      "Houma is the seat of Terrebonne Parish, with neighborhoods along Bayou Terrebonne. We work with homeowners around downtown and Main Street, Summerfield, Sugar Mill, and nearby Bayou Cane. We also serve Thibodaux, next door in Lafourche Parish near Nicholls State. Houma bathrooms have to handle humidity and real daily use. A curbless walk-in designed for proper drainage, tile that still looks good when the light hits it, or a solid-surface surround that wipes clean will do more for the house than a trendy look that cannot take the climate.",
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
    slug: "thibodaux",
    name: "Thibodaux",
    title: "Bathroom Remodels Serving Thibodaux",
    description: "Bathroom Remodels Serving Thibodaux | Acadiana Bathrooms",
    intro: [
      `We serve Thibodaux with custom walk-in showers, tile, quartz and quartzite countertops, and solid surface. ${SERVICE_AREA} ${priceClose}`,
      "Thibodaux is in Lafourche Parish, next to Nicholls State. We work with homeowners downtown, around Jackson Street and Canal Boulevard. We also serve Houma, just next door in Terrebonne Parish.",
      "Justin comes to you. He meets you at your home in Thibodaux to look at the room and measure.",
    ],
    servicesTitle: "What we build for Thibodaux homes",
    services: servicesCore,
    sections: [quoteSection()],
    close: "Ready to talk about a Thibodaux bathroom? Use Design My Bathroom or the quote form, and Justin will call you to set up a measure.",
    faqs: [
      { q: "Do you serve Thibodaux?", a: "Yes, along with Houma and the rest of our South Louisiana area. The consult is in your home." },
      { q: "How much does a remodel cost?", a: "Starting at $5K, with most projects $5K–$30K+. The exact number is given at the free consult." },
      { q: "Is there a Thibodaux office?", a: "We come to you. Justin meets you at your home in Thibodaux for the consult." },
    ],
    alsoServes: ["Houma"],
  },
];

export function getTown(slug: string): TownPageContent | undefined {
  return towns.find((town) => town.slug === slug);
}
