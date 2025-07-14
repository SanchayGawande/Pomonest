'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { stripePromise, PRO_PLANS, type ProPlan, isStripeConfigured } from '@/lib/stripe'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Check, Crown, Zap, Star, Loader2, Calendar, CreditCard } from 'lucide-react'

interface SubscriptionData {
  subscription_type: 'monthly' | 'yearly' | null
  subscription_status: 'active' | 'canceled' | 'past_due' | 'incomplete' | null
  subscription_current_period_end: string | null
  subscription_cancel_at: string | null
}

interface SubscriptionManagementProps {
  onClose?: () => void
}

export function SubscriptionManagement({ onClose }: SubscriptionManagementProps) {
  const { user } = useAuth()
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null)
  const [selectedPlan, setSelectedPlan] = useState<ProPlan>('yearly')
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [isProUser, setIsProUser] = useState(false)

  useEffect(() => {
    if (user?.id) {
      fetchSubscriptionData()
    }
  }, [user?.id])

  const fetchSubscriptionData = async () => {
    if (!user?.id) return

    try {
      const { data, error } = await supabase
        .from('users')
        .select('is_pro, subscription_type, subscription_status, subscription_current_period_end, subscription_cancel_at')
        .eq('id', user.id)
        .single()

      if (error) {
        console.error('Error fetching subscription data:', error)
        return
      }

      setSubscription(data)
      setIsProUser(data.is_pro || false)
      if (data.subscription_type) {
        setSelectedPlan(data.subscription_type as ProPlan)
      }
    } catch (error) {
      console.error('Error fetching subscription data:', error)
    } finally {
      setIsLoadingData(false)
    }
  }

  const handleSubscriptionChange = async (newPlan: ProPlan) => {
    if (!user?.id || !subscription?.subscription_type) return

    setIsLoading(true)
    
    try {
      const plan = PRO_PLANS[newPlan]
      console.log('🔄 Changing subscription to:', newPlan, plan)
      
      // Get the current session to get the access token
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) {
        throw new Error('No access token found')
      }
      
      const requestData = {
        priceId: plan.priceId,
        userId: user.id,
        changeType: 'upgrade' // or 'downgrade' based on comparison
      }
      
      // Create checkout session for subscription change
      const response = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(requestData),
      })

      const responseData = await response.json()

      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to change subscription')
      }

      const { url } = responseData

      // Redirect to Stripe Checkout for subscription change
      if (url && typeof window !== 'undefined') {
        window.location.href = url
      }

    } catch (error) {
      console.error('Subscription change error:', error)
      // TODO: Show error toast
    } finally {
      setIsLoading(false)
    }
  }

  const handleInitialUpgrade = async () => {
    if (!user?.id) return

    setIsLoading(true)
    
    try {
      const plan = PRO_PLANS[selectedPlan]
      
      // Get the current session to get the access token
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) {
        throw new Error('No access token found')
      }
      
      const requestData = {
        priceId: plan.priceId,
        userId: user.id,
      }
      
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

      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to create checkout session')
      }

      const { url } = responseData

      // Redirect to Stripe Checkout
      if (url && typeof window !== 'undefined') {
        window.location.href = url
      }

    } catch (error) {
      console.error('Upgrade error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoadingData) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    )
  }

  const plans = Object.entries(PRO_PLANS).map(([key, plan]) => ({
    id: key as ProPlan,
    ...plan,
    isPopular: key === 'yearly',
    savings: key === 'yearly' ? 'Save 17%' : null,
    isCurrent: subscription?.subscription_type === key,
  }))

  const currentPlan = plans.find(p => p.isCurrent)

  return (
    <div className="space-y-6">
      {/* Current Subscription Status */}
      {isProUser && subscription?.subscription_type && (
        <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800 dark:text-green-200">
              <Crown className="h-5 w-5" />
              Current Plan: WorkStreak Pro {subscription.subscription_type === 'monthly' ? 'Monthly' : 'Yearly'}
            </CardTitle>
            <CardDescription className="text-green-700 dark:text-green-300">
              {subscription.subscription_status === 'active' ? (
                subscription.subscription_cancel_at ? (
                  `Your subscription will cancel on ${new Date(subscription.subscription_cancel_at).toLocaleDateString()}`
                ) : (
                  subscription.subscription_current_period_end ? (
                    `Renews on ${new Date(subscription.subscription_current_period_end).toLocaleDateString()}`
                  ) : (
                    'Your Pro subscription is active'
                  )
                )
              ) : (
                `Status: ${subscription.subscription_status}`
              )}
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {/* Plan Options */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">
          {isProUser ? 'Manage Your Subscription' : 'Choose Your Plan'}
        </h3>
        
        <div className="grid gap-4 md:grid-cols-2">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative cursor-pointer transition-all duration-200 hover:shadow-lg ${
                selectedPlan === plan.id
                  ? 'ring-2 ring-primary border-primary'
                  : 'hover:border-primary/50'
              } ${plan.isPopular ? 'border-yellow-500' : ''} ${
                plan.isCurrent ? 'border-green-500 bg-green-50 dark:bg-green-950' : ''
              }`}
              onClick={() => setSelectedPlan(plan.id)}
            >
              {plan.isCurrent && (
                <Badge className="absolute -top-2 left-4 bg-green-500 text-white">
                  Current Plan
                </Badge>
              )}
              {plan.isPopular && !plan.isCurrent && (
                <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 bg-yellow-500 text-yellow-900">
                  Most Popular
                </Badge>
              )}
              {plan.savings && (
                <Badge className="absolute -top-2 right-4 bg-blue-500 text-white">
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
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-6">
        {onClose && (
          <Button variant="outline" onClick={onClose} className="flex-1">
            Close
          </Button>
        )}
        
        {!isProUser ? (
          <Button 
            onClick={handleInitialUpgrade} 
            disabled={isLoading || !isStripeConfigured()}
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Processing...
              </>
            ) : (
              <>
                <Crown className="h-4 w-4 mr-2" />
                Upgrade to Pro
              </>
            )}
          </Button>
        ) : (
          subscription?.subscription_type !== selectedPlan && (
            <Button 
              onClick={() => handleSubscriptionChange(selectedPlan)}
              disabled={isLoading || !isStripeConfigured()}
              className="flex-1"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="h-4 w-4 mr-2" />
                  {selectedPlan === 'yearly' && subscription?.subscription_type === 'monthly' 
                    ? 'Upgrade to Yearly' 
                    : 'Change Plan'}
                </>
              )}
            </Button>
          )
        )}
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
  )
}