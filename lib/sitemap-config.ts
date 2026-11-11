import type { MetadataRoute } from "next";
import { INDEXABLE_PATHS, SITE_URL } from "./site";
import { townPath, towns } from "./towns";

export function buildSitemap(indexable: boolean): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const pages: MetadataRoute.Sitemap = INDEXABLE_PATHS.map((path) => ({
    url: path === "/" ? SITE_URL : `${SITE_URL}${path}`,
    lastModified,
    changeFrequency: (path === "/" ? "weekly" : "monthly") as "weekly" | "monthly",
    priority: path === "/" ? 1 : 0.7,
  }));
  // Town pages are listed only when the site is set to go live.
  if (indexable) {
    for (const town of towns) {
      pages.push({
        url: `${SITE_URL}${townPath(town.slug)}`,
        lastModified,
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  }
  return pages;
}
