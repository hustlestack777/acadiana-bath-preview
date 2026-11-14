import assert from "node:assert/strict";
import test from "node:test";
import { isIndexableHost } from "./indexable-host";

test("only the public domain and www are indexable", () => {
  assert.equal(isIndexableHost("abclafayette.com"), true);
  assert.equal(isIndexableHost("www.abclafayette.com"), true);
  assert.equal(isIndexableHost("ABCLAFAYETTE.COM"), true);
  assert.equal(isIndexableHost("www.abclafayette.com:443"), true);
  assert.equal(isIndexableHost("acadiana-bathrooms.onrender.com"), false);
  assert.equal(isIndexableHost("abc.getpros.xyz"), false);
  assert.equal(isIndexableHost("localhost:3000"), false);
  assert.equal(isIndexableHost(""), false);
  assert.equal(isIndexableHost(null), false);
});
