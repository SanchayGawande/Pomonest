'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useUser } from '@/lib/queries'
import { useAds } from './AdProvider'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Crown, Coffee, X, Clock } from 'lucide-react'

interface InterstitialAdProps {
  isOpen: boolean
  onClose: () => void
  onUpgradeClick?: () => void
  duration?: number // Duration in seconds before skip button appears
}

export function InterstitialAd({ 
  isOpen, 
  onClose, 
  onUpgradeClick,
  duration = 5 
}: InterstitialAdProps) {
  const { user } = useAuth()
  const { data: userData } = useUser(user?.id)
  const { trackAdImpression, trackAdClick } = useAds()
  const [countdown, setCountdown] = useState(duration)
  const [canSkip, setCanSkip] = useState(false)

  // Don't show ads to Pro users
  const isProUser = userData?.is_pro || false

  useEffect(() => {
    if (isOpen && !isProUser) {
      trackAdImpression('interstitial')
      setCountdown(duration)
      setCanSkip(false)

      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setCanSkip(true)
            clearInterval(timer)
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [isOpen, isProUser, duration, trackAdImpression])

  // Don't render for Pro users
  if (isProUser) return null

  const handleAdClick = () => {
    trackAdClick('interstitial')
    // In real implementation, this would open the advertiser's link
    console.log('Interstitial ad clicked')
  }

  const handleUpgrade = () => {
    onUpgradeClick?.()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Coffee className="h-5 w-5 text-blue-500" />
            Break Time Sponsor
          </DialogTitle>
          <DialogDescription>
            Support PomoNest by viewing this brief sponsored message.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Demo Ad Content */}
          <Card 
            className="cursor-pointer transition-transform hover:scale-105 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200"
            onClick={handleAdClick}
          >
            <CardContent className="p-6 text-center">
              <div className="mb-4">
                <div className="w-16 h-16 bg-blue-500 rounded-full mx-auto flex items-center justify-center mb-3">
                  <Coffee className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-blue-900 mb-2">
                  MindfulBreaks Premium
                </h3>
                <p className="text-sm text-blue-700 mb-4">
                  Guided meditation and breathing exercises designed for your work breaks. 
                  Reduce stress and boost focus.
                </p>
                <div className="bg-blue-100 rounded-lg p-3 mb-4">
                  <p className="text-xs text-blue-800 font-medium">
                    ✨ Special Offer: 30% off first month
                  </p>
                </div>
              </div>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                Try MindfulBreaks Free
              </Button>
            </CardContent>
          </Card>

          {/* Skip/Close Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {!canSkip && (
                <>
                  <Clock className="h-4 w-4" />
                  <span>Skip in {countdown}s</span>
                </>
              )}
            </div>
            
            <div className="flex gap-2">
              <Button
                onClick={handleUpgrade}
                variant="outline"
                size="sm"
                className="text-xs"
              >
                <Crown className="h-3 w-3 mr-1" />
                Go Ad-Free
              </Button>
              
              {canSkip && (
                <Button
                  onClick={onClose}
                  variant="ghost"
                  size="sm"
                  className="text-xs"
                >
                  <X className="h-3 w-3 mr-1" />
                  Continue Break
                </Button>
              )}
            </div>
          </div>

          {/* Pro Upgrade Hint */}
          <div className="text-center bg-yellow-50 rounded-lg p-3 border border-yellow-200">
            <p className="text-xs text-yellow-800">
              💡 <strong>PomoNest Pro</strong> removes all ads for uninterrupted focus sessions
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}