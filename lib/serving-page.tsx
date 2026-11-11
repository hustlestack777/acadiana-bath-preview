import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/site-shell";
import { TownPage } from "@/components/town-page";
import { pageCanonical } from "@/lib/site";
import { getTown } from "@/lib/towns";

export function townMetadata(slug: string): Metadata {
  const town = getTown(slug);
  if (!town) return {};
  return {
    title: { absolute: `${town.title} | Acadiana Bathrooms` },
    description: town.description,
    alternates: { canonical: pageCanonical(`/serving-${slug}`) },
  };
}

export function ServingTownPage({ slug }: { slug: string }) {
  const town = getTown(slug);
  if (!town) notFound();
  return (
    <SiteShell sticky>
      <TownPage town={town} />
    </SiteShell>
  );
}
