import { NextRequest, NextResponse } from "next/server";
import { isIndexableHost } from "@/lib/indexable-host";

/**
 * Until DNS points abclafayette.com at this service, the onrender preview must
 * not be indexed. robots.txt and sitemap stay unchanged; this only adds a
 * host-based X-Robots-Tag on other hosts.
 */
export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  if (!isIndexableHost(request.headers.get("host"))) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }
  return response;
}

export const config = {
  matcher: [
    // Pages and APIs, including /. Leave robots.txt and sitemap.xml headers alone.
    "/",
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
