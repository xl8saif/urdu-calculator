/* ============================================================
   sw.js — service worker for اردو کیلکولیٹر
   Strategy:
     - navigations (HTML): network-first, fall back to cache (offline works)
     - assets (css/js/icons/manifest/fonts/images): cache-first, refreshed in background
   ============================================================ */
const CACHE_VERSION = "urdu-calc-v15";
const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.json",
  "./privacy.html",
  "./css/style.css",
  "./css/base.css",
  "./css/style-overrides.css",
  "./js/i18n.js",
  "./js/calculator.js",
  "./js/age.js",
  "./js/zakat.js",
  "./js/converter.js",
  "./js/app.js",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-512-maskable.png",
  "./icons/icon-180.png",
  "./icons/portrait.png",
  "./icons/linkedin.svg",
  "./icons/github.svg",
  "./icons/favicon.ico",
  "./icons/s-website.png",
  "./icons/facebook.svg",
  "./icons/whatsapp.svg",
  "./icons/gmail.svg",
  "./icons/upwork.svg",
  "./icons/s-proz.png",
  "./icons/bg-ornament.jpg",
  "./CloudTrans-Logo.PNG",
  "./IMG-20250514-WA0032.jpg",
  "./fonts/mehr.woff",
  "./fonts/mehr.ttf",
  "./fonts/ScheherazadeNew-Regular.ttf",
  "./fonts/ScheherazadeNew-Medium.ttf",
  "./fonts/ScheherazadeNew-SemiBold.ttf",
  "./fonts/ScheherazadeNew-Bold.ttf"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_VERSION).then((c) => c.put(req, copy));
          return res;
        })
        .catch(() =>
          caches.match(req).then((hit) => hit || caches.match("./index.html"))
        )
    );
    return;
  }

  event.respondWith(
    caches.match(req).then((hit) => {
      const fetchAndUpdate = fetch(req)
        .then((res) => {
          if (res && res.ok) {
            const copy = res.clone();
            caches.open(CACHE_VERSION).then((c) => c.put(req, copy));
          }
          return res;
        })
        .catch(() => hit);
      return hit || fetchAndUpdate;
    })
  );
});
