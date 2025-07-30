'use client'

import { useEffect, useRef, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useUser } from '@/lib/queries'
import { useAds } from './AdProvider'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { X, Crown } from 'lucide-react'

declare global {
  interface Window {
    adsbygoogle?: any[]
  }
}

interface BannerAdProps {
  slot: string
  width?: number
  height?: number
  className?: string
  onUpgradeClick?: () => void
}

export function BannerAd({ 
  slot, 
  width = 728, 
  height = 90, 
  className = '',
  onUpgradeClick 
}: BannerAdProps) {
  const { user } = useAuth()
  const { data: userData } = useUser(user?.id)
  const { isAdBlockerDetected, trackAdImpression } = useAds()
  const adRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(true)

  // Don't show ads to Pro users
  const isProUser = userData?.is_pro || false
  
  useEffect(() => {
    if (isProUser || !isVisible) return

    // Track impression
    trackAdImpression('banner')

    // Initialize AdSense (demo implementation)
    if (process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID && window.adsbygoogle) {
      try {
        window.adsbygoogle.push({})
      } catch (error) {
        console.error('AdSense error:', error)
      }
    }
  }, [isProUser, isVisible, trackAdImpression])

  // Don't render anything for Pro users
  if (isProUser) return null

  // Show ad blocker message
  if (isAdBlockerDetected) {
    return (
      <Card className={`p-4 bg-yellow-50 border-yellow-200 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-yellow-600">
              <Crown className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-yellow-800">
                Ad blocker detected
              </p>
              <p className="text-xs text-yellow-600">
                Consider upgrading to Pro for an ad-free experience
              </p>
            </div>
          </div>
          <Button 
            onClick={onUpgradeClick}
            size="sm"
            className="bg-yellow-600 hover:bg-yellow-700"
          >
            Upgrade to Pro
          </Button>
        </div>
      </Card>
    )
  }

  // Don't show any placeholder ads - only real AdSense when available
  if (!process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID) {
    return null
  }

  // Real AdSense implementation
  return (
    <div className={`text-center ${className}`} ref={adRef}>
      <div className="text-xs text-gray-500 mb-1">Advertisement</div>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  )
}