"use client";

import { useEffect, useRef, type RefObject } from "react";

const GAP_PX = 8;

/** Height of the fixed site header, plus a small gap. */
export function headerOffset(): number {
  const header = document.querySelector("header");
  return Math.ceil((header?.getBoundingClientRect().height ?? 88) + GAP_PX);
}

/**
 * Scroll a step container so its top sits just below the fixed header, then
 * move focus to the step heading without causing a second jump.
 */
export function scrollStepIntoView(container: HTMLElement | null) {
  if (!container) return;
  const heading =
    container.querySelector<HTMLElement>("[data-step-heading]") ??
    container.querySelector<HTMLElement>("h1, h2, h3, legend");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const top = Math.max(0, container.getBoundingClientRect().top + window.scrollY - headerOffset());
  window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
  if (heading) {
    if (!heading.hasAttribute("tabindex")) heading.tabIndex = -1;
    heading.focus({ preventScroll: true });
  }
}

/** After the first render, scroll and focus on every step change. */
export function useScrollToStep(step: unknown, containerRef: RefObject<HTMLElement | null>) {
  const isFirst = useRef(true);
  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    let inner = 0;
    const outer = window.requestAnimationFrame(() => {
      inner = window.requestAnimationFrame(() => {
        scrollStepIntoView(containerRef.current);
      });
    });
    return () => {
      window.cancelAnimationFrame(outer);
      window.cancelAnimationFrame(inner);
    };
  }, [step, containerRef]);
}
