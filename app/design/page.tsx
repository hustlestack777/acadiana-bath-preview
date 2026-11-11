import type { Metadata } from "next";
import { SiteShell } from "@/components/site-shell";
import { DesignTool } from "@/components/design/design-tool";
import { designCopy } from "@/lib/design-styles";
import { pageCanonical, siteRobots } from "@/lib/site";

export const metadata: Metadata = {
  title: "Design My Bathroom",
  description: "Snap your shower, pick a look, and see your new bathroom in your own space before you spend a dime. Free consult across Acadiana and South Louisiana.",
  robots: siteRobots,

  alternates: { canonical: pageCanonical("/design") },
};

export default async function DesignPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const style = typeof params.style === "string" ? params.style : "";
  return (
    <SiteShell>
      <main id="content" tabIndex={-1}>
        <section className="mx-auto w-full max-w-3xl px-5 pb-8 pt-6 md:pt-12">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-muted-foreground">{designCopy.cta}</p>
          <h1 className="mt-3 font-heading text-[clamp(2.4rem,7vw,4.2rem)] leading-[0.98]">{designCopy.headline}</h1>
          <p className="mt-4 text-lg leading-8 text-muted-foreground">{designCopy.sub}</p>
        </section>
        <DesignTool initialStyle={style} />
      </main>
    </SiteShell>
  );
}
