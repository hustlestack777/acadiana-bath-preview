import assert from "node:assert/strict";
import test from "node:test";
import {
  GIGI_LOOKS,
  GIGI_LOOK_STORAGE_KEY,
  GIGI_WINDOW_LOOKS,
  GIGI_WINDOW_LOOK_STORAGE_KEY,
  advanceGigiLook,
  advanceGigiWindowLook,
  gigiLookSrc,
  isWindowsPath,
  type GigiLookStorage,
} from "./gigi-looks";

function memoryStorage(initial?: string): GigiLookStorage & { value: string | null } {
  const store = { value: initial ?? null };
  return {
    get value() {
      return store.value;
    },
    getItem() {
      return store.value;
    },
    setItem(_key: string, value: string) {
      store.value = value;
    },
  };
}

test("starts at the first look and advances on every read", () => {
  const storage = memoryStorage();
  const seen = GIGI_LOOKS.map(() => advanceGigiLook(storage));
  assert.deepEqual(seen, [...GIGI_LOOKS]);
  assert.equal(storage.value, String(GIGI_LOOKS.length - 1));
  assert.equal(advanceGigiLook(storage), GIGI_LOOKS[0]);
  assert.equal(storage.value, "0");
});

test("stores the index under the page-load key", () => {
  const keys: string[] = [];
  const storage: GigiLookStorage = {
    getItem(key) {
      keys.push(key);
      return null;
    },
    setItem(key) {
      keys.push(key);
    },
  };
  advanceGigiLook(storage);
  assert.deepEqual(keys, [GIGI_LOOK_STORAGE_KEY, GIGI_LOOK_STORAGE_KEY]);
});

test("wraps a stored index and ignores a broken value", () => {
  assert.equal(advanceGigiLook(memoryStorage("5")), GIGI_LOOKS[0]);
  assert.equal(advanceGigiLook(memoryStorage("2")), GIGI_LOOKS[3]);
  assert.equal(advanceGigiLook(memoryStorage("nope")), GIGI_LOOKS[0]);
  assert.equal(advanceGigiLook(memoryStorage("-1")), GIGI_LOOKS[0]);
});

test("still returns a look when storage throws", () => {
  const storage: GigiLookStorage = {
    getItem() {
      throw new Error("blocked");
    },
    setItem() {
      throw new Error("blocked");
    },
  };
  assert.equal(advanceGigiLook(storage), GIGI_LOOKS[0]);
});

test("points each look at a full and a small webp", () => {
  assert.equal(gigiLookSrc("gigi-zellige", "full"), "/images/gigi/gigi-zellige.webp");
  assert.equal(gigiLookSrc("gigi-fan-deck", "sm"), "/images/gigi/gigi-fan-deck-sm.webp");
  assert.equal(gigiLookSrc("gigi-windows-black", "full"), "/images/gigi/gigi-windows-black.webp");
  assert.equal(gigiLookSrc("gigi-windows-white", "sm"), "/images/gigi/gigi-windows-white-sm.webp");
});

test("window samples rotate on their own index", () => {
  const storage = memoryStorage();
  assert.deepEqual(
    [advanceGigiWindowLook(storage), advanceGigiWindowLook(storage), advanceGigiWindowLook(storage)],
    [GIGI_WINDOW_LOOKS[0], GIGI_WINDOW_LOOKS[1], GIGI_WINDOW_LOOKS[0]],
  );
  assert.equal(storage.value, "0");
  assert.equal(advanceGigiLook(memoryStorage()), GIGI_LOOKS[0]);
});

test("window samples use a separate storage key and only the windows path", () => {
  const keys: string[] = [];
  const storage: GigiLookStorage = {
    getItem(key) {
      keys.push(key);
      return null;
    },
    setItem(key) {
      keys.push(key);
    },
  };
  advanceGigiWindowLook(storage);
  assert.deepEqual(keys, [GIGI_WINDOW_LOOK_STORAGE_KEY, GIGI_WINDOW_LOOK_STORAGE_KEY]);
  assert.equal(isWindowsPath("/windows"), true);
  assert.equal(isWindowsPath("/windows/"), true);
  assert.equal(isWindowsPath("/"), false);
  assert.equal(isWindowsPath("/gallery"), false);
});
