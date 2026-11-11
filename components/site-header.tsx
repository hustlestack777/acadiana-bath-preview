"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { MaisonLogo } from "@/components/logo";
import { brand, hero } from "@/lib/copy";
import { cn } from "cn";
import { ConsultLink } from "@/components/consult-link";

const LINKS = [
  { href: "#gallery", label: "Gallery" },
  { href: "#surface", label: "The surface" },
  { href: "#process", label: "How it works" },
  { href: "#area", label: "Service area" },
  { href: "#questions", label: "Questions" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const home = pathname === "/";
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
    return pathname === "/" ? hash : `/${hash}`;
  }

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-colors duration-300",
        overHero ? "bg-transparent text-[#fbf6f2]" : "border-b border-border bg-background/95 text-foreground backdrop-blur-md",
      )}
    >
      <a className="skip-link" href="#content">
        Skip to content
      </a>
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 py-3">
        <Link href="/" aria-label={brand.name} className={cn("min-w-0", overHero ? "text-[#fbf6f2]" : undefined)}>
          <MaisonLogo compact onDark={overHero} className="sm:hidden" />
          <MaisonLogo onDark={overHero} className="hidden sm:inline-flex" />
        </Link>
        <nav className="hidden items-center gap-5 lg:flex" aria-label="Primary">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={hrefFor(link.href)}
              className={cn("text-sm", overHero ? "text-white/85 hover:text-white" : "text-muted-foreground hover:text-foreground")}
            >
              {link.label}
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
          <ConsultLink
            className="hidden h-11 items-center justify-center rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground md:inline-flex"
          >
            {hero.primary}
          </ConsultLink>
        </div>
        <button
          type="button"
          className={cn(
            "inline-flex size-11 shrink-0 items-center justify-center rounded-full border md:hidden",
            consult && "hidden",
            overHero ? "border-white/40 bg-black/20 text-white" : "border-border bg-card",
          )}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-hidden={open}
          tabIndex={open ? -1 : 0}
          onClick={() => setOpen((value) => !value)}
        >
          <span className="sr-only">Open menu</span>
          <Menu />
        </button>
      </div>
      {open ? (
        <div id="mobile-nav" className="fixed inset-0 z-50 overflow-y-auto bg-background px-5 py-4 text-foreground md:hidden">
          <div className="flex items-center justify-between">
            <MaisonLogo />
            <button
              type="button"
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
                onClick={() => setOpen(false)}
                className="rounded-xl px-2 py-3 text-lg"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-6 grid gap-3 border-t border-border pt-6 text-base">
            <a href={brand.phoneHref} className="font-medium">
              {brand.phone}
            </a>
            <a href={brand.websiteHref} className="underline underline-offset-4">
              {brand.website}
            </a>
            <ConsultLink
              onClick={() => setOpen(false)}
              className="inline-flex h-12 items-center justify-center rounded-full bg-primary text-base font-medium text-primary-foreground"
            >
              {hero.primary}
            </ConsultLink>
          </div>
        </div>
      ) : null}
    </header>
  );
}
