'use client'

import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/components/ThemeProvider'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'

interface ThemeToggleProps {
  variant?: 'default' | 'ghost' | 'outline'
  size?: 'default' | 'sm' | 'lg'
  className?: string
}

export function ThemeToggle({ 
  variant = 'ghost', 
  size = 'sm', 
  className = '' 
}: ThemeToggleProps) {
  const { theme, setTheme } = useTheme()
  const { user } = useAuth()
  const router = useRouter()

  const toggleTheme = () => {
    if (!user && theme === 'light') {
      // If user is not authenticated and trying to switch to dark mode, redirect to login
      router.push('/auth/login')
      return
    }
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={toggleTheme}
      className={className}
      title={
        !user && theme === 'light' 
          ? 'Sign in to get free Dark Mode' 
          : `Switch to ${theme === 'light' ? 'dark' : 'light'} mode`
      }
    >
      {theme === 'light' ? (
        <Moon className="h-4 w-4" />
      ) : (
        <Sun className="h-4 w-4" />
      )}
    </Button>
  )
}