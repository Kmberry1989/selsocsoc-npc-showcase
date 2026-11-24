# NPC Showcase — Selfie Social Society

Installable web app that browses every NPC in Selfie Social Society: faces, outfits, accessories.

## Dynamic by design

The app fetches the shared NPC asset manifest **live on every open**
(cache-busted, `cache: no-store`):

`https://raw.githubusercontent.com/Kmberry1989/selsocsoc/main/assets/npc/manifest.json`

It also fetches the accessories manifest live from the same asset base:

`https://raw.githubusercontent.com/Kmberry1989/selsocsoc/main/assets/npc-accessories/manifest.json`

New characters and asset revisions appear automatically — no redeploy needed.
NPC art images also load live from the manifest's URLs; the service worker
deliberately never caches them.

The 3D view is fully manifest-driven: skin and the held item come from each
NPC's manifest entry, head / left-hand / back items come from accessories
entries keyed by npc + slot, and per-item offsets come from those entries.
No accessory is hardcoded in the viewer, and there is no procedural
accessory fallback — a GLB that fails to load is left out. The local
`assets/accessories/` GLBs are byte-identical copies of the game's
`assets/npc-accessories/*.glb`, kept as the first-load source with the
live game files as fallback.

Gallery + rescale: the 3D viewer has ‹ › buttons (and arrow keys) to cycle
through all 14 NPCs without closing. Below the canvas, tap an accessory
chip, then pick Scale, Move, or Rotate — the slider (0.25×–2× for scale,
±0.5 m for move, ±180° for rotate, X/Y/Z axis) adjusts that GLB live.
Rescales and moves are kept for the session across NPCs; Copy scales
copies every change as manifest-shaped JSON (`[{ id, npc, slot, scale,
offset, rotation, was… }]`, only changed fields) to paste back for
a manifest update.

Tap ⟳ in the header to re-fetch the manifest any time.

## Installable (PWA)

- `manifest.webmanifest` + generated icons (`icons/`)
- `sw.js` caches the app shell only — manifest + art always go to network
- `theme-color` + `apple-touch-icon` wired in `index.html`

## Deploy

Static site. Vercel project auto-deploys from `main`.
