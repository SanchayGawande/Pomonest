'use client'

import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export function AuthHandler() {
  const router = useRouter()

  useEffect(() => {
    // Handle hash-based auth tokens (for existing sessions)
    const handleAuthCallback = async () => {
      const hash = window.location.hash
      if (hash && hash.includes('access_token=')) {
        try {
          const { data, error } = await supabase.auth.getSession()
          if (error) {
            console.error('Session error:', error)
          } else if (data.session) {
            console.log('✅ Session established')
            // Clear the hash from URL
            window.history.replaceState({}, document.title, window.location.pathname)
            router.refresh()
          }
        } catch (error) {
          console.error('Auth handler error:', error)
        }
      }
    }

    handleAuthCallback()
  }, [router])

  return null // This component doesn't render anything
}