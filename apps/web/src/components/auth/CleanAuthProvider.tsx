'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type User = {
  id: string
  email: string
  name?: string
  avatar_url?: string
}

type AuthContextType = {
  user: User | null
  loading: boolean
  signInWithGoogle: () => void
  signOut: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function CleanAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

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
              name: payload.user_metadata?.full_name || payload.name,
              avatar_url: payload.user_metadata?.avatar_url || payload.picture
            }
            
            console.log('✅ Authentication successful:', userData.email)
            setUser(userData)
            
            // Store token for API calls if needed
            localStorage.setItem('auth_token', accessToken)
            const refreshToken = params.get('refresh_token')
            if (refreshToken) {
              localStorage.setItem('refresh_token', refreshToken)
            }
            
            // Clean URL
            window.history.replaceState({}, document.title, window.location.pathname)
          } catch (error) {
            console.error('Failed to parse token:', error)
          }
        }
      } else {
        // Check localStorage for existing session
        const storedToken = localStorage.getItem('auth_token')
        if (storedToken) {
          try {
            const payload = JSON.parse(atob(storedToken.split('.')[1]))
            // Check if token is still valid
            if (payload.exp * 1000 > Date.now()) {
              const userData: User = {
                id: payload.sub,
                email: payload.email,
                name: payload.user_metadata?.full_name || payload.name,
                avatar_url: payload.user_metadata?.avatar_url || payload.picture
              }
              console.log('✅ Restored session:', userData.email)
              setUser(userData)
            } else {
              console.log('Token expired, clearing storage')
              localStorage.removeItem('auth_token')
              localStorage.removeItem('refresh_token')
            }
          } catch (error) {
            console.error('Failed to restore session:', error)
            localStorage.removeItem('auth_token')
            localStorage.removeItem('refresh_token')
          }
        }
      }
      setLoading(false)
    }

    checkForTokens()
  }, [])

  const signInWithGoogle = () => {
    const supabaseUrl = 'https://wljubwzufbjojzyqmyyf.supabase.co'
    const redirectUrl = encodeURIComponent(`${window.location.origin}/`)
    
    // Direct OAuth URL to Supabase
    const oauthUrl = `${supabaseUrl}/auth/v1/authorize?provider=google&redirect_to=${redirectUrl}`
    
    console.log('🔄 Redirecting to Google OAuth...')
    window.location.href = oauthUrl
  }

  const signOut = () => {
    setUser(null)
    localStorage.removeItem('auth_token')
    localStorage.removeItem('refresh_token')
    console.log('✅ Signed out successfully')
    // Redirect to home page after sign out to avoid context errors
    window.location.href = '/'
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
    throw new Error('useAuth must be used within CleanAuthProvider')
  }
  return context
}