import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Pomonest - Pomodoro Timer & Productivity App',
    short_name: 'Pomonest',
    description: 'Free online Pomodoro timer with habit tracking, task management, and analytics. Build focus streaks and boost productivity.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#ef4444',
    orientation: 'portrait',
    scope: '/',
    lang: 'en',
    categories: ['productivity', 'utilities', 'lifestyle'],
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  }
}