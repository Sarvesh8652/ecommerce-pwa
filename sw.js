const CACHE_NAME = "shop-pwa-v1";
const ASSETS = [
  "/ecommerce-pwa/",
  "/ecommerce-pwa/index.html",
  "/ecommerce-pwa/style.css",
  "/ecommerce-pwa/app.js"
];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)));
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(res => res || fetch(e.request))
  );
});