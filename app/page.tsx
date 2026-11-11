import { preload } from "react-dom";
import { HomePage } from "@/components/home-page";
import { SiteShell } from "@/components/site-shell";
import type { Metadata } from "next";
import { FIRST_HERO_PRELOAD } from "@/lib/hero-slides";
import { pageCanonical } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: pageCanonical("/") },
};

export default function Page() {
  // Put the first hero still in the document head so it starts before body images.
  preload(FIRST_HERO_PRELOAD.href, {
    as: "image",
    type: FIRST_HERO_PRELOAD.type,
    imageSrcSet: FIRST_HERO_PRELOAD.srcSet,
    imageSizes: "100vw",
    fetchPriority: "high",
  });
  return (
    <SiteShell sticky bleed>
      <HomePage />
    </SiteShell>
  );
}
