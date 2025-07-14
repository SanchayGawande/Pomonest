'use client'

import { useEffect, useState } from 'react'

interface CircularProgressProps {
  size: number
  strokeWidth: number
  percentage: number
  color: string
  bgColor?: string
  className?: string
}

export function CircularProgress({ 
  size, 
  strokeWidth, 
  percentage, 
  color, 
  bgColor = 'stroke-muted/20',
  className = '' 
}: CircularProgressProps) {
  const [mounted, setMounted] = useState(false)
  const [displayPercentage, setDisplayPercentage] = useState(0)
  
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (displayPercentage / 100) * circumference

  useEffect(() => {
    setMounted(true)
    const timer = setTimeout(() => {
      setDisplayPercentage(percentage)
    }, 100)
    return () => clearTimeout(timer)
  }, [percentage])

  if (!mounted) return null

  return (
    <div className={`relative ${className}`}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className={bgColor}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={`${color} transition-all duration-1000 ease-out`}
          style={{
            filter: 'drop-shadow(0 0 8px currentColor)',
          }}
        />
      </svg>
    </div>
  )
}