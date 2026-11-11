/**
 * Town / service-area pages. Boogie adds entries here; the /areas/[slug]
 * route, sitemap and llms.txt pick them up automatically.
 * Leave the list empty until the copy is written — do not publish empty pages.
 */

export type TownFaq = { q: string; a: string };

export type TownPageContent = {
  slug: string;
  name: string;
  /** Plain intro shown on the page. Must follow site content rules. */
  intro: string;
  /** Optional meta description. Falls back to a short consult line. */
  description?: string;
  /** Optional visible FAQ. FAQPage schema is added only when this is present. */
  faqs?: readonly TownFaq[];
};

export const towns: TownPageContent[] = [];

export function getTown(slug: string): TownPageContent | undefined {
  return towns.find((town) => town.slug === slug);
}
