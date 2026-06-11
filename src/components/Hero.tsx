"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import type { Title } from "@/lib/types";
import { backdropSrc, mobileHeroSrc, posterGradient } from "@/lib/images";
import { useModal } from "./ModalProvider";

export default function Hero({ title }: { title: Title }) {
  const { open } = useModal();
  const backdrop = backdropSrc(title, "original");
  const mobileArtwork = mobileHeroSrc(title) ?? backdrop;
  const desktopArtwork = backdrop ?? mobileArtwork;

  const [trailer, setTrailer] = useState(false);
  const [muted, setMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Auto-play a muted trailer after a beat — desktop only, never with reduced motion.
  useEffect(() => {
    if (!title.videoUrl) return;
    const bigScreen = window.matchMedia("(min-width: 768px)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!bigScreen || reduced) return;
    const t = setTimeout(() => setTrailer(true), 3500);
    return () => clearTimeout(t);
  }, [title.videoUrl]);

  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = muted;
  }, [muted, trailer]);

  return (
    <section className="relative h-[78svh] min-h-[560px] max-h-[760px] w-full overflow-hidden sm:h-[70vh] sm:min-h-[480px] sm:max-h-none">
      {/* Background */}
      {mobileArtwork ? (
        <Image
          src={mobileArtwork}
          alt={title.name}
          fill
          priority
          sizes="100vw"
          className="object-cover object-[50%_24%] sm:hidden"
        />
      ) : (
        <div className="absolute inset-0" style={{ background: posterGradient(title.name) }} />
      )}
      {desktopArtwork && (
        <Image
          src={desktopArtwork}
          alt={title.name}
          fill
          priority
          sizes="100vw"
          className="hidden object-cover object-top sm:block"
        />
      )}

      {/* Muted auto-trailer fades in over the image (desktop) */}
      {trailer && title.videoUrl && (
        <motion.video
          ref={videoRef}
          src={title.videoUrl}
          autoPlay
          muted={muted}
          playsInline
          onEnded={() => setTrailer(false)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 hidden h-full w-full object-cover object-top sm:block"
        />
      )}

      {/* Legibility gradients tuned separately for phone portrait art and desktop backdrops. */}
      <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/70 to-transparent sm:hidden" />
      <div className="absolute inset-x-0 bottom-0 h-[56%] bg-gradient-to-t from-[#141414] via-black/75 to-transparent sm:hidden" />
      <div className="absolute inset-0 hidden bg-gradient-to-r from-black/80 via-black/30 to-transparent sm:block" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#141414] to-transparent" />

      {/* Content */}
      <div className="absolute bottom-[7%] left-4 right-4 max-w-[24rem] space-y-3 sm:bottom-[18%] sm:left-8 sm:right-auto sm:max-w-xl sm:space-y-4">
        <h1 className="text-3xl font-extrabold drop-shadow-2xl sm:text-6xl">{title.name}</h1>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
          <span className="font-semibold text-green-500">{title.matchPct}% Match</span>
          <span className="text-neutral-200">{title.year}</span>
          <span className="rounded border border-neutral-400 px-1.5 text-xs text-neutral-200">
            {title.rating}
          </span>
          <span className="text-neutral-200">{title.length}</span>
        </div>
        <p className="line-clamp-2 max-w-lg text-sm leading-relaxed text-neutral-200 drop-shadow-lg sm:line-clamp-3 sm:text-base">
          {title.overview}
        </p>
        <div className="flex flex-wrap items-center gap-2 pt-1 sm:gap-3 sm:pt-2">
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={() => open(title, true)}
            className="flex items-center gap-2 rounded bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-white/80 sm:px-6 sm:text-base"
          >
            <PlayIcon className="h-5 w-5" />
            Play
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={() => open(title)}
            className="flex items-center gap-2 rounded bg-neutral-500/60 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-neutral-500/40 sm:px-6 sm:text-base"
          >
            <InfoIcon className="h-5 w-5" />
            More Info
          </motion.button>
        </div>
      </div>

      {trailer && (
        <button
          onClick={() => setMuted((m) => !m)}
          aria-label={muted ? "Unmute" : "Mute"}
          className="absolute bottom-[14%] right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-black/40 text-white transition hover:border-white sm:right-8"
        >
          {muted ? <MuteGlyph className="h-4 w-4" /> : <SoundGlyph className="h-4 w-4" />}
        </button>
      )}
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
function MuteGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5L6 9H2v6h4l5 4V5zM23 9l-6 6M17 9l6 6" />
    </svg>
  );
}
function SoundGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5L6 9H2v6h4l5 4V5zM15.5 8.5a5 5 0 010 7M18.5 5.5a9 9 0 010 13" />
    </svg>
  );
}
