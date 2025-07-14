'use client'

import { useState, useEffect } from 'react'
import Confetti from 'react-confetti'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Crown, Flame, Star, Zap } from 'lucide-react'

interface StreakCelebrationProps {
  isVisible: boolean
  streakDays: number
  onComplete: () => void
}

interface MilestoneData {
  threshold: number
  title: string
  subtitle: string
  icon: React.ComponentType<any>
  colors: string[]
  confettiColors: string[]
}

const MILESTONES: MilestoneData[] = [
  {
    threshold: 1,
    title: "🔥 First Spark!",
    subtitle: "Your journey begins!",
    icon: Flame,
    colors: ['#ff6b35', '#f7931e'],
    confettiColors: ['#ff6b35', '#f7931e', '#ffd700']
  },
  {
    threshold: 3,
    title: "🔥 Fire Starter",
    subtitle: "3 days of pure focus!",
    icon: Flame,
    colors: ['#ff4500', '#ff6347'],
    confettiColors: ['#ff4500', '#ff6347', '#ffd700', '#ff1493']
  },
  {
    threshold: 7,
    title: "🏆 Flame Keeper",
    subtitle: "A full week of dedication!",
    icon: Trophy,
    colors: ['#ffd700', '#ff8c00'],
    confettiColors: ['#ffd700', '#ff8c00', '#ff4500', '#ff69b4', '#00ff00']
  },
  {
    threshold: 14,
    title: "👑 Inferno Master",
    subtitle: "Two weeks of unstoppable momentum!",
    icon: Crown,
    colors: ['#ff1493', '#8a2be2'],
    confettiColors: ['#ff1493', '#8a2be2', '#ffd700', '#ff4500', '#00ff00', '#1e90ff']
  },
  {
    threshold: 30,
    title: "⚡ Lightning Legend",
    subtitle: "30 days of pure excellence!",
    icon: Zap,
    colors: ['#9400d3', '#4b0082'],
    confettiColors: ['#9400d3', '#4b0082', '#ff1493', '#ffd700', '#ff4500', '#00ff00', '#1e90ff', '#ff69b4']
  }
]

export function StreakCelebration({ isVisible, streakDays, onComplete }: StreakCelebrationProps) {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })
  const [playSound, setPlaySound] = useState(false)

  // Get current milestone
  const currentMilestone = MILESTONES
    .slice()
    .reverse()
    .find(m => streakDays >= m.threshold) || MILESTONES[0]

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }

    if (typeof window !== 'undefined') {
      handleResize()
      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
    }
  }, [])

  useEffect(() => {
    if (isVisible) {
      setPlaySound(true)
      // Haptic feedback simulation with screen shake
      document.body.style.animation = 'shake 0.5s ease-in-out'
      
      // Auto-complete after 4 seconds
      const timer = setTimeout(() => {
        onComplete()
        document.body.style.animation = ''
      }, 4000)

      return () => {
        clearTimeout(timer)
        document.body.style.animation = ''
      }
    }
  }, [isVisible, onComplete])

  if (!isVisible) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        onClick={onComplete}
      >
        {/* Confetti */}
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={300}
          colors={currentMilestone.confettiColors}
          gravity={0.3}
          wind={0.05}
        />

        {/* Celebration Card */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0, rotate: 180 }}
          transition={{ 
            type: "spring", 
            stiffness: 260, 
            damping: 20,
            duration: 0.8 
          }}
          className="relative bg-gradient-to-br from-white via-yellow-50 to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 rounded-3xl shadow-2xl border-4 border-yellow-400 p-8 mx-4 max-w-md text-center overflow-hidden"
        >
          {/* Sparkle Background */}
          <div className="absolute inset-0 opacity-20">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>

          {/* Achievement Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1] }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="relative mb-6"
          >
            <div 
              className="w-24 h-24 mx-auto rounded-full flex items-center justify-center text-6xl shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${currentMilestone.colors[0]}, ${currentMilestone.colors[1]})`
              }}
            >
              <currentMilestone.icon className="w-12 h-12 text-white drop-shadow-lg" />
            </div>
            
            {/* Pulsing rings */}
            <motion.div
              className="absolute inset-0 rounded-full border-4 border-yellow-400"
              animate={{
                scale: [1, 1.5, 2],
                opacity: [1, 0.5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            />
          </motion.div>

          {/* Achievement Text */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
              {currentMilestone.title}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
              {currentMilestone.subtitle}
            </p>
            
            {/* Streak Counter */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.3, 1] }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-full text-2xl font-bold shadow-lg"
            >
              <Flame className="w-8 h-8" />
              <span>{streakDays} Day{streakDays !== 1 ? 's' : ''}</span>
            </motion.div>
          </motion.div>

          {/* Floating Elements */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                left: `${20 + (i * 10)}%`,
                top: `${20 + ((i % 3) * 25)}%`,
              }}
              animate={{
                y: [-20, -40, -20],
                rotate: [0, 360],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            >
              <Star className="w-4 h-4 text-yellow-400" />
            </motion.div>
          ))}

          {/* Continue Button */}
          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            onClick={onComplete}
            className="mt-6 px-8 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            Continue the Streak! 🚀
          </motion.button>
        </motion.div>
      </motion.div>

      {/* CSS for shake animation */}
      <style jsx global>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
          20%, 40%, 60%, 80% { transform: translateX(2px); }
        }
      `}</style>
    </AnimatePresence>
  )
}