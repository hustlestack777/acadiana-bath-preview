import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { FaqSection } from "../components/faq-section";
import { faqs } from "./copy";
import { PUBLIC_PAGES, pageMeta, resolvedDocumentTitle, townDocumentTitle } from "./page-meta";
import { towns } from "./towns";
import { WINDOW_PRICE_LINE } from "./windows";

test("indexable pages have unique titles and descriptions", () => {
  const titles = [
    ...PUBLIC_PAGES.map((page) => resolvedDocumentTitle(page)),
    ...towns.map((town) => townDocumentTitle(town.title)),
  ];
  const descriptions = [
    ...PUBLIC_PAGES.map((page) => page.description),
    ...towns.map((town) => town.description),
  ];
  assert.equal(new Set(titles).size, titles.length);
  assert.equal(new Set(descriptions).size, descriptions.length);
  for (const description of descriptions) {
    assert.ok(description.trim().length > 40, description);
  }
  const windows = pageMeta("/windows");
  assert.equal(/\$5K|\$5,000|priceRange|\blicensed\b|\bkitchen\b/i.test(`${windows.title} ${windows.description}`), false);
  assert.match(windows.description, new RegExp(WINDOW_PRICE_LINE.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  const about = pageMeta("/about");
  assert.match(about.description, /Starting at \$5K/);
  assert.equal(/window/i.test(about.description), false);
});

test("homepage FAQ is in HTML with FAQPage schema from published questions", () => {
  const home = readFileSync(new URL("../components/home-page.tsx", import.meta.url), "utf8");
  assert.match(home, /<FaqSection faqs=\{faqs\} moreHref="\/faq" moreLabel="See all questions" \/>/);
  const html = renderToStaticMarkup(
    createElement(FaqSection, { faqs: [...faqs], moreHref: "/faq", moreLabel: "See all questions" }),
  );
  assert.match(html, /"@type":"FAQPage"/);
  assert.match(html, /How much does a bathroom remodel cost in South Louisiana/);
  assert.match(html, /See all questions/);
  assert.match(html, /href="\/faq"/);
  assert.equal(/\blicensed\b|\bkitchen\b|answers the phone/i.test(html), false);
});
