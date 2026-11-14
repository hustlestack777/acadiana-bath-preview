import type { Metadata } from "next";
import Image from "next/image";
import { SiteShell } from "@/components/site-shell";
import { ExampleGrid, PathHero } from "@/components/path-sections";
import { QuickQuote } from "@/components/quick-quote";
import { WarrantyCard } from "@/components/warranty-section";
import { brand, solidPath, trustLineFollow } from "@/lib/copy";
import { solidPhotos } from "@/lib/images";
import { JsonLd } from "@/components/json-ld";
import { solidSurfaceServiceJsonLd } from "@/lib/schema";
import { pageCanonical } from "@/lib/site";

export const metadata: Metadata = {
  title: "Solid surface showers and tub walls",
  description:
    "Tub-to-shower conversions and solid surface shower and tub walls across Acadiana and South Louisiana. Less grout. Free quote. See your new bathroom with Design My Bathroom.",

  alternates: { canonical: pageCanonical("/solid-surface") },
};

export default function SolidSurfacePage() {
  return (
    <SiteShell sticky bleed>
      <main id="content" tabIndex={-1}>
        <JsonLd data={solidSurfaceServiceJsonLd()} />
        <PathHero
          image="/images/ai/ss-walkin.webp"
          alt="Warm-white solid surface walk-in shower with frameless glass, a niche and brass fixtures."
          eyebrow={solidPath.eyebrow}
          title={solidPath.title}
          support={solidPath.support}
          trust={trustLineFollow}
          cta={solidPath.cta}
          ctaHref="#solid-quote"
          position="72% center"
        />

        <section id="solid-surface" className="rise mx-auto w-full max-w-6xl px-5 py-20 md:py-28" aria-labelledby="ss-why">
          <p className="accent-rule text-xs font-semibold uppercase tracking-[0.22em] text-brass">Solid surface</p>
          <h2 id="ss-why" className="mt-3 max-w-3xl text-4xl leading-[1.05] md:text-6xl">{solidPath.whyTitle}</h2>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {solidPath.why.map((item, index) => (
              <article key={item.title} className="rounded-[1.4rem] border border-border bg-card p-6">
                <p className="font-heading text-3xl text-primary">0{index + 1}</p>
                <h3 className="mt-3 text-2xl">{item.title}</h3>
                <p className="mt-3 leading-7 text-muted-foreground">{item.body}</p>
              </article>
            ))}
          </div>

          <div className="mt-8 grid gap-4">
            <WarrantyCard id="warranty" />
            <div className="rounded-[1.6rem] border border-border bg-sage-wash p-7 md:max-w-xl md:p-10">
              <p className="accent-rule text-xs font-semibold uppercase tracking-[0.22em] text-brass">Care</p>
              <p className="mt-4 font-heading text-3xl leading-tight md:text-4xl">{solidPath.care}</p>
            </div>
          </div>
        </section>

        <section className="rise mx-auto w-full max-w-6xl px-5 pb-20 md:pb-28" aria-labelledby="ss-covers">
          <div className="grid items-center gap-10 md:grid-cols-12">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[1.6rem] md:col-span-5">
              <Image src="/images/ai/ss-tub-to-shower.webp" alt="Former tub alcove converted to a walk-in shower with greige solid surface walls, a bench and a sliding glass door." fill sizes="(min-width: 768px) 40vw, 100vw" className="object-cover" />
            </div>
            <div className="md:col-span-7">
              <h2 id="ss-covers" className="text-4xl md:text-5xl">{solidPath.servicesTitle}</h2>
              <ul className="mt-6 divide-y divide-border border-y border-border">
                {solidPath.services.map((item) => (
                  <li key={item.title} className="py-5">
                    <h3 className="text-2xl">{item.title}</h3>
                    <p className="mt-1 leading-7 text-muted-foreground">{item.body}</p>
                  </li>
                ))}
              </ul>
              <p className="mt-6 leading-7 text-muted-foreground">
                Planning a walk-in shower in Lafayette? See{" "}
                <a href="/walk-in-shower-lafayette" className="font-medium underline underline-offset-4">
                  Walk-in showers in Lafayette
                </a>
                .
              </p>
            </div>
          </div>
        </section>

        <section className="rise bg-band" aria-labelledby="ss-gallery">
          <div className="mx-auto w-full max-w-6xl px-5 py-20 md:py-28">
            <p className="accent-rule text-xs font-semibold uppercase tracking-[0.22em] text-brass">Looks we can build</p>
            <h2 id="ss-gallery" className="mt-3 text-4xl md:text-6xl">Walk-ins, tub walls, and everything between.</h2>
            <ExampleGrid photos={solidPhotos} className="mt-10" />
          </div>
        </section>

        <section id="solid-quote" className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-20 md:grid-cols-12 md:py-28">
          <div className="md:col-span-5">
            <p className="accent-rule text-xs font-semibold uppercase tracking-[0.22em] text-brass">Free quote</p>
            <h2 className="mt-3 text-4xl md:text-5xl">{solidPath.formTitle}</h2>
            <p className="mt-4 leading-7 text-muted-foreground">{solidPath.formBody}</p>
            <p className="mt-6 text-sm">
              Rather discuss your project? <a className="font-medium underline underline-offset-4" href={brand.phoneHref}>{brand.phone}</a>
              {" · "}
              <a className="underline underline-offset-4" href={brand.emailHref}>{brand.email}</a>
            </p>
          </div>
          <div className="md:col-span-7">
            <QuickQuote path="solid" />
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
