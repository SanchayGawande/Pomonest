'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useUser } from '@/lib/queries'
import { useAds } from './AdProvider'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Crown, Coffee, X } from 'lucide-react'

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
  const { trackAdImpression } = useAds()

  // Don't show ads to Pro users
  const isProUser = userData?.is_pro || false

  useEffect(() => {
    if (isOpen && !isProUser) {
      trackAdImpression('interstitial')
    }
  }, [isOpen, isProUser, trackAdImpression])

  // Don't render for Pro users
  if (isProUser) return null

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
          {/* Ad Space - Replace with actual Google AdSense ad */}
          <div>
            <div className="text-xs text-gray-500 mb-1 text-center">Advertisement</div>
            <div className="min-h-[250px] bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
              {/* This space should contain your actual Google AdSense ad unit */}
              <p className="text-sm">Ad space - Add your AdSense ad unit here</p>
            </div>
          </div>

          {/* Close Controls */}
          <div className="flex items-center justify-end gap-2">
            <Button
              onClick={handleUpgrade}
              variant="outline"
              size="sm"
              className="text-xs"
            >
              <Crown className="h-3 w-3 mr-1" />
              Go Ad-Free
            </Button>
            
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="text-xs"
            >
              <X className="h-3 w-3 mr-1" />
              Continue Break
            </Button>
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