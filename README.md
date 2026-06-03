# Netflix Clone

A Netflix UI clone built with **Next.js 16 (App Router)**, **React 19**, **TypeScript**, and **Tailwind CSS v4**.

It works out of the box with a bundled mock catalog (generated gradient posters), and
automatically upgrades to **real posters, backdrops, and trailers** when you supply a free
TMDB API key.

## Features

- Billboard **hero banner** with Play / More Info actions
- Horizontally scrollable **content rows** (Trending, Originals, Comedies, …) with hover arrows
- **Hover cards** that scale up and reveal match %, rating, and length
- **Detail modal** with an in-player trailer (YouTube embed in TMDB mode, sample video in demo mode)
- Scroll-aware **navbar** that fades from transparent to solid
- Fully **responsive** and keyboard-accessible (Esc closes the modal)

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Optional: real data from TMDB

By default the app runs in **demo mode** with locally generated posters. To pull live artwork
and trailers:

1. Create a free account at [themoviedb.org](https://www.themoviedb.org/).
2. Grab an API key (v3 auth) from [Settings → API](https://www.themoviedb.org/settings/api).
3. Copy `.env.local.example` to `.env.local` and set `TMDB_API_KEY=your_key`.
4. Restart the dev server.

## Project structure

```
src/
  app/
    layout.tsx        Root layout + metadata
    page.tsx          Home page (Server Component) — fetches data, composes the UI
    globals.css       Tailwind + theme + animations
  components/
    Navbar.tsx        Scroll-aware top navigation
    Hero.tsx          Billboard banner
    Row.tsx           Scrollable carousel of cards
    Card.tsx          Poster card with hover info
    TitleModal.tsx    Detail modal + trailer player
    ModalProvider.tsx Context that opens/closes the modal app-wide
    Footer.tsx        Footer + demo-mode notice
  lib/
    types.ts          Title / Row types
    mockData.ts       Bundled demo catalog
    tmdb.ts           Optional TMDB integration (server-only)
    content.ts        getHomeData() — TMDB with mock fallback
    images.ts         imageUrl() + deterministic gradient posters
```

## Notes

- This is a personal/portfolio project and is **not affiliated with Netflix, Inc.**
- Trailer playback in demo mode uses a public-domain sample clip.
