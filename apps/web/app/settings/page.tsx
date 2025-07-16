'use client'

import { useState, useEffect } from 'react'

export const dynamic = 'force-dynamic'
export const revalidate = 0
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useUser } from '@/lib/queries'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ProUpgradeModal } from '@/components/ProUpgradeModal'
import { NotificationSettings } from '@/components/NotificationSettings'
import { ThemeToggle } from '@/components/ThemeToggle'
import { ArrowLeft, Crown, User, Bell, Palette, Moon } from 'lucide-react'

export default function SettingsPage() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const { data: userData } = useUser(user?.id)
  const [showProModal, setShowProModal] = useState(false)
  const [isClient, setIsClient] = useState(false)
  
  const isProUser = userData?.is_pro || false

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (isClient && !user) {
      router.push('/login')
    }
  }, [user, router, isClient])

  if (!isClient || !user) {
    return <div className="min-h-screen bg-gradient-to-br from-background to-muted/50 flex items-center justify-center">
      <div className="text-center">Loading...</div>
    </div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/50">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => router.push('/')}
              className="min-h-[44px] touch-manipulation"
            >
              <ArrowLeft className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Back to Timer</span>
            </Button>
            <h1 className="text-lg sm:text-2xl font-semibold">
              Settings
            </h1>
          </div>
          <Button 
            onClick={signOut} 
            variant="outline" 
            size="sm"
            className="min-h-[44px] touch-manipulation"
          >
            <span className="text-sm">Sign Out</span>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-4 sm:py-8 max-w-2xl">
        <div className="space-y-6">
          {/* Profile Section */}
          <Card className="border border-gray-200 dark:border-gray-700">
            <CardHeader className="border-b border-gray-100 dark:border-gray-700">
              <CardTitle className="flex items-center gap-3 text-lg">
                <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <User className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </div>
                Profile
              </CardTitle>
              <CardDescription>
                Manage your account information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 p-4 sm:p-6">
              <div className="p-3 sm:p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <label className="text-sm font-medium">Email</label>
                <p className="text-sm text-muted-foreground mt-1 break-all">{user.email}</p>
              </div>
              <div className="p-3 sm:p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <label className="text-sm font-medium">Member since</label>
                <p className="text-sm text-muted-foreground mt-1">
                  {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Pro Upgrade Section */}
          <Card className="relative overflow-hidden border-2 border-yellow-200 bg-gradient-to-br from-yellow-50 via-orange-50 to-yellow-100 dark:border-yellow-700/50 dark:from-yellow-950/70 dark:via-orange-950/70 dark:to-yellow-900/70 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 to-orange-400/10 dark:from-yellow-400/5 dark:to-orange-400/5" />
            <CardHeader className="relative z-10">
              <CardTitle className="flex items-center gap-2 text-yellow-900 dark:text-yellow-100">
                <div className="p-2 bg-yellow-200 dark:bg-yellow-800 rounded-lg">
                  <Crown className="h-5 w-5 text-yellow-700 dark:text-yellow-200" />
                </div>
                WorkStreak Pro
              </CardTitle>
              <CardDescription className="text-yellow-800 dark:text-yellow-300 font-medium">
                Remove all ads and unlock premium features for distraction-free focus
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10 p-4 sm:p-6">
              <div className="space-y-4 sm:space-y-6">
                <div className="grid gap-2 sm:gap-3 text-sm">
                  <div className="flex items-center gap-3 p-2 sm:p-3 rounded-lg bg-white/50 dark:bg-black/20">
                    <div className="w-2 h-2 bg-yellow-600 dark:bg-yellow-400 rounded-full animate-pulse flex-shrink-0" />
                    <span className="font-semibold text-yellow-900 dark:text-yellow-100">🚫 Ad-free experience</span>
                  </div>
                  <div className="flex items-center gap-3 p-2 sm:p-3 rounded-lg bg-white/30 dark:bg-black/10">
                    <div className="w-2 h-2 bg-yellow-600 dark:bg-yellow-400 rounded-full flex-shrink-0" />
                    <span className="font-medium text-yellow-800 dark:text-yellow-200">Save Passes to protect your streaks</span>
                  </div>
                  <div className="flex items-center gap-3 p-2 sm:p-3 rounded-lg bg-white/30 dark:bg-black/10">
                    <div className="w-2 h-2 bg-yellow-600 dark:bg-yellow-400 rounded-full flex-shrink-0" />
                    <span className="font-medium text-yellow-800 dark:text-yellow-200">Dark mode theme</span>
                  </div>
                  <div className="flex items-center gap-3 p-2 sm:p-3 rounded-lg bg-white/30 dark:bg-black/10">
                    <div className="w-2 h-2 bg-yellow-600 dark:bg-yellow-400 rounded-full flex-shrink-0" />
                    <span className="font-medium text-yellow-800 dark:text-yellow-200">Advanced statistics and insights</span>
                  </div>
                  <div className="flex items-center gap-3 p-2 sm:p-3 rounded-lg bg-white/30 dark:bg-black/10">
                    <div className="w-2 h-2 bg-yellow-600 dark:bg-yellow-400 rounded-full flex-shrink-0" />
                    <span className="font-medium text-yellow-800 dark:text-yellow-200">Priority customer support</span>
                  </div>
                </div>
                <Button 
                  onClick={() => setShowProModal(true)}
                  className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-white font-semibold min-h-[48px] touch-manipulation"
                  size="lg"
                >
                  <Crown className="h-5 w-5 mr-2" />
                  Upgrade to Pro
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Notifications Section */}
          <NotificationSettings />

          {/* Appearance Section */}
          <Card className="border border-gray-200 dark:border-gray-700">
            <CardHeader className="border-b border-gray-100 dark:border-gray-700">
              <CardTitle className="flex items-center gap-3 text-lg">
                <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <Palette className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </div>
                Appearance
              </CardTitle>
              <CardDescription>
                Customize your app appearance
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 border border-gray-200 dark:border-gray-700 rounded-lg gap-3 sm:gap-0">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg flex-shrink-0">
                      {isProUser ? (
                        <Moon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                      ) : (
                        <Crown className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium">Dark Mode</div>
                      <div className="text-xs text-muted-foreground">
                        Switch between light and dark themes
                      </div>
                    </div>
                  </div>
                  {isProUser ? (
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-1 rounded">Pro</span>
                      <ThemeToggle variant="outline" size="sm" />
                    </div>
                  ) : (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowProModal(true)}
                      className="min-h-[44px] touch-manipulation self-start sm:self-center"
                    >
                      <Crown className="h-4 w-4 mr-2" />
                      <span className="text-sm">Upgrade to Pro</span>
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <ProUpgradeModal 
        isOpen={showProModal}
        onClose={() => setShowProModal(false)}
      />
    </div>
  )
}