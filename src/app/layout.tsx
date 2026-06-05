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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: { default: "Netflix Clone", template: "%s · Netflix Clone" },
  description:
    "A Netflix UI clone built with Next.js, React and Tailwind CSS — with a personalized 'Starring You' catalog, search, My List, profiles and Continue Watching.",
  openGraph: {
    title: "Netflix Clone",
    description: "A personalized Netflix-style streaming UI built with Next.js.",
    type: "website",
    images: [{ url: "/starring/redbeard-wide.png", width: 1280, height: 720, alt: "Netflix Clone" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Netflix Clone",
    description: "A personalized Netflix-style streaming UI built with Next.js.",
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
