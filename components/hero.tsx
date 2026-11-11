"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ConsultLink } from "@/components/consult-link";
import {
  brand,
  cardClaims,
  heroDesignCta,
  heroHeadlineReduced,
  heroHeadlines,
  heroQuoteLine,
  heroSubhead,
  services,
} from "@/lib/copy";

/**
 * Rotating photo hero. AI-generated design examples (docs/image-sources.md), never presented as completed jobs.
 * Only the first slide is preloaded; the rest mount after first paint. Reduced motion shows the first slide only.
 * Headlines come from a shuffled pool (random start per visit) and crossfade with each slide change.
 */
const SLIDES = [
  { n: "17", position: "42% center" },
  { n: "18", position: "55% center" },
  { n: "24", position: "50% center" },
  { n: "19", position: "30% center" },
  { n: "22", position: "35% center" },
] as const;

const LONGEST_HEADLINE = "The bathroom your friends will ask about.";

/** Boogie's 2560x1440 upscales, pre-sized to 960/1600/2560. WebP first, JPG fallback. */
const srcSet = (n: string, ext: "webp" | "jpg") =>
  [960, 1600, 2560].map((w) => `/images/hero/hero-${n}-${w}.${ext} ${w}w`).join(", ");

const INTERVAL_MS = 6000;

function shuffleHeadlines(pool: readonly string[]) {
  const items = [...pool];
  for (let i = items.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}

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
  const [mounted, setMounted] = useState(false);
  const [loaded, setLoaded] = useState<boolean[]>(() => SLIDES.map((_, index) => index === 0));
  const [headlines, setHeadlines] = useState<string[]>(() => [...heroHeadlines]);
  const [headlineIndex, setHeadlineIndex] = useState(0);
  const loadedRef = useRef(loaded);
  const headlinesRef = useRef(headlines);
  useEffect(() => {
    loadedRef.current = loaded;
  }, [loaded]);
  useEffect(() => {
    headlinesRef.current = headlines;
  }, [headlines]);

  useEffect(() => {
    if (reducedMotion) return;
    const shuffleTimer = window.setTimeout(() => {
      setHeadlines(shuffleHeadlines(heroHeadlines));
      setHeadlineIndex(0);
    }, 0);
    // Mount the other slides after first paint so only the first image competes for bandwidth.
    const mountTimer = window.setTimeout(() => setMounted(true), 1200);
    const tick = window.setInterval(() => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setActive(0);
        return;
      }
      setActive((current) => {
        const next = (current + 1) % SLIDES.length;
        if (!loadedRef.current[next]) return current;
        setPrevious(current);
        setHeadlineIndex((currentHeadline) => (currentHeadline + 1) % headlinesRef.current.length);
        return next;
      });
    }, INTERVAL_MS);
    return () => {
      window.clearTimeout(shuffleTimer);
      window.clearTimeout(mountTimer);
      window.clearInterval(tick);
    };
  }, [reducedMotion]);

  const visibleHeadlines = reducedMotion ? [heroHeadlineReduced] : headlines;
  const visibleHeadlineIndex = reducedMotion ? 0 : headlineIndex;

  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-[#14261f] text-[#f6f1e6]" aria-label="Introduction">
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
        <h1
          className="home-hero-title relative mt-0 max-w-5xl font-heading text-[clamp(2.15rem,6.8vw,5.8rem)] leading-[0.96] font-semibold text-[#f6f1e6]"
          data-testid="hero-title"
        >
          <span className="invisible block" aria-hidden="true">
            {LONGEST_HEADLINE}
          </span>
          {visibleHeadlines.map((line, index) => (
            <span
              key={`${index}-${line}`}
              className="absolute inset-0 transition-opacity duration-[2000ms] ease-in-out"
              style={{ opacity: index === visibleHeadlineIndex ? 1 : 0 }}
              aria-hidden={index !== visibleHeadlineIndex}
            >
              {line}
            </span>
          ))}
        </h1>
        <p className="hero-copy mt-5 max-w-xl text-lg leading-8 text-[#f6f1e6] sm:mt-6">{heroSubhead}</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/design"
            className="inline-flex h-14 items-center justify-center rounded-full bg-primary px-8 text-base font-semibold text-primary-foreground shadow-xl shadow-black/30 transition-transform hover:-translate-y-0.5"
            data-testid="hero-cta"
          >
            {heroDesignCta}
          </Link>
          <ConsultLink className="inline-flex h-14 items-center justify-center rounded-full border border-white/75 bg-black/15 px-8 text-base font-medium text-white backdrop-blur-sm hover:bg-white/10">
            {cardClaims.consult}
          </ConsultLink>
          <a
            href={brand.phoneHref}
            className="inline-flex h-14 items-center justify-center rounded-full border border-white/75 bg-black/15 px-8 text-base font-medium text-white backdrop-blur-sm hover:bg-white/10"
          >
            {brand.phone}
          </a>
        </div>
        <p className="hero-copy mt-4 max-w-xl text-sm font-semibold tracking-wide text-[#e4d8b4]" data-testid="hero-quote-line">
          {heroQuoteLine}
        </p>
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
