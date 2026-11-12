"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ConsultLink } from "@/components/consult-link";
import { DesignLink } from "@/components/design-link";
import {
  HERO_LONGEST_HEADLINE,
  HERO_SLIDES,
  heroSrcSet,
} from "@/lib/hero-slides";
import {
  brand,
  hero,
  heroDesignCta,
  heroQuoteLine,
  heroSubhead,
  services,
  trustLine,
} from "@/lib/copy";

/**
 * Rotating photo hero. AI-generated design examples (docs/image-sources.md), never presented as completed jobs.
 * Each headline is paired with one still. Only the first slide is preloaded; later stills mount one ahead of the rotation.
 * Reduced motion shows the first slide and its headline only. No video, no random shuffle.
 */
const SLIDES = HERO_SLIDES;

const INTERVAL_MS = 6000;

function subscribeReducedMotion(onStoreChange: () => void) {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", onStoreChange);
  return () => media.removeEventListener("change", onStoreChange);
}

const getReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const getReducedMotionServer = () => false;

export function Hero() {
  const reducedMotion = useSyncExternalStore(subscribeReducedMotion, getReducedMotion, getReducedMotionServer);
  const [active, setActive] = useState(0);
  const [previous, setPrevious] = useState(-1);
  // Only the opening still mounts at first; later stills are added one ahead of the rotation.
  const [mounted, setMounted] = useState<Set<number>>(() => new Set([0]));
  const [loaded, setLoaded] = useState<boolean[]>(() => SLIDES.map(() => false));
  const loadedRef = useRef(loaded);
  useEffect(() => {
    loadedRef.current = loaded;
  }, [loaded]);

  const markLoaded = (index: number) => {
    setLoaded((current) => (current[index] ? current : current.map((value, i) => (i === index ? true : value))));
  };

  useEffect(() => {
    if (reducedMotion) return;
    const next = (active + 1) % SLIDES.length;
    // Wait until the current still has loaded, then fetch the next one for the crossfade.
    if (!loaded[active]) return;
    const mountTimer = window.setTimeout(() => {
      setMounted((current) => {
        if (current.has(next)) return current;
        const updated = new Set(current);
        updated.add(next);
        return updated;
      });
    }, 400);
    return () => window.clearTimeout(mountTimer);
  }, [reducedMotion, active, loaded]);

  useEffect(() => {
    if (reducedMotion) return;
    const tick = window.setInterval(() => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
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
    return () => window.clearInterval(tick);
  }, [reducedMotion]);

  const visibleIndex = reducedMotion ? 0 : active;

  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-[#14261f] text-[#f6f1e6]" aria-label="Introduction">
      <div className="absolute inset-0" aria-hidden="true">
        {SLIDES.map((slide, index) =>
          index === 0 || mounted.has(index) || index === visibleIndex || index === previous ? (
            <div
              key={slide.n}
              className="absolute inset-0 transition-opacity duration-[2000ms] ease-in-out"
              style={{ opacity: index === visibleIndex ? 1 : 0 }}
            >
              <picture>
                <source type="image/avif" srcSet={heroSrcSet(slide.n, "avif")} sizes="100vw" />
                <source type="image/webp" srcSet={heroSrcSet(slide.n, "webp")} sizes="100vw" />
                <img
                  src={`/images/hero/hero-${slide.n}-1600.jpg`}
                  srcSet={heroSrcSet(slide.n, "jpg")}
                  sizes="100vw"
                  alt=""
                  width={2560}
                  height={1440}
                  fetchPriority={index === 0 ? "high" : "low"}
                  loading={index === 0 ? "eager" : "lazy"}
                  decoding={index === 0 ? "sync" : "async"}
                  ref={(image) => {
                    if (image && image.complete && image.naturalWidth > 0) {
                      markLoaded(index);
                    }
                  }}
                  onLoad={() => markLoaded(index)}
                  className={
                    index === visibleIndex || index === previous
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

      <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-6xl flex-col justify-end px-5 pb-16 pt-24 md:pb-12 md:pt-28">
        <h1
          className="home-hero-title relative mt-0 max-w-5xl font-heading text-[clamp(1.85rem,6.4vw,5.8rem)] leading-[0.96] font-semibold text-[#f6f1e6]"
          data-testid="hero-title"
        >
          <span className="invisible block" aria-hidden="true">
            {HERO_LONGEST_HEADLINE}
          </span>
          <span className="absolute inset-0">
            {SLIDES[visibleIndex].headline}
          </span>
        </h1>
        <p className="hero-copy mt-3 max-w-xl text-base leading-7 text-[#f6f1e6] sm:mt-6 sm:text-lg sm:leading-8">{heroSubhead}</p>
        <div className="mt-5 flex flex-col gap-3 max-md:pe-32 sm:mt-8 sm:flex-row" data-hero-ctas="">
          <ConsultLink
            className="inline-flex h-12 items-center justify-center rounded-full bg-bronze px-8 text-base font-semibold text-bronze-foreground shadow-xl shadow-black/30 transition-transform hover:-translate-y-0.5 hover:bg-bronze-hover sm:h-14"
            data-testid="hero-cta"
          >
            {hero.primary}
          </ConsultLink>
          <DesignLink
            className="inline-flex h-12 items-center justify-center whitespace-nowrap rounded-full border border-white/75 bg-black/15 px-5 text-sm font-medium text-white backdrop-blur-sm hover:bg-white/10 sm:h-14 sm:px-8 sm:text-base"
          >
            {heroDesignCta}
          </DesignLink>
        </div>
        <a href={brand.phoneHref} className="hero-copy mt-3 inline-block text-sm font-semibold text-[#f6f1e6] underline underline-offset-4 max-md:pe-32">
          {brand.phone}
        </a>
        <p className="hero-copy mt-3 max-w-xl text-sm text-[#e4d8b4] max-md:pe-32">{trustLine}</p>
        <p className="hero-copy mt-2 max-w-xl text-sm font-semibold tracking-wide text-[#e4d8b4] max-md:pe-32" data-testid="hero-quote-line">
          {heroQuoteLine}
        </p>
        <div className="mt-3 flex flex-col items-start gap-2 border-t border-white/20 pe-36 pt-3 md:flex-row md:items-end md:gap-8 md:pe-0">
          <ul className="flex flex-wrap gap-x-4 gap-y-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-white/80">
            {services.map((service) => (
              <li key={service}>{service}</li>
            ))}
          </ul>
          <a href="#paths" data-testid="hero-scroll" className="inline-flex items-center gap-3 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-white/90 max-md:absolute max-md:left-5 max-md:top-[calc(100svh-3.25rem)] max-md:z-20 max-md:drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
            <span className="scroll-line block h-8 w-px bg-white/80" aria-hidden="true" />
            Scroll
          </a>
        </div>
      </div>
    </section>
  );
}
