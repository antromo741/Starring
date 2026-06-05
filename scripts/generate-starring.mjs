// Composites a real photo into 10 cinematic movie posters + wide thumbnails,
// each with a distinct color grade / treatment. Emits src/lib/starringData.ts.
//
// 1. Save your photo as public/me.png (or me.jpg / me.jpeg / me.webp)
// 2. Run: node scripts/generate-starring.mjs
import sharp from "sharp";
import { mkdir, writeFile, access } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "public", "starring");
const STAR = "ANTHONY ROMA";
const SAMPLE_VIDEO =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

async function findPhoto() {
  const names = [
    "me.png", "me.jpg", "me.jpeg", "me.webp",
    "headshot-formal.png", "headshot-primary.png",
  ];
  for (const n of names) {
    const p = join(ROOT, "public", n);
    try {
      await access(p);
      return p;
    } catch {}
  }
  throw new Error(
    "No photo found. Save your image as public/me.png (or .jpg/.jpeg/.webp) and re-run.",
  );
}

/* --------------------------------------------------------------- titles */
const TITLES = [
  { slug: "redbeard", name: "Redbeard", kind: "FILM", genre: "Action · Adventure", year: 2024, rating: "PG-13", length: "2h 7m", grade: "action", from: "#0a2a33", to: "#d2691e", accent: "#ff7a1a", vignette: 0.35, washOp: 0.30, tagline: "Legends aren't born. They're forged.", overview: "A legendary outlaw thought long dead resurfaces to settle one final score on the lawless frontier of the high seas." },
  { slug: "genesis-protocol", name: "Genesis Protocol", kind: "SERIES", genre: "Sci-Fi · Thriller", year: 2024, rating: "TV-MA", length: "1 Season", grade: "scifi", from: "#07173a", to: "#0a7da8", accent: "#54d0e0", vignette: 0.30, washOp: 0.20, tagline: "The future wears a familiar face.", overview: "When an AI awakens wearing the face of its creator, one engineer must decide what makes us human before it's too late." },
  { slug: "the-long-game", name: "The Long Game", kind: "FILM", genre: "Crime · Drama", year: 2023, rating: "R", length: "2h 14m", grade: "noir", from: "#0a0a0a", to: "#1c2530", accent: "#e63946", vignette: 0.60, washOp: 0.16, tagline: "Everyone plays. Nobody wins clean.", overview: "A career con artist is pulled into one last scheme — where the only way out is to outplay everyone who ever trusted him." },
  { slug: "static", name: "Static", kind: "FILM", genre: "Horror", year: 2024, rating: "R", length: "1h 48m", grade: "horror", from: "#060d09", to: "#14361f", accent: "#9be15d", vignette: 0.65, washOp: 0.32, tagline: "Can you hear it too?", overview: "Strange signals bleed through every screen in a remote town, and the man who hears them first may be the only one who can stop them." },
  { slug: "beard-necessities", name: "Beard Necessities", kind: "SERIES", genre: "Comedy", year: 2023, rating: "TV-14", length: "2 Seasons", grade: "comedy", from: "#b3201f", to: "#f59e0b", accent: "#ffe14d", vignette: 0.20, washOp: 0.26, tagline: "One man. One beard. No plan.", overview: "A wildly overconfident slacker bluffs his way into running a high-end barbershop with absolutely no idea what he's doing." },
  { slug: "ironwood", name: "Ironwood", kind: "SERIES", genre: "Drama", year: 2024, rating: "TV-MA", length: "1 Season", grade: "drama", from: "#1a1410", to: "#3a2f28", accent: "#d8a657", vignette: 0.45, washOp: 0.20, tagline: "A quiet man. A loud reckoning.", overview: "A reclusive craftsman returns to the town that broke him, forcing a reckoning years in the making." },
  { slug: "dust-and-ash", name: "Dust & Ash", kind: "FILM", genre: "Western · Drama", year: 2023, rating: "R", length: "2h 19m", grade: "western", from: "#271708", to: "#9c5a1e", accent: "#f4a261", vignette: 0.40, washOp: 0.22, tagline: "The frontier remembers.", overview: "A drifter with nothing left to lose rides into a dying town and becomes its last, unlikely hope." },
  { slug: "closer", name: "Closer", kind: "FILM", genre: "Romance · Drama", year: 2024, rating: "PG-13", length: "1h 56m", grade: "romance", from: "#3a1130", to: "#c95a7a", accent: "#ffd6e7", vignette: 0.30, washOp: 0.28, tagline: "Some distances are worth crossing.", overview: "Two strangers keep crossing paths across one unforgettable city, daring to believe the timing might finally be right." },
  { slug: "the-ember-crown", name: "The Ember Crown", kind: "SERIES", genre: "Fantasy · Adventure", year: 2024, rating: "TV-14", length: "1 Season", grade: "fantasy", from: "#1a0826", to: "#7a1f8e", accent: "#c77dff", vignette: 0.35, washOp: 0.24, tagline: "Every throne is forged in fire.", overview: "A blacksmith's son discovers he's the last heir to a fallen kingdom — and the only one who can reclaim its burning throne." },
  { slug: "the-last-commit", name: "The Last Commit", kind: "FILM", genre: "Thriller", year: 2024, rating: "TV-MA", length: "1h 51m", grade: "tech", from: "#04161a", to: "#0c5a63", accent: "#34e0c8", vignette: 0.40, washOp: 0.20, tagline: "Ship it. Or else.", overview: "A burned-out developer uncovers a deadly secret buried in his company's code, and shipping the truth could cost him everything." },
];

