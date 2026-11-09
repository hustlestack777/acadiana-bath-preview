"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { MaisonLogo } from "@/components/logo";
import { brand, hero } from "@/lib/copy";
import { cn } from "cn";

const LINKS = [
  { href: "#surface", label: "The surface" },
  { href: "#finishes", label: "Finishes" },
  { href: "#gallery", label: "Gallery" },
  { href: "#process", label: "How it works" },
  { href: "#area", label: "Service area" },
  { href: "#questions", label: "Questions" },
];

export function SiteHeader({ overlay = false }: { overlay?: boolean }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
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
        "sticky top-0 z-40 transition-colors duration-300",
        open
          ? "border-b border-transparent bg-transparent"
          : overlay && !scrolled
            ? "border-b border-transparent bg-transparent"
            : "border-b border-border bg-background/92 backdrop-blur-md",
      )}
    >
      <a className="skip-link" href="#content">
        Skip to content
      </a>
      <div className="mx-auto w-full max-w-6xl px-5">
        <div className="flex items-center justify-between gap-3 py-3">
          <Link href="/" aria-label={brand.name}>
            <MaisonLogo compact className="sm:hidden" />
            <MaisonLogo className="hidden sm:inline-flex" />
          </Link>
          <div className="hidden items-center gap-3 md:flex">
            <a href={brand.phoneHref} className="text-sm font-medium text-foreground">
              {brand.phone}
            </a>
            <Link
              href="/estimate"
              className={cn(buttonVariants({ variant: "default" }), "h-11 rounded-full px-5 text-sm")}
            >
              {hero.primary}
            </Link>
          </div>
          <button
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-xl border border-border bg-card md:hidden"
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
        <nav className="hidden items-center gap-5 pb-3 md:flex" aria-label="Primary">
          {LINKS.map((link) => (
            <Link key={link.href} href={hrefFor(link.href)} className="text-sm text-muted-foreground hover:text-foreground">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
      {open ? (
        <div id="mobile-nav" className="fixed inset-0 z-50 overflow-y-auto bg-background px-5 py-4 md:hidden">
          <div className="flex items-center justify-between">
            <MaisonLogo />
            <button
              type="button"
              className="inline-flex size-11 items-center justify-center rounded-xl border border-border"
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
            <Link
              href="/estimate"
              onClick={() => setOpen(false)}
              className={cn(buttonVariants({ variant: "default" }), "h-12 rounded-xl text-base")}
            >
              {hero.primary}
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
