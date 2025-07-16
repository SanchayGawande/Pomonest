'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Crown, Star, Zap, BarChart3, Palette, Clock, X, Sparkles, TrendingUp, Users, Shield } from 'lucide-react'
import { analytics } from '@/lib/analytics'

interface UpgradePromptProps {
  trigger: 'streak_milestone' | 'feature_limit' | 'session_complete' | 'theme_lock' | 'analytics_lock' | 'onboarding'
  isOpen: boolean
  onClose: () => void
  onUpgrade: () => void
  context?: {
    streak?: number
    sessionsCompleted?: number
    featureName?: string
    theme?: string
  }
}

export function UpgradePrompt({ trigger, isOpen, onClose, onUpgrade, context }: UpgradePromptProps) {
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    if (isOpen) {
      analytics.track('Upgrade Prompt Shown', {
        trigger,
        context,
        timestamp: new Date().toISOString()
      })
    }
  }, [isOpen, trigger, context])

  const handleUpgrade = () => {
    analytics.track('Upgrade Prompt Clicked', {
      trigger,
      context,
      step: currentStep
    })
    onUpgrade()
  }

  const handleClose = () => {
    analytics.track('Upgrade Prompt Dismissed', {
      trigger,
      context,
      step: currentStep
    })
    onClose()
  }

  const getPromptContent = () => {
    switch (trigger) {
      case 'streak_milestone':
        return {
          title: `🔥 ${context?.streak}-Day Streak Champion!`,
          subtitle: "You're on fire! Ready for premium features?",
          description: `Incredible work maintaining a ${context?.streak}-day focus streak! Pro users maintain their streaks 3x longer with advanced features.`,
          benefits: [
            "Advanced streak analytics and insights",
            "Streak protection during busy days",
            "Custom streak milestones and rewards",
            "All premium themes to keep you motivated"
          ],
          primaryCTA: "Upgrade to Pro",
          secondaryCTA: "Continue Free",
          urgency: "Limited time: 50% off first month!",
          social: `Join 5,000+ Pro users with streaks over ${context?.streak} days`
        }

      case 'feature_limit':
        return {
          title: `🚀 Unlock ${context?.featureName}`,
          subtitle: "You've discovered a Pro feature!",
          description: `${context?.featureName} is designed for power users like you who are serious about productivity.`,
          benefits: [
            `Full access to ${context?.featureName}`,
            "All premium themes and customizations",
            "Advanced analytics and insights",
            "Priority customer support"
          ],
          primaryCTA: "Get Pro Access",
          secondaryCTA: "Maybe Later",
          urgency: "Unlock immediately with Pro",
          social: "Used by 10,000+ productive professionals"
        }

      case 'session_complete':
        return {
          title: "🎉 Great Focus Session!",
          subtitle: "Want to track your productivity patterns?",
          description: `You just completed session #${context?.sessionsCompleted}! Pro users get detailed insights about their most productive times and patterns.`,
          benefits: [
            "Detailed productivity analytics",
            "Peak performance time insights",
            "Session quality scoring",
            "Progress visualization"
          ],
          primaryCTA: "See My Analytics",
          secondaryCTA: "Continue Free",
          urgency: "First month 40% off",
          social: "See patterns that boost productivity by 60%"
        }

      case 'theme_lock':
        return {
          title: `🎨 Love the ${context?.theme} Theme?`,
          subtitle: "Premium themes boost focus by 25%",
          description: `The ${context?.theme} theme is scientifically designed to enhance focus and reduce eye strain during long work sessions.`,
          benefits: [
            `Unlock ${context?.theme} and 9 other premium themes`,
            "Seasonal theme collections",
            "Custom color scheme options",
            "Dark mode variants for all themes"
          ],
          primaryCTA: "Unlock All Themes",
          secondaryCTA: "Stay with Default",
          urgency: "Limited preview - upgrade to keep it!",
          social: "Most popular theme among Pro users"
        }

      case 'analytics_lock':
        return {
          title: "📊 Unlock Your Productivity Insights",
          subtitle: "Data-driven productivity improvements",
          description: "See detailed analytics about your focus patterns, peak productivity times, and habit formation progress.",
          benefits: [
            "Weekly and monthly productivity reports",
            "Peak performance time analysis",
            "Habit strength indicators",
            "Goal tracking and forecasting"
          ],
          primaryCTA: "View My Analytics",
          secondaryCTA: "Continue Without",
          urgency: "See your data immediately",
          social: "Pro users improve 40% faster with insights"
        }

      case 'onboarding':
        return {
          title: "🌟 Welcome to PomoNest Pro",
          subtitle: "The ultimate productivity experience",
          description: "Transform your focus with premium features designed for productivity champions.",
          benefits: [
            "All 10+ premium themes",
            "Advanced analytics dashboard",
            "Website blocking and focus tools",
            "Priority support and updates"
          ],
          primaryCTA: "Start Free Trial",
          secondaryCTA: "Continue Free",
          urgency: "7-day free trial, then $4.99/month",
          social: "Join 10,000+ productive professionals"
        }

      default:
        return {
          title: "Upgrade to Pro",
          subtitle: "Unlock premium features",
          description: "Get access to advanced productivity tools.",
          benefits: [],
          primaryCTA: "Upgrade",
          secondaryCTA: "Cancel",
          urgency: "",
          social: ""
        }
    }
  }

  const content = getPromptContent()

  const features = [
    {
      icon: Palette,
      title: "Premium Themes",
      description: "10+ beautiful themes designed for focus",
      highlight: "New seasonal collections"
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Deep insights into your productivity patterns",
      highlight: "Peak performance insights"
    },
    {
      icon: Shield,
      title: "Focus Enhancement",
      description: "Website blocking and distraction elimination",
      highlight: "Boost focus by 40%"
    },
    {
      icon: Crown,
      title: "Priority Support",
      description: "Get help from our productivity experts",
      highlight: "24/7 response time"
    }
  ]

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Header with gradient background */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12" />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <Badge className="bg-white/20 text-white border-white/30">
                  <Crown className="w-3 h-3 mr-1" />
                  Pro Feature
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClose}
                  className="text-white hover:bg-white/10 h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <h2 className="text-2xl font-bold mb-1">{content.title}</h2>
              <p className="text-blue-100 text-sm">{content.subtitle}</p>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {content.description}
            </p>

            {/* Benefits list */}
            <div className="space-y-3 mb-6">
              {content.benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Star className="w-3 h-3 text-white fill-white" />
                  </div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">{benefit}</span>
                </motion.div>
              ))}
            </div>

            {/* Feature grid for certain triggers */}
            {trigger === 'onboarding' && (
              <div className="grid grid-cols-2 gap-3 mb-6">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <feature.icon className="w-4 h-4 text-blue-500" />
                      <span className="text-sm font-medium">{feature.title}</span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      {feature.description}
                    </p>
                    <Badge variant="secondary" className="text-xs">
                      {feature.highlight}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Social proof */}
            {content.social && (
              <div className="flex items-center gap-2 mb-6 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <Users className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-blue-700 dark:text-blue-300">{content.social}</span>
              </div>
            )}

            {/* Urgency banner */}
            {content.urgency && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-3 rounded-lg mb-6 text-center"
              >
                <div className="flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-sm font-medium">{content.urgency}</span>
                  <Sparkles className="w-4 h-4" />
                </div>
              </motion.div>
            )}

            {/* Action buttons */}
            <div className="flex flex-col gap-3">
              <Button
                onClick={handleUpgrade}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-3"
              >
                <Crown className="w-4 h-4 mr-2" />
                {content.primaryCTA}
              </Button>
              
              <Button
                variant="outline"
                onClick={handleClose}
                className="w-full"
              >
                {content.secondaryCTA}
              </Button>
            </div>

            {/* Money-back guarantee */}
            <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-4">
              30-day money-back guarantee • Cancel anytime
            </p>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}

