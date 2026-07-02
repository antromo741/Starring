import "server-only";
import { cache } from "react";
import type { Row, Title } from "./types";
import { HERO_TITLE, HOME_ROWS } from "./mockData";
import { getTmdbHome, hasTmdbKey } from "./tmdb";
import { slugify } from "./slug";

/**
 * Single source of truth for the home page. Returns real TMDB data when a key
 * is configured, otherwise the bundled mock catalog. Any TMDB failure falls
 * back to mock so the page never breaks. Wrapped in React cache() so multiple
 * callers within one request (page + generateMetadata + sitemap) share one fetch.
 */
export const getHomeData = cache(async (): Promise<{
  hero: Title;
  rows: Row[];
  source: "tmdb" | "mock";
}> => {
  if (hasTmdbKey()) {
    try {
      const { hero, rows } = await getTmdbHome();
      if (rows.length > 0) return { hero, rows, source: "tmdb" };
    } catch (err) {
      console.warn("[starring] TMDB fetch failed, using mock data:", err);
    }
  }
  return { hero: HERO_TITLE, rows: HOME_ROWS, source: "mock" };
});

/** Flattened, de-duplicated catalog (hero + every row). */
export async function getAllTitles(): Promise<Title[]> {
  const { hero, rows } = await getHomeData();
  const seen = new Set<number>();
  const out: Title[] = [];
  for (const t of [hero, ...rows.flatMap((r) => r.items)]) {
    if (!seen.has(t.id)) {
      seen.add(t.id);
      out.push(t);
    }
  }
  return out;
}

export async function getTitleBySlug(slug: string): Promise<Title | undefined> {
  const all = await getAllTitles();
  return all.find((t) => slugify(t.name) === slug);
}
