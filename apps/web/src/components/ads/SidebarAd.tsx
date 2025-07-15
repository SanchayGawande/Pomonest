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

  // Don't show any placeholder ads - only real AdSense when available
  return null
}