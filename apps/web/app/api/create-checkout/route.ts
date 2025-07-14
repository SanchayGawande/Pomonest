import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'
import { stripe, STRIPE_PRICES, PRO_PLANS, type ProPlan, isStripeConfigured } from '@/lib/stripe'

const CreateCheckoutSchema = z.object({
  priceId: z.string().min(1, 'Price ID is required')
})

export async function POST(request: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('❌ API Route: No authorization header')
      return NextResponse.json(
        { error: 'Unauthorized - No auth header' },
        { status: 401 }
      )
    }

    const token = authHeader.replace('Bearer ', '')
    
    // Create Supabase client with service role key for server-side auth
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    
    // Verify the JWT token
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    // User authenticated successfully
    
    if (authError || !user) {
      console.log('❌ API Route: Authentication failed')
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Validate request body
    const body = await request.json()
    const validationResult = CreateCheckoutSchema.safeParse(body)
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Invalid request data',
          details: validationResult.error.issues
        },
        { status: 400 }
      )
    }
    
    // Validation passed

    const { priceId } = validationResult.data
    const userId = user.id // Use authenticated user's ID instead of request body

    // Check if Stripe is properly configured on server-side
    const serverStripeConfigured = process.env.STRIPE_SECRET_KEY && 
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY &&
      process.env.STRIPE_PRICE_ID_MONTHLY &&
      process.env.STRIPE_PRICE_ID_YEARLY
    
    // Stripe configuration verified
    
    if (!serverStripeConfigured || !stripe) {
      console.log('❌ Stripe not configured properly on server')
      return NextResponse.json(
        { error: 'Payment processing not available' },
        { status: 503 }
      )
    }

    // Validate the price ID using server-side env vars
    const validPriceIds = [
      process.env.STRIPE_PRICE_ID_MONTHLY!,
      process.env.STRIPE_PRICE_ID_YEARLY!
    ]
    // Price ID validation
    
    if (!validPriceIds.includes(priceId)) {
      console.log('❌ Invalid price ID')
      return NextResponse.json(
        { error: 'Invalid price ID' },
        { status: 400 }
      )
    }
    
    // Price ID validated

    // Use the authenticated user's email directly
    const userEmail = user.email
    if (!userEmail) {
      console.log('❌ API Route: No email found for user')
      return NextResponse.json(
        { error: 'User email not found' },
        { status: 400 }
      )
    }
    
    // User authenticated

    // Determine the plan type and save passes
    let planType: ProPlan = 'monthly'
    let savePasses = 3

    if (priceId === process.env.STRIPE_PRICE_ID_YEARLY!) {
      planType = 'yearly'
      savePasses = 12
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription', // Subscription mode for recurring prices
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      customer_email: userEmail,
      metadata: {
        userId,
        planType,
        savePasses: savePasses.toString(),
      },
      success_url: `${process.env.NEXTAUTH_URL}/?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/?canceled=true`,
      allow_promotion_codes: true,
    })

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    })

  } catch (error) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}