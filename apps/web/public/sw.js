// Service Worker for Push Notifications
const CACHE_NAME = 'workstreak-v1'

// Install event
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installed')
  self.skipWaiting()
})

// Activate event
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activated')
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
})

// Push event - handle incoming push notifications
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push received')

  let notificationData = {
    title: 'WorkStreak',
    body: 'You have a new notification',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    actions: []
  }

  if (event.data) {
    try {
      notificationData = { ...notificationData, ...event.data.json() }
    } catch (error) {
      console.error('Error parsing push data:', error)
    }
  }

  const notificationOptions = {
    body: notificationData.body,
    icon: notificationData.icon,
    badge: notificationData.badge,
    actions: notificationData.actions,
    data: notificationData.data || {},
    requireInteraction: true,
    silent: false,
  }

  event.waitUntil(
    self.registration.showNotification(notificationData.title, notificationOptions)
  )
})

// Notification click event
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked')
  event.notification.close()

  const action = event.action
  const data = event.notification.data || {}

  let url = '/'

  if (action === 'start_session') {
    url = '/dashboard'
  } else if (data.url) {
    url = data.url
  }

  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      // Check if there's already a WorkStreak window open
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.focus()
          if (url !== '/') {
            client.navigate(url)
          }
          return
        }
      }

      // If no window is open, open a new one
      if (clients.openWindow) {
        return clients.openWindow(url)
      }
    })
  )
})

// Background sync (future enhancement)
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync')
  if (event.tag === 'streak-check') {
    event.waitUntil(checkStreakStatus())
  }
})

async function checkStreakStatus() {
  // Future: Check if user needs a reminder
  console.log('Checking streak status in background...')
}