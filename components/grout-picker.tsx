"use client";

import Image from "next/image";
import { useState } from "react";
import { GROUT_COLORS, GROUT_FAMILIES, GROUT_PICK_EVENT, MAPEI_PALETTE_URL, groutLabel } from "@/lib/grout";
import { tilePath } from "@/lib/copy";
import { cn } from "cn";

/** Mapei palette picker. Previews the pick as a grout grid and sends it to the tile form. */
export function GroutPicker() {
  const [code, setCode] = useState("5047");
  const [tile, setTile] = useState<"white" | "sage" | "clay">("white");
  const pick = GROUT_COLORS.find((color) => color.code === code) ?? GROUT_COLORS[0];
  const tiles = { white: "#f4f1ea", sage: "#a9b89c", clay: "#c98a6b" } as const;

  function choose(next: string) {
    setCode(next);
    window.dispatchEvent(new CustomEvent(GROUT_PICK_EVENT, { detail: next }));
  }

  return (
    <div className="mt-10 grid gap-8 lg:grid-cols-12">
      <div className="lg:col-span-5">
        <div
          className="relative aspect-square overflow-hidden rounded-[1.6rem] border border-border shadow-[0_30px_80px_-40px_rgba(44,33,28,0.5)]"
          style={{ backgroundColor: pick.hex }}
          aria-hidden="true"
        >
          <div
            className="absolute inset-0 grid grid-cols-6 gap-[6px] p-[6px]"
            style={{ backgroundColor: pick.hex }}
          >
            {Array.from({ length: 36 }).map((_, index) => (
              <span
                key={index}
                className="rounded-[3px]"
                style={{
                  backgroundColor: tiles[tile],
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.45), inset 0 -6px 12px rgba(0,0,0,0.06)",
                  filter: `brightness(${0.94 + ((index * 37) % 11) / 100})`,
                }}
              />
            ))}
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-lg">
            <span className="font-medium">{groutLabel(pick)}</span>
          </p>
          <div className="flex gap-2" role="group" aria-label="Preview tile color">
            {(Object.keys(tiles) as Array<keyof typeof tiles>).map((key) => (
              <button
                key={key}
                type="button"
                aria-pressed={tile === key}
                onClick={() => setTile(key)}
                className={cn("h-10 rounded-full border px-3 text-sm capitalize", tile === key ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card")}
              >
                {key} tile
              </button>
            ))}
          </div>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">{tilePath.groutNote}</p>
        <a href="#tile-quote" onClick={() => choose(code)} className="mt-4 inline-flex h-12 items-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground">
          Use this color in my tile request
        </a>
      </div>

      <div className="lg:col-span-7">
        {GROUT_FAMILIES.map((family) => (
          <div key={family} className="mb-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brass">{family}</p>
            <ul className="mt-2 grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8">
              {GROUT_COLORS.filter((color) => color.family === family).map((color) => (
                <li key={color.code}>
                  <button
                    type="button"
                    onClick={() => choose(color.code)}
                    aria-pressed={color.code === code}
                    aria-label={groutLabel(color)}
                    title={groutLabel(color)}
                    className={cn(
                      "group block w-full rounded-xl border bg-card p-1 text-left transition-shadow focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                      color.code === code ? "border-primary ring-2 ring-primary" : "border-border hover:shadow-md",
                    )}
                  >
                    <span className="block aspect-[4/3] rounded-lg" style={{ backgroundColor: color.hex }} />
                    <span className="mt-1 block truncate px-0.5 text-[0.68rem] leading-4">{color.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <p className="text-xs leading-5 text-muted-foreground">
          Color names from the{" "}
          <a href={MAPEI_PALETTE_URL} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
            Mapei 2023 grout and caulk palette
          </a>
          . Swatches are approximate on screen and depend on your display, the tile, and the light in your room.
        </p>
      </div>
      <div className="lg:col-span-12">
        <figure className="grid gap-3 md:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[1.4rem]">
            <Image src="/images/ai/grout-charcoal.webp" alt="White handmade zellige shower wall with contrasting charcoal grout and a brass valve." fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-[1.4rem]">
            <Image src="/images/ai/tile-01.webp" alt="Deep-green zellige shower with grout that blends into the tile." fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
          </div>
          <figcaption className="text-sm text-muted-foreground md:col-span-2">
            Contrast grout draws the grid (left). Matching grout keeps the wall calm (right). Examples of what your remodel could look like.
          </figcaption>
        </figure>
      </div>
    </div>
  );
}
