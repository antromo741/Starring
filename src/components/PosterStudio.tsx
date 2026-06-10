"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/**
 * "Star in your own poster" — fully client-side. The visitor uploads a photo
 * and the canvas composites it into a Starring-style poster (genre grade,
 * gradient, scrim, title typography, gold star credit), then downloads it.
 * No server needed — works on the static deploy.
 */

interface Genre {
  key: string;
  label: string;
  kind: "FILM" | "SERIES";
  from: string;
  to: string;
  accent: string;
  filter: string;
  tagline: string;
}

const GENRES: Genre[] = [
  { key: "action", label: "Action", kind: "FILM", from: "#0a2a33", to: "#d2691e", accent: "#ff7a1a", filter: "saturate(1.25) contrast(1.08)", tagline: "Legends aren't born. They're forged." },
  { key: "scifi", label: "Sci-Fi", kind: "SERIES", from: "#07173a", to: "#0a7da8", accent: "#54d0e0", filter: "saturate(1.1) contrast(1.05) brightness(1.02)", tagline: "The future wears a familiar face." },
  { key: "noir", label: "Noir", kind: "FILM", from: "#0a0a0a", to: "#1c2530", accent: "#e63946", filter: "grayscale(1) contrast(1.3)", tagline: "Everyone plays. Nobody wins clean." },
  { key: "romance", label: "Romance", kind: "FILM", from: "#3a1130", to: "#c95a7a", accent: "#ffd6e7", filter: "saturate(1.12) brightness(1.05)", tagline: "Some distances are worth crossing." },
  { key: "fantasy", label: "Fantasy", kind: "SERIES", from: "#1a0826", to: "#7a1f8e", accent: "#c77dff", filter: "saturate(1.2) contrast(1.05)", tagline: "Every throne is forged in fire." },
];

const WASH_OP = 0.28;

function drawStar(ctx: CanvasRenderingContext2D, cx: number, cy: number, outer: number, color: string) {
  const inner = outer * 0.4;
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const a = ((-90 + i * 36) * Math.PI) / 180;
    const x = cx + r * Math.cos(a);
    const y = cy + r * Math.sin(a);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
}

function wrapLines(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    const test = cur ? `${cur} ${w}` : w;
    if (ctx.measureText(test).width > maxWidth && cur) {
      lines.push(cur);
      cur = w;
    } else cur = test;
  }
  if (cur) lines.push(cur);
  return lines;
}

function drawPoster(canvas: HTMLCanvasElement, img: HTMLImageElement | null, title: string, g: Genre) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const W = 600;
  const H = 900;
  const mx = 48;
  ctx.clearRect(0, 0, W, H);

  // background gradient
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, g.from);
  bg.addColorStop(1, g.to);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // photo (cover-fit, genre-graded)
  if (img && img.width) {
    const cr = W / H;
    const ir = img.width / img.height;
    let sx: number, sy: number, sw: number, sh: number;
    if (ir > cr) {
      sh = img.height;
      sw = sh * cr;
      sx = (img.width - sw) / 2;
      sy = 0;
    } else {
      sw = img.width;
      sh = sw / cr;
      sx = 0;
      sy = (img.height - sh) * 0.15; // bias up to keep faces
    }
    ctx.save();
    ctx.filter = g.filter;
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, W, H);
    ctx.restore();
  }

  // themed wash
  ctx.save();
  ctx.globalAlpha = WASH_OP;
  const wash = ctx.createLinearGradient(0, 0, 0, H);
  wash.addColorStop(0, g.from);
  wash.addColorStop(1, g.to);
  ctx.fillStyle = wash;
  ctx.fillRect(0, 0, W, H);
  ctx.restore();

  // vignette
  const vig = ctx.createRadialGradient(W / 2, H * 0.42, H * 0.18, W / 2, H * 0.5, H * 0.78);
  vig.addColorStop(0, "rgba(0,0,0,0)");
  vig.addColorStop(1, "rgba(0,0,0,0.45)");
  ctx.fillStyle = vig;
  ctx.fillRect(0, 0, W, H);

  // bottom scrim
  const scrim = ctx.createLinearGradient(0, H * 0.42, 0, H);
  scrim.addColorStop(0, "rgba(0,0,0,0)");
  scrim.addColorStop(1, "rgba(0,0,0,0.92)");
  ctx.fillStyle = scrim;
  ctx.fillRect(0, 0, W, H);

  ctx.textBaseline = "alphabetic";

  // brand mark
  drawStar(ctx, mx + 12, 50, 15, "#f5c542");
  ctx.fillStyle = "rgba(255,255,255,0.85)";
  ctx.font = "800 18px Arial, sans-serif";
  setLetterSpacing(ctx, 4);
  ctx.fillText(g.kind, mx + 36, 56);
  setLetterSpacing(ctx, 0);

  // title (wrapped, sits above the meta line)
  const safeTitle = (title.trim() || "Your Title").slice(0, 28);
  const metaY = H - 56;
  ctx.font = "800 72px Arial, sans-serif";
  const lines = wrapLines(ctx, safeTitle, W - 2 * mx);
  const lh = 70;
  const titleLast = metaY - 58;
  const titleFirst = titleLast - (lines.length - 1) * lh;
  ctx.fillStyle = "#ffffff";
  lines.forEach((ln, i) => ctx.fillText(ln, mx, titleFirst + i * lh));

  // tagline
  const tagY = titleFirst - 62;
  ctx.fillStyle = g.accent;
  ctx.font = "italic 26px Georgia, 'Times New Roman', serif";
  ctx.fillText(clip(ctx, g.tagline, W - 2 * mx), mx, tagY);

  // credit
  ctx.fillStyle = "rgba(255,255,255,0.92)";
  ctx.font = "700 16px Arial, sans-serif";
  setLetterSpacing(ctx, 3);
  ctx.fillText("STARRING YOU", mx, tagY - 34);
  setLetterSpacing(ctx, 0);

  // accent rule + meta
  ctx.fillStyle = g.accent;
  ctx.fillRect(mx, metaY - 28, 66, 5);
  ctx.fillStyle = "#dddddd";
  ctx.font = "600 22px Arial, sans-serif";
  ctx.fillText(`${g.label} · 2024 · PG-13`, mx, metaY);
}

