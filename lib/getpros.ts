/** Lead-machine host. The public website stays abclafayette.com. */
export const GETPROS_HOST = "abc.getpros.xyz";
export const PUBLIC_SITE_ORIGIN = "https://abclafayette.com";

export const BATH_QUOTE_LABEL = "Design My Bathroom";
export const BATH_QUOTE_NOTE = "Starting at $5K";
export const WINDOWS_QUOTE_LABEL = "Windows Quote";

export function requestHostname(host: string | null | undefined) {
  const first = (host ?? "").split(",")[0] ?? "";
  return first.split(":")[0].trim().toLowerCase().replace(/\.$/, "");
}

export function isGetProsHost(host: string | null | undefined) {
  return requestHostname(host) === GETPROS_HOST;
}

export function isGetProsRequest(headerList: { get(name: string): string | null }) {
  return isGetProsHost(headerList.get("x-forwarded-host")) || isGetProsHost(headerList.get("host"));
}

/** /bath on the lead-machine host is the existing bathroom quote. */
export function getProsRewritePath(host: string | null | undefined, pathname: string) {
  if (!isGetProsHost(host)) return null;
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  if (path === "/bath") return "/design";
  return null;
}

/** Canonical on the public site so the lead-machine host does not split search. */
export function publicCanonical(path: string) {
  const normalized = !path || path === "/" ? "/" : (path.startsWith("/") ? path : `/${path}`).replace(/\/+$/, "") || "/";
  if (normalized === "/bath") return `${PUBLIC_SITE_ORIGIN}/design`;
  return `${PUBLIC_SITE_ORIGIN}${normalized === "/" ? "/" : normalized}`;
}
