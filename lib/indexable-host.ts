/** Public hostnames Google may index. The Render preview and any other host stay noindex. */
export const INDEXABLE_HOSTS = ["abclafayette.com", "www.abclafayette.com"] as const;

/** True when the request Host is the public domain (port and trailing-dot ignored). */
export function isIndexableHost(host: string | null | undefined): boolean {
  const hostname = (host ?? "").split(":")[0].trim().toLowerCase().replace(/\.$/, "");
  return (INDEXABLE_HOSTS as readonly string[]).includes(hostname);
}
