import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { PhotoGallery } from "@/components/photo-gallery";
import {
  area,
  beforeAfter,
  brand,
  cardClaims,
  care,
  close,
  faqs,
  finishesLook,
  gallery,
  hero,
  material,
  reasons,
  services,
  steps,
  talk,
  warranty,
} from "@/lib/copy";
import { ALSO_PLANNED, CORRIDOR, EXCLUDED } from "@/lib/coverage";
import { beforeAfterPhotos, featurePhoto, galleryPhotos, heroPhoto, panelPhotos } from "@/lib/photos";
import { cn } from "cn";

export function HomePage() {
  return (
    <main id="content" tabIndex={-1}>
      <section className="relative min-h-[100svh] overflow-hidden bg-[#f3e7dc]">
        <Image
          src={heroPhoto.src}
          alt={heroPhoto.alt}
          fill
          priority
          sizes="100vw"
          className="hero-still object-cover object-[72%_center]"
        />
        <div className="hero-scrim absolute inset-0" aria-hidden="true" />
        <div className="relative mx-auto flex min-h-[100svh] w-full max-w-6xl flex-col justify-end px-5 pb-40 pt-28 md:justify-center md:pb-20 md:pt-28">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brass">{hero.eyebrow}</p>
            <h1 className="mt-4 text-[clamp(3.1rem,8vw,6.4rem)] leading-[0.92]" data-testid="hero-title">
              {hero.title}
            </h1>
            <p className="mt-5 font-heading text-2xl leading-snug text-[#5c3044] md:text-3xl">{hero.line}</p>
            <p className="mt-5 max-w-lg text-lg leading-8 text-[#3c2c26]">{hero.support}</p>
            <p className="mt-5 text-sm font-semibold tracking-wide">
              {cardClaims.consult}
              <span className="mx-2 text-muted-foreground">·</span>
              {cardClaims.lifetime}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/estimate" className={cn(buttonVariants({ variant: "default" }), "h-12 rounded-full px-6 text-base max-md:mr-12")}>
                {hero.primary}
              </Link>
              <a
                href={brand.phoneHref}
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "h-12 rounded-full border-[#2c211c]/20 bg-[#fffbf6]/80 px-6 text-base",
                )}
              >
                Call {hero.secondary}
              </a>
            </div>
            <p className="mt-6 text-xs tracking-wide text-muted-foreground">{heroPhoto.caption}</p>
          </div>
        </div>
      </section>

      <div className="checkerboard h-2" aria-hidden="true" />

      <section className="border-b border-border bg-background">
        <ul className="mx-auto flex w-full max-w-6xl flex-wrap gap-x-6 gap-y-2 px-5 py-5 text-xs font-semibold uppercase tracking-[0.18em] text-[#5c3044]">
          {services.map((service) => (
            <li key={service}>{service}</li>
          ))}
        </ul>
      </section>

      <section className="rise mx-auto grid w-full max-w-6xl gap-12 px-5 py-20 md:grid-cols-12 md:py-28">
        <div className="md:col-span-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brass">Why these showers</p>
          <h2 className="mt-4 text-4xl leading-[1.05] md:text-5xl">{hero.pull}</h2>
        </div>
        <ol className="md:col-span-6 md:col-start-7">
          {reasons.map((reason, index) => (
            <li key={reason.title} className="border-t border-border py-6 first:border-t-0 first:pt-0">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brass">0{index + 1}</p>
              <h3 className="mt-2 text-2xl">{reason.title}</h3>
              <p className="mt-2 leading-7 text-muted-foreground">{reason.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="rise relative min-h-[70vh] overflow-hidden bg-[#2c211c]">
        <Image
          src={featurePhoto.src}
          alt={featurePhoto.alt}
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#241810]/75 via-transparent to-transparent" aria-hidden="true" />
        <figure className="absolute inset-x-0 bottom-0 mx-auto flex w-full max-w-6xl items-end px-5 py-8 md:py-12">
          <figcaption className="max-w-sm rounded-2xl bg-[#fffbf6]/95 px-5 py-4 text-[#2c211c]">
            <p className="font-heading text-2xl leading-tight">{featurePhoto.caption}</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Manufacturer photograph. Not a completed job by {brand.name}.
            </p>
          </figcaption>
        </figure>
      </section>

      <section id="surface" className="rise scroll-mt-28 mx-auto grid w-full max-w-6xl gap-10 px-5 py-20 md:grid-cols-12 md:py-28">
        <div className="md:col-span-7">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brass">The surface</p>
          <h2 className="mt-3 text-4xl md:text-5xl">{material.title}</h2>
          <p className="mt-5 text-lg leading-8">{material.body}</p>
          <p className="mt-4 leading-7 text-muted-foreground">{material.close}</p>
          <p className="mt-4 leading-7">
            {brand.name} uses{" "}
            <a href={brand.onyxHref} className="underline decoration-[#c46a4a] underline-offset-4">
              {brand.onyx}
            </a>{" "}
            solid-surface products.
          </p>
        </div>
        <div className="grid content-start gap-4 md:col-span-5">
          <p className="rounded-[1.5rem] bg-[#5c3044] p-6 font-heading text-3xl leading-snug text-[#fbf6f2]">
            63% alumina trihydrate
            <span className="mt-3 block font-sans text-base font-normal leading-7 text-[#f0d5de]">
              A mineral-derived ingredient, with 37% specially formulated polyester resin.
            </span>
          </p>
          <p className="rounded-[1.5rem] border border-border bg-card p-6 leading-7">
            It is a cast bathroom material. It is not a slab of quarried natural onyx.
          </p>
        </div>
      </section>

      <section id="finishes" className="rise scroll-mt-28 bg-[#fffbf6] py-20 md:py-28">
        <div className="mx-auto w-full max-w-6xl px-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brass">Finishes</p>
          <div className="mt-3 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <h2 className="max-w-xl text-4xl md:text-5xl">{finishesLook.title}</h2>
            <p className="max-w-md text-sm leading-6 text-muted-foreground">{finishesLook.body}</p>
          </div>
          <div className="mt-10">
            <PhotoGallery photos={panelPhotos} layout="rail" />
          </div>
        </div>
      </section>

      <section id="gallery" className="rise scroll-mt-28 mx-auto w-full max-w-6xl px-5 py-20 md:py-28">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brass">Gallery</p>
        <h2 className="mt-3 max-w-2xl text-4xl md:text-5xl">{gallery.title}</h2>
        <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">{gallery.body}</p>
        <div className="mt-10">
          <PhotoGallery photos={galleryPhotos} />
        </div>
      </section>

      <section id="before-after" className="rise scroll-mt-28 bg-[#5c3044] text-[#fbf6f2]">
        <div className="mx-auto w-full max-w-6xl px-5 py-20 md:py-28">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#e7c3a8]">Published pairs</p>
          <h2 className="mt-3 max-w-2xl text-4xl md:text-5xl">{beforeAfter.title}</h2>
          <p className="mt-4 max-w-2xl leading-7 text-[#f0d5de]">{beforeAfter.body}</p>
          <div className="mt-10 grid gap-6">
            {beforeAfterPhotos.map((photo) => (
              <figure key={photo.src} className="overflow-hidden rounded-[1.4rem] bg-[#3d2230]">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  width={photo.width}
                  height={photo.height}
                  sizes="(min-width: 1152px) 72rem, 100vw"
                  className="h-auto w-full"
                />
                <figcaption className="px-4 py-3 text-sm text-[#f0d5de]">{photo.caption}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section id="care" className="rise scroll-mt-28">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-8 px-5 py-20 md:grid-cols-12 md:py-28">
          <div className="overflow-hidden rounded-[1.6rem] md:col-span-5">
            <Image
              src="/images/panel-shiplap.webp"
              alt="Onyx Collection shiplap wall panels with recessed niches."
              width={1399}
              height={1866}
              sizes="(min-width: 768px) 40vw, 100vw"
              className="aspect-[4/5] w-full object-cover"
            />
          </div>
          <div className="md:col-span-6 md:col-start-7">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brass">Care</p>
            <h2 className="mt-3 text-4xl md:text-5xl">{care.title}</h2>
            <p className="mt-5 text-lg leading-8">{care.body}</p>
          </div>
        </div>
      </section>

      <section id="warranty" className="rise scroll-mt-28 bg-[#5c3044] text-[#fbf6f2]">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-20 md:grid-cols-12 md:py-28">
          <div className="md:col-span-7">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#e7c3a8]">Manufacturer product warranty</p>
            <h2 className="mt-3 text-4xl md:text-5xl">{warranty.title}</h2>
            <p className="mt-5 text-lg leading-8">{warranty.body}</p>
          </div>
          <aside className="rounded-[1.6rem] bg-[#fffbf6] p-7 text-[#2c211c] md:col-span-5">
            <h3 className="text-3xl">{warranty.asideTitle}</h3>
            <p className="mt-4 leading-7">{warranty.aside}</p>
            <p className="mt-6 text-sm font-semibold">
              {cardClaims.consult}. {cardClaims.lifetime}.
            </p>
          </aside>
        </div>
      </section>

      <section id="process" className="rise scroll-mt-28 mx-auto w-full max-w-6xl px-5 py-20 md:py-28">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brass">How it works</p>
        <h2 className="mt-3 max-w-xl text-4xl md:text-5xl">Three steps, then a confirmed proposal</h2>
        <ol className="mt-12 grid gap-10 md:grid-cols-3">
          {steps.map((step, index) => (
            <li key={step.title} className="border-t border-border pt-6">
              <span className="font-heading text-5xl text-[#c46a4a]">0{index + 1}</span>
              <h3 className="mt-4 text-2xl">{step.title}</h3>
              <p className="mt-3 leading-7 text-muted-foreground">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section id="area" className="rise scroll-mt-28 bg-[#2c211c] text-[#fbf6f2]">
        <div className="mx-auto w-full max-w-6xl px-5 py-20 md:py-28">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#e7c3a8]">Service area</p>
          <h2 className="mt-3 max-w-2xl text-4xl md:text-5xl">{area.title}</h2>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-[#f0d5de]">{area.intro}</p>
          <p className="mt-10 text-xs font-semibold uppercase tracking-[0.16em] text-[#e7c3a8]">{area.corridorLabel}</p>
          <ol className="mt-5 flex flex-col gap-3 md:flex-row md:flex-wrap md:items-center">
            {CORRIDOR.map((town, index) => (
              <li key={town} className="flex items-center gap-3 text-lg">
                <span className="font-heading text-[#e7c3a8]">0{index + 1}</span>
                <span>{town}</span>
                {index === CORRIDOR.length - 1 ? (
                  <span className="rounded-full bg-[#e7c3a8] px-2 py-0.5 text-xs font-semibold text-[#2c211c]">Stops here</span>
                ) : (
                  <span className="hidden text-[#e7c3a8] md:inline" aria-hidden="true">
                    /
                  </span>
                )}
              </li>
            ))}
          </ol>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-[#f0d5de]">{area.stop}</p>
          <p className="mt-10 text-xs font-semibold uppercase tracking-[0.16em] text-[#e7c3a8]">{area.alsoLabel}</p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {ALSO_PLANNED.map((town) => (
              <li key={town} className="rounded-full border border-white/20 px-3 py-1.5 text-sm">
                {town}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-[#f0d5de]">Not included: {EXCLUDED.join(" and ")}.</p>
        </div>
      </section>

      <section id="questions" className="rise scroll-mt-28 bg-[#f6e4d6]">
        <div className="mx-auto w-full max-w-6xl px-5 py-20 md:py-28">
          <h2 className="text-4xl md:text-5xl">Questions</h2>
          <div className="mt-8 divide-y divide-[#2c211c]/15">
            {faqs.map((item) => (
              <details key={item.q} className="group py-1">
                <summary className="flex min-h-14 cursor-pointer items-center justify-between gap-4 py-4 text-lg font-medium">
                  {item.q}
                  <span className="text-2xl leading-none text-[#8e3e2c] transition-transform group-open:rotate-45" aria-hidden="true">
                    +
                  </span>
                </summary>
                <p className="max-w-3xl pb-5 leading-7">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section id="talk" className="rise scroll-mt-28 mx-auto grid w-full max-w-6xl gap-10 px-5 py-20 md:grid-cols-2 md:py-28">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brass">Call</p>
          <h2 className="mt-3 text-4xl md:text-5xl">{talk.title}</h2>
          <p className="mt-4 max-w-md leading-7 text-muted-foreground">{talk.body}</p>
        </div>
        <div className="rounded-[1.6rem] border border-border bg-card p-7">
          <p className="font-heading text-4xl">
            <a href={brand.phoneHref}>{brand.phone}</a>
          </p>
          <p className="mt-3">
            <a href={brand.websiteHref} className="underline decoration-[#c46a4a] underline-offset-4">
              {brand.website}
            </a>
          </p>
          <p className="mt-4 text-sm font-semibold">
            {cardClaims.consult}. {cardClaims.lifetime}.
          </p>
          <Link href="/estimate" className={cn(buttonVariants({ variant: "default" }), "mt-8 h-12 rounded-full px-6 text-base")}>
            {hero.primary}
          </Link>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#2c211c] text-[#fbf6f2]">
        <Image
          src="/images/shower-cream.webp"
          alt="Onyx Collection shower gallery photo of a cream walk-in shower."
          fill
          sizes="100vw"
          className="object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-[#2c211c]/55" aria-hidden="true" />
        <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-8 px-5 py-24 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-4xl md:text-6xl">{close.title}</h2>
            <p className="mt-4 max-w-xl text-lg leading-8 text-[#f6e4d6]">{close.body}</p>
          </div>
          <Link
            href="/estimate"
            className="inline-flex h-12 items-center justify-center rounded-full bg-[#f6f0e8] px-6 text-base font-medium text-[#2c211c]"
          >
            {hero.primary}
          </Link>
        </div>
      </section>
    </main>
  );
}
