import { describe, it, expect, beforeEach, vi } from 'vitest'
import { NextRequest } from 'next/server'
import { POST } from '../../../../app/api/create-checkout/route'

// Mock Supabase
const mockSupabaseClient = {
  auth: {
    getUser: vi.fn(),
  },
}

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => mockSupabaseClient),
}))

// Mock Stripe
vi.mock('@/lib/stripe', () => {
  const mockStripe = {
    checkout: {
      sessions: {
        create: vi.fn(),
      },
    },
  }

  return {
    stripe: mockStripe,
    STRIPE_PRICES: {
      PRO_MONTHLY: 'price_monthly_test',
      PRO_YEARLY: 'price_yearly_test',
    },
    PRO_PLANS: {
      monthly: { priceId: 'price_monthly_test', savePasses: 3 },
      yearly: { priceId: 'price_yearly_test', savePasses: 12 },
    },
    isStripeConfigured: vi.fn(() => true),
  }
})

// Mock environment variables
const mockEnv = {
  NEXT_PUBLIC_SUPABASE_URL: 'https://test.supabase.co',
  SUPABASE_SERVICE_ROLE_KEY: 'test-service-role-key',
  STRIPE_SECRET_KEY: 'sk_test_123',
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: 'pk_test_123',
  STRIPE_PRICE_ID_MONTHLY: 'price_monthly_test',
  STRIPE_PRICE_ID_YEARLY: 'price_yearly_test',
  NEXTAUTH_URL: 'http://localhost:3005',
}

vi.stubGlobal('process', { env: mockEnv })

