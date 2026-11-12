"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/** Instantly land on a hash target, ignoring the site-wide smooth scroll
 *  so late image layout cannot leave the heading mid-page. */
export function scrollToHashId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const html = document.documentElement;
  const prev = html.style.scrollBehavior;
  html.style.scrollBehavior = "auto";
  el.scrollIntoView({ behavior: "auto", block: "start" });
  html.style.scrollBehavior = prev;
}

export function scheduleHashScroll(id?: string) {
  const go = () => {
    const target = id ?? window.location.hash.replace(/^#/, "");
    if (target) scrollToHashId(target);
  };
  go();
  const timers = [50, 400, 900].map((ms) => window.setTimeout(go, ms));
  return () => timers.forEach((t) => window.clearTimeout(t));
}

/** After a client navigation (or a retry once images have laid out),
 *  land the URL hash so the target heading sits under the fixed header. */
export function HashScroll() {
  const pathname = usePathname();

  useEffect(() => {
    const cancel = scheduleHashScroll();
    const onHash = () => {
      cancel();
      scheduleHashScroll();
    };
    window.addEventListener("hashchange", onHash);
    return () => {
      cancel();
      window.removeEventListener("hashchange", onHash);
    };
  }, [pathname]);

  return null;
}
