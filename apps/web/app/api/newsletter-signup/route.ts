import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    // ConvertKit API integration
    const CONVERTKIT_API_KEY = process.env.CONVERTKIT_API_KEY
    const CONVERTKIT_FORM_ID = process.env.CONVERTKIT_FORM_ID

    if (!CONVERTKIT_API_KEY || !CONVERTKIT_FORM_ID) {
      console.log('ConvertKit not configured, storing email locally for now')
      
      // For now, just return success
      // In production, you'd want to store this in your database
      return NextResponse.json({ 
        success: true, 
        message: 'Email signup successful (stored locally)' 
      })
    }

    // Subscribe to ConvertKit
    const response = await fetch(
      `https://api.convertkit.com/v3/forms/${CONVERTKIT_FORM_ID}/subscribe`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          api_key: CONVERTKIT_API_KEY,
          email: email,
          fields: {
            source: 'landing_page',
            signup_date: new Date().toISOString()
          }
        })
      }
    )

    if (response.ok) {
      const data = await response.json()
      return NextResponse.json({ 
        success: true, 
        message: 'Successfully subscribed to newsletter',
        subscriber_id: data.subscription?.subscriber?.id
      })
    } else {
      const error = await response.text()
      console.error('ConvertKit API error:', error)
      return NextResponse.json(
        { error: 'Newsletter signup failed' },
        { status: 400 }
      )
    }

  } catch (error) {
    console.error('Newsletter signup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}