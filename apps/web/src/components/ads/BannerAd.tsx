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

  // Demo ad (replace with real AdSense when approved)
  if (!process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID) {
    return (
      <Card className={`relative bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 ${className}`}>
        <div className="flex items-center justify-between p-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">AD</span>
              </div>
              <div>
                <p className="text-sm font-medium text-blue-800">
                  Focus App - Boost Your Productivity
                </p>
                <p className="text-xs text-blue-600">
                  Try our recommended productivity tools
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              onClick={onUpgradeClick}
              size="sm"
              variant="outline"
              className="text-xs"
            >
              <Crown className="h-3 w-3 mr-1" />
              Remove Ads
            </Button>
            <Button
              onClick={() => setIsVisible(false)}
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </Card>
    )
  }

  // Real AdSense implementation
  return (
    <div className={`text-center ${className}`} ref={adRef}>
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