import type { MetadataRoute } from "next";
import { getAllTitles } from "@/lib/content";
import { slugify } from "@/lib/slug";
import { siteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const titles = await getAllTitles();
  return [
    { url: base, changeFrequency: "daily", priority: 1 },
    ...titles.map((t) => ({
      url: `${base}/title/${slugify(t.name)}`,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ];
}
