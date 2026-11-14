import type { Metadata } from "next";
import Image from "next/image";
import { ConsultLink } from "@/components/consult-link";
import { FaqSection } from "@/components/faq-section";
import { JsonLd } from "@/components/json-ld";
import { ExampleGrid, PathHero } from "@/components/path-sections";
import { QuickQuote } from "@/components/quick-quote";
import { SiteShell } from "@/components/site-shell";
import { brand, hero, walkInPage } from "@/lib/copy";
import { designCopy } from "@/lib/design-styles";
import { designWalls } from "@/lib/design-picks";
import { heroSlides, walkInPhotos } from "@/lib/images";
import { walkInShowerServiceJsonLd } from "@/lib/schema";
import { pageCanonical } from "@/lib/site";
import { getTown, townPath } from "@/lib/towns";

export const metadata: Metadata = {
  title: { absolute: walkInPage.documentTitle },
  description: walkInPage.description,
  alternates: { canonical: pageCanonical(walkInPage.path) },
  openGraph: {
    title: walkInPage.documentTitle,
    description: walkInPage.description,
    url: pageCanonical(walkInPage.path),
  },
};

const STYLE_KEYS = ["ss-white", "ss-stone", "zellige", "calacatta", "herringbone", "stacked-skinny", "black-hex", "terrazzo"] as const;
const TOWN_SLUGS = ["lafayette", "broussard", "youngsville", "carencro", "scott", "opelousas"] as const;

