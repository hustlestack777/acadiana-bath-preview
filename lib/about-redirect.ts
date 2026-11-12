/** Legacy or case-variant About paths that should land on /about. */
const ABOUT_ALIASES = new Set([
  "/about-us",
  "/about.html",
  "/about-us.html",
  "/about/index.html",
]);

/**
 * Returns /about when the request path is a case variant of /about
 * or a leftover About URL from the previous site. Same-path /about
 * returns null so the real page is left alone.
 */
export function aboutRedirectPath(pathname: string): string | null {
  const pathOnly = pathname.split("?")[0] ?? pathname;
  const trimmed = pathOnly.length > 1 ? pathOnly.replace(/\/+$/, "") : pathOnly;
  const lower = trimmed.toLowerCase();
  if (lower === "/about") {
    return trimmed === "/about" ? null : "/about";
  }
  if (ABOUT_ALIASES.has(lower)) return "/about";
  return null;
}
