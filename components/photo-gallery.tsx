"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Photo } from "@/lib/images";

export function PhotoGallery({ photos }: { photos: Photo[] }) {
  const [active, setActive] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const photo = active === null ? null : photos[active];

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (active === null) {
      if (dialog.open) dialog.close();
      return;
    }
    if (!dialog.open) dialog.showModal();
  }, [active]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onClose = () => setActive(null);
    dialog.addEventListener("close", onClose);
    return () => dialog.removeEventListener("close", onClose);
  }, []);

  function step(delta: number) {
    setActive((current) => {
      if (current === null) return current;
      return (current + delta + photos.length) % photos.length;
    });
  }

  return (
    <>
      <ul className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-12">
        {photos.map((item, index) => (
          <li key={item.src} className={spanFor(index)}>
            <figure className="group h-full">
              <button
                type="button"
                className="relative block h-full w-full overflow-hidden rounded-2xl bg-[#14261f] text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                onClick={() => setActive(index)}
              >
                <span className={frameFor(index)}>
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                </span>
              </button>
            </figure>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        className="m-auto w-[min(96vw,1100px)] max-w-none border-0 bg-transparent p-0 text-[#f6f1e6] backdrop:bg-[#14261f]/80"
        aria-label={photo ? photo.caption : "Photograph"}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") {
            event.preventDefault();
            step(1);
          }
          if (event.key === "ArrowLeft") {
            event.preventDefault();
            step(-1);
          }
        }}
      >
        {photo ? (
          <div className="overflow-hidden rounded-2xl bg-[#1a3028]">
            <div className="relative aspect-[4/5] bg-black sm:aspect-[16/10]">
              <Image src={photo.src} alt={photo.alt} fill sizes="96vw" className="object-contain" />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
              <span />
              <div className="flex gap-2">
                <button type="button" className="h-10 rounded-full border border-white/30 px-4 text-sm" onClick={() => step(-1)}>
                  Previous
                </button>
                <button type="button" className="h-10 rounded-full border border-white/30 px-4 text-sm" onClick={() => step(1)}>
                  Next
                </button>
                <button
                  type="button"
                  className="h-10 rounded-full bg-[#f6f1e6] px-4 text-sm text-[#1c241c]"
                  onClick={() => dialogRef.current?.close()}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </dialog>
    </>
  );
}

function spanFor(index: number) {
  const spans = [
    "lg:col-span-7",
    "lg:col-span-5",
    "lg:col-span-4",
    "lg:col-span-4",
    "lg:col-span-4",
    "lg:col-span-5",
    "lg:col-span-7",
    "lg:col-span-6",
    "lg:col-span-6",
    "lg:col-span-12",
  ];
  return spans[index] ?? "lg:col-span-4";
}

function frameFor(index: number) {
  if (index === 0 || index === 6) return "relative block aspect-[4/3] w-full lg:aspect-auto lg:h-full";
  if (index === 9) return "relative block aspect-[16/8] w-full";
  return "relative block aspect-[4/5] w-full sm:aspect-[3/4]";
}
