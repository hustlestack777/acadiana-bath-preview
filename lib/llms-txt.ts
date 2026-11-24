import { heroQuoteLine, services } from "./copy";
import { warrantyPlainText } from "./warranty";
import { MAIN_TOWNS, OUTSIDE_AREA } from "./coverage";
import { PUBLIC_SITE_ORIGIN, publicCanonical } from "./getpros";
import { townPath, towns } from "./towns";
import { SCHEMA_SERVICE_AREA, SITE_EMAIL, SITE_NAME, SITE_PHONE } from "./site";
import { WINDOW_PRICE_LINE } from "./windows";

export function llmsTxt(): string {
  const page = (path: string, label: string) => `- ${label}: ${publicCanonical(path)}`;
  const townLines = towns.length
    ? towns.map((town) => `- ${town.title}: ${publicCanonical(townPath(town.slug))}`).join("\n")
    : "- Town pages will be published when they are written.";

  return `# ${SITE_NAME}

${SITE_NAME} is a bathroom remodeling company based in Lafayette, Louisiana. ${SCHEMA_SERVICE_AREA}

## Contact
- Phone: ${SITE_PHONE}
- Email: ${SITE_EMAIL}
- Website: ${PUBLIC_SITE_ORIGIN}

## Services
- Bathroom remodels: ${services.join(", ")}
- Solid surface walls and bases in engineered stone, with minimal grout — not plastic, acrylic, fiberglass, or PVC. Includes tub-to-shower conversions (${publicCanonical("/solid-surface")}). ${warrantyPlainText}
- Custom tile showers and bathrooms, including zellige, penny, hexagon, large-format, patterned floors and grout colors you choose, as a secondary option (${publicCanonical("/custom-tile")})
- Walk-in showers in Lafayette (${publicCanonical("/walk-in-shower-lafayette")})
- Window replacement (${publicCanonical("/windows")}). ${WINDOW_PRICE_LINE}

Bathroom remodels: ${heroQuoteLine} Most projects $5,000 to $30,000+.

## Service area
${SCHEMA_SERVICE_AREA}
Towns we serve include: ${MAIN_TOWNS.join(", ")}.
${OUTSIDE_AREA}

## Key pages
${page("/", "Home")}
${page("/solid-surface", "Solid surface walls and bases")}
${page("/walk-in-shower-lafayette", "Walk-in showers in Lafayette")}
${page("/custom-tile", "Custom tile showers and bathrooms")}
${page("/gallery", "Gallery")}
${page("/about", "About")}
${page("/faq", "FAQ")}
${page("/areas", "Areas we serve")}
${page("/privacy", "Privacy Policy")}
${page("/windows", "Windows")}

## Town pages
${townLines}

Marketing partner: Swampfire Growth (a brand of Lagniappe Realm Labs LLC), https://swampfiregrowth.com, which helps run this website and follow up.
`.trimEnd() + "\n";
}
