'use client'

import { useState } from 'react'
import { useAuth } from './AuthProvider'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

type Provider = 'google' | 'apple'

export function SignInButton() {
  const { signInWithGoogle, signInWithApple } = useAuth()
  const [loading, setLoading] = useState<Provider | null>(null)

  const handleSignIn = async (provider: Provider) => {
    try {
      setLoading(provider)
      if (provider === 'google') {
        await signInWithGoogle()
      } else {
        await signInWithApple()
      }
    } catch (error) {
      console.error('Sign in error:', error)
    } finally {
      setLoading(null)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl bg-gradient-hero bg-clip-text text-transparent">
          WorkStreak
        </CardTitle>
        <CardDescription>
          Build your focus habit, one streak at a time
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          onClick={() => handleSignIn('google')}
          disabled={!!loading}
          variant="outline"
          className="w-full"
        >
          {loading === 'google' ? 'Signing in...' : 'Continue with Google'}
        </Button>
        <Button
          onClick={() => handleSignIn('apple')}
          disabled={!!loading}
          variant="outline"
          className="w-full"
        >
          {loading === 'apple' ? 'Signing in...' : 'Continue with Apple'}
        </Button>
      </CardContent>
    </Card>
  )
}