import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Step 1: API started')
    
    // Test imports one by one
    const { createClient } = await import('@supabase/supabase-js')
    console.log('🔍 Step 2: Supabase import success')
    
    const { z } = await import('zod')
    console.log('🔍 Step 3: Zod import success')
    
    const Stripe = (await import('stripe')).default
    console.log('🔍 Step 4: Stripe import success')
    
    const { STRIPE_PRICES } = await import('@/lib/stripe')
    console.log('🔍 Step 5: Stripe lib import success')
    
    console.log('🔍 Step 6: All imports successful')
    
    // Test basic auth
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('❌ No auth header')
      return NextResponse.json({ error: 'No auth' }, { status: 401 })
    }
    
    console.log('🔍 Step 7: Auth header exists')
    
    // Test environment variables
    const hasStripeSecret = !!process.env.STRIPE_SECRET_KEY
    const hasSupabaseUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL
    const hasSupabaseService = !!process.env.SUPABASE_SERVICE_ROLE_KEY
    
    console.log('🔍 Step 8: Environment check', {
      hasStripeSecret,
      hasSupabaseUrl,
      hasSupabaseService
    })
    
    if (!hasStripeSecret || !hasSupabaseUrl || !hasSupabaseService) {
      return NextResponse.json({
        error: 'Missing environment variables',
        details: { hasStripeSecret, hasSupabaseUrl, hasSupabaseService }
      }, { status: 503 })
    }
    
    console.log('🔍 Step 9: All checks passed - should work now')
    
    return NextResponse.json({
      status: 'debug_success',
      message: 'All imports and env vars working',
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('❌ Debug error:', error)
    return NextResponse.json({
      error: 'Debug failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack?.split('\n').slice(0, 5) : 'No stack'
    }, { status: 500 })
  }
}