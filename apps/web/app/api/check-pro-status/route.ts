import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { ApiErrorHandler, validateBearerToken } from '@/lib/api-utils'

export async function POST(request: NextRequest) {
  try {
    // Enhanced token validation
    const authHeader = request.headers.get('authorization')
    const token = validateBearerToken(authHeader)
    
    if (!token) {
      return ApiErrorHandler.createErrorResponse({
        message: 'Authentication required',
        status: 401
      })
    }
    
    // Create Supabase client with service role key for server-side auth
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    
    // Verify the JWT token with enhanced error handling
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      console.error('Token validation failed:', authError?.message)
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      )
    }

    // Check if user exists in users table
    let { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    // If user doesn't exist, create them
    if (userError && userError.code === 'PGRST116') {
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert({
          id: user.id,
          email: user.email!,
          full_name: user.user_metadata?.full_name || null,
          is_pro: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single()

      if (createError) {
        console.error('Failed to create user:', createError)
        return NextResponse.json(
          { error: 'Failed to create user' },
          { status: 500 }
        )
      }

      userData = newUser
    } else if (userError) {
      console.error('Failed to get user:', userError)
      return NextResponse.json(
        { error: 'Failed to get user' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      user: userData,
      isProUser: userData?.is_pro || false
    })

  } catch (error) {
    console.error('Check Pro status error:', error)
    return NextResponse.json(
      { error: 'Failed to check Pro status' },
      { status: 500 }
    )
  }
}