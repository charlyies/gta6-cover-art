# Vice Lights — Leonida Cover Studio

[![make.fun · gta6-cover-art-01](https://make.fun/badge/gta6-cover-art-01.svg)](https://make.fun/bounty/gta6-cover-art-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-cover-art-01)
[![rank](https://make.fun/badge/gta6-cover-art-01/charlyies/gta6-cover-art/rank.svg)](https://make.fun/bounty/gta6-cover-art-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-cover-art-01)
[![reward](https://make.fun/badge/gta6-cover-art-01/charlyies/gta6-cover-art/reward.svg)](https://make.fun/bounty/gta6-cover-art-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-cover-art-01)

A free, offline cover-art maker in the style of GTA 6's posters. Drop in up to four of your own photos, type a caption, and export a multi-panel cover as a PNG to share. Nothing leaves your machine: the app is static files, makes no network request, and your photos are never uploaded.

## What it does

- **8 layouts** — Nine Grid, Hero Top, Hero Left, Hero Right, Skyline, Full Bleed, Four Split and Diagonal. Panels are framed like a poster; the Skyline layout tops the cover with a hand-drawn vector sunset: slatted sun, lit-up buildings and palm silhouettes.
- **7 colour grades** — Vice Sunset, Neon Pink, Golden Hour, Miami Teal, Purple Haze, Noir and Hot Coral. Each grade re-tints the photos, the title gradient, the badge and the frame.
- **4 letterings** — Vice Block (gradient Anton capitals), Neon Glow, Outline Pop and Script Pop (Pacifico script title). All type is set in Anton and Pacifico, vendored under `app/fonts/` under the SIL Open Font License (`OFL.txt` beside them).
- **Any photo, cropped your way** — click a panel in the live preview to select it, drag to move its photo, scroll to zoom. Each of the four photo slots keeps its own zoom and pan.
- **6 sample photos** — six different scenes (boulevard, rooftop woman, rooftop man, neon friends, skater, pier) so a cover never repeats the same face. They are model-made stand-ins, free to use; no real person, no Rockstar artwork, logo or font anywhere in the app.
- **Fast path** — three steps: add photos, pick a layout and grade, export. Undo, redo and a shuffle button are on hand.
- **Export PNG** in the three common post sizes: 1920 x 1080, 1080 x 1350 and 1080 x 1080. The preview shows exactly what the PNG will look like, finished with film grain and a vignette.

## Try it

Serve `app/` with any static server and open `index.html`, for example `node serve.ts` then open http://localhost:8080. Add `?shot=cover`, `?shot=editor`, `?shot=portrait` or `?shot=square` to the URL to load one of the fixed screenshot scenes.

## Entry

`main.ts` (Node 22, standard library only) copies `app/` and `screenshots/` to the output folder and writes `dossier.json` with the kit's vendored library: `mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts`.

Built for the [make.fun](https://make.fun/bounty/gta6-cover-art-01) bounty [gta6-cover-art-01](https://make.fun/bounty/gta6-cover-art-01). Licensed MIT — see `LICENSE`.
