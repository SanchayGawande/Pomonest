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

    console.log(`Manual Pro upgrade requested for user: ${user.id}`)

    // Ensure user exists in users table and set is_pro to true
    const { data: userData, error: upsertError } = await supabase
      .from('users')
      .upsert({
        id: user.id,
        email: user.email!,
        full_name: user.user_metadata?.full_name || null,
        is_pro: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'id'
      })
      .select()
      .single()

    if (upsertError) {
      console.error('Failed to upgrade user to Pro:', upsertError)
      return NextResponse.json(
        { error: 'Failed to upgrade user to Pro', details: upsertError },
        { status: 500 }
      )
    }

    // Also try to add some save passes
    try {
      const { error: rpcError } = await supabase.rpc('handle_pro_upgrade', {
        user_id_param: user.id,
        passes_to_add: 3, // Default to monthly plan
      })

      if (rpcError) {
        console.warn('RPC handle_pro_upgrade failed, but user is still Pro:', rpcError)
        // This is not critical since we already set is_pro = true
      }
    } catch (rpcError) {
      console.warn('RPC function not available, but user is still Pro:', rpcError)
    }

    console.log(`Successfully upgraded user ${user.id} to Pro`)

    return NextResponse.json({
      success: true,
      user: userData,
      isProUser: true,
      message: 'User successfully upgraded to Pro'
    })

  } catch (error) {
    console.error('Manual Pro upgrade error:', error)
    return NextResponse.json(
      { error: 'Failed to upgrade to Pro', details: error },
      { status: 500 }
    )
  }
}