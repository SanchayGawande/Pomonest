'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TrendingUp, TrendingDown, Clock, Zap, Target, Flame } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface SessionData {
  id: string
  user_id: string
  session_type: 'work' | 'short_break' | 'long_break'
  duration_minutes: number
  completed_at: string
  created_at: string
}

interface Insight {
  id: string
  text: string
  icon: React.ReactNode
  trend: 'up' | 'down' | 'neutral'
  color: string
  category: 'productivity' | 'streak' | 'timing' | 'focus'
}

interface SmartInsightsProps {
  userId?: string
  className?: string
}

export function SmartInsights({ userId, className = '' }: SmartInsightsProps) {
  const [insights, setInsights] = useState<Insight[]>([])
  const [currentInsightIndex, setCurrentInsightIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (userId) {
      generateInsights()
      // Rotate insights every 8 seconds
      const interval = setInterval(() => {
        setCurrentInsightIndex(prev => (prev + 1) % insights.length)
      }, 8000)
      return () => clearInterval(interval)
    }
  }, [userId, insights.length])

  const generateInsights = async () => {
    if (!userId) {
      setIsLoading(false)
      return
    }

    try {
      // Get last 30 days of sessions
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

      const { data: sessions, error } = await supabase
        .from('sessions')
        .select('*')
        .eq('user_id', userId)
        .gte('created_at', thirtyDaysAgo.toISOString())
        .order('created_at', { ascending: false })

      if (error || !sessions || sessions.length === 0) {
        setInsights([getWelcomeInsight()])
        setIsLoading(false)
        return
      }

      const generatedInsights = analyzeAndGenerateInsights(sessions)
      setInsights(generatedInsights)
    } catch (error) {
      console.error('Error generating insights:', error)
      setInsights([getWelcomeInsight()])
    } finally {
      setIsLoading(false)
    }
  }

  const getWelcomeInsight = (): Insight => ({
    id: 'welcome',
    text: 'Start your first session to unlock personalized insights!',
    icon: <Zap className="w-4 h-4" />,
    trend: 'neutral',
    color: 'text-blue-600',
    category: 'productivity'
  })

  const analyzeAndGenerateInsights = (sessions: SessionData[]): Insight[] => {
    const insights: Insight[] = []
    const workSessions = sessions.filter(s => s.session_type === 'work')
    
    // Productivity insights
    if (workSessions.length >= 7) {
      const avgDaily = workSessions.length / 7
      const weeklyAvg = Math.round(avgDaily * 7)
      
      if (avgDaily >= 4) {
        insights.push({
          id: 'high-productivity',
          text: `You're crushing it with ${weeklyAvg} sessions per week! 🔥`,
          icon: <Flame className="w-4 h-4" />,
          trend: 'up',
          color: 'text-red-600',
          category: 'productivity'
        })
      } else if (avgDaily >= 2) {
        insights.push({
          id: 'good-productivity',
          text: `Steady progress with ${weeklyAvg} weekly sessions. Keep building!`,
          icon: <TrendingUp className="w-4 h-4" />,
          trend: 'up',
          color: 'text-green-600',
          category: 'productivity'
        })
      }
    }

    // Timing insights
    const sessionTimes = workSessions.map(s => {
      const hour = new Date(s.created_at).getHours()
      return hour
    })

    if (sessionTimes.length >= 5) {
      const morningCount = sessionTimes.filter(h => h >= 6 && h < 12).length
      const afternoonCount = sessionTimes.filter(h => h >= 12 && h < 18).length
      const eveningCount = sessionTimes.filter(h => h >= 18 && h < 24).length

      const totalSessions = sessionTimes.length
      const morningPercentage = Math.round((morningCount / totalSessions) * 100)
      const afternoonPercentage = Math.round((afternoonCount / totalSessions) * 100)
      const eveningPercentage = Math.round((eveningCount / totalSessions) * 100)

      if (morningPercentage >= 50) {
        insights.push({
          id: 'morning-person',
          text: `You focus ${morningPercentage}% better in the morning ☀️`,
          icon: <Clock className="w-4 h-4" />,
          trend: 'up',
          color: 'text-yellow-600',
          category: 'timing'
        })
      } else if (afternoonPercentage >= 50) {
        insights.push({
          id: 'afternoon-person',
          text: `Afternoon warrior! ${afternoonPercentage}% of sessions after noon`,
          icon: <Clock className="w-4 h-4" />,
          trend: 'neutral',
          color: 'text-orange-600',
          category: 'timing'
        })
      } else if (eveningPercentage >= 40) {
        insights.push({
          id: 'evening-person',
          text: `Night owl detected! ${eveningPercentage}% evening focus sessions`,
          icon: <Clock className="w-4 h-4" />,
          trend: 'neutral',
          color: 'text-purple-600',
          category: 'timing'
        })
      }
    }

    // Streak insights
    const consecutiveDays = calculateConsecutiveDays(sessions)
    if (consecutiveDays >= 3) {
      insights.push({
        id: 'streak-insight',
        text: `${consecutiveDays} day streak! You're building a powerful habit 💪`,
        icon: <Target className="w-4 h-4" />,
        trend: 'up',
        color: 'text-green-600',
        category: 'streak'
      })
    }

    // Focus duration insights
    const avgDuration = workSessions.reduce((sum, s) => sum + (s.duration_minutes || 25), 0) / workSessions.length
    if (avgDuration >= 25) {
      insights.push({
        id: 'focus-duration',
        text: `${Math.round(avgDuration)} minute average focus time - excellent depth!`,
        icon: <Zap className="w-4 h-4" />,
        trend: 'up',
        color: 'text-blue-600',
        category: 'focus'
      })
    }

    // Recent improvement
    const recent7Days = workSessions.filter(s => {
      const sessionDate = new Date(s.created_at)
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return sessionDate >= weekAgo
    })

    const previous7Days = workSessions.filter(s => {
      const sessionDate = new Date(s.created_at)
      const twoWeeksAgo = new Date()
      twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14)
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return sessionDate >= twoWeeksAgo && sessionDate < weekAgo
    })

    if (recent7Days.length > previous7Days.length && previous7Days.length > 0) {
      const improvement = Math.round(((recent7Days.length - previous7Days.length) / previous7Days.length) * 100)
      insights.push({
        id: 'improvement',
        text: `${improvement}% more focused this week than last. Rising star! ⭐`,
        icon: <TrendingUp className="w-4 h-4" />,
        trend: 'up',
        color: 'text-emerald-600',
        category: 'productivity'
      })
    }

    return insights.length > 0 ? insights : [getWelcomeInsight()]
  }

  const calculateConsecutiveDays = (sessions: SessionData[]): number => {
    const dates = Array.from(new Set(sessions.map(s => s.created_at.split('T')[0]))).sort().reverse()
    let consecutive = 0
    
    for (let i = 0; i < dates.length; i++) {
      const currentDate = new Date(dates[i])
      const expectedDate = new Date()
      expectedDate.setDate(expectedDate.getDate() - i)
      
      if (currentDate.toDateString() === expectedDate.toDateString()) {
        consecutive++
      } else {
        break
      }
    }
    
    return consecutive
  }

  if (isLoading) {
    return (
      <div className={`${className} animate-pulse`}>
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto"></div>
      </div>
    )
  }

  if (insights.length === 0) {
    return null
  }

  const currentInsight = insights[currentInsightIndex]

  return (
    <div className={`${className} text-center`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentInsight.id}
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          transition={{ 
            duration: 0.5, 
            ease: "easeOut"
          }}
          className="flex items-center justify-center gap-2 text-sm sm:text-base"
        >
          <motion.div
            className={currentInsight.color}
            animate={{ 
              scale: currentInsight.trend === 'up' ? [1, 1.1, 1] : 1,
              rotate: currentInsight.trend === 'up' ? [0, 5, 0] : 0
            }}
            transition={{ 
              duration: 2,
              repeat: currentInsight.trend === 'up' ? Infinity : 0,
              ease: "easeInOut"
            }}
          >
            {currentInsight.icon}
          </motion.div>
          
          <motion.span 
            className={`${currentInsight.color} font-medium`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {currentInsight.text}
          </motion.span>
        </motion.div>
      </AnimatePresence>

      {/* Progress dots */}
      {insights.length > 1 && (
        <div className="flex justify-center gap-1 mt-3">
          {insights.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => setCurrentInsightIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentInsightIndex 
                  ? currentInsight.color.replace('text-', 'bg-') 
                  : 'bg-gray-300 dark:bg-gray-600'
              }`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </div>
      )}
    </div>
  )
}