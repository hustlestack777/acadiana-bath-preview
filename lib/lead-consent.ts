import { cleanPath } from "./lead-attribution";

/** Exact checkbox wording plus the page it was shown on, stored in leads.consent_text. */
export function consentRecord(checkboxText: string, pagePath: string) {
  const page = cleanPath(pagePath, "") || pagePath.trim() || "/";
  const text = checkboxText.trim();
  return `Checkbox on ${page}: "${text}"`;
}
