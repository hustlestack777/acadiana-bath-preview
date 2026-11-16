import { headers } from "next/headers";
import { preload } from "react-dom";
import { GetProsHub } from "@/components/getpros-hub";
import { HomePage } from "@/components/home-page";
import { SiteShell } from "@/components/site-shell";
import type { Metadata } from "next";
import { isGetProsRequest } from "@/lib/getpros";
import { FIRST_HERO_PRELOAD } from "@/lib/hero-slides";
import { metadataTitle, pageMeta } from "@/lib/page-meta";
import { pageCanonical } from "@/lib/site";

const homeMeta = pageMeta("/");

export const metadata: Metadata = {
  title: metadataTitle(homeMeta),
  description: homeMeta.description,
  alternates: { canonical: pageCanonical("/") },
};

export default async function Page() {
  if (isGetProsRequest(await headers())) {
    return (
      <SiteShell>
        <GetProsHub />
      </SiteShell>
    );
  }
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
