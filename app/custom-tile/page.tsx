import type { Metadata } from "next";
import { SiteShell } from "@/components/site-shell";
import { ExampleGrid, IdeasSection, PathHero } from "@/components/path-sections";
import { GroutPicker } from "@/components/grout-picker";
import { QuickQuote } from "@/components/quick-quote";
import { brand, tilePath } from "@/lib/copy";
import { tileHero, tilePhotos } from "@/lib/images";
import { JsonLd } from "@/components/json-ld";
import { customTileServiceJsonLd } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Custom tile showers and bathrooms",
  description:
    "Custom tile showers and bathrooms across Acadiana and South Louisiana: zellige, patterned floors and grout colors you choose. Free consult. Call 337-522-0023.",
};

export default function CustomTilePage() {
  return (
    <SiteShell sticky bleed>
      <main id="content" tabIndex={-1}>
        <JsonLd data={customTileServiceJsonLd()} />
        <PathHero
          image={tileHero.src}
          alt={tileHero.alt}
          eyebrow={tilePath.eyebrow}
          title={tilePath.title}
          support={tilePath.support}
          cta={tilePath.cta}
          ctaHref="#tile-quote"
        />

        <section id="looks" className="rise scroll-mt-28 mx-auto w-full max-w-6xl px-5 py-20 md:py-28" aria-labelledby="tile-looks">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brass">Custom tile</p>
          <h2 id="tile-looks" className="mt-3 max-w-3xl text-4xl leading-[1.05] md:text-6xl">{tilePath.looksTitle}</h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {tilePath.looks.map((item, index) => (
              <article key={item.title} className="rounded-[1.4rem] border border-border bg-card p-6">
                <p className="font-heading text-3xl text-primary">0{index + 1}</p>
                <h3 className="mt-3 text-2xl">{item.title}</h3>
                <p className="mt-3 leading-7 text-muted-foreground">{item.body}</p>
              </article>
            ))}
          </div>
          <ExampleGrid photos={tilePhotos} className="mt-10" title="Looks we can build for you" />
        </section>

        <section id="grout" className="rise scroll-mt-28 bg-card" aria-labelledby="grout-title">
          <div className="mx-auto w-full max-w-6xl px-5 py-20 md:py-28">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brass">Grout colors</p>
            <h2 id="grout-title" className="mt-3 text-4xl md:text-6xl">{tilePath.groutTitle}</h2>
            <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">{tilePath.groutBody}</p>
            <GroutPicker />
          </div>
        </section>

        <IdeasSection />

        <section id="tile-quote" className="scroll-mt-24 mx-auto grid w-full max-w-6xl gap-10 px-5 py-20 md:grid-cols-12 md:py-28">
          <div className="md:col-span-5">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brass">Free consult</p>
            <h2 className="mt-3 text-4xl md:text-5xl">{tilePath.formTitle}</h2>
            <p className="mt-4 leading-7 text-muted-foreground">{tilePath.formBody}</p>
            <p className="mt-6 text-sm">
              Rather talk? <a className="font-medium underline underline-offset-4" href={brand.phoneHref}>{brand.phone}</a>
              {" · "}
              <a className="underline underline-offset-4" href={brand.emailHref}>{brand.email}</a>
            </p>
          </div>
          <div className="md:col-span-7">
            <QuickQuote path="tile" />
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
