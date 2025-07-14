import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { stripe, isStripeConfigured } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  try {
    // This endpoint can be called periodically to check for users who paid but don't have Pro status
    // It can also be called manually for specific users

    if (!isStripeConfigured() || !stripe) {
      return NextResponse.json(
        { error: 'Stripe not configured' },
        { status: 503 }
      )
    }

    const body = await request.json()
    const { userId } = body // Optional: check specific user, or all if not provided

    // Create Supabase admin client
    const adminSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    let usersToCheck = []

    if (userId) {
      // Check specific user
      const { data: user, error } = await adminSupabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (!error && user) {
        usersToCheck = [user]
      }
    } else {
      // Check all non-Pro users (limit to last 100 for safety)
      const { data: users, error } = await adminSupabase
        .from('users')
        .select('*')
        .eq('is_pro', false)
        .order('created_at', { ascending: false })
        .limit(100)

      if (!error && users) {
        usersToCheck = users
      }
    }

    console.log(`🔍 Checking ${usersToCheck.length} users for Pro payment verification`)

    let fixedCount = 0
    const results = []

    for (const user of usersToCheck) {
      try {
        // Check if this user has any successful payments in Stripe
        const customers = await stripe.customers.list({
          email: user.email,
          limit: 1
        })

        if (customers.data.length > 0) {
          const customer = customers.data[0]
          
          // Check for active subscriptions
          const subscriptions = await stripe.subscriptions.list({
            customer: customer.id,
            status: 'active',
            limit: 10
          })

          // Check for successful checkout sessions
          const sessions = await stripe.checkout.sessions.list({
            customer: customer.id,
            limit: 10
          })

          const hasActiveSubscription = subscriptions.data.length > 0
          const hasSuccessfulPayment = sessions.data.some(session => session.payment_status === 'paid')

          if (hasActiveSubscription || hasSuccessfulPayment) {
            console.log(`🔧 Found payment for user ${user.email}, upgrading to Pro...`)
            
            // Update user to Pro status
            const { error: updateError } = await adminSupabase
              .from('users')
              .update({ 
                is_pro: true,
                updated_at: new Date().toISOString()
              })
              .eq('id', user.id)

            if (!updateError) {
              fixedCount++
              results.push({
                userId: user.id,
                email: user.email,
                status: 'fixed',
                reason: hasActiveSubscription ? 'active_subscription' : 'successful_payment'
              })
              console.log(`✅ Fixed Pro status for ${user.email}`)
            } else {
              results.push({
                userId: user.id,
                email: user.email,
                status: 'failed',
                error: updateError.message
              })
              console.error(`❌ Failed to fix Pro status for ${user.email}:`, updateError)
            }
          } else {
            results.push({
              userId: user.id,
              email: user.email,
              status: 'no_payment',
              reason: 'No active subscription or successful payment found'
            })
          }
        } else {
          results.push({
            userId: user.id,
            email: user.email,
            status: 'no_customer',
            reason: 'No Stripe customer found'
          })
        }
      } catch (error) {
        console.error(`❌ Error checking user ${user.email}:`, error)
        results.push({
          userId: user.id,
          email: user.email,
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }

    return NextResponse.json({
      success: true,
      checked: usersToCheck.length,
      fixed: fixedCount,
      results
    })

  } catch (error) {
    console.error('Pro payment verification error:', error)
    return NextResponse.json(
      { error: 'Failed to verify Pro payments' },
      { status: 500 }
    )
  }
}