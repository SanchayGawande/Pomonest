import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe, STRIPE_WEBHOOK_EVENTS, isStripeConfigured } from '@/lib/stripe'
import { supabase } from '@/lib/supabase'
import { analytics } from '@/lib/analytics'
import Stripe from 'stripe'

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  console.log('🎯 WEBHOOK RECEIVED - Processing Stripe webhook...')
  
  try {
    // Check if Stripe is properly configured
    if (!isStripeConfigured() || !stripe) {
      console.error('❌ Stripe not configured for webhook processing')
      return NextResponse.json(
        { error: 'Stripe not configured' },
        { status: 503 }
      )
    }

    const body = await request.text()
    const headersList = headers()
    const signature = headersList.get('stripe-signature')

    if (!signature) {
      console.error('Missing Stripe signature')
      return NextResponse.json(
        { error: 'Missing Stripe signature' },
        { status: 400 }
      )
    }

    // Verify webhook signature
    let event: Stripe.Event
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json(
        { error: 'Webhook signature verification failed' },
        { status: 400 }
      )
    }

    console.log('Received Stripe webhook:', event.type)

    // Handle different event types
    switch (event.type) {
      case STRIPE_WEBHOOK_EVENTS.CHECKOUT_COMPLETED: {
        const session = event.data.object as Stripe.Checkout.Session
        await handleCheckoutCompleted(session)
        break
      }

      case STRIPE_WEBHOOK_EVENTS.INVOICE_PAID: {
        const invoice = event.data.object as Stripe.Invoice
        await handleInvoicePaid(invoice)
        break
      }

      case STRIPE_WEBHOOK_EVENTS.SUBSCRIPTION_DELETED: {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionDeleted(subscription)
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('Webhook handler error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const { userId, savePasses } = session.metadata || {}

  if (!userId || !savePasses) {
    console.error('Missing metadata in checkout session')
    return
  }

  const passesToAdd = parseInt(savePasses, 10)
  
  // Determine subscription type
  const subscriptionType = passesToAdd === 3 ? 'monthly' : 'yearly'

  try {
    // Use the Supabase service role key for admin operations
    const adminSupabase = require('@supabase/supabase-js').createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // First, get the user from auth to ensure they exist
    const { data: authUser, error: authError } = await adminSupabase.auth.admin.getUserById(userId)
    
    if (authError || !authUser.user) {
      console.error('User not found in auth:', authError)
      return
    }

    // Get subscription details from Stripe
    let subscriptionId = null
    if (session.subscription) {
      subscriptionId = typeof session.subscription === 'string' ? session.subscription : session.subscription.id
    }

    // Ensure user exists in users table with multiple attempts
    let upsertSuccess = false
    let upsertAttempts = 0
    const maxUpsertAttempts = 3
    
    while (!upsertSuccess && upsertAttempts < maxUpsertAttempts) {
      upsertAttempts++
      console.log(`Attempting to upsert user (attempt ${upsertAttempts}/${maxUpsertAttempts})...`)
      
      const { error: upsertError } = await adminSupabase
        .from('users')
        .upsert({
          id: userId,
          email: authUser.user.email!,
          full_name: authUser.user.user_metadata?.full_name || null,
          is_pro: true,
          subscription_type: subscriptionType,
          subscription_id: subscriptionId,
          subscription_status: 'active',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'id'
        })

      if (!upsertError) {
        upsertSuccess = true
        console.log('✅ User upsert successful')
      } else {
        console.error(`❌ Upsert attempt ${upsertAttempts} failed:`, upsertError)
        if (upsertAttempts < maxUpsertAttempts) {
          await new Promise(resolve => setTimeout(resolve, 1000)) // Wait 1 second before retry
        }
      }
    }

    // Call the handle_pro_upgrade function with subscription info
    const { error } = await adminSupabase.rpc('handle_pro_upgrade', {
      user_id_param: userId,
      passes_to_add: passesToAdd,
      subscription_type_param: subscriptionType,
      subscription_id_param: subscriptionId,
    })

    if (error) {
      console.error('Failed to upgrade user to Pro via RPC:', error)
      // Enhanced Fallback: Multiple attempts to directly update the user table
      let directUpdateSuccess = false
      let directAttempts = 0
      const maxDirectAttempts = 3
      
      while (!directUpdateSuccess && directAttempts < maxDirectAttempts) {
        directAttempts++
        console.log(`Direct Pro update attempt ${directAttempts}/${maxDirectAttempts}...`)
        
        const { error: directError } = await adminSupabase
          .from('users')
          .update({ 
            is_pro: true,
            subscription_type: subscriptionType,
            subscription_id: subscriptionId,
            subscription_status: 'active',
            updated_at: new Date().toISOString()
          })
          .eq('id', userId)
        
        if (!directError) {
          directUpdateSuccess = true
          console.log('✅ Direct Pro update successful')
        } else {
          console.error(`❌ Direct update attempt ${directAttempts} failed:`, directError)
          if (directAttempts < maxDirectAttempts) {
            await new Promise(resolve => setTimeout(resolve, 1000)) // Wait 1 second before retry
          }
        }
      }
      
      if (!directUpdateSuccess) {
        console.error('❌ All Pro upgrade attempts failed for user:', userId)
        return
      }
    }

    // Track Pro upgrade in analytics
    const plan = passesToAdd === 3 ? 'monthly' : 'yearly'
    const revenue = passesToAdd === 3 ? 2.49 : 14.99
    analytics.trackProUpgrade(plan, revenue, userId)

    console.log(`Successfully upgraded user ${userId} to Pro with ${passesToAdd} save passes`)

  } catch (error) {
    console.error('Error handling checkout completion:', error)
  }
}

async function handleInvoicePaid(invoice: Stripe.Invoice) {
  // Handle recurring subscription payments
  if (invoice.metadata?.userId) {
    console.log(`Invoice payment received for user: ${invoice.metadata.userId}`)
    // Could add additional save passes for recurring payments
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  // Handle subscription cancellation
  if (subscription.metadata?.userId) {
    const userId = subscription.metadata.userId

    try {
      const adminSupabase = require('@supabase/supabase-js').createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      )

      // Downgrade user from Pro
      const { error } = await adminSupabase
        .from('users')
        .update({ is_pro: false })
        .eq('id', userId)

      if (error) {
        console.error('Failed to downgrade user:', error)
        return
      }

      console.log(`Successfully downgraded user ${userId} from Pro`)

    } catch (error) {
      console.error('Error handling subscription deletion:', error)
    }
  }
}