'use client'

import { useEffect, useRef } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useUser } from '@/lib/queries'
import { useAds } from './AdProvider'

declare global {
  interface Window {
    adsbygoogle?: any[]
  }
}

interface GoogleAdProps {
  slot: string
  format?: 'auto' | 'rectangle' | 'vertical' | 'horizontal'
  style?: React.CSSProperties
  className?: string
  responsive?: boolean
}

export function GoogleAd({ 
  slot, 
  format = 'auto',
  style = {},
  className = '',
  responsive = true 
}: GoogleAdProps) {
  const { user } = useAuth()
  const { data: userData } = useUser(user?.id)
  const { trackAdImpression } = useAds()
  const adRef = useRef<HTMLModElement>(null)
  const initialized = useRef(false)

  // Don't show ads to Pro users
  const isProUser = userData?.is_pro || false
  
  useEffect(() => {
    if (isProUser || !process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || initialized.current) {
      return
    }

    const timer = setTimeout(() => {
      try {
        if (window.adsbygoogle && adRef.current) {
          window.adsbygoogle.push({})
          trackAdImpression('banner')
          initialized.current = true
        }
      } catch (error) {
        console.error('AdSense error:', error)
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [isProUser, trackAdImpression])

  // Don't render for Pro users
  if (isProUser || !process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID) {
    return null
  }

  return (
    <div className={`text-center ${className}`} style={style}>
      <div className="text-xs text-gray-500 mb-1">Advertisement</div>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ 
          display: 'block',
          ...style
        }}
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? "true" : "false"}
      />
    </div>
  )
}

// Auto Ads component for automatic ad placement
export function GoogleAutoAds() {
  const { user } = useAuth()
  const { data: userData } = useUser(user?.id)
  const initialized = useRef(false)

  // Don't show ads to Pro users
  const isProUser = userData?.is_pro || false

  useEffect(() => {
    if (isProUser || !process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || initialized.current) {
      return
    }

    const timer = setTimeout(() => {
      try {
        if (window.adsbygoogle) {
          window.adsbygoogle.push({
            google_ad_client: process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID,
            enable_page_level_ads: true
          })
          initialized.current = true
        }
      } catch (error) {
        console.error('Auto Ads error:', error)
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [isProUser])

  return null
}

// Responsive Ad component with different sizes
interface ResponsiveAdProps {
  slot: string
  className?: string
}

export function ResponsiveAd({ slot, className = '' }: ResponsiveAdProps) {
  return (
    <GoogleAd
      slot={slot}
      format="auto"
      responsive={true}
      className={className}
      style={{
        minHeight: '90px',
        minWidth: '320px'
      }}
    />
  )
}

// In-article Ad component
export function InArticleAd({ slot, className = '' }: ResponsiveAdProps) {
  return (
    <GoogleAd
      slot={slot}
      format="auto"
      responsive={true}
      className={className}
      style={{
        display: 'block',
        textAlign: 'center'
      }}
    />
  )
}