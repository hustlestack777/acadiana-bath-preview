import { NextRequest, NextResponse } from "next/server";
import { isIndexableHost } from "@/lib/indexable-host";

/**
 * Production host abclafayette.com stays indexable when SITE_INDEXABLE is on.
 * The Render preview and any other host get noindex in both the HTTP header
 * and robots.txt, so crawlers do not follow mixed signals.
 */
export function middleware(request: NextRequest) {
  const indexable = isIndexableHost(request.headers.get("host"));
  if (!indexable && request.nextUrl.pathname === "/robots.txt") {
    return new NextResponse("User-agent: *\nDisallow: /\n", {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "X-Robots-Tag": "noindex, nofollow",
        "Cache-Control": "no-store",
      },
    });
  }
  const response = NextResponse.next();
  if (!indexable) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }
  return response;
}

export const config = {
  matcher: [
    "/",
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml).*)",
  ],
};
