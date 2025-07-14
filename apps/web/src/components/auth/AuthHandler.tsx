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
        const hash = window.location.hash
        
        if (hash && hash.includes('access_token=')) {
          console.log('🔄 Processing hash-based auth tokens')
          
          // Parse the hash parameters
          const hashParams = new URLSearchParams(hash.substring(1))
          const accessToken = hashParams.get('access_token')
          const refreshToken = hashParams.get('refresh_token')
          
          if (accessToken && refreshToken) {
            console.log('🔑 Setting session with tokens from hash')
            
            // Manually set the session using the tokens from the hash
            const { data, error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken
            })
            
            if (data.session && !error) {
              console.log('✅ Session established from hash tokens')
              // Clear the hash from URL
              window.history.replaceState({}, document.title, window.location.pathname + window.location.search)
              router.refresh()
              return
            } else {
              console.error('Failed to set session from hash:', error)
            }
          } else {
            console.warn('Hash found but missing tokens')
          }
        }

        // Fallback: check for existing session
        const { data, error } = await supabase.auth.getSession()
        if (data.session && !error) {
          console.log('✅ Existing session found')
        } else if (error) {
          console.error('Session check error:', error)
        }
      } catch (error) {
        console.error('Auth handler error:', error)
      }
    }

    // Run immediately and also listen for hash changes
    handleAuthCallback()
    
    // Listen for hash changes (in case user navigates back/forward)
    window.addEventListener('hashchange', handleAuthCallback)
    
    return () => {
      window.removeEventListener('hashchange', handleAuthCallback)
    }
  }, [router, supabase])

  return null // This component doesn't render anything
}