import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Minimal API test started')
    
    // Test 1: Basic response
    return NextResponse.json({
      status: 'minimal_test_success',
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('❌ Minimal API error:', error)
    return NextResponse.json(
      { 
        error: 'Minimal test failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}