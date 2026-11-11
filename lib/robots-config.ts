import type { MetadataRoute } from "next";
import {
  AI_SEARCH_USER_AGENTS,
  ROBOTS_DISALLOW_WHEN_LIVE,
  SITE_URL,
} from "./site";

export function buildRobots(indexable: boolean): MetadataRoute.Robots {
  if (!indexable) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
    };
  }

  const disallow = [...ROBOTS_DISALLOW_WHEN_LIVE];
  return {
    rules: [
      ...AI_SEARCH_USER_AGENTS.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow,
      })),
      {
        userAgent: "*",
        allow: "/",
        disallow,
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
