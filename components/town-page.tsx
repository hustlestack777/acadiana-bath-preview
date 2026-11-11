import Link from "next/link";
import { FaqSection } from "@/components/faq-section";
import { ConsultLink } from "@/components/consult-link";
import { brand, cardClaims, hero } from "@/lib/copy";
import type { TownPageContent } from "@/lib/towns";

/**
 * Template for town / service-area pages. Boogie supplies the intro and optional
 * FAQs through lib/towns.ts; this file does not invent local copy.
 */
export function TownPage({ town }: { town: TownPageContent }) {
  return (
    <main id="content" tabIndex={-1}>
      <section className="mx-auto w-full max-w-6xl px-5 pb-12 pt-6 md:pb-16 md:pt-12">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brass">Service area</p>
        <h1 className="mt-3 max-w-4xl font-heading text-4xl leading-[1.05] md:text-6xl">
          Bathroom remodels in {town.name}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">{town.intro}</p>
        <p className="mt-6 text-sm">
          Rather talk?{" "}
          <a className="font-medium underline underline-offset-4" href={brand.phoneHref}>
            {brand.phone}
          </a>
          {" · "}
          <a className="underline underline-offset-4" href={brand.emailHref}>
            {brand.email}
          </a>
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <ConsultLink className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-6 text-base font-medium text-primary-foreground">
            {hero.primary}
          </ConsultLink>
          <Link
            href="/solid-surface"
            className="inline-flex h-12 items-center justify-center rounded-full border border-border bg-card px-6 text-sm font-semibold"
          >
            Solid surface path →
          </Link>
          <Link
            href="/custom-tile"
            className="inline-flex h-12 items-center justify-center rounded-full border border-border bg-card px-6 text-sm font-semibold"
          >
            Custom tile path →
          </Link>
        </div>
        <p className="mt-4 text-sm font-semibold">{cardClaims.consult}</p>
      </section>
      {town.faqs?.length ? <FaqSection faqs={town.faqs} /> : null}
    </main>
  );
}
