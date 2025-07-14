'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useUser } from '@/lib/queries'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Shield, Crown, AlertTriangle } from 'lucide-react'

interface AdBlockerDetectorProps {
  onUpgradeClick?: () => void
  className?: string
}

export function AdBlockerDetector({ onUpgradeClick, className = '' }: AdBlockerDetectorProps) {
  const { user } = useAuth()
  const { data: userData } = useUser(user?.id)
  const [isAdBlockerDetected, setIsAdBlockerDetected] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  const isProUser = userData?.is_pro || false

  useEffect(() => {
    if (isProUser) return

    const detectAdBlocker = () => {
      // Method 1: Test element removal
      const testAd = document.createElement('div')
      testAd.innerHTML = '&nbsp;'
      testAd.className = 'adsbox ads ad-container'
      testAd.style.position = 'absolute'
      testAd.style.left = '-10000px'
      testAd.style.top = '0'
      testAd.style.width = '1px'
      testAd.style.height = '1px'
      document.body.appendChild(testAd)

      setTimeout(() => {
        try {
          if (testAd.offsetHeight === 0 || testAd.style.display === 'none') {
            setIsAdBlockerDetected(true)
          }
          document.body.removeChild(testAd)
        } catch (e) {
          // Element might already be removed by ad blocker
          setIsAdBlockerDetected(true)
        }
      }, 100)

      // Method 2: Check for common ad blocker properties
      const adBlockerTest = () => {
        if (typeof window !== 'undefined') {
          // Check for common ad blocker indicators
          if (
            window.navigator.userAgent.includes('AdBlock') ||
            // @ts-ignore
            window.uBlockOrigin ||
            // @ts-ignore
            window.adblockplus ||
            // @ts-ignore
            document.getElementById('AdBanner') === null
          ) {
            setIsAdBlockerDetected(true)
          }
        }
      }

      adBlockerTest()
    }

    // Small delay to let page load
    const timer = setTimeout(detectAdBlocker, 500)
    return () => clearTimeout(timer)
  }, [isProUser])

  // Don't show for Pro users or if dismissed
  if (isProUser || !isAdBlockerDetected || isDismissed) {
    return null
  }

  return (
    <Alert className={`border-orange-200 bg-orange-50 ${className}`}>
      <AlertTriangle className="h-4 w-4 text-orange-600" />
      <AlertDescription className="flex items-center justify-between w-full">
        <div className="flex-1">
          <p className="text-sm font-medium text-orange-800 mb-1">
            Ad Blocker Detected
          </p>
          <p className="text-xs text-orange-600">
            We rely on ads to keep WorkStreak free. Consider upgrading to Pro for an ad-free experience 
            or whitelist our site to support development.
          </p>
        </div>
        <div className="flex items-center gap-2 ml-4">
          <Button
            onClick={onUpgradeClick}
            size="sm"
            className="bg-orange-600 hover:bg-orange-700 text-white"
          >
            <Crown className="h-3 w-3 mr-1" />
            Go Pro
          </Button>
          <Button
            onClick={() => setIsDismissed(true)}
            variant="ghost"
            size="sm"
            className="text-orange-600 hover:text-orange-700"
          >
            Dismiss
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  )
}