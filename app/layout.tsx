import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Fraunces, Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const themeBoot = `(function(){try{var t=localStorage.getItem("ab-theme");if(t==="bayou"||t==="marigold"||t==="indigo"){document.documentElement.setAttribute("data-theme",t)}}catch(e){}})();`;

export const metadata: Metadata = {
  title: {
    default: "[BUSINESS NAME] · Onyx Collection showers",
    template: "%s · [BUSINESS NAME]",
  },
  description:
    "Custom-fit Onyx Collection showers for the bathroom you actually want. A Louisiana remodeler prototype. Nothing submitted here is saved.",
  robots: { index: false, follow: false },
  icons: { icon: "/favicon.svg" },
};

export const viewport: Viewport = {
  themeColor: "#173844",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      data-theme="bayou"
      className={`${outfit.variable} ${fraunces.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBoot }} />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
