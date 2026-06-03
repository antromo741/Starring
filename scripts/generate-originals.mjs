// Generates poster (2:3) + wide backdrop (16:9) PNGs for our original titles,
// and emits src/lib/originalsData.ts. Run with: node scripts/generate-originals.mjs
import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "public", "originals");

const SAMPLE_VIDEO =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

/* ---------------------------------------------------------------- titles */
/** @type {Array<{slug:string,name:string,kind:'FILM'|'SERIES',genre:string,year:number,rating:string,length:string,tagline:string,overview:string,from:string,to:string,accent:string,motif:string}>} */
const TITLES = [
  {
    slug: "the-last-laugh", name: "The Last Laugh", kind: "FILM",
    genre: "Comedy · Drama", year: 2024, rating: "TV-14", length: "1h 52m",
    tagline: "Every joke has a price.",
    overview: "A washed-up comedy legend reluctantly mentors the brash young rival who stole his big break — and discovers the punchline was on him all along.",
    from: "#3a1c5e", to: "#8e1f6a", accent: "#ffd166", motif: "spotlight",
  },
  {
    slug: "cereal-killers", name: "Cereal Killers", kind: "SERIES",
    genre: "Comedy", year: 2023, rating: "TV-PG", length: "2 Seasons",
    tagline: "Breakfast just got brutal.",
    overview: "Two feuding food-truck cooks turn the morning rush into all-out war, one questionable bowl of cereal at a time.",
    from: "#b3201f", to: "#f06a1d", accent: "#ffe14d", motif: "burst",
  },
  {
    slug: "out-of-office", name: "Out of Office", kind: "SERIES",
    genre: "Comedy", year: 2024, rating: "TV-14", length: "1 Season",
    tagline: "Working remotely. Very remotely.",
    overview: "When a struggling startup is forced to 'team-build' in a Wi-Fi-less mountain cabin, deadlines and dignity go offline together.",
    from: "#0d5c52", to: "#1f9e6a", accent: "#c6ff5e", motif: "stripes",
  },
  {
    slug: "pug-life", name: "Pug Life", kind: "FILM",
    genre: "Comedy", year: 2023, rating: "PG", length: "1h 39m",
    tagline: "He's small. He's spoiled. He's the target.",
    overview: "A burned-out bodyguard takes one last job: protecting the world's most pampered — and most dramatic — show pug.",
    from: "#a01a6e", to: "#5b2a86", accent: "#ffd6e7", motif: "bloom",
  },
  {
    slug: "galaxy-brains", name: "Galaxy Brains", kind: "SERIES",
    genre: "Sci-Fi · Comedy", year: 2024, rating: "TV-14", length: "1 Season",
    tagline: "Humanity's best and brightest were busy.",
    overview: "Three hopelessly unqualified interns accidentally launch — and now must pilot — Earth's very first deep-space starship.",
    from: "#1b1b6b", to: "#0e8aa8", accent: "#ff5ec7", motif: "stars",
  },
  {
    slug: "glass-harbor", name: "Glass Harbor", kind: "SERIES",
    genre: "Drama · Mystery", year: 2024, rating: "TV-MA", length: "2 Seasons",
    tagline: "Some tides never let go.",
    overview: "A grieving lighthouse keeper uncovers a decades-old secret buried beneath the waves of a fog-bound coastal town.",
    from: "#0a2540", to: "#123a63", accent: "#54d0e0", motif: "lighthouse",
  },
  {
    slug: "the-undertow", name: "The Undertow", kind: "FILM",
    genre: "Thriller · Drama", year: 2023, rating: "R", length: "2h 11m",
    tagline: "The past doesn't stay buried at sea.",
    overview: "A detective returns to her coastal hometown to solve a disappearance that mirrors the one that shattered her own childhood.",
    from: "#05201f", to: "#0b3b3a", accent: "#e63946", motif: "waves",
  },
  {
    slug: "ashes-of-atlas", name: "Ashes of Atlas", kind: "FILM",
    genre: "Sci-Fi · Drama", year: 2024, rating: "PG-13", length: "2h 24m",
    tagline: "One seed. A dead world. The last hope.",
    overview: "In a continent choked by endless ash, a hardened smuggler must carry the last living seed across a ruined frontier.",
    from: "#1a1410", to: "#9e3d12", accent: "#f4a261", motif: "ashen",
  },
  {
    slug: "concrete-roses", name: "Concrete Roses", kind: "SERIES",
    genre: "Drama", year: 2023, rating: "TV-MA", length: "1 Season",
    tagline: "Beauty grows where you least expect it.",
    overview: "A teenage poet fights to make her voice heard above the noise of a crumbling neighborhood that everyone else has given up on.",
    from: "#2b2d42", to: "#5a3a78", accent: "#ef476f", motif: "skyline",
  },
  {
    slug: "the-reckoning", name: "The Reckoning", kind: "FILM",
    genre: "Crime · Drama", year: 2024, rating: "R", length: "2h 6m",
    tagline: "Justice has a final balance.",
    overview: "A small-town lawyer risks everything to take on the corporation that quietly poisoned her family — and her town.",
    from: "#1a0000", to: "#7a1010", accent: "#cdd6dd", motif: "pillars",
  },
];

