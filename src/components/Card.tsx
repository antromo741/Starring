"use client";

import { useState } from "react";
import Image from "next/image";
import type { Title } from "@/lib/types";
import { posterSrc, posterGradient } from "@/lib/images";
import { useModal } from "./ModalProvider";
import { useCatalog } from "./CatalogProvider";
import { useToast } from "./ToastProvider";

export default function Card({ title, progress }: { title: Title; progress?: number }) {
  const { open } = useModal();
  const { inList, toggleList } = useCatalog();
  const { toast } = useToast();
  const [broken, setBroken] = useState(false);
  const poster = posterSrc(title);
  const showImage = poster && !broken;
  const saved = inList(title.id);

  const openDetails = () => open(title);
  const stop = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={openDetails}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openDetails();
        }
      }}
      className="group relative aspect-[2/3] w-[140px] shrink-0 cursor-pointer overflow-hidden rounded-md bg-neutral-800 text-left transition-transform duration-300 hover:z-10 hover:scale-110 hover:shadow-2xl focus:z-10 focus:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-white sm:w-[160px] md:w-[180px]"
      aria-label={`${title.name} — open details`}
    >
      {showImage ? (
        <>
          {/* Shimmer sits behind; the poster paints over it once loaded */}
          <div className="skeleton absolute inset-0" />
          <Image
            src={poster}
            alt={title.name}
            fill
            sizes="180px"
            className="object-cover"
            onError={() => setBroken(true)}
          />
        </>
      ) : (
        <div
          className="flex h-full w-full flex-col justify-between p-3"
          style={{ background: posterGradient(title.name) }}
        >
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/50">
            ★ Series
          </span>
          <span className="text-lg font-extrabold leading-tight drop-shadow-md">{title.name}</span>
        </div>
      )}

      {/* Continue Watching progress bar */}
      {progress !== undefined && progress > 0 && (
        <div className="absolute inset-x-0 bottom-0 z-20 h-1 bg-white/30">
          <div className="h-full bg-accent" style={{ width: `${Math.min(100, progress * 100)}%` }} />
        </div>
      )}

      {/* Hover overlay with quick actions */}
      <div className="pointer-events-none absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/20 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100">
        <div className="pointer-events-auto mb-2 flex items-center gap-1.5">
          <button
            onClick={(e) => { stop(e); open(title, true); }}
            aria-label={`Play ${title.name}`}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-black transition hover:bg-white/80"
          >
            <PlayIcon className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={(e) => {
              stop(e);
              toggleList(title);
              toast(saved ? "Removed from Watchlist" : "Added to Watchlist", saved ? "minus" : "check");
            }}
            aria-label={saved ? "Remove from Watchlist" : "Add to Watchlist"}
            title={saved ? "Remove from Watchlist" : "Add to Watchlist"}
            className="flex h-7 w-7 items-center justify-center rounded-full border border-neutral-300 bg-black/50 text-white transition hover:border-white"
          >
            {saved ? <CheckIcon className="h-4 w-4" /> : <PlusIcon className="h-4 w-4" />}
          </button>
          <button
            onClick={stop}
            aria-label="I like this"
            className="flex h-7 w-7 items-center justify-center rounded-full border border-neutral-300 bg-black/50 text-white transition hover:border-white"
          >
            <ThumbIcon className="h-3.5 w-3.5" />
          </button>
        </div>
        <p className="truncate text-sm font-semibold">{title.name}</p>
        <div className="mt-1 flex items-center gap-2 text-[11px]">
          <span className="font-semibold text-green-500">{title.matchPct}%</span>
          <span className="rounded border border-neutral-500 px-1 text-neutral-300">{title.rating}</span>
          <span className="text-neutral-300">{title.length}</span>
        </div>
      </div>
    </div>
  );
}

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}
function PlusIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className} aria-hidden>
      <path strokeLinecap="round" d="M12 5v14M5 12h14" />
    </svg>
  );
}
function CheckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className={className} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}
function ThumbIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 11v9H4a1 1 0 01-1-1v-7a1 1 0 011-1h3zm0 0l4-7a2 2 0 012 2v3h5a2 2 0 012 2.3l-1.2 6A2 2 0 0118.8 20H7" />
    </svg>
  );
}
