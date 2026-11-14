import { GOOGLE_BUSINESS_URL, SITE_SAME_AS } from "./site";

export type SocialProfile = {
  href: string;
  label: string;
  kind: "facebook" | "google";
};

/** Icons only for profiles already listed in schema sameAs. */
export function socialProfiles(): SocialProfile[] {
  const profiles: SocialProfile[] = [];
  for (const href of SITE_SAME_AS) {
    let host = "";
    try {
      host = new URL(href).hostname.replace(/^www\./, "").toLowerCase();
    } catch {
      continue;
    }
    if (host === "facebook.com") profiles.push({ href, label: "Facebook", kind: "facebook" });
    else if (href === GOOGLE_BUSINESS_URL) profiles.push({ href, label: "Acadiana Bathrooms on Google", kind: "google" });
  }
  return profiles;
}

export function facebookProfile() {
  return socialProfiles().find((profile) => profile.kind === "facebook")?.href ?? null;
}
