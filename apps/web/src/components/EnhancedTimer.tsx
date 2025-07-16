'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, RotateCcw, Coffee } from 'lucide-react'
import { RippleEffect } from '@/components/ui/ripple-effect'
import { formatTime, calculateProgress } from "@workstreak/shared-timer"

interface TimerState {
  timeLeft: number
  isActive: boolean
  currentSession: 'work' | 'shortBreak' | 'longBreak'
  totalTime: number
}

interface EnhancedTimerProps {
  timerState: TimerState
  onStart: () => void
  onPause: () => void
  onReset: () => void
  onSessionSwitch: (session: 'work' | 'shortBreak' | 'longBreak') => void
  soundEnabled: boolean
}

export function EnhancedTimer({
  timerState,
  onStart,
  onPause,
  onReset,
  onSessionSwitch,
  soundEnabled
}: EnhancedTimerProps) {
  const [showAmbientMode, setShowAmbientMode] = useState(false)
  const progress = calculateProgress(timerState.timeLeft, timerState.totalTime)

  // Enhanced progress ring with breathing effect
  const circumference = 2 * Math.PI * 120
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (progress / 100) * circumference

  // Session type colors with enhanced gradients
  const sessionStyles = {
    work: {
      primary: 'from-red-400 to-red-600',
      secondary: 'from-red-500 to-red-700',
      accent: 'text-red-600',
      bg: 'bg-red-50 dark:bg-red-950/20',
      ripple: 'rgba(239, 68, 68, 0.3)'
    },
    shortBreak: {
      primary: 'from-green-400 to-green-600',
      secondary: 'from-green-500 to-green-700',
      accent: 'text-green-600',
      bg: 'bg-green-50 dark:bg-green-950/20',
      ripple: 'rgba(34, 197, 94, 0.3)'
    },
    longBreak: {
      primary: 'from-blue-400 to-blue-600',
      secondary: 'from-blue-500 to-blue-700',
      accent: 'text-blue-600',
      bg: 'bg-blue-50 dark:bg-blue-950/20',
      ripple: 'rgba(59, 130, 246, 0.3)'
    }
  }

  const currentStyle = sessionStyles[timerState.currentSession]

  return (
    <div className="flex flex-col items-center space-y-8 w-full max-w-lg mx-auto px-4">
      {/* Session Type Switcher - Mobile Optimized */}
      <div className="flex justify-center gap-1 bg-white/20 dark:bg-gray-800/20 p-1 rounded-lg backdrop-blur-sm w-full max-w-sm">
        {[
          { key: 'work' as const, label: 'Pomodoro' },
          { key: 'shortBreak' as const, label: 'Short Break' },
          { key: 'longBreak' as const, label: 'Long Break' }
        ].map(({ key, label }) => (
          <RippleEffect
            key={key}
            color={sessionStyles[key].ripple}
            onClick={() => onSessionSwitch(key)}
            className="rounded-md flex-1"
          >
            <motion.button
              className={`
                w-full px-2 sm:px-4 py-2 sm:py-3 rounded-md font-medium transition-all duration-300
                text-xs sm:text-sm touch-manipulation
                min-h-[44px] flex items-center justify-center
                ${timerState.currentSession === key 
                  ? `bg-white/30 text-gray-900 dark:text-white font-bold shadow-lg border-2 border-white/40 backdrop-blur-sm` 
                  : 'text-white/80 hover:text-white hover:bg-white/10'
                }
              `}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                minHeight: '44px',
                minWidth: '80px'
              }}
            >
              <span className="block text-center leading-tight">
                {key === 'work' ? 'Pomodoro' : key === 'shortBreak' ? 'Short' : 'Long'}
                <br className="sm:hidden" />
                <span className="hidden sm:inline">{key === 'work' ? '' : key === 'shortBreak' ? ' Break' : ' Break'}</span>
              </span>
            </motion.button>
          </RippleEffect>
        ))}
      </div>

      {/* HERO TIMER - Massive and Central Like PomofocusIO */}
      <div className="relative w-full flex flex-col items-center">
        {/* Ambient Mode Toggle - Subtle */}
        <motion.button
          onClick={() => setShowAmbientMode(!showAmbientMode)}
          className="absolute top-0 right-0 z-10 p-2 rounded-full bg-white/10 opacity-30 hover:opacity-70 transition-opacity"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          🌊
        </motion.button>

        {/* Massive Timer Display - PomofocusIO Style */}
        <motion.div 
          className="relative w-full flex flex-col items-center"
          animate={{ 
            scale: timerState.isActive ? [1, 1.005, 1] : 1 
          }}
          transition={{ 
            duration: 4, 
            repeat: timerState.isActive ? Infinity : 0,
            ease: "easeInOut" 
          }}
        >
          {/* Giant Time Display - Mobile Optimized */}
          <motion.div 
            className="text-5xl sm:text-7xl md:text-8xl lg:text-[8rem] xl:text-[10rem] font-bold text-white mb-3 sm:mb-6 font-mono tracking-tight"
            key={formatTime(timerState.timeLeft)}
            initial={{ scale: 0.98, opacity: 0.9 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            style={{
              textShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
              filter: 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.2))'
            }}
          >
            {formatTime(timerState.timeLeft)}
          </motion.div>

          {/* Session Label - Mobile Optimized */}
          <div className="text-base sm:text-lg md:text-xl font-medium text-white/90 mb-6 sm:mb-12 px-4 text-center">
            {timerState.currentSession === 'work' ? 'Stay focused!' : 
             timerState.currentSession === 'shortBreak' ? 'Take a break!' : 'Long break time!'}
          </div>

          {/* Control Buttons - Mobile Touch Optimized */}
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Main Play/Pause Button - Touch-Friendly */}
            <RippleEffect 
              color="rgba(255, 255, 255, 0.3)"
              onClick={timerState.isActive ? onPause : onStart}
              className="rounded-full"
            >
              <motion.button
                className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-white text-gray-800 shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center backdrop-blur-sm touch-manipulation"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), 0 4px 16px rgba(0, 0, 0, 0.2)',
                  minHeight: '64px', // Ensures minimum touch target size
                  minWidth: '64px'
                }}
              >
                <AnimatePresence mode="wait">
                  {timerState.isActive ? (
                    <motion.div
                      key="pause"
                      initial={{ scale: 0, rotate: -90 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0, rotate: 90 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Pause className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="play"
                      initial={{ scale: 0, rotate: -90 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0, rotate: 90 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Play className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 ml-1" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </RippleEffect>

            {/* Reset Button - Mobile Touch Optimized */}
            <RippleEffect 
              color="rgba(255, 255, 255, 0.2)"
              onClick={onReset}
              className="rounded-full"
            >
              <motion.button
                className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-white/20 text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center backdrop-blur-sm border border-white/20 touch-manipulation"
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  minHeight: '48px', // Minimum touch target
                  minWidth: '48px'
                }}
              >
                <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
              </motion.button>
            </RippleEffect>
          </div>

          {/* Subtle Progress Ring - Background Element */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <svg
              width="100%"
              height="100%"
              className="absolute inset-0 transform -rotate-90 opacity-20"
              viewBox="0 0 200 200"
              style={{ maxWidth: '400px', maxHeight: '400px' }}
            >
              {/* Background Circle */}
              <circle
                cx="100"
                cy="100"
                r="90"
                stroke="rgba(255, 255, 255, 0.1)"
                strokeWidth="2"
                fill="none"
              />
              
              {/* Progress Circle */}
              <motion.circle
                cx="100"
                cy="100"
                r="90"
                stroke="rgba(255, 255, 255, 0.3)"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 90}
                strokeDashoffset={2 * Math.PI * 90 - (calculateProgress(timerState.timeLeft, timerState.totalTime) / 100) * 2 * Math.PI * 90}
                className="transition-all duration-1000 ease-out"
              />
            </svg>
          </div>
        </motion.div>
      </div>

      {/* Ambient Mode Overlay */}
      <AnimatePresence>
        {showAmbientMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-gradient-to-br from-blue-900 via-purple-900 to-blue-800"
            onClick={() => setShowAmbientMode(false)}
          >
            {/* Floating Particles */}
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-white/30 rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    y: [-20, -100],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 3 + Math.random() * 4,
                    repeat: Infinity,
                    delay: Math.random() * 3,
                  }}
                />
              ))}
            </div>

            {/* Ambient Timer */}
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-white">
                <motion.div 
                  className="text-6xl sm:text-8xl md:text-9xl font-bold mb-4 font-mono"
                  animate={{ 
                    scale: timerState.isActive ? [1, 1.05, 1] : 1 
                  }}
                  transition={{ 
                    duration: 4, 
                    repeat: timerState.isActive ? Infinity : 0,
                    ease: "easeInOut" 
                  }}
                >
                  {formatTime(timerState.timeLeft)}
                </motion.div>
                <div className="text-xl sm:text-2xl opacity-80 mb-8">
                  {timerState.currentSession === 'work' ? 'Deep Focus' : 'Mindful Break'}
                </div>
                <motion.div
                  className="text-sm opacity-60"
                  animate={{ opacity: [0.4, 0.8, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  Tap anywhere to exit ambient mode
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}