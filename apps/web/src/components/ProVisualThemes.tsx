'use client'

import { motion } from 'framer-motion'

interface ProVisualThemesProps {
  colorScheme: string
  backgroundStyle: string
  sessionType: 'work' | 'shortBreak' | 'longBreak'
}

export function ProVisualThemes({ colorScheme, backgroundStyle, sessionType }: ProVisualThemesProps) {
  // Debug logging for Pro themes
  console.log('🎨 ProVisualThemes loaded:', { colorScheme, backgroundStyle, sessionType })
  
  // Advanced color schemes with animated gradients
  const getThemeColors = () => {
    const baseSchemes = {
      workstreak: {
        work: 'from-red-400 via-red-500 to-red-600',
        shortBreak: 'from-green-400 via-green-500 to-green-600',
        longBreak: 'from-blue-400 via-blue-500 to-blue-600'
      },
      ocean: {
        work: 'from-blue-600 via-blue-700 to-blue-800',
        shortBreak: 'from-cyan-400 via-cyan-500 to-cyan-600',
        longBreak: 'from-teal-400 via-teal-500 to-teal-600'
      },
      forest: {
        work: 'from-green-600 via-green-700 to-green-800',
        shortBreak: 'from-emerald-400 via-emerald-500 to-emerald-600',
        longBreak: 'from-lime-400 via-lime-500 to-lime-600'
      },
      sunset: {
        work: 'from-orange-500 via-red-500 to-pink-500',
        shortBreak: 'from-yellow-400 via-orange-400 to-red-400',
        longBreak: 'from-purple-400 via-pink-400 to-red-400'
      },
      cosmic: {
        work: 'from-purple-600 via-purple-700 to-indigo-800',
        shortBreak: 'from-purple-400 via-purple-500 to-purple-600',
        longBreak: 'from-indigo-400 via-purple-500 to-pink-500'
      },
      aurora: {
        work: 'from-green-400 via-blue-500 to-purple-600',
        shortBreak: 'from-cyan-400 via-green-400 to-blue-500',
        longBreak: 'from-purple-400 via-pink-400 to-orange-400'
      },
      neon: {
        work: 'from-pink-500 via-purple-500 to-indigo-600',
        shortBreak: 'from-green-400 via-cyan-400 to-blue-500',
        longBreak: 'from-yellow-400 via-pink-400 to-purple-500'
      },
      retro: {
        work: 'from-purple-600 via-pink-600 to-red-600',
        shortBreak: 'from-cyan-400 via-purple-400 to-pink-500',
        longBreak: 'from-yellow-400 via-orange-400 to-red-500'
      }
    }
    
    return baseSchemes[colorScheme as keyof typeof baseSchemes] || baseSchemes.workstreak
  }

  const currentGradient = getThemeColors()[sessionType]

  // Advanced background styles with stunning animations
  const renderBackgroundStyle = () => {
    switch (backgroundStyle) {
      case 'particles':
        return (
          <div className="absolute inset-0 overflow-hidden">
            {/* Floating Particles */}
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white/20 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [-20, -100],
                  x: [0, Math.random() * 40 - 20],
                  opacity: [0, 1, 0],
                  scale: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 4 + Math.random() * 6,
                  repeat: Infinity,
                  delay: Math.random() * 5,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        )
      
      case 'waves':
        return (
          <div className="absolute inset-0 overflow-hidden">
            {/* Animated Waves */}
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute inset-0 opacity-20"
                style={{
                  background: `radial-gradient(ellipse at ${50 + i * 20}% ${50 + i * 15}%, rgba(255,255,255,0.3) 0%, transparent 50%)`,
                }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.1, 0.3, 0.1],
                }}
                transition={{
                  duration: 8 + i * 2,
                  repeat: Infinity,
                  delay: i * 2,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        )
      
      case 'geometric':
        return (
          <div className="absolute inset-0 overflow-hidden">
            {/* Geometric Shapes */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute border border-white/10"
                style={{
                  width: `${60 + i * 20}px`,
                  height: `${60 + i * 20}px`,
                  left: `${20 + i * 15}%`,
                  top: `${20 + i * 10}%`,
                  borderRadius: i % 2 === 0 ? '50%' : '0%'
                }}
                animate={{
                  rotate: [0, 360],
                  scale: [0.8, 1.2, 0.8],
                  opacity: [0.1, 0.3, 0.1]
                }}
                transition={{
                  duration: 15 + i * 3,
                  repeat: Infinity,
                  delay: i * 1.5,
                  ease: "linear"
                }}
              />
            ))}
          </div>
        )
      
      case 'aurora':
        return (
          <div className="absolute inset-0 overflow-hidden">
            {/* Aurora Effect */}
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute inset-0 opacity-30"
                style={{
                  background: `linear-gradient(${45 + i * 30}deg, 
                    rgba(255,255,255,0) 0%, 
                    rgba(255,255,255,0.2) 50%, 
                    rgba(255,255,255,0) 100%)`
                }}
                animate={{
                  rotate: [0, 10, -10, 0],
                  opacity: [0.1, 0.4, 0.1],
                  scale: [1, 1.1, 1]
                }}
                transition={{
                  duration: 12 + i * 2,
                  repeat: Infinity,
                  delay: i * 3,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        )
      
      case 'matrix':
        return (
          <div className="absolute inset-0 overflow-hidden">
            {/* Matrix Rain Effect */}
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-px bg-white/20"
                style={{
                  left: `${i * 5}%`,
                  height: '100%'
                }}
                animate={{
                  opacity: [0, 1, 0],
                  scaleY: [0, 1, 0]
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 4,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        )
      
      case 'breathing':
        return (
          <div className="absolute inset-0 overflow-hidden">
            {/* Breathing Circles */}
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full border border-white/10"
                style={{
                  width: `${100 + i * 50}px`,
                  height: `${100 + i * 50}px`,
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)'
                }}
                animate={{
                  scale: [0.8, 1.2, 0.8],
                  opacity: [0.1, 0.3, 0.1]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  delay: i * 0.8,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        )
      
      case 'gradient':
        return (
          <div className="absolute inset-0 overflow-hidden">
            {/* Enhanced Gradient with subtle animation */}
            <motion.div 
              className="absolute inset-0 opacity-20"
              animate={{
                background: [
                  'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.2) 0%, transparent 50%)',
                  'radial-gradient(circle at 80% 50%, rgba(255,255,255,0.2) 0%, transparent 50%)',
                  'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.2) 0%, transparent 50%)'
                ]
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.5) 1px, transparent 0)`,
                backgroundSize: '20px 20px'
              }} />
            </div>
          </div>
        )
      
      default:
        return (
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.5) 1px, transparent 0)`,
              backgroundSize: '20px 20px'
            }} />
          </div>
        )
    }
  }

  return (
    <>
      {/* Main Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${currentGradient}`} />
      
      {/* Animated Background Elements */}
      {renderBackgroundStyle()}
      
      {/* Subtle Overlay for Better Text Contrast */}
      <div className="absolute inset-0 bg-black/10" />
    </>
  )
}