// Hook for managing upgrade prompts
export function useUpgradePrompts() {
  const [activePrompt, setActivePrompt] = useState<{
    trigger: UpgradePromptProps['trigger']
    context?: UpgradePromptProps['context']
  } | null>(null)

  const showPrompt = (trigger: UpgradePromptProps['trigger'], context?: UpgradePromptProps['context']) => {
    setActivePrompt({ trigger, context })
  }

  const hidePrompt = () => {
    setActivePrompt(null)
  }

  const handleUpgrade = () => {
    // Track conversion attempt
    analytics.track('Upgrade Initiated', {
      source: 'upgrade_prompt',
      trigger: activePrompt?.trigger,
      context: activePrompt?.context
    })
    
    // Navigate to upgrade flow
    window.location.href = '/upgrade'
    hidePrompt()
  }

  // Auto-trigger prompts based on user behavior
  const checkForPromptTriggers = (userStats: {
    streak: number
    sessionsCompleted: number
    lastSessionDate: string
    isFirstSession: boolean
  }) => {
    const { streak, sessionsCompleted, isFirstSession } = userStats

    // Milestone-based prompts
    if (streak > 0 && (streak === 7 || streak === 14 || streak === 30 || streak % 50 === 0)) {
      showPrompt('streak_milestone', { streak })
      return
    }

    // Session completion prompts (every 10 sessions)
    if (sessionsCompleted > 0 && sessionsCompleted % 10 === 0) {
      showPrompt('session_complete', { sessionsCompleted })
      return
    }

    // First session onboarding
    if (isFirstSession) {
      // Wait 5 seconds after first session completes
      setTimeout(() => {
        showPrompt('onboarding')
      }, 5000)
    }
  }

  return {
    activePrompt,
    showPrompt,
    hidePrompt,
    handleUpgrade,
    checkForPromptTriggers,
    UpgradePromptComponent: activePrompt ? (
      <UpgradePrompt
        trigger={activePrompt.trigger}
        context={activePrompt.context}
        isOpen={true}
        onClose={hidePrompt}
        onUpgrade={handleUpgrade}
      />
    ) : null
  }
}

