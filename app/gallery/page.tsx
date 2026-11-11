import type { Metadata } from "next";
import { DesignLink } from "@/components/design-link";
import { PhotoGallery } from "@/components/photo-gallery";
import { SiteShell } from "@/components/site-shell";
import { ConsultLink } from "@/components/consult-link";
import { gallery, hero, heroDesignCta } from "@/lib/copy";
import { galleryPagePhotos } from "@/lib/images";
import { pageCanonical } from "@/lib/site";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Bathroom remodel looks we can build across Acadiana and South Louisiana, from custom tile to solid surface. Free quote. See your new bathroom with Design My Bathroom.",
  alternates: { canonical: pageCanonical("/gallery") },
};

export default function GalleryPage() {
  return (
    <SiteShell sticky>
      <main id="content" tabIndex={-1}>
        <section className="mx-auto w-full max-w-6xl px-5 pb-8 pt-6 md:pt-12">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brass">{gallery.eyebrow}</p>
          <h1 className="mt-3 max-w-4xl font-heading text-4xl leading-[1.05] md:text-6xl">{gallery.title}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
            Custom tile, stone, and solid surface looks to start from. Pick a direction, then get a free quote.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <ConsultLink className="inline-flex h-12 items-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground">
              {hero.primary}
            </ConsultLink>
            <DesignLink
              className="inline-flex h-12 items-center rounded-full border border-border bg-card px-6 text-sm font-semibold"
            >
              {heroDesignCta} →
            </DesignLink>
          </div>
          <PhotoGallery photos={galleryPagePhotos} />
        </section>
      </main>
    </SiteShell>
  );
}
