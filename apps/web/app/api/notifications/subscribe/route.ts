import { NextRequest, NextResponse } from 'next/server'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { z } from 'zod'

const SubscriptionSchema = z.object({
  subscription: z.object({
    endpoint: z.string().url('Invalid endpoint URL'),
    keys: z.object({
      p256dh: z.string().min(1, 'p256dh key is required'),
      auth: z.string().min(1, 'auth key is required')
    })
  })
})

export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const supabase = createServerComponentClient({ cookies })
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Validate request body
    const body = await request.json()
    const validationResult = SubscriptionSchema.safeParse(body)
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Invalid subscription data',
          details: validationResult.error.issues
        },
        { status: 400 }
      )
    }

    const { subscription } = validationResult.data
    const userId = user.id // Use authenticated user's ID

    // For demo purposes, we'll just log the subscription
    // In production, you'd store this in a database table
    console.log('User subscription:', userId, subscription)

    // You could store push subscriptions in a separate table:
    /*
    const { error } = await supabase
      .from('push_subscriptions')
      .upsert({
        user_id: userId,
        endpoint: subscription.endpoint,
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
        updated_at: new Date().toISOString()
      })

    if (error) {
      console.error('Error storing subscription:', error)
      return NextResponse.json(
        { error: 'Failed to store subscription' },
        { status: 500 }
      )
    }
    */

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Subscription error:', error)
    return NextResponse.json(
      { error: 'Failed to process subscription' },
      { status: 500 }
    )
  }
}