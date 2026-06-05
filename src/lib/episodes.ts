import type { Title } from "./types";
import { backdropSrc } from "./images";

/** A title is treated as a series when its length mentions seasons. */
export function isSeries(t: Title): boolean {
  return /season|series/i.test(t.length);
}

export function seasonCount(t: Title): number {
  const m = t.length.match(/(\d+)\s*Season/i);
  return m ? Math.max(1, Number(m[1])) : 1;
}

export interface Episode {
  number: number;
  name: string;
  overview: string;
  runtime: string;
  thumb?: string;
}

const EP_NAMES = [
  "Pilot", "Aftermath", "The Reckoning", "Smoke & Mirrors", "Crossroads",
  "No Way Back", "The Long Night", "Endgame", "Fault Lines", "Brave New World",
  "Last Light", "Homecoming", "Breaking Point", "Cold Open", "The Gathering Storm",
];

const EP_BLURBS = [
  "An uneasy alliance is tested when an old secret resurfaces at the worst possible moment.",
  "A risky plan forces everyone to pick a side — and the fallout lands closer to home than expected.",
  "Tensions boil over as a long-buried truth threatens to unravel everything they've built.",
  "A quiet day takes a sharp turn, and a single choice sets the rest of the season in motion.",
  "Cornered and out of options, our lead makes a move no one saw coming.",
  "Loyalties fracture, a deal goes sideways, and the cost of winning keeps climbing.",
];

/** Deterministic mock episodes for a given series + season. */
export function episodesFor(t: Title, season: number): Episode[] {
  const count = 6 + ((t.id + season) % 3); // 6–8 episodes
  const thumb = backdropSrc(t, "w500");
  return Array.from({ length: count }, (_, i) => ({
    number: i + 1,
    name: i === 0 && season === 1 ? "Pilot" : EP_NAMES[(t.id + season * 3 + i) % EP_NAMES.length],
    overview: EP_BLURBS[(t.id + season + i) % EP_BLURBS.length],
    runtime: `${44 + ((t.id + i) % 14)}m`,
    thumb,
  }));
}