describe('/api/create-checkout', () => {
  let mockStripe: any

  beforeEach(async () => {
    vi.clearAllMocks()
    
    // Get the mocked stripe instance
    const stripeModule = await import('@/lib/stripe')
    mockStripe = stripeModule.stripe
    
    // Default mock implementations
    mockSupabaseClient.auth.getUser.mockResolvedValue({
      data: {
        user: {
          id: 'test-user-id',
          email: 'test@example.com',
        },
      },
      error: null,
    })

    mockStripe.checkout.sessions.create.mockResolvedValue({
      id: 'cs_test_session_id',
      url: 'https://checkout.stripe.com/pay/cs_test_session_id',
    })
  })

  const createMockRequest = (authHeader?: string, body?: any) => {
    const headers = new Headers()
    if (authHeader) {
      headers.set('authorization', authHeader)
    }
    headers.set('content-type', 'application/json')

    return new NextRequest('http://localhost:3005/api/create-checkout', {
      method: 'POST',
      headers,
      body: body ? JSON.stringify(body) : undefined,
    })
  }

  describe('Authentication', () => {
    it('should return 401 when no authorization header is provided', async () => {
      const request = createMockRequest(undefined, { priceId: 'price_monthly_test' })
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized - No auth header')
    })

    it('should return 401 when authorization header is malformed', async () => {
      const request = createMockRequest('InvalidHeader', { priceId: 'price_monthly_test' })
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized - No auth header')
    })

    it('should return 401 when JWT token is invalid', async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValueOnce({
        data: { user: null },
        error: { message: 'Invalid JWT' },
      })

      const request = createMockRequest('Bearer invalid-token', { priceId: 'price_monthly_test' })
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })

    it('should return 400 when user has no email', async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValueOnce({
        data: {
          user: {
            id: 'test-user-id',
            email: null, // No email
          },
        },
        error: null,
      })

      const request = createMockRequest('Bearer valid-token', { priceId: 'price_monthly_test' })
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('User email not found')
    })
  })

  describe('Request Validation', () => {
    it('should return 400 when priceId is missing', async () => {
      const request = createMockRequest('Bearer valid-token', {})
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Invalid request data')
      expect(data.details).toBeDefined()
    })

    it('should return 400 when priceId is empty string', async () => {
      const request = createMockRequest('Bearer valid-token', { priceId: '' })
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Invalid request data')
    })

    it('should return 400 when priceId is invalid', async () => {
      const request = createMockRequest('Bearer valid-token', { priceId: 'invalid_price_id' })
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Invalid price ID')
    })
  })

  describe('Stripe Configuration', () => {
    it('should return 503 when Stripe is not configured', async () => {
      // Temporarily remove Stripe config
      const originalEnv = { ...mockEnv }
      vi.stubGlobal('process', { env: { ...mockEnv, STRIPE_SECRET_KEY: undefined } })

      const request = createMockRequest('Bearer valid-token', { priceId: 'price_monthly_test' })
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(503)
      expect(data.error).toBe('Payment processing not available')

      // Restore env
      vi.stubGlobal('process', { env: originalEnv })
    })
  })

  describe('Checkout Session Creation', () => {
    it('should create monthly checkout session successfully', async () => {
      const request = createMockRequest('Bearer valid-token', { priceId: 'price_monthly_test' })
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.sessionId).toBe('cs_test_session_id')
      expect(data.url).toBe('https://checkout.stripe.com/pay/cs_test_session_id')

      expect(mockStripe.checkout.sessions.create).toHaveBeenCalledWith({
        mode: 'subscription',
        payment_method_types: ['card'],
        line_items: [
          {
            price: 'price_monthly_test',
            quantity: 1,
          },
        ],
        customer_email: 'test@example.com',
        metadata: {
          userId: 'test-user-id',
          planType: 'monthly',
          savePasses: '3',
        },
        success_url: 'http://localhost:3005/?success=true&session_id={CHECKOUT_SESSION_ID}',
        cancel_url: 'http://localhost:3005/?canceled=true',
        allow_promotion_codes: true,
      })
    })

    it('should create yearly checkout session successfully', async () => {
      const request = createMockRequest('Bearer valid-token', { priceId: 'price_yearly_test' })
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.sessionId).toBe('cs_test_session_id')
      expect(data.url).toBe('https://checkout.stripe.com/pay/cs_test_session_id')

      expect(mockStripe.checkout.sessions.create).toHaveBeenCalledWith(
        expect.objectContaining({
          metadata: {
            userId: 'test-user-id',
            planType: 'yearly',
            savePasses: '12',
          },
        })
      )
    })

    it('should handle Stripe checkout session creation error', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      mockStripe.checkout.sessions.create.mockRejectedValueOnce(
        new Error('Stripe API error')
      )

      const request = createMockRequest('Bearer valid-token', { priceId: 'price_monthly_test' })
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Failed to create checkout session')
      expect(consoleSpy).toHaveBeenCalledWith('Stripe checkout error:', expect.any(Error))

      consoleSpy.mockRestore()
    })
  })

  describe('Plan Type Detection', () => {
    it('should correctly detect monthly plan', async () => {
      const request = createMockRequest('Bearer valid-token', { priceId: 'price_monthly_test' })
      await POST(request)

      expect(mockStripe.checkout.sessions.create).toHaveBeenCalledWith(
        expect.objectContaining({
          metadata: expect.objectContaining({
            planType: 'monthly',
            savePasses: '3',
          }),
        })
      )
    })

    it('should correctly detect yearly plan', async () => {
      const request = createMockRequest('Bearer valid-token', { priceId: 'price_yearly_test' })
      await POST(request)

      expect(mockStripe.checkout.sessions.create).toHaveBeenCalledWith(
        expect.objectContaining({
          metadata: expect.objectContaining({
            planType: 'yearly',
            savePasses: '12',
          }),
        })
      )
    })
  })

  describe('Error Handling', () => {
    it('should handle unexpected errors', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      mockSupabaseClient.auth.getUser.mockRejectedValueOnce(new Error('Unexpected error'))

      const request = createMockRequest('Bearer valid-token', { priceId: 'price_monthly_test' })
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Failed to create checkout session')
      expect(consoleSpy).toHaveBeenCalledWith('Stripe checkout error:', expect.any(Error))

      consoleSpy.mockRestore()
    })

    it('should handle JSON parsing errors', async () => {
      const request = new NextRequest('http://localhost:3005/api/create-checkout', {
        method: 'POST',
        headers: {
          'authorization': 'Bearer valid-token',
          'content-type': 'application/json',
        },
        body: 'invalid json',
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Failed to create checkout session')
    })
  })
})