/* ------------------------------------------------------------ stylize fx */
// Per-title artistic transform — a real image rework, not just a color filter.
const STYLE = {
  redbeard: "comic", "genesis-protocol": "hologram", "the-long-game": "noir",
  static: "glitch", "beard-necessities": "popart", ironwood: "charcoal",
  "dust-and-ash": "engrave", closer: "bloom", "the-ember-crown": "relief",
  "the-last-commit": "matrix",
};

const LAP = { width: 3, height: 3, kernel: [-1, -1, -1, -1, 8, -1, -1, -1, -1] };

function noiseBuf(w, h, sigma) {
  return sharp({ create: { width: w, height: h, channels: 3, background: { r: 128, g: 128, b: 128 }, noise: { type: "gaussian", mean: 128, sigma } } }).png().toBuffer();
}
function scanlinesSVG(w, h, gap = 3, op = 0.2) {
  let s = "";
  for (let y = 0; y < h; y += gap * 2) s += `<rect x="0" y="${y}" width="${w}" height="${gap}" fill="#000" opacity="${op}"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">${s}</svg>`;
}
function glitchSVG(w, h) {
  let s = "";
  for (let y = 0; y < h; y += 4) s += `<rect x="0" y="${y}" width="${w}" height="2" fill="#000" opacity="0.26"/>`;
  // colored displaced streak bars
  const bars = [[0.16, 11, "#19e0ff", 0.55], [0.31, 5, "#ff2e88", 0.55], [0.5, 16, "#ffffff", 0.16], [0.63, 7, "#19e0ff", 0.45], [0.78, 5, "#ff2e88", 0.5]];
  for (const [fy, bh, col, op] of bars) {
    s += `<rect x="${Math.round(w * 0.05)}" y="${Math.round(fy * h)}" width="${w}" height="${bh}" fill="${col}" opacity="${op}"/>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">${s}</svg>`;
}
async function posterize(buf, colors) {
  try { return await sharp(buf).png({ palette: true, colors, dither: 0 }).toBuffer(); }
  catch { return buf; }
}

async function stylize(srcBuf, style, w, h) {
  // Always start from a normalized, full-brightness base so the face never
  // gets lost on the dark poster background.
  const px = await sharp(srcBuf)
    .resize(w, h, { fit: "cover", position: "top" })
    .removeAlpha()
    .normalise()
    .toBuffer();
  const SL = (gap, op) => ({ input: Buffer.from(scanlinesSVG(w, h, gap, op)), blend: "over" });

  switch (style) {
    case "comic": { // bright inked + posterized graphic-novel
      const flat = await sharp(px).modulate({ saturation: 1.6 }).linear(1.12, 2).toBuffer();
      const edges = await sharp(px).grayscale().convolve(LAP).linear(1.4, 0).negate().toBuffer();
      const out = await sharp(flat).composite([{ input: edges, blend: "multiply" }]).toBuffer();
      return posterize(out, 12);
    }
    case "hologram": { // glowing cyan wireframe over a bright cyan duotone
      const duo = await sharp(px).grayscale().linear(1.25, -10).tint({ r: 50, g: 150, b: 205 }).toBuffer();
      const edges = await sharp(px).grayscale().convolve(LAP).linear(2.5, 0).tint({ r: 140, g: 245, b: 255 }).toBuffer();
      return sharp(duo).composite([{ input: edges, blend: "screen" }, SL(3, 0.16)]).toBuffer();
    }
    case "noir": // crushed high-contrast black & white lithograph
      return sharp(px).grayscale().linear(1.55, -60).toBuffer();
    case "glitch": { // bold RGB-split chromatic aberration + grain + glitch bars
      const off = Math.round(w * 0.05);
      const red = await sharp(px).recomb([[1, 0, 0], [0, 0, 0], [0, 0, 0]]).toBuffer();
      // shift the cyan channel right by `off` (pad left, then crop back to size)
      const cyanRaw = await sharp(px).recomb([[0, 0, 0], [0, 1, 0], [0, 0, 1]]).toBuffer();
      const cyanPad = await sharp(cyanRaw)
        .extend({ top: 0, bottom: 0, left: off, right: 0, background: "#000000" })
        .toBuffer();
      const cyan = await sharp(cyanPad).extract({ left: 0, top: 0, width: w, height: h }).toBuffer();
      const out = await sharp(red)
        .composite([
          { input: cyan, blend: "add" },
          { input: await noiseBuf(w, h, 18), blend: "soft-light" },
          { input: Buffer.from(glitchSVG(w, h)), blend: "over" },
        ])
        .toBuffer();
      return sharp(out).modulate({ brightness: 1.1 }).toBuffer();
    }
    case "popart": { // saturated, posterized Warhol-style pop
      const out = await sharp(px).modulate({ saturation: 2.2, brightness: 1.06 }).linear(1.3, -24).toBuffer();
      return posterize(out, 5);
    }
    case "charcoal": // moody high-contrast warm monochrome (drama)
      return sharp(px).grayscale().linear(1.4, -34).tint({ r: 225, g: 210, b: 192 }).toBuffer();
    case "engrave": { // high-contrast sepia + grain (western)
      const sepia = await sharp(px).grayscale().linear(1.35, -26).tint({ r: 222, g: 170, b: 96 }).toBuffer();
      const out = await sharp(sepia).composite([{ input: await noiseBuf(w, h, 14), blend: "soft-light" }]).toBuffer();
      return posterize(out, 16);
    }
    case "bloom": { // dreamy soft glow (romance)
      const glow = await sharp(px).modulate({ brightness: 1.3 }).blur(18).toBuffer();
      return sharp(px).modulate({ saturation: 1.15, brightness: 1.06 }).composite([{ input: glow, blend: "screen" }]).toBuffer();
    }
    case "relief": { // bold glowing purple duotone (fantasy)
      const duo = await sharp(px).grayscale().linear(1.3, -18).tint({ r: 170, g: 90, b: 240 }).toBuffer();
      const edges = await sharp(px).grayscale().convolve(LAP).linear(2.0, 0).tint({ r: 235, g: 190, b: 255 }).toBuffer();
      const lit = await sharp(duo).composite([{ input: edges, blend: "screen" }]).toBuffer();
      const glow = await sharp(lit).blur(6).toBuffer();
      return sharp(lit).composite([{ input: glow, blend: "screen" }]).toBuffer();
    }
    case "matrix": { // bold green code-scan with scanlines (tech)
      const duo = await sharp(px).grayscale().linear(1.35, -20).tint({ r: 30, g: 225, b: 110 }).toBuffer();
      const edges = await sharp(px).grayscale().convolve(LAP).linear(2.2, 0).tint({ r: 150, g: 255, b: 170 }).toBuffer();
      const out = await sharp(duo).composite([{ input: edges, blend: "screen" }, SL(3, 0.2)]).toBuffer();
      return posterize(out, 10);
    }
    default:
      return px;
  }
}

/* --------------------------------------------------------------- helpers */
function esc(s) { return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
function seedOf(str) { let h = 2166136261; for (let i = 0; i < str.length; i++) h = (h ^ str.charCodeAt(i)) * 16777619; return h >>> 0; }
function starPoints(cx, cy, outer) {
  const inner = outer * 0.4;
  let p = "";
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const a = ((-90 + i * 36) * Math.PI) / 180;
    p += `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)} `;
  }
  return p.trim();
}
function wrap(text, max) {
  const words = text.split(" "); const lines = []; let cur = "";
  for (const w of words) { if ((cur + " " + w).trim().length > max && cur) { lines.push(cur); cur = w; } else cur = (cur + " " + w).trim(); }
  if (cur) lines.push(cur); return lines;
}

/** Feathered radial alpha mask so the photo blends into the poster. */
function maskSVG(w, h, cx, cy) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <defs><radialGradient id="m" cx="${(cx * 100).toFixed(0)}%" cy="${(cy * 100).toFixed(0)}%" r="65%">
      <stop offset="0" stop-color="#fff" stop-opacity="1"/>
      <stop offset="0.60" stop-color="#fff" stop-opacity="1"/>
      <stop offset="1" stop-color="#fff" stop-opacity="0"/>
    </radialGradient></defs>
    <rect width="${w}" height="${h}" fill="url(#m)"/></svg>`;
}

/** Left-edge fade for portrait art when it is adapted into a wide backdrop. */
function widePortraitMaskSVG(w, h) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <defs><linearGradient id="m" x1="0" y1="0" x2="0.35" y2="0">
      <stop offset="0" stop-color="#fff" stop-opacity="0"/>
      <stop offset="0.18" stop-color="#fff" stop-opacity="0.85"/>
      <stop offset="0.35" stop-color="#fff" stop-opacity="1"/>
    </linearGradient></defs>
    <rect width="${w}" height="${h}" fill="url(#m)"/></svg>`;
}

