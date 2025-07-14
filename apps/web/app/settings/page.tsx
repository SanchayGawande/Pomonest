'use client'

import { useState, useEffect } from 'react'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const runtime = 'edge'
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
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => router.push('/')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Timer
            </Button>
            <h1 className="text-4xl font-bold text-red-600 dark:text-red-400 bg-yellow-200 dark:bg-yellow-900 p-4 rounded-lg shadow-xl border-4 border-red-500">
              🎨 SETTINGS - UPDATED STYLING 🎨
            </h1>
          </div>
          <Button onClick={signOut} variant="outline" size="sm">
            Sign Out
          </Button>
        </div>
      </header>

      <main className="container py-8 max-w-2xl">
        <div className="space-y-6">
          {/* Profile Section */}
          <Card className="border-4 border-blue-200 dark:border-blue-800 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300 shadow-xl hover:shadow-2xl bg-gradient-to-br from-blue-50/80 to-cyan-50/80 dark:from-blue-950/50 dark:to-cyan-950/50">
            <CardHeader className="bg-gradient-to-r from-blue-100/50 to-cyan-100/50 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-t-lg">
              <CardTitle className="flex items-center gap-4 text-lg">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-xl shadow-lg">
                  <User className="h-6 w-6" />
                </div>
                <span className="text-blue-900 dark:text-blue-100 font-bold">Profile</span>
              </CardTitle>
              <CardDescription className="text-blue-700 dark:text-blue-300 font-medium">
                Manage your account information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              <div className="p-5 border-3 border-blue-300 dark:border-blue-700 rounded-xl bg-gradient-to-r from-white via-blue-50 to-cyan-50 dark:from-gray-900 dark:via-blue-950 dark:to-cyan-950 shadow-md">
                <label className="text-base font-bold text-blue-900 dark:text-blue-100">Email</label>
                <p className="text-base text-blue-700 dark:text-blue-300 mt-2 font-semibold">{user.email}</p>
              </div>
              <div className="p-5 border-3 border-blue-300 dark:border-blue-700 rounded-xl bg-gradient-to-r from-white via-blue-50 to-cyan-50 dark:from-gray-900 dark:via-blue-950 dark:to-cyan-950 shadow-md">
                <label className="text-base font-bold text-blue-900 dark:text-blue-100">Member since</label>
                <p className="text-base text-blue-700 dark:text-blue-300 mt-2 font-semibold">
                  {new Date(user.created_at || '').toLocaleDateString()}
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
            <CardContent className="relative z-10">
              <div className="space-y-6">
                <div className="grid gap-3 text-sm">
                  <div className="flex items-center gap-3 p-2 rounded-lg bg-white/50 dark:bg-black/20">
                    <div className="w-2 h-2 bg-yellow-600 dark:bg-yellow-400 rounded-full animate-pulse" />
                    <span className="font-semibold text-yellow-900 dark:text-yellow-100">🚫 Ad-free experience</span>
                  </div>
                  <div className="flex items-center gap-3 p-2 rounded-lg bg-white/30 dark:bg-black/10">
                    <div className="w-2 h-2 bg-yellow-600 dark:bg-yellow-400 rounded-full" />
                    <span className="font-medium text-yellow-800 dark:text-yellow-200">Save Passes to protect your streaks</span>
                  </div>
                  <div className="flex items-center gap-3 p-2 rounded-lg bg-white/30 dark:bg-black/10">
                    <div className="w-2 h-2 bg-yellow-600 dark:bg-yellow-400 rounded-full" />
                    <span className="font-medium text-yellow-800 dark:text-yellow-200">Dark mode theme</span>
                  </div>
                  <div className="flex items-center gap-3 p-2 rounded-lg bg-white/30 dark:bg-black/10">
                    <div className="w-2 h-2 bg-yellow-600 dark:bg-yellow-400 rounded-full" />
                    <span className="font-medium text-yellow-800 dark:text-yellow-200">Advanced statistics and insights</span>
                  </div>
                  <div className="flex items-center gap-3 p-2 rounded-lg bg-white/30 dark:bg-black/10">
                    <div className="w-2 h-2 bg-yellow-600 dark:bg-yellow-400 rounded-full" />
                    <span className="font-medium text-yellow-800 dark:text-yellow-200">Priority customer support</span>
                  </div>
                </div>
                <Button 
                  onClick={() => setShowProModal(true)}
                  className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-white font-semibold"
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
          <Card className="border-4 border-purple-200 dark:border-purple-800 hover:border-purple-300 dark:hover:border-purple-700 transition-all duration-300 shadow-xl hover:shadow-2xl bg-gradient-to-br from-purple-50/80 to-pink-50/80 dark:from-purple-950/50 dark:to-pink-950/50">
            <CardHeader className="bg-gradient-to-r from-purple-100/50 to-pink-100/50 dark:from-purple-900/30 dark:to-pink-900/30 rounded-t-lg">
              <CardTitle className="flex items-center gap-4 text-lg">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-xl shadow-lg">
                  <Palette className="h-6 w-6" />
                </div>
                <span className="text-purple-900 dark:text-purple-100 font-bold">Appearance</span>
              </CardTitle>
              <CardDescription className="text-purple-700 dark:text-purple-300 font-medium">
                Customize your app appearance
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-6 border-4 border-purple-300 dark:border-purple-700 rounded-xl bg-gradient-to-r from-white via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-950 dark:to-pink-950 hover:border-purple-400 dark:hover:border-purple-600 transition-all duration-300 shadow-lg">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-xl shadow-md">
                      {isProUser ? (
                        <Moon className="h-5 w-5" />
                      ) : (
                        <Crown className="h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <div className="text-base font-bold text-purple-900 dark:text-purple-100">Dark Mode</div>
                      <div className="text-sm text-purple-700 dark:text-purple-300 font-medium">
                        Switch between light and dark themes
                      </div>
                    </div>
                  </div>
                  {isProUser ? (
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-green-600 dark:text-green-400 font-bold bg-green-100 dark:bg-green-900 px-3 py-1 rounded-full">Pro</span>
                      <ThemeToggle variant="outline" size="sm" className="border-3 border-purple-300 dark:border-purple-700 hover:border-purple-400 dark:hover:border-purple-600" />
                    </div>
                  ) : (
                    <Button 
                      variant="outline" 
                      size="lg"
                      onClick={() => setShowProModal(true)}
                      className="border-3 border-yellow-300 bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-900 hover:from-yellow-200 hover:to-orange-200 hover:border-yellow-400 dark:border-yellow-700 dark:from-yellow-950 dark:to-orange-950 dark:text-yellow-100 dark:hover:from-yellow-900 dark:hover:to-orange-900 font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                    >
                      <Crown className="h-5 w-5 mr-2" />
                      Upgrade to Pro
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