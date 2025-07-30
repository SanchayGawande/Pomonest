'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { analytics, initializeAnalytics } from '@/lib/analytics'
import { useAuth } from '@/hooks/useAuth'

type AdContextType = {
  isAdBlockerDetected: boolean
  adRevenue: number
  trackAdImpression: (adType: 'banner' | 'sidebar' | 'interstitial') => void
  trackAdClick: (adType: 'banner' | 'sidebar' | 'interstitial') => void
  getAdMetrics: () => any
}

const AdContext = createContext<AdContextType | undefined>(undefined)

export function AdProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [isAdBlockerDetected, setIsAdBlockerDetected] = useState(false)
  const [adRevenue, setAdRevenue] = useState(0)

  useEffect(() => {
    // Initialize analytics
    initializeAnalytics()

    // Ad blocker detection disabled to comply with AdSense policies
    // Always set to false
    setIsAdBlockerDetected(false)
  }, [user?.id])

  const trackAdImpression = (adType: 'banner' | 'sidebar' | 'interstitial') => {
    analytics.trackAdImpression(adType, user?.id)
    // Update local revenue for UI
    setAdRevenue(analytics.getTotalAdRevenue())
  }

  const trackAdClick = (adType: 'banner' | 'sidebar' | 'interstitial') => {
    analytics.trackAdClick(adType, user?.id)
    // Update local revenue for UI
    setAdRevenue(analytics.getTotalAdRevenue())
  }

  const getAdMetrics = () => {
    return analytics.getAdMetrics()
  }

  return (
    <AdContext.Provider value={{
      isAdBlockerDetected,
      adRevenue,
      trackAdImpression,
      trackAdClick,
      getAdMetrics
    }}>
      {children}
    </AdContext.Provider>
  )
}

export const useAds = () => {
  const context = useContext(AdContext)
  if (context === undefined) {
    throw new Error('useAds must be used within an AdProvider')
  }
  return context
}