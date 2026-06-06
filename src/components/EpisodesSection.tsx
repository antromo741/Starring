"use client";

import { useState } from "react";
import Image from "next/image";
import type { Title } from "@/lib/types";
import { episodesFor, seasonCount } from "@/lib/episodes";
import { posterGradient } from "@/lib/images";

export default function EpisodesSection({
  title,
  onPlay,
}: {
  title: Title;
  onPlay: () => void;
}) {
  const seasons = seasonCount(title);
  const [season, setSeason] = useState(1);
  const episodes = episodesFor(title, season);

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-semibold">Episodes</h3>
        {seasons > 1 && (
          <select
            value={season}
            onChange={(e) => setSeason(Number(e.target.value))}
            aria-label="Select season"
            className="rounded border border-neutral-600 bg-[#242424] px-3 py-1.5 text-sm text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            {Array.from({ length: seasons }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                Season {i + 1}
              </option>
            ))}
          </select>
        )}
      </div>

      <ul className="divide-y divide-neutral-800">
        {episodes.map((ep) => (
          <li key={ep.number}>
            <button
              onClick={onPlay}
              className="group flex w-full items-center gap-4 py-4 text-left transition hover:bg-white/5"
            >
              <span className="w-5 shrink-0 text-center text-lg text-neutral-400">{ep.number}</span>
              <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded sm:w-28">
                {ep.thumb ? (
                  <Image src={ep.thumb} alt={ep.name} fill sizes="112px" className="object-cover" />
                ) : (
                  <div className="h-full w-full" style={{ background: posterGradient(title.name + ep.number) }} />
                )}
                <span className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition group-hover:opacity-100">
                  <PlayIcon className="h-7 w-7 text-white" />
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="truncate font-medium">{ep.name}</p>
                  <span className="shrink-0 text-sm text-neutral-400">{ep.runtime}</span>
                </div>
                <p className="mt-1 line-clamp-2 text-sm text-neutral-400">{ep.overview}</p>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}
