import { PhotoGallery } from "@/components/photo-gallery";
import { Hero } from "@/components/hero";
import { ConsultLink } from "@/components/consult-link";
import { IdeasSection, PathChooser } from "@/components/path-sections";
import { DesignLink } from "@/components/design-link";
import { InspiringRow, ShopLooks } from "@/components/look-strips";
import { CoverageMap } from "@/components/coverage-map";
import {
  area,
  brand,
  close,
  gallery,
  hero,
  heroDesignCta,
  steps,
  stepsTitle,
  talk,
} from "@/lib/copy";
import { homeGalleryPhotos } from "@/lib/images";

export function HomePage() {
  return (
    <main id="content" tabIndex={-1}>
      <Hero />

      <PathChooser />

      <ShopLooks />

      <InspiringRow />

      <section id="process" className="rise mx-auto w-full max-w-6xl px-5 py-16 md:py-24">
        <p className="accent-rule text-xs font-semibold uppercase tracking-[0.22em] text-brass">How it works</p>
        <h2 className="mt-3 text-4xl md:text-5xl">{stepsTitle}</h2>
        <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <li key={step.title} className="rounded-[1.4rem] border border-border bg-card p-6">
              <span className="inline-flex size-12 items-center justify-center rounded-full bg-bronze font-heading text-xl text-bronze-foreground">
                {index + 1}
              </span>
              <h3 className="mt-5 text-2xl">{step.title}</h3>
              {step.body ? <p className="mt-3 leading-7 text-muted-foreground">{step.body}</p> : null}
            </li>
          ))}
        </ol>
      </section>

      <section id="gallery" className="rise bg-band">
        <div className="mx-auto w-full max-w-6xl px-5 py-16 md:py-24">
          <p className="accent-rule text-xs font-semibold uppercase tracking-[0.22em] text-brass">Gallery</p>
          <h2 className="mt-3 max-w-3xl text-4xl md:text-5xl">{gallery.title}</h2>
          <PhotoGallery photos={homeGalleryPhotos} />
        </div>
      </section>

      <IdeasSection />

      <section id="area" className="rise bg-secondary text-secondary-foreground">
        <div className="mx-auto w-full max-w-6xl px-5 py-16 md:py-24">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brass-soft">Service area</p>
          <h2 className="mt-3 max-w-2xl text-4xl md:text-5xl">{area.title}</h2>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-fig-muted">{area.intro}</p>
          <CoverageMap size="compact" />
          <p className="mt-8">
            <a href="/areas" className="font-medium underline underline-offset-4">
              See every town we serve
            </a>
          </p>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-fig-muted">{area.outside}</p>
        </div>
      </section>

      <section id="talk" className="relative overflow-hidden bg-[#14261f] text-[#f6f1e6]">
        <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-8 px-5 py-20 md:flex-row md:items-end md:justify-between md:py-28">
          <div>
            <h2 className="max-w-xl text-4xl md:text-6xl">{close.title}</h2>
            <p className="mt-4 max-w-xl text-lg leading-8 text-white/85">{close.body}</p>
            <p className="mt-4 max-w-xl text-sm leading-7 text-white/75">
              {talk.title} {talk.body}{" "}
              <a href="/faq" className="font-medium underline underline-offset-4">
                Questions? See the FAQ
              </a>
              .
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <ConsultLink className="inline-flex h-12 items-center justify-center whitespace-nowrap rounded-full bg-bronze px-6 text-base font-medium text-bronze-foreground hover:bg-bronze-hover">
              {hero.primary}
            </ConsultLink>
            <DesignLink className="inline-flex h-12 items-center justify-center whitespace-nowrap rounded-full border border-white/70 px-6 text-base font-medium">
              {heroDesignCta}
            </DesignLink>
            <a href={brand.phoneHref} className="text-sm font-semibold text-white underline underline-offset-4">
              {brand.phone}
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
