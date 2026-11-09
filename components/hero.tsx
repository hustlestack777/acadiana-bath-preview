"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { brand, cardClaims, hero, services } from "@/lib/copy";
import { heroSlides } from "@/lib/images";
import { cn } from "cn";

export function Hero() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) return;
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % heroSlides.length);
    }, 7000);
    const onChange = () => {
      if (media.matches) window.clearInterval(id);
    };
    media.addEventListener("change", onChange);
    return () => {
      window.clearInterval(id);
      media.removeEventListener("change", onChange);
    };
  }, []);

  const slide = heroSlides[index];
  const [before, word, after] = hero.title.split(/(beautiful)/i);

  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-[#1c1014] text-[#fbf6f2]" aria-label="Introduction">
      <div className="absolute inset-0">
        {heroSlides.map((photo, photoIndex) => (
          <div
            key={photo.src}
            className={cn(
              "absolute inset-0 transition-opacity duration-[1600ms] ease-in-out",
              photoIndex === index ? "opacity-100" : "opacity-0",
            )}
            aria-hidden={photoIndex !== index}
          >
            <Image
              src={photo.src}
              alt={photoIndex === index ? photo.alt : ""}
              fill
              priority={photoIndex === 0}
              sizes="100vw"
              className={cn("object-cover", photoIndex === index && "hero-ken")}
            />
          </div>
        ))}
        <div className="hero-scrim absolute inset-0" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-6xl flex-col justify-end px-5 pb-40 pt-28 md:pb-12">
        <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[#f3d7cb]">{hero.eyebrow}</p>
        <h1
          className="hero-copy mt-4 max-w-5xl font-heading text-[clamp(3.4rem,8.4vw,7.4rem)] leading-[0.9] font-medium text-[#fbf6f2]"
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
        <p className="mt-4 text-sm font-semibold tracking-wide text-[#f3d7cb]">
          {cardClaims.consult}
          <span className="mx-2 opacity-60">·</span>
          {cardClaims.lifetime}
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/estimate"
            className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-7 text-base font-medium text-primary-foreground shadow-lg shadow-black/20"
          >
            {hero.primary}
          </Link>
          <a
            href={brand.phoneHref}
            className="inline-flex h-12 items-center justify-center rounded-full border border-white/75 px-7 text-base font-medium text-white hover:bg-white/10"
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
        <p className="mt-3 max-w-xl pe-36 text-[0.72rem] leading-5 text-white/85 md:pe-0">
          Photograph: {slide.caption}.{" "}
          <a href={slide.page} className="underline underline-offset-2">
            Onyx Collection
          </a>
          , not a completed job by {brand.name}.
        </p>
      </div>
    </section>
  );
}
