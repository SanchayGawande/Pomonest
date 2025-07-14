'use client'

import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export function AuthHandler() {
  const router = useRouter()

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

        // Check for cookie-based session
        const accessToken = document.cookie
          .split('; ')
          .find(row => row.startsWith('sb-access-token='))
          ?.split('=')[1]

        if (accessToken) {
          console.log('🔄 Processing cookie-based auth tokens')
          // Set the session using the cookie tokens
          const refreshToken = document.cookie
            .split('; ')
            .find(row => row.startsWith('sb-refresh-token='))
            ?.split('=')[1]

          if (refreshToken) {
            const { data, error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken
            })
            
            if (data.session && !error) {
              console.log('✅ Session established from cookies')
              router.refresh()
            } else if (error) {
              console.error('Cookie session error:', error)
            }
          }
        }
      } catch (error) {
        console.error('Auth handler error:', error)
      }
    }

    handleAuthCallback()
  }, [router])

  return null // This component doesn't render anything
}