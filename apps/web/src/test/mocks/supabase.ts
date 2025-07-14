import { vi } from 'vitest'
import type { Database } from '@/lib/supabase'

// Mock user data for testing
export const mockUser = {
  id: 'test-user-id',
  email: 'test@example.com',
  full_name: 'Test User',
  avatar_url: null,
  is_pro: false,
  timezone: 'UTC',
  theme: 'light' as const,
  created_at: '2023-01-01T00:00:00.000Z',
  updated_at: '2023-01-01T00:00:00.000Z',
}

export const mockProUser = {
  ...mockUser,
  id: 'test-pro-user-id',
  email: 'pro@example.com',
  is_pro: true,
}

export const mockStreak = {
  id: 'test-streak-id',
  user_id: mockUser.id,
  current_streak: 5,
  longest_streak: 10,
  last_session_date: '2023-01-01',
  total_sessions: 25,
  created_at: '2023-01-01T00:00:00.000Z',
  updated_at: '2023-01-01T00:00:00.000Z',
}

export const mockSession = {
  id: 'test-session-id',
  user_id: mockUser.id,
  session_date: '2023-01-01',
  duration_minutes: 25,
  session_type: 'work' as const,
  completed_at: '2023-01-01T00:25:00.000Z',
  created_at: '2023-01-01T00:00:00.000Z',
}

export const mockSavePasses = {
  user_id: mockProUser.id,
  passes_left: 3,
  updated_at: '2023-01-01T00:00:00.000Z',
}

// Create mock Supabase client
export const createMockSupabaseClient = () => ({
  auth: {
    getSession: vi.fn().mockResolvedValue({
      data: {
        session: {
          access_token: 'mock-access-token',
          user: mockUser,
        },
      },
      error: null,
    }),
    getUser: vi.fn().mockResolvedValue({
      data: { user: mockUser },
      error: null,
    }),
    signInWithOAuth: vi.fn().mockResolvedValue({
      data: { url: 'https://oauth-redirect-url.com' },
      error: null,
    }),
    signOut: vi.fn().mockResolvedValue({
      error: null,
    }),
    onAuthStateChange: vi.fn().mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } },
    }),
  },
  from: vi.fn((table: string) => {
    const mockData = {
      users: [mockUser, mockProUser],
      streaks: [mockStreak],
      sessions: [mockSession],
      save_passes: [mockSavePasses],
    }

    return {
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      gte: vi.fn().mockReturnThis(),
      lte: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({
        data: mockData[table as keyof typeof mockData]?.[0] || null,
        error: null,
      }),
      maybeSingle: vi.fn().mockResolvedValue({
        data: mockData[table as keyof typeof mockData]?.[0] || null,
        error: null,
      }),
      then: vi.fn().mockResolvedValue({
        data: mockData[table as keyof typeof mockData] || [],
        error: null,
      }),
    }
  }),
  rpc: vi.fn().mockImplementation((functionName: string, params: any) => {
    const mockResponses = {
      handle_pro_upgrade: { data: null, error: null },
      consume_save_pass: { data: true, error: null },
      update_streak_with_save_pass: {
        data: {
          current_streak: 6,
          longest_streak: 10,
          save_pass_used: false,
          total_sessions: 26,
        },
        error: null,
      },
    }

    return Promise.resolve(
      mockResponses[functionName as keyof typeof mockResponses] || {
        data: null,
        error: { message: `Mock function ${functionName} not implemented` },
      }
    )
  }),
})