import { loadStripe } from '@stripe/stripe-js'
import Stripe from 'stripe'

// Get environment variables with validation
const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
const secretKey = process.env.STRIPE_SECRET_KEY

// Check if we have valid Stripe keys (not demo values)
const hasValidStripeKeys = publishableKey && 
  secretKey && 
  publishableKey.startsWith('pk_') && 
  secretKey.startsWith('sk_') &&
  !publishableKey.includes('demo') &&
  !secretKey.includes('demo')

// Client-side validation (only checks publishable key)
const hasValidPublishableKey = publishableKey && 
  publishableKey.startsWith('pk_') && 
  !publishableKey.includes('demo')

// Client-side Stripe instance (only if we have valid keys)
export const stripePromise = hasValidPublishableKey 
  ? loadStripe(publishableKey!)
  : null

// Server-side Stripe instance (only if we have valid keys)
export const stripe = hasValidStripeKeys 
  ? new Stripe(secretKey!, {
      apiVersion: '2025-06-30.basil',
    })
  : null

// Helper to check if Stripe is configured (client-side safe)
export const isStripeConfigured = () => hasValidPublishableKey

// Pricing configuration
console.log('🔍 Environment variables check:', {
  NEXT_PUBLIC_STRIPE_PRICE_ID_MONTHLY: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_MONTHLY,
  NEXT_PUBLIC_STRIPE_PRICE_ID_YEARLY: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_YEARLY
})

export const STRIPE_PRICES = {
  PRO_MONTHLY: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_MONTHLY!,
  PRO_YEARLY: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_YEARLY!,
} as const

export type StripePriceId = typeof STRIPE_PRICES[keyof typeof STRIPE_PRICES]

// Pro plan configuration - Competitive pricing (cheaper than Pomofocus)
export const PRO_PLANS = {
  monthly: {
    priceId: STRIPE_PRICES.PRO_MONTHLY,
    name: 'Pro Monthly',
    price: '$2.49',
    interval: 'month',
    savePasses: 3,
    features: [
      '🚫 Ad-free experience',
      '3 Save Passes per month',
      'Streak protection',
      'Dark mode theme',
      'Advanced statistics',
      'Priority support'
    ]
  },
  yearly: {
    priceId: STRIPE_PRICES.PRO_YEARLY,
    name: 'Pro Yearly',
    price: '$14.99',
    interval: 'year',
    savePasses: 12,
    features: [
      '🚫 Ad-free experience',
      '12 Save Passes per year',
      'Streak protection',
      'Dark mode theme',
      'Advanced statistics',
      'Priority support',
      '💰 7 months free!'
    ]
  }
} as const

export type ProPlan = keyof typeof PRO_PLANS

// Webhook event types
export const STRIPE_WEBHOOK_EVENTS = {
  CHECKOUT_COMPLETED: 'checkout.session.completed',
  SUBSCRIPTION_CREATED: 'customer.subscription.created',
  SUBSCRIPTION_UPDATED: 'customer.subscription.updated',
  SUBSCRIPTION_DELETED: 'customer.subscription.deleted',
  INVOICE_PAID: 'invoice.payment_succeeded',
  INVOICE_FAILED: 'invoice.payment_failed',
} as const