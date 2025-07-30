'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { X, Settings, Shield } from 'lucide-react'

interface CookieConsent {
  necessary: boolean
  analytics: boolean
  advertising: boolean
  functional: boolean
}

interface CookieConsentBannerProps {
  onConsentChange?: (consent: CookieConsent) => void
}

const COOKIE_CONSENT_KEY = 'pomonest_cookie_consent'
const COOKIE_BANNER_DISMISSED_KEY = 'pomonest_cookie_banner_dismissed'

export function CookieConsentBanner({ onConsentChange }: CookieConsentBannerProps) {
  const [showBanner, setShowBanner] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [consent, setConsent] = useState<CookieConsent>({
    necessary: true, // Always required
    analytics: false,
    advertising: false,
    functional: false
  })

  useEffect(() => {
    // Check if user has already given consent
    const existingConsent = localStorage.getItem(COOKIE_CONSENT_KEY)
    const bannerDismissed = localStorage.getItem(COOKIE_BANNER_DISMISSED_KEY)
    
    if (!existingConsent && !bannerDismissed) {
      setShowBanner(true)
    } else if (existingConsent) {
      try {
        const parsedConsent = JSON.parse(existingConsent)
        setConsent(parsedConsent)
        onConsentChange?.(parsedConsent)
      } catch (e) {
        // Invalid stored consent, show banner again
        setShowBanner(true)
      }
    }
  }, [onConsentChange])

  const handleAcceptAll = () => {
    const fullConsent: CookieConsent = {
      necessary: true,
      analytics: true,
      advertising: true,
      functional: true
    }
    saveConsent(fullConsent)
  }

  const handleAcceptSelected = () => {
    saveConsent(consent)
  }

  const handleRejectAll = () => {
    const minimalConsent: CookieConsent = {
      necessary: true,
      analytics: false,
      advertising: false,
      functional: false
    }
    saveConsent(minimalConsent)
  }

  const saveConsent = (consentData: CookieConsent) => {
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consentData))
    localStorage.setItem(COOKIE_BANNER_DISMISSED_KEY, 'true')
    setConsent(consentData)
    setShowBanner(false)
    setShowSettings(false)
    onConsentChange?.(consentData)
  }

  const handleConsentChange = (category: keyof CookieConsent, value: boolean) => {
    if (category === 'necessary') return // Can't disable necessary cookies
    
    setConsent(prev => ({
      ...prev,
      [category]: value
    }))
  }

  if (!showBanner) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white/95 backdrop-blur-sm border-t shadow-lg">
      <div className="container max-w-4xl mx-auto">
        {!showSettings ? (
          // Main banner
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold text-gray-900">Cookie Consent</h3>
              </div>
              <p className="text-sm text-gray-600">
                We use cookies to enhance your experience, serve personalized ads, and analyze our traffic. 
                By clicking "Accept All", you consent to our use of cookies.{' '}
                <a href="/privacy" className="text-blue-600 hover:underline">
                  Read our Privacy Policy
                </a>
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                onClick={() => setShowSettings(true)}
                variant="outline"
                size="sm"
                className="text-xs"
              >
                <Settings className="h-3 w-3 mr-1" />
                Settings
              </Button>
              <Button
                onClick={handleRejectAll}
                variant="outline"
                size="sm"
                className="text-xs"
              >
                Reject All
              </Button>
              <Button
                onClick={handleAcceptAll}
                size="sm"
                className="text-xs bg-blue-600 hover:bg-blue-700"
              >
                Accept All
              </Button>
            </div>
          </div>
        ) : (
          // Settings panel
          <Card className="w-full">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Cookie Settings</CardTitle>
                <Button
                  onClick={() => setShowSettings(false)}
                  variant="ghost"
                  size="sm"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                {/* Necessary Cookies */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">Necessary Cookies</h4>
                    <p className="text-sm text-gray-600">
                      Essential for the website to function properly. Cannot be disabled.
                    </p>
                  </div>
                  <Switch checked={true} disabled />
                </div>

                {/* Analytics Cookies */}
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">Analytics Cookies</h4>
                    <p className="text-sm text-gray-600">
                      Help us understand how visitors interact with our website.
                    </p>
                  </div>
                  <Switch 
                    checked={consent.analytics}
                    onCheckedChange={(checked) => handleConsentChange('analytics', checked)}
                  />
                </div>

                {/* Advertising Cookies */}
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">Advertising Cookies</h4>
                    <p className="text-sm text-gray-600">
                      Used to show you relevant ads based on your interests.
                    </p>
                  </div>
                  <Switch 
                    checked={consent.advertising}
                    onCheckedChange={(checked) => handleConsentChange('advertising', checked)}
                  />
                </div>

                {/* Functional Cookies */}
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">Functional Cookies</h4>
                    <p className="text-sm text-gray-600">
                      Enable enhanced functionality like preferences and settings.
                    </p>
                  </div>
                  <Switch 
                    checked={consent.functional}
                    onCheckedChange={(checked) => handleConsentChange('functional', checked)}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  onClick={handleRejectAll}
                  variant="outline"
                  size="sm"
                >
                  Reject All
                </Button>
                <Button
                  onClick={handleAcceptSelected}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Save Preferences
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

// Hook to get current cookie consent
export function useCookieConsent() {
  const [consent, setConsent] = useState<CookieConsent | null>(null)

  useEffect(() => {
    const storedConsent = localStorage.getItem(COOKIE_CONSENT_KEY)
    if (storedConsent) {
      try {
        setConsent(JSON.parse(storedConsent))
      } catch (e) {
        setConsent(null)
      }
    }
  }, [])

  return consent
}

// Utility functions for checking specific consent
export const hasAnalyticsConsent = (): boolean => {
  const consent = localStorage.getItem(COOKIE_CONSENT_KEY)
  if (!consent) return false
  try {
    const parsed = JSON.parse(consent)
    return parsed.analytics === true
  } catch {
    return false
  }
}

export const hasAdvertisingConsent = (): boolean => {
  const consent = localStorage.getItem(COOKIE_CONSENT_KEY)
  if (!consent) return false
  try {
    const parsed = JSON.parse(consent)
    return parsed.advertising === true
  } catch {
    return false
  }
}

export const hasFunctionalConsent = (): boolean => {
  const consent = localStorage.getItem(COOKIE_CONSENT_KEY)
  if (!consent) return false
  try {
    const parsed = JSON.parse(consent)
    return parsed.functional === true
  } catch {
    return false
  }
}