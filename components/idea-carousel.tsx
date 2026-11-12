"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

export type IdeaSlide = { src: string; alt: string };

const INTERVAL_MS = 7000;

export function IdeaCarousel({
  slides,
  label,
}: {
  slides: readonly IdeaSlide[];
  label: string;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  const goTo = useCallback(
    (next: number) => {
      const scroller = scrollerRef.current;
      if (!scroller || slides.length === 0) return;
      const wrapped = ((next % slides.length) + slides.length) % slides.length;
      scroller.scrollTo({
        left: wrapped * scroller.clientWidth,
        behavior: reduceMotion ? "auto" : "smooth",
      });
      setIndex(wrapped);
    },
    [reduceMotion, slides.length],
  );

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const onScroll = () => {
      const width = scroller.clientWidth;
      if (!width) return;
      const next = Math.round(scroller.scrollLeft / width);
      setIndex((current) => {
        const clamped = Math.min(slides.length - 1, Math.max(0, next));
        return clamped === current ? current : clamped;
      });
    };
    scroller.addEventListener("scroll", onScroll, { passive: true });
    return () => scroller.removeEventListener("scroll", onScroll);
  }, [slides.length]);

  useEffect(() => {
    if (paused || reduceMotion || slides.length < 2) return;
    const timer = window.setInterval(() => {
      setIndex((current) => {
        const next = (current + 1) % slides.length;
        const scroller = scrollerRef.current;
        scroller?.scrollTo({
          left: next * scroller.clientWidth,
          behavior: "smooth",
        });
        return next;
      });
    }, INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [paused, reduceMotion, slides.length]);

  if (slides.length === 0) return null;

  return (
    <div
      className="relative bg-[#14261f]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setPaused(false);
      }}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
    >
      <div
        ref={scrollerRef}
        className="flex snap-x snap-mandatory overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        tabIndex={0}
        role="region"
        aria-roledescription="carousel"
        aria-label={label}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") {
            event.preventDefault();
            goTo(index + 1);
          } else if (event.key === "ArrowLeft") {
            event.preventDefault();
            goTo(index - 1);
          } else if (event.key === "Home") {
            event.preventDefault();
            goTo(0);
          } else if (event.key === "End") {
            event.preventDefault();
            goTo(slides.length - 1);
          }
        }}
      >
        {slides.map((slide, slideIndex) => (
          <div
            key={slide.src}
            className="relative aspect-[4/3] w-full min-w-full shrink-0 snap-start lg:aspect-[3/4]"
            role="group"
            aria-roledescription="slide"
            aria-label={`${slideIndex + 1} of ${slides.length}`}
            aria-hidden={slideIndex !== index}
          >
            <Image
              src={slide.src}
              alt={slideIndex === index ? slide.alt : ""}
              fill
              sizes="(min-width: 1024px) 20vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover"
              loading="lazy"
            />
          </div>
        ))}
      </div>

      {slides.length > 1 ? (
        <>
          <button
            type="button"
            className="absolute left-2 top-1/2 z-10 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-[#103830]/80 text-[#f7f3ea] shadow-sm backdrop-blur-sm transition hover:bg-[#103830] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f7f3ea] md:flex"
            aria-label={`Previous ${label} photo`}
            onClick={() => goTo(index - 1)}
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            className="absolute right-2 top-1/2 z-10 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-[#103830]/80 text-[#f7f3ea] shadow-sm backdrop-blur-sm transition hover:bg-[#103830] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f7f3ea] md:flex"
            aria-label={`Next ${label} photo`}
            onClick={() => goTo(index + 1)}
          >
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
          <div className="absolute inset-x-0 bottom-2 z-10 flex justify-center gap-1.5" role="tablist" aria-label={`${label} photos`}>
            {slides.map((slide, slideIndex) => (
              <button
                key={slide.src}
                type="button"
                role="tab"
                aria-selected={slideIndex === index}
                aria-label={`Photo ${slideIndex + 1} of ${slides.length}`}
                className={`h-1.5 rounded-full transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f7f3ea] ${
                  slideIndex === index ? "w-4 bg-[#f7f3ea]" : "w-1.5 bg-[#f7f3ea]/55 hover:bg-[#f7f3ea]/80"
                }`}
                onClick={() => goTo(slideIndex)}
              />
            ))}
          </div>
        </>
      ) : null}

      <p className="sr-only" aria-live="polite">
        Photo {index + 1} of {slides.length}
      </p>
    </div>
  );
}
