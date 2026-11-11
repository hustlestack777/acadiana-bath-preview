import { ConsultLink } from "@/components/consult-link";
import { DesignLink } from "@/components/design-link";
import { brand, hero, heroDesignCta } from "@/lib/copy";
import { MAIN_TOWNS, OUTSIDE_AREA, SERVICE_AREA } from "@/lib/coverage";
import { townPath, towns } from "@/lib/towns";

export function AreasPage() {
  return (
    <main id="content" tabIndex={-1}>
      <section className="mx-auto w-full max-w-6xl px-5 pb-8 pt-6 md:pb-12 md:pt-12">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brass">Service area</p>
        <h1 className="mt-3 max-w-4xl font-heading text-4xl leading-[1.05] md:text-6xl">Areas we serve</h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">{SERVICE_AREA}</p>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-muted-foreground">{OUTSIDE_AREA}</p>
      </section>
      <section className="mx-auto w-full max-w-6xl px-5 pb-16">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brass">Towns we serve include</p>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {MAIN_TOWNS.map((name) => {
            const page = towns.find((town) => town.name === name);
            return (
              <li key={name}>
                {page ? (
                  <a href={townPath(page.slug)} className="text-lg underline-offset-4 hover:underline">
                    {name}
                  </a>
                ) : (
                  <span className="text-lg">{name}</span>
                )}
              </li>
            );
          })}
        </ul>
        <div className="mt-10 flex flex-wrap gap-3">
          <ConsultLink className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-6 text-base font-medium text-primary-foreground">
            {hero.primary}
          </ConsultLink>
          <DesignLink className="inline-flex h-12 items-center justify-center rounded-full border border-border bg-card px-6 text-sm font-semibold">
            {heroDesignCta}
          </DesignLink>
          <a
            href={brand.phoneHref}
            className="inline-flex h-12 items-center justify-center rounded-full border border-border bg-card px-6 text-sm font-semibold"
          >
            {brand.phone}
          </a>
        </div>
      </section>
    </main>
  );
}
