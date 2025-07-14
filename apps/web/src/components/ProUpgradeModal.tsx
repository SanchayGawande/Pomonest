'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { stripePromise, PRO_PLANS, type ProPlan, isStripeConfigured } from '@/lib/stripe'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Check, Crown, Zap, Shield, Star, Loader2 } from 'lucide-react'

interface ProUpgradeModalProps {
  isOpen: boolean
  onClose: () => void
  defaultPlan?: ProPlan
}

export function ProUpgradeModal({ isOpen, onClose, defaultPlan = 'monthly' }: ProUpgradeModalProps) {
  const { user } = useAuth()
  const [selectedPlan, setSelectedPlan] = useState<ProPlan>(defaultPlan)
  const [isLoading, setIsLoading] = useState(false)

  const handleUpgrade = async () => {
    if (!user?.id) return

    setIsLoading(true)
    
    try {
      const plan = PRO_PLANS[selectedPlan]
      console.log('🛒 Selected plan:', selectedPlan, plan)
      
      // Get the current session to get the access token
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) {
        throw new Error('No access token found')
      }
      
      const requestData = {
        priceId: plan.priceId,
        userId: user.id,
      }
      console.log('📤 Sending request data:', requestData)
      
      // Create checkout session
      const response = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(requestData),
      })

      const responseData = await response.json()
      console.log('📥 Response data:', responseData)

      if (!response.ok) {
        console.error('❌ Checkout failed:', response.status, responseData)
        throw new Error(responseData.error || 'Failed to create checkout session')
      }

      const { sessionId, url } = responseData

      // Redirect to Stripe Checkout
      if (url && typeof window !== 'undefined') {
        window.location.href = url
      } else {
        // Fallback: use Stripe.js
        const stripe = await stripePromise
        if (stripe) {
          await stripe.redirectToCheckout({ sessionId })
        }
      }

    } catch (error) {
      console.error('Upgrade error:', error)
      // TODO: Show error toast
    } finally {
      setIsLoading(false)
    }
  }

  const plans = Object.entries(PRO_PLANS).map(([key, plan]) => ({
    id: key as ProPlan,
    ...plan,
    isPopular: key === 'yearly',
    savings: key === 'yearly' ? 'Save 17%' : null,
  }))

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center">
          <DialogTitle className="flex items-center justify-center gap-2 text-2xl">
            <Crown className="h-6 w-6 text-yellow-500" />
            Upgrade to WorkStreak Pro
          </DialogTitle>
          <DialogDescription className="text-base">
            <span className="text-primary font-semibold">Remove all ads</span> and unlock premium features to boost your productivity
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Plan Selection */}
          <div className="grid gap-4 md:grid-cols-2">
            {plans.map((plan) => (
              <Card
                key={plan.id}
                className={`relative cursor-pointer transition-all duration-200 hover:shadow-lg ${
                  selectedPlan === plan.id
                    ? 'ring-2 ring-primary border-primary'
                    : 'hover:border-primary/50'
                } ${plan.isPopular ? 'border-yellow-500' : ''}`}
                onClick={() => setSelectedPlan(plan.id)}
              >
                {plan.isPopular && (
                  <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 bg-yellow-500 text-yellow-900">
                    Most Popular
                  </Badge>
                )}
                {plan.savings && (
                  <Badge className="absolute -top-2 right-4 bg-green-500 text-white">
                    {plan.savings}
                  </Badge>
                )}

                <CardHeader className="text-center">
                  <CardTitle className="flex items-center justify-center gap-2">
                    {plan.id === 'yearly' ? (
                      <Zap className="h-5 w-5 text-yellow-500" />
                    ) : (
                      <Star className="h-5 w-5 text-blue-500" />
                    )}
                    {plan.name}
                  </CardTitle>
                  <div className="space-y-1">
                    <div className="text-3xl font-bold">{plan.price}</div>
                    <div className="text-sm text-muted-foreground">
                      per {plan.interval}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  <div className="text-center">
                    <div className="font-semibold text-primary">
                      {plan.savePasses} Save Passes
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {plan.id === 'yearly' ? 'per year' : 'per month'}
                    </div>
                  </div>

                  <ul className="space-y-2 text-sm">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* What are Save Passes? */}
          <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
                <Shield className="h-5 w-5" />
                What are Save Passes?
              </CardTitle>
            </CardHeader>
            <CardContent className="text-blue-700 dark:text-blue-300">
              <p className="text-sm">
                Save Passes automatically protect your streak when you miss a day. Instead of resetting to 0, 
                the app consumes one Save Pass and keeps your streak alive. Perfect for sick days, 
                vacations, or when life gets in the way!
              </p>
            </CardContent>
          </Card>

          {/* Feature Comparison */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-center">Pro Features</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Shield className="h-5 w-5 text-green-500" />
                <div>
                  <div className="font-medium">Streak Protection</div>
                  <div className="text-xs text-muted-foreground">Never lose your progress</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Crown className="h-5 w-5 text-yellow-500" />
                <div>
                  <div className="font-medium">Dark Mode</div>
                  <div className="text-xs text-muted-foreground">Easy on the eyes</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Star className="h-5 w-5 text-blue-500" />
                <div>
                  <div className="font-medium">Advanced Stats</div>
                  <div className="text-xs text-muted-foreground">Detailed insights</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Zap className="h-5 w-5 text-purple-500" />
                <div>
                  <div className="font-medium">Priority Support</div>
                  <div className="text-xs text-muted-foreground">Get help faster</div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-6">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Maybe Later
            </Button>
            <Button 
              onClick={handleUpgrade} 
              disabled={isLoading || !isStripeConfigured()}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Processing...
                </>
              ) : !isStripeConfigured() ? (
                <>
                  <Crown className="h-4 w-4 mr-2" />
                  Payment Setup Required
                </>
              ) : (
                <>
                  <Crown className="h-4 w-4 mr-2" />
                  Upgrade to Pro
                </>
              )}
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="text-center text-xs text-muted-foreground pt-4 border-t">
            {isStripeConfigured() ? (
              <p>🔒 Secure payment powered by Stripe • Cancel anytime • No hidden fees</p>
            ) : (
              <p>⚙️ Demo mode - Payment configuration required for production</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}