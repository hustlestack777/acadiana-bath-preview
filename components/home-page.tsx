import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { GalleryArt, ShowerStudy } from "@/components/illustrations";
import {
  area,
  brand,
  care,
  close,
  faqs,
  gallery,
  hero,
  material,
  reasons,
  steps,
  talk,
  warranty,
} from "@/lib/copy";
import { ALSO_PLANNED, CORRIDOR, EXCLUDED } from "@/lib/coverage";
import { cn } from "cn";

const tints = ["bg-tint-clay", "bg-tint-lagoon", "bg-tint-brass"] as const;

export function HomePage() {
  return (
    <main id="content" tabIndex={-1}>
      <section className="bg-hero text-hero-foreground">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-5 py-14 md:grid-cols-12 md:py-20">
          <div className="md:col-span-7">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brass-soft">{hero.eyebrow}</p>
            <h1 className="mt-4 max-w-xl text-4xl leading-[1.05] sm:text-5xl md:text-6xl" data-testid="hero-title">
              {hero.title}
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-hero-muted">{hero.support}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/estimate"
                className={cn(buttonVariants({ variant: "default" }), "h-12 rounded-xl px-5 text-base")}
              >
                {hero.primary}
              </Link>
              <a
                href="#talk"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "h-12 rounded-xl border-hero-foreground/40 bg-transparent px-5 text-base text-hero-foreground hover:bg-hero-foreground/10 hover:text-hero-foreground",
                )}
              >
                {hero.secondary}
              </a>
            </div>
          </div>
          <div className="md:col-span-5">
            <ShowerStudy />
          </div>
        </div>
      </section>

      <section className="mx-auto -mt-6 w-full max-w-6xl px-5" aria-label="Why these showers">
        <div className="grid gap-3 md:grid-cols-3">
          {reasons.map((reason, index) => (
            <article key={reason.title} className={cn("rounded-2xl border border-border p-5", tints[index])}>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brass">0{index + 1}</p>
              <h2 className="mt-2 text-2xl">{reason.title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{reason.body}</p>
            </article>
          ))}
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Color blocks on this site are the website palette, not an Onyx color chart.
        </p>
      </section>

      <section id="surface" className="scroll-mt-40 mx-auto grid w-full max-w-6xl gap-8 px-5 py-16 md:grid-cols-12 md:py-24">
        <div className="md:col-span-7">
          <p className="text-sm font-semibold text-brass">The surface</p>
          <h2 className="mt-2 text-3xl md:text-4xl">{material.title}</h2>
          <p className="mt-4 text-lg leading-8">{material.body}</p>
          <p className="mt-4 leading-7 text-muted-foreground">{material.close}</p>
        </div>
        <div className="grid content-start gap-3 md:col-span-5">
          <p className="rounded-2xl bg-tint-lagoon p-5 leading-7">
            63% alumina trihydrate, a mineral-derived ingredient, and 37% specially formulated polyester resin.
          </p>
          <p className="rounded-2xl bg-tint-clay p-5 leading-7">
            It is a cast bathroom material. It is not a slab of quarried natural onyx.
          </p>
        </div>
      </section>

      <section id="care" className="scroll-mt-40 bg-sage-wash">
        <div className="mx-auto w-full max-w-6xl px-5 py-16 md:py-24">
          <p className="text-sm font-semibold text-sage">Care</p>
          <h2 className="mt-2 max-w-2xl text-3xl md:text-4xl">{care.title}</h2>
          <p className="mt-4 max-w-2xl text-lg leading-8">{care.body}</p>
        </div>
      </section>

      <section id="warranty" className="scroll-mt-40 bg-fig text-fig-foreground">
        <div className="mx-auto grid w-full max-w-6xl gap-8 px-5 py-16 md:grid-cols-12 md:py-24">
          <div className="md:col-span-7">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-fig-muted">Manufacturer product warranty</p>
            <h2 className="mt-2 text-3xl md:text-4xl">{warranty.title}</h2>
            <p className="mt-4 text-lg leading-8">{warranty.body}</p>
          </div>
          <aside className="rounded-2xl bg-fig-foreground p-6 text-foreground md:col-span-5">
            <h3 className="text-2xl">{warranty.asideTitle}</h3>
            <p className="mt-3 leading-7">{warranty.aside}</p>
          </aside>
        </div>
      </section>

      <section id="process" className="scroll-mt-40 mx-auto w-full max-w-6xl px-5 py-16 md:py-24">
        <p className="text-sm font-semibold text-brass">How it works</p>
        <h2 className="mt-2 text-3xl md:text-4xl">Three steps, then a confirmed proposal</h2>
        <ol className="mt-8 grid gap-4 md:grid-cols-3">
          {steps.map((step, index) => (
            <li key={step.title} className="rounded-2xl border border-border bg-card p-5">
              <span
                className={cn(
                  "inline-flex size-11 items-center justify-center rounded-full font-heading text-lg",
                  index === 0 && "bg-primary text-primary-foreground",
                  index === 1 && "bg-secondary text-secondary-foreground",
                  index === 2 && "bg-fig text-fig-foreground",
                )}
              >
                {index + 1}
              </span>
              <h3 className="mt-4 text-2xl">{step.title}</h3>
              <p className="mt-2 leading-7 text-muted-foreground">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section id="area" className="scroll-mt-40 bg-hero text-hero-foreground">
        <div className="mx-auto w-full max-w-6xl px-5 py-16 md:py-24">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brass-soft">Service area</p>
          <h2 className="mt-2 max-w-2xl text-3xl md:text-4xl">{area.title}</h2>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-hero-muted">{area.intro}</p>
          <p className="mt-8 text-sm font-semibold uppercase tracking-[0.14em] text-brass-soft">{area.corridorLabel}</p>
          <ol className="mt-4 space-y-3 border-l border-hero-muted/40 ps-5 md:flex md:flex-wrap md:items-center md:gap-x-3 md:space-y-0 md:border-0 md:ps-0">
            {CORRIDOR.map((town, index) => (
              <li key={town} className="flex items-center gap-2 text-base">
                <span className="size-2.5 rounded-full bg-swatch-brass" aria-hidden="true" />
                <span>{town}</span>
                {index === CORRIDOR.length - 1 ? (
                  <span className="rounded-full bg-brass-soft px-2 py-0.5 text-xs font-semibold text-foreground">
                    Stops here
                  </span>
                ) : null}
              </li>
            ))}
          </ol>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-hero-muted">{area.stop}</p>
          <p className="mt-8 text-sm font-semibold uppercase tracking-[0.14em] text-brass-soft">{area.alsoLabel}</p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {ALSO_PLANNED.map((town) => (
              <li key={town} className="rounded-full border border-hero-muted/40 px-3 py-1.5 text-sm">
                {town}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-hero-muted">Not included: {EXCLUDED.join(" and ")}.</p>
        </div>
      </section>

      <section id="gallery" className="scroll-mt-40 mx-auto w-full max-w-6xl px-5 py-16 md:py-24">
        <p className="text-sm font-semibold text-brass">Gallery</p>
        <h2 className="mt-2 text-3xl md:text-4xl">{gallery.title}</h2>
        <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">{gallery.body}</p>
        <ul className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3">
          {gallery.frames.map((label, index) => (
            <li key={label}>
              <figure className="overflow-hidden rounded-2xl border border-border bg-card">
                <div className="relative aspect-[4/5]">
                  <GalleryArt index={index} />
                  <span className="absolute left-3 top-3 rounded-full bg-card px-2 py-1 text-xs font-semibold">
                    Placeholder
                  </span>
                </div>
                <figcaption className="px-3 py-2 text-sm">{label}</figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </section>

      <section id="questions" className="scroll-mt-40 bg-brass-soft">
        <div className="mx-auto w-full max-w-6xl px-5 py-16 md:py-24">
          <h2 className="text-3xl md:text-4xl">Questions</h2>
          <div className="mt-6 divide-y divide-foreground/15">
            {faqs.map((item) => (
              <details key={item.q} className="group py-1">
                <summary className="flex min-h-12 cursor-pointer items-center justify-between gap-4 py-3 text-lg font-medium">
                  {item.q}
                  <span className="text-2xl leading-none group-open:rotate-45" aria-hidden="true">
                    +
                  </span>
                </summary>
                <p className="max-w-3xl pb-4 leading-7">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section id="talk" className="scroll-mt-40 mx-auto grid w-full max-w-6xl gap-6 px-5 py-16 md:grid-cols-2 md:py-24">
        <div>
          <h2 className="text-3xl md:text-4xl">{talk.title}</h2>
          <p className="mt-4 leading-7 text-muted-foreground">{talk.body}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-brass">Placeholders</p>
          <p className="mt-3 font-heading text-3xl">{brand.phone}</p>
          <p className="mt-1 text-lg">{brand.email}</p>
          <Link
            href="/estimate"
            className={cn(buttonVariants({ variant: "default" }), "mt-6 h-12 rounded-xl px-5 text-base")}
          >
            {hero.primary}
          </Link>
        </div>
      </section>

      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-5 py-16 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-3xl md:text-5xl">{close.title}</h2>
            <p className="mt-4 max-w-xl text-lg leading-8">{close.body}</p>
          </div>
          <Link
            href="/estimate"
            className="inline-flex h-12 items-center justify-center rounded-xl bg-primary-foreground px-5 text-base font-medium text-primary"
          >
            {hero.primary}
          </Link>
        </div>
      </section>
    </main>
  );
}
