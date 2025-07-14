'use client'

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export function AuthHandler() {
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    // Handle auth tokens from various sources
    const handleAuthCallback = async () => {
      try {
        // First check for hash-based tokens (legacy)
        const hash = window.location.hash
        if (hash && hash.includes('access_token=')) {
          console.log('🔄 Processing hash-based auth tokens')
          const { data, error } = await supabase.auth.getSession()
          if (error) {
            console.error('Session error:', error)
          } else if (data.session) {
            console.log('✅ Session established from hash')
            // Clear the hash from URL
            window.history.replaceState({}, document.title, window.location.pathname)
            router.refresh()
            return
          }
        }

        // For SSR approach, just get the current session
        const { data, error } = await supabase.auth.getSession()
        if (data.session && !error) {
          console.log('✅ Session found via SSR')
          router.refresh()
        }
      } catch (error) {
        console.error('Auth handler error:', error)
      }
    }

    handleAuthCallback()
  }, [router, supabase])

  return null // This component doesn't render anything
}