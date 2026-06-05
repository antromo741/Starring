import "server-only";
import type { Row, Title } from "./types";
import { HERO_TITLE, HOME_ROWS } from "./mockData";
import { getTmdbHome, hasTmdbKey } from "./tmdb";

/**
 * Single source of truth for the home page. Returns real TMDB data when a key
 * is configured, otherwise the bundled mock catalog. Any TMDB failure falls
 * back to mock so the page never breaks.
 */
export async function getHomeData(): Promise<{
  hero: Title;
  rows: Row[];
  source: "tmdb" | "mock";
}> {
  if (hasTmdbKey()) {
    try {
      const { hero, rows } = await getTmdbHome();
      if (rows.length > 0) return { hero, rows, source: "tmdb" };
    } catch (err) {
      console.warn("[starring] TMDB fetch failed, using mock data:", err);
    }
  }
  return { hero: HERO_TITLE, rows: HOME_ROWS, source: "mock" };
}
