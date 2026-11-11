"use client";

import { useEffect, useRef, useState } from "react";
import { ConsultLink } from "@/components/consult-link";
import { DesignCta } from "@/components/design/design-cta";
import { brand, cardClaims, hero, priceRange, services } from "@/lib/copy";

/**
 * Hero video built from bathroom photographs (see docs/video-sources.md).
 * Desktop gets a three-panel landscape cut, phones get a full-screen portrait cut.
 */
const HERO_VIDEO = {
  desktop: {
    webm: "/video/hero-desktop.webm",
    mp4: "/video/hero-desktop.mp4",
    poster: "/video/hero-desktop-poster.webp",
  },
  mobile: {
    webm: "/video/hero-mobile.webm",
    mp4: "/video/hero-mobile.mp4",
    poster: "/video/hero-mobile-poster.webp",
  },
} as const;

type Variant = keyof typeof HERO_VIDEO;

export function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [variant, setVariant] = useState<Variant | null>(null);

  useEffect(() => {
    const small = window.matchMedia("(max-width: 767px)");
    const pick = () => setVariant(small.matches ? "mobile" : "desktop");
    pick();
    small.addEventListener("change", pick);
    return () => small.removeEventListener("change", pick);
  }, []);
  const [before, word, after] = hero.title.split(/(beautiful)/i);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      if (media.matches) {
        video.pause();
      } else {
        // Some mobile browsers ignore the autoplay attribute until play() is called.
        video.muted = true;
        void video.play().catch(() => undefined);
      }
    };
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, [variant]);

  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-[#1c1014] text-[#fbf6f2]" aria-label="Introduction">
      <div className="absolute inset-0" aria-hidden="true">
        {/* Poster first, so the first paint shows showers before the video loads. */}
        <picture>
          <source media="(max-width: 767px)" srcSet={HERO_VIDEO.mobile.poster} />
          <img src={HERO_VIDEO.desktop.poster} alt="" className="absolute inset-0 h-full w-full object-cover" fetchPriority="high" />
        </picture>
        {variant ? (
          <video
            key={variant}
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover"
            poster={HERO_VIDEO[variant].poster}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            disablePictureInPicture
            data-testid="hero-video"
          >
            <source src={HERO_VIDEO[variant].webm} type="video/webm" />
            <source src={HERO_VIDEO[variant].mp4} type="video/mp4" />
          </video>
        ) : null}
        <div className="hero-video-scrim absolute inset-0" />
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
        <div className="mt-10 flex flex-wrap items-end justify-between gap-4 border-t border-white/20 pe-16 pt-4 md:pe-0">
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
