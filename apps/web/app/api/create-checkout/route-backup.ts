// Backup of original route
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'
import { STRIPE_PRICES, PRO_PLANS, type ProPlan, isStripeConfigured } from '@/lib/stripe'
import Stripe from 'stripe'

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
    console.log('🔍 Stripe configuration check:', {
      hasSecretKey: !!process.env.STRIPE_SECRET_KEY,
      hasPublishableKey: !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      secretKeyPrefix: process.env.STRIPE_SECRET_KEY?.substring(0, 8)
    })
    
    const secretKey = process.env.STRIPE_SECRET_KEY
    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    
    if (!secretKey || !publishableKey) {
      console.log('❌ Stripe keys missing on server')
      return NextResponse.json(
        { error: 'Payment processing not available - missing keys' },
        { status: 503 }
      )
    }
    
    // Create Stripe instance directly to avoid import issues
    const stripe = new Stripe(secretKey, {
      apiVersion: '2024-11-20',
    })

    // Validate the price ID using imported constants
    const validPriceIds = Object.values(STRIPE_PRICES)
    
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

    if (priceId === 'price_1RkyyKD3Fz9WQTDWuz33REin') {
      planType = 'yearly'
      savePasses = 12
    }

    // Create Stripe checkout session
    console.log('🛒 Creating checkout session with:', {
      priceId,
      userEmail,
      userId,
      planType,
      savePasses
    })
    
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
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://pomonest.com'}/?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://pomonest.com'}/?canceled=true`,
      allow_promotion_codes: true,
    })
    
    console.log('✅ Checkout session created successfully:', session.id)

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    })

  } catch (error) {
    console.error('❌ Stripe checkout error:', error)
    console.error('❌ Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace',
      name: error instanceof Error ? error.name : 'Unknown error type',
      cause: error instanceof Error ? error.cause : 'No cause'
    })
    
    // Log specific Stripe error details if it's a Stripe error
    if (error && typeof error === 'object' && 'type' in error) {
      console.error('❌ Stripe error details:', {
        type: error.type,
        code: error.code,
        param: error.param,
        statusCode: error.statusCode
      })
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to create checkout session',
        details: error instanceof Error ? error.message : 'Unknown error',
        debug: {
          errorName: error instanceof Error ? error.name : 'Unknown',
          errorStack: error instanceof Error ? error.stack?.split('\n').slice(0, 3) : 'No stack',
          hasSecretKey: !!process.env.STRIPE_SECRET_KEY,
          hasPublishableKey: !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
          appUrl: process.env.NEXT_PUBLIC_APP_URL,
          secretKeyPrefix: process.env.STRIPE_SECRET_KEY?.substring(0, 8),
          priceId,
          userId
        }
      },
      { status: 500 }
    )
  }
}