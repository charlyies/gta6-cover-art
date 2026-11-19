# Neon Coast — GTA-style Cover Art Maker

[![make.fun · gta6-cover-art-01](https://make.fun/badge/gta6-cover-art-01.svg)](https://make.fun/bounty/gta6-cover-art-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-cover-art-01)
[![rank](https://make.fun/badge/gta6-cover-art-01/charlyies/gta6-cover-art/rank.svg)](https://make.fun/bounty/gta6-cover-art-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-cover-art-01)
[![reward](https://make.fun/badge/gta6-cover-art-01/charlyies/gta6-cover-art/reward.svg)](https://make.fun/bounty/gta6-cover-art-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-cover-art-01)

Turn any photo and a caption into striking multi-panel cover art in the
Vice City poster style — a neon sunset grade, bold gradient lettering, and a
nine-panel, hero, strip or tilted-snapshot layout — then export it as a PNG
to share. Everything runs offline in the browser: your photos never leave
your machine, nothing is uploaded, and there is no build step.

Made for the [make.fun](https://make.fun/bounty/gta6-cover-art-01) bounty
[gta6-cover-art-01](https://make.fun/bounty/gta6-cover-art-01).

## How it works

1. **Add photos** — load up to three of your own photos, or try the two
   built-in sample photos (made with an image model, free to use).
2. **Pick a layout** — six poster layouts: Nine-Panel, Hero + Trio,
   Sunset Strip, Tilted Snapshots, Full Bleed, and Duo Split.
3. **Pick a grade** — five Vice City colour grades: Vice Sunset, Neon Night,
   Golden Hour, Palm Teal, and Noir Pink.
4. **Crop each panel** — click a panel in the live preview, then zoom and
   pan it, or give it a different photo. One photo can fill every panel.
5. **Write the caption** — title, subtitle and badge text, in three
   lettering styles, with a striped sunset sun, skyline and palm silhouettes.
6. **Export** — one click exports a PNG in 1080×1080, 1080×1350 or
   1920×1080, or all three at once.

Extras: undo / redo, a randomise button, grain and vignette toggles, and a
live preview that always shows exactly what the export will look like.

## Run it

```sh
node serve.ts
# open http://localhost:8080
```

No dependencies, no network requests: `app/` is plain static files
(`app/index.html` plus its own scripts, styles and sample photos).

## Originality

All art, lettering and code here are original. No Rockstar Games logo,
wordmark, official artwork, character or font is used anywhere. The sample
photos were made with an image model for this project and are free to use.

## License

MIT — see [LICENSE](LICENSE).
