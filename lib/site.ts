/**
 * Canonical business facts for header, footer, schema, robots and llms.txt.
 * Keep name and phone identical everywhere they appear.
 *
 * TODO: add a public business address only after a storefront is confirmed.
 * Until then, schema stays area-only (no address). A Broussard warehouse is pending.
 * TODO: add the Google Business Profile URL (schema sameAs) after verification.
 * TODO: add opening hours when they are confirmed.
 */

import { brand } from "./copy";
import { MAIN_TOWNS, SERVICE_AREA } from "./coverage";

/** The preview stays noindex until this is exactly "true" and the service is redeployed. */
export const SITE_INDEXABLE = process.env.SITE_INDEXABLE === "true";

export const SITE_URL = (process.env.SITE_URL ?? "https://acadiana-bathrooms.onrender.com").replace(/\/$/, "");

/** Relative canonical path. Next resolves it against metadataBase (SITE_URL). */
export function pageCanonical(path: string) {
  if (!path || path === "/") return "/";
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return normalized.replace(/\/+$/, "");
}

/** Visible name — same string as the header, footer and schema `name`. */
export const SITE_NAME = brand.name;

/** Shorter public name. Used only as schema.org alternateName, not as a second visible brand. */
export const SITE_SHORT_NAME = "Acadiana Bathrooms";

/** Visible phone — same string as the header and footer. */
export const SITE_PHONE = brand.phone;

/** International form of SITE_PHONE for tel: links and schema.org telephone. */
export const SITE_TELEPHONE = "+1-337-522-0023";

export const SITE_EMAIL = brand.email;
export const SITE_LOGO_PATH = "/brand/logo.png";
export const SITE_LOGO_URL = `${SITE_URL}${SITE_LOGO_PATH}`;

/** schema.org priceRange. Public copy leads with Starting at $7K; JSON-LD stays in dollars as $7,000 to $30,000+. */
export const SCHEMA_PRICE_RANGE = "$7,000 to $30,000+";

export const VISIBLE_SERVICES = [
  { name: "Custom showers", serviceType: "Custom walk-in showers", url: SITE_URL },
  { name: "Custom tile", serviceType: "Custom tile bathroom remodeling", url: `${SITE_URL}/custom-tile` },
  { name: "Quartz and quartzite countertops", serviceType: "Quartz and quartzite bathroom countertops", url: SITE_URL },
  { name: "Solid surface showers and tub walls", serviceType: "Solid surface bathroom remodeling", url: `${SITE_URL}/solid-surface` },
  { name: "Window replacement", serviceType: "Window replacement and installation", url: `${SITE_URL}/windows` },
] as const;

/** Official profiles for schema.org sameAs. */
export const SITE_SAME_AS = ["https://www.facebook.com/profile.php?id=61596069587015"] as const;

/**
 * Parishes highlighted on Boogie's service map, plus any parish that contains
 * one of the listed towns. Used as AdministrativeArea nodes in areaServed.
 * Do not add St. Tammany, Tangipahoa, Orleans, Jefferson, or Beauregard.
 */
export const SCHEMA_PARISHES = [
  "Lafayette",
  "Iberia",
  "St. Martin",
  "Vermilion",
  "Acadia",
  "St. Landry",
  "Calcasieu",
  "Jefferson Davis",
  "Allen",
  "Evangeline",
  "Rapides",
  "East Baton Rouge",
  "West Baton Rouge",
  "Iberville",
  "Ascension",
  "Assumption",
  "St. Mary",
  "Terrebonne",
  "Lafourche",
  "Cameron",
  "Avoyelles",
  "Pointe Coupee",
] as const;

/** Exact service-area sentence for schema descriptions and llms.txt. Do not use in visible marketing copy. */
export const SCHEMA_SERVICE_AREA = SERVICE_AREA;

/** Places that must not appear in schema, llms.txt, or other new SEO copy. */
export const EXCLUDED_SERVICE_AREAS = [
  "North Shore",
  "New Orleans",
  "DeRidder",
  "Deridder",
  "Beauregard",
  "Covington",
  "Mandeville",
  "Slidell",
  "Hammond",
  "Metairie",
  "Kenner",
] as const;

export const siteRobots = SITE_INDEXABLE
  ? { index: true, follow: true }
  : { index: false, follow: false };

/** Paths disallowed in the go-live robots.txt. /windows is allowed so it can be indexed like the rest of the site. */
export const ROBOTS_DISALLOW_WHEN_LIVE = ["/api/"] as const;

export const AI_SEARCH_USER_AGENTS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "Google-Extended",
  "Googlebot",
  "Bingbot",
  "PerplexityBot",
  "Perplexity-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "Applebot",
] as const;

export type SchemaPlace = {
  "@type": "City" | "AdministrativeArea" | "State";
  name: string;
  containedInPlace?: SchemaPlace;
};

const louisiana: SchemaPlace = { "@type": "State", name: "Louisiana" };

function parishPlace(name: string): SchemaPlace {
  return { "@type": "AdministrativeArea", name: `${name} Parish`, containedInPlace: louisiana };
}

const PARISH_BY_TOWN: Record<string, (typeof SCHEMA_PARISHES)[number]> = {
  Lafayette: "Lafayette",
  Youngsville: "Lafayette",
  Broussard: "Lafayette",
  Carencro: "Lafayette",
  Scott: "Lafayette",
  Opelousas: "St. Landry",
  Eunice: "St. Landry",
  "Ville Platte": "Evangeline",
  "New Iberia": "Iberia",
  Crowley: "Acadia",
  Rayne: "Acadia",
  Jennings: "Jefferson Davis",
  Kinder: "Allen",
  "Lake Charles": "Calcasieu",
  Sulphur: "Calcasieu",
  Westlake: "Calcasieu",
  "Moss Bluff": "Calcasieu",
  Alexandria: "Rapides",
  Pineville: "Rapides",
  "Baton Rouge": "East Baton Rouge",
  Gonzales: "Ascension",
  Prairieville: "Ascension",
  Plaquemine: "Iberville",
  Houma: "Terrebonne",
  Thibodaux: "Lafourche",
};

function city(name: string, containedInPlace: SchemaPlace = louisiana): SchemaPlace {
  return { "@type": "City", name, containedInPlace };
}

/** City node for schema areaServed, nested in its parish when known. */
export function cityPlace(name: string): SchemaPlace {
  const parish = PARISH_BY_TOWN[name];
  return parish ? city(name, parishPlace(parish)) : city(name);
}

/**
 * areaServed for schema: every mapped parish as an AdministrativeArea, plus
 * the listed towns as City nodes. Do not add North Shore, New Orleans,
 * or DeRidder/Beauregard.
 */
export const SCHEMA_AREA_SERVED: SchemaPlace[] = [
  { "@type": "AdministrativeArea", name: "Acadiana", containedInPlace: louisiana },
  ...SCHEMA_PARISHES.map((name) => parishPlace(name)),
  ...MAIN_TOWNS.map((name) => cityPlace(name)),
];

export const INDEXABLE_PATHS = [
  "/",
  "/solid-surface",
  "/custom-tile",
  "/gallery",
  "/design",
  "/estimate",
  "/about",
  "/faq",
  "/areas",
  "/privacy",
  "/windows",
] as const;