function setLetterSpacing(ctx: CanvasRenderingContext2D, px: number) {
  try {
    (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = `${px}px`;
  } catch {
    /* not supported — ignore */
  }
}
function clip(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string {
  if (ctx.measureText(text).width <= maxWidth) return text;
  let t = text;
  while (t.length > 4 && ctx.measureText(`${t}…`).width > maxWidth) t = t.slice(0, -1);
  return `${t}…`;
}

export default function PosterStudio({ open, onClose }: { open: boolean; onClose: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [title, setTitle] = useState("The Legend");
  const [genreKey, setGenreKey] = useState(GENRES[0].key);
  const genre = GENRES.find((x) => x.key === genreKey) ?? GENRES[0];

  // Redraw whenever inputs change.
  useEffect(() => {
    if (open && canvasRef.current) drawPoster(canvasRef.current, img, title, genre);
  }, [open, img, title, genre]);

  // Close on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const image = new window.Image();
    image.onload = () => {
      setImg(image);
      URL.revokeObjectURL(url);
    };
    image.src = url;
  };

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement("a");
    a.download = `${(title.trim() || "starring-you").toLowerCase().replace(/\s+/g, "-")}.png`;
    a.href = canvas.toDataURL("image/png");
    a.click();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex justify-center overflow-y-auto bg-black/80 p-0 sm:p-6"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Make your own poster"
        >
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative my-auto w-full max-w-4xl bg-[#181818] p-5 shadow-2xl sm:rounded-lg sm:p-7"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white transition hover:bg-black/80"
            >
              ✕
            </button>

            <h2 className="text-xl font-extrabold sm:text-2xl">
              Star in your own poster <span className="text-accent">★</span>
            </h2>
            <p className="mt-1 text-sm text-neutral-400">
              Upload a photo and the same pipeline that built this catalog frames you into a poster — right in your browser.
            </p>

            <div className="mt-5 grid gap-6 md:grid-cols-[1fr_auto]">
              {/* Controls */}
              <div className="order-2 space-y-5 md:order-1">
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-neutral-300">Your photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={onFile}
                    className="block w-full text-sm text-neutral-400 file:mr-3 file:cursor-pointer file:rounded file:border-0 file:bg-accent file:px-4 file:py-2 file:font-semibold file:text-black hover:file:bg-[#ffd866]"
                  />
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-neutral-300">Title</span>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    maxLength={28}
                    placeholder="Your title"
                    className="w-full rounded border border-neutral-600 bg-[#242424] px-3 py-2 text-sm text-white focus:border-accent focus:outline-none"
                  />
                </label>

                <div>
                  <span className="mb-1.5 block text-sm font-medium text-neutral-300">Genre</span>
                  <div className="flex flex-wrap gap-2">
                    {GENRES.map((gg) => (
                      <button
                        key={gg.key}
                        onClick={() => setGenreKey(gg.key)}
                        className={`rounded-full px-3.5 py-1.5 text-sm transition ${
                          gg.key === genreKey
                            ? "bg-accent font-semibold text-black"
                            : "border border-neutral-600 text-neutral-300 hover:border-white"
                        }`}
                      >
                        {gg.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 pt-1">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={download}
                    disabled={!img}
                    className="rounded bg-white px-5 py-2.5 font-semibold text-black transition hover:bg-white/80 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Download poster
                  </motion.button>
                  {!img && <p className="self-center text-xs text-neutral-500">Upload a photo to enable download.</p>}
                </div>
              </div>

              {/* Live preview */}
              <div className="order-1 flex justify-center md:order-2">
                <canvas
                  ref={canvasRef}
                  width={600}
                  height={900}
                  className="h-auto w-full max-w-[260px] rounded-md border border-neutral-800 shadow-lg"
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
