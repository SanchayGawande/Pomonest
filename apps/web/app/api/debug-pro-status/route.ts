import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
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
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    console.log(`🔍 Debug Pro status check for user: ${user.id}`)

    // Check if user exists in users table
    let { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    console.log('📊 Current user data in database:', userData)
    console.log('❌ User query error (if any):', userError)

    // If user doesn't exist, this might be the issue
    if (userError && userError.code === 'PGRST116') {
      console.log('⚠️ User not found in users table - this might be the issue!')
      
      // Create the user with Pro status
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert({
          id: user.id,
          email: user.email!,
          full_name: user.user_metadata?.full_name || null,
          is_pro: true, // Set as Pro immediately
          subscription_type: 'monthly', // Default to monthly
          subscription_status: 'active',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single()

      if (createError) {
        console.error('❌ Failed to create Pro user:', createError)
        return NextResponse.json(
          { error: 'Failed to create Pro user', details: createError },
          { status: 500 }
        )
      }

      console.log('✅ Created new Pro user:', newUser)
      userData = newUser
    } else if (userError) {
      console.error('❌ Database error:', userError)
      return NextResponse.json(
        { error: 'Database error', details: userError },
        { status: 500 }
      )
    } else if (userData && !userData.is_pro) {
      // User exists but is not Pro - let's fix this
      console.log('🔧 User exists but is not Pro, upgrading...')
      
      const { data: updatedUser, error: updateError } = await supabase
        .from('users')
        .update({ 
          is_pro: true,
          subscription_type: 'monthly', // Default to monthly
          subscription_status: 'active',
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
        .select()
        .single()

      if (updateError) {
        console.error('❌ Failed to update Pro status:', updateError)
        return NextResponse.json(
          { error: 'Failed to update Pro status', details: updateError },
          { status: 500 }
        )
      }

      console.log('✅ Updated user to Pro:', updatedUser)
      userData = updatedUser
    }

    // Also check for any Stripe payment records (if you have a payments table)
    try {
      const { data: payments, error: paymentsError } = await supabase
        .from('payments')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      console.log('💳 Payment records:', payments)
      if (paymentsError) {
        console.log('💳 Payments table error (might not exist):', paymentsError)
      }
    } catch (e) {
      console.log('💳 Payments table might not exist:', e)
    }

    return NextResponse.json({
      success: true,
      user: userData,
      isProUser: userData?.is_pro || false,
      authUser: {
        id: user.id,
        email: user.email,
        metadata: user.user_metadata
      },
      message: 'Debug complete - user should now be Pro'
    })

  } catch (error) {
    console.error('🚨 Debug Pro status error:', error)
    return NextResponse.json(
      { error: 'Debug failed', details: error },
      { status: 500 }
    )
  }
}