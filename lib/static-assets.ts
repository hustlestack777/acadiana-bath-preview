/** Public files that should be cached and skipped by middleware. */
export const STATIC_ASSET_PREFIXES = ["/_next/static", "/_next/image", "/images/", "/brand/", "/maps/", "/video/"] as const;

export const STATIC_ASSET_EXACT = new Set([
  "/favicon.ico",
  "/favicon.png",
  "/favicon.svg",
  "/apple-touch-icon.png",
  "/sitemap.xml",
]);

/** True for hashed Next assets and long-lived files under /public. */
export function isStaticAssetPath(pathname: string) {
  if (STATIC_ASSET_EXACT.has(pathname)) return true;
  return STATIC_ASSET_PREFIXES.some((prefix) => {
    if (prefix.endsWith("/")) {
      return pathname === prefix.slice(0, -1) || pathname.startsWith(prefix);
    }
    return pathname === prefix || pathname.startsWith(`${prefix}/`);
  });
}
