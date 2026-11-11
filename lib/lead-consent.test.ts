import assert from "node:assert/strict";
import { test } from "node:test";
import { consentLabel } from "./copy";
import { consentRecord } from "./lead-consent";
import { WINDOWS_CONSENT_TEXT } from "./windows";
import { designCopy } from "./design-styles";

test("consent records keep the exact checkbox wording and the page path", () => {
  assert.equal(
    consentRecord(consentLabel, "/estimate"),
    `Checkbox on /estimate: "${consentLabel}"`,
  );
  assert.equal(
    consentRecord(consentLabel, "/custom-tile?utm_source=fb#quote"),
    `Checkbox on /custom-tile: "${consentLabel}"`,
  );
  assert.equal(
    consentRecord(WINDOWS_CONSENT_TEXT, "/windows"),
    `Checkbox on /windows: "${WINDOWS_CONSENT_TEXT}"`,
  );
  assert.equal(
    consentRecord(designCopy.smsConsent, "/design"),
    `Checkbox on /design: "${designCopy.smsConsent}"`,
  );
});
