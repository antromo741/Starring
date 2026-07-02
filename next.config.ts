import type { NextConfig } from "next";

// Baseline hardening headers. A strict CSP is deliberately omitted for now —
// it needs careful allowlisting (inline styles, TMDB images, the sample video
// CDN) before it can ship without breaking the app.
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  images: {
    // TMDB image CDN — only used when a TMDB_API_KEY is configured.
    // The app falls back to generated gradient posters otherwise.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.tmdb.org",
        pathname: "/t/p/**",
      },
    ],
  },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};

export default nextConfig;
