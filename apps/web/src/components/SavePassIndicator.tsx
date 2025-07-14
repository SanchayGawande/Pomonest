'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ProUpgradeModal } from '@/components/ProUpgradeModal'
import { Shield, Crown, Star, AlertTriangle } from 'lucide-react'

interface SavePassIndicatorProps {
  savePasses: number | null
  isProUser: boolean
  savePassUsedToday?: boolean
  className?: string
}

export function SavePassIndicator({ 
  savePasses, 
  isProUser, 
  savePassUsedToday = false,
  className = ''
}: SavePassIndicatorProps) {
  const [showProModal, setShowProModal] = useState(false)

  // Non-Pro users see upgrade prompt
  if (!isProUser) {
    return (
      <>
        <Card className={`border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50 dark:border-yellow-800 dark:from-yellow-950 dark:to-orange-950 ${className}`}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200 text-base">
              <Shield className="h-5 w-5" />
              Save Pass Protection
            </CardTitle>
            <CardDescription className="text-yellow-700 dark:text-yellow-300">
              Protect your streak from missed days
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-yellow-700 dark:text-yellow-300">
              <Star className="h-4 w-4" />
              <span>Never lose your progress again</span>
            </div>
            <Button 
              onClick={() => setShowProModal(true)}
              size="sm"
              className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white"
            >
              <Crown className="h-4 w-4 mr-2" />
              Get Save Passes
            </Button>
          </CardContent>
        </Card>
        
        <ProUpgradeModal 
          isOpen={showProModal}
          onClose={() => setShowProModal(false)}
        />
      </>
    )
  }

  // Pro users with save passes
  if (savePasses !== null && savePasses > 0) {
    return (
      <Card className={`border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 dark:border-green-800 dark:from-green-950 dark:to-emerald-950 ${className}`}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-green-800 dark:text-green-200 text-base">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Save Passes
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              {savePasses} left
            </Badge>
          </CardTitle>
          {savePassUsedToday && (
            <CardDescription className="text-green-700 dark:text-green-300">
              ⭐ Save Pass used today - your streak is protected!
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-green-700 dark:text-green-300">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span>Your streak is protected from missed days</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span>Automatically used when needed</span>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Pro users with no save passes
  if (savePasses !== null && savePasses === 0) {
    return (
      <Card className={`border-orange-200 bg-gradient-to-r from-orange-50 to-red-50 dark:border-orange-800 dark:from-orange-950 dark:to-red-950 ${className}`}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-orange-800 dark:text-orange-200 text-base">
            <AlertTriangle className="h-5 w-5" />
            No Save Passes Left
          </CardTitle>
          <CardDescription className="text-orange-700 dark:text-orange-300">
            Your streak is vulnerable to missed days
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm text-orange-700 dark:text-orange-300">
            <p>You've used all your Save Passes. Get more to keep protecting your streak!</p>
          </div>
          <Button 
            onClick={() => setShowProModal(true)}
            size="sm"
            variant="outline"
            className="w-full border-orange-300 text-orange-700 hover:bg-orange-100 dark:border-orange-700 dark:text-orange-300 dark:hover:bg-orange-900"
          >
            <Crown className="h-4 w-4 mr-2" />
            Get More Save Passes
          </Button>
        </CardContent>
      </Card>
    )
  }

  // Pro users but save passes data not loaded yet
  return (
    <Card className={`border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950 ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-blue-800 dark:text-blue-200 text-base">
          <Shield className="h-5 w-5" />
          Save Passes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-blue-700 dark:text-blue-300">
          Loading your Save Pass status...
        </div>
      </CardContent>
    </Card>
  )
}