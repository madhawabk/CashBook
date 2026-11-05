const CACHE_PREFIX = 'cashbook-shell-';
const BUILD_ID = '__BUILD_ID__';
const CACHE_NAME = `${CACHE_PREFIX}${BUILD_ID}`;
const APP_SHELL = ['/', '/index.html', '/manifest.webmanifest', '/icons/icon-192.png', '/icons/icon-512.png'];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(APP_SHELL);
    // Pre-cache the hashed Vite JS/CSS bundles referenced by the deployed HTML.
    const html = await fetch('/index.html', { cache: 'no-cache' });
    if (html.ok) {
      const markup = await html.clone().text();
      const assets = [...markup.matchAll(/(?:src|href)="(\/assets\/[^"]+\.(?:js|css))"/g)].map((match) => match[1]);
      if (assets.length) await cache.addAll(assets);
      await cache.put('/index.html', html);
    }
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).then((response) => {
      if (response.ok) {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put('/index.html', copy));
      }
      return response;
    }).catch(() => caches.match('/index.html').then((cached) => cached || caches.match('/'))));
    return;
  }

  event.respondWith(caches.match(request).then((cached) => {
    if (cached) return cached;
    return fetch(request).then((response) => {
      if (response.ok && response.type === 'basic') {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
      }
      return response;
    });
  }));
});