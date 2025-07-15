import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Starting checkout API with updated Stripe keys')
    
    // Dynamic imports to ensure they work
    const { createClient } = await import('@supabase/supabase-js')
    const { z } = await import('zod')
    const Stripe = (await import('stripe')).default
    const { STRIPE_PRICES } = await import('@/lib/stripe')
    
    console.log('✅ All imports successful')
    
    const CreateCheckoutSchema = z.object({
      priceId: z.string().min(1, 'Price ID is required')
    })

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
    
    if (authError || !user) {
      console.log('❌ API Route: Authentication failed')
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    console.log('✅ User authenticated:', user.email)

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

    const { priceId } = validationResult.data
    const userId = user.id

    // Check environment variables
    const secretKey = process.env.STRIPE_SECRET_KEY
    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    
    if (!secretKey || !publishableKey) {
      console.log('❌ Stripe keys missing on server')
      return NextResponse.json(
        { error: 'Payment processing not available - missing keys' },
        { status: 503 }
      )
    }
    
    console.log('✅ Stripe keys present')
    
    // Create Stripe instance
    const stripe = new Stripe(secretKey, {
      apiVersion: '2024-11-20',
    })

    // Validate the price ID
    const validPriceIds = Object.values(STRIPE_PRICES)
    
    if (!validPriceIds.includes(priceId)) {
      console.log('❌ Invalid price ID:', priceId)
      return NextResponse.json(
        { error: 'Invalid price ID' },
        { status: 400 }
      )
    }
    
    console.log('✅ Price ID validated:', priceId)

    // Use the authenticated user's email
    const userEmail = user.email
    if (!userEmail) {
      console.log('❌ API Route: No email found for user')
      return NextResponse.json(
        { error: 'User email not found' },
        { status: 400 }
      )
    }

    // Determine the plan type and save passes
    let planType = 'monthly'
    let savePasses = 3

    if (priceId === 'price_1RkyyKD3Fz9WQTDWuz33REin') {
      planType = 'yearly'
      savePasses = 12
    }

    console.log('🛒 Creating checkout session for:', { priceId, userEmail, planType })
    
    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
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
    return NextResponse.json(
      { 
        error: 'Failed to create checkout session',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}