export default function WalkInShowerLafayettePage() {
  const heroPhoto = heroSlides.find((photo) => photo.src === "/images/hero-walkin.webp") ?? walkInPhotos[0];
  const styles = STYLE_KEYS.flatMap((key) => {
    const style = designWalls.find((item) => item.key === key);
    return style ? [style] : [];
  });
  const towns = TOWN_SLUGS.flatMap((slug) => {
    const town = getTown(slug);
    return town ? [town] : [];
  });

  return (
    <SiteShell sticky bleed>
      <main id="content" tabIndex={-1}>
        <JsonLd data={walkInShowerServiceJsonLd()} />
        <PathHero
          image={heroPhoto.src}
          alt={heroPhoto.alt}
          eyebrow={walkInPage.eyebrow}
          title={walkInPage.title}
          support={walkInPage.support}
          cta={hero.primary}
          ctaHref="/estimate"
          price={walkInPage.price}
        />

        <section className="rise mx-auto w-full max-w-6xl px-5 py-20 md:py-28" aria-labelledby="walk-in-includes">
          <p className="accent-rule text-xs font-semibold uppercase tracking-[0.22em] text-brass">Walk-in showers</p>
          <h2 id="walk-in-includes" className="mt-3 max-w-3xl text-4xl leading-[1.05] md:text-6xl">
            {walkInPage.includesTitle}
          </h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {walkInPage.includes.map((item, index) => (
              <article key={item.title} className="rounded-[1.4rem] border border-border bg-card p-6">
                <p className="font-heading text-3xl text-primary">0{index + 1}</p>
                <h3 className="mt-3 text-2xl">{item.title}</h3>
                <p className="mt-3 leading-7 text-muted-foreground">{item.body}</p>
                {item.title === "Solid surface or custom tile" ? (
                  <p className="mt-4 text-sm leading-6">
                    <a href="/solid-surface" className="font-medium underline underline-offset-4">
                      Solid surface
                    </a>
                    {" · "}
                    <a href="/custom-tile" className="font-medium underline underline-offset-4">
                      Custom tile
                    </a>
                  </p>
                ) : null}
              </article>
            ))}
          </div>
        </section>

        <section className="rise mx-auto w-full max-w-6xl px-5 pb-20 md:pb-28" aria-labelledby="walk-in-conversion">
          <div className="grid items-center gap-10 md:grid-cols-12">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[1.6rem] md:col-span-5">
              <Image
                src="/images/shower-barn.webp"
                alt="Shower with horizontal panels, a black barn-style glass door, a corner seat, and a recessed niche."
                fill
                sizes="(min-width: 768px) 40vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="md:col-span-7">
              <h2 id="walk-in-conversion" className="text-4xl md:text-5xl">
                {walkInPage.conversionTitle}
              </h2>
              <p className="mt-5 text-lg leading-8 text-muted-foreground">{walkInPage.conversionBody}</p>
              <p className="mt-4 text-lg leading-8 text-muted-foreground">{walkInPage.support}</p>
              <p className="mt-6 text-lg font-medium" data-testid="walk-in-price">
                {walkInPage.price}
              </p>
            </div>
          </div>
        </section>

        <section className="rise bg-band" aria-labelledby="walk-in-gallery">
          <div className="mx-auto w-full max-w-6xl px-5 py-20 md:py-28">
            <p className="accent-rule text-xs font-semibold uppercase tracking-[0.22em] text-brass">Looks we can build</p>
            <h2 id="walk-in-gallery" className="mt-3 text-4xl md:text-6xl">
              Walk-in showers for Lafayette homes.
            </h2>
            <ExampleGrid photos={walkInPhotos} className="mt-10" />
          </div>
        </section>

        <section className="rise mx-auto w-full max-w-6xl px-5 py-20 md:py-28" aria-labelledby="walk-in-styles">
          <p className="accent-rule text-xs font-semibold uppercase tracking-[0.22em] text-brass">Starting looks</p>
          <h2 id="walk-in-styles" className="mt-3 max-w-3xl text-4xl leading-[1.05] md:text-6xl">
            Pick a starting look.
          </h2>
          <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">{designCopy.sub}</p>
          <ul className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4">
            {styles.map((style) => (
              <li key={style.key}>
                <a
                  href={`/design?style=${style.key}`}
                  className="block overflow-hidden rounded-[1.2rem] border border-border bg-card"
                >
                  <span className="relative block aspect-[4/5]">
                    <Image src={style.image} alt={style.alt} fill sizes="(min-width: 768px) 25vw, 50vw" className="object-cover" />
                  </span>
                  <span className="block px-4 pt-3 font-medium">{style.name}</span>
                  <span className="block px-4 pb-4 pt-1 text-sm leading-6 text-muted-foreground">{style.blurb}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section className="rise bg-secondary text-secondary-foreground" aria-labelledby="walk-in-towns">
          <div className="mx-auto w-full max-w-6xl px-5 py-16 md:py-24">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brass-soft">Service area</p>
            <h2 id="walk-in-towns" className="mt-3 max-w-3xl text-4xl md:text-5xl">
              {walkInPage.townsTitle}
            </h2>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-fig-muted">
              {walkInPage.townsIntro}{" "}
              {towns.map((town, index) => (
                <span key={town.slug}>
                  {index > 0 ? ", " : ""}
                  <a href={townPath(town.slug)} className="font-medium underline underline-offset-4">
                    {town.name}
                  </a>
                </span>
              ))}
              .
            </p>
            <p className="mt-6">
              <a href="/areas" className="font-medium underline underline-offset-4">
                See every town we serve
              </a>
            </p>
          </div>
        </section>

        <FaqSection faqs={walkInPage.faqs} heading="Walk-in shower questions" />

        <section id="walk-in-quote" className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-20 md:grid-cols-12 md:py-28">
          <div className="md:col-span-5">
            <p className="accent-rule text-xs font-semibold uppercase tracking-[0.22em] text-brass">Free quote</p>
            <h2 className="mt-3 text-4xl md:text-5xl">{walkInPage.formTitle}</h2>
            <p className="mt-4 text-lg font-medium">{walkInPage.price}</p>
            <p className="mt-4 leading-7 text-muted-foreground">{walkInPage.formBody}</p>
            <div className="mt-6 flex flex-col items-start gap-3">
              <ConsultLink className="inline-flex h-12 items-center justify-center rounded-full bg-bronze px-6 text-base font-medium text-bronze-foreground hover:bg-bronze-hover">
                {hero.primary}
              </ConsultLink>
              <a className="text-sm font-medium underline underline-offset-4" href="/estimate">
                quote form
              </a>
              <a className="text-sm font-semibold underline underline-offset-4" href={brand.phoneHref}>
                {brand.phone}
              </a>
            </div>
          </div>
          <div className="md:col-span-7">
            <QuickQuote path="walk-in" />
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
