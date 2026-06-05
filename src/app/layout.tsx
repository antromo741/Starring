import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // Prefer an explicit site URL, else Netlify's build-time URL, else localhost.
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? process.env.URL ?? "http://localhost:3000",
  ),
  title: { default: "Starring — Personalized Streaming Catalog", template: "%s · Starring" },
  description:
    "A personalized streaming catalog app built with Next.js, React and Tailwind CSS — with a build-time 'Starring You' poster pipeline, search, My List, profiles and Continue Watching.",
  openGraph: {
    title: "Starring — Personalized Streaming Catalog",
    description: "A personalized streaming catalog app with an AI-driven poster pipeline, built with Next.js.",
    type: "website",
    images: [{ url: "/starring/redbeard-wide.png", width: 1280, height: 720, alt: "Starring" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Starring — Personalized Streaming Catalog",
    description: "A personalized streaming catalog app with an AI-driven poster pipeline, built with Next.js.",
    images: ["/starring/redbeard-wide.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
