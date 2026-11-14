"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Menu, X } from "lucide-react";
import { MaisonLogo } from "@/components/logo";
import { brand, hero, heroDesignCta } from "@/lib/copy";
import { cn } from "cn";
import { ConsultLink } from "@/components/consult-link";
import { DesignLink } from "@/components/design-link";
import { scheduleHashScroll } from "@/components/hash-scroll";
import { SocialLinks } from "@/components/social-link";

const LINKS = [
  { href: "/solid-surface", label: "Solid surface", shortLabel: "Solid Surface" },
  { href: "/custom-tile", label: "Custom tile", shortLabel: "Tile" },
  { href: "/custom-tile#grout", label: "Grout colors", shortLabel: "Grout" },
  { href: "/#ideas", label: "Ideas" },
  { href: "/gallery", label: "Gallery" },
  { href: "/faq", label: "FAQ" },
  { href: "/about", label: "About" },
];

export function SiteHeader({ offset = false }: { offset?: boolean }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const home = pathname === "/" || pathname === "/solid-surface" || pathname === "/custom-tile" || pathname === "/walk-in-shower-lafayette";
  const consult = pathname === "/estimate";
  const overHero = home && !scrolled && !open;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  function hrefFor(hash: string) {
    if (hash.startsWith("/")) return hash;
    return pathname === "/" ? hash : `/${hash}`;
  }

  function goHome(event: { preventDefault: () => void }) {
    if (pathname !== "/") return;
    event.preventDefault();
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    if (window.location.hash || window.location.search || window.location.pathname !== "/") {
      window.history.replaceState(null, "", "/");
    }
  }

  function onNavClick(event: { preventDefault: () => void }, href: string) {
    setOpen(false);
    const hashAt = href.indexOf("#");
    if (hashAt === -1) return;
    const path = href.slice(0, hashAt) || "/";
    const id = href.slice(hashAt + 1);
    if (path !== pathname) return;
    event.preventDefault();
    if (window.location.hash !== `#${id}`) {
      window.history.pushState(null, "", href);
    }
    scheduleHashScroll(id);
  }

  return (
    <header
      className={cn(
        "fixed inset-x-0 z-40 transition-colors duration-300",
        offset ? "top-10" : "top-0",
        overHero
          ? "bg-gradient-to-b from-black/80 via-black/55 to-transparent text-[#f6f1e6]"
          : "border-b border-border bg-background/95 text-foreground backdrop-blur-md",
      )}
    >
      <a className="skip-link" href="#content">
        Skip to content
      </a>
      <div className={cn("mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-5 sm:gap-4", scrolled ? "py-2" : "py-3 sm:py-3.5")}>
        <Link href="/" aria-label={brand.name} className={cn("min-w-0", overHero ? "text-[#f6f1e6]" : undefined)} onClick={goHome}>
          <MaisonLogo compact className="md:hidden" onDark={overHero} />
          <MaisonLogo compact={!overHero} onDark={overHero} className="hidden md:inline-flex" />
        </Link>
        <nav className="hidden items-center gap-4 lg:flex" aria-label="Primary">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={hrefFor(link.href)}
              scroll={!link.href.includes("#")}
              onClick={(event) => onNavClick(event, hrefFor(link.href))}
              className={cn(
                "whitespace-nowrap text-[13px]",
                overHero ? "text-white hover:text-white" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {"shortLabel" in link ? link.shortLabel : link.label}
            </Link>
          ))}
        </nav>
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <a
            href={brand.phoneHref}
            className={cn(
              "text-[13px] font-semibold whitespace-nowrap sm:text-sm",
              !consult && "max-md:hidden",
              overHero ? "text-white" : "text-foreground",
            )}
          >
            {brand.phone}
          </a>
          <DesignLink
            className={cn(
              "hidden h-11 items-center justify-center whitespace-nowrap rounded-full border px-4 text-sm font-medium md:inline-flex",
              overHero ? "border-white/70 text-white hover:bg-white/10" : "border-border bg-card",
            )}
          >
            {heroDesignCta}
          </DesignLink>
          <ConsultLink
            className="hidden h-11 items-center justify-center rounded-full bg-bronze px-4 text-sm font-medium text-bronze-foreground hover:bg-bronze-hover md:inline-flex"
          >
            {hero.primary}
          </ConsultLink>
        </div>
        <SocialLinks
          className="shrink-0 md:hidden"
          itemClassName={overHero ? "border-white/40 bg-black/20 text-white" : "border-border bg-card text-foreground"}
        />
        <button
          type="button"
          className={cn(
            "inline-flex size-11 shrink-0 items-center justify-center rounded-full border md:hidden",
            consult && "hidden",
            overHero ? "border-white/40 bg-black/20 text-white" : "border-border bg-card",
          )}
          aria-expanded={open}
          aria-controls="mobile-nav"
          tabIndex={open ? -1 : 0}
          onClick={() => setOpen((value) => !value)}
        >
          <span className="sr-only">Open menu</span>
          <Menu />
        </button>
      </div>
      {/* Portal to <body>: the header's backdrop-blur makes it the containing block for fixed children, which clipped this panel to the header height. */}
      {open && typeof document !== "undefined" ? createPortal(
        <div id="mobile-nav" className="fixed inset-0 z-50 overflow-y-auto bg-background px-5 py-4 text-foreground md:hidden">
          <div className="flex items-center justify-between">
            <Link href="/" aria-label={brand.name} onClick={(event) => { goHome(event); setOpen(false); }}>
              <MaisonLogo />
            </Link>
            <button
              type="button"
              autoFocus
              className="inline-flex size-11 items-center justify-center rounded-full border border-border"
              onClick={() => setOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <X />
            </button>
          </div>
          <nav className="mt-8 grid gap-1" aria-label="Mobile">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={hrefFor(link.href)}
                scroll={!link.href.includes("#")}
                onClick={(event) => onNavClick(event, hrefFor(link.href))}
                className="rounded-xl px-2 py-3 text-lg"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-6 grid gap-3 border-t border-border pt-6 text-base">
            <ConsultLink
              onClick={() => setOpen(false)}
              className="inline-flex h-12 items-center justify-center rounded-full bg-bronze text-base font-medium text-bronze-foreground hover:bg-bronze-hover"
            >
              {hero.primary}
            </ConsultLink>
            <DesignLink
              onClick={() => setOpen(false)}
              className="inline-flex h-12 items-center justify-center whitespace-nowrap rounded-full border border-border bg-card text-base font-medium"
            >
              {heroDesignCta}
            </DesignLink>
            <a href={brand.phoneHref} className="text-center text-sm font-semibold">
              {brand.phone}
            </a>
            <SocialLinks className="justify-center" itemClassName="border-border bg-card text-foreground" />
          </div>
        </div>,
        document.body,
      ) : null}
    </header>
  );
}