/* --------------------------------------------------------------- helpers */
function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}
function seedOf(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) h = (h ^ str.charCodeAt(i)) * 16777619;
  return h >>> 0;
}
function esc(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function wrap(text, max) {
  const words = text.split(" ");
  const lines = [];
  let cur = "";
  for (const w of words) {
    if ((cur + " " + w).trim().length > max && cur) {
      lines.push(cur);
      cur = w;
    } else cur = (cur + " " + w).trim();
  }
  if (cur) lines.push(cur);
  return lines;
}

/* ---------------------------------------------------------------- motifs */
function motif(name, W, H, c, seed) {
  const r = rng(seed);
  switch (name) {
    case "spotlight":
      return `<g fill="${c}">
        <polygon points="${W * 0.5},-20 ${W * 0.05},${H} ${-W * 0.1},${H}" opacity="0.14"/>
        <polygon points="${W * 0.5},-20 ${W * 0.95},${H} ${W * 1.1},${H}" opacity="0.14"/>
        <polygon points="${W * 0.5},-20 ${W * 0.42},${H} ${W * 0.58},${H}" opacity="0.10"/>
        <circle cx="${W * 0.5}" cy="${H * 0.18}" r="${W * 0.16}" opacity="0.20"/>
      </g>`;
    case "burst": {
      let s = "";
      const cx = W * 0.5, cy = H * 0.42, n = 26;
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2;
        s += `<line x1="${cx}" y1="${cy}" x2="${(cx + Math.cos(a) * W).toFixed(1)}" y2="${(cy + Math.sin(a) * W).toFixed(1)}" stroke="${c}" stroke-width="${i % 2 ? 7 : 16}" opacity="0.12"/>`;
      }
      return `<g>${s}<circle cx="${cx}" cy="${cy}" r="${W * 0.1}" fill="${c}" opacity="0.5"/></g>`;
    }
    case "stripes": {
      let s = "";
      for (let x = -H; x < W; x += 70) {
        s += `<rect x="${x}" y="-20" width="30" height="${H + 60}" fill="${c}" opacity="0.09" transform="skewX(-20)"/>`;
      }
      return `<g>${s}</g>`;
    }
    case "bloom": {
      const cx = W * 0.5, cy = H * 0.34, R = W * 0.22;
      let s = "";
      for (let layer = 0; layer < 2; layer++) {
        const rr = R * (1 - layer * 0.4);
        for (let i = 0; i < 6; i++) {
          const a = (i / 6) * 360 + layer * 30;
          s += `<ellipse cx="${cx}" cy="${cy - rr * 0.55}" rx="${(rr * 0.42).toFixed(1)}" ry="${rr.toFixed(1)}" fill="${c}" opacity="0.45" transform="rotate(${a} ${cx} ${cy})"/>`;
        }
      }
      return `<g>${s}<circle cx="${cx}" cy="${cy}" r="${(R * 0.28).toFixed(1)}" fill="#fff" opacity="0.55"/></g>`;
    }
    case "stars": {
      let s = "";
      for (let i = 0; i < 110; i++) {
        s += `<circle cx="${(r() * W).toFixed(1)}" cy="${(r() * H * 0.85).toFixed(1)}" r="${(r() * 1.8 + 0.5).toFixed(1)}" fill="#fff" opacity="${(r() * 0.7 + 0.2).toFixed(2)}"/>`;
      }
      for (let i = 0; i < 5; i++) {
        s += `<circle cx="${(r() * W).toFixed(1)}" cy="${(r() * H * 0.6).toFixed(1)}" r="${(r() * 4 + 3).toFixed(1)}" fill="${c}" opacity="0.85"/>`;
      }
      return `<g>${s}</g>`;
    }
    case "waves": {
      let s = "";
      const base = H * 0.55;
      for (let i = 0; i < 6; i++) {
        const y = base + i * H * 0.085;
        const amp = 22 + i * 8;
        s += `<path d="M0 ${y} Q ${W * 0.25} ${y - amp} ${W * 0.5} ${y} T ${W} ${y} V ${H} H 0 Z" fill="${c}" opacity="${(0.08 + i * 0.05).toFixed(2)}"/>`;
      }
      return `<g>${s}</g>`;
    }
    case "lighthouse": {
      // beam + waves + glow
      let s = `<polygon points="${W * 0.7},${H * 0.2} ${W},${H * 0.05} ${W},${H * 0.5}" fill="${c}" opacity="0.16"/>
        <polygon points="${W * 0.7},${H * 0.2} ${W},${H * 0.3} ${W},${H * 0.7}" fill="${c}" opacity="0.10"/>
        <circle cx="${W * 0.7}" cy="${H * 0.2}" r="${W * 0.05}" fill="${c}" opacity="0.9"/>`;
      const base = H * 0.62;
      for (let i = 0; i < 5; i++) {
        const y = base + i * H * 0.08;
        s += `<path d="M0 ${y} Q ${W * 0.3} ${y - 18} ${W * 0.6} ${y} T ${W} ${y} V ${H} H 0 Z" fill="${c}" opacity="${(0.10 + i * 0.05).toFixed(2)}"/>`;
      }
      return `<g>${s}</g>`;
    }
    case "ashen": {
      // sun behind drifting ash flecks + low ridge
      let s = `<circle cx="${W * 0.5}" cy="${H * 0.3}" r="${W * 0.5}" fill="${c}" opacity="0.10"/>
        <circle cx="${W * 0.5}" cy="${H * 0.3}" r="${W * 0.18}" fill="${c}" opacity="0.55"/>`;
      for (let i = 0; i < 80; i++) {
        s += `<circle cx="${(r() * W).toFixed(1)}" cy="${(r() * H).toFixed(1)}" r="${(r() * 2 + 0.6).toFixed(1)}" fill="#d9c8b4" opacity="${(r() * 0.4 + 0.1).toFixed(2)}"/>`;
      }
      s += `<polygon points="0,${H} ${W * 0.35},${H * 0.62} ${W * 0.6},${H}" fill="#000" opacity="0.35"/>
        <polygon points="${W * 0.45},${H} ${W * 0.8},${H * 0.55} ${W},${H}" fill="#000" opacity="0.45"/>`;
      return `<g>${s}</g>`;
    }
    case "skyline": {
      let s = "", x = 0;
      while (x < W) {
        const w = 24 + r() * 46;
        const h = H * 0.18 + r() * H * 0.45;
        const y = H - h;
        s += `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${(w - 5).toFixed(1)}" height="${h.toFixed(1)}" fill="${c}" opacity="0.45"/>`;
        for (let wy = y + 10; wy < H - 10; wy += 16) {
          for (let wx = x + 6; wx < x + w - 10; wx += 13) {
            if (r() > 0.55) s += `<rect x="${wx.toFixed(1)}" y="${wy.toFixed(1)}" width="4" height="6" fill="#fff" opacity="0.5"/>`;
          }
        }
        x += w;
      }
      return `<g>${s}</g>`;
    }
    case "pillars": {
      let s = "";
      for (let i = 0; i < 7; i++) {
        const x = (i + 0.5) * (W / 7);
        s += `<rect x="${(x - 14).toFixed(1)}" y="0" width="28" height="${H}" fill="${c}" opacity="${(0.05 + (i % 3) * 0.04).toFixed(2)}"/>`;
      }
      return `<g><polygon points="${W * 0.5},${H * 0.1} ${W * 0.15},${H} ${W * 0.85},${H}" fill="${c}" opacity="0.10"/>${s}</g>`;
    }
    default:
      return "";
  }
}

