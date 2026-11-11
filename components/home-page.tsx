import Image from "next/image";
import { PhotoGallery } from "@/components/photo-gallery";
import { Hero } from "@/components/hero";
import { ConsultLink } from "@/components/consult-link";
import Link from "next/link";
import { IdeasSection, PathChooser } from "@/components/path-sections";
import {
  area,
  beforeAfter,
  brand,
  cardClaims,
  care,
  close,
  editorial,
  faqs,
  gallery,
  hero,
  material,
  reasons,
  steps,
  talk,
} from "@/lib/copy";
import { ALSO_PLANNED, CORRIDOR, EXCLUDED } from "@/lib/coverage";
import { beforeAfterPhotos, galleryPhotos } from "@/lib/images";

export function HomePage() {
  return (
    <main id="content" tabIndex={-1}>
      <Hero />

      <PathChooser />

      <section id="intro" className="rise scroll-mt-28 mx-auto grid w-full max-w-6xl items-center gap-10 px-5 py-20 md:grid-cols-12 md:py-28">
        <div className="md:col-span-6">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brass">{editorial.eyebrow}</p>
          <h2 className="mt-4 text-4xl leading-[1.05] md:text-6xl">{editorial.title}</h2>
          <p className="mt-6 max-w-md text-lg leading-8 text-muted-foreground">{editorial.body}</p>
          <p className="mt-6 text-sm">
            <a href={brand.websiteHref} className="underline underline-offset-4">
              {brand.website}
            </a>
          </p>
        </div>
        <div className="relative md:col-span-6">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[1.6rem]">
            <Image
              src="/images/shower-warm.webp"
              alt="Warm speckled walk-in shower with black hardware and a bronze-toned half wall."
              fill
              sizes="(min-width: 768px) 40vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="checkerboard absolute -bottom-4 -left-4 hidden h-24 w-24 rounded-xl md:block" aria-hidden="true" />
        </div>
      </section>

      <section className="rise mx-auto w-full max-w-6xl px-5 pb-8" aria-label="Why these showers">
        <div className="grid gap-4 md:grid-cols-3">
          {reasons.map((reason, index) => (
            <article key={reason.title} className="rounded-[1.4rem] border border-border bg-card p-6">
              <p className="font-heading text-3xl text-primary">0{index + 1}</p>
              <h2 className="mt-3 text-2xl">{reason.title}</h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">{reason.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="surface" className="rise scroll-mt-28 mx-auto grid w-full max-w-6xl items-center gap-10 px-5 py-16 md:grid-cols-12 md:py-24">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[1.6rem] md:col-span-5">
          <Image
            src="/images/shower-niche.webp"
            alt="Speckled shower with a tall niche, bench, and handheld shower."
            fill
            sizes="(min-width: 768px) 40vw, 100vw"
            className="object-cover"
          />
        </div>
        <div className="md:col-span-7">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brass">The surface</p>
          <h2 className="mt-3 text-4xl md:text-5xl">{material.title}</h2>
          <p className="mt-5 text-lg leading-8">{material.body}</p>
          <p className="mt-4 leading-7 text-muted-foreground">{material.close}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/solid-surface" className="inline-flex h-12 items-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground">
              Solid surface path →
            </Link>
            <Link href="/custom-tile" className="inline-flex h-12 items-center rounded-full border border-border bg-card px-6 text-sm font-semibold">
              Custom tile path →
            </Link>
          </div>
        </div>
      </section>

      <section id="changes" className="rise scroll-mt-28 mx-auto w-full max-w-6xl px-5 py-16 md:py-24">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brass">Before and after</p>
        <h2 className="mt-3 max-w-3xl text-4xl md:text-5xl">{beforeAfter.title}</h2>
        <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">{beforeAfter.body}</p>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {beforeAfterPhotos.map((photo) => (
            <figure key={photo.src} className="overflow-hidden rounded-[1.4rem] border border-border bg-card">
              <div className="relative aspect-[2/1]">
                <Image src={photo.src} alt={photo.alt} fill sizes="(min-width: 768px) 45vw, 100vw" className="object-cover" />
              </div>
              <figcaption className="px-4 py-3 text-sm">{photo.caption}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section id="gallery" className="rise scroll-mt-28 bg-[#f3e7df]">
        <div className="mx-auto w-full max-w-6xl px-5 py-16 md:py-24">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brass">Gallery</p>
          <h2 className="mt-3 max-w-3xl text-4xl md:text-5xl">{gallery.title}</h2>
          <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">{gallery.body}</p>
          <PhotoGallery photos={galleryPhotos} />
        </div>
      </section>

      <IdeasSection />

      <section id="process" className="rise scroll-mt-28 mx-auto w-full max-w-6xl px-5 py-16 md:py-24">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brass">How it works</p>
        <h2 className="mt-3 text-4xl md:text-5xl">Three steps, then a confirmed proposal</h2>
        <ol className="mt-10 grid gap-4 md:grid-cols-3">
          {steps.map((step, index) => (
            <li key={step.title} className="rounded-[1.4rem] border border-border bg-card p-6">
              <span className="inline-flex size-12 items-center justify-center rounded-full bg-primary font-heading text-xl text-primary-foreground">
                {index + 1}
              </span>
              <h3 className="mt-5 text-2xl">{step.title}</h3>
              <p className="mt-3 leading-7 text-muted-foreground">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section id="care" className="rise scroll-mt-28 bg-sage-wash">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-8 px-5 py-16 md:grid-cols-2 md:py-24">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brass">Care</p>
            <h2 className="mt-3 text-4xl md:text-5xl">{care.title}</h2>
            <p className="mt-5 text-lg leading-8">{care.body}</p>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-[1.6rem]">
            <Image
              src="/images/finish-shiplap.webp"
              alt="Shiplap-style shower panels with recessed niches."
              fill
              sizes="(min-width: 768px) 45vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section id="area" className="rise scroll-mt-28 bg-secondary text-secondary-foreground">
        <div className="mx-auto w-full max-w-6xl px-5 py-16 md:py-24">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brass-soft">Service area</p>
          <h2 className="mt-3 max-w-2xl text-4xl md:text-5xl">{area.title}</h2>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-fig-muted">{area.intro}</p>
          <p className="mt-8 text-xs font-semibold uppercase tracking-[0.18em] text-brass-soft">{area.corridorLabel}</p>
          <ol className="mt-4 flex flex-wrap gap-2">
            {CORRIDOR.map((town, index) => (
              <li key={town} className="rounded-full border border-white/20 px-3 py-1.5 text-sm">
                {town}
                {index === CORRIDOR.length - 1 ? <span className="ms-2 text-xs text-brass-soft">Stops here</span> : null}
              </li>
            ))}
          </ol>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-fig-muted">{area.stop}</p>
          <p className="mt-8 text-xs font-semibold uppercase tracking-[0.18em] text-brass-soft">{area.alsoLabel}</p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {ALSO_PLANNED.map((town) => (
              <li key={town} className="rounded-full border border-white/20 px-3 py-1.5 text-sm">
                {town}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-fig-muted">Not included: {EXCLUDED.join(" and ")}.</p>
        </div>
      </section>

      <section id="questions" className="rise scroll-mt-28 bg-brass-soft">
        <div className="mx-auto w-full max-w-6xl px-5 py-16 md:py-24">
          <h2 className="text-4xl md:text-5xl">Questions</h2>
          <div className="mt-8 divide-y divide-foreground/15">
            {faqs.map((item) => (
              <details key={item.q} className="group py-1">
                <summary className="flex min-h-14 cursor-pointer items-center justify-between gap-4 py-3 text-lg font-medium">
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

      <section id="talk" className="rise scroll-mt-28 mx-auto grid w-full max-w-6xl gap-8 px-5 py-16 md:grid-cols-2 md:py-24">
        <div>
          <h2 className="text-4xl md:text-5xl">{talk.title}</h2>
          <p className="mt-4 max-w-md leading-7 text-muted-foreground">{talk.body}</p>
        </div>
        <div className="rounded-[1.6rem] border border-border bg-card p-7">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brass">Call or email</p>
          <p className="mt-3 font-heading text-4xl">
            <a href={brand.phoneHref}>{brand.phone}</a>
          </p>
          <p className="mt-3">
            <a href={brand.emailHref} className="underline underline-offset-4">
              {brand.email}
            </a>
          </p>
          <p className="mt-3">
            <a href={brand.websiteHref} className="underline underline-offset-4">
              {brand.website}
            </a>
          </p>
          <p className="mt-4 text-sm font-semibold">
            {cardClaims.consult}
          </p>
          <ConsultLink
            className="mt-6 inline-flex h-12 items-center justify-center rounded-full bg-primary px-6 text-base font-medium text-primary-foreground"
          >
            {hero.primary}
          </ConsultLink>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#1c1014] text-[#fbf6f2]">
        <Image
          src="/images/hero-rain.webp"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-[#1c1014]/55" />
        <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-8 px-5 py-20 md:flex-row md:items-end md:justify-between md:py-28">
          <div>
            <h2 className="max-w-xl text-4xl md:text-6xl">{close.title}</h2>
            <p className="mt-4 max-w-xl text-lg leading-8 text-white/85">{close.body}</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <ConsultLink
              className="inline-flex h-12 items-center justify-center rounded-full bg-[#fbf6f2] px-6 text-base font-medium text-[#2c211c]"
            >
              {hero.primary}
            </ConsultLink>
            <a
              href={brand.phoneHref}
              className="inline-flex h-12 items-center justify-center rounded-full border border-white/70 px-6 text-base"
            >
              {brand.phone}
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
