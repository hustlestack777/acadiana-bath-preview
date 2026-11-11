import type { MetadataRoute } from "next";
import { buildRobots } from "@/lib/robots-config";
import { SITE_INDEXABLE } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return buildRobots(SITE_INDEXABLE);
}
