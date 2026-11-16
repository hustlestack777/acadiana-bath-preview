import { brand, heroQuoteLine, siteDescription, walkInPage } from "./copy";
import { SERVICE_AREA } from "./coverage";
import { faqPageIntro, faqPageTitle } from "./faq-page";
import { SERVICE_AREA_WINDOWS, WINDOW_PRICE_LINE } from "./windows";

/** Matches the title template in app/layout.tsx. */
export const TITLE_TEMPLATE_SUFFIX = " · Acadiana Bathrooms and Countertops";

export type PublicPageMeta = {
  path: string;
  title: string;
  description: string;
  /** Skip the layout title template. Home and the walk-in page already include the brand. */
  absolute?: boolean;
};

export const PUBLIC_PAGES: readonly PublicPageMeta[] = [
  {
    path: "/",
    title: "Acadiana Bathrooms and Countertops",
    absolute: true,
    description: siteDescription,
  },
  {
    path: "/solid-surface",
    title: "Solid surface walls and bases",
    description:
      "Solid surface walls and bases in engineered stone, with minimal grout — not plastic, acrylic, fiberglass, or PVC. Tub-to-shower conversions across Acadiana and South Louisiana. Free quote. See your new bathroom with Design My Bathroom.",
  },
  {
    path: "/walk-in-shower-lafayette",
    title: walkInPage.documentTitle,
    absolute: true,
    description: walkInPage.description,
  },
  {
    path: "/custom-tile",
    title: "Custom tile showers and bathrooms",
    description:
      "Custom tile showers and bathrooms across Acadiana and South Louisiana: zellige, patterned floors and grout colors you choose. Free quote. See your new bathroom with Design My Bathroom.",
  },
  {
    path: "/gallery",
    title: "Gallery",
    description:
      "Bathroom remodel looks we can build across Acadiana and South Louisiana, from custom tile to solid surface. Free quote. See your new bathroom with Design My Bathroom.",
  },
  {
    path: "/design",
    title: "Design My Bathroom",
    description:
      "Pick a look, snap your shower, and see your new bathroom in your own space before you spend a dime. Free quote across Acadiana and South Louisiana.",
  },
  {
    path: "/estimate",
    title: "Free Quote",
    description:
      "Get a free quote from Acadiana Bathrooms and Countertops. Tell us about your project and the best time to reach you. We'll call you to discuss your project and set a time to take measurements. When your consultant measures, they'll go over design options with you, and you'll get your exact price right then.",
  },
  {
    path: "/about",
    title: "About",
    description: `${brand.name} is a bathroom remodeling company based in Lafayette, Louisiana. Our main draw is solid surface walls and bases in engineered stone, with minimal grout — not plastic, acrylic, fiberglass, or PVC. ${heroQuoteLine}`,
  },
  {
    path: "/faq",
    title: faqPageTitle,
    description: faqPageIntro,
  },
  {
    path: "/areas",
    title: "Areas we serve",
    description: `Bathroom remodels from Acadiana Bathrooms and Countertops. ${SERVICE_AREA}`,
  },
  {
    path: "/privacy",
    title: "Privacy Policy",
    description: "How Acadiana Bathrooms and Countertops handles the information you share when you ask for a quote.",
  },
  {
    path: "/windows",
    title: "Window estimate",
    description: `${WINDOW_PRICE_LINE} We'll call to discuss your windows, then set a time to take measurements for the real quote. ${SERVICE_AREA_WINDOWS}`,
  },
];

export function pageMeta(path: string): PublicPageMeta {
  const found = PUBLIC_PAGES.find((page) => page.path === path);
  if (!found) throw new Error(`No metadata for ${path}`);
  return found;
}

export function metadataTitle(page: PublicPageMeta): string | { absolute: string } {
  return page.absolute ? { absolute: page.title } : page.title;
}

export function resolvedDocumentTitle(page: Pick<PublicPageMeta, "title" | "absolute">) {
  return page.absolute ? page.title : `${page.title}${TITLE_TEMPLATE_SUFFIX}`;
}

export function townDocumentTitle(title: string) {
  return `${title} | Acadiana Bathrooms`;
}
