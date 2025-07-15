import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Test API called')
    
    return NextResponse.json({
      status: 'success',
      timestamp: new Date().toISOString(),
      env: {
        hasStripeSecret: !!process.env.STRIPE_SECRET_KEY,
        hasStripePublishable: !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
        hasSupabaseService: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
        hasAppUrl: !!process.env.NEXT_PUBLIC_APP_URL,
        secretKeyPrefix: process.env.STRIPE_SECRET_KEY?.substring(0, 8),
        appUrl: process.env.NEXT_PUBLIC_APP_URL
      }
    })
  } catch (error) {
    console.error('❌ Test API error:', error)
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}