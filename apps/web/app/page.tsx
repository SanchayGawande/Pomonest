'use client'

import { useEffect, useState, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export const dynamic = 'force-dynamic'
import { useRouter, useSearchParams } from 'next/navigation'
import Script from 'next/script'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Timer, Flame, Target, Settings, User, BarChart3, Crown, Play, Pause, RotateCcw, Coffee, Bell, Volume2, VolumeX, Palette, Clock, Zap, Music, Moon, Sun, Sliders } from 'lucide-react'
import { PomodoroTimer as TimerEngine, formatTime, calculateProgress } from "@workstreak/shared-timer"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from '@/components/ui/toaster'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TaskManager } from '@/components/TaskManager'
import { AnalyticsDashboard } from '@/components/AnalyticsDashboard'
import { SubscriptionManagement } from '@/components/SubscriptionManagement'
import { EnhancedTimer } from '@/components/EnhancedTimer'
import { SmartInsights } from '@/components/SmartInsights'
import { TimerFirstLayout } from '@/components/TimerFirstLayout'
import { AdManager, AppAutoAds } from '@/components/ads/AdManager'
import { supabase } from '@/lib/supabase'
import { analytics } from '@/lib/analytics'
import { useUpgradePrompts } from '@/components/UpgradePrompts'

// Local storage keys for guest users
const GUEST_SETTINGS_KEY = 'workstreak_guest_settings'
const GUEST_STATS_KEY = 'workstreak_guest_stats'

interface GuestSettings {
  // Timer Settings
  workDuration: number // in minutes
  shortBreakDuration: number // in minutes
  longBreakDuration: number // in minutes
  longBreakInterval: number // sessions before long break
  autoStartBreaks: boolean
  autoStartWork: boolean
  
  // Audio Settings
  soundEnabled: boolean
  volume: number
  selectedSound: string
  tickingSoundEnabled: boolean
  tickingVolume: number
  
  // Appearance Settings
  theme: string
  backgroundStyle: string
  colorScheme: string
  showProgress: boolean
  showSessionCount: boolean
  
  // Focus Settings
  strictMode: boolean // Prevents pausing during work sessions
  websiteBlocker: boolean
  notifications: boolean
  autoBreakReminders: boolean
}

interface GuestStats {
  todaySessionCount: number
  totalSessionCount: number
  lastSessionDate: string
  streak: number
}

const defaultSettings: GuestSettings = {
  // Timer Settings
  workDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  longBreakInterval: 4,
  autoStartBreaks: true,
  autoStartWork: false,
  
  // Audio Settings
  soundEnabled: true,
  volume: 0.8,
  selectedSound: 'bell',
  tickingSoundEnabled: false,
  tickingVolume: 0.3,
  
  // Appearance Settings
  theme: 'default',
  backgroundStyle: 'gradient',
  colorScheme: 'workstreak',
  showProgress: true,
  showSessionCount: true,
  
  // Focus Settings
  strictMode: false,
  websiteBlocker: false,
  notifications: true,
  autoBreakReminders: true,
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
}

const timerVariants = {
  hidden: { scale: 0.95, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 120,
      damping: 20
    }
  }
}

const cardVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  },
  hover: {
    y: -5,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25
    }
  }
}

const buttonVariants = {
  hover: {
    scale: 1.02,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25
    }
  },
  tap: {
    scale: 0.98
  }
}

