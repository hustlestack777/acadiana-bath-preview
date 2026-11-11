import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { brand, hero, heroDesignCta, ideas, priceRange, solidPath, tilePath, trustLine } from "@/lib/copy";
import type { Photo } from "@/lib/images";
import { cn } from "cn";
import { ConsultLink } from "@/components/consult-link";
import { IdeaCarousel } from "@/components/idea-carousel";

/** Full-bleed photo hero used by both paths. */
export function PathHero({
  image,
  alt,
  eyebrow,
  title,
  support,
  cta: _cta,
  ctaHref: _ctaHref,
  position = "center",
  children,
}: {
  position?: string;
  image: string;
  alt: string;
  eyebrow: string;
  title: string;
  support: string;
  cta: string;
  ctaHref: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative min-h-[92svh] overflow-hidden bg-[#14261f] text-[#f6f1e6]" aria-label="Introduction">
      <Image src={image} alt={alt} fill priority sizes="100vw" className="hero-ken object-cover" style={{ objectPosition: position }} />
      <div className="hero-scrim absolute inset-0" aria-hidden="true" />
      <div className="relative z-10 mx-auto flex min-h-[92svh] w-full max-w-6xl flex-col justify-end px-5 pb-28 pt-24 md:pb-16">
        <p className="hero-copy text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[#e4d8b4]">{eyebrow}</p>
        <h1 className="hero-copy mt-3 max-w-4xl font-heading text-[clamp(2.15rem,7vw,6.6rem)] leading-[0.95] font-medium">{title}</h1>
        <p className="hero-copy mt-3 max-w-xl text-base leading-7 sm:mt-5 sm:text-lg sm:leading-8">{support}</p>
        <div className="mt-5 flex flex-col gap-3 sm:mt-8 sm:flex-row">
          <ConsultLink className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-8 text-base font-semibold text-primary-foreground shadow-xl shadow-black/30 transition-transform hover:-translate-y-0.5 sm:h-14">
            {hero.primary}
          </ConsultLink>
          <Link
            href="/design"
            className="inline-flex h-12 items-center justify-center rounded-full border border-white/75 bg-black/15 px-8 text-base font-medium text-white backdrop-blur-sm hover:bg-white/10 sm:h-14"
          >
            {heroDesignCta}
          </Link>
        </div>
        <a href={brand.phoneHref} className="hero-copy mt-3 inline-block text-sm font-semibold text-[#f6f1e6] underline underline-offset-4">
          {brand.phone}
        </a>
        <p className="hero-copy mt-3 max-w-xl text-sm text-[#e4d8b4]">{trustLine}</p>
        <p className="hero-copy mt-2 max-w-xl text-sm leading-6 text-white/90" data-testid="price-range">{priceRange}</p>
        {children}
      </div>
    </section>
  );
}

/** Look grid. Titled "Looks we can build" so it never reads as past jobs; no per-image captions. */
export function ExampleGrid({ photos, className, title }: { photos: Photo[]; className?: string; title?: string }) {
  return (
    <figure className={className}>
      {title ? <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-brass">{title}</p> : null}
      <ul className="grid grid-cols-2 gap-3 md:grid-cols-12">
        {photos.map((photo, index) => (
          <li
            key={photo.src + index}
            className={cn(
              "relative overflow-hidden rounded-[1.2rem] bg-muted",
              index === 0 ? "col-span-2 aspect-[16/10] md:col-span-7 md:row-span-2 md:aspect-auto" : "aspect-[4/3] md:col-span-5 md:aspect-[16/11]",
              index > 2 && restSpan(index - 3, photos.length - 3),
            )}
          >
            <Image src={photo.src} alt={photo.alt} fill sizes="(min-width: 768px) 45vw, 50vw" className="object-cover transition-transform duration-700 hover:scale-[1.03]" />
          </li>
        ))}
      </ul>
    </figure>
  );
}

/** Two big path cards. Used on home. */
export function PathChooser() {
  const cards = [
    { ...solidPath, image: "/images/ai/ss-walkin.webp", alt: "Warm-white solid surface walk-in shower with frameless glass and brass fixtures.", tag: "Affordable · Fewer grout lines" },
    { ...tilePath, image: "/images/home/tile-card.webp", alt: "Tiled walk-in shower through an arched opening, with two arched niches, a bench, and brass fixtures.", tag: "Designer · Fully custom" },
  ];
  return (
    <section id="paths" className="rise scroll-mt-28 mx-auto w-full max-w-6xl px-5 py-20 md:py-28">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brass">Choose your path</p>
      <h2 className="mt-3 max-w-3xl text-4xl leading-[1.05] md:text-6xl">Two ways to a bathroom you love.</h2>
      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {cards.map((card) => (
          <Link
            key={card.slug}
            href={card.slug}
            className="group relative block overflow-hidden rounded-[1.8rem] bg-[#14261f] text-[#f6f1e6] shadow-[0_40px_90px_-50px_rgba(28,36,28,0.8)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
          >
            <div className="relative aspect-[4/5] sm:aspect-[5/4]">
              <Image src={card.image} alt={card.alt} fill sizes="(min-width: 768px) 50vw, 100vw" loading="lazy" className="object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#14261f]/95 via-[#14261f]/35 to-transparent" aria-hidden="true" />
            </div>
            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-[#e4d8b4]">{card.tag}</p>
              <h3 className="mt-2 font-heading text-4xl leading-none sm:text-5xl">{card.cardTitle}</h3>
              <p className="mt-3 max-w-md text-[0.95rem] leading-7 text-white/85">{card.cardBody}</p>
              <span className="mt-5 inline-flex h-12 items-center rounded-full bg-[#f6f1e6] px-6 text-sm font-semibold text-[#1c241c] transition-transform group-hover:translate-x-1">
                {card.cta} →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

/** Finishing-touch ideas. Outbound links only; no dealer or partner claim. */
export function IdeasSection({ only }: { only?: string[] }) {
  const items = only ? ideas.items.filter((item) => only.includes(item.name)) : ideas.items;
  return (
    <section id="ideas" className="rise scroll-mt-28 bg-[#eae6d8]">
      <div className="mx-auto w-full max-w-6xl px-5 py-20 md:py-28">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brass">{ideas.eyebrow}</p>
        <h2 className="mt-3 max-w-3xl text-4xl md:text-6xl">{ideas.title}</h2>
        <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">{ideas.body}</p>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {items.map((item) => (
            <li key={item.name} className="overflow-hidden rounded-[1.4rem] border border-border bg-card">
              <IdeaCarousel slides={item.images} label={`${item.topic} from ${item.name}`} />
              <div className="p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brass">{item.topic}</p>
                <p className="mt-2 text-sm leading-6">{item.body}</p>
                <a href={item.href} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-sm font-medium underline underline-offset-4">
                  Ideas from {item.name} ↗
                </a>
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-1 text-xs text-muted-foreground">{ideas.note}</p>
      </div>
    </section>
  );
}

function restSpan(position: number, rest: number) {
  if (rest % 3 === 0) return "md:col-span-4 md:aspect-[4/3]";
  if (rest % 2 === 0) return "md:col-span-6 md:aspect-[16/10]";
  return position < rest - 2 ? "md:col-span-4 md:aspect-[4/3]" : "md:col-span-6 md:aspect-[16/10]";
}
