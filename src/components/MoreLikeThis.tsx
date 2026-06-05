"use client";

import Image from "next/image";
import type { Title } from "@/lib/types";
import { backdropSrc, posterGradient } from "@/lib/images";
import { useCatalog } from "./CatalogProvider";
import { useModal } from "./ModalProvider";

export default function MoreLikeThis({ active }: { active: Title }) {
  const { allTitles } = useCatalog();
  const { open } = useModal();

  const genres = new Set(active.genres);
  const related = allTitles
    .filter((t) => t.id !== active.id && t.genres.some((g) => genres.has(g)))
    .slice(0, 12);

  if (related.length === 0) return null;

  return (
    <section>
      <h3 className="mb-4 text-xl font-semibold">More Like This</h3>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {related.map((t) => {
          const img = backdropSrc(t, "w500");
          return (
            <button
              key={t.id}
              onClick={() => open(t)}
              className="group flex flex-col overflow-hidden rounded-md bg-[#2a2a2a] text-left transition hover:bg-[#333] focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <div className="relative aspect-video w-full">
                {img ? (
                  <Image src={img} alt={t.name} fill sizes="(max-width:640px) 50vw, 240px" className="object-cover" />
                ) : (
                  <div className="h-full w-full" style={{ background: posterGradient(t.name) }} />
                )}
                <span className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition group-hover:opacity-100">
                  <PlayIcon className="h-8 w-8 text-white" />
                </span>
              </div>
              <div className="space-y-1.5 p-3">
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="font-semibold text-green-500">{t.matchPct}% Match</span>
                  <span className="rounded border border-neutral-500 px-1 text-neutral-300">{t.rating}</span>
                </div>
                <p className="text-sm font-medium">{t.name}</p>
                <p className="line-clamp-3 text-xs leading-relaxed text-neutral-400">{t.overview}</p>
              </div>
            </button>
          );
        })}
      </div>
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
