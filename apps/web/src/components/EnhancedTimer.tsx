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
      {/* Session Type Switcher - Like PomofocusIO */}
      <div className="flex justify-center gap-1 bg-white/20 dark:bg-gray-800/20 p-1 rounded-lg backdrop-blur-sm">
        {[
          { key: 'work' as const, label: 'Pomodoro' },
          { key: 'shortBreak' as const, label: 'Short Break' },
          { key: 'longBreak' as const, label: 'Long Break' }
        ].map(({ key, label }) => (
          <RippleEffect
            key={key}
            color={sessionStyles[key].ripple}
            onClick={() => onSessionSwitch(key)}
            className="rounded-md"
          >
            <motion.button
              className={`
                px-4 sm:px-6 py-2 sm:py-3 rounded-md font-medium transition-all duration-300
                text-sm sm:text-base
                ${timerState.currentSession === key 
                  ? `bg-white/30 text-gray-900 dark:text-white font-bold shadow-lg border-2 border-white/40 backdrop-blur-sm` 
                  : 'text-white/80 hover:text-white hover:bg-white/10'
                }
              `}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {key === 'work' ? 'Pomodoro' : key === 'shortBreak' ? 'Short Break' : 'Long Break'}
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
          {/* Giant Time Display - The Star of the Show */}
          <motion.div 
            className="text-7xl sm:text-8xl md:text-9xl lg:text-[8rem] xl:text-[10rem] font-bold text-white mb-4 sm:mb-6 font-mono tracking-tight"
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

          {/* Session Label - Clean and Subtle */}
          <div className="text-lg sm:text-xl font-medium text-white/90 mb-8 sm:mb-12">
            {timerState.currentSession === 'work' ? 'Time to focus!' : 
             timerState.currentSession === 'shortBreak' ? 'Time for a break!' : 'Time for a long break!'}
          </div>

          {/* Control Buttons - Prominent but Not Competing */}
          <div className="flex items-center gap-6">
            {/* Main Play/Pause Button - Hero Action */}
            <RippleEffect 
              color="rgba(255, 255, 255, 0.3)"
              onClick={timerState.isActive ? onPause : onStart}
              className="rounded-full"
            >
              <motion.button
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white text-gray-800 shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center backdrop-blur-sm"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), 0 4px 16px rgba(0, 0, 0, 0.2)'
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
                      <Pause className="w-8 h-8 sm:w-10 sm:h-10" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="play"
                      initial={{ scale: 0, rotate: -90 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0, rotate: 90 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Play className="w-8 h-8 sm:w-10 sm:h-10 ml-1" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </RippleEffect>

            {/* Reset Button - Secondary Action */}
            <RippleEffect 
              color="rgba(255, 255, 255, 0.2)"
              onClick={onReset}
              className="rounded-full"
            >
              <motion.button
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/20 text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center backdrop-blur-sm border border-white/20"
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.95 }}
              >
                <RotateCcw className="w-5 h-5 sm:w-6 sm:h-6" />
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