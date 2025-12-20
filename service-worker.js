// Service Worker for GLY Platform

const CACHE_NAME = 'gly-platform-v1.0.0'
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './static/assets/logo.png',
  './static/assets/home.png',
  './static/assets/get.png',
  './static/assets/assets.png',
  './static/assets/mine.png'
]

// Install event
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache')
        return cache.addAll(urlsToCache)
      })
      .then(() => self.skipWaiting())
  )
})

// Activate event
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    }).then(() => self.clients.claim())
  )
})

// Fetch event
self.addEventListener('fetch', event => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return
  }

  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return
  }

  // For API requests, use network-first strategy
  if (event.request.url.includes('/api/') || 
      event.request.url.includes('supabase.co')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Clone the response for caching
          const responseToCache = response.clone()
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache)
            })
          return response
        })
        .catch(() => {
          return caches.match(event.request)
        })
    )
    return
  }

  // For static assets, use cache-first strategy
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse
        }

        return fetch(event.request)
          .then(response => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response
            }

            // Clone the response for caching
            const responseToCache = response.clone()
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache)
              })

            return response
          })
      })
  )
})

// Background sync for offline actions
self.addEventListener('sync', event => {
  if (event.tag === 'sync-transactions') {
    event.waitUntil(syncTransactions())
  }
})

// Push notifications
self.addEventListener('push', event => {
  const options = {
    body: event.data?.text() || 'New notification from GLY',
    icon: './static/assets/logo.png',
    badge: './static/assets/logo.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Open App'
      },
      {
        action: 'close',
        title: 'Close'
      }
    ]
  }

  event.waitUntil(
    self.registration.showNotification('GLY Platform', options)
  )
})

// Notification click handler
self.addEventListener('notificationclick', event => {
  event.notification.close()

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('./')
    )
  }
})

// Periodic sync for background updates
self.addEventListener('periodicsync', event => {
  if (event.tag === 'update-assets') {
    event.waitUntil(updateAssets())
  }
})

// Message handling
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    caches.keys().then(cacheNames => {
      cacheNames.forEach(cacheName => {
        caches.delete(cacheName)
      })
    }).then(() => {
      event.source.postMessage({ type: 'CACHE_CLEARED' })
    })
  }
  
  if (event.data && event.data.type === 'GET_CACHE_SIZE') {
    caches.open(CACHE_NAME).then(cache => {
      cache.keys().then(keys => {
        event.source.postMessage({ type: 'CACHE_SIZE', size: keys.length })
      })
    })
  }
})

// Helper functions
async function syncTransactions() {
  // Implement transaction synchronization logic
  console.log('Syncing transactions...')
}

async function updateAssets() {
  // Implement asset update logic
  console.log('Updating assets...')
}

// Precache API responses
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll([
        // Add critical API responses if needed
      ])
    })
  )
})

// Handle offline fallback
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response
        }

        return fetch(event.request)
          .catch(() => {
            // Return offline page for navigation requests
            if (event.request.mode === 'navigate') {
              return caches.match('./index.html')
            }
            
            // Return fallback for images
            if (event.request.destination === 'image') {
              return caches.match('./static/assets/logo.png')
            }
            
            // Return empty response for other requests
            return new Response('', {
              status: 408,
              statusText: 'Offline'
            })
          })
      })
  )
})
