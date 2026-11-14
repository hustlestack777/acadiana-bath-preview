import assert from "node:assert/strict";
import test from "node:test";
import { BATH_QUOTE_LABEL, BATH_QUOTE_NOTE, WINDOWS_QUOTE_LABEL, getProsRewritePath, isGetProsHost, publicCanonical } from "./getpros";

const hiddenPhone = "337-405-9945";
const otherRoom = ["kit", "chen"].join("");

test("only abc.getpros.xyz is the lead-machine host", () => {
  assert.equal(isGetProsHost("abc.getpros.xyz"), true);
  assert.equal(isGetProsHost("ABC.getpros.xyz:443"), true);
  assert.equal(isGetProsHost("abclafayette.com"), false);
  assert.equal(isGetProsHost("www.abclafayette.com"), false);
  assert.equal(isGetProsHost("acadiana-bathrooms.onrender.com"), false);
  assert.equal(isGetProsHost("3bs.getpros.xyz"), false);
  assert.equal(isGetProsHost(null), false);
});

test("/bath rewrites to the bathroom quote only on the lead-machine host", () => {
  assert.equal(getProsRewritePath("abc.getpros.xyz", "/bath"), "/design");
  assert.equal(getProsRewritePath("abc.getpros.xyz", "/bath/"), "/design");
  assert.equal(getProsRewritePath("abc.getpros.xyz", "/windows"), null);
  assert.equal(getProsRewritePath("abclafayette.com", "/bath"), null);
});

test("canonicals stay on abclafayette.com", () => {
  assert.equal(publicCanonical("/"), "https://abclafayette.com/");
  assert.equal(publicCanonical("/bath"), "https://abclafayette.com/design");
  assert.equal(publicCanonical("/design"), "https://abclafayette.com/design");
  assert.equal(publicCanonical("/windows"), "https://abclafayette.com/windows");
});

test("hub labels keep the bathroom starting price off the windows button", () => {
  assert.match(BATH_QUOTE_NOTE, /Starting at \$5K/);
  assert.equal(/\$|5K|5,000|price/i.test(WINDOWS_QUOTE_LABEL), false);
  const blob = `${BATH_QUOTE_LABEL} ${BATH_QUOTE_NOTE} ${WINDOWS_QUOTE_LABEL}`;
  assert.equal(blob.includes(hiddenPhone), false);
  assert.equal(new RegExp(otherRoom, "i").test(blob), false);
  assert.equal(/licensed/i.test(blob), false);
});
