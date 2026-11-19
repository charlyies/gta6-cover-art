# Vice Lights — Leonida Cover Studio

[![make.fun · gta6-cover-art-01](https://make.fun/badge/gta6-cover-art-01.svg)](https://make.fun/bounty/gta6-cover-art-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-cover-art-01)
[![rank](https://make.fun/badge/gta6-cover-art-01/charlyies/gta6-cover-art/rank.svg)](https://make.fun/bounty/gta6-cover-art-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-cover-art-01)
[![reward](https://make.fun/badge/gta6-cover-art-01/charlyies/gta6-cover-art/reward.svg)](https://make.fun/bounty/gta6-cover-art-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-cover-art-01)

A free, offline cover-art maker in the spirit of a GTA 6 poster. Drop in up to
four of your own photos, type a caption, and export a multi-panel cover as a
PNG. Nothing leaves your machine: the app is plain static files, makes no
network requests, and your photos are never uploaded anywhere. It was built as an entry for the make.fun bounty gta6-cover-art-01.

## What it does

- **8 layouts** — Nine Grid, Hero Top, Hero Left, Hero Right, Skyline, Full Bleed, Four Split, and Diagonal. Skyline comes with a hand-drawn vector sunset: a slatted sun, lit-up buildings, and palm silhouettes.
- **7 colour grades** — Vice Sunset, Neon Pink, Golden Hour, Miami Teal, Purple Haze, Noir, and Hot Coral. Each grade recolours the photos, the title gradient, the badge, and the frame.
- **4 letterings** — Vice Block (gradient Anton capitals), Neon Glow, Outline Pop, and Script Pop (a Pacifico script title). Every letter uses the Anton and Pacifico fonts shipped in `app/fonts/` under the SIL Open Font License (`OFL.txt` sits next to them).
- **Any photo, cropped your way** — click a panel in the preview, drag to move the photo, scroll to zoom. Each of the four photo slots remembers its own zoom and pan.
- **6 sample photos** — six different scenes (boulevard, rooftop woman, rooftop man, neon friends, skater, pier) so a cover never repeats the same face. They are all model-made stand-ins, free to use; there are no real people, and no Rockstar artwork, logo, or font in the app.
- **Fast path** — three steps: add photos, pick a layout and a grade, export. Undo, Redo, and a shuffle button are on hand.
- **PNG export in three common sizes** — 1920x1080, 1080x1350, and 1080x1080. The preview shows exactly what the PNG will look like, film grain and vignette included.

## Try it

Serve `app/` with any static server, then open `index.html` — for example,
run `node serve.ts` and open http://localhost:8080. Add `?shot=cover`,
`?shot=editor`, `?shot=portrait`, or `?shot=square` to the URL to load one of
the four screenshot scenes.

## Entry

`main.ts` (Node 22, standard library only) copies `app/` and `screenshots/`
into an output folder and writes `dossier.json` with the vendored kit library:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

Built for the [make.fun](https://make.fun/bounty/gta6-cover-art-01) bounty [gta6-cover-art-01](https://make.fun/bounty/gta6-cover-art-01). Licensed MIT — see `LICENSE`.
