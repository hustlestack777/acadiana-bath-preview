import assert from "node:assert/strict";
import test from "node:test";
import { aboutRedirectPath } from "./about-redirect";

test("leaves the real /about page alone", () => {
  assert.equal(aboutRedirectPath("/about"), null);
  assert.equal(aboutRedirectPath("/about/"), null);
  assert.equal(aboutRedirectPath("/about?ref=nav"), null);
});

test("redirects case variants and leftover About URLs to /about", () => {
  for (const path of [
    "/About",
    "/ABOUT",
    "/About/",
    "/ABOUT/",
    "/about-us",
    "/About-Us",
    "/about.html",
    "/About.html",
    "/about-us.html",
    "/about/index.html",
  ]) {
    assert.equal(aboutRedirectPath(path), "/about", path);
  }
});

test("does not touch unrelated paths", () => {
  for (const path of ["/", "/gallery", "/faq", "/estimate", "/design", "/about-team"]) {
    assert.equal(aboutRedirectPath(path), null, path);
  }
});
