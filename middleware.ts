import { NextRequest, NextResponse } from "next/server";
import { aboutRedirectPath } from "@/lib/about-redirect";
import { getProsRewritePath, isGetProsHost } from "@/lib/getpros";
import { isIndexableHost } from "@/lib/indexable-host";

/**
 * Production host abclafayette.com stays indexable when SITE_INDEXABLE is on.
 * The Render preview and any other host get noindex in both the HTTP header
 * and robots.txt, so crawlers do not follow mixed signals.
 */
export function middleware(request: NextRequest) {
  const forwarded = request.headers.get("x-forwarded-host");
  const host = request.headers.get("host");
  const indexable = isIndexableHost(forwarded) || isIndexableHost(host);
  const rewritePath = getProsRewritePath(isGetProsHost(forwarded) ? forwarded : host, request.nextUrl.pathname);
  if (rewritePath) {
    const url = request.nextUrl.clone();
    url.pathname = rewritePath;
    const rewrite = NextResponse.rewrite(url);
    if (!indexable) rewrite.headers.set("X-Robots-Tag", "noindex, nofollow");
    return rewrite;
  }
  const aboutTo = aboutRedirectPath(request.nextUrl.pathname);
  if (aboutTo) {
    const url = request.nextUrl.clone();
    url.pathname = aboutTo;
    const redirect = NextResponse.redirect(url, 308);
    if (!indexable) {
      redirect.headers.set("X-Robots-Tag", "noindex, nofollow");
    }
    return redirect;
  }
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
    "/((?!_next/static|_next/image|favicon.ico|favicon.png|favicon.svg|apple-touch-icon.png|sitemap.xml|images/|brand/|maps/|video/).*)",
  ],
};
