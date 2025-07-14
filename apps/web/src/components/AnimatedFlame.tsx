'use client'

import { motion } from 'framer-motion'
import { Flame } from 'lucide-react'

interface AnimatedFlameProps {
  streakDays: number
  size?: number
  className?: string
  isActive?: boolean
}

export function AnimatedFlame({ 
  streakDays, 
  size = 24, 
  className = '',
  isActive = false 
}: AnimatedFlameProps) {
  // Calculate flame intensity based on streak days
  const getFlameIntensity = () => {
    if (streakDays >= 30) return 'legendary'
    if (streakDays >= 14) return 'inferno'
    if (streakDays >= 7) return 'blazing'
    if (streakDays >= 3) return 'strong'
    if (streakDays >= 1) return 'flickering'
    return 'ember'
  }

  const intensity = getFlameIntensity()
  
  // Get flame size multiplier
  const getSizeMultiplier = () => {
    switch (intensity) {
      case 'legendary': return 1.8
      case 'inferno': return 1.6
      case 'blazing': return 1.4
      case 'strong': return 1.2
      case 'flickering': return 1.0
      default: return 0.8
    }
  }

  // Get flame colors
  const getFlameColors = () => {
    switch (intensity) {
      case 'legendary': return ['#9400d3', '#4b0082', '#ff1493']
      case 'inferno': return ['#ff1493', '#ff4500', '#ffd700']
      case 'blazing': return ['#ff4500', '#ff6347', '#ffd700']
      case 'strong': return ['#ff6b35', '#ff8c00', '#ffa500']
      case 'flickering': return ['#ff7043', '#ff9800', '#ffb74d']
      default: return ['#ff8a65', '#ffab91', '#ffcc02']
    }
  }

  const flameSize = size * getSizeMultiplier()
  const colors = getFlameColors()

  // Particle count based on intensity
  const getParticleCount = () => {
    switch (intensity) {
      case 'legendary': return 12
      case 'inferno': return 8
      case 'blazing': return 6
      case 'strong': return 4
      case 'flickering': return 2
      default: return 1
    }
  }

  return (
    <div className={`relative ${className}`}>
      {/* Main Flame */}
      <motion.div
        animate={isActive ? {
          scale: [1, 1.1, 1],
          rotate: [-2, 2, -2],
        } : {}}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          filter: `drop-shadow(0 0 ${flameSize * 0.3}px ${colors[0]}) drop-shadow(0 0 ${flameSize * 0.5}px ${colors[1]})`
        }}
      >
        <Flame 
          size={flameSize}
          className="text-transparent"
          style={{
            fill: `url(#flame-gradient-${intensity})`,
          }}
        />
      </motion.div>

      {/* Floating Ember Particles */}
      {[...Array(getParticleCount())].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full"
          style={{
            backgroundColor: colors[i % colors.length],
            left: `${45 + (Math.random() - 0.5) * 20}%`,
            top: `${80 + (Math.random() - 0.5) * 10}%`,
          }}
          animate={{
            y: [-20, -60],
            x: [(Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10],
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: i * 0.5,
            ease: "easeOut"
          }}
        />
      ))}

      {/* Pulsing Glow Ring for high streaks */}
      {streakDays >= 7 && (
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle, ${colors[0]}20, transparent)`,
          }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}

      {/* SVG Gradients */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient id={`flame-gradient-${intensity}`} x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor={colors[0]} />
            <stop offset="50%" stopColor={colors[1]} />
            <stop offset="100%" stopColor={colors[2] || colors[1]} />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}