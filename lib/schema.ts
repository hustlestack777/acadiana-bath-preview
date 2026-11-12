/**
 * JSON-LD builders. No aggregateRating, reviews, street address, prices,
 * licenses, timelines or brand names that the site must not publish.
 */

import { faqs as homeFaqs, solidPath, tilePath } from "./copy";
import { warrantyPlainText } from "./warranty";
import { OUTSIDE_AREA } from "./coverage";
import {
  SCHEMA_AREA_SERVED,
  SCHEMA_PRICE_RANGE,
  SCHEMA_SERVICE_AREA,
  SITE_EMAIL,
  SITE_LOGO_URL,
  SITE_NAME,
  SITE_PHONE,
  SITE_SHORT_NAME,
  SITE_TELEPHONE,
  SITE_SAME_AS,
  SITE_URL,
  VISIBLE_SERVICES,
  cityPlace,
} from "./site";
import { townPath, type TownPageContent } from "./towns";

export type FaqItem = { q: string; a: string; link?: { text: string; href: string } };

export const BUSINESS_ID = `${SITE_URL}/#business`;

export function businessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    "@id": BUSINESS_ID,
    name: SITE_NAME,
    alternateName: SITE_SHORT_NAME,
    url: SITE_URL,
    telephone: SITE_TELEPHONE,
    email: SITE_EMAIL,
    logo: SITE_LOGO_URL,
    image: SITE_LOGO_URL,
    description: `Bathroom remodels from ${SITE_NAME}. ${SCHEMA_SERVICE_AREA} ${OUTSIDE_AREA} See your new bathroom free: Design My Bathroom.`,
    areaServed: SCHEMA_AREA_SERVED,
    priceRange: SCHEMA_PRICE_RANGE,
    sameAs: [...SITE_SAME_AS],
    // No address: there is no public storefront yet (a Broussard warehouse is pending).
    // TODO: add the confirmed public address and hours when ready.
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Bathroom remodeling services",
      itemListElement: VISIBLE_SERVICES.map((service) => ({
        "@type": "Service",
        name: service.name,
        serviceType: service.serviceType,
        url: service.url,
        areaServed: SCHEMA_AREA_SERVED,
      })),
    },
  };
}

export function townAreaJsonLd(town: TownPageContent) {
  const places = [cityPlace(town.name), ...(town.alsoServes ?? []).map((name) => cityPlace(name))];
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: town.title,
    url: `${SITE_URL}${townPath(town.slug)}`,
    description: `${town.intro[0]} ${OUTSIDE_AREA}`,
    about: { "@id": BUSINESS_ID },
    areaServed: places,
    // Area served only. Do not add a local street address or branch office.
  };
}

export function serviceJsonLd(input: {
  name: string;
  description: string;
  url: string;
  serviceType: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: input.name,
    serviceType: input.serviceType,
    description: input.description,
    url: input.url,
    provider: {
      "@id": BUSINESS_ID,
      "@type": "HomeAndConstructionBusiness",
      name: SITE_NAME,
      telephone: SITE_TELEPHONE,
      url: SITE_URL,
    },
    areaServed: SCHEMA_AREA_SERVED,
  };
}

export const solidSurfaceServiceJsonLd = () =>
  serviceJsonLd({
    name: "Solid surface showers and tub walls",
    serviceType: "Solid surface bathroom remodeling",
    description: `${solidPath.support} ${warrantyPlainText}`,
    url: `${SITE_URL}/solid-surface`,
  });

export const customTileServiceJsonLd = () =>
  serviceJsonLd({
    name: "Custom tile showers and bathrooms",
    serviceType: "Custom tile bathroom remodeling",
    description: tilePath.support,
    url: `${SITE_URL}/custom-tile`,
  });

export function faqPageJsonLd(faqs: readonly FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };
}

export const homeFaqPageJsonLd = () => faqPageJsonLd(homeFaqs);

const BANNED_SCHEMA_KEYS = new Set(["aggregateRating", "review", "reviews", "streetAddress"]);

export function assertSafeJsonLd(value: unknown, path = "$"): string[] {
  const problems: string[] = [];
  if (Array.isArray(value)) {
    value.forEach((item, index) => problems.push(...assertSafeJsonLd(item, `${path}[${index}]`)));
    return problems;
  }
  if (value && typeof value === "object") {
    for (const [key, child] of Object.entries(value)) {
      if (BANNED_SCHEMA_KEYS.has(key)) problems.push(`${path}.${key}`);
      problems.push(...assertSafeJsonLd(child, `${path}.${key}`));
    }
  }
  return problems;
}
