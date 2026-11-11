/**
 * Town / service-area pages. Schema is areaServed only — no storefront address.
 * Justin has no public storefront yet (a Broussard warehouse is pending).
 * Local landmarks, neighborhoods and subdivisions are place references only.
 * Do not pitch remodeling older or historic homes, and do not claim past jobs.
 */

export type TownFaq = { q: string; a: string };

export type TownSection = { title: string; body: string };

export type TownPageContent = {
  slug: string;
  name: string;
  title: string;
  /** Short unique meta description. Not a shared template. */
  description: string;
  intro: readonly string[];
  /** Nearby town-page slugs (3–5 when geography allows). */
  nearby: readonly string[];
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

const servicesCore = [
  "Custom walk-in showers, including curbless entries when the space allows",
  "Tile work, including handmade zellige and color-drenched walls",
  "Quartz and quartzite vanities",
  "Seamless solid-surface walls and surrounds",
  "Niches, arches, and finishing details",
] as const;

const QUOTE_LINE =
  "Tell us about your project and the best day and time to reach you. Justin calls you first to discuss your project, then sets a time to come out to your home to take measurements, go over your design options and give you your exact price. When you're ready to move forward, Justin manages your project from design to the finished bathroom.";

function quoteSection(): TownSection {
  return {
    title: "How a quote works",
    body: `Start with Design My Bathroom or the quote form, or send a photo. ${QUOTE_LINE} Starting at $5K, with most projects $5K–$30K+.`,
  };
}

function costFaq(question = "How much does a remodel cost?"): TownFaq {
  return {
    q: question,
    a: `Starting at $5K, with most projects $5K–$30K+. ${QUOTE_LINE}`,
  };
}

function officeFaq(question: string, town: string): TownFaq {
  return {
    q: question,
    a: `There's no public showroom. Justin calls to discuss your project, then sets a time to take measurements at your home in ${town}.`,
  };
}

function closeLine(name: string) {
  return `Ready to talk about a ${name} bathroom? Use Design My Bathroom or the quote form, and Justin will call to discuss your project.`;
}

export const towns: TownPageContent[] = [
  {
    slug: "lafayette",
    name: "Lafayette",
    title: "Bathroom Remodels Serving Lafayette",
    description:
      "Walk-in showers, tile, and solid surface for Lafayette homes in River Ranch, the Saint Streets, Sterling Grove, Bendel Gardens, and Greenbriar. Free quote.",
    intro: [
      "We serve Lafayette with custom walk-in showers, tile, quartz and quartzite countertops, and solid surface.",
      "We work with homeowners in River Ranch, the Saint Streets, Sterling Grove, Bendel Gardens, Greenbriar, and the Oil Center area.",
    ],
    nearby: ["youngsville", "broussard", "carencro", "opelousas", "new-iberia"],
    servicesTitle: "What we build for Lafayette homes",
    services: servicesCore,
    sections: [quoteSection()],
    close: closeLine("Lafayette"),
    faqs: [
      { q: "Do you serve Lafayette?", a: "Yes. Lafayette is our home base." },
      costFaq(),
      officeFaq("Is there a public office?", "Lafayette"),
    ],
  },
  {
    slug: "youngsville",
    name: "Youngsville",
    title: "Bathroom Remodels Serving Youngsville",
    description:
      "Bathroom remodels for Youngsville neighborhoods including Sugar Mill Pond, Southlake Plantation, Highland Plantation, Copperfield, and Laurel Grove. Starting at $5K.",
    intro: [
      "We serve Youngsville with custom walk-in showers, tile, quartz and quartzite countertops, and solid surface.",
      "Youngsville has grown quickly in recent years. We work with homeowners in Sugar Mill Pond, Southlake Plantation, Highland Plantation, Copperfield, and Laurel Grove.",
    ],
    nearby: ["lafayette", "broussard", "new-iberia", "carencro", "crowley"],
    servicesTitle: "What we build for Youngsville homes",
    services: servicesCore,
    sections: [quoteSection()],
    close: closeLine("Youngsville"),
    faqs: [
      { q: "Do you serve Youngsville?", a: "Yes. Youngsville is in our South Louisiana service area." },
      costFaq(),
      officeFaq("Is there a Youngsville office?", "Youngsville"),
    ],
  },
  {
    slug: "broussard",
    name: "Broussard",
    title: "Bathroom Remodels Serving Broussard",
    description:
      "Custom showers, tile, and solid surface for Broussard homes in Le Triomphe, Cypress Meadows, and Vintage Park. Free quote from Acadiana Bathrooms.",
    intro: [
      "We serve Broussard with custom walk-in showers, tile, quartz and quartzite countertops, and solid surface.",
      "We work with homeowners in Le Triomphe, Cypress Meadows, and Vintage Park.",
    ],
    nearby: ["lafayette", "youngsville", "new-iberia", "carencro"],
    servicesTitle: "What we build for Broussard homes",
    services: servicesCore,
    sections: [quoteSection()],
    close: closeLine("Broussard"),
    faqs: [
      { q: "Do you serve Broussard?", a: "Yes. Broussard is in our South Louisiana service area." },
      costFaq(),
      officeFaq("Is there a Broussard office?", "Broussard"),
    ],
  },
  {
    slug: "carencro",
    name: "Carencro",
    title: "Bathroom Remodels Serving Carencro",
    description:
      "Bathroom remodels serving Carencro, including Barrington Place, Couret Farms, Oak Path, La Bon Vie, and downtown. Starting at $5K. Free quote.",
    intro: [
      "We serve Carencro with custom walk-in showers, tile, quartz and quartzite countertops, and solid surface.",
      "We work with homeowners in Barrington Place, Couret Farms, Oak Path, La Bon Vie, and downtown Carencro.",
    ],
    nearby: ["lafayette", "opelousas", "youngsville", "broussard"],
    servicesTitle: "What we build for Carencro homes",
    services: servicesCore,
    sections: [quoteSection()],
    close: closeLine("Carencro"),
    faqs: [
      { q: "Do you serve Carencro?", a: "Yes. Carencro is in our South Louisiana service area." },
      costFaq(),
      officeFaq("Is there a Carencro office?", "Carencro"),
    ],
  },
  {
    slug: "opelousas",
    name: "Opelousas",
    title: "Bathroom Remodels Serving Opelousas",
    description:
      "Walk-in showers, tile, and solid surface for Opelousas homes around downtown, the St. Landry Parish Courthouse, and Bellevue Street. Free quote.",
    intro: [
      "We serve Opelousas with custom walk-in showers, tile, quartz and quartzite countertops, and solid surface.",
      "We work with homeowners downtown around the St. Landry Parish Courthouse and Bellevue Street.",
    ],
    nearby: ["carencro", "lafayette", "crowley", "alexandria"],
    servicesTitle: "What we build for Opelousas homes",
    services: servicesCore,
    sections: [quoteSection()],
    close: closeLine("Opelousas"),
    faqs: [
      { q: "Do you serve Opelousas?", a: "Yes. Opelousas is in our South Louisiana service area." },
      costFaq(),
      officeFaq("Is there an Opelousas office?", "Opelousas"),
    ],
  },
  {
    slug: "new-iberia",
    name: "New Iberia",
    title: "Bathroom Remodels Serving New Iberia",
    description:
      "Bathroom remodels in New Iberia along Bayou Teche, downtown, East Main Street, and West End. Starting at $5K. Free quote.",
    intro: [
      "We serve New Iberia with custom walk-in showers, tile, quartz and quartzite countertops, and solid surface.",
      "New Iberia sits along Bayou Teche. We work with homeowners downtown, along East Main Street, and in the West End. It is close to Lafayette, Youngsville and Broussard.",
    ],
    nearby: ["broussard", "lafayette", "youngsville", "crowley"],
    servicesTitle: "What we build for New Iberia homes",
    services: servicesCore,
    sections: [quoteSection()],
    close: closeLine("New Iberia"),
    faqs: [
      { q: "Do you serve New Iberia?", a: "Yes. New Iberia is in our South Louisiana service area." },
      costFaq(),
      officeFaq("Is there a New Iberia office?", "New Iberia"),
    ],
  },
  {
    slug: "crowley",
    name: "Crowley",
    title: "Bathroom Remodels Serving Crowley",
    description:
      "Custom showers and tile for Crowley, the Rice Capital of America, including downtown around North Parkerson Avenue and South Crowley. Free quote.",
    intro: [
      "We serve Crowley with custom walk-in showers, tile, quartz and quartzite countertops, and solid surface.",
      "Crowley is known as the Rice Capital of America. We work with homeowners downtown around North Parkerson Avenue and in South Crowley.",
    ],
    nearby: ["jennings", "lafayette", "opelousas", "new-iberia"],
    servicesTitle: "What we build for Crowley homes",
    services: servicesCore,
    sections: [quoteSection()],
    close: closeLine("Crowley"),
    faqs: [
      { q: "Do you serve Crowley?", a: "Yes. Crowley is in our South Louisiana service area." },
      costFaq(),
      officeFaq("Is there a Crowley office?", "Crowley"),
    ],
  },
  {
    slug: "jennings",
    name: "Jennings",
    title: "Bathroom Remodels Serving Jennings",
    description:
      "Bathroom remodels serving Jennings, from downtown Main Street and Cary Avenue across Jeff Davis Parish. Starting at $5K. Free quote.",
    intro: [
      "We serve Jennings with custom walk-in showers, tile, quartz and quartzite countertops, and solid surface.",
      "We work with homeowners downtown along Main Street and Cary Avenue. Louisiana's first oil well was brought in near Jennings in 1901.",
    ],
    nearby: ["crowley", "lake-charles", "lafayette"],
    servicesTitle: "What we build for Jennings homes",
    services: servicesCore,
    sections: [quoteSection()],
    close: closeLine("Jennings"),
    faqs: [
      { q: "Do you serve Jennings?", a: "Yes. Jennings is in our South Louisiana service area." },
      costFaq(),
      officeFaq("Is there a Jennings office?", "Jennings"),
    ],
  },
  {
    slug: "lake-charles",
    name: "Lake Charles",
    title: "Bathroom Remodels Serving Lake Charles",
    description:
      "Walk-in showers, tile, and solid surface for Lake Charles homes in Graywood, Prien, and the Country Club area, plus nearby Sulphur, Westlake, and Moss Bluff.",
    intro: [
      "We serve Lake Charles with custom walk-in showers, tile, quartz and quartzite countertops, and solid surface.",
      "We work with homeowners in Graywood, the Country Club area, Prien, and Margaret Place. We also serve nearby Sulphur, Westlake and Moss Bluff, with Gillis just north of Moss Bluff. A curbless walk-in, handmade tile with a little glaze in the light, or a quiet solid-surface surround can change how the room feels without turning the house into a showroom.",
    ],
    nearby: ["sulphur", "westlake", "moss-bluff", "jennings"],
    servicesTitle: "What we build for Lake Charles homes",
    services: [
      "Custom walk-in showers, including curbless entries when the space allows",
      "Tile work, including handmade zellige and color-drenched walls",
      "Quartz and quartzite vanities",
      "Seamless solid-surface walls and surrounds",
      "Niches, arches, and the finishing details that make a shower feel like a room",
    ],
    sections: [
      quoteSection(),
      {
        title: "A note on style",
        body: "Warm, earthy rooms are what people are asking for: sage and olive, terracotta, soft pink tile, brushed brass or matte-black fixtures, and vanities that look like furniture. Checkerboard floors can carry a room if the walls stay calmer. If you want the bathroom your guests notice, we can go bold. If you want quiet, we can do that too.",
      },
    ],
    close: closeLine("Lake Charles"),
    faqs: [
      { q: "Do you serve Lake Charles?", a: "Yes. We serve Lake Charles, plus Sulphur, Westlake and Moss Bluff, as part of our South Louisiana area." },
      costFaq(),
      officeFaq("Is there a Lake Charles office?", "Lake Charles"),
    ],
    alsoServes: ["Sulphur", "Westlake", "Moss Bluff"],
  },
  {
    slug: "sulphur",
    name: "Sulphur",
    title: "Bathroom Remodels Serving Sulphur",
    description:
      "Bathroom remodels for Sulphur, including Maplewood and downtown, just west of Lake Charles. Starting at $5K. Free quote.",
    intro: [
      "We serve Sulphur with custom walk-in showers, tile, quartz and quartzite countertops, and solid surface.",
      "We work with homeowners in Maplewood and downtown Sulphur, just west of Lake Charles.",
    ],
    nearby: ["lake-charles", "westlake", "moss-bluff"],
    servicesTitle: "What we build for Sulphur homes",
    services: servicesCore,
    sections: [quoteSection()],
    close: closeLine("Sulphur"),
    faqs: [
      { q: "Do you serve Sulphur?", a: "Yes, along with Lake Charles, Westlake and Moss Bluff." },
      costFaq(),
      officeFaq("Is there a Sulphur office?", "Sulphur"),
    ],
    alsoServes: ["Westlake", "Lake Charles"],
  },
  {
    slug: "westlake",
    name: "Westlake",
    title: "Bathroom Remodels Serving Westlake",
    description:
      "Custom showers, tile, and solid surface for Westlake homes in West Trace, Augusta Village, and downtown, across the river from Lake Charles. Free quote.",
    intro: [
      "We serve Westlake with custom walk-in showers, tile, quartz and quartzite countertops, and solid surface.",
      "Westlake sits across the Calcasieu River from Lake Charles. We work with homeowners in West Trace, Augusta Village, and downtown Westlake.",
    ],
    nearby: ["lake-charles", "sulphur", "moss-bluff"],
    servicesTitle: "What we build for Westlake homes",
    services: servicesCore,
    sections: [quoteSection()],
    close: closeLine("Westlake"),
    faqs: [
      { q: "Do you serve Westlake?", a: "Yes, along with Lake Charles, Sulphur and Moss Bluff." },
      costFaq(),
      officeFaq("Is there a Westlake office?", "Westlake"),
    ],
    alsoServes: ["Sulphur", "Lake Charles"],
  },
  {
    slug: "moss-bluff",
    name: "Moss Bluff",
    title: "Bathroom Remodels Serving Moss Bluff",
    description:
      "Bathroom remodels serving Moss Bluff, just north of Lake Charles, including wooded lots and nearby Gillis. Starting at $5K. Free quote.",
    intro: [
      "We serve Moss Bluff with custom walk-in showers, tile, quartz and quartzite countertops, and solid surface.",
      "Moss Bluff sits just north of Lake Charles, with wooded lots and newer subdivisions, and Gillis just to the north. We work with homeowners throughout Moss Bluff and the surrounding north Calcasieu area.",
    ],
    nearby: ["lake-charles", "westlake", "sulphur"],
    servicesTitle: "What we build for Moss Bluff homes",
    services: servicesCore,
    sections: [quoteSection()],
    close: closeLine("Moss Bluff"),
    faqs: [
      { q: "Do you serve Moss Bluff?", a: "Yes, along with Lake Charles, Sulphur and Westlake." },
      costFaq(),
      officeFaq("Is there a Moss Bluff office?", "Moss Bluff"),
    ],
    alsoServes: ["Lake Charles"],
  },
  {
    slug: "alexandria",
    name: "Alexandria",
    title: "Bathroom Remodels Serving Alexandria",
    description:
      "Walk-in showers, tile, and solid surface for Alexandria homes in the Garden District and downtown, plus Pineville across the Red River. Free quote.",
    intro: [
      "We serve Alexandria with custom walk-in showers, tile, quartz and quartzite countertops, and solid surface.",
      "Alexandria is the heart of Central Louisiana. We work with homeowners in the Garden District and downtown, with Pineville just across the Red River.",
    ],
    nearby: ["pineville", "opelousas"],
    servicesTitle: "What we build for Alexandria homes",
    services: servicesCore,
    sections: [
      quoteSection(),
      {
        title: "A note on style",
        body: "Warm, earthy rooms are what people are asking for: sage and olive, terracotta, handmade tile, brushed brass or matte-black fixtures, and vanities that look like furniture. If you want the bathroom your guests notice, we can go bold. If you want quiet, we can do that too.",
      },
    ],
    close: closeLine("Alexandria").replace("a Alexandria", "an Alexandria"),
    faqs: [
      { q: "Do you serve Alexandria?", a: "Yes, along with Pineville across the Red River." },
      costFaq(),
      officeFaq("Is there an Alexandria office?", "Alexandria"),
    ],
    alsoServes: ["Pineville"],
  },
  {
    slug: "pineville",
    name: "Pineville",
    title: "Bathroom Remodels Serving Pineville",
    description:
      "Bathroom remodels for Pineville, including central Pineville, Kingsville, Beau Chene, and nearby Tioga, just across the river from Alexandria. Free quote.",
    intro: [
      "We serve Pineville with custom walk-in showers, tile, quartz and quartzite countertops, and solid surface.",
      "Pineville sits just across the Red River from Alexandria. We work with homeowners in central Pineville, Kingsville, and Beau Chene, and we also serve nearby Tioga.",
    ],
    nearby: ["alexandria", "opelousas"],
    servicesTitle: "What we build for Pineville homes",
    services: servicesCore,
    sections: [quoteSection()],
    close: closeLine("Pineville"),
    faqs: [
      { q: "Do you serve Pineville?", a: "Yes, along with Alexandria across the Red River." },
      costFaq(),
      officeFaq("Is there a Pineville office?", "Pineville"),
    ],
    alsoServes: ["Alexandria"],
  },
  {
    slug: "baton-rouge",
    name: "Baton Rouge",
    title: "Bathroom Remodels Serving Baton Rouge",
    description:
      "Custom showers, tile, quartz, and solid surface for Baton Rouge homes in Mid City, the Garden District, Shenandoah, Southdowns, and Old Goodwood. Free quote.",
    intro: [
      "We serve Baton Rouge with custom showers, tile, quartz and quartzite, and solid surface.",
      "We work with homeowners in Mid City, the Garden District, Shenandoah, Southdowns, Old Goodwood, and Jefferson Terrace, and we also serve Gonzales and Prairieville to the south. People in the capital region often want a bathroom that feels designed, not just replaced: a walk-in instead of a tub surround, a quartzite vanity with real veining, or a handmade tile wall with color.",
    ],
    nearby: ["gonzales", "prairieville", "plaquemine"],
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
        body: "There is no single Baton Rouge price, because the room and the materials decide it. Starting at $5K, with most projects $5K–$30K+. A tighter refresh and a full custom shower with stone and handmade tile are priced differently. " + QUOTE_LINE,
      },
      {
        title: "If you are in Prairieville or Gonzales",
        body: "You're in our service area. Start with Design My Bathroom or the quote form, and Justin will call to discuss your project.",
      },
    ],
    close: "Upload a photo of your shower or use Design My Bathroom, and Justin will call to discuss your project.",
    faqs: [
      { q: "Do you serve Baton Rouge?", a: "Yes, along with Prairieville, Gonzales, and the rest of our South Louisiana area." },
      officeFaq("Do you have a Baton Rouge shop?", "Baton Rouge"),
      costFaq("How do I get a price?"),
    ],
    alsoServes: ["Prairieville", "Gonzales"],
  },
  {
    slug: "gonzales",
    name: "Gonzales",
    title: "Bathroom Remodels Serving Gonzales",
    description:
      "Bathroom remodels in Gonzales, the Jambalaya Capital of the World, plus nearby Dutchtown and Prairieville. Starting at $5K. Free quote.",
    intro: [
      "We serve Gonzales with custom walk-in showers, tile, quartz and quartzite countertops, and solid surface.",
      "Gonzales is in Ascension Parish and is known as the Jambalaya Capital of the World. We work with homeowners in downtown Gonzales and nearby Dutchtown, just south of Baton Rouge. We also serve Prairieville.",
    ],
    nearby: ["prairieville", "baton-rouge", "plaquemine"],
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
        body: "You're in our service area too. Start with Design My Bathroom or the quote form, and Justin will call to discuss your project.",
      },
      quoteSection(),
    ],
    close: closeLine("Gonzales"),
    faqs: [
      { q: "Do you serve Gonzales?", a: "Yes, along with Prairieville and the rest of our South Louisiana area." },
      costFaq(),
      officeFaq("Is there a Gonzales office?", "Gonzales"),
    ],
    alsoServes: ["Prairieville"],
  },
  {
    slug: "prairieville",
    name: "Prairieville",
    title: "Bathroom Remodels Serving Prairieville",
    description:
      "Walk-in showers and tile for Prairieville neighborhoods including Lake Crossing, Lakes at Oak Grove, and the Hollows of Dutchtown. Free quote.",
    intro: [
      "We serve Prairieville with custom walk-in showers, tile, quartz and quartzite countertops, and solid surface.",
      "Prairieville is a growing community in Ascension Parish, just south of Baton Rouge, with many newer subdivisions. We work with homeowners in Lake Crossing, Lakes at Oak Grove, and the Hollows of Dutchtown, and in nearby Dutchtown and Galvez. We also serve Gonzales.",
    ],
    nearby: ["gonzales", "baton-rouge", "plaquemine"],
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
        body: "You're in our service area too. Start with Design My Bathroom or the quote form, and Justin will call to discuss your project.",
      },
      quoteSection(),
    ],
    close: closeLine("Prairieville"),
    faqs: [
      { q: "Do you serve Prairieville?", a: "Yes, along with Gonzales and the rest of our South Louisiana area." },
      costFaq(),
      officeFaq("Is there a Prairieville office?", "Prairieville"),
    ],
    alsoServes: ["Gonzales"],
  },
  {
    slug: "plaquemine",
    name: "Plaquemine",
    title: "Bathroom Remodels Serving Plaquemine",
    description:
      "Bathroom remodels serving Plaquemine, the Iberville Parish seat, including downtown and the area around the Plaquemine Lock. Starting at $5K.",
    intro: [
      "We serve Plaquemine with custom walk-in showers, tile, quartz and quartzite countertops, and solid surface.",
      "Plaquemine is the seat of Iberville Parish. We work with homeowners downtown and around the Plaquemine Lock.",
    ],
    nearby: ["baton-rouge", "gonzales", "prairieville"],
    servicesTitle: "What we build for Plaquemine homes",
    services: servicesCore,
    sections: [quoteSection()],
    close: closeLine("Plaquemine"),
    faqs: [
      { q: "Do you serve Plaquemine?", a: "Yes. Plaquemine is in our South Louisiana service area." },
      costFaq(),
      officeFaq("Is there a Plaquemine office?", "Plaquemine"),
    ],
  },
  {
    slug: "houma",
    name: "Houma",
    title: "Bathroom Remodels Serving Houma",
    description:
      "Custom walk-in showers, tile, and solid surface for Houma homes around Main Street, Summerfield, Sugar Mill, and nearby Bayou Cane. Free quote.",
    intro: [
      "We serve Houma with custom walk-in showers, tile, quartz and quartzite countertops, and solid surface.",
      "Houma is the seat of Terrebonne Parish, with neighborhoods along Bayou Terrebonne. We work with homeowners around downtown and Main Street, Summerfield, Sugar Mill, and nearby Bayou Cane. We also serve Thibodaux, next door in Lafourche Parish near Nicholls State. Houma bathrooms have to handle humidity and real daily use. A curbless walk-in designed for proper drainage, tile that still looks good when the light hits it, or a solid-surface surround that wipes clean will do more for the house than a trendy look that cannot take the climate.",
    ],
    nearby: ["thibodaux", "new-iberia"],
    servicesTitle: "What we build for Houma and nearby homes",
    services: [
      "Custom walk-in and curbless showers",
      "Tile, including handmade zellige",
      "Quartz and quartzite vanities",
      "Solid-surface walls and surrounds",
      "Niches, edges, and finishing details",
    ],
    sections: [quoteSection()],
    close: "If you are deciding between tile and solid surface, or between quartz and quartzite, bring that question when Justin calls. The right answer is the one that fits your house and how you use the room.",
    faqs: [
      { q: "Do you serve Houma and Thibodaux?", a: "Yes. Both are in our South Louisiana service area. Thibodaux is next door in Lafourche Parish, near Nicholls State." },
      officeFaq("Is there a Houma address?", "Houma"),
      costFaq("How much will it cost?"),
    ],
    alsoServes: ["Thibodaux"],
  },
  {
    slug: "thibodaux",
    name: "Thibodaux",
    title: "Bathroom Remodels Serving Thibodaux",
    description:
      "Bathroom remodels in Thibodaux, near Nicholls State, including downtown Jackson Street and Canal Boulevard, plus nearby Houma. Free quote.",
    intro: [
      "We serve Thibodaux with custom walk-in showers, tile, quartz and quartzite countertops, and solid surface.",
      "Thibodaux is in Lafourche Parish, next to Nicholls State. We work with homeowners downtown, around Jackson Street and Canal Boulevard. We also serve Houma, just next door in Terrebonne Parish.",
    ],
    nearby: ["houma", "new-iberia"],
    servicesTitle: "What we build for Thibodaux homes",
    services: servicesCore,
    sections: [quoteSection()],
    close: closeLine("Thibodaux"),
    faqs: [
      { q: "Do you serve Thibodaux?", a: "Yes, along with Houma and the rest of our South Louisiana area." },
      costFaq(),
      officeFaq("Is there a Thibodaux office?", "Thibodaux"),
    ],
    alsoServes: ["Houma"],
  },
];

export function getTown(slug: string): TownPageContent | undefined {
  return towns.find((town) => town.slug === slug);
}

export function nearbyTowns(slug: string): TownPageContent[] {
  const town = getTown(slug);
  if (!town) return [];
  return town.nearby
    .map((item) => getTown(item))
    .filter((item): item is TownPageContent => Boolean(item));
}
