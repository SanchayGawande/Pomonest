'use client'

import { useAuth } from '@/hooks/useAuth'
import { useUser } from '@/lib/queries'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { BannerAd } from './BannerAd'
import { SidebarAd } from './SidebarAd'
import { GoogleAd, GoogleAutoAds, ResponsiveAd } from './GoogleAd'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Crown } from 'lucide-react'

interface AdManagerProps {
  placement: 'header' | 'sidebar' | 'footer' | 'inline' | 'modal'
  adSlot?: string
  onUpgradeClick?: () => void
  className?: string
}

export function AdManager({ 
  placement, 
  adSlot,
  onUpgradeClick,
  className = '' 
}: AdManagerProps) {
  const { user } = useAuth()
  const { data: userData } = useUser(user?.id)
  const [isProUser, setIsProUser] = useState(false)

  // Check Pro status using the same method as page.tsx
  useEffect(() => {
    const checkProStatus = async () => {
      if (!user) {
        setIsProUser(false)
        return
      }

      try {
        // Get auth token from localStorage (CleanAuthProvider stores it there)
        const authToken = localStorage.getItem('auth_token')
        if (!authToken) {
          // Fallback to userData if no auth token
          setIsProUser(userData?.is_pro || false)
          return
        }

        // Check Pro status via API
        const response = await fetch('/api/check-pro-status', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${authToken}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
          setIsProUser(data.isProUser || false)
        } else {
          // Fallback to userData
          setIsProUser(userData?.is_pro || false)
        }
      } catch (error) {
        console.error('AdManager Pro status check failed:', error)
        // Fallback to userData
        setIsProUser(userData?.is_pro || false)
      }
    }

    checkProStatus()
  }, [user, userData?.is_pro])
  
  if (isProUser) return null

  // Show different ads based on placement
  switch (placement) {
    case 'header':
      return (
        <div className={`w-full ${className}`}>
          {adSlot ? (
            <ResponsiveAd slot={adSlot} className="mb-4" />
          ) : (
            <BannerAd 
              slot="header-banner" 
              onUpgradeClick={onUpgradeClick}
              className="mb-4"
            />
          )}
        </div>
      )

    case 'sidebar':
      return (
        <div className={`w-full ${className}`}>
          {adSlot ? (
            <GoogleAd 
              slot={adSlot} 
              format="vertical"
              style={{ minHeight: '250px', minWidth: '200px' }}
            />
          ) : (
            <SidebarAd onUpgradeClick={onUpgradeClick} />
          )}
        </div>
      )

    case 'footer':
      return (
        <div className={`w-full ${className}`}>
          {adSlot && (
            <ResponsiveAd slot={adSlot} />
          )}
        </div>
      )

    case 'inline':
      return (
        <div className={`w-full my-4 ${className}`}>
          {adSlot ? (
            <GoogleAd 
              slot={adSlot} 
              format="rectangle"
              style={{ 
                minHeight: '250px', 
                minWidth: '300px',
                margin: '0 auto' 
              }}
            />
          ) : (
            <Card className="p-6 bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Crown className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-green-800 mb-2">
                  Unlock Premium Focus
                </h3>
                <p className="text-sm text-green-600 mb-4">
                  Get ad-free sessions, advanced themes, and productivity insights
                </p>
                <Button 
                  onClick={onUpgradeClick}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Start Pro Trial
                </Button>
              </div>
            </Card>
          )}
        </div>
      )

    case 'modal':
      return (
        <div className={`w-full ${className}`}>
          {adSlot ? (
            <GoogleAd 
              slot={adSlot} 
              format="rectangle"
              style={{ minHeight: '200px', minWidth: '300px' }}
            />
          ) : (
            <Card className="p-4 bg-yellow-50 border-yellow-200">
              <div className="text-center">
                <Crown className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-yellow-800 mb-2">
                  Remove interruptions
                </p>
                <p className="text-xs text-yellow-600 mb-3">
                  Upgrade to Pro for uninterrupted focus sessions
                </p>
                <Button 
                  onClick={onUpgradeClick}
                  size="sm"
                  className="bg-yellow-600 hover:bg-yellow-700"
                >
                  Upgrade Now
                </Button>
              </div>
            </Card>
          )}
        </div>
      )

    default:
      return null
  }
}

// Auto Ads for the entire app
export function AppAutoAds() {
  return <GoogleAutoAds />
}

// Smart Ad Placement Hook
export function useAdPlacement() {
  const { user } = useAuth()
  const { data: userData } = useUser(user?.id)
  const [isProUser, setIsProUser] = useState(false)

  // Check Pro status using the same method as page.tsx
  useEffect(() => {
    const checkProStatus = async () => {
      if (!user) {
        setIsProUser(false)
        return
      }

      try {
        // Get auth token from localStorage (CleanAuthProvider stores it there)
        const authToken = localStorage.getItem('auth_token')
        if (!authToken) {
          // Fallback to userData if no auth token
          setIsProUser(userData?.is_pro || false)
          return
        }

        // Check Pro status via API
        const response = await fetch('/api/check-pro-status', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${authToken}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
          setIsProUser(data.isProUser || false)
        } else {
          // Fallback to userData
          setIsProUser(userData?.is_pro || false)
        }
      } catch (error) {
        console.error('useAdPlacement Pro status check failed:', error)
        // Fallback to userData
        setIsProUser(userData?.is_pro || false)
      }
    }

    checkProStatus()
  }, [user, userData?.is_pro])
  
  return {
    shouldShowAds: !isProUser && process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID,
    isProUser,
    AdManager
  }
}