'use client'

// Check if the browser supports service workers and notifications
export const isNotificationSupported = () => {
  return (
    typeof window !== 'undefined' &&
    'serviceWorker' in navigator &&
    'PushManager' in window &&
    'Notification' in window
  )
}

// Check if notifications are currently enabled
export const getNotificationPermission = () => {
  if (!isNotificationSupported()) return 'unsupported'
  return Notification.permission
}

// Request notification permission from the user
export const requestNotificationPermission = async (): Promise<NotificationPermission> => {
  if (!isNotificationSupported()) {
    throw new Error('Notifications are not supported in this browser')
  }

  try {
    const permission = await Notification.requestPermission()
    return permission
  } catch (error) {
    console.error('Error requesting notification permission:', error)
    throw error
  }
}

// Show a local notification (for testing)
export const showLocalNotification = (title: string, options?: NotificationOptions) => {
  if (!isNotificationSupported()) {
    console.warn('Notifications not supported')
    return
  }

  if (Notification.permission === 'granted') {
    return new Notification(title, {
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      ...options,
    })
  } else {
    console.warn('Notification permission not granted')
  }
}

// Register service worker for push notifications
export const registerServiceWorker = async () => {
  if (!isNotificationSupported()) {
    throw new Error('Service workers are not supported in this browser')
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js')
    console.log('Service worker registered:', registration)
    return registration
  } catch (error) {
    console.error('Service worker registration failed:', error)
    throw error
  }
}

// Subscribe to push notifications
export const subscribeToPushNotifications = async (userId: string): Promise<PushSubscription | null> => {
  if (!isNotificationSupported()) {
    throw new Error('Push notifications are not supported')
  }

  try {
    // Register service worker
    const registration = await registerServiceWorker()
    
    // Check if already subscribed
    let subscription = await registration.pushManager.getSubscription()
    
    if (!subscription) {
      // Create new subscription
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!),
      })
    }

    // Send subscription to server
    await fetch('/api/notifications/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        subscription,
      }),
    })

    return subscription
  } catch (error) {
    console.error('Failed to subscribe to push notifications:', error)
    throw error
  }
}

// Unsubscribe from push notifications
export const unsubscribeFromPushNotifications = async (userId: string) => {
  if (!isNotificationSupported()) {
    return
  }

  try {
    const registration = await navigator.serviceWorker.getRegistration()
    if (registration) {
      const subscription = await registration.pushManager.getSubscription()
      if (subscription) {
        await subscription.unsubscribe()
        
        // Notify server
        await fetch('/api/notifications/unsubscribe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId }),
        })
      }
    }
  } catch (error) {
    console.error('Failed to unsubscribe from push notifications:', error)
    throw error
  }
}

// Utility function to convert VAPID key
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - base64String.length % 4) % 4)
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/')

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

// Predefined notification templates
export const NOTIFICATION_TEMPLATES = {
  DAILY_REMINDER: {
    title: "Don't break your 🔥 streak!",
    body: "One 25-minute session keeps your streak alive.",
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    actions: [
      {
        action: 'start_session',
        title: 'Start Session',
      },
      {
        action: 'dismiss',
        title: 'Maybe Later',
      }
    ],
  },
  STREAK_WARNING: {
    title: "⚠️ Your streak is at risk!",
    body: "Complete a session today to maintain your streak.",
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    urgency: 'high' as const,
  },
  STREAK_MILESTONE: {
    title: "🎉 Streak Milestone!",
    body: "Amazing! You've reached a new streak milestone.",
    icon: '/favicon.ico',
    badge: '/favicon.ico',
  }
} as const

export type NotificationTemplate = keyof typeof NOTIFICATION_TEMPLATES