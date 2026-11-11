import type { NextConfig } from "next";

const staticCache = {
  key: "Cache-Control",
  value: "public, max-age=86400, stale-while-revalidate=604800",
};

const nextConfig: NextConfig = {
  devIndicators: false,
  allowedDevOrigins: ["127.0.0.1"],
  async headers() {
    return [
      { source: "/images/:path*", headers: [staticCache] },
      { source: "/brand/:path*", headers: [staticCache] },
      { source: "/maps/:path*", headers: [staticCache] },
      { source: "/video/:path*", headers: [staticCache] },
      { source: "/favicon.ico", headers: [staticCache] },
      { source: "/favicon.png", headers: [staticCache] },
      { source: "/favicon.svg", headers: [staticCache] },
      { source: "/apple-touch-icon.png", headers: [staticCache] },
    ];
  },
  // Cache Components and partial prefetching need a server. This preview is a
  // static export, and the AI assistant already answers in the browser.
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
