import { createServerClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const cookieStore = cookies()
    const supabase = createServerClient()
    
    try {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error('Auth callback error:', error)
        return NextResponse.redirect(`${requestUrl.origin}/auth/login?error=auth_callback_error`)
      }

      if (data.session) {
        // Create response and set session cookies
        const response = NextResponse.redirect(`${requestUrl.origin}/`)
        
        // Set auth cookies manually to ensure they're available on the client
        response.cookies.set('sb-access-token', data.session.access_token, {
          path: '/',
          httpOnly: false,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: data.session.expires_in
        })

        response.cookies.set('sb-refresh-token', data.session.refresh_token, {
          path: '/',
          httpOnly: false,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7 // 7 days
        })

        return response
      }
    } catch (error) {
      console.error('Auth callback exception:', error)
      return NextResponse.redirect(`${requestUrl.origin}/auth/login?error=auth_callback_error`)
    }
  }

  // Redirect to the main page
  return NextResponse.redirect(`${requestUrl.origin}/`)
}