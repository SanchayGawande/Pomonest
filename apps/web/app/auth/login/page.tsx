'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Timer, Flame, Crown, Zap } from 'lucide-react'

export default function LoginPage() {
  const { user, loading, signInWithGoogle } = useAuth()
  const router = useRouter()
  const [isSigningIn, setIsSigningIn] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true)
    setError(null)
    try {
      await signInWithGoogle()
    } catch (err) {
      console.error('Sign in error:', err)
      setError('Failed to sign in. Please try again.')
    } finally {
      setIsSigningIn(false)
    }
  }

  useEffect(() => {
    if (!loading && user) {
      router.push('/')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/50">
        <div className="text-lg animate-pulse">Loading...</div>
      </div>
    )
  }

  if (user) {
    return null // Will redirect to dashboard
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-slate-100/5 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25"></div>
      <div className="absolute top-0 right-0 -mt-40 -mr-40 w-80 h-80 bg-gradient-focus rounded-full opacity-20 blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 left-0 -mb-40 -ml-40 w-80 h-80 bg-gradient-streak rounded-full opacity-20 blur-3xl animate-pulse"></div>

      {/* Header */}
      <header className="relative z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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
            <h1 className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              WorkStreak
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto space-y-8">
          {/* Welcome Card */}
          <Card className="text-center p-8 bg-card/50 backdrop-blur border-border/50">
            <CardHeader className="space-y-4">
              <div className="mx-auto w-16 h-16 bg-gradient-hero rounded-2xl flex items-center justify-center">
                <Flame className="h-8 w-8 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl mb-2">Welcome to WorkStreak</CardTitle>
                <CardDescription className="text-base">
                  Sign up to save your progress, track streaks, and unlock Pro features
                </CardDescription>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Benefits */}
              <div className="space-y-3 text-sm text-left">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>☁️ Sync your data across all devices</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>📊 Track your focus streaks and progress</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>🔔 Get reminder notifications</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>⚡ Access advanced settings</span>
                </div>
              </div>

              {/* Error Display */}
              {error && (
                <div className="text-sm text-red-500 text-center p-3 bg-red-50 dark:bg-red-950/20 rounded-lg">
                  {error}
                </div>
              )}

              {/* Sign Up Button */}
              <Button 
                onClick={handleGoogleSignIn}
                disabled={isSigningIn}
                size="lg"
                className="w-full bg-gradient-hero text-white border-0 hover:opacity-90 transition-opacity shadow-lg disabled:opacity-50"
              >
                <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                {isSigningIn ? 'Signing in...' : 'Continue with Google'}
              </Button>

              <p className="text-xs text-muted-foreground">
                Free to use • No credit card required • Cancel anytime
              </p>
            </CardContent>
          </Card>

          {/* Pro Features Preview */}
          <Card className="bg-gradient-to-br from-warning/10 to-orange-500/10 border-warning/20">
            <CardHeader className="text-center">
              <Badge className="bg-gradient-to-r from-warning to-orange-500 text-white px-3 py-1 mx-auto">
                <Crown className="h-4 w-4 mr-1" />
                Pro Features
              </Badge>
              <CardTitle className="text-lg">Upgrade After You Sign Up</CardTitle>
              <CardDescription>
                Unlock premium features for the ultimate focus experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-warning rounded-full"></div>
                  <span>🚫 <strong>Ad-free experience</strong> - No distractions</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-warning rounded-full"></div>
                  <span>🛡️ <strong>Streak protection</strong> - Save passes for bad days</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-warning rounded-full"></div>
                  <span>📊 <strong>Advanced analytics</strong> - Detailed insights</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-warning rounded-full"></div>
                  <span>🎨 <strong>Premium themes</strong> - Dark mode & more</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-warning rounded-full"></div>
                  <span>⚡ <strong>Priority support</strong> - Get help fast</span>
                </div>
              </div>
              
              <div className="text-center pt-4 border-t border-warning/20">
                <div className="text-2xl font-bold text-warning">$2.49/month</div>
                <div className="text-xs text-muted-foreground">17% cheaper than competitors!</div>
              </div>
            </CardContent>
          </Card>

          {/* Alternative option */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-3">
              No account needed to get started!
            </p>
            <Button 
              variant="outline"
              onClick={() => router.push('/')}
            >
              <Timer className="h-4 w-4 mr-2" />
              Continue as Guest
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}