/* ----------------------------------------------------------- svg builder */
function buildSVG(cfg, W, H, wide) {
  const seed = seedOf(cfg.slug);
  const mx = wide ? 70 : 50;
  // usable text width — narrower on wide art so it doesn't run under the motif
  const usable = wide ? W * 0.62 - mx : W - 2 * mx;
  const lines = wrap(cfg.name, wide ? 16 : 11);
  const longest = Math.max(...lines.map((l) => l.length));
  const baseFs = wide ? (lines.length >= 2 ? 78 : 92) : lines.length >= 2 ? 70 : 84;
  // shrink to fit width (≈0.58 avg glyph width for bold Arial)
  const fs = Math.min(baseFs, Math.floor(usable / (longest * 0.58)));
  const lh = fs * 1.0;
  // tagline auto-fit (italic serif ≈0.52 glyph width)
  const tagFs = Math.max(14, Math.min(wide ? 30 : 26, Math.floor(usable / (cfg.tagline.length * 0.52))));

  // title block placement
  let firstBaseline, metaY, tagBaseline;
  if (wide) {
    const blockH = (lines.length - 1) * lh;
    firstBaseline = H * 0.46 - blockH / 2 + fs * 0.35;
    tagBaseline = firstBaseline - fs * 0.85 - 18;
    metaY = firstBaseline + blockH + 56;
  } else {
    metaY = H - 70;
    const lastBaseline = metaY - 52;
    firstBaseline = lastBaseline - (lines.length - 1) * lh;
    tagBaseline = firstBaseline - fs * 0.85 - 22;
  }

  const titleTspans = lines
    .map((ln, i) => `<tspan x="${mx}" ${i === 0 ? `y="${firstBaseline.toFixed(1)}"` : `dy="${lh.toFixed(1)}"`}>${esc(ln)}</tspan>`)
    .join("");

  // scrim: stronger on the side the text sits
  const scrim = wide
    ? `<rect width="${W}" height="${H}" fill="url(#scrimW)"/>`
    : `<rect width="${W}" height="${H}" fill="url(#scrimH)"/>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${cfg.from}"/>
      <stop offset="1" stop-color="${cfg.to}"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="32%" r="70%">
      <stop offset="0" stop-color="${cfg.accent}" stop-opacity="0.22"/>
      <stop offset="1" stop-color="${cfg.accent}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="scrimH" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0.35" stop-color="#000" stop-opacity="0"/>
      <stop offset="1" stop-color="#000" stop-opacity="0.85"/>
    </linearGradient>
    <linearGradient id="scrimW" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#000" stop-opacity="0.82"/>
      <stop offset="0.6" stop-color="#000" stop-opacity="0.15"/>
      <stop offset="1" stop-color="#000" stop-opacity="0"/>
    </linearGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>
  ${motif(cfg.motif, W, H, cfg.accent, seed)}
  ${scrim}

  ${wide ? "" : `
  <!-- brand tag -->
  <g font-family="Arial, sans-serif" font-weight="800">
    <text x="${mx}" y="60" font-size="34" fill="#e50914">N</text>
    <text x="${mx + 28}" y="60" font-size="18" letter-spacing="4" fill="#ffffff" opacity="0.85">${cfg.kind}</text>
  </g>

  <!-- tagline -->
  <text x="${mx}" y="${tagBaseline.toFixed(1)}" font-family="Georgia, 'Times New Roman', serif" font-style="italic" font-size="${tagFs}" fill="${cfg.accent}" opacity="0.95">${esc(cfg.tagline)}</text>

  <!-- title -->
  <text font-family="Arial, sans-serif" font-weight="800" font-size="${fs}" fill="#ffffff" letter-spacing="-1">${titleTspans}</text>

  <!-- accent rule -->
  <rect x="${mx}" y="${(metaY - 34).toFixed(1)}" width="70" height="5" rx="2.5" fill="${cfg.accent}"/>

  <!-- meta -->
  <text x="${mx}" y="${metaY.toFixed(1)}" font-family="Arial, sans-serif" font-weight="600" font-size="22" fill="#dddddd">${esc(cfg.genre)} · ${cfg.year} · ${esc(cfg.rating)}</text>
  `}
</svg>`;
}

