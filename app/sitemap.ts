import type { MetadataRoute } from "next";
import { buildSitemap } from "@/lib/sitemap-config";
import { SITE_INDEXABLE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return buildSitemap(SITE_INDEXABLE);
}
