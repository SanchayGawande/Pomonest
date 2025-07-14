'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useUser } from '@/lib/queries'
import { useAds } from './AdProvider'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Crown, Zap, Target } from 'lucide-react'

interface SidebarAdProps {
  className?: string
  onUpgradeClick?: () => void
}

export function SidebarAd({ className = '', onUpgradeClick }: SidebarAdProps) {
  const { user } = useAuth()
  const { data: userData } = useUser(user?.id)
  const { isAdBlockerDetected, trackAdImpression } = useAds()
  
  // Don't show ads to Pro users
  const isProUser = userData?.is_pro || false
  
  useEffect(() => {
    if (isProUser) return
    trackAdImpression('sidebar')
  }, [isProUser, trackAdImpression])

  // Don't render anything for Pro users
  if (isProUser) return null

  // Show ad blocker message
  if (isAdBlockerDetected) {
    return (
      <Card className={`bg-yellow-50 border-yellow-200 ${className}`}>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Crown className="h-4 w-4 text-yellow-600" />
            <span className="text-sm font-medium text-yellow-800">
              Go Ad-Free
            </span>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-xs text-yellow-600 mb-3">
            Upgrade to Pro for uninterrupted focus
          </p>
          <Button 
            onClick={onUpgradeClick}
            size="sm"
            className="w-full bg-yellow-600 hover:bg-yellow-700"
          >
            Upgrade Now
          </Button>
        </CardContent>
      </Card>
    )
  }

  // Demo sidebar ads (cycling through different types)
  const demoAds = [
    {
      icon: <Target className="h-6 w-6 text-green-500" />,
      title: "FocusTime Pro",
      description: "Advanced time tracking for professionals",
      cta: "Try Free",
      color: "green"
    },
    {
      icon: <Zap className="h-6 w-6 text-blue-500" />,
      title: "MindfulBreaks",
      description: "Guided meditation during work breaks",
      cta: "Start Now",
      color: "blue"
    },
    {
      icon: <Crown className="h-6 w-6 text-purple-500" />,
      title: "ProductivityPro",
      description: "Complete productivity suite",
      cta: "Learn More",
      color: "purple"
    }
  ]

  const [currentAdIndex, setCurrentAdIndex] = useState(0)
  const currentAd = demoAds[currentAdIndex]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAdIndex((prev) => (prev + 1) % demoAds.length)
    }, 10000) // Rotate ads every 10 seconds

    return () => clearInterval(interval)
  }, [demoAds.length])

  return (
    <Card className={`relative overflow-hidden ${className}`}>
      <div className="absolute top-2 right-2">
        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
          AD
        </span>
      </div>
      
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          {currentAd.icon}
          <div>
            <h4 className="text-sm font-semibold">{currentAd.title}</h4>
            <p className="text-xs text-muted-foreground">
              {currentAd.description}
            </p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <Button
            size="sm"
            variant="outline"
            className={`text-${currentAd.color}-600 border-${currentAd.color}-200 hover:bg-${currentAd.color}-50`}
          >
            {currentAd.cta}
          </Button>
          <Button
            onClick={onUpgradeClick}
            size="sm"
            variant="ghost"
            className="text-xs text-muted-foreground"
          >
            <Crown className="h-3 w-3 mr-1" />
            Remove Ads
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}