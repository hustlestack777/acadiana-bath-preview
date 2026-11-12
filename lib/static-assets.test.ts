import assert from "node:assert/strict";
import test from "node:test";
import { isStaticAssetPath } from "./static-assets";

test("static asset paths skip middleware, pages and justin.vcf do not", () => {
  assert.equal(isStaticAssetPath("/images/hero/hero-17-1600.avif"), true);
  assert.equal(isStaticAssetPath("/brand/mark.png"), true);
  assert.equal(isStaticAssetPath("/maps/acadiana_service_map_web.png"), true);
  assert.equal(isStaticAssetPath("/video/hero-desktop.mp4"), true);
  assert.equal(isStaticAssetPath("/_next/static/chunks/app.js"), true);
  assert.equal(isStaticAssetPath("/_next/image"), true);
  assert.equal(isStaticAssetPath("/favicon.ico"), true);
  assert.equal(isStaticAssetPath("/sitemap.xml"), true);

  assert.equal(isStaticAssetPath("/"), false);
  assert.equal(isStaticAssetPath("/windows"), false);
  assert.equal(isStaticAssetPath("/robots.txt"), false);
  assert.equal(isStaticAssetPath("/justin.vcf"), false);
  assert.equal(isStaticAssetPath("/contact.vcf"), false);
  assert.equal(isStaticAssetPath("/api/leads"), false);
});
