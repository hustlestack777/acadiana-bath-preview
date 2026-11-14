/** Gigi's on-page looks, in rotation order. */
export const GIGI_LOOKS = [
  "gigi-tiles",
  "gigi-countertop",
  "gigi-shower-board",
  "gigi-edge-profile",
  "gigi-zellige",
  "gigi-fan-deck",
] as const;

export type GigiLook = (typeof GIGI_LOOKS)[number];

/** Index of the look shown on this page load. Advanced on every load. */
export const GIGI_LOOK_STORAGE_KEY = "gigi-look-index";

export type GigiLookStorage = {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
};

function mod(value: number, length: number) {
  return ((value % length) + length) % length;
}

/**
 * Advance the stored index by one and return the look for this page load.
 * A missing or unreadable index starts at the first look.
 */
export function advanceGigiLook(storage: GigiLookStorage): GigiLook {
  let next = 0;
  try {
    const raw = storage.getItem(GIGI_LOOK_STORAGE_KEY);
    if (raw != null && raw !== "") {
      const previous = Number.parseInt(raw, 10);
      if (Number.isInteger(previous)) next = mod(previous + 1, GIGI_LOOKS.length);
    }
  } catch {
    return GIGI_LOOKS[0];
  }
  try {
    storage.setItem(GIGI_LOOK_STORAGE_KEY, String(next));
  } catch {
    /* private mode still shows a look for this load */
  }
  return GIGI_LOOKS[next];
}

export function gigiLookSrc(look: GigiLook, size: "full" | "sm") {
  return size === "full" ? `/images/gigi/${look}.webp` : `/images/gigi/${look}-sm.webp`;
}
