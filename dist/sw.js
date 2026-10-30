const CACHE_NAME = 'opportunityhub-v2'
const APP_FILES = ['/', '/manifest.webmanifest', '/doubleustudentecosystem.jpeg']

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_FILES)))
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim())
})

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return
  if (new URL(event.request.url).origin !== self.location.origin) return

  event.respondWith(
    fetch(event.request)
      .then((response) =>
        caches.open(CACHE_NAME).then((cache) => {
          if (response.ok) void cache.put(event.request, response.clone())
          return response
        }),
      )
      .catch(() => caches.match(event.request).then((cached) => cached || caches.match('/'))),
  )
})