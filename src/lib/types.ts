export interface Title {
  id: number;
  name: string;
  overview: string;
  year: number;
  /** Content rating, e.g. "TV-MA", "PG-13". */
  rating: string;
  /** Relevance score, 80–99. */
  matchPct: number;
  /** "1h 58m" for films or "3 Seasons" for series. */
  length: string;
  genres: string[];
  /** Optional TMDB poster path (e.g. "/abc.jpg"). Absent → gradient poster. */
  posterPath?: string;
  /** Optional TMDB backdrop path for the hero / modal banner. */
  backdropPath?: string;
  /** Ready-to-use local poster URL (e.g. "/originals/x.png"). Takes priority. */
  posterImage?: string;
  /** Ready-to-use local landscape/backdrop URL. Takes priority. */
  backdropImage?: string;
  /** YouTube key (TMDB) or a direct video URL used by the player. */
  videoUrl?: string;
  youtubeKey?: string;
}

export interface Row {
  id: string;
  title: string;
  /** Larger, portrait "Originals" style cards when true. */
  featured?: boolean;
  items: Title[];
}
