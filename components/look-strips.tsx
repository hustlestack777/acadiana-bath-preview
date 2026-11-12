"use client";

import { useEffect, useRef } from "react";
import { DesignLink } from "@/components/design-link";
import { LookImage } from "@/components/look-image";
import { LookLink } from "@/components/look-link";
import { inspiringLooks, shopLooks } from "@/lib/images";
import { findStartingLookBySrc } from "@/lib/starting-looks";

export function ShopLooks() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const resumeTimer = useRef(0);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");

    const pause = () => {
      pausedRef.current = true;
      window.clearTimeout(resumeTimer.current);
    };
    const scheduleResume = () => {
      window.clearTimeout(resumeTimer.current);
      resumeTimer.current = window.setTimeout(() => {
        if (!media.matches) pausedRef.current = false;
      }, 1400);
    };

    if (media.matches) pause();

    scroller.addEventListener("pointerenter", pause);
    scroller.addEventListener("pointerleave", scheduleResume);
    scroller.addEventListener("focusin", pause);
    scroller.addEventListener("focusout", scheduleResume);
    scroller.addEventListener("pointerdown", pause);
    scroller.addEventListener("wheel", pause, { passive: true });
    scroller.addEventListener("touchstart", pause, { passive: true });

    const onMotionChange = () => {
      if (media.matches) pause();
      else pausedRef.current = false;
    };
    media.addEventListener("change", onMotionChange);

    let frame = 0;
    let last = 0;
    const speed = 0.038;
    const tick = (time: number) => {
      if (!last) last = time;
      const delta = Math.min(time - last, 48);
      last = time;
      if (!pausedRef.current) {
        const half = scroller.scrollWidth / 2;
        if (half > 0) {
          let next = scroller.scrollLeft + delta * speed;
          if (next >= half) next -= half;
          scroller.scrollLeft = next;
        }
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(resumeTimer.current);
      media.removeEventListener("change", onMotionChange);
      scroller.removeEventListener("pointerenter", pause);
      scroller.removeEventListener("pointerleave", scheduleResume);
      scroller.removeEventListener("focusin", pause);
      scroller.removeEventListener("focusout", scheduleResume);
      scroller.removeEventListener("pointerdown", pause);
      scroller.removeEventListener("wheel", pause);
      scroller.removeEventListener("touchstart", pause);
    };
  }, []);

  const items = [...shopLooks, ...shopLooks];

  return (
    <section aria-labelledby="shop-looks-heading" className="rise bg-[#fffaf3] py-14 md:py-20">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-end justify-between gap-4 px-5">
        <div>
          <p className="accent-rule text-xs font-semibold uppercase tracking-[0.22em] text-brass">Shop by look</p>
          <h2 id="shop-looks-heading" className="mt-3 text-3xl leading-[1.1] md:text-5xl">
            Find a starting point.
          </h2>
        </div>
        <DesignLink className="shrink-0 text-sm font-semibold underline underline-offset-4">
          Design my bathroom →
        </DesignLink>
      </div>
      <div
        ref={scrollerRef}
        className="looks-scroller mt-8 flex gap-[0.9rem] overflow-x-auto px-5 pb-3 scroll-px-5 snap-x snap-mandatory"
        tabIndex={0}
        aria-label="Looks you can start from"
      >
        {items.map((look, index) => {
          const duplicate = index >= shopLooks.length;
          const starting = findStartingLookBySrc(look.src);
          const className = "group w-[11.5rem] shrink-0 snap-start sm:w-[13.5rem]";
          const body = (
            <>
              <span className="relative block aspect-[4/5] overflow-hidden rounded-[1.2rem] bg-muted">
                <LookImage
                  src={look.src}
                  jpg={look.jpg}
                  alt={duplicate ? "" : look.alt}
                  sizes="(min-width: 640px) 216px, 184px"
                  loading="lazy"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
              </span>
              <span className="mt-2.5 block text-[0.95rem] font-medium">{look.label}</span>
            </>
          );
          if (starting) {
            return (
              <LookLink
                key={`${look.label}-${index}`}
                look={starting}
                dest="path"
                className={className}
                tabIndex={duplicate ? -1 : undefined}
                aria-hidden={duplicate || undefined}
                data-testid={duplicate ? undefined : `shop-look-${starting.id}`}
              >
                {body}
              </LookLink>
            );
          }
          return (
            <a
              key={`${look.label}-${index}`}
              href={look.href}
              className={className}
              tabIndex={duplicate ? -1 : undefined}
              aria-hidden={duplicate || undefined}
            >
              {body}
            </a>
          );
        })}
      </div>
    </section>
  );
}

export function InspiringRow() {
  return (
    <section aria-labelledby="inspiring-heading" className="rise bg-band py-14 md:py-20">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-end justify-between gap-4 px-5">
        <h2 id="inspiring-heading" className="text-3xl leading-[1.1] md:text-5xl">
          New & inspiring
        </h2>
        <DesignLink className="shrink-0 text-sm font-semibold underline underline-offset-4">
          Design my bathroom →
        </DesignLink>
      </div>
      <div className="looks-scroller mt-8 flex gap-4 overflow-x-auto px-5 pb-3 scroll-px-5 snap-x snap-mandatory">
        {inspiringLooks.map((photo) => {
          const starting = findStartingLookBySrc(photo.src);
          const className = "relative aspect-[4/5] w-[16.5rem] shrink-0 snap-start overflow-hidden rounded-[1.3rem] bg-muted sm:w-[20rem]";
          const image = (
            <>
              <LookImage
                src={photo.src}
                jpg={photo.jpg}
                alt={photo.alt}
                sizes="(min-width: 640px) 320px, 264px"
                loading="lazy"
                className="object-cover transition-transform duration-700 hover:scale-[1.03]"
              />
            </>
          );
          if (starting) {
            return (
              <LookLink
                key={photo.src}
                look={starting}
                dest="design"
                className={className}
                data-testid={`inspiring-look-${starting.id}`}
              >
                {image}
              </LookLink>
            );
          }
          return (
            <DesignLink key={photo.src} className={className}>
              {image}
            </DesignLink>
          );
        })}
      </div>
    </section>
  );
}
