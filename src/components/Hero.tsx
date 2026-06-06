"use client";

import Image from "next/image";
import type { Title } from "@/lib/types";
import { backdropSrc, posterGradient } from "@/lib/images";
import { useModal } from "./ModalProvider";

export default function Hero({ title }: { title: Title }) {
  const { open } = useModal();
  const backdrop = backdropSrc(title, "original");

  return (
    <section className="relative h-[60svh] min-h-[440px] w-full sm:h-[70vh] sm:min-h-[480px]">
      {/* Background */}
      {backdrop ? (
        <Image
          src={backdrop}
          alt={title.name}
          fill
          priority
          sizes="100vw"
          className="object-cover object-[72%_50%] sm:object-top"
        />
      ) : (
        <div className="absolute inset-0" style={{ background: posterGradient(title.name) }} />
      )}

      {/* Legibility gradient: bottom-up on mobile (content sits low), left→right on desktop */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent sm:bg-gradient-to-r sm:from-black/80 sm:via-black/30 sm:to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#141414] to-transparent" />

      {/* Content */}
      <div className="absolute bottom-[12%] left-4 right-4 max-w-xl space-y-4 sm:bottom-[18%] sm:left-8 sm:right-auto">
        <h1 className="text-3xl font-extrabold drop-shadow-2xl sm:text-6xl">{title.name}</h1>
        <div className="flex items-center gap-3 text-sm">
          <span className="font-semibold text-green-500">{title.matchPct}% Match</span>
          <span className="text-neutral-200">{title.year}</span>
          <span className="rounded border border-neutral-400 px-1.5 text-xs text-neutral-200">
            {title.rating}
          </span>
          <span className="text-neutral-200">{title.length}</span>
        </div>
        <p className="line-clamp-3 max-w-lg text-sm text-neutral-200 drop-shadow-lg sm:text-base">
          {title.overview}
        </p>
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={() => open(title, true)}
            className="flex items-center gap-2 rounded bg-white px-6 py-2.5 font-semibold text-black transition hover:bg-white/80"
          >
            <PlayIcon className="h-5 w-5" />
            Play
          </button>
          <button
            onClick={() => open(title)}
            className="flex items-center gap-2 rounded bg-neutral-500/60 px-6 py-2.5 font-semibold text-white transition hover:bg-neutral-500/40"
          >
            <InfoIcon className="h-5 w-5" />
            More Info
          </button>
        </div>
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
function InfoIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className} aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path strokeLinecap="round" d="M12 11v5M12 7.5h.01" />
    </svg>
  );
}
