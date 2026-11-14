import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import type { ReactNode } from "react";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import "./globals.css";
import { JsonLd } from "@/components/json-ld";
import { LeadAttributionTracker } from "@/components/lead-attribution";
import { businessJsonLd } from "@/lib/schema";
import { isIndexableHost } from "@/lib/indexable-host";
import { SITE_INDEXABLE, SITE_URL } from "@/lib/site";
import { isWindowsContentPath } from "@/lib/windows";


const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const siteMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Acadiana Bathrooms and Countertops",
    template: "%s · Acadiana Bathrooms and Countertops",
  },
  description:
    "Custom showers, tile and solid surface remodels from Acadiana Bathrooms and Countertops. Based in Lafayette, serving Acadiana and South Louisiana. Free quote, and see your new bathroom free with Design My Bathroom.",
  robots: SITE_INDEXABLE ? { index: true, follow: true } : { index: false, follow: false },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.png", type: "image/png", sizes: "32x32" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Acadiana Bathrooms and Countertops",
    description:
      "Custom showers, tile and solid surface remodels from Acadiana Bathrooms and Countertops. Based in Lafayette, serving Acadiana and South Louisiana. Free quote, and see your new bathroom free with Design My Bathroom.",
    url: "/",
    siteName: "Acadiana Bathrooms and Countertops",
    type: "website",
    images: [
      {
        url: "/brand/og-image.png",
        width: 1200,
        height: 630,
        alt: "Acadiana Bathrooms and Countertops",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Acadiana Bathrooms and Countertops",
    description:
      "Custom showers, tile and solid surface remodels from Acadiana Bathrooms and Countertops. Based in Lafayette, serving Acadiana and South Louisiana. Free quote, and see your new bathroom free with Design My Bathroom.",
    images: ["/brand/og-image.png"],
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const host = (await headers()).get("host");
  const indexable = SITE_INDEXABLE && isIndexableHost(host);
  return {
    ...siteMetadata,
    robots: indexable ? { index: true, follow: true } : { index: false, follow: false },
  };
}

export const viewport: Viewport = {
  themeColor: "#f3efe4",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const pathname = (await headers()).get("x-pathname") ?? "";
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <JsonLd data={businessJsonLd({ includePriceRange: !isWindowsContentPath(pathname) })} />
        <LeadAttributionTracker />
        {children}
      </body>
    </html>
  );
}
