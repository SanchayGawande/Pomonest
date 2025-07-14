'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import PomodoroTimer from '@/components/PomodoroTimer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Flame, Calendar, Clock, Trophy, Loader2, Settings } from 'lucide-react'
import { Toaster } from '@/components/ui/toaster'
import { useStreak, useSessionsToday, useSessionsWeek, useSavePasses, useCreateSession, useUpdateStreakWithSavePass, useUser } from '@/lib/queries'
import { SavePassIndicator } from '@/components/SavePassIndicator'
import { StreakCelebration } from '@/components/StreakCelebration'
import { SoundToggle } from '@/components/SoundToggle'
import { ThemeToggle } from '@/components/ThemeToggle'
import { BannerAd } from '@/components/ads/BannerAd'
import { SidebarAd } from '@/components/ads/SidebarAd'
import { InterstitialAd } from '@/components/ads/InterstitialAd'
import { AdBlockerDetector } from '@/components/ads/AdBlockerDetector'
import { ProUpgradeModal } from '@/components/ProUpgradeModal'

export default function DashboardPage() {
  const { user, loading: authLoading, signOut } = useAuth()
  const router = useRouter()
  
  // Celebration state
  const [showCelebration, setShowCelebration] = useState(false)
  const [celebrationStreakDays, setCelebrationStreakDays] = useState(0)
  
  // Pro upgrade modal state
  const [showProModal, setShowProModal] = useState(false)
  
  // Interstitial ad state
  const [showInterstitialAd, setShowInterstitialAd] = useState(false)

  // Data queries
  const { data: userData, isLoading: userLoading } = useUser(user?.id)
  const { data: streak, isLoading: streakLoading } = useStreak(user?.id)
  const { data: sessionsToday, isLoading: todayLoading } = useSessionsToday(user?.id)
  const { data: sessionsWeek, isLoading: weekLoading } = useSessionsWeek(user?.id)
  const { data: savePasses } = useSavePasses(user?.id)
  
  // Mutations
  const createSessionMutation = useCreateSession()
  const updateStreakMutation = useUpdateStreakWithSavePass()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    } else if (!authLoading && user) {
      // Redirect authenticated users to main page for consistent experience
      router.push('/')
    }
  }, [user, authLoading, router])

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-lg">Loading...</span>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const handleSessionComplete = async () => {
    if (!user?.id) return
    
    const today = new Date().toISOString().split('T')[0]
    
    try {
      // 1. Save the completed session
      await createSessionMutation.mutateAsync({
        userId: user.id,
        sessionDate: today,
        durationMinutes: 25,
        sessionType: 'work'
      })
      
      // 2. Update streak with save pass logic
      const result = await updateStreakMutation.mutateAsync({
        userId: user.id,
        sessionDate: today
      })
      
      // 3. Show celebration based on result
      if (result.save_pass_used) {
        console.log('🎯 Save Pass used! Your streak is protected.')
      } else {
        console.log('🔥 Session completed! Streak continued.')
      }
      
      // Trigger celebration for streak continuation or growth
      setCelebrationStreakDays(result.current_streak)
      setShowCelebration(true)
      
      // Show interstitial ad for non-Pro users after session completion
      if (!isProUser) {
        setTimeout(() => {
          setShowInterstitialAd(true)
        }, 2000) // Show ad 2 seconds after celebration
      }
      
      // Play completion sound if enabled
      if ((window as any).playWorkstreakCompletionSound) {
        (window as any).playWorkstreakCompletionSound()
      }
      
    } catch (error) {
      console.error('Failed to save session:', error)
      // TODO: Add proper error handling/toast
    }
  }

  // Calculate stats
  const todaySessionCount = sessionsToday?.length || 0
  const weekSessionCount = sessionsWeek?.length || 0
  const weekMinutes = weekSessionCount * 25
  const currentStreak = streak?.current_streak || 0
  const longestStreak = streak?.longest_streak || 0
  const hasCompletedToday = todaySessionCount > 0
  const isProUser = userData?.is_pro || false
  const savePassCount = savePasses?.passes_left || null

  // Check if save pass was used today (would need additional logic to track this)
  // For now, we'll use a placeholder - in production this would come from session metadata
  const savePassUsedToday = false

  // Loading state for data
  const isLoadingData = streakLoading || todayLoading || weekLoading || userLoading

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/50">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            WorkStreak
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Welcome back, {user.email}
            </span>
            <SoundToggle />
            {isProUser && <ThemeToggle />}
            <Button 
              onClick={() => router.push('/settings')} 
              variant="ghost" 
              size="sm"
            >
              <Settings className="h-4 w-4" />
            </Button>
            <Button onClick={signOut} variant="outline" size="sm">
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Ad Blocker Detection */}
      <div className="container pt-4">
        <AdBlockerDetector 
          onUpgradeClick={() => setShowProModal(true)}
          className="mb-4"
        />
      </div>

      {/* Banner Ad */}
      <div className="container">
        <BannerAd 
          slot="banner"
          onUpgradeClick={() => setShowProModal(true)}
          className="mb-4"
        />
      </div>

      <main className="container py-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Timer Section */}
          <div className="lg:col-span-2">
            <PomodoroTimer onSessionComplete={handleSessionComplete} />
          </div>

          {/* Stats Section */}
          <div className="space-y-6">
            {/* Current Streak */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
                <Flame className="h-4 w-4 text-streak-fire" />
              </CardHeader>
              <CardContent>
                {isLoadingData ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm text-muted-foreground">Loading...</span>
                  </div>
                ) : (
                  <>
                    <div className="text-2xl font-bold text-streak-fire">
                      {currentStreak} day{currentStreak !== 1 ? 's' : ''}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {hasCompletedToday 
                        ? '🔥 Great job! Your streak is alive!' 
                        : currentStreak > 0 
                          ? 'Complete one session today to continue your streak' 
                          : 'Start your streak with one session today'
                      }
                    </p>
                  </>
                )}
              </CardContent>
            </Card>

            {/* This Week */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">This Week</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {isLoadingData ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm text-muted-foreground">Loading...</span>
                  </div>
                ) : (
                  <>
                    <div className="text-2xl font-bold">
                      {weekSessionCount} session{weekSessionCount !== 1 ? 's' : ''}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {weekMinutes} minutes of focused work
                    </p>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Sidebar Ad */}
            <SidebarAd onUpgradeClick={() => setShowProModal(true)} />

            {/* Longest Streak */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Longest Streak</CardTitle>
                <Trophy className="h-4 w-4 text-warning" />
              </CardHeader>
              <CardContent>
                {isLoadingData ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm text-muted-foreground">Loading...</span>
                  </div>
                ) : (
                  <>
                    <div className="text-2xl font-bold">
                      {longestStreak} day{longestStreak !== 1 ? 's' : ''}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {longestStreak > 0 ? 'Your personal best so far' : 'Start your first streak!'}
                    </p>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Today's Goal */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Today's Progress</CardTitle>
                <Clock className="h-4 w-4 text-focus-calm" />
              </CardHeader>
              <CardContent>
                {isLoadingData ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm text-muted-foreground">Loading...</span>
                  </div>
                ) : (
                  <>
                    <div className="text-2xl font-bold text-focus-calm">
                      {todaySessionCount}/1 session{todaySessionCount !== 1 ? 's' : ''}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {hasCompletedToday 
                        ? 'Goal achieved! 🎉' 
                        : 'Complete one 25-minute focus session'
                      }
                    </p>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Save Pass Protection */}
            <SavePassIndicator 
              savePasses={savePassCount}
              isProUser={isProUser}
              savePassUsedToday={savePassUsedToday}
            />

            {/* Success message for completed sessions today */}
            {hasCompletedToday && (
              <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-green-800 dark:text-green-200">
                    🎉 Streak Alive!
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-green-700 dark:text-green-300">
                    You've completed your daily goal and kept your streak alive! Come back tomorrow to continue building your focus habit.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      <Toaster />
      
      {/* Celebration Modal */}
      <StreakCelebration
        isVisible={showCelebration}
        streakDays={celebrationStreakDays}
        onComplete={() => setShowCelebration(false)}
      />

      {/* Pro Upgrade Modal */}
      <ProUpgradeModal 
        isOpen={showProModal}
        onClose={() => setShowProModal(false)}
      />

      {/* Break Time Interstitial Ad */}
      <InterstitialAd
        isOpen={showInterstitialAd}
        onClose={() => setShowInterstitialAd(false)}
        onUpgradeClick={() => setShowProModal(true)}
      />
    </div>
  )
}