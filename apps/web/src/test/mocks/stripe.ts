import { vi } from 'vitest'

// Mock Stripe objects
export const mockStripeSession = {
  id: 'cs_test_mock_session_id',
  url: 'https://checkout.stripe.com/pay/cs_test_mock_session_id',
  customer_email: 'test@example.com',
  metadata: {
    userId: 'test-user-id',
    planType: 'monthly',
    savePasses: '3',
  },
  payment_status: 'paid',
}

export const mockStripeCustomer = {
  id: 'cus_test_mock_customer_id',
  email: 'test@example.com',
  name: 'Test User',
}

export const mockStripeSubscription = {
  id: 'sub_test_mock_subscription_id',
  customer: 'cus_test_mock_customer_id',
  status: 'active',
  current_period_start: Date.now() / 1000,
  current_period_end: (Date.now() + 30 * 24 * 60 * 60 * 1000) / 1000,
  items: {
    data: [
      {
        id: 'si_test_mock_subscription_item_id',
        price: {
          id: 'price_test_monthly',
          unit_amount: 249,
          currency: 'usd',
          recurring: { interval: 'month' },
        },
      },
    ],
  },
}

export const mockStripeWebhookEvent = {
  id: 'evt_test_webhook',
  type: 'checkout.session.completed',
  data: {
    object: mockStripeSession,
  },
  created: Date.now() / 1000,
}

// Mock Stripe instance
export const createMockStripe = () => ({
  checkout: {
    sessions: {
      create: vi.fn().mockResolvedValue(mockStripeSession),
      retrieve: vi.fn().mockResolvedValue(mockStripeSession),
    },
  },
  customers: {
    create: vi.fn().mockResolvedValue(mockStripeCustomer),
    retrieve: vi.fn().mockResolvedValue(mockStripeCustomer),
  },
  subscriptions: {
    retrieve: vi.fn().mockResolvedValue(mockStripeSubscription),
    cancel: vi.fn().mockResolvedValue({
      ...mockStripeSubscription,
      status: 'canceled',
    }),
  },
  webhooks: {
    constructEvent: vi.fn().mockReturnValue(mockStripeWebhookEvent),
  },
})

// Mock client-side Stripe
export const createMockStripeJs = () => ({
  redirectToCheckout: vi.fn().mockResolvedValue({ error: null }),
  elements: vi.fn().mockReturnValue({
    create: vi.fn().mockReturnValue({
      mount: vi.fn(),
      unmount: vi.fn(),
      on: vi.fn(),
    }),
    submit: vi.fn().mockResolvedValue({ error: null }),
  }),
})

// Mock loadStripe function
export const mockLoadStripe = vi.fn().mockResolvedValue(createMockStripeJs())