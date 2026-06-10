// Generates PWA / favicon icons (gold star on dark) into public/.
// Run: node scripts/generate-icons.mjs
import sharp from "sharp";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "public");

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

async function gen(size, name, { maskable = false } = {}) {
  const s = size;
  const r = s * (maskable ? 0.28 : 0.36); // smaller star + full bleed for maskable safe zone
  const rx = maskable ? 0 : s * 0.18;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}">
    <rect width="${s}" height="${s}" rx="${rx}" fill="#141414"/>
    <polygon points="${starPoints(s / 2, s / 2 + s * 0.015, r)}" fill="#f5c542"/>
  </svg>`;
  await sharp(Buffer.from(svg)).png().toFile(join(OUT, name));
  console.log("wrote", name);
}

await gen(192, "icon-192.png");
await gen(512, "icon-512.png");
await gen(512, "icon-maskable.png", { maskable: true });
await gen(180, "apple-icon.png");
await gen(48, "favicon.png");
