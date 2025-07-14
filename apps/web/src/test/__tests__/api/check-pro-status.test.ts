import { describe, it, expect, beforeEach, vi } from 'vitest'
import { NextRequest } from 'next/server'
import { POST } from '../../../../app/api/check-pro-status/route'

// Mock Supabase
const mockSupabaseClient = {
  auth: {
    getUser: vi.fn(),
  },
  from: vi.fn(),
}

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => mockSupabaseClient),
}))

// Mock environment variables
vi.mock('process', () => ({
  env: {
    NEXT_PUBLIC_SUPABASE_URL: 'https://test.supabase.co',
    SUPABASE_SERVICE_ROLE_KEY: 'test-service-role-key',
  },
}))

describe('/api/check-pro-status', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const createMockRequest = (authHeader?: string, body?: any) => {
    const headers = new Headers()
    if (authHeader) {
      headers.set('authorization', authHeader)
    }

    return new NextRequest('http://localhost:3005/api/check-pro-status', {
      method: 'POST',
      headers,
      body: body ? JSON.stringify(body) : undefined,
    })
  }

  describe('Authentication', () => {
    it('should return 401 when no authorization header is provided', async () => {
      const request = createMockRequest()
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized - No auth header')
    })

    it('should return 401 when authorization header is malformed', async () => {
      const request = createMockRequest('InvalidHeader')
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

      const request = createMockRequest('Bearer invalid-token')
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
      expect(mockSupabaseClient.auth.getUser).toHaveBeenCalledWith('invalid-token')
    })
  })

  describe('User Retrieval', () => {
    const mockUser = {
      id: 'test-user-id',
      email: 'test@example.com',
      user_metadata: { full_name: 'Test User' },
    }

    beforeEach(() => {
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      })
    })

    it('should return existing pro user', async () => {
      const mockUserData = {
        id: 'test-user-id',
        email: 'test@example.com',
        full_name: 'Test User',
        is_pro: true,
        created_at: '2023-01-01T00:00:00.000Z',
        updated_at: '2023-01-01T00:00:00.000Z',
      }

      const mockSelect = {
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: mockUserData,
          error: null,
        }),
      }

      mockSupabaseClient.from.mockReturnValue({
        select: vi.fn().mockReturnValue(mockSelect),
      })

      const request = createMockRequest('Bearer valid-token')
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.user).toEqual(mockUserData)
      expect(data.isProUser).toBe(true)
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('users')
    })

    it('should return existing free user', async () => {
      const mockUserData = {
        id: 'test-user-id',
        email: 'test@example.com',
        full_name: 'Test User',
        is_pro: false,
        created_at: '2023-01-01T00:00:00.000Z',
        updated_at: '2023-01-01T00:00:00.000Z',
      }

      const mockSelect = {
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: mockUserData,
          error: null,
        }),
      }

      mockSupabaseClient.from.mockReturnValue({
        select: vi.fn().mockReturnValue(mockSelect),
      })

      const request = createMockRequest('Bearer valid-token')
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.user).toEqual(mockUserData)
      expect(data.isProUser).toBe(false)
    })
  })

  describe('User Creation', () => {
    const mockUser = {
      id: 'new-user-id',
      email: 'new@example.com',
      user_metadata: { full_name: 'New User' },
    }

    beforeEach(() => {
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      })
    })

    it('should create new user when user does not exist', async () => {
      const newUserData = {
        id: 'new-user-id',
        email: 'new@example.com',
        full_name: 'New User',
        is_pro: false,
        created_at: '2023-01-01T00:00:00.000Z',
        updated_at: '2023-01-01T00:00:00.000Z',
      }

      // Mock user not found
      const mockSelect = {
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: null,
          error: { code: 'PGRST116' }, // User not found error
        }),
      }

      // Mock user creation
      const mockInsert = {
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: newUserData,
          error: null,
        }),
      }

      mockSupabaseClient.from.mockReturnValueOnce({
        select: vi.fn().mockReturnValue(mockSelect),
      }).mockReturnValueOnce(mockInsert)

      const request = createMockRequest('Bearer valid-token')
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.user).toEqual(newUserData)
      expect(data.isProUser).toBe(false)
      expect(mockInsert.insert).toHaveBeenCalledWith({
        id: 'new-user-id',
        email: 'new@example.com',
        full_name: 'New User',
        is_pro: false,
        created_at: expect.any(String),
        updated_at: expect.any(String),
      })
    })

    it('should handle user creation error', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      // Mock user not found
      const mockSelect = {
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: null,
          error: { code: 'PGRST116' },
        }),
      }

      // Mock user creation failure
      const mockInsert = {
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: null,
          error: { message: 'Creation failed' },
        }),
      }

      mockSupabaseClient.from.mockReturnValueOnce({
        select: vi.fn().mockReturnValue(mockSelect),
      }).mockReturnValueOnce(mockInsert)

      const request = createMockRequest('Bearer valid-token')
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Failed to create user')
      expect(consoleSpy).toHaveBeenCalledWith('Failed to create user:', { message: 'Creation failed' })

      consoleSpy.mockRestore()
    })
  })

  describe('Error Handling', () => {
    const mockUser = {
      id: 'test-user-id',
      email: 'test@example.com',
      user_metadata: { full_name: 'Test User' },
    }

    beforeEach(() => {
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      })
    })

    it('should handle database query error', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const mockSelect = {
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: null,
          error: { message: 'Database error', code: 'DB_ERROR' },
        }),
      }

      mockSupabaseClient.from.mockReturnValue({
        select: vi.fn().mockReturnValue(mockSelect),
      })

      const request = createMockRequest('Bearer valid-token')
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Failed to get user')
      expect(consoleSpy).toHaveBeenCalledWith('Failed to get user:', { message: 'Database error', code: 'DB_ERROR' })

      consoleSpy.mockRestore()
    })

    it('should handle unexpected errors', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      mockSupabaseClient.auth.getUser.mockRejectedValue(new Error('Unexpected error'))

      const request = createMockRequest('Bearer valid-token')
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Failed to check Pro status')
      expect(consoleSpy).toHaveBeenCalledWith('Check Pro status error:', expect.any(Error))

      consoleSpy.mockRestore()
    })
  })
})