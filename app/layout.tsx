import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import "./globals.css";

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

export const metadata: Metadata = {
  metadataBase: new URL("https://acadiana-bathrooms.onrender.com"),
  title: {
    default: "Acadiana Bathrooms and Countertops",
    template: "%s · Acadiana Bathrooms and Countertops",
  },
  description:
    "Custom-fit Onyx Collection showers and bathroom work from Acadiana Bathrooms and Countertops. Free Consult. Call 337-522-0023.",
  robots: { index: false, follow: false },
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
      "Custom-fit Onyx Collection showers and bathroom work from Acadiana Bathrooms and Countertops. Free Consult. Call 337-522-0023.",
    url: "/",
    siteName: "Acadiana Bathrooms and Countertops",
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
      "Custom-fit Onyx Collection showers and bathroom work from Acadiana Bathrooms and Countertops. Free Consult. Call 337-522-0023.",
    images: ["/brand/og-image.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#f6f0e8",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
