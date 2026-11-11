import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/site-shell";
import { TownPage } from "@/components/town-page";
import { getTown } from "@/lib/towns";

export function townMetadata(slug: string): Metadata {
  const town = getTown(slug);
  if (!town) return {};
  return {
    title: { absolute: town.description },
    description: town.intro[0],
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
