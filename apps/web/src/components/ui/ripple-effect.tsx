'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface RippleProps {
  children: React.ReactNode
  className?: string
  color?: string
  duration?: number
  disabled?: boolean
  onClick?: () => void
}

interface Ripple {
  id: number
  x: number
  y: number
}

export function RippleEffect({ 
  children, 
  className = '', 
  color = 'rgba(255, 255, 255, 0.3)',
  duration = 600,
  disabled = false,
  onClick 
}: RippleProps) {
  const [ripples, setRipples] = useState<Ripple[]>([])

  const createRipple = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return

    const button = event.currentTarget
    const rect = button.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    const newRipple: Ripple = {
      id: Date.now(),
      x,
      y,
    }

    setRipples(prev => [...prev, newRipple])

    // Remove ripple after animation
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id))
    }, duration)

    // Call onClick handler
    onClick?.()
  }, [disabled, duration, onClick])

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      onMouseDown={createRipple}
      style={{ 
        WebkitTapHighlightColor: 'transparent',
        touchAction: 'manipulation'
      }}
    >
      {children}
      
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.div
            key={ripple.id}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: ripple.x - 20,
              top: ripple.y - 20,
              backgroundColor: color,
            }}
            initial={{
              width: 40,
              height: 40,
              opacity: 0.8,
            }}
            animate={{
              width: 300,
              height: 300,
              opacity: 0,
            }}
            exit={{
              opacity: 0,
            }}
            transition={{
              duration: duration / 1000,
              ease: 'easeOut',
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}