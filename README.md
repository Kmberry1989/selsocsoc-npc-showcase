# NPC Showcase — Selfie Social Society

Installable web app that browses every NPC in Selfie Social Society: faces, outfits, accessories.

## Dynamic by design

The app fetches the shared NPC asset manifest **live on every open**
(cache-busted, `cache: no-store`):

`https://raw.githubusercontent.com/Kmberry1989/selsocsoc/main/assets/npc/manifest.json`

New characters and asset revisions appear automatically — no redeploy needed.
NPC art images also load live from the manifest's URLs; the service worker
deliberately never caches them.

Tap ⟳ in the header to re-fetch the manifest any time.

## Installable (PWA)

- `manifest.webmanifest` + generated icons (`icons/`)
- `sw.js` caches the app shell only — manifest + art always go to network
- `theme-color` + `apple-touch-icon` wired in `index.html`

## Deploy

Static site. Vercel project auto-deploys from `main`.
