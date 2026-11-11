/** Source page, referrer, and UTM fields stored with every lead. */

export type LeadAttribution = {
  sourcePage: string;
  formPage: string;
  landingPage: string;
  referrer: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
};

export const EMPTY_ATTRIBUTION: LeadAttribution = {
  sourcePage: "",
  formPage: "",
  landingPage: "",
  referrer: "",
  utmSource: "",
  utmMedium: "",
  utmCampaign: "",
};

export function isSitePath(value: string) {
  const path = value.trim();
  if (path === "/") return true;
  return /^\/[A-Za-z0-9][A-Za-z0-9/_-]{0,78}$/.test(path) && !path.includes("//");
}

export function cleanPath(value: string, fallback = "") {
  const path = value.trim().split("?")[0].split("#")[0];
  if (!isSitePath(path)) return fallback;
  if (path.length > 1 && path.endsWith("/")) return path.slice(0, -1);
  return path;
}

export function cleanUtm(value: string) {
  return value.trim().slice(0, 200);
}

export function cleanReferrer(value: string) {
  return value.trim().slice(0, 500);
}

export function sanitizeAttribution(
  input: Partial<LeadAttribution>,
  fallbackForm = "/estimate",
): LeadAttribution {
  const formPage = cleanPath(input.formPage || "", fallbackForm) || fallbackForm;
  const landingPage = cleanPath(input.landingPage || "");
  const sourcePage = cleanPath(input.sourcePage || "", formPage) || formPage;
  return {
    sourcePage,
    formPage,
    landingPage,
    referrer: cleanReferrer(input.referrer || ""),
    utmSource: cleanUtm(input.utmSource || ""),
    utmMedium: cleanUtm(input.utmMedium || ""),
    utmCampaign: cleanUtm(input.utmCampaign || ""),
  };
}

/** One line for Justin and Shaun: "/serving-houma (form /estimate)" or "/design". */
export function sourceLine(sourcePage: string, formPage = "") {
  const source = sourcePage.trim();
  const form = formPage.trim();
  if (source && form && source !== form) return `${source} (form ${form})`;
  return source || form;
}

export function campaignLine(source: string, medium: string, campaign: string) {
  return [source, medium, campaign].map((item) => item.trim()).filter(Boolean).join(" / ");
}
