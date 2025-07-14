'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'

type AuthContextType = {
  user: User | null
  loading: boolean
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function SimpleAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Check for hash tokens on page load
    const checkForTokens = () => {
      const hash = window.location.hash
      if (hash && hash.includes('access_token=')) {
        console.log('🔍 Found auth tokens in URL')
        
        const params = new URLSearchParams(hash.substring(1))
        const accessToken = params.get('access_token')
        
        if (accessToken) {
          // Decode the JWT token to get user info
          try {
            const payload = JSON.parse(atob(accessToken.split('.')[1]))
            const userData: User = {
              id: payload.sub,
              email: payload.email,
              user_metadata: {
                full_name: payload.user_metadata?.full_name || payload.name,
                avatar_url: payload.user_metadata?.avatar_url || payload.picture,
                email: payload.email
              },
              app_metadata: payload.app_metadata || {},
              aud: payload.aud,
              created_at: new Date().toISOString(),
              email_confirmed_at: new Date().toISOString(),
              last_sign_in_at: new Date().toISOString(),
              role: payload.role || 'authenticated',
              updated_at: new Date().toISOString()
            }
            
            console.log('✅ Manual auth successful:', userData.email)
            setUser(userData)
            
            // Store tokens in localStorage for persistence
            localStorage.setItem('supabase_access_token', accessToken)
            const refreshToken = params.get('refresh_token')
            if (refreshToken) {
              localStorage.setItem('supabase_refresh_token', refreshToken)
            }
            
            // Clean URL
            window.history.replaceState({}, document.title, window.location.pathname)
          } catch (error) {
            console.error('Failed to parse token:', error)
          }
        }
      } else {
        // Check localStorage for existing session
        const storedToken = localStorage.getItem('supabase_access_token')
        if (storedToken) {
          try {
            const payload = JSON.parse(atob(storedToken.split('.')[1]))
            // Check if token is still valid
            if (payload.exp * 1000 > Date.now()) {
              const userData: User = {
                id: payload.sub,
                email: payload.email,
                user_metadata: {
                  full_name: payload.user_metadata?.full_name || payload.name,
                  avatar_url: payload.user_metadata?.avatar_url || payload.picture,
                  email: payload.email
                },
                app_metadata: payload.app_metadata || {},
                aud: payload.aud,
                created_at: new Date().toISOString(),
                email_confirmed_at: new Date().toISOString(),
                last_sign_in_at: new Date().toISOString(),
                role: payload.role || 'authenticated',
                updated_at: new Date().toISOString()
              }
              console.log('✅ Restored session from localStorage:', userData.email)
              setUser(userData)
            } else {
              console.log('Token expired, clearing localStorage')
              localStorage.removeItem('supabase_access_token')
              localStorage.removeItem('supabase_refresh_token')
            }
          } catch (error) {
            console.error('Failed to restore session:', error)
            localStorage.removeItem('supabase_access_token')
            localStorage.removeItem('supabase_refresh_token')
          }
        }
      }
      setLoading(false)
    }

    checkForTokens()
  }, [])

  const signInWithGoogle = async () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    if (!supabaseUrl) {
      console.error('Missing NEXT_PUBLIC_SUPABASE_URL')
      return
    }
    
    const redirectUrl = encodeURIComponent(`${window.location.origin}/`)
    
    // Direct OAuth URL to Supabase
    const oauthUrl = `${supabaseUrl}/auth/v1/authorize?provider=google&redirect_to=${redirectUrl}`
    
    console.log('🔄 Redirecting to Google OAuth via Supabase...')
    window.location.href = oauthUrl
  }

  const signOut = async () => {
    setUser(null)
    localStorage.removeItem('supabase_access_token')
    localStorage.removeItem('supabase_refresh_token')
    console.log('✅ Signed out successfully')
  }

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within SimpleAuthProvider')
  }
  return context
}