const APP_VERSION = 'v33';
const CACHE_NAME = 'mytravel-cache-v33';
const APP_SHELL = ['./', './index.html', './My%20Travel.html', './manifest.webmanifest'];
const EXTERNAL_CACHE = 'mytravel-external-v33';

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_SHELL).catch(() => {}))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k.startsWith('mytravel-cache-') && k !== CACHE_NAME)
        .concat(keys.filter(k => k.startsWith('mytravel-external-') && k !== EXTERNAL_CACHE))
        .map(k => caches.delete(k))
    )).then(() => self.clients.claim())
  );
});

function isAppNavigation(req, url) {
  if (req.mode === 'navigate') return true;
  const path = decodeURIComponent(url.pathname);
  return path.endsWith('/My Travel.html') || path.endsWith('/index.html') || path === '/' || path.endsWith('/');
}

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Same-origin app files: network-first for updates, cached fallback for offline use.
  if (url.origin === self.location.origin) {
    if (isAppNavigation(req, url)) {
      event.respondWith(
        fetch(req, {cache:'no-store'})
          .then(res => {
            if (res.ok) caches.open(CACHE_NAME).then(c => c.put(req, res.clone()));
            return res;
          })
          .catch(() => caches.match(req).then(r => r || caches.match('./My%20Travel.html')))
      );
      return;
    }
    event.respondWith(
      caches.match(req).then(cached => cached || fetch(req).then(res => {
        if (res.ok) caches.open(CACHE_NAME).then(c => c.put(req, res.clone()));
        return res;
      }))
    );
    return;
  }

  // Cache eligible external libraries after the first successful online load.
  // This improves offline continuity for Leaflet/PDF.js/Tesseract after they have
  // been used once online. Google Identity Services is deliberately not cached.
  const host = url.hostname;
  const cacheable = host === 'unpkg.com' || host === 'cdnjs.cloudflare.com' || host === 'cdn.jsdelivr.net';
  if (cacheable) {
    event.respondWith(
      caches.match(req).then(cached => cached || fetch(req).then(res => {
        if (res.ok || res.type === 'opaque') caches.open(EXTERNAL_CACHE).then(c => c.put(req, res.clone()));
        return res;
      }))
    );
  }
});
