"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";

const LOOKS = [
  {
    label: "Tub walls",
    href: "/solid-surface",
    src: "/images/ai/ss-tub-walls.webp",
    alt: "Alcove tub with a seamless white solid surface surround with soft veining and two recessed shelves.",
  },
  {
    label: "Green zellige",
    href: "/custom-tile",
    src: "/images/ai/tile-01.webp",
    alt: "Walk-in shower in handmade deep-green zellige tile with brass fixtures and a frameless glass panel.",
  },
  {
    label: "Stone-look",
    href: "/custom-tile",
    src: "/images/home/bookmatch-stone.webp",
    alt: "Curbless shower with book-matched stone-look walls, a lit niche, a floating bench and brass fixtures.",
  },
  {
    label: "Black & brass",
    href: "/custom-tile",
    src: "/images/ai/tile-06.webp",
    alt: "Spa shower in dark stone-look tile with a brass rain head and a warm wood bench.",
  },
  {
    label: "Sage",
    href: "/custom-tile",
    src: "/images/home/sage-tile-tub.webp",
    alt: "Sage handmade tile shower with a frameless glass door beside a freestanding tub.",
  },
  {
    label: "Blush",
    href: "/custom-tile",
    src: "/images/home/blush-tile.webp",
    alt: "Blush handmade tile shower with a cross-handle valve, a niche and a frameless glass door.",
  },
  {
    label: "Tub-to-shower",
    href: "/solid-surface",
    src: "/images/ai/ss-tub-to-shower.webp",
    alt: "Tub alcove converted to a walk-in shower with greige solid surface walls, a bench and a sliding glass door.",
  },
  {
    label: "Warm white",
    href: "/solid-surface",
    src: "/images/ai/ss-walkin.webp",
    alt: "Warm-white solid surface walk-in shower with frameless glass, a niche, a bench and brass fixtures.",
  },
  {
    label: "Penny tile",
    href: "/custom-tile",
    src: "/images/home/penny-drain.webp",
    alt: "Brass square decorative drain set flush in white penny round tile.",
  },
  {
    label: "Marble-look",
    href: "/custom-tile",
    src: "/images/home/marble-glass.webp",
    alt: "Shower with a marble-look back wall, white subway-style side walls, a long niche and a frameless glass door.",
  },
] as const;

const INSPIRING = [
  {
    src: "/images/hero/hero-34-1600.webp",
    alt: "White tile walls and a freestanding tub on a blue, rust and cream patterned floor.",
  },
  {
    src: "/images/hero/hero-33-1600.webp",
    alt: "Floating oak vanity against a glossy butter-yellow tile wall with a round brass mirror.",
  },
  {
    src: "/images/home/sage-tile-tub.webp",
    alt: "Sage handmade tile shower with a frameless glass door beside a freestanding tub.",
  },
  {
    src: "/images/ai/ss-tub-walls.webp",
    alt: "Alcove tub with a seamless white solid surface surround with soft veining and two recessed shelves.",
  },
  {
    src: "/images/home/bookmatch-stone.webp",
    alt: "Curbless shower with book-matched stone-look walls, a lit niche, a floating bench and brass fixtures.",
  },
  {
    src: "/images/home/blush-tile.webp",
    alt: "Blush handmade tile shower with a cross-handle valve, a niche and a frameless glass door.",
  },
  {
    src: "/images/hero/hero-35-1600.webp",
    alt: "Walk-in shower in glossy teal tile with a niche, brass fixtures and a white bench outside the glass.",
  },
  {
    src: "/images/home/marble-glass.webp",
    alt: "Shower with a marble-look back wall, white subway-style side walls, a long niche and a frameless glass door.",
  },
] as const;

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

  const items = [...LOOKS, ...LOOKS];

  return (
    <section aria-labelledby="shop-looks-heading" className="rise scroll-mt-28 bg-[#fffaf3] py-14 md:py-20">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-end justify-between gap-4 px-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brass">Shop by look</p>
          <h2 id="shop-looks-heading" className="mt-3 text-3xl leading-[1.1] md:text-5xl">
            Find a starting point.
          </h2>
        </div>
        <Link href="/design" className="shrink-0 text-sm font-semibold underline underline-offset-4">
          Design my bathroom →
        </Link>
      </div>
      <div
        ref={scrollerRef}
        className="looks-scroller mt-8 flex gap-[0.9rem] overflow-x-auto px-5 pb-3 scroll-px-5 snap-x snap-mandatory"
        tabIndex={0}
        aria-label="Looks you can start from"
      >
        {items.map((look, index) => {
          const duplicate = index >= LOOKS.length;
          return (
            <Link
              key={`${look.label}-${index}`}
              href={look.href}
              className="group w-[11.5rem] shrink-0 snap-start sm:w-[13.5rem]"
              tabIndex={duplicate ? -1 : undefined}
              aria-hidden={duplicate || undefined}
            >
              <span className="relative block aspect-[4/5] overflow-hidden rounded-[1.2rem] bg-muted">
                <Image
                  src={look.src}
                  alt={duplicate ? "" : look.alt}
                  fill
                  sizes="(min-width: 640px) 216px, 184px"
                  loading="lazy"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
              </span>
              <span className="mt-2.5 block text-[0.95rem] font-medium">{look.label}</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export function InspiringRow() {
  return (
    <section aria-labelledby="inspiring-heading" className="rise scroll-mt-28 bg-[#eae6d8] py-14 md:py-20">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-end justify-between gap-4 px-5">
        <h2 id="inspiring-heading" className="text-3xl leading-[1.1] md:text-5xl">
          New & inspiring
        </h2>
        <Link href="/design" className="shrink-0 text-sm font-semibold underline underline-offset-4">
          Design my bathroom →
        </Link>
      </div>
      <div className="looks-scroller mt-8 flex gap-4 overflow-x-auto px-5 pb-3 scroll-px-5 snap-x snap-mandatory">
        {INSPIRING.map((photo) => (
          <Link
            key={photo.src}
            href="/design"
            className="relative aspect-[4/5] w-[16.5rem] shrink-0 snap-start overflow-hidden rounded-[1.3rem] bg-muted sm:w-[20rem]"
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="(min-width: 640px) 320px, 264px"
              loading="lazy"
              className="object-cover transition-transform duration-700 hover:scale-[1.03]"
            />
          </Link>
        ))}
      </div>
    </section>
  );
}
