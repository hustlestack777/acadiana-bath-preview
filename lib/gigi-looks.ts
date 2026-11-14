/** Gigi's on-page looks, in rotation order. */
export const GIGI_LOOKS = [
  "gigi-tiles",
  "gigi-countertop",
  "gigi-shower-board",
  "gigi-edge-profile",
  "gigi-zellige",
  "gigi-fan-deck",
] as const;

/** Window-sample looks. These rotate on the windows page only. */
export const GIGI_WINDOW_LOOKS = ["gigi-windows-black", "gigi-windows-white"] as const;

export type GigiLook = (typeof GIGI_LOOKS)[number] | (typeof GIGI_WINDOW_LOOKS)[number];

/** Index of the look shown on this page load. Advanced on every load. */
export const GIGI_LOOK_STORAGE_KEY = "gigi-look-index";

/** Separate index so a windows-page visit does not move the main rotation. */
export const GIGI_WINDOW_LOOK_STORAGE_KEY = "gigi-windows-look-index";

export type GigiLookStorage = {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
};

function mod(value: number, length: number) {
  return ((value % length) + length) % length;
}

function advanceLook<T extends string>(storage: GigiLookStorage, key: string, looks: readonly T[]): T {
  let next = 0;
  try {
    const raw = storage.getItem(key);
    if (raw != null && raw !== "") {
      const previous = Number.parseInt(raw, 10);
      if (Number.isInteger(previous)) next = mod(previous + 1, looks.length);
    }
  } catch {
    return looks[0];
  }
  try {
    storage.setItem(key, String(next));
  } catch {
    /* private mode still shows a look for this load */
  }
  return looks[next];
}

/**
 * Advance the stored index by one and return the look for this page load.
 * A missing or unreadable index starts at the first look.
 */
export function advanceGigiLook(storage: GigiLookStorage): (typeof GIGI_LOOKS)[number] {
  return advanceLook(storage, GIGI_LOOK_STORAGE_KEY, GIGI_LOOKS);
}

/** Advance the windows-page index. Black, then white, then black again. */
export function advanceGigiWindowLook(storage: GigiLookStorage): (typeof GIGI_WINDOW_LOOKS)[number] {
  return advanceLook(storage, GIGI_WINDOW_LOOK_STORAGE_KEY, GIGI_WINDOW_LOOKS);
}

export function isWindowsPath(pathname: string) {
  const path = pathname.replace(/\/+$/, "") || "/";
  return path === "/windows";
}

export function gigiLookSrc(look: GigiLook, size: "full" | "sm") {
  return size === "full" ? `/images/gigi/${look}.webp` : `/images/gigi/${look}-sm.webp`;
}