/* --------------------------------------------------------------- run it */
await mkdir(OUT, { recursive: true });
const records = [];
let id = 9001;

for (const cfg of TITLES) {
  const poster = buildSVG(cfg, 600, 900, false);
  const wide = buildSVG(cfg, 1280, 720, true);
  await sharp(Buffer.from(poster)).png().toFile(join(OUT, `${cfg.slug}.png`));
  await sharp(Buffer.from(wide)).png().toFile(join(OUT, `${cfg.slug}-wide.png`));
  records.push({
    id: id++,
    name: cfg.name,
    overview: cfg.overview,
    year: cfg.year,
    rating: cfg.rating,
    matchPct: 90 + (seedOf(cfg.slug) % 10),
    length: cfg.length,
    genres: cfg.genre.split(" · "),
    posterImage: `/originals/${cfg.slug}.png`,
    backdropImage: `/originals/${cfg.slug}-wide.png`,
    videoUrl: SAMPLE_VIDEO,
  });
  console.log("generated", cfg.slug);
}

const ts = `// AUTO-GENERATED by scripts/generate-originals.mjs — do not edit by hand.
import type { Title } from "./types";

export const ORIGINALS: Title[] = ${JSON.stringify(records, null, 2)};
`;
await writeFile(join(ROOT, "src", "lib", "originalsData.ts"), ts);
console.log("\\nwrote src/lib/originalsData.ts with", records.length, "titles");
