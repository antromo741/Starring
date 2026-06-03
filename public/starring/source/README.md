# Drop your generated images here

Put AI-generated (or any) images in this folder and re-run:

```bash
node scripts/generate-starring.mjs
```

The script will frame each one into a finished poster + wide backdrop (title,
star credit, genre, scrim) and write them to `public/starring/`. Any title
without an image here falls back to the stylized-headshot version automatically.

## Naming — use the title's slug

| File name (any of .png/.jpg/.jpeg/.webp) | Used for |
|---|---|
| `redbeard.png`            | Redbeard |
| `genesis-protocol.png`    | Genesis Protocol |
| `the-long-game.png`       | The Long Game |
| `static.png`              | Static |
| `beard-necessities.png`   | Beard Necessities |
| `ironwood.png`            | Ironwood |
| `dust-and-ash.png`        | Dust & Ash |
| `closer.png`              | Closer |
| `the-ember-crown.png`     | The Ember Crown |
| `the-last-commit.png`     | The Last Commit |

## Sizes / aspect ratio

- **Poster** uses a 2:3 crop — a **portrait** image (~1024×1536) works best.
- **Backdrop/hero** uses a 16:9 crop. The script will smart-crop your portrait,
  but for the best hero shot add a dedicated **landscape** image named
  `<slug>-wide.png` (e.g. `redbeard-wide.png`, ~1600×900).
- Cropping uses smart "attention" detection to keep faces in frame.

See `STARRING-PROMPTS.md` in the project root for ready-to-paste prompts.
