"use client";

import { useEffect, useRef, useState } from "react";
import { ConsultLink } from "@/components/consult-link";
import { DesignCta } from "@/components/design/design-cta";
import { brand, cardClaims, hero, priceRange, services } from "@/lib/copy";

/**
 * Rotating photo hero. AI-generated design examples (docs/image-sources.md), never presented as completed jobs.
 * Only the first slide is preloaded; the rest mount after first paint. Reduced motion shows the first slide only.
 */
const SLIDES = [
  { n: "17", position: "42% center" },
  { n: "18", position: "55% center" },
  { n: "24", position: "50% center" },
  { n: "19", position: "30% center" },
  { n: "22", position: "35% center" },
] as const;

/** Boogie's 2560x1440 upscales, pre-sized to 960/1600/2560. WebP first, JPG fallback. */
const srcSet = (n: string, ext: "webp" | "jpg") =>
  [960, 1600, 2560].map((w) => `/images/hero/hero-${n}-${w}.${ext} ${w}w`).join(", ");

const INTERVAL_MS = 6000;

export function Hero() {
  const [active, setActive] = useState(0);
  const [previous, setPrevious] = useState(-1);
  const [mounted, setMounted] = useState(false);
  const [loaded, setLoaded] = useState<boolean[]>(() => SLIDES.map((_, index) => index === 0));
  const [before, word, after] = hero.title.split(/(beautiful)/i);
  const loadedRef = useRef(loaded);
  useEffect(() => {
    loadedRef.current = loaded;
  }, [loaded]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) return;
    // Mount the other slides after first paint so only the first image competes for bandwidth.
    const mountTimer = window.setTimeout(() => setMounted(true), 1200);
    const tick = window.setInterval(() => {
      if (media.matches) {
        setActive(0);
        return;
      }
      setActive((current) => {
        const next = (current + 1) % SLIDES.length;
        if (!loadedRef.current[next]) return current;
        setPrevious(current);
        return next;
      });
    }, INTERVAL_MS);
    return () => {
      window.clearTimeout(mountTimer);
      window.clearInterval(tick);
    };
  }, []);

  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-[#1c1014] text-[#fbf6f2]" aria-label="Introduction">
      <div className="absolute inset-0" aria-hidden="true">
        {SLIDES.map((slide, index) =>
          index === 0 || mounted ? (
            <div
              key={slide.n}
              className="absolute inset-0 transition-opacity duration-[2000ms] ease-in-out"
              style={{ opacity: index === active ? 1 : 0 }}
            >
              <picture>
                <source type="image/webp" srcSet={srcSet(slide.n, "webp")} sizes="100vw" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/images/hero/hero-${slide.n}-1600.jpg`}
                  srcSet={srcSet(slide.n, "jpg")}
                  sizes="100vw"
                  alt=""
                  width={2560}
                  height={1440}
                  fetchPriority={index === 0 ? "high" : "low"}
                  decoding={index === 0 ? "sync" : "async"}
                  onLoad={() =>
                    setLoaded((current) => (current[index] ? current : current.map((value, i) => (i === index ? true : value))))
                  }
                  className={
                    index === active || index === previous
                      ? "home-hero-img home-hero-zoom absolute inset-0 h-full w-full object-cover"
                      : "home-hero-img absolute inset-0 h-full w-full object-cover"
                  }
                  style={{ objectPosition: slide.position }}
                />
              </picture>
            </div>
          ) : null,
        )}
        <div className="home-hero-scrim absolute inset-0" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-6xl flex-col justify-end px-5 pb-48 pt-24 md:pb-12 md:pt-28">
        <p className="hero-copy text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[#f3d7cb]">{hero.eyebrow}</p>
        <h1
          className="hero-copy mt-4 max-w-5xl font-heading text-[clamp(3.1rem,8.4vw,7.4rem)] leading-[0.92] font-medium text-[#fbf6f2]"
          data-testid="hero-title"
        >
          {word ? (
            <>
              {before}
              <em className="italic text-[#f0c7b8]">{word}</em>
              {after}
            </>
          ) : (
            hero.title
          )}
        </h1>
        <p className="hero-copy mt-6 hidden max-w-xl text-lg leading-8 text-[#fbf6f2] sm:block">{hero.support}</p>
        <p className="hero-copy mt-4 text-sm font-semibold tracking-wide text-[#f3d7cb]">
          {cardClaims.consult}
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <ConsultLink
            className="inline-flex h-14 items-center justify-center rounded-full bg-primary px-8 text-base font-semibold text-primary-foreground shadow-xl shadow-black/30 transition-transform hover:-translate-y-0.5"
            data-testid="hero-cta"
          >
            {hero.primary}
          </ConsultLink>
          <a
            href={brand.phoneHref}
            className="inline-flex h-14 items-center justify-center rounded-full border border-white/75 bg-black/15 px-8 text-base font-medium text-white backdrop-blur-sm hover:bg-white/10"
          >
            {brand.phone}
          </a>
        </div>
        <DesignCta testId="hero-design-cta" />
        <p className="hero-copy mt-5 max-w-xl text-sm leading-6 text-white/90" data-testid="price-range">{priceRange}</p>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-4 border-t border-white/20 pe-16 pt-4 md:pe-0">
          <ul className="flex flex-wrap gap-x-4 gap-y-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-white/80">
            {services.map((service) => (
              <li key={service}>{service}</li>
            ))}
          </ul>
          <a href="#intro" className="hidden items-center gap-3 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-white/75 md:inline-flex">
            <span className="scroll-line block h-8 w-px bg-white/80" aria-hidden="true" />
            Scroll
          </a>
        </div>
      </div>
    </section>
  );
}
