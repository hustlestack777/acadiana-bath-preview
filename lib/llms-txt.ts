import { heroQuoteLine, services, solidPath } from "./copy";
import { MAIN_TOWNS, OUTSIDE_AREA } from "./coverage";
import { townPath, towns } from "./towns";
import { SCHEMA_SERVICE_AREA, SITE_EMAIL, SITE_NAME, SITE_PHONE, SITE_URL } from "./site";

export function llmsTxt(): string {
  const page = (path: string, label: string) => `- ${label}: ${SITE_URL}${path}`;
  const townLines = towns.length
    ? towns.map((town) => `- ${town.title}: ${SITE_URL}${townPath(town.slug)}`).join("\n")
    : "- Town pages will be published when they are written.";

  return `# ${SITE_NAME}

${SITE_NAME} is a bathroom remodeling company based in Lafayette, Louisiana. ${SCHEMA_SERVICE_AREA}

## Contact
- Phone: ${SITE_PHONE}
- Email: ${SITE_EMAIL}
- Website: ${SITE_URL}

## Services
- ${services.join(", ")}
- Solid surface showers and tub walls, including tub-to-shower conversions (${SITE_URL}/solid-surface). ${solidPath.warranty}
- Custom tile showers and bathrooms, including zellige, patterned floors and grout colors you choose (${SITE_URL}/custom-tile)
- Bathroom design previews from your own photos (${SITE_URL}/design)
- Free Consult (${SITE_URL}/estimate)

${heroQuoteLine} Most projects $5K–$30K+. Your free consult gets you an exact number.

## Service area
${SCHEMA_SERVICE_AREA}
Towns we serve include: ${MAIN_TOWNS.join(", ")}.
${OUTSIDE_AREA}

## Key pages
${page("/", "Home")}
${page("/solid-surface", "Solid surface showers and tub walls")}
${page("/custom-tile", "Custom tile showers and bathrooms")}
${page("/gallery", "Gallery")}
${page("/design", "Design My Bathroom")}
${page("/estimate", "Free Consult")}
${page("/faq", "FAQ")}
${page("/privacy", "Privacy Policy")}

## Town pages
${townLines}

Marketing partner: Lagniappe Realm Labs LLC, which helps run this website and follow up.
`.trimEnd() + "\n";
}
