import assert from "node:assert/strict";
import { test } from "node:test";
import {
  warrantyContactPlain,
  warrantyHeading,
  warrantyLinkHref,
  warrantyParagraphs,
  warrantyPlainText,
  warrantyStandBehind,
} from "./warranty";

test("warranty copy is the approved Onyx section and does not say lifetime", () => {
  assert.equal(warrantyHeading.startsWith("The Onyx Collection"), true);
  assert.equal(
    warrantyStandBehind,
    "We stand behind our work, and we will make issues right.",
  );
  assert.equal(
    warrantyParagraphs[2].includes("does not cover tile, grout, caulk, or our installation work"),
    true,
  );
  assert.equal(warrantyLinkHref.startsWith("https://onyxcollection.com/"), true);
  assert.equal(warrantyPlainText.includes(warrantyStandBehind), true);
  assert.equal(warrantyPlainText.includes(warrantyContactPlain.split(" at ")[0]), true);
  assert.equal(/lifetime/i.test(warrantyPlainText), false);
});
