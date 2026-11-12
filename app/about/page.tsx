import type { Metadata } from "next";
import { ConsultLink } from "@/components/consult-link";
import { DesignLink } from "@/components/design-link";
import { SiteShell } from "@/components/site-shell";
import { CHAT_AGENT_NAME } from "@/lib/chat";
import { brand, heroDesignCta, heroQuoteLine, quoteCta } from "@/lib/copy";
import { OUTSIDE_AREA, SERVICE_AREA } from "@/lib/coverage";
import { pageCanonical } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: `${brand.name} is a bathroom remodeling company based in Lafayette, Louisiana. Custom showers, tile, quartz, quartzite and marble, planned carefully for your space. ${heroQuoteLine}`,

  alternates: { canonical: pageCanonical("/about") },
};

export default function AboutPage() {
  return (
    <SiteShell sticky>
      <main id="content" tabIndex={-1} className="mx-auto w-full max-w-3xl px-5 py-12 md:py-16">
        <p className="accent-rule text-xs font-semibold uppercase tracking-[0.22em] text-brass">About</p>
        <h1 className="mt-3 font-heading text-4xl leading-[1.05] md:text-6xl">{brand.name}</h1>

        <div className="mt-10 grid gap-8 text-lg leading-8 [&_h2]:text-3xl">
          <section>
            <h2>Who we are</h2>
            <p className="mt-3">
              {brand.name} is a bathroom remodeling company based in Lafayette, Louisiana. {CHAT_AGENT_NAME}, our
              design consultant, can help you on the site.
            </p>
          </section>

          <section>
            <h2>What we do</h2>
            <p className="mt-3">
              Custom showers, tile, quartz, quartzite and marble, planned carefully for your space. That includes
              showers, tubs, lavatories, flooring, toilets, wallpaper, and window replacement. We plan every detail
              with you and manage your project from design to the finished bathroom. {heroQuoteLine}
            </p>
          </section>

          <section>
            <h2>Where we work</h2>
            <p className="mt-3">
              {SERVICE_AREA} {OUTSIDE_AREA}
            </p>
          </section>

          <section>
            <h2>Get a quote</h2>
            <p className="mt-3">
              Tell us about your project. We&apos;ll call to discuss your project, your style and what you have in
              mind.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <ConsultLink className="inline-flex h-12 items-center justify-center rounded-full bg-bronze px-5 text-center text-sm font-semibold text-bronze-foreground hover:bg-bronze-hover">
                {quoteCta}
              </ConsultLink>
              <DesignLink className="inline-flex h-12 items-center justify-center rounded-full border border-border bg-card px-5 text-center text-sm font-semibold">
                {heroDesignCta}
              </DesignLink>
            </div>
            <a href={brand.phoneHref} className="mt-4 inline-block text-sm font-semibold tracking-wide">
              {brand.phone}
            </a>
          </section>
        </div>
      </main>
    </SiteShell>
  );
}