// Smart prompt timing utility
export class UpgradePromptManager {
  private static instance: UpgradePromptManager
  private lastPromptShown: number = 0
  private promptCooldown: number = 24 * 60 * 60 * 1000 // 24 hours
  private promptHistory: string[] = []

  static getInstance(): UpgradePromptManager {
    if (!UpgradePromptManager.instance) {
      UpgradePromptManager.instance = new UpgradePromptManager()
    }
    return UpgradePromptManager.instance
  }

  canShowPrompt(trigger: string): boolean {
    const now = Date.now()
    
    // Respect cooldown period
    if (now - this.lastPromptShown < this.promptCooldown) {
      return false
    }

    // Don't show same prompt twice in a week
    const weekAgo = now - (7 * 24 * 60 * 60 * 1000)
    const recentPrompts = this.promptHistory.filter(p => {
      const [promptTrigger, timestamp] = p.split(':')
      return promptTrigger === trigger && parseInt(timestamp) > weekAgo
    })

    return recentPrompts.length === 0
  }

  recordPromptShown(trigger: string): void {
    this.lastPromptShown = Date.now()
    this.promptHistory.push(`${trigger}:${this.lastPromptShown}`)
    
    // Keep only last 50 prompt records
    if (this.promptHistory.length > 50) {
      this.promptHistory = this.promptHistory.slice(-50)
    }
  }

  // Smart prompt suggestions based on user behavior
  suggestOptimalPrompt(userBehavior: {
    streak: number
    sessionsToday: number
    totalSessions: number
    timeSpentToday: number
    favoriteTheme: string
    hasViewedAnalytics: boolean
  }): { trigger: UpgradePromptProps['trigger']; context: any } | null {
    const { streak, sessionsToday, totalSessions, timeSpentToday, favoriteTheme, hasViewedAnalytics } = userBehavior

    // High-engagement user with strong streak
    if (streak >= 7 && this.canShowPrompt('streak_milestone')) {
      return { trigger: 'streak_milestone', context: { streak } }
    }

    // User who frequently changes themes
    if (favoriteTheme !== 'default' && this.canShowPrompt('theme_lock')) {
      return { trigger: 'theme_lock', context: { theme: favoriteTheme } }
    }

    // Power user who might want analytics
    if (totalSessions >= 20 && !hasViewedAnalytics && this.canShowPrompt('analytics_lock')) {
      return { trigger: 'analytics_lock', context: { sessionsCompleted: totalSessions } }
    }

    // Productive day prompt
    if (sessionsToday >= 3 && timeSpentToday >= 90 && this.canShowPrompt('session_complete')) {
      return { trigger: 'session_complete', context: { sessionsCompleted: totalSessions } }
    }

    return null
  }
}