import { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { vi } from 'vitest'

// Mock providers for testing
const TestProviders = ({ children }: { children: React.ReactNode }) => {
  return <div data-testid="test-providers">{children}</div>
}

// Custom render function that includes providers
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: TestProviders, ...options })

// Test data generators
export const generateMockUser = (overrides = {}) => ({
  id: 'test-user-id',
  email: 'test@example.com',
  full_name: 'Test User',
  avatar_url: null,
  is_pro: false,
  timezone: 'UTC',
  theme: 'light' as const,
  created_at: '2023-01-01T00:00:00.000Z',
  updated_at: '2023-01-01T00:00:00.000Z',
  ...overrides,
})

export const generateMockSession = (overrides = {}) => ({
  id: 'test-session-id',
  user_id: 'test-user-id',
  session_date: '2023-01-01',
  duration_minutes: 25,
  session_type: 'work' as const,
  completed_at: '2023-01-01T00:25:00.000Z',
  created_at: '2023-01-01T00:00:00.000Z',
  ...overrides,
})

export const generateMockStreak = (overrides = {}) => ({
  id: 'test-streak-id',
  user_id: 'test-user-id',
  current_streak: 5,
  longest_streak: 10,
  last_session_date: '2023-01-01',
  total_sessions: 25,
  created_at: '2023-01-01T00:00:00.000Z',
  updated_at: '2023-01-01T00:00:00.000Z',
  ...overrides,
})

// Helper functions for testing async operations
export const waitForAsync = () => new Promise(resolve => setTimeout(resolve, 0))

export const mockApiResponse = (data: any, error: any = null) => ({
  ok: !error,
  json: vi.fn().mockResolvedValue(error ? { error } : data),
  status: error ? 400 : 200,
  statusText: error ? 'Bad Request' : 'OK',
})

// Mock fetch for API testing
export const mockFetch = (response: any) => {
  global.fetch = vi.fn().mockResolvedValue(response)
}

// Timer testing utilities
export const mockTimers = () => {
  vi.useFakeTimers()
  return {
    advanceTime: (ms: number) => vi.advanceTimersByTime(ms),
    runAllTimers: () => vi.runAllTimers(),
    cleanup: () => vi.useRealTimers(),
  }
}

// Local storage testing utilities
export const mockLocalStorage = () => {
  const store: Record<string, string> = {}
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key]
    }),
    clear: vi.fn(() => {
      Object.keys(store).forEach(key => delete store[key])
    }),
    store,
  }
}

// Console testing utilities
export const mockConsole = () => ({
  log: vi.spyOn(console, 'log').mockImplementation(() => {}),
  error: vi.spyOn(console, 'error').mockImplementation(() => {}),
  warn: vi.spyOn(console, 'warn').mockImplementation(() => {}),
})

// Re-export everything from React Testing Library
export * from '@testing-library/react'
export { customRender as render }