import type { Row, Title } from "./types";
import { SAMPLE_VIDEO } from "./mockData";

/**
 * Optional TMDB integration. This only runs on the server (it reads a secret
 * env var). If TMDB_API_KEY is unset or any request fails, callers fall back to
 * the bundled mock data — see src/lib/content.ts.
 *
 * Get a free key at https://www.themoviedb.org/settings/api and add to
 * .env.local:   TMDB_API_KEY=your_key_here
 */

const API = "https://api.themoviedb.org/3";

export function hasTmdbKey(): boolean {
  return Boolean(process.env.TMDB_API_KEY);
}

interface TmdbItem {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  adult?: boolean;
}

async function tmdb<T>(path: string, params: Record<string, string> = {}): Promise<T> {
  const url = new URL(API + path);
  url.searchParams.set("api_key", process.env.TMDB_API_KEY as string);
  url.searchParams.set("language", "en-US");
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  // Cache for a day — this is catalog data that rarely changes.
  const res = await fetch(url, { next: { revalidate: 60 * 60 * 24 } });
  if (!res.ok) throw new Error(`TMDB ${path} → ${res.status}`);
  return res.json() as Promise<T>;
}

function toTitle(item: TmdbItem): Title {
  const date = item.release_date || item.first_air_date || "";
  const isSeries = Boolean(item.first_air_date) && !item.release_date;
  return {
    id: item.id,
    name: item.title || item.name || "Untitled",
    overview: item.overview || "No description available.",
    year: date ? Number(date.slice(0, 4)) : new Date().getFullYear(),
    rating: item.adult ? "R" : "PG-13",
    matchPct: Math.min(99, Math.max(70, Math.round(item.vote_average * 10))),
    length: isSeries ? "Series" : "Film",
    genres: [],
    posterPath: item.poster_path ?? undefined,
    backdropPath: item.backdrop_path ?? undefined,
    videoUrl: SAMPLE_VIDEO,
  };
}

async function fetchRow(label: string, path: string, params?: Record<string, string>): Promise<Row> {
  const data = await tmdb<{ results: TmdbItem[] }>(path, params);
  return {
    id: label.toLowerCase().replace(/\s+/g, "-"),
    title: label,
    items: data.results.filter((r) => r.poster_path).map(toTitle),
  };
}

/** Find a YouTube trailer key for a title (used to embed a real trailer). */
export async function fetchTrailerKey(id: number, kind: "movie" | "tv"): Promise<string | undefined> {
  try {
    const data = await tmdb<{ results: { key: string; site: string; type: string }[] }>(
      `/${kind}/${id}/videos`,
    );
    const vid =
      data.results.find((v) => v.site === "YouTube" && v.type === "Trailer") ||
      data.results.find((v) => v.site === "YouTube");
    return vid?.key;
  } catch {
    return undefined;
  }
}

export async function getTmdbHome(): Promise<{ hero: Title; rows: Row[] }> {
  const rows = await Promise.all([
    fetchRow("New Releases", "/trending/all/week"),
    fetchRow("Starring Originals", "/discover/tv", { with_networks: "213", sort_by: "popularity.desc" }),
    fetchRow("Popular on Starring", "/movie/popular"),
    fetchRow("Action & Adventure", "/discover/movie", { with_genres: "28", sort_by: "popularity.desc" }),
    fetchRow("Comedies", "/discover/movie", { with_genres: "35", sort_by: "popularity.desc" }),
    fetchRow("Sci-Fi & Fantasy", "/discover/movie", { with_genres: "878", sort_by: "popularity.desc" }),
    fetchRow("Critically Acclaimed Films", "/movie/top_rated"),
    fetchRow("Documentaries", "/discover/movie", { with_genres: "99", sort_by: "popularity.desc" }),
  ]);

  // Build the hero from a trending title that has a backdrop, with a real trailer.
  const heroSource = rows[0].items.find((t) => t.backdropPath) ?? rows[0].items[0];
  const kind: "movie" | "tv" = heroSource.length === "Series" ? "tv" : "movie";
  const youtubeKey = await fetchTrailerKey(heroSource.id, kind);
  const hero: Title = { ...heroSource, youtubeKey };

  return { hero, rows: rows.filter((r) => r.items.length > 0) };
}
