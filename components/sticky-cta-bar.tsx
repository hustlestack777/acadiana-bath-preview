"use client";

import { useLayoutEffect, useState } from "react";
import { ConsultLink } from "@/components/consult-link";
import { DesignLink } from "@/components/design-link";
import { brand, hero, heroDesignCta } from "@/lib/copy";

/**
 * Mobile quote bar. Hidden while the home-hero CTAs are still on screen
 * so the same two buttons are not shown twice. Other pages show it immediately.
 */
export function StickyCtaBar() {
  const [visible, setVisible] = useState(false);

  useLayoutEffect(() => {
    const quote = document.querySelector("[data-testid=hero-cta]");
    const target = quote?.closest("[data-hero-ctas]") ?? quote;

    function setShown(show: boolean) {
      setVisible(show);
      if (show) document.documentElement.dataset.stickyCta = "true";
      else delete document.documentElement.dataset.stickyCta;
    }

    if (!target) {
      setShown(true);
      return () => {
        delete document.documentElement.dataset.stickyCta;
      };
    }

    const io = new IntersectionObserver(
      ([entry]) => setShown(!entry.isIntersecting),
      { threshold: 0 },
    );
    io.observe(target);
    return () => {
      io.disconnect();
      delete document.documentElement.dataset.stickyCta;
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      data-sticky-cta-bar=""
      className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur md:hidden"
    >
      <div className="grid grid-cols-2 gap-2">
        <ConsultLink className="inline-flex h-12 items-center justify-center rounded-full bg-bronze px-3 text-center text-sm font-semibold text-bronze-foreground hover:bg-bronze-hover">
          {hero.primary}
        </ConsultLink>
        <DesignLink className="inline-flex h-12 items-center justify-center rounded-full border border-border bg-card px-3 text-center text-sm font-semibold">
          {heroDesignCta}
        </DesignLink>
      </div>
      <a href={brand.phoneHref} className="mt-1.5 block text-center text-xs font-semibold tracking-wide">
        {brand.phone}
      </a>
    </div>
  );
}
