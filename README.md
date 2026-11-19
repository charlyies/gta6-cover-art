# Vice Lights — Leonida Cover Studio

[![make.fun · gta6-cover-art-01](https://make.fun/badge/gta6-cover-art-01.svg)](https://make.fun/bounty/gta6-cover-art-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-cover-art-01)
[![rank](https://make.fun/badge/gta6-cover-art-01/charlyies/gta6-cover-art/rank.svg)](https://make.fun/bounty/gta6-cover-art-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-cover-art-01)
[![reward](https://make.fun/badge/gta6-cover-art-01/charlyies/gta6-cover-art/reward.svg)](https://make.fun/bounty/gta6-cover-art-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-cover-art-01)

Turn your own photos and a caption into a Vice City–style poster: a neon
sunset grade, big gradient lettering, and a multi-panel layout — then export
it as a PNG to share. Everything runs offline in the browser: your photos
never leave your machine, nothing is uploaded, and there is no build step.

Made for the [make.fun](https://make.fun/bounty/gta6-cover-art-01) bounty
[gta6-cover-art-01](https://make.fun/bounty/gta6-cover-art-01).

## How it works

1. **Add photos** — load up to four of your own photos, or try the six
   built-in sample photos (two from the bounty kit, four made with an image
   model for this project, all free to use). Each panel can show a different
   photo.
2. **Pick a layout** — eight poster layouts: Nine Grid, Hero Left, Hero
   Top, Sunset Strip, Tilted Polaroids, Full Bleed, Duo Split, and Comic
   Strip.
3. **Pick a grade** — seven Vice City colour grades: Vice Sunset, Neon
   Night, Golden Hour, Palm Teal, Noir Pink, Miami Vice, and Heat Haze.
4. **Crop each panel** — click a panel in the live preview to select it,
   then drag to move its photo, scroll to zoom, or use the zoom and pan
   sliders. The assign and cycle buttons put a different photo in the
   selected panel.
5. **Write the caption** — title, subtitle and badge text in four
   lettering styles (Block, Outline, Neon Glow, Retro Stack), set in Anton
   and Pacifico — bundled in `app/fonts/` under the SIL Open Font License
   (see `app/fonts/OFL.txt`). A striped sunset sun, a skyline with lit
   windows, palm silhouettes, a star meter, grain and a vignette are all
   drawn in code.
6. **Export** — one click exports a PNG in 1080×1080, 1080×1350 or
   1920×1080, or all three sizes at once.

Extras: undo / redo (including Ctrl+Z / Ctrl+Y, 60 steps deep), a
randomise button, a sample shuffle, and a live preview that always shows
exactly what the export will look like.

## Run it

```sh
node serve.ts
# open http://localhost:8080
```

No dependencies, no network requests: `app/` is plain static files
(`app/index.html` plus its own scripts, styles, fonts and sample photos).

## Originality

All art, lettering and code here are original. No Rockstar Games logo,
wordmark, official artwork, character or font is used anywhere. The sample
photos were made with an image model for this project and are free to use.

## License

MIT — see [LICENSE](LICENSE).
