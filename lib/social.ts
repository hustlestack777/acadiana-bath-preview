import { SITE_SAME_AS } from "./site";

/** Profiles already listed for schema.org sameAs. No other network is added. */
export function facebookProfile(): string | null {
  for (const href of SITE_SAME_AS) {
    try {
      const host = new URL(href).hostname.replace(/^www\./, "").toLowerCase();
      if (host === "facebook.com") return href;
    } catch {
      /* skip a bad URL */
    }
  }
  return null;
}
