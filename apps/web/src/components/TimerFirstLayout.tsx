'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Target } from 'lucide-react'
import { EnhancedTimer } from '@/components/EnhancedTimer'
import { SmartInsights } from '@/components/SmartInsights'
import { ProVisualThemes } from '@/components/ProVisualThemes'

interface TimerFirstLayoutProps {
  timerState: any
  isAuthenticated: boolean
  userId?: string
  currentTask?: any
  isLongBreak: boolean
  onToggleTimer: () => void
  onResetTimer: () => void
  onSessionSwitch: (session: 'work' | 'shortBreak' | 'longBreak') => void
  soundEnabled: boolean
  totalDuration: number
  isProUser?: boolean
  settings?: {
    colorScheme: string
    backgroundStyle: string
  }
}

export function TimerFirstLayout({
  timerState,
  isAuthenticated,
  userId,
  currentTask,
  isLongBreak,
  onToggleTimer,
  onResetTimer,
  onSessionSwitch,
  soundEnabled,
  totalDuration,
  isProUser = false,
  settings = { colorScheme: 'workstreak', backgroundStyle: 'gradient' }
}: TimerFirstLayoutProps) {
  
  // Determine current session type for theming
  const currentSessionType = timerState.isBreak 
    ? (isLongBreak ? 'longBreak' : 'shortBreak')
    : 'work'

  // Debug logging for Pro status and visual themes
  console.log('🎮 TimerFirstLayout - Pro status:', isProUser)
  console.log('🎮 TimerFirstLayout - Settings:', settings)

  const getMainText = () => {
    if (timerState.isBreak) {
      return "Take a break and recharge"
    }
    if (currentTask) {
      return `Working on: ${currentTask.title}`
    }
    return "Stay focused and avoid distractions"
  }

  const getSessionTitle = () => {
    if (timerState.isBreak) {
      return isLongBreak ? "Long Break" : "Short Break"
    }
    return "Pomodoro"
  }

  return (
    <main className="relative z-10 flex-1 flex flex-col min-h-screen">
      {/* HERO TIMER SECTION - Full Screen Background */}
      <div className="flex-1 flex items-center justify-center min-h-[calc(100vh-80px)] transition-all duration-1000 ease-in-out relative overflow-hidden">
        
        {/* Pro Visual Themes or Default Background */}
        {isProUser ? (
          <ProVisualThemes 
            colorScheme={settings.colorScheme}
            backgroundStyle={settings.backgroundStyle}
            sessionType={currentSessionType}
          />
        ) : (
          <>
            {/* Default Background for Free Users */}
            <div className={`absolute inset-0 ${
              currentSessionType === 'work' 
                ? 'bg-gradient-to-br from-red-400 via-red-500 to-red-600'
                : currentSessionType === 'shortBreak'
                ? 'bg-gradient-to-br from-green-400 via-green-500 to-green-600'
                : 'bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600'
            }`} />
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.5) 1px, transparent 0)`,
                backgroundSize: '20px 20px'
              }} />
            </div>
          </>
        )}

        {/* Main Timer Container */}
        <div className="relative z-10 w-full max-w-2xl mx-auto px-4 py-8 text-center">
          
          {/* Session Type Badge */}
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Badge 
              variant="secondary" 
              className={`text-sm font-semibold px-4 py-2 backdrop-blur-sm ${
                timerState.isBreak 
                  ? 'bg-white/20 text-white border-white/30'
                  : 'bg-white/20 text-white border-white/30'
              }`}
            >
              {getSessionTitle()}
            </Badge>
          </motion.div>
          
          {/* Page Title - Clean and Minimal */}
          <motion.h1 
            className="text-lg sm:text-xl font-medium text-white/90 mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {getMainText()}
          </motion.h1>

          {/* Current Task Badge - Only if working */}
          <AnimatePresence>
            {currentTask && !timerState.isBreak && (
              <motion.div 
                className="mb-8"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
              >
                <Badge className="bg-white/20 text-white border-white/30 px-4 py-2 text-sm">
                  <Target className="h-3 w-3 mr-2" />
                  Session {currentTask.completedPomodoros + 1} of {currentTask.estimatedPomodoros}
                </Badge>
              </motion.div>
            )}
          </AnimatePresence>

          {/* MASSIVE HERO TIMER - The Star of the Show */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <EnhancedTimer
              timerState={{
                timeLeft: timerState.timeLeft,
                isActive: timerState.isActive,
                currentSession: timerState.isBreak 
                  ? (isLongBreak ? 'longBreak' : 'shortBreak')
                  : 'work',
                totalTime: totalDuration
              }}
              onStart={onToggleTimer}
              onPause={onToggleTimer}
              onReset={onResetTimer}
              onSessionSwitch={(session) => {
                if (session === 'work') onSessionSwitch('work')
                else if (session === 'shortBreak') onSessionSwitch('shortBreak')
                else if (session === 'longBreak') onSessionSwitch('longBreak')
              }}
              soundEnabled={soundEnabled}
            />
          </motion.div>

          {/* Smart Insights - Integrated into Hero */}
          <AnimatePresence>
            {isAuthenticated && (
              <motion.div
                className="mt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <SmartInsights 
                  userId={userId} 
                  className="text-white/90"
                />
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </main>
  )
}