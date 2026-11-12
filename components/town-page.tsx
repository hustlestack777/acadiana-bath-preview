import { DesignLink } from "@/components/design-link";
import { FaqSection } from "@/components/faq-section";
import { ConsultLink } from "@/components/consult-link";
import { JsonLd } from "@/components/json-ld";
import { LinkedCopy } from "@/components/linked-copy";
import { brand, hero } from "@/lib/copy";
import { OUTSIDE_AREA } from "@/lib/coverage";
import { townAreaJsonLd } from "@/lib/schema";
import { nearbyTowns, townPath, type TownPageContent } from "@/lib/towns";

export function TownPage({ town }: { town: TownPageContent }) {
  const nearby = nearbyTowns(town.slug);
  return (
    <main id="content" tabIndex={-1}>
      <JsonLd data={townAreaJsonLd(town)} />
      <section className="mx-auto w-full max-w-6xl px-5 pb-8 pt-6 md:pb-12 md:pt-12">
        <p className="accent-rule text-xs font-semibold uppercase tracking-[0.22em] text-brass">Service area</p>
        <h1 className="mt-3 max-w-4xl font-heading text-4xl leading-[1.05] md:text-6xl">{town.title}</h1>
        <div className="mt-6 grid max-w-3xl gap-5 text-lg leading-8 text-muted-foreground">
          {town.intro.map((paragraph) => (
            <LinkedCopy key={paragraph.slice(0, 48)} text={paragraph} />
          ))}
          <p>We&apos;ll call you to discuss your project and set a time to take measurements. When your consultant measures, they&apos;ll go over design options with you, and you&apos;ll get your exact price right then.</p>
          <p>
            Part of our South Louisiana service area.{" "}
            <a href="/areas" className="underline underline-offset-4">
              See every town we serve
            </a>
            .
          </p>
          {nearby.length ? (
            <p>
              Nearby:{" "}
              {nearby.map((item, index) => (
                <span key={item.slug}>
                  {index > 0 ? ", " : ""}
                  <a href={townPath(item.slug)} className="underline underline-offset-4">
                    {item.name}
                  </a>
                </span>
              ))}
              .
            </p>
          ) : null}
          <p>{OUTSIDE_AREA}</p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-5 py-10 md:py-14">
        <h2 className="text-3xl md:text-4xl">{town.servicesTitle}</h2>
        <ul className="mt-6 max-w-3xl list-disc space-y-2 ps-6 text-lg leading-8">
          {town.services.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      {town.sections.map((section) => (
        <section key={section.title} className="mx-auto w-full max-w-6xl px-5 py-8 md:py-10">
          <h2 className="text-3xl md:text-4xl">{section.title}</h2>
          <LinkedCopy className="mt-5 max-w-3xl text-lg leading-8 text-muted-foreground" text={section.body} />
        </section>
      ))}

      <section className="mx-auto w-full max-w-6xl px-5 pb-12 pt-4 md:pb-16">
        <LinkedCopy className="max-w-3xl text-lg leading-8" text={town.close} />
        <div className="mt-8 flex flex-wrap gap-3">
          <ConsultLink className="inline-flex h-12 items-center justify-center rounded-full bg-bronze px-6 text-base font-medium text-bronze-foreground hover:bg-bronze-hover">
            {hero.primary}
          </ConsultLink>
          <DesignLink
            className="inline-flex h-12 items-center justify-center rounded-full border border-border bg-card px-6 text-sm font-semibold"
          >
            Design My Bathroom
          </DesignLink>
          <a
            href={brand.phoneHref}
            className="inline-flex h-12 items-center justify-center rounded-full border border-border bg-card px-6 text-sm font-semibold"
          >
            {brand.phone}
          </a>
        </div>
      </section>

      {town.faqs.length ? <FaqSection faqs={town.faqs} /> : null}
    </main>
  );
}
