# Portfolio — scroll-driven hero

Static site. No build step, no dependencies.

## Live

Deployed with GitHub Pages from `main` at the repository root.
`.nojekyll` is present so Pages serves the files as-is instead of running
them through Jekyll.

## Run

```bash
node server.js 5173
```

Then open http://localhost:5173

`server.js` exists because the hero needs **HTTP Range support** (`206 Partial Content`)
to seek the video. Python's `http.server` does *not* support ranges and will break
the scroll scrubbing. Any real host (Netlify, Vercel, Cloudflare, nginx, S3+CDN) is fine.

## Structure

```
index.html          markup + copy
css/styles.css      design tokens and all styling
js/main.js          content data, generative art, motion
assets/             hero-rocket.mp4
server.js           dev server with Range support
```

## How the hero works

The hero is a 450vh scroll track (380vh on mobile) with a `position: sticky` stage.
The video is full-bleed from the first frame. Scroll progress drives:

1. **The picture** — see below.
2. **The copy** — the headline is up on load and leaves early, fading out between
   5% and 20% of the track (roughly the first screen and a half of scrolling) so
   the rocket has the frame to itself for the rest of the hero.
3. **The scrim** — three beats: heavy (0.92) while the headline needs contrast,
   lifted (0.5) once it is gone so the video plays unobstructed, then closed to
   black from 62% so the hero dissolves into the next section instead of cutting.

The headline's two lines are authored, not wrapped (`white-space: nowrap` on
`.line__in`), so the overflow mask reveals one whole line at a time. Verified to fit
from 320px to 2560px — the longer line is 8.34em, against 30-104px `clamp()` sizing.

iOS/Safari will not honour `currentTime` until the element has played once, so the
first `pointerdown`/`touchstart`/`wheel`/`keydown` primes it with a muted
`play()` -> `pause()`.

`prefers-reduced-motion` collapses the track to 100vh, parks the video on a static
frame, and disables the drive entirely.

### The video encoding matters — don't skip this if you swap it

`assets/hero-rocket.mp4` is encoded with **a keyframe every 6 frames**. That is what
makes scroll-scrubbing work, and it is not the default any exporter gives you.

H.264 can only begin decoding at a keyframe, so displaying frame N costs (N - nearest
keyframe) decodes. The original export from the generator had **2 keyframes across 240
frames**, which made seeking O(n^2) — about 29,000 frame-decodes for one pass — and
capped the picture at ~13fps with seconds of drag behind the scroll. Measured, before
and after:

| | keyframes | worst seek | scrub rate | size |
|---|---|---|---|---|
| original generator export | 2 / 240 | 78.6ms | 12.7fps | 3.9MB |
| **current (`-g 6`)** | **41 / 240** | **8.6ms** | **55fps** | **5.5MB** |

Seek cost is now flat regardless of jump distance, so `js/main.js` seeks straight to the
scroll position with no easing. Residual latency is ~33ms (2 display frames) at every
scroll speed — that is the browser's seek pipeline, not the code.

The original file is kept as `assets/hero-rocket-original.mp4` for reference.

**To replace the video**, re-encode it the same way first:

```bash
ffmpeg -i input.mp4 -c:v libx264 -preset slow -g 6 -bf 0 -crf 21 -pix_fmt yuv420p -movflags +faststart -an assets/hero-rocket.mp4
```

- `-g 6` — the fix. `-g 1` (every frame a keyframe) also works and benchmarked the same,
  but costs roughly double the bytes for no measurable gain.
- `-pix_fmt yuv420p` — don't drop this. Generators often emit yuv444 or 10-bit, which
  Safari refuses to play at all: silent black video on iPhone.
- `-movflags +faststart` — index at the front, so playback can start before the download
  finishes.
- `-an` — drops the audio track; the hero is muted anyway.

Verify with:

```bash
ffprobe -v error -select_streams v:0 -skip_frame nokey -show_entries frame=pts_time -of csv=p=0 assets/hero-rocket.mp4 | wc -l
```

Anything near 40+ for a 10s clip is fine. A result of 2 means you shipped the broken case.

## Type

| Role | Family | Notes |
|---|---|---|
| Display | **Archivo** (variable) | Set at `wdth 112–118`, `wght 700–800`. The expanded width axis is what creates the editorial poster scale. |
| Body / UI | **Instrument Sans** | Normal width — the contrast against expanded display carries the hierarchy. |
| Micro-labels | **JetBrains Mono** | Section indices, years, meta keys, the hero HUD readout. |

Accent is a single ember orange (`--accent: #FF4D1C`), picked up from the rocket exhaust
and used sparingly — indicators, impact labels, hover states, the timeline progress line.

## Content

All persona content lives in one place: the `PROJECTS`, `TIMELINE`, `CAPS` and `STEPS`
arrays at the top of `js/main.js`. Prose sections (hero, manifesto, about, contact) are
in `index.html`.

**The projects, metrics, employment history and contact details are placeholder content.**
They are written to be plausible, not true — replace them before this goes anywhere public.
The name "Vitor" appears in `index.html` (title, nav mark, footer) and in the
`hello@vitor.design` mailto.

## Project visuals

Each project card's visual is generated as inline SVG by a function in the `ART` object
in `js/main.js` (`mesh`, `orbit`, `stack`, `wave`, `flow`). They're deliberately abstract
rather than fake product screenshots. Swap any of them for a real image by replacing the
`${ART[p.art]()}` call in the `#projects` template with an `<img>` or `<video>`.
