/* NPC Showcase service worker — caches the app shell only.
   NPC data and images always come live from the shared manifest,
   so new characters and asset revisions appear without an app update. */
const CACHE = "npc-showcase-shell-v1";
const SHELL = [
  "./",
  "index.html",
  "styles.css",
  "app.js",
  "manifest.webmanifest",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/icon-192-maskable.png",
  "icons/icon-512-maskable.png",
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  // Never cache the live manifest or NPC art — always network.
  if (url.hostname === "raw.githubusercontent.com") {
    e.respondWith(fetch(e.request, { cache: "no-store" }));
    return;
  }
  // App shell: cache-first, fall back to network.
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then((hit) => hit || fetch(e.request))
  );
});
