import type { MetadataRoute } from "next";
import { INDEXABLE_PATHS, SITE_URL } from "@/lib/site";
import { towns } from "@/lib/towns";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    ...INDEXABLE_PATHS.map((path) => ({
      url: path === "/" ? SITE_URL : `${SITE_URL}${path}`,
      changeFrequency: (path === "/" ? "weekly" : "monthly") as "weekly" | "monthly",
      priority: path === "/" ? 1 : 0.7,
    })),
    ...towns.map((town) => ({
      url: `${SITE_URL}/areas/${town.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ] satisfies MetadataRoute.Sitemap;

  return pages;
}
