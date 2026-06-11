"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { motion } from "framer-motion";
import { useModal } from "./ModalProvider";
import { useCatalog } from "./CatalogProvider";
import { useToast } from "./ToastProvider";
import { backdropSrc, posterGradient } from "@/lib/images";
import { isSeries } from "@/lib/episodes";
import { slugify } from "@/lib/slug";
import EpisodesSection from "./EpisodesSection";
import MoreLikeThis from "./MoreLikeThis";
import type { Title } from "@/lib/types";

export default function TitleModal() {
  const { active, close, autoPlay } = useModal();

  if (!active || typeof document === "undefined") return null;

  return createPortal(
    <TitleModalContent
      key={`${active.id}:${autoPlay ? "play" : "details"}`}
      active={active}
      close={close}
      autoPlay={autoPlay}
    />,
    document.body,
  );
}

function TitleModalContent({
  active,
  close,
  autoPlay,
}: {
  active: Title;
  close: () => void;
  autoPlay: boolean;
}) {
  const [playing, setPlaying] = useState(autoPlay);
  const [muted, setMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const lastSaveRef = useRef(0);
  const dialogRef = useRef<HTMLDivElement>(null);
  const { inList, toggleList, getProgress, recordProgress } = useCatalog();
  const { toast } = useToast();
  const saved = inList(active.id);

  // Keep the <video> element's muted property in sync (React won't update it via attribute alone).
  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = muted;
  }, [muted, playing]);

  // Focus trap: focus the dialog on open, keep Tab inside it, restore focus on close.
  useEffect(() => {
    const prevFocused = document.activeElement as HTMLElement | null;
    const root = dialogRef.current;
    root?.focus();
    const onTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab" || !root) return;
      const items = root.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onTab);
    return () => {
      document.removeEventListener("keydown", onTab);
      prevFocused?.focus?.();
    };
  }, []);

  // Lock body scroll + close on Escape while the modal is open.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [close]);

  const backdrop = backdropSrc(active, "w780");

  return (
    <div
      className="fixed inset-0 z-[80] flex justify-center overflow-y-auto bg-black/70 p-0 animate-fade-in sm:px-4 sm:py-8"
      onClick={close}
      role="dialog"
      aria-modal="true"
      aria-label={active.name}
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        className="relative min-h-full w-full overflow-hidden bg-[#181818] shadow-2xl outline-none animate-scale-in sm:my-auto sm:min-h-0 sm:max-w-3xl sm:rounded-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Banner / player */}
        <div className="relative aspect-video w-full bg-black">
          {playing ? (
            active.youtubeKey ? (
              <iframe
                className="h-full w-full"
                src={`https://www.youtube.com/embed/${active.youtubeKey}?autoplay=1&mute=1&rel=0&modestbranding=1`}
                title={`${active.name} trailer`}
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <>
                <video
                  ref={videoRef}
                  className="h-full w-full bg-black"
                  src={active.videoUrl}
                  controls
                  autoPlay
                  playsInline
                  muted={muted}
                  onLoadedMetadata={(e) => {
                    const v = e.currentTarget;
                    const p = getProgress(active.id);
                    if (p > 0 && p < 0.95 && v.duration) v.currentTime = p * v.duration;
                  }}
                  onTimeUpdate={(e) => {
                    const v = e.currentTarget;
                    const now = Date.now();
                    if (v.duration && now - lastSaveRef.current > 2000) {
                      lastSaveRef.current = now;
                      recordProgress(active, v.currentTime / v.duration);
                    }
                  }}
                />
                <button
                  onClick={() => setMuted((m) => !m)}
                  aria-label={muted ? "Unmute" : "Mute"}
                  className="absolute right-16 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-white/40 bg-black/50 text-white transition hover:border-white"
                >
                  {muted ? <MutedIcon className="h-4 w-4" /> : <SoundIcon className="h-4 w-4" />}
                </button>
              </>
            )
          ) : (
            <>
              {backdrop ? (
                <Image
                  src={backdrop}
                  alt={active.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 768px"
                  className="object-cover"
                  priority
                />
              ) : (
                <div
                  className="absolute inset-0 flex items-end p-8"
                  style={{ background: posterGradient(active.name) }}
                >
                  <h2 className="text-3xl font-extrabold drop-shadow-lg sm:text-5xl">
                    {active.name}
                  </h2>
                </div>
              )}
              {/* Bottom fade for legibility */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#181818] via-transparent to-transparent" />

              {/* Title + actions overlaid on the banner */}
              <div className="absolute bottom-6 left-6 right-6 flex flex-col gap-4">
                {backdrop && (
                  <h2 className="max-w-[70%] text-2xl font-extrabold drop-shadow-lg sm:text-4xl">
                    {active.name}
                  </h2>
                )}
                <div className="flex items-center gap-3">
                  <motion.button
                    whileTap={{ scale: 0.94 }}
                    onClick={() => setPlaying(true)}
                    className="flex items-center gap-2 rounded bg-white px-6 py-2 font-semibold text-black transition hover:bg-white/80"
                  >
                    <PlayIcon className="h-5 w-5" />
                    Play
                  </motion.button>
                  <CircleButton
                    label={saved ? "Remove from Watchlist" : "Add to Watchlist"}
                    onClick={() => {
                      toggleList(active);
                      toast(saved ? "Removed from Watchlist" : "Added to Watchlist", saved ? "minus" : "check");
                    }}
                  >
                    {saved ? <CheckIcon className="h-6 w-6" /> : <PlusIcon className="h-6 w-6" />}
                  </CircleButton>
                  <CircleButton label="I like this">
                    <ThumbIcon className="h-6 w-6" />
                  </CircleButton>
                  <CircleButton
                    label="Copy share link"
                    onClick={() => {
                      const url = `${window.location.origin}/title/${slugify(active.name)}`;
                      navigator.clipboard?.writeText(url);
                      toast("Link copied to clipboard", "check");
                    }}
                  >
                    <ShareIcon className="h-5 w-5" />
                  </CircleButton>
                </div>
              </div>
            </>
          )}

          {/* Close button */}
          <button
            onClick={close}
            aria-label="Close"
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-[#181818]/80 text-white transition hover:bg-[#181818]"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Details */}
        <div className="space-y-4 p-4 sm:p-8">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
            <span className="font-semibold text-green-500">{active.matchPct}% Match</span>
            <span className="text-neutral-300">{active.year}</span>
            <span className="rounded border border-neutral-500 px-1.5 text-xs text-neutral-300">
              {active.rating}
            </span>
            <span className="text-neutral-300">{active.length}</span>
            <span className="rounded bg-neutral-700 px-1.5 text-[10px] font-bold tracking-wide text-neutral-200">
              HD
            </span>
          </div>

          <p className="text-sm leading-relaxed text-neutral-200 sm:text-base">
            {active.overview}
          </p>

          {active.genres.length > 0 && (
            <p className="text-sm text-neutral-400">
              <span className="text-neutral-500">Genres: </span>
              {active.genres.join(", ")}
            </p>
          )}

          {isSeries(active) && (
            <div className="pt-4">
              <EpisodesSection title={active} onPlay={() => setPlaying(true)} />
            </div>
          )}

          <div className="pt-4">
            <MoreLikeThis active={active} />
          </div>
        </div>
      </div>
    </div>
  );
}

function CircleButton({
  children,
  label,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-neutral-400 bg-black/40 text-white transition hover:border-white hover:bg-white/10"
    >
      {children}
    </button>
  );
}

/* --- Icons --- */
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
function ShareIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className} aria-hidden>
      <circle cx="18" cy="5" r="2.5" />
      <circle cx="6" cy="12" r="2.5" />
      <circle cx="18" cy="19" r="2.5" />
      <path strokeLinecap="round" d="M8.2 10.8l7.6-4.4M8.2 13.2l7.6 4.4" />
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
function CloseIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className} aria-hidden>
      <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}
function MutedIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5L6 9H2v6h4l5 4V5zM23 9l-6 6M17 9l6 6" />
    </svg>
  );
}
function SoundIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5L6 9H2v6h4l5 4V5zM15.5 8.5a5 5 0 010 7M18.5 5.5a9 9 0 010 13" />
    </svg>
  );
}
