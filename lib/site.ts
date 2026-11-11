/**
 * Canonical business facts for header, footer, schema, robots and llms.txt.
 * Keep name and phone identical everywhere they appear.
 *
 * TODO(Justin): add a public business address only after Justin confirms a storefront.
 * Until then, schema stays area-only (no address). A Broussard warehouse is pending.
 * TODO(Justin): add the Google Business Profile URL (schema sameAs) after verification.
 * TODO(Justin): add opening hours when Justin confirms them.
 */

import { brand } from "./copy";
import { MAIN_TOWNS } from "./coverage";

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

/** schema.org priceRange. Public copy leads with Starting at $5K; JSON-LD stays in dollars. */
export const SCHEMA_PRICE_RANGE = "$5,000+";

export const VISIBLE_SERVICES = [
  { name: "Custom showers", serviceType: "Custom walk-in showers", url: SITE_URL },
  { name: "Custom tile", serviceType: "Custom tile bathroom remodeling", url: `${SITE_URL}/custom-tile` },
  { name: "Quartz and quartzite countertops", serviceType: "Quartz and quartzite bathroom countertops", url: SITE_URL },
  { name: "Solid surface showers and tub walls", serviceType: "Solid surface bathroom remodeling", url: `${SITE_URL}/solid-surface` },
] as const;

/** Exact service-area sentence for schema descriptions and llms.txt. Do not use in visible marketing copy. */
export const SCHEMA_SERVICE_AREA =
  "Serving Acadiana and South Louisiana, from Lake Charles to Baton Rouge, including Prairieville and Gonzales, and from Alexandria down to Houma and Thibodaux.";

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
const calcasieu: SchemaPlace = {
  "@type": "AdministrativeArea",
  name: "Calcasieu Parish",
  containedInPlace: louisiana,
};

function city(name: string, containedInPlace: SchemaPlace = louisiana): SchemaPlace {
  return { "@type": "City", name, containedInPlace };
}

/** City node for schema areaServed. Lake Charles-area towns stay in Calcasieu Parish. */
export function cityPlace(name: string): SchemaPlace {
  if (name === "Lake Charles" || name === "Sulphur" || name === "Moss Bluff") {
    return city(name, calcasieu);
  }
  return city(name);
}

/**
 * areaServed for schema: Lafayette/Acadiana core, the I-10 corridor from
 * Calcasieu Parish (Lake Charles) east to Baton Rouge, plus Prairieville,
 * Gonzales, Alexandria, Houma and Thibodaux, then other towns already shown
 * on the home page. Do not add North Shore, New Orleans, DeRidder/Beauregard,
 * or western areas north of I-10.
 */
export const SCHEMA_AREA_SERVED: SchemaPlace[] = [
  city("Lafayette"),
  { "@type": "AdministrativeArea", name: "Acadiana", containedInPlace: louisiana },
  city("Lake Charles", calcasieu),
  city("Alexandria"),
  city("Baton Rouge"),
  city("Prairieville"),
  city("Gonzales"),
  city("Houma"),
  city("Thibodaux"),
  ...MAIN_TOWNS.filter(
    (name) =>
      ![
        "Lafayette",
        "Lake Charles",
        "Alexandria",
        "Baton Rouge",
        "Prairieville",
        "Gonzales",
        "Houma",
        "Thibodaux",
      ].includes(name),
  ).map((name) => city(name)),
];

export const INDEXABLE_PATHS = [
  "/",
  "/solid-surface",
  "/custom-tile",
  "/gallery",
  "/design",
  "/estimate",
  "/faq",
  "/privacy",
  "/windows",
] as const;
