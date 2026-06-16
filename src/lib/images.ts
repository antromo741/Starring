/** Client-safe helpers for artwork. */
import type { Title } from "./types";

/** Resolve a title's poster: local artwork first, then TMDB, else undefined. */
export function posterSrc(t: Title): string | undefined {
  return t.posterImage ?? imageUrl(t.posterPath, "w500");
}

/** Resolve a title's landscape image: local artwork first, then TMDB. */
export function backdropSrc(
  t: Title,
  size: "w300" | "w500" | "w780" | "original" = "w780",
): string | undefined {
  return t.backdropImage ?? imageUrl(t.backdropPath ?? t.posterPath, size);
}

/** Prefer text-free portrait source art for phone hero crops when available. */
export function mobileHeroSrc(t: Title): string | undefined {
  if (t.mobileHeroImage) return t.mobileHeroImage;
  const local = t.backdropImage ?? t.posterImage;
  const match = local?.match(/^\/starring\/(.+?)(?:-wide)?\.(?:png|jpg|jpeg|webp)$/);
  return match ? `/starring/source/${match[1]}.png` : undefined;
}

/** Build a TMDB image URL, or undefined to trigger the gradient poster. */
export function imageUrl(
  path: string | undefined,
  size: "w300" | "w500" | "w780" | "original" = "w500",
): string | undefined {
  return path ? `https://image.tmdb.org/t/p/${size}${path}` : undefined;
}

/**
 * Deterministic gradient for titles without artwork. Same input always yields
 * the same colors, so server and client render identically (no hydration drift).
 */
export function posterGradient(seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  }
  const h1 = h % 360;
  const h2 = (h1 + 40 + (h % 50)) % 360;
  return `linear-gradient(145deg, hsl(${h1} 62% 30%) 0%, hsl(${h2} 68% 14%) 100%)`;
}
