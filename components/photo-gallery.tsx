"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Photo } from "@/lib/photos";
import { cn } from "cn";

export function PhotoGallery({
  photos,
  layout = "grid",
}: {
  photos: Photo[];
  layout?: "grid" | "rail";
}) {
  const [index, setIndex] = useState<number | null>(null);

  return (
    <>
      <ul
        className={
          layout === "rail"
            ? "flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-6 md:overflow-visible"
            : "grid grid-cols-2 gap-3 md:grid-cols-6 md:gap-4"
        }
      >
        {photos.map((photo, photoIndex) => (
          <li
            key={photo.src}
            className={cn(layout === "rail" ? "w-[72%] shrink-0 snap-start sm:w-[44%] md:w-auto" : photo.span)}
          >
            <button
              type="button"
              className="group block w-full text-left"
              onClick={() => setIndex(photoIndex)}
              aria-haspopup="dialog"
            >
              <span className="relative block overflow-hidden rounded-[1.25rem] bg-[#e7d7c8]">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  width={photo.width}
                  height={photo.height}
                  sizes={layout === "rail" ? "(min-width: 768px) 16vw, 72vw" : "(min-width: 768px) 33vw, 50vw"}
                  className="photo-zoom aspect-[3/4] w-full object-cover"
                />
              </span>
              <span className="mt-2 block text-xs leading-5 tracking-wide text-muted-foreground">{photo.caption}</span>
            </button>
          </li>
        ))}
      </ul>
      {index !== null ? (
        <Lightbox photos={photos} index={index} onIndex={setIndex} onClose={() => setIndex(null)} />
      ) : null}
    </>
  );
}

function Lightbox({
  photos,
  index,
  onIndex,
  onClose,
}: {
  photos: Photo[];
  index: number;
  onIndex: (index: number) => void;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const photo = photos[index];

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (!dialog.open) dialog.showModal();
  }, [index]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "ArrowRight") onIndex((index + 1) % photos.length);
      if (event.key === "ArrowLeft") onIndex((index - 1 + photos.length) % photos.length);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [index, onIndex, photos.length]);

  if (!photo) return null;

  return (
    <dialog
      ref={dialogRef}
      className="fixed inset-0 m-0 h-full max-h-none w-full max-w-none border-0 bg-[#241810]/92 p-0 text-[#fbf6f2] backdrop:bg-black/70"
      aria-label={photo.caption}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === dialogRef.current) dialogRef.current?.close();
      }}
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#e7c3a8]">
            {index + 1} / {photos.length}
          </p>
          <button
            type="button"
            className="inline-flex h-11 items-center rounded-full border border-white/25 px-4 text-sm"
            onClick={() => dialogRef.current?.close()}
            autoFocus
          >
            Close
          </button>
        </div>
        <div className="flex min-h-0 flex-1 items-center justify-center px-4">
          <Image
            src={photo.src}
            alt={photo.alt}
            width={photo.width}
            height={photo.height}
            sizes="92vw"
            className="max-h-[72vh] w-auto max-w-full rounded-xl object-contain"
          />
        </div>
        <div className="grid gap-4 px-4 py-4 sm:grid-cols-[1fr_auto] sm:items-end sm:px-6 sm:pb-6">
          <div>
            <p className="font-heading text-2xl">{photo.caption}</p>
            <p className="mt-1 max-w-xl text-sm leading-6 text-[#f0d5de]">
              Published by the Onyx Collection. Not a completed job by Acadiana Bathrooms and Countertops.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              className="h-11 rounded-full border border-white/25 px-4 text-sm"
              onClick={() => onIndex((index - 1 + photos.length) % photos.length)}
            >
              Previous
            </button>
            <button
              type="button"
              className="h-11 rounded-full bg-[#f6f0e8] px-4 text-sm text-[#2c211c]"
              onClick={() => onIndex((index + 1) % photos.length)}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
}
