# ★ Starring — Personalized Streaming Catalog

A polished, full-featured **streaming catalog app** built with **Next.js 16 (App Router)**, **React 19**, **TypeScript**, and **Tailwind CSS v4** — including profile selection, searchable content rows, persistent **My List**, **Continue Watching** progress, detail modals, keyboard-accessible interactions, and a personalized **"Starring You"** catalog generated from a single photo.

> ### ▶️ **[Live demo → starring-you.netlify.app](https://starring-you.netlify.app/)**
>
> Try it: pick a profile, search the catalog, add titles to **My List**, hit **Play** to start **Continue Watching**, and open a series to see **Episodes** + **More Like This**.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=nextdotjs)
![React](https://img.shields.io/badge/React-19-149eca?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?logo=tailwindcss)

---

## ✨ What makes this different

Unlike a static streaming-UI demo, this project includes a **build-time image-processing pipeline** (using [`sharp`](https://sharp.pixelplumbing.com/)) that generates custom **posters and wide backdrops from a headshot**. Each title is color-graded per genre, framed with title typography, a tagline and a star credit, then composited into genre-specific artwork — creating a personalized catalog that can be regenerated for **any** user.

A second pipeline frames **AI-generated scene images** (one per title) into finished posters, so you can drop in "you as a pirate / sci-fi hero / noir detective" and the app reframes them automatically.

<table>
  <tr>
    <td><img src="public/starring/redbeard.png" width="160" alt="Redbeard" /></td>
    <td><img src="public/starring/the-long-game.png" width="160" alt="The Long Game" /></td>
    <td><img src="public/starring/beard-necessities.png" width="160" alt="Beard Necessities" /></td>
    <td><img src="public/starring/the-ember-crown.png" width="160" alt="The Ember Crown" /></td>
    <td><img src="public/starring/the-last-commit.png" width="160" alt="The Last Commit" /></td>
  </tr>
</table>

> _Swap the photo in `public/` and re-run the generator to make the catalog star anyone._

---

## 🎬 Features

**Browse**
- Billboard **hero** with Play / More Info
- Horizontally scrollable **content rows** with hover arrows and **arrow-key** navigation
- **Hover cards** that expand to reveal quick actions (▶ Play, ➕ My List, 👍) and metadata
- **Top 10 Today** row with oversized rank numerals
- Poster **shimmer placeholders** while images load

**Search & My List**
- Live **search** filtering the whole catalog by title or genre
- **My List** add/remove from any card or the modal, **persisted to `localStorage`**

**Profiles & Continue Watching**
- **"Who's watching?"** profile gate; switch profiles from the navbar
- My List and Continue Watching are **per-profile**
- **Continue Watching** row with real **progress bars** — the player tracks your position and **resumes** where you left off

**Detail modal**
- In-modal **trailer player** with **mute/unmute**
- **Episodes** list with a season selector for series
- **More Like This** grid (genre-matched) — click to dive into a related title
- **Focus-trapped** and keyboard accessible (Esc to close)

**Production polish**
- Scroll-aware **navbar** + **mobile hamburger** menu
- **SEO / Open Graph** metadata and a styled **404** page
- Optional **TMDB** integration for real posters, backdrops & trailers

---

## 🛠️ Tech stack

| | |
|---|---|
| **Framework** | Next.js 16 (App Router, Server Components) |
| **UI** | React 19, Tailwind CSS v4 |
| **Language** | TypeScript |
| **Image pipeline** | `sharp` (SVG → PNG compositing, color grading, masks) |
| **State** | React Context + `localStorage` (My List, profiles, Continue Watching) |
| **Data** | Bundled mock catalog, optional TMDB REST API |
| **Hosting** | Netlify |

---

## 🚀 Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Works fully offline with the bundled catalog — no API keys required.

```bash
npm run build && npm start   # production build
npm run lint                 # eslint
```

---

## 🖼️ The "Starring You" pipeline

Two Node scripts generate all of the original artwork (posters + 16:9 backdrops) with `sharp`:

```bash
node scripts/generate-originals.mjs   # gradient/motif posters for fictional originals
node scripts/generate-starring.mjs    # composites YOUR photo into 10 genre posters
```

`generate-starring.mjs` either:
1. **stylizes a headshot** (`public/headshot-*.png`) with per-genre transforms — comic ink, cyan hologram, noir, glitch, pop-art, sepia, etc. — feathered onto themed backgrounds; **or**
2. **frames a drop-in image** from `public/starring/source/<slug>.png` (e.g. an AI-generated scene) into a finished poster.

Posters carry the title art (used on cards); the wide backdrops are kept text-free so the hero/modal can overlay their own UI. See [`STARRING-PROMPTS.md`](STARRING-PROMPTS.md) for ready-to-paste AI prompts per title.

---

## 🎞️ Optional: real data from TMDB

The app runs on a bundled catalog by default. To pull live artwork and trailers:

1. Create a free account at [themoviedb.org](https://www.themoviedb.org/).
2. Grab an API key (v3 auth) from [Settings → API](https://www.themoviedb.org/settings/api).
3. Copy `.env.local.example` to `.env.local` and set `TMDB_API_KEY=your_key`.
4. Restart the dev server. The app fetches real rows and **falls back to the bundled catalog** on any error.

---

## 📁 Project structure

```
src/
  app/
    layout.tsx          Root layout + SEO/OG metadata
    page.tsx            Home (Server Component) — fetches data, composes providers
    loading.tsx         Branded route-loading screen
    not-found.tsx       Styled 404
    globals.css         Tailwind theme + animations + shimmer
  components/
    ProfileProvider     "Who's watching?" gate + per-profile context
    CatalogProvider     Search + My List + Continue Watching (localStorage)
    ModalProvider       App-wide detail modal
    Navbar · Hero · Row · Top10Row · Card · Footer
    HomeContent         Browse-vs-search shell
    ContinueRow · MyListRow · SearchResults
    TitleModal · EpisodesSection · MoreLikeThis
  lib/
    types · mockData · originalsData · starringData
    content.ts          getHomeData() — TMDB with bundled fallback (server-only)
    tmdb.ts             Optional TMDB integration
    images.ts           Image URLs + deterministic gradient posters
    episodes.ts         Mock episode generation for series
scripts/
  generate-originals.mjs · generate-starring.mjs
```

---

## 📝 Notes

This is a personal portfolio project inspired by modern streaming-platform interfaces. It is **not affiliated with, endorsed by, or connected to any streaming company**. All title names and generated artwork are fictional.