/** Themed background the masked photo is placed onto. */
function bgSVG(cfg, W, H) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${cfg.from}"/><stop offset="1" stop-color="${cfg.to}"/>
      </linearGradient>
      <radialGradient id="glow" cx="50%" cy="35%" r="70%">
        <stop offset="0" stop-color="${cfg.accent}" stop-opacity="0.30"/>
        <stop offset="1" stop-color="${cfg.accent}" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#bg)"/>
    <rect width="${W}" height="${H}" fill="url(#glow)"/></svg>`;
}

/** Top overlay: color wash + vignette + scrim (+ text on posters only).
 *  `soft` lightens the wash/vignette so a rich source image shows through. */
function overlaySVG(cfg, W, H, wide, withText, soft = false) {
  const washOp = soft ? (cfg.washOp * 0.4).toFixed(3) : cfg.washOp;
  const vigOp = soft ? (cfg.vignette * 0.55).toFixed(3) : cfg.vignette;
  const mx = wide ? 64 : 48;
  const usable = wide ? 470 : W - 2 * mx;
  const lines = wrap(cfg.name, wide ? 13 : 11);
  const longest = Math.max(...lines.map((l) => l.length));
  const baseFs = wide ? (lines.length >= 2 ? 70 : 86) : lines.length >= 2 ? 66 : 80;
  const fs = Math.min(baseFs, Math.floor(usable / (longest * 0.58)));
  const lh = fs * 1.0;
  const tagFs = Math.max(13, Math.min(wide ? 27 : 24, Math.floor(usable / (cfg.tagline.length * 0.52))));
  const credFs = wide ? 20 : 18;

  let firstBaseline, metaY, tagBaseline, credBaseline;
  if (wide) {
    const blockH = (lines.length - 1) * lh;
    firstBaseline = H * 0.5 - blockH / 2 + fs * 0.3;
    tagBaseline = firstBaseline - fs * 0.8 - 16;
    credBaseline = tagBaseline - tagFs - 14;
    metaY = firstBaseline + blockH + 50;
  } else {
    metaY = H - 64;
    const lastBaseline = metaY - 48;
    firstBaseline = lastBaseline - (lines.length - 1) * lh;
    tagBaseline = firstBaseline - fs * 0.8 - 18;
    credBaseline = tagBaseline - tagFs - 12;
  }

  const titleTspans = lines
    .map((ln, i) => `<tspan x="${mx}" ${i === 0 ? `y="${firstBaseline.toFixed(1)}"` : `dy="${lh.toFixed(1)}"`}>${esc(ln)}</tspan>`)
    .join("");

  const scrim = wide
    ? `<rect width="${W}" height="${H}" fill="url(#scrimW)"/>`
    : `<rect width="${W}" height="${H}" fill="url(#scrimH)"/>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="wash" x1="0" y1="0" x2="0.4" y2="1">
      <stop offset="0" stop-color="${cfg.from}"/><stop offset="1" stop-color="${cfg.to}"/>
    </linearGradient>
    <radialGradient id="vig" cx="50%" cy="45%" r="75%">
      <stop offset="0.45" stop-color="#000" stop-opacity="0"/>
      <stop offset="1" stop-color="#000" stop-opacity="${vigOp}"/>
    </radialGradient>
    <linearGradient id="scrimH" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0.4" stop-color="#000" stop-opacity="0"/>
      <stop offset="1" stop-color="#000" stop-opacity="0.9"/>
    </linearGradient>
    <linearGradient id="scrimW" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#000" stop-opacity="0.88"/>
      <stop offset="0.55" stop-color="#000" stop-opacity="0.2"/>
      <stop offset="1" stop-color="#000" stop-opacity="0"/>
    </linearGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#wash)" opacity="${washOp}"/>
  <rect width="${W}" height="${H}" fill="url(#vig)"/>
  ${scrim}
  ${withText ? `
  <g font-family="Arial, sans-serif" font-weight="800">
    <polygon points="${starPoints(mx + 12, wide ? 48 : 46, 14)}" fill="#f5c542"/>
    <text x="${mx + 36}" y="${wide ? 60 : 58}" font-size="17" letter-spacing="4" fill="#fff" opacity="0.85">${cfg.kind}</text>
  </g>

  <text x="${mx}" y="${credBaseline.toFixed(1)}" font-family="Arial, sans-serif" font-weight="700" font-size="${credFs}" letter-spacing="3" fill="#ffffff" opacity="0.92">${STAR}</text>
  <text x="${mx}" y="${tagBaseline.toFixed(1)}" font-family="Georgia, 'Times New Roman', serif" font-style="italic" font-size="${tagFs}" fill="${cfg.accent}" opacity="0.95">${esc(cfg.tagline)}</text>
  <text font-family="Arial, sans-serif" font-weight="800" font-size="${fs}" fill="#ffffff" letter-spacing="-1">${titleTspans}</text>
  <rect x="${mx}" y="${(metaY - 32).toFixed(1)}" width="${wide ? 84 : 66}" height="5" rx="2.5" fill="${cfg.accent}"/>
  <text x="${mx}" y="${metaY.toFixed(1)}" font-family="Arial, sans-serif" font-weight="600" font-size="${wide ? 23 : 21}" fill="#dddddd">${esc(cfg.genre)} · ${cfg.year} · ${esc(cfg.rating)}</text>
  ` : ""}
