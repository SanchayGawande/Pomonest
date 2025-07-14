'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useUser, useUpdateUserTheme } from '@/lib/queries'

type Theme = 'light' | 'dark'

type ThemeContextType = {
  theme: Theme
  setTheme: (theme: Theme) => void
  isLoading: boolean
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const { data: userData, isLoading: userLoading } = useUser(user?.id)
  const updateThemeMutation = useUpdateUserTheme()
  const [theme, setThemeState] = useState<Theme>('light')
  const [isLoading, setIsLoading] = useState(true)

  // Initialize theme from user data or localStorage
  useEffect(() => {
    const initializeTheme = () => {
      let initialTheme: Theme = 'light'

      if (userData?.theme) {
        // Use theme from database if user is logged in
        initialTheme = userData.theme as Theme
      } else {
        // Fallback to localStorage or system preference
        const savedTheme = localStorage.getItem('workstreak-theme') as Theme
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
        initialTheme = savedTheme || systemTheme
      }

      setThemeState(initialTheme)
      setIsLoading(false)
      applyTheme(initialTheme)
    }

    if (!userLoading) {
      initializeTheme()
    }
  }, [userData, userLoading])

  // Apply theme to document
  const applyTheme = (newTheme: Theme) => {
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(newTheme)
  }

  // Set theme function
  const setTheme = async (newTheme: Theme) => {
    setThemeState(newTheme)
    applyTheme(newTheme)
    
    // Save to localStorage for immediate persistence
    localStorage.setItem('workstreak-theme', newTheme)

    // Save to database if user is logged in
    if (user?.id) {
      try {
        await updateThemeMutation.mutateAsync({
          userId: user.id,
          theme: newTheme
        })
      } catch (error) {
        console.error('Failed to save theme preference:', error)
        // Theme is still applied locally, so this is not critical
      }
    }
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isLoading }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}