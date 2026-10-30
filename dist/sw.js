const CACHE_NAME = 'opportunityhub-v4'
const APP_FILES = ['/', '/manifest.webmanifest', '/doubleustudentecosystem.jpeg', '/app-icon-192.png', '/app-icon-512.png']

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_FILES)),
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames
          .filter((cacheName) => cacheName.startsWith('opportunityhub-') && cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName)),
      ),
    ).then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return
  if (new URL(event.request.url).origin !== self.location.origin) return

  event.respondWith(
    (async () => {
      try {
        const response = await fetch(event.request)
        if (response.status === 200) {
          const cache = await caches.open(CACHE_NAME)
          event.waitUntil(
            cache.put(event.request, response.clone()).catch((error) => {
              console.warn('Unable to cache app resource:', error)
            }),
          )
        }
        return response
      } catch (error) {
        const cached = await caches.match(event.request)
        if (cached) return cached

        if (event.request.mode === 'navigate') {
          const appShell = await caches.match('/')
          if (appShell) return appShell
        }

        throw error
      }
    })(),
  )
})