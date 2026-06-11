"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import type { Title } from "@/lib/types";
import { backdropSrc, posterGradient } from "@/lib/images";
import { useModal } from "./ModalProvider";

export default function Hero({ title }: { title: Title }) {
  const { open } = useModal();
  const backdrop = backdropSrc(title, "original");

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
          className="absolute inset-0 h-full w-full object-cover object-[72%_50%] sm:object-top"
        />
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
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={() => open(title, true)}
            className="flex items-center gap-2 rounded bg-white px-6 py-2.5 font-semibold text-black transition hover:bg-white/80"
          >
            <PlayIcon className="h-5 w-5" />
            Play
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={() => open(title)}
            className="flex items-center gap-2 rounded bg-neutral-500/60 px-6 py-2.5 font-semibold text-white transition hover:bg-neutral-500/40"
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
