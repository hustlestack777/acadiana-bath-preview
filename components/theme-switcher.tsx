"use client";

import { useLayoutEffect, useSyncExternalStore } from "react";
import { cn } from "cn";

export const THEMES = [
  { id: "bayou", label: "Bayou", hint: "Lagoon, clay, and fig", swatch: "#173844" },
  { id: "marigold", label: "Marigold", hint: "Cocoa, gold, and teal", swatch: "#9a3412" },
  { id: "indigo", label: "Indigo", hint: "Plum, brass, and spruce", swatch: "#5b2a6a" },
] as const;

export type ThemeId = (typeof THEMES)[number]["id"];

const STORAGE_KEY = "ab-theme";
const listeners = new Set<() => void>();

function isTheme(value: string | null): value is ThemeId {
  return value === "bayou" || value === "marigold" || value === "indigo";
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function snapshot(): ThemeId {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return isTheme(stored) ? stored : "bayou";
  } catch {
    return "bayou";
  }
}

export function applyTheme(theme: ThemeId) {
  document.documentElement.setAttribute("data-theme", theme);
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    /* private mode */
  }
  listeners.forEach((listener) => listener());
}

export function ThemeSwitcher({ className }: { className?: string }) {
  const theme = useSyncExternalStore(subscribe, snapshot, () => "bayou");

  useLayoutEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <div className={cn("flex items-center gap-1", className)} role="group" aria-label="Color theme">
      <span className="mr-1 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Palette</span>
      {THEMES.map((item) => (
        <button
          key={item.id}
          type="button"
          aria-pressed={theme === item.id}
          title={`${item.label}: ${item.hint}`}
          onClick={() => applyTheme(item.id)}
          className={cn(
            "size-8 rounded-full border-2",
            theme === item.id ? "border-foreground" : "border-transparent",
          )}
          style={{ background: item.swatch }}
        >
          <span className="sr-only">{item.label}</span>
        </button>
      ))}
    </div>
  );
}