</svg>`;
}

const SRC_DIR = join(ROOT, "public", "starring", "source");
const SRC_EXTS = ["png", "jpg", "jpeg", "webp"];

/** Find a user-provided (e.g. AI-generated) image for this title, if any.
 *  Wide art prefers `<slug>-wide.*`, then falls back to `<slug>.*`. */
async function findSource(slug, wide) {
  const bases = wide
    ? [{ name: `${slug}-wide`, dedicatedWide: true }, { name: slug, dedicatedWide: false }]
    : [{ name: slug, dedicatedWide: false }];
  for (const b of bases) {
    for (const ext of SRC_EXTS) {
      const p = join(SRC_DIR, `${b.name}.${ext}`);
      try {
        await access(p);
        return { path: p, dedicatedWide: b.dedicatedWide };
      } catch {}
    }
  }
  return null;
}

async function composeWideFromPortraitSource(srcPath, cfg, W, H) {
  const bg = await sharp(srcPath)
    .rotate()
    .resize(W, H, { fit: "cover", position: "attention" })
    .blur(22)
    .modulate({ brightness: 0.62, saturation: 0.85 })
    .toBuffer();

  const { data, info } = await sharp(srcPath)
    .rotate()
    .resize({ height: H, fit: "inside" })
    .toBuffer({ resolveWithObject: true });

  const portrait = await sharp(data)
    .composite([{ input: Buffer.from(widePortraitMaskSVG(info.width, info.height)), blend: "dest-in" }])
    .png()
    .toBuffer();

  return sharp(bg)
    .composite([
      { input: portrait, top: Math.round((H - info.height) / 2), left: W - info.width },
      { input: Buffer.from(overlaySVG(cfg, W, H, true, false, true)), top: 0, left: 0 },
    ])
    .png()
    .toBuffer();
}

async function compose(photoBuf, cfg, W, H, wide) {
  // 1) If a generated source image exists, frame it full-bleed + scrim + text.
  const src = await findSource(cfg.slug, wide);
  if (src) {
    if (wide && !src.dedicatedWide) {
      return composeWideFromPortraitSource(src.path, cfg, W, H);
    }

    const base = await sharp(src.path)
      .rotate()
      .resize(W, H, { fit: "cover", position: "attention" })
      .toBuffer();
    return sharp(base)
      .composite([{ input: Buffer.from(overlaySVG(cfg, W, H, wide, !wide, true)), top: 0, left: 0 }])
      .png()
      .toBuffer();
  }

  // 2) Otherwise: stylized headshot feathered onto a themed background.
  if (!photoBuf) {
    throw new Error(
      `No source image for "${cfg.slug}" (looked in public/starring/source/) ` +
        `and no base headshot in public/. Add one or the other.`,
    );
  }
  // Face region + placement: poster = top/full-width; wide = right side.
  const fw = wide ? 760 : W;
  const fh = wide ? H : 760;
  const left = wide ? W - fw + 60 : 0;
  const top = 0;
  const cx = wide ? 0.5 : 0.5;
  const cy = wide ? 0.4 : 0.42;

  const graded = await stylize(photoBuf, STYLE[cfg.slug] ?? "comic", fw, fh);
  const face = await sharp(graded)
    .composite([{ input: Buffer.from(maskSVG(fw, fh, cx, cy)), blend: "dest-in" }])
    .png().toBuffer();

  return sharp(Buffer.from(bgSVG(cfg, W, H)))
    .composite([
      { input: face, top, left },
      { input: Buffer.from(overlaySVG(cfg, W, H, wide, !wide)), top: 0, left: 0 },
    ])
    .png().toBuffer();
}

/* ------------------------------------------------------------------- run */
const PHOTO = await findPhoto().catch(() => null);
const photoBuf = PHOTO ? await sharp(PHOTO).rotate().toBuffer() : null; // respect EXIF
await mkdir(OUT, { recursive: true });
const records = [];
let id = 9101;

for (const cfg of TITLES) {
  const poster = await compose(photoBuf, cfg, 600, 900, false);
  const wide = await compose(photoBuf, cfg, 1280, 720, true);
  await writeFile(join(OUT, `${cfg.slug}.png`), poster);
  await writeFile(join(OUT, `${cfg.slug}-wide.png`), wide);
  records.push({
    id: id++, name: cfg.name, overview: cfg.overview, year: cfg.year,
    rating: cfg.rating, matchPct: 90 + (seedOf(cfg.slug) % 10), length: cfg.length,
    genres: cfg.genre.split(" · "),
    posterImage: `/starring/${cfg.slug}.png`,
    backdropImage: `/starring/${cfg.slug}-wide.png`,
    videoUrl: SAMPLE_VIDEO,
  });
  console.log("composed", cfg.slug);
}

const ts = `// AUTO-GENERATED by scripts/generate-starring.mjs — do not edit by hand.
import type { Title } from "./types";

export const STARRING: Title[] = ${JSON.stringify(records, null, 2)};
`;
await writeFile(join(ROOT, "src", "lib", "starringData.ts"), ts);
console.log("\\nwrote src/lib/starringData.ts with", records.length, "titles");
