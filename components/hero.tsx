"use client";

import { useEffect, useRef } from "react";
import { ConsultLink } from "@/components/consult-link";
import { brand, cardClaims, hero, services } from "@/lib/copy";

/**
 * PLACEHOLDER hero video: Pexels stock footage (see public/video/SOURCES.md).
 * Swap the three files in public/video for Justin's own shots when they arrive,
 * keeping the same names, or update HERO_VIDEO below.
 */
const HERO_VIDEO = {
  webm: "/video/hero-placeholder.webm",
  mp4: "/video/hero-placeholder.mp4",
  poster: "/video/hero-placeholder-poster.webp",
  credit: "Stock video via Pexels, placeholder until Justin's own shots",
  creditHref: "https://www.pexels.com/video/video-of-a-bathroom-855250/",
} as const;

export function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
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
  }, []);

  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-[#1c1014] text-[#fbf6f2]" aria-label="Introduction">
      <div className="absolute inset-0" aria-hidden="true">
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          poster={HERO_VIDEO.poster}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          disablePictureInPicture
          data-testid="hero-video"
        >
          <source src={HERO_VIDEO.webm} type="video/webm" />
          <source src={HERO_VIDEO.mp4} type="video/mp4" />
        </video>
        <div className="hero-video-scrim absolute inset-0" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-6xl flex-col justify-end px-5 pb-40 pt-28 md:pb-12">
        <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[#f3d7cb]">{hero.eyebrow}</p>
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
        <p className="hero-copy mt-6 max-w-xl text-lg leading-8 text-[#fbf6f2]">{hero.support}</p>
        <p className="hero-copy mt-4 text-sm font-semibold tracking-wide text-[#f3d7cb]">
          {cardClaims.consult}
          <span className="mx-2 opacity-60">·</span>
          {cardClaims.lifetime}
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
        <p className="mt-3 max-w-xl pe-36 text-[0.7rem] leading-5 text-white/70 md:pe-0">
          <a href={HERO_VIDEO.creditHref} className="underline underline-offset-2">
            {HERO_VIDEO.credit}
          </a>
          , not a completed job by {brand.name}.
        </p>
      </div>
    </section>
  );
}
