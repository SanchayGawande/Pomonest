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

    // Simple ad blocker detection
    const testAd = document.createElement('div')
    testAd.innerHTML = '&nbsp;'
    testAd.className = 'adsbox ads ad-container'
    testAd.style.position = 'absolute'
    testAd.style.left = '-10000px'
    document.body.appendChild(testAd)

    setTimeout(() => {
      if (testAd.offsetHeight === 0) {
        setIsAdBlockerDetected(true)
        analytics.trackAdBlockerDetected(user?.id)
      }
      try {
        document.body.removeChild(testAd)
      } catch (e) {
        // Element might already be removed
      }
    }, 100)
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