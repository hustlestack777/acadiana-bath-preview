import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/site-shell";
import { TownPage } from "@/components/town-page";
import { brand } from "@/lib/copy";
import { getTown, towns } from "@/lib/towns";

export const dynamicParams = false;

export function generateStaticParams() {
  return towns.map((town) => ({ slug: town.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const town = getTown((await params).slug);
  if (!town) return {};
  return {
    title: `Bathroom remodels in ${town.name}`,
    description:
      town.description ??
      `Custom showers, tile and bathroom remodels in ${town.name}, Louisiana. Free Consult. Call ${brand.phone}.`,
  };
}

export default async function AreaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const town = getTown((await params).slug);
  if (!town) notFound();
  return (
    <SiteShell>
      <TownPage town={town} />
    </SiteShell>
  );
}
