import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const supabase = createRouteHandlerClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const userId = user.id // Use authenticated user's ID

    // For demo purposes, we'll just log the unsubscription
    // In production, you'd remove the subscription from the database
    console.log('User unsubscribed:', userId)

    /*
    const { error } = await supabase
      .from('push_subscriptions')
      .delete()
      .eq('user_id', userId)

    if (error) {
      console.error('Error removing subscription:', error)
      return NextResponse.json(
        { error: 'Failed to remove subscription' },
        { status: 500 }
      )
    }
    */

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Unsubscription error:', error)
    return NextResponse.json(
      { error: 'Failed to process unsubscription' },
      { status: 500 }
    )
  }
}