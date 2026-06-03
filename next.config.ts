import type { NextConfig } from "next";

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
};

export default nextConfig;