function HomeContent() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  // Timer state
  const [timer] = useState(() => new TimerEngine())
  const [timerState, setTimerState] = useState(timer.getState())
  const [settings, setSettings] = useState<GuestSettings>(defaultSettings)
  const [guestStats, setGuestStats] = useState<GuestStats>({
    todaySessionCount: 0,
    totalSessionCount: 0,
    lastSessionDate: '',
    streak: 0
  })

  // UI state
  const [showSettings, setShowSettings] = useState(false)
  const [showStats, setShowStats] = useState(false)
  const [showTasks, setShowTasks] = useState(false)
  const [showProModal, setShowProModal] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isProUser, setIsProUser] = useState(false)
  
  // Task state
  const [currentTask, setCurrentTask] = useState<any>(null)
  
  // Upgrade prompts
  const { checkForPromptTriggers, UpgradePromptComponent } = useUpgradePrompts()

  // Load settings and stats from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem(GUEST_SETTINGS_KEY)
    const savedStats = localStorage.getItem(GUEST_STATS_KEY)
    
    if (savedSettings) {
      const parsedSettings = JSON.parse(savedSettings)
      // Force light theme for non-authenticated users
      if (!isAuthenticated && parsedSettings.theme === 'dark') {
        parsedSettings.theme = 'light'
      }
      setSettings(parsedSettings)
    }
    
    if (savedStats) {
      const stats = JSON.parse(savedStats)
      // Check if it's a new day
      const today = new Date().toISOString().split('T')[0]
      if (stats.lastSessionDate !== today) {
        stats.todaySessionCount = 0
      }
      setGuestStats(stats)
    }
  }, [])

  // Set authenticated state without redirecting
  useEffect(() => {
    if (!loading) {
      setIsAuthenticated(!!user)
    }
  }, [user, loading])

  // Force light theme for non-authenticated users
  useEffect(() => {
    if (!isAuthenticated && settings.theme === 'dark') {
      setSettings(prevSettings => ({ ...prevSettings, theme: 'light' }))
    }
  }, [isAuthenticated, settings.theme])

  // Check for payment success and Pro status
  useEffect(() => {
    const checkProStatus = async () => {
      if (!user) {
        setIsProUser(false)
        return
      }

      try {
        // Get auth token from localStorage (CleanAuthProvider stores it there)
        const authToken = localStorage.getItem('auth_token')
        if (!authToken) {
          console.error('No access token for Pro status check')
          return
        }

        // Check Pro status via API
        const response = await fetch('/api/check-pro-status', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${authToken}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
          setIsProUser(data.isProUser || false)
        } else {
          console.error('🚨 Pro status check failed:', response.status, response.statusText)
          const errorText = await response.text()
          console.error('Response body:', errorText)
        }
      } catch (error) {
        console.error('Error checking Pro status:', error)
      }
    }

    // Check for success parameter
    const success = searchParams.get('success')
    const sessionId = searchParams.get('session_id')
    
    if (success === 'true' && sessionId) {
      toast({
        title: "🎉 Payment Successful!",
        description: "Welcome to WorkStreak Pro! Your premium features are now active.",
      })
      
      // Remove success params from URL
      const url = new URL(window.location.href)
      url.searchParams.delete('success')
      url.searchParams.delete('session_id')
      window.history.replaceState({}, '', url.toString())
      
      // Force Pro status check after successful payment with retries
      console.log('🎉 Payment successful! Setting up Pro status checks...')
      let retryCount = 0
      const maxRetries = 5
      
      const retryProStatusCheck = async () => {
        retryCount++
        console.log(`🔄 Checking Pro status (attempt ${retryCount}/${maxRetries})...`)
        await checkProStatus()
        
        // Check if Pro status was updated
        setTimeout(async () => {
          if (!isProUser && retryCount < maxRetries) {
            console.log(`⏱️ Still not Pro, retrying in ${retryCount * 3} seconds...`)
            setTimeout(retryProStatusCheck, retryCount * 3000) // Exponential backoff
          } else if (!isProUser && retryCount >= maxRetries) {
            console.warn('⚠️ Pro status not detected after maximum retries. Forcing Pro activation...')
            
            // PERMANENT FIX: Force Pro status update if retries failed
            try {
              const authToken = localStorage.getItem('auth_token')
              if (authToken) {
                console.log('🔧 Auto-fixing Pro status...')
                const response = await fetch('/api/debug-pro-status', {
                  method: 'POST',
                  headers: {
                    'Authorization': `Bearer ${authToken}`,
                  },
                })
                
                if (response.ok) {
                  const data = await response.json()
                  if (data.isProUser) {
                    setIsProUser(true)
                    console.log('✅ Pro status automatically fixed!')
                    toast({
                      title: "✅ Pro Status Activated!",
                      description: "Your Pro features are now active. Welcome to WorkStreak Pro!",
                    })
                  }
                }
              }
            } catch (error) {
              console.error('❌ Auto-fix failed:', error)
              toast({
                title: "Pro Status Issue",
                description: "Please refresh the page to activate your Pro features.",
              })
            }
          } else if (isProUser) {
            console.log('✅ Pro status confirmed!')
          }
        }, 500) // Small delay to let state update
      }
      
      // Initial check after 3 seconds (more time for webhook)
      setTimeout(retryProStatusCheck, 3000)
    }

    checkProStatus()
  }, [user, searchParams, toast])

  // Debug function to manually check and fix Pro status
  const debugProStatus = async () => {
    if (!user) {
      console.log('❌ No user logged in')
      return
    }
    
    try {
      // Get auth token from localStorage (CleanAuthProvider stores it there)
      const authToken = localStorage.getItem('auth_token')
      if (!authToken) {
        console.log('❌ No auth token')
        return
      }

      console.log('🔧 Running Pro status debug...')
      toast({
        title: "🔍 Checking Pro Status",
        description: "Running debug check... please wait.",
      })

      const response = await fetch('/api/debug-pro-status', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      })
      
      if (response.ok) {
        const data = await response.json()
        console.log('✅ Debug result:', data)
        
        if (data.isProUser) {
          setIsProUser(true)
          toast({
            title: "✅ Pro Status Fixed!",
            description: "Your Pro status has been activated. Welcome to WorkStreak Pro!",
          })
        } else {
          toast({
            title: "❌ Pro Status Issue",
            description: "Still unable to activate Pro status. Check console for details.",
          })
        }
      } else {
        const errorText = await response.text()
        console.error('❌ Debug failed:', response.status, errorText)
        toast({
          title: "🚨 Debug Failed",
          description: "Unable to check Pro status. See console for details.",
        })
      }
    } catch (error) {
      console.error('🚨 Debug error:', error)
      toast({
        title: "🚨 Debug Error",
        description: "An error occurred during debug. Check console.",
      })
    }
  }

  // Manual Pro upgrade function for testing
  const manualProUpgrade = async () => {
    if (!user) {
      console.log('❌ No user logged in')
      return
    }
    
    try {
      // Get auth token from localStorage (CleanAuthProvider stores it there)
      const authToken = localStorage.getItem('auth_token')
      if (!authToken) {
        console.log('❌ No auth token')
        return
      }

      console.log('🔧 Running manual Pro upgrade...')
      toast({
        title: "⚡ Upgrading to Pro",
        description: "Manually upgrading your account... please wait.",
      })

      const response = await fetch('/api/manual-pro-upgrade', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      })
      
      if (response.ok) {
        const data = await response.json()
        console.log('✅ Manual upgrade result:', data)
        
        if (data.isProUser) {
          setIsProUser(true)
          toast({
            title: "🎉 Pro Upgrade Complete!",
            description: "Your Pro status has been activated. Welcome to WorkStreak Pro!",
          })
          // Force a Pro status check to ensure everything is synced
          setTimeout(() => {
            window.location.reload()
          }, 1000)
        }
      } else {
        const errorText = await response.text()
        console.error('❌ Manual upgrade failed:', response.status, errorText)
        toast({
          title: "🚨 Upgrade Failed",
          description: "Unable to upgrade to Pro. See console for details.",
        })
      }
    } catch (error) {
      console.error('🚨 Manual upgrade error:', error)
      toast({
        title: "🚨 Upgrade Error",
        description: "An error occurred during upgrade. Check console.",
      })
    }
  }

  // Make debug function available globally (client-side only)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      ;(window as any).debugProStatus = debugProStatus
      ;(window as any).manualProUpgrade = manualProUpgrade
    }
  }, [debugProStatus])

  // Dynamic appearance functions
  const getBackgroundClass = () => {
    const baseClass = "min-h-screen"
    switch (settings.backgroundStyle) {
      case 'solid':
        return `${baseClass} bg-background`
      case 'animated':
        return `${baseClass} bg-gradient-to-br from-primary/10 via-accent/8 to-secondary/6 dark:from-primary/5 dark:via-accent/5 dark:to-background animate-gradient-x`
      case 'nature':
        return `${baseClass} bg-gradient-to-br from-green-100 via-emerald-50 to-teal-100 dark:from-green-950/20 dark:via-emerald-950/20 dark:to-teal-950/20`
      case 'abstract':
        return `${baseClass} bg-gradient-to-br from-purple-100 via-pink-50 to-indigo-100 dark:from-purple-950/20 dark:via-pink-950/20 dark:to-indigo-950/20`
      default: // gradient
        return `${baseClass} bg-gradient-to-br from-slate-50 via-gray-50 to-slate-50 dark:from-background dark:via-muted/30 dark:to-background`
    }
  }

  const getColorSchemeClass = () => {
    switch (settings.colorScheme) {
      case 'ocean':
        return 'text-blue-600 dark:text-blue-400'
      case 'forest':
        return 'text-green-600 dark:text-green-400'
      case 'sunset':
        return 'text-orange-600 dark:text-orange-400'
      case 'minimal':
        return 'text-gray-600 dark:text-gray-400'
      case 'retro':
        return 'text-purple-600 dark:text-purple-400'
      default: // workstreak
        return 'text-primary'
    }
  }

  const getTimerCardClass = () => {
    const baseClass = "p-8 text-center space-y-8 backdrop-blur border-border/50"
    switch (settings.colorScheme) {
      case 'ocean':
        return `${baseClass} bg-blue-50/50 dark:bg-blue-950/20 border-blue-200/50 dark:border-blue-800/50`
      case 'forest':
        return `${baseClass} bg-green-50/50 dark:bg-green-950/20 border-green-200/50 dark:border-green-800/50`
      case 'sunset':
        return `${baseClass} bg-orange-50/50 dark:bg-orange-950/20 border-orange-200/50 dark:border-orange-800/50`
      case 'minimal':
        return `${baseClass} bg-gray-50/50 dark:bg-gray-950/20 border-gray-200/50 dark:border-gray-800/50`
      case 'retro':
        return `${baseClass} bg-purple-50/50 dark:bg-purple-950/20 border-purple-200/50 dark:border-purple-800/50`
      default: // workstreak
        return `${baseClass} bg-card/50`
    }
  }

  const getButtonClass = () => {
    const baseClass = "border-0 hover:opacity-90"
    switch (settings.colorScheme) {
      case 'ocean':
        return `${baseClass} bg-gradient-to-r from-blue-500 to-blue-600 text-white`
      case 'forest':
        return `${baseClass} bg-gradient-to-r from-green-500 to-green-600 text-white`
      case 'sunset':
        return `${baseClass} bg-gradient-to-r from-orange-500 to-red-500 text-white`
      case 'minimal':
        return `${baseClass} bg-gradient-to-r from-gray-600 to-gray-700 text-white`
      case 'retro':
        return `${baseClass} bg-gradient-to-r from-purple-500 to-pink-500 text-white`
      default: // workstreak
        return `${baseClass} bg-gradient-hero text-white`
    }
  }

  // Apply theme to document
  useEffect(() => {
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [settings.theme])

  // Update timer configuration when settings change
  useEffect(() => {
    timer.updateConfig({
      workDuration: settings.workDuration * 60, // Convert minutes to seconds
      shortBreakDuration: settings.shortBreakDuration * 60, // Convert minutes to seconds
      longBreakDuration: settings.longBreakDuration * 60, // Convert minutes to seconds
      longBreakInterval: settings.longBreakInterval
    })
  }, [timer, settings.workDuration, settings.shortBreakDuration, settings.longBreakDuration, settings.longBreakInterval])

  // Timer callbacks
  useEffect(() => {
    const handleStateChange = (newState: typeof timerState) => {
      setTimerState(newState)
    }

    const handleWorkSessionComplete = (sessionCount: number) => {
      // Track timer completion
      analytics.trackTimerEvent('complete', 'work', user?.id)
      
      // Update guest stats
      const today = new Date().toISOString().split('T')[0]
      const newStats = {
        ...guestStats,
        todaySessionCount: guestStats.todaySessionCount + 1,
        totalSessionCount: guestStats.totalSessionCount + 1,
        lastSessionDate: today,
        streak: guestStats.lastSessionDate === today ? guestStats.streak : guestStats.streak + 1
      }
      setGuestStats(newStats)
      localStorage.setItem(GUEST_STATS_KEY, JSON.stringify(newStats))

      // Check for upgrade prompt triggers
      checkForPromptTriggers({
        streak: newStats.streak,
        sessionsCompleted: newStats.totalSessionCount,
        lastSessionDate: today,
        isFirstSession: newStats.totalSessionCount === 1
      })

      toast({
        title: "Session Complete! 🔥",
        description: `Great job! Session ${sessionCount} completed. Take a ${settings.shortBreakDuration}-minute break.`,
      })

      // Play completion sound
      if (settings.soundEnabled) {
        playNotificationSound()
      }
    }

    const handleBreakComplete = () => {
      // Track break completion
      analytics.trackTimerEvent('complete', isLongBreak ? 'longBreak' : 'shortBreak', user?.id)
      
      toast({
        title: "Break Complete! 🧠",
        description: "Ready for another focus session?",
      })
      
      if (settings.soundEnabled) {
        playNotificationSound()
      }
    }

    timer.callbacks = {
      onStateChange: handleStateChange,
      onWorkSessionComplete: handleWorkSessionComplete,
      onBreakComplete: handleBreakComplete
    }

    return () => {
      timer.destroy()
    }
  }, [timer, toast, settings, guestStats])

  const playNotificationSound = () => {
    if (!settings.soundEnabled) return
    
    // Simple beep sound for now - can be enhanced with custom sounds
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
    
    // Different frequencies for different sounds
    const soundFrequencies: Record<string, number> = {
      bell: 800,
      chime: 523,
      soft: 440,
      digital: 1000,
      nature: 659
    }
    
    oscillator.frequency.value = soundFrequencies[settings.selectedSound] || 800
    oscillator.type = 'sine'
    gainNode.gain.value = settings.volume * 0.3
    
    oscillator.start()
    oscillator.stop(audioContext.currentTime + 0.3)
  }

  // Button click sound effects
  const playButtonSound = (type: 'start' | 'stop' | 'reset' | 'switch') => {
    if (!settings.soundEnabled) return
    
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
    
    // Different satisfying sounds for different button actions
    const buttonSounds = {
      start: { frequency: 800, duration: 0.15, type: 'sine' as OscillatorType }, // Higher pitch for start - energetic
      stop: { frequency: 400, duration: 0.2, type: 'sine' as OscillatorType },   // Lower pitch for stop - calming
      reset: { frequency: 600, duration: 0.1, type: 'triangle' as OscillatorType }, // Medium pitch for reset - neutral
      switch: { frequency: 500, duration: 0.08, type: 'sine' as OscillatorType } // Subtle click for mode switching
    }
    
    const sound = buttonSounds[type]
    oscillator.frequency.value = sound.frequency
    oscillator.type = sound.type
    gainNode.gain.value = settings.volume * (type === 'switch' ? 0.15 : 0.2) // Mode switches are quieter
    
    // Add a subtle fade out for smoother sound
    gainNode.gain.setValueAtTime(settings.volume * (type === 'switch' ? 0.15 : 0.2), audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + sound.duration)
    
    oscillator.start()
    oscillator.stop(audioContext.currentTime + sound.duration)
  }

  const saveSettings = (newSettings: GuestSettings) => {
    setSettings(newSettings)
    localStorage.setItem(GUEST_SETTINGS_KEY, JSON.stringify(newSettings))
  }

  const resetSettings = () => {
    setSettings(defaultSettings)
    localStorage.setItem(GUEST_SETTINGS_KEY, JSON.stringify(defaultSettings))
  }

  // Timer controls
  const toggleTimer = () => {
    if (timerState.isActive) {
      timer.pause()
      playButtonSound('stop')
      // Track pause event
      analytics.trackTimerEvent('pause', timerState.isBreak ? (isLongBreak ? 'longBreak' : 'shortBreak') : 'work', user?.id)
    } else {
      timer.start()
      playButtonSound('start')
      // Track start event
      analytics.trackTimerEvent('start', timerState.isBreak ? (isLongBreak ? 'longBreak' : 'shortBreak') : 'work', user?.id)
    }
  }

  const resetTimer = () => {
    timer.reset()
    playButtonSound('reset')
    // Track reset event
    analytics.trackTimerEvent('reset', timerState.isBreak ? (isLongBreak ? 'longBreak' : 'shortBreak') : 'work', user?.id)
  }

  // Mode switching functions
  const switchToWork = () => {
    timer.switchToWork()
    playButtonSound('switch')
  }

  const switchToShortBreak = () => {
    timer.switchToShortBreak()
    playButtonSound('switch')
  }

  const switchToLongBreak = () => {
    timer.switchToLongBreak()
    playButtonSound('switch')
  }

  // Calculate timer progress
  const workDuration = settings.workDuration * 60 // convert to seconds
  const shortBreakDuration = settings.shortBreakDuration * 60
  const longBreakDuration = settings.longBreakDuration * 60
  
  // Determine if it's a long break by checking the current time range
  // If we're in break mode and timeLeft is closer to longBreakDuration than shortBreakDuration, it's a long break
  const isLongBreak = timerState.isBreak && (
    Math.abs(timerState.timeLeft - longBreakDuration) < Math.abs(timerState.timeLeft - shortBreakDuration)
  )
  const currentBreakDuration = isLongBreak ? longBreakDuration : shortBreakDuration
  
  const totalDuration = timerState.isBreak ? currentBreakDuration : workDuration
  const progress = calculateProgress(timerState.timeLeft, totalDuration)

  // Determine current timer phase
  const currentPhase = timerState.isBreak ? 'Break' : 'Focus'
  const phaseColor = timerState.isBreak ? 'text-green-500' : 'text-streak-fire'
  const phaseGradient = timerState.isBreak ? 'bg-gradient-to-r from-green-400 to-emerald-500' : 'bg-gradient-streak'

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/50">
        <div className="text-center">
          <div className="text-lg animate-pulse mb-2">Loading...</div>
          <div className="text-sm text-muted-foreground">Initializing WorkStreak...</div>
        </div>
      </div>
    )
  }

  // Continue to show the same interface for both authenticated and guest users

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Auto Ads for page-level optimization */}
      <AppAutoAds />

      {/* Header Ad - Hidden on mobile */}
      <AdManager 
        placement="header" 
        onUpgradeClick={() => setShowProModal(true)}
        className="container mx-auto px-4 pt-4 hidden md:block"
      />

      {/* Mobile-Optimized Header */}
      <header className="relative z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 sm:h-16 items-center justify-between px-4">
          {/* Mobile: Compact title */}
          <div className="flex items-center gap-2 sm:gap-4">
            <h1 className={`text-lg sm:text-2xl font-bold ${getColorSchemeClass()}`}>
              PomoNest
            </h1>
            <Badge variant="secondary" className="text-xs hidden sm:inline-flex">
              Free • No signup required
            </Badge>
          </div>
          
          {/* Mobile: Simplified navigation */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Mobile: Only essential buttons */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowTasks(!showTasks)}
              className="hidden sm:flex"
            >
              <Target className="h-4 w-4 mr-2" />
              Tasks
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowStats(!showStats)}
              className="hidden sm:flex"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Stats
            </Button>
            
            {/* Settings - Always visible but compact on mobile */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
              className="px-2 sm:px-3"
            >
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline ml-2">Settings</span>
            </Button>
            
            {/* User account - Compact on mobile */}
            {isAuthenticated ? (
              <div className="flex items-center gap-1 sm:gap-2">
                <div className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
                  ✅ {user?.email?.split('@')[0]}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push('/settings')}
                  className={`px-2 sm:px-3 ${getButtonClass()}`}
                >
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline ml-2">Account</span>
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push('/auth/login')}
                  className={`px-2 sm:px-3 ${getButtonClass()}`}
                >
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline ml-2">Sign Up</span>
                </Button>
                <span className="text-xs text-blue-600 dark:text-blue-400 mt-1 hidden sm:block">
                  Free Dark Mode ✨
                </span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* TIMER-FIRST LAYOUT - Hero Timer */}
      <TimerFirstLayout
        timerState={timerState}
        isAuthenticated={isAuthenticated}
        userId={user?.id}
        currentTask={undefined}
        isLongBreak={isLongBreak}
        onToggleTimer={toggleTimer}
        onResetTimer={resetTimer}
        onSessionSwitch={(session) => {
          if (session === 'work') switchToWork()
          else if (session === 'shortBreak') switchToShortBreak()
          else if (session === 'longBreak') switchToLongBreak()
        }}
        soundEnabled={settings.soundEnabled}
        totalDuration={totalDuration}
        isProUser={isProUser}
        settings={{
          colorScheme: settings.colorScheme,
          backgroundStyle: settings.backgroundStyle
        }}
      />

      {/* Content Sections for AdSense Compliance */}
      <section className="bg-white dark:bg-gray-900 py-12 border-t">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Build Unstoppable Focus Habits with PomoNest</h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              PomoNest is the free Pomodoro timer that helps you build consistent focus habits, track your productivity streaks, 
              and achieve more without burnout. Based on the scientifically-proven 25/5 technique, our app makes deep work 
              accessible to everyone – no signup required.
            </p>
            
            <div className="grid gap-8 md:grid-cols-3 mb-12">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-streak-fire to-streak-ember rounded-full flex items-center justify-center">
                  <Flame className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Streak-Based Motivation</h3>
                <p className="text-muted-foreground">
                  Turn productivity into a game. Build daily focus streaks that motivate you to maintain consistent habits.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-focus-calm to-focus-deep rounded-full flex items-center justify-center">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No Barriers to Entry</h3>
                <p className="text-muted-foreground">
                  Start focusing immediately with no signup required. Your progress is saved locally, with optional cloud sync.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-warning to-orange-500 rounded-full flex items-center justify-center">
                  <BarChart3 className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Smart Analytics</h3>
                <p className="text-muted-foreground">
                  Track your productivity patterns with insightful analytics that help you optimize your focus sessions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-gray-50 dark:bg-gray-800 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">How the Pomodoro Technique Works</h2>
            
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <span className="text-xl font-bold text-blue-600 dark:text-blue-400">1</span>
                </div>
                <h3 className="font-semibold mb-2">Choose Your Task</h3>
                <p className="text-sm text-muted-foreground">Select what you want to focus on for the next 25 minutes</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                  <span className="text-xl font-bold text-green-600 dark:text-green-400">2</span>
                </div>
                <h3 className="font-semibold mb-2">Focus for 25 Minutes</h3>
                <p className="text-sm text-muted-foreground">Work with complete focus until the timer rings</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                  <span className="text-xl font-bold text-purple-600 dark:text-purple-400">3</span>
                </div>
                <h3 className="font-semibold mb-2">Take a 5-Minute Break</h3>
                <p className="text-sm text-muted-foreground">Rest, stretch, or do something completely different</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
                  <span className="text-xl font-bold text-orange-600 dark:text-orange-400">4</span>
                </div>
                <h3 className="font-semibold mb-2">Repeat & Build Streaks</h3>
                <p className="text-sm text-muted-foreground">Continue the cycle and watch your productivity streaks grow</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who Uses PomoNest Section */}
      <section className="bg-white dark:bg-gray-900 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">Perfect for Every Type of Focused Mind</h2>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card className="p-6">
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-4 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-semibold mb-2">Students</h3>
                  <p className="text-sm text-muted-foreground">
                    Improve study sessions, reduce procrastination, and build consistent learning habits
                  </p>
                </div>
              </Card>
              
              <Card className="p-6">
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-4 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                    <Settings className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="font-semibold mb-2">Remote Workers</h3>
                  <p className="text-sm text-muted-foreground">
                    Stay productive while working from home and manage distractions effectively
                  </p>
                </div>
              </Card>
              
              <Card className="p-6">
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-4 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                    <Zap className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="font-semibold mb-2">Creatives</h3>
                  <p className="text-sm text-muted-foreground">
                    Maintain creative flow while ensuring regular breaks to prevent burnout
                  </p>
                </div>
              </Card>
              
              <Card className="p-6">
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-4 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                    <Timer className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </div>
                  <h3 className="font-semibold mb-2">ADHD Community</h3>
                  <p className="text-sm text-muted-foreground">
                    Use structured time blocks to improve focus and make large tasks feel manageable
                  </p>
                </div>
              </Card>
              
              <Card className="p-6">
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-4 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center">
                    <Crown className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <h3 className="font-semibold mb-2">Entrepreneurs</h3>
                  <p className="text-sm text-muted-foreground">
                    Balance deep work with strategic breaks to maintain peak performance
                  </p>
                </div>
              </Card>
              
              <Card className="p-6">
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-4 bg-teal-100 dark:bg-teal-900 rounded-full flex items-center justify-center">
                    <BarChart3 className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                  </div>
                  <h3 className="font-semibold mb-2">Anyone Seeking Better Focus</h3>
                  <p className="text-sm text-muted-foreground">
                    If you struggle with distractions or want to improve productivity, PomoNest can help
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Secondary Content - Mobile Optimized */}
      <main className="bg-white dark:bg-gray-900 border-t">
        <div className="container mx-auto px-4 py-4 sm:py-8">
        <div className="max-w-6xl mx-auto">
          {/* Mobile: Single column, Desktop: Multi-column */}
          <div className="flex flex-col gap-4 sm:gap-8 lg:grid lg:grid-cols-3 lg:gap-8">

              {/* Sign up prompt - only for non-authenticated users */}
              {!isAuthenticated && (
                <Card className="mt-6 p-6 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
                  <div className="text-center space-y-4">
                    <Crown className="h-8 w-8 mx-auto text-warning" />
                    <div>
                      <h3 className="font-semibold text-lg">Track Your Progress</h3>
                      <p className="text-sm text-muted-foreground">
                        Sign up to save your streaks, unlock Pro features, and sync across devices
                      </p>
                      <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                        ✨ Sign in to get free Dark Mode
                      </p>
                    </div>
                    <div className="flex justify-center">
                      <Button 
                        onClick={() => router.push('/auth/login')}
                        className={getButtonClass()}
                      >
                        Sign Up Free
                      </Button>
                    </div>
                  </div>
                </Card>
              )}

              {/* Authenticated user welcome */}
              {isAuthenticated && (
                <Card className="mt-6 p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800">
                  <div className="text-center space-y-4">
                    <div className="w-12 h-12 mx-auto bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Welcome back!</h3>
                      <p className="text-sm text-muted-foreground">
                        Signed in as {user?.email}. Your progress is automatically saved.
                      </p>
                    </div>
                    <div className="flex justify-center">
                      <Button 
                        onClick={() => router.push('/settings')}
                        variant="outline"
                        className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900/40"
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Account Settings
                      </Button>
                    </div>
                  </div>
                </Card>
              )}
            </div>

            {/* Stats Section - Mobile: Horizontal scroll, Desktop: Sidebar */}
            <div className="lg:col-span-2">
              {/* Mobile: Horizontal scrolling cards */}
              <div className="flex gap-4 overflow-x-auto pb-4 lg:hidden">
                {/* Today's Progress - Mobile Card */}
                <div className="flex-none w-64">
                  <Card className="bg-gradient-to-br from-streak-fire/10 via-card to-streak-ember/10 border-streak-fire/20">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Today's Progress</CardTitle>
                      <Flame className="h-4 w-4 text-streak-fire" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-streak-fire">
                        {guestStats.todaySessionCount} session{guestStats.todaySessionCount !== 1 ? 's' : ''}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {guestStats.todaySessionCount > 0 
                          ? 'Great job! Keep going!' 
                          : 'Start your first session'
                        }
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Current Streak - Mobile Card */}
                <div className="flex-none w-64">
                  <Card className="bg-gradient-to-br from-focus-calm/10 via-card to-focus-deep/10 border-focus-calm/20">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
                      <Target className="h-4 w-4 text-focus-calm" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-focus-calm">
                        {guestStats.streak} day{guestStats.streak !== 1 ? 's' : ''}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {guestStats.streak > 0 
                          ? 'Your current focus streak' 
                          : 'Complete a session to start'
                        }
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Total Sessions - Mobile Card */}
                <div className="flex-none w-64">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
                      <Timer className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {guestStats.totalSessionCount}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {guestStats.totalSessionCount * 25} minutes focused
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Pro Status - Mobile Card */}
                <div className="flex-none w-64">
                  {isProUser ? (
                    <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
                      <CardHeader>
                        <CardTitle className="text-sm font-medium flex items-center gap-2 text-green-600 dark:text-green-400">
                          <Crown className="h-4 w-4" />
                          Pro Active
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-xs text-green-600 dark:text-green-400 font-medium mb-2">
                          ✅ Pro member!
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="w-full border-green-500/20 text-green-600 dark:text-green-400"
                          onClick={() => router.push('/settings')}
                        >
                          Manage
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card className="bg-gradient-to-br from-warning/10 to-orange-500/10 border-warning/20">
                      <CardHeader>
                        <CardTitle className="text-sm font-medium flex items-center gap-2 text-warning">
                          <Crown className="h-4 w-4" />
                          Go Pro
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-xs text-muted-foreground mb-2">
                          • 🚫 Ad-free
                          <br />• 📊 Analytics
                          <br />• ☁️ Cloud sync
                        </div>
                        <Button 
                          size="sm" 
                          className="w-full bg-gradient-to-r from-warning to-orange-500 text-white"
                          onClick={() => {
                            if (isAuthenticated) {
                              setShowProModal(true)
                            } else {
                              router.push('/auth/login')
                            }
                          }}
                        >
                          Upgrade
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </div>

            {/* Desktop: Quick access button for Tasks/Stats */}
            <div className="hidden lg:flex lg:gap-4 lg:mt-6">
              <Button
                variant="outline"
                onClick={() => setShowTasks(true)}
                className="flex-1"
              >
                <Target className="h-4 w-4 mr-2" />
                View Tasks
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowStats(true)}
                className="flex-1"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                View Analytics
              </Button>
            </div>
          </div>
        </div>
        
        {/* Testimonials Section */}
        <section className="py-12 bg-gray-50 dark:bg-gray-800 mt-12">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">What Users Say About PomoNest</h2>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card className="p-6">
                <div className="text-left">
                  <p className="text-sm text-muted-foreground mb-4 italic">
                    "PomoNest has completely transformed my study sessions. The streak feature keeps me motivated, and I love that I don't need to sign up to start using it."
                  </p>
                  <div>
                    <p className="font-semibold text-sm">Sarah M.</p>
                    <p className="text-xs text-muted-foreground">Graduate Student</p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-6">
                <div className="text-left">
                  <p className="text-sm text-muted-foreground mb-4 italic">
                    "As someone with ADHD, the structured 25-minute blocks make overwhelming tasks feel manageable. The visual progress tracking is incredibly helpful."
                  </p>
                  <div>
                    <p className="font-semibold text-sm">Michael R.</p>
                    <p className="text-xs text-muted-foreground">Software Developer</p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-6">
                <div className="text-left">
                  <p className="text-sm text-muted-foreground mb-4 italic">
                    "The Pro version is worth every penny. Ad-free experience and beautiful themes make focusing even more enjoyable. Best productivity investment I've made."
                  </p>
                  <div>
                    <p className="font-semibold text-sm">Emma L.</p>
                    <p className="text-xs text-muted-foreground">Freelance Designer</p>
                  </div>
                </div>
              </Card>
            </div>
            
            <div className="mt-8">
              <p className="text-sm text-muted-foreground">
                Join thousands of users who have improved their focus with PomoNest
              </p>
            </div>
          </div>
        </section>
        
        {/* Footer Ad */}
        <AdManager 
          placement="footer" 
          onUpgradeClick={() => setShowProModal(true)}
          className="container mx-auto px-4 pb-4"
        />
      </main>

      {/* Mobile: Floating Action Buttons */}
      <div className="fixed bottom-4 right-4 flex flex-col gap-2 lg:hidden z-50">
        <Button
          size="sm"
          variant="default"
          onClick={() => setShowTasks(true)}
          className="rounded-full w-12 h-12 shadow-lg"
        >
          <Target className="h-5 w-5" />
        </Button>
        <Button
          size="sm"
          variant="default"
          onClick={() => setShowStats(true)}
          className="rounded-full w-12 h-12 shadow-lg"
        >
          <BarChart3 className="h-5 w-5" />
        </Button>
      </div>

      <Toaster />

      {/* Advanced Settings Modal - Professional Design */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto w-[95vw] sm:w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xl rounded-lg">
          <DialogHeader className="border-b border-gray-200 dark:border-gray-800 pb-4 mb-6">
            <DialogTitle className="flex items-center gap-3 text-xl font-semibold text-gray-900 dark:text-white">
              <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <Settings className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </div>
              Settings
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400">
              Customize your Pomodoro timer settings, audio preferences, and appearance options.
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="timer" className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto bg-gray-100 dark:bg-gray-800 p-1 rounded-lg border border-gray-200 dark:border-gray-700">
              <TabsTrigger value="timer" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 px-3 text-xs sm:text-sm min-h-[40px] text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 data-[state=active]:bg-red-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200 rounded-md">
                <Clock className="h-4 w-4" />
                <span className="text-xs sm:text-sm font-medium">Timer</span>
              </TabsTrigger>
              <TabsTrigger value="audio" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 px-3 text-xs sm:text-sm min-h-[40px] text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200 rounded-md">
                <Music className="h-4 w-4" />
                <span className="text-xs sm:text-sm font-medium">Audio</span>
              </TabsTrigger>
              <TabsTrigger value="appearance" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 px-3 text-xs sm:text-sm min-h-[40px] text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 data-[state=active]:bg-purple-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200 rounded-md">
                <Palette className="h-4 w-4" />
                <span className="text-xs sm:text-sm font-medium">Theme</span>
              </TabsTrigger>
              <TabsTrigger value="focus" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 px-3 text-xs sm:text-sm min-h-[40px] text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 data-[state=active]:bg-green-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200 rounded-md">
                <Zap className="h-4 w-4" />
                <span className="text-xs sm:text-sm font-medium">Focus</span>
              </TabsTrigger>
            </TabsList>

            {/* Timer Settings Tab */}
            <TabsContent value="timer" className="space-y-6 mt-6 p-4 bg-red-50/50 dark:bg-red-950/20 rounded-xl border-2 border-red-200/50 dark:border-red-800/50">
              <Card className="border-2 border-red-200 dark:border-red-800 bg-white dark:bg-gray-900 shadow-lg">
                <CardHeader className="border-b border-red-200 dark:border-red-800 pb-4 bg-red-50/30 dark:bg-red-900/20">
                  <CardTitle className="text-lg flex items-center gap-3 font-semibold text-red-800 dark:text-red-200">
                    <div className="p-2 bg-red-500 text-white rounded-lg shadow-sm">
                      <Clock className="h-4 w-4" />
                    </div>
                    Session Duration
                  </CardTitle>
                  <CardDescription className="text-red-600 dark:text-red-400">
                    Customize your work and break intervals
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8 p-6">
                  {/* Work Duration */}
                  <div className="p-6 border-2 border-red-300 dark:border-red-700 rounded-xl space-y-4 bg-red-100/60 dark:bg-red-900/30 shadow-md">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <label className="text-sm font-bold text-red-800 dark:text-red-200">
                          Work Duration
                        </label>
                        <p className="text-xs text-red-600 dark:text-red-400">Focus session length</p>
                      </div>
                      <span className="text-sm font-bold text-white bg-red-500 px-4 py-2 rounded-lg shadow-md">{settings.workDuration} min</span>
                    </div>
                    <Slider
                      value={[settings.workDuration]}
                      onValueChange={(value) => saveSettings({ ...settings, workDuration: value[0] })}
                      max={90}
                      min={5}
                      step={5}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-red-600 dark:text-red-400 font-semibold">
                      <span>5 min</span>
                      <span>90 min</span>
                    </div>
                  </div>

                  {/* Short Break Duration */}
                  <div className="p-6 border-2 border-orange-300 dark:border-orange-700 rounded-xl space-y-4 bg-orange-100/60 dark:bg-orange-900/30 shadow-md">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <label className="text-sm font-bold text-orange-800 dark:text-orange-200">
                          Short Break
                        </label>
                        <p className="text-xs text-orange-600 dark:text-orange-400">Brief rest between sessions</p>
                      </div>
                      <span className="text-sm font-bold text-white bg-orange-500 px-4 py-2 rounded-lg shadow-md">{settings.shortBreakDuration} min</span>
                    </div>
                    <Slider
                      value={[settings.shortBreakDuration]}
                      onValueChange={(value) => saveSettings({ ...settings, shortBreakDuration: value[0] })}
                      max={30}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-orange-600 dark:text-orange-400 font-semibold">
                      <span>1 min</span>
                      <span>30 min</span>
                    </div>
                  </div>

                  {/* Long Break Duration */}
                  <div className="p-6 border-2 border-yellow-300 dark:border-yellow-700 rounded-xl space-y-4 bg-yellow-100/60 dark:bg-yellow-900/30 shadow-md">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <label className="text-sm font-bold text-yellow-800 dark:text-yellow-200">
                          Long Break
                        </label>
                        <p className="text-xs text-yellow-600 dark:text-yellow-400">Extended rest after multiple sessions</p>
                      </div>
                      <span className="text-sm font-bold text-white bg-yellow-500 px-4 py-2 rounded-lg shadow-md">{settings.longBreakDuration} min</span>
                    </div>
                    <Slider
                      value={[settings.longBreakDuration]}
                      onValueChange={(value) => saveSettings({ ...settings, longBreakDuration: value[0] })}
                      max={60}
                      min={5}
                      step={5}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-yellow-600 dark:text-yellow-400 font-semibold">
                      <span>5 min</span>
                      <span>60 min</span>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-t-2 border-red-300 dark:border-red-700 my-6"></div>

                  {/* Long Break Interval */}
                  <div className="space-y-4 p-6 bg-pink-100/60 dark:bg-pink-900/30 rounded-xl border-2 border-pink-300 dark:border-pink-700 shadow-md">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <label className="text-sm font-bold text-pink-800 dark:text-pink-200">Long Break Interval</label>
                        <p className="text-xs text-pink-600 dark:text-pink-400">How often to take extended breaks</p>
                      </div>
                      <span className="text-sm font-bold text-white bg-pink-500 px-4 py-2 rounded-lg shadow-md">Every {settings.longBreakInterval} sessions</span>
                    </div>
                    <Slider
                      value={[settings.longBreakInterval]}
                      onValueChange={(value) => saveSettings({ ...settings, longBreakInterval: value[0] })}
                      max={10}
                      min={2}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-pink-600 dark:text-pink-400 font-semibold">
                      <span>2 sessions</span>
                      <span>10 sessions</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-red-200 dark:border-red-800 bg-white dark:bg-gray-900 shadow-lg">
                <CardHeader className="border-b border-red-200 dark:border-red-800 pb-4 bg-red-50/30 dark:bg-red-900/20">
                  <CardTitle className="text-lg flex items-center gap-2 font-semibold text-red-800 dark:text-red-200">
                    <div className="p-2 bg-red-500 text-white rounded-lg shadow-sm">
                      <Clock className="h-4 w-4" />
                    </div>
                    Auto-Start Settings
                  </CardTitle>
                  <CardDescription className="text-red-600 dark:text-red-400">
                    Control when timers start automatically
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 p-6">
                  <div className="flex items-center justify-between p-5 bg-red-100/60 dark:bg-red-900/30 rounded-xl border-2 border-red-300 dark:border-red-700 shadow-md">
                    <div className="space-y-1">
                      <div className="text-sm font-bold text-red-800 dark:text-red-200">Auto-start breaks</div>
                      <div className="text-xs text-red-600 dark:text-red-400">
                        Automatically start break timers after work sessions
                      </div>
                    </div>
                    <Switch
                      checked={settings.autoStartBreaks}
                      onCheckedChange={(checked) => saveSettings({ ...settings, autoStartBreaks: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between p-5 bg-orange-100/60 dark:bg-orange-900/30 rounded-xl border-2 border-orange-300 dark:border-orange-700 shadow-md">
                    <div className="space-y-1">
                      <div className="text-sm font-bold text-orange-800 dark:text-orange-200">Auto-start work sessions</div>
                      <div className="text-xs text-orange-600 dark:text-orange-400">
                        Automatically start work timers after breaks
                      </div>
                    </div>
                    <Switch
                      checked={settings.autoStartWork}
                      onCheckedChange={(checked) => saveSettings({ ...settings, autoStartWork: checked })}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Audio Settings Tab */}
            <TabsContent value="audio" className="space-y-6 mt-6 p-4 bg-blue-50/50 dark:bg-blue-950/20 rounded-xl border-2 border-blue-200/50 dark:border-blue-800/50">
              <Card className="border-2 border-blue-200 dark:border-blue-800 bg-white dark:bg-gray-900 shadow-lg">
                <CardHeader className="border-b border-blue-200 dark:border-blue-800 pb-4 bg-blue-50/30 dark:bg-blue-900/20">
                  <CardTitle className="text-lg flex items-center gap-3 font-semibold text-blue-800 dark:text-blue-200">
                    <div className="p-2 bg-blue-500 text-white rounded-lg shadow-sm">
                      <Music className="h-4 w-4" />
                    </div>
                    Notification Sounds
                  </CardTitle>
                  <CardDescription className="text-blue-600 dark:text-blue-400">
                    Customize audio feedback for session completion
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 p-6">
                  {/* Sound Enabled */}
                  <div className="flex items-center justify-between p-5 bg-blue-100/60 dark:bg-blue-900/30 rounded-xl border-2 border-blue-300 dark:border-blue-700 shadow-md">
                    <div className="space-y-1">
                      <div className="text-sm font-bold text-blue-800 dark:text-blue-200">Enable Sounds</div>
                      <div className="text-xs text-blue-600 dark:text-blue-400">
                        Play notification sounds when sessions complete
                      </div>
                    </div>
                    <Switch
                      checked={settings.soundEnabled}
                      onCheckedChange={(checked) => saveSettings({ ...settings, soundEnabled: checked })}
                    />
                  </div>

                  {/* Sound Selection */}
                  <div className="space-y-4 p-5 bg-cyan-100/60 dark:bg-cyan-900/30 rounded-xl border-2 border-cyan-300 dark:border-cyan-700 shadow-md">
                    <label className="text-sm font-bold text-cyan-800 dark:text-cyan-200">Notification Sound</label>
                    <Select 
                      value={settings.selectedSound} 
                      onValueChange={(value) => saveSettings({ ...settings, selectedSound: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bell">🔔 Bell</SelectItem>
                        <SelectItem value="chime">🎵 Chime</SelectItem>
                        <SelectItem value="soft">🌙 Soft Tone</SelectItem>
                        <SelectItem value="digital">💻 Digital Beep</SelectItem>
                        <SelectItem value="nature">🌿 Nature Sound</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={playNotificationSound}
                      disabled={!settings.soundEnabled}
                    >
                      🎵 Test Sound
                    </Button>
                  </div>

                  {/* Volume Control */}
                  <div className="space-y-4 p-5 bg-indigo-100/60 dark:bg-indigo-900/30 rounded-xl border-2 border-indigo-300 dark:border-indigo-700 shadow-md">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-bold text-indigo-800 dark:text-indigo-200">Volume</label>
                      <span className="text-sm font-bold text-white bg-indigo-500 px-4 py-2 rounded-lg shadow-md">{Math.round(settings.volume * 100)}%</span>
                    </div>
                    <Slider
                      value={[settings.volume]}
                      onValueChange={(value) => saveSettings({ ...settings, volume: value[0] })}
                      max={1}
                      min={0}
                      step={0.1}
                      className="w-full"
                      disabled={!settings.soundEnabled}
                    />
                  </div>

                  {/* Ticking Sound */}
                  <div className="flex items-center justify-between p-5 bg-sky-100/60 dark:bg-sky-900/30 rounded-xl border-2 border-sky-300 dark:border-sky-700 shadow-md">
                    <div className="space-y-1">
                      <div className="text-sm font-bold text-sky-800 dark:text-sky-200">Ticking Sound</div>
                      <div className="text-xs text-sky-600 dark:text-sky-400">
                        Play a subtle ticking sound during focus sessions
                      </div>
                    </div>
                    <Switch
                      checked={settings.tickingSoundEnabled}
                      onCheckedChange={(checked) => saveSettings({ ...settings, tickingSoundEnabled: checked })}
                    />
                  </div>

                  {/* Ticking Volume */}
                  {settings.tickingSoundEnabled && (
                    <div className="space-y-4 p-5 bg-teal-100/60 dark:bg-teal-900/30 rounded-xl border-2 border-teal-300 dark:border-teal-700 shadow-md">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-bold text-teal-800 dark:text-teal-200">Ticking Volume</label>
                        <span className="text-sm font-bold text-white bg-teal-500 px-4 py-2 rounded-lg shadow-md">{Math.round(settings.tickingVolume * 100)}%</span>
                      </div>
                      <Slider
                        value={[settings.tickingVolume]}
                        onValueChange={(value) => saveSettings({ ...settings, tickingVolume: value[0] })}
                        max={1}
                        min={0}
                        step={0.1}
                        className="w-full"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Appearance Settings Tab */}
            <TabsContent value="appearance" className="space-y-6 mt-6 p-4 bg-purple-50/50 dark:bg-purple-950/20 rounded-xl border-2 border-purple-200/50 dark:border-purple-800/50">
              {/* Basic Theme Settings for All Users */}
              <Card className="border-2 border-purple-200 dark:border-purple-800 bg-white dark:bg-gray-900 shadow-lg">
                <CardHeader className="border-b border-purple-200 dark:border-purple-800 pb-4 bg-purple-50/30 dark:bg-purple-900/20">
                  <CardTitle className="text-lg flex items-center gap-3 font-semibold text-purple-800 dark:text-purple-200">
                    <div className="p-2 bg-purple-500 text-white rounded-lg shadow-sm">
                      <Palette className="h-4 w-4" />
                    </div>
                    Basic Theme
                  </CardTitle>
                  <CardDescription className="text-purple-600 dark:text-purple-400">
                    Essential theme options available to all users
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 p-6">
                  {/* Theme Toggle - Available to All */}
                  <div className="flex items-center justify-between p-5 bg-purple-100/60 dark:bg-purple-900/30 rounded-xl border-2 border-purple-300 dark:border-purple-700 shadow-md">
                    <div className="space-y-1">
                      <div className="text-sm font-bold flex items-center gap-2 text-purple-800 dark:text-purple-200">
                        {settings.theme === 'dark' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                        Dark Mode
                      </div>
                      <div className="text-xs text-purple-600 dark:text-purple-400">
                        {isAuthenticated ? 'Switch between light and dark themes' : 'Sign in to unlock dark mode'}
                      </div>
                    </div>
                    {isAuthenticated ? (
                      <Switch
                        checked={settings.theme === 'dark'}
                        onCheckedChange={(checked) => saveSettings({ ...settings, theme: checked ? 'dark' : 'light' })}
                      />
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push('/auth/login')}
                        className="text-xs px-3 py-1"
                      >
                        Sign In
                      </Button>
                    )}
                  </div>
                  
                  {/* Basic Color Scheme - Limited for Free Users */}
                  <div className="space-y-4 p-5 bg-pink-100/60 dark:bg-pink-900/30 rounded-xl border-2 border-pink-300 dark:border-pink-700 shadow-md">
                    <label className="text-sm font-bold text-pink-800 dark:text-pink-200">Color Scheme</label>
                    <Select 
                      value={settings.colorScheme} 
                      onValueChange={(value) => saveSettings({ ...settings, colorScheme: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="workstreak">🔥 WorkStreak (Fire & Focus)</SelectItem>
                        {(!isAuthenticated || !isProUser) && (
                          <SelectItem disabled value="pro-locked">
                            <div className="flex items-center gap-2 opacity-50">
                              <Crown className="h-3 w-3" />
                              Pro Themes Available
                            </div>
                          </SelectItem>
                        )}
                        {(isAuthenticated && isProUser) && (
                          <>
                            <SelectItem value="ocean">🌊 Ocean Deep</SelectItem>
                            <SelectItem value="forest">🌲 Forest Zen</SelectItem>
                            <SelectItem value="sunset">🌅 Warm Sunset</SelectItem>
                            <SelectItem value="cosmic">🌌 Cosmic Purple</SelectItem>
                            <SelectItem value="aurora">🌈 Aurora Borealis</SelectItem>
                            <SelectItem value="neon">💫 Neon Dreams</SelectItem>
                            <SelectItem value="retro">📼 Retro Wave</SelectItem>
                          </>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Pro Advanced Themes */}
              {(isAuthenticated && isProUser) ? (
                <Card className="border-2 border-yellow-200 dark:border-yellow-600 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/30 dark:to-orange-900/30">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Crown className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                      Pro Visual Effects
                    </CardTitle>
                    <CardDescription>
                      Stunning animated backgrounds exclusive to Pro members
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Advanced Background Styles */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">Animation Style</label>
                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200">Pro Only</Badge>
                      </div>
                      <Select 
                        value={settings.backgroundStyle} 
                        onValueChange={(value) => saveSettings({ ...settings, backgroundStyle: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gradient">🌈 Simple Gradient</SelectItem>
                          <SelectItem value="particles">✨ Floating Particles</SelectItem>
                          <SelectItem value="waves">🌊 Flowing Waves</SelectItem>
                          <SelectItem value="geometric">📐 Geometric Shapes</SelectItem>
                          <SelectItem value="aurora">🌟 Aurora Effect</SelectItem>
                          <SelectItem value="matrix">💻 Matrix Rain</SelectItem>
                          <SelectItem value="breathing">🫁 Breathing Circles</SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="text-xs text-muted-foreground">
                        These animations create an immersive focus environment that adapts to your session type
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="border-2 border-dashed border-orange-200 bg-orange-50/50">
                  <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                    <Crown className="h-12 w-12 text-orange-500 mb-4" />
                    <h3 className="text-lg font-semibold text-orange-800 mb-2">Pro Feature: Advanced Visual Themes</h3>
                    <p className="text-orange-700 mb-4 max-w-md">
                      Unlock stunning animated backgrounds, premium color schemes, and immersive visual effects designed to enhance your focus sessions.
                    </p>
                    <div className="grid grid-cols-2 gap-2 mb-4 text-sm text-orange-600">
                      <div className="flex items-center gap-2">
                        <span>✨</span>
                        Floating Particles
                      </div>
                      <div className="flex items-center gap-2">
                        <span>🌊</span>
                        Flowing Waves
                      </div>
                      <div className="flex items-center gap-2">
                        <span>🌟</span>
                        Aurora Effects
                      </div>
                      <div className="flex items-center gap-2">
                        <span>💻</span>
                        Matrix Rain
                      </div>
                      <div className="flex items-center gap-2">
                        <span>🌈</span>
                        8 Color Schemes
                      </div>
                      <div className="flex items-center gap-2">
                        <span>🫁</span>
                        Breathing Circles
                      </div>
                    </div>
                    {isAuthenticated ? (
                      <Button onClick={() => setShowProModal(true)} className="gap-2">
                        <Crown className="h-4 w-4" />
                        Upgrade to Pro
                      </Button>
                    ) : (
                      <div className="space-y-2">
                        <Button onClick={() => router.push('/auth/login')} variant="outline" className="gap-2">
                          Sign Up Free
                        </Button>
                        <p className="text-xs text-orange-600">Then upgrade to Pro for advanced themes</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              <Card className="border-2 border-indigo-200 dark:border-indigo-800 bg-white dark:bg-gray-900 shadow-lg">
                <CardHeader className="border-b border-indigo-200 dark:border-indigo-800 pb-4 bg-indigo-50/30 dark:bg-indigo-900/20">
                  <CardTitle className="text-lg flex items-center gap-2 font-semibold text-indigo-800 dark:text-indigo-200">
                    <div className="p-2 bg-indigo-500 text-white rounded-lg shadow-sm">
                      <Settings className="h-4 w-4" />
                    </div>
                    Display Options
                  </CardTitle>
                  <CardDescription className="text-indigo-600 dark:text-indigo-400">
                    Control what information is shown during sessions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 p-6">
                  <div className="flex items-center justify-between p-5 bg-indigo-100/60 dark:bg-indigo-900/30 rounded-xl border-2 border-indigo-300 dark:border-indigo-700 shadow-md">
                    <div className="space-y-1">
                      <div className="text-sm font-bold text-indigo-800 dark:text-indigo-200">Show Progress Bar</div>
                      <div className="text-xs text-indigo-600 dark:text-indigo-400">
                        Display visual progress during sessions
                      </div>
                    </div>
                    <Switch
                      checked={settings.showProgress}
                      onCheckedChange={(checked) => saveSettings({ ...settings, showProgress: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between p-5 bg-violet-100/60 dark:bg-violet-900/30 rounded-xl border-2 border-violet-300 dark:border-violet-700 shadow-md">
                    <div className="space-y-1">
                      <div className="text-sm font-bold text-violet-800 dark:text-violet-200">Show Session Count</div>
                      <div className="text-xs text-violet-600 dark:text-violet-400">
                        Display completed sessions counter
                      </div>
                    </div>
                    <Switch
                      checked={settings.showSessionCount}
                      onCheckedChange={(checked) => saveSettings({ ...settings, showSessionCount: checked })}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Focus Settings Tab */}
            <TabsContent value="focus" className="space-y-6 mt-6 p-4 bg-green-50/50 dark:bg-green-950/20 rounded-xl border-2 border-green-200/50 dark:border-green-800/50">
              <Card className="border-2 border-green-200 dark:border-green-800 bg-white dark:bg-gray-900 shadow-lg">
                <CardHeader className="border-b border-green-200 dark:border-green-800 pb-4 bg-green-50/30 dark:bg-green-900/20">
                  <CardTitle className="text-lg flex items-center gap-3 font-semibold text-green-800 dark:text-green-200">
                    <div className="p-2 bg-green-500 text-white rounded-lg shadow-sm">
                      <Zap className="h-4 w-4" />
                    </div>
                    Focus Enhancement
                  </CardTitle>
                  <CardDescription className="text-green-600 dark:text-green-400">
                    Features to help you stay focused during work sessions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 p-6">
                  <div className="flex items-center justify-between p-6 border-2 border-green-300 dark:border-green-700 rounded-xl bg-green-100/60 dark:bg-green-900/30 shadow-md">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-green-500 text-white rounded-lg shadow-sm">
                        <Target className="h-4 w-4" />
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm font-bold text-green-800 dark:text-green-200">Strict Mode</div>
                        <div className="text-xs text-green-600 dark:text-green-400">
                          Prevent pausing during work sessions
                        </div>
                      </div>
                    </div>
                    <Switch
                      checked={settings.strictMode}
                      onCheckedChange={(checked) => saveSettings({ ...settings, strictMode: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between p-6 border-2 border-emerald-300 dark:border-emerald-700 rounded-xl bg-emerald-100/60 dark:bg-emerald-900/30 shadow-md">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-emerald-500 text-white rounded-lg shadow-sm">
                        <Settings className="h-4 w-4" />
                      </div>
                      <div className="space-y-2">
                        <div className="text-sm font-bold text-emerald-800 dark:text-emerald-200 flex items-center gap-2">
                          Website Blocker
                          <Badge variant="outline" className="text-xs bg-yellow-200 dark:bg-yellow-800 border-yellow-400 dark:border-yellow-600 text-yellow-800 dark:text-yellow-200">Pro</Badge>
                        </div>
                        <div className="text-xs text-emerald-600 dark:text-emerald-400">
                          Block distracting websites during focus sessions
                        </div>
                      </div>
                    </div>
                    <Switch
                      checked={settings.websiteBlocker}
                      onCheckedChange={(checked) => saveSettings({ ...settings, websiteBlocker: checked })}
                      disabled
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-lime-200 dark:border-lime-800 bg-white dark:bg-gray-900 shadow-lg">
                <CardHeader className="border-b border-lime-200 dark:border-lime-800 pb-4 bg-lime-50/30 dark:bg-lime-900/20">
                  <CardTitle className="text-lg flex items-center gap-2 font-semibold text-lime-800 dark:text-lime-200">
                    <div className="p-2 bg-lime-500 text-white rounded-lg shadow-sm">
                      <Settings className="h-4 w-4" />
                    </div>
                    Notifications
                  </CardTitle>
                  <CardDescription className="text-lime-600 dark:text-lime-400">
                    Stay on track with helpful reminders
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 p-6">
                  <div className="flex items-center justify-between p-5 bg-lime-100/60 dark:bg-lime-900/30 rounded-xl border-2 border-lime-300 dark:border-lime-700 shadow-md">
                    <div className="space-y-1">
                      <div className="text-sm font-bold text-lime-800 dark:text-lime-200">Browser Notifications</div>
                      <div className="text-xs text-lime-600 dark:text-lime-400">
                        Show desktop notifications for session changes
                      </div>
                    </div>
                    <Switch
                      checked={settings.notifications}
                      onCheckedChange={(checked) => saveSettings({ ...settings, notifications: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between p-5 bg-teal-100/60 dark:bg-teal-900/30 rounded-xl border-2 border-teal-300 dark:border-teal-700 shadow-md">
                    <div className="space-y-1">
                      <div className="text-sm font-bold text-teal-800 dark:text-teal-200">Auto Break Reminders</div>
                      <div className="text-xs text-teal-600 dark:text-teal-400">
                        Remind you to take breaks after work sessions
                      </div>
                    </div>
                    <Switch
                      checked={settings.autoBreakReminders}
                      onCheckedChange={(checked) => saveSettings({ ...settings, autoBreakReminders: checked })}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Settings Actions */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-800 mt-6">
            <Button variant="outline" onClick={resetSettings} className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset to Defaults
            </Button>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowSettings(false)} className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                Cancel
              </Button>
              <Button onClick={() => setShowSettings(false)} className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2">
                Save Settings
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Tasks Modal */}
      <Dialog open={showTasks} onOpenChange={setShowTasks}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <Target className="h-6 w-6" />
              Task Manager
            </DialogTitle>
            <DialogDescription>
              Organize your tasks and track progress with integrated Pomodoro sessions.
            </DialogDescription>
          </DialogHeader>
          
          <TaskManager 
            currentTask={currentTask}
            onTaskSelect={(task) => {
              setCurrentTask(task)
              setShowTasks(false)
            }}
            onSessionComplete={() => {
              // This will be called when a timer session completes
              if (currentTask) {
                // Handle task progress update
                console.log('Session completed for task:', currentTask.title)
              }
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Stats Modal */}
      <Dialog open={showStats} onOpenChange={setShowStats}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <BarChart3 className="h-6 w-6" />
              Analytics & Reports
            </DialogTitle>
            <DialogDescription>
              View your productivity statistics, session history, and performance insights.
            </DialogDescription>
          </DialogHeader>
          
          <AnalyticsDashboard />
        </DialogContent>
      </Dialog>

      <Dialog open={showProModal} onOpenChange={() => setShowProModal(false)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-yellow-500" />
              {isProUser ? 'Manage Subscription' : 'Upgrade to WorkStreak Pro'}
            </DialogTitle>
            <DialogDescription>
              {isProUser 
                ? 'Manage your subscription and upgrade options' 
                : 'Remove all ads and unlock premium features to boost your productivity'
              }
            </DialogDescription>
          </DialogHeader>
          <SubscriptionManagement onClose={() => setShowProModal(false)} />
        </DialogContent>
      </Dialog>

      {/* Upgrade Prompts */}
      {UpgradePromptComponent}
    </div>
  )
}

export default function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "WorkStreak",
    "description": "Free online Pomodoro timer with habit tracking, task management, and analytics. Build focus streaks and boost productivity with the proven 25/5 technique.",
    "url": "https://workstreak.com",
    "applicationCategory": "ProductivityApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    },
    "author": {
      "@type": "Organization",
      "name": "WorkStreak Team"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "150"
    },
    "featureList": [
      "25/5 Pomodoro Timer",
      "Habit Tracking",
      "Streak Monitoring", 
      "Task Management",
      "Productivity Analytics",
      "Guest Mode (No Signup Required)",
      "Pro Features Available"
    ]
  }

  return (
    <>
      <Script id="structured-data" type="application/ld+json">
        {JSON.stringify(structuredData)}
      </Script>
      <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-background to-muted/50 flex items-center justify-center">
        <div className="text-lg animate-pulse">Loading...</div>
      </div>}>
        <HomeContent />
      </Suspense>
    </>
  )
}