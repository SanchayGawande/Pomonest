import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AuthProvider, useAuth } from '@/components/auth/AuthProvider'

// Create a mock supabase client
const mockSupabase = {
  auth: {
    getSession: vi.fn().mockResolvedValue({
      data: {
        session: {
          access_token: 'mock-access-token',
          user: { id: 'test-user-id', email: 'test@example.com' },
        },
      },
      error: null,
    }),
    getUser: vi.fn().mockResolvedValue({
      data: { user: { id: 'test-user-id', email: 'test@example.com' } },
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
}

// Mock the supabase module
vi.mock('@/lib/supabase', () => ({
  supabase: mockSupabase,
}))

// Test component to access auth context
function TestComponent() {
  const { user, loading, signInWithGoogle, signInWithApple, signOut } = useAuth()
  
  return (
    <div>
      <div data-testid="loading">{loading ? 'loading' : 'loaded'}</div>
      <div data-testid="user">{user ? user.email : 'no user'}</div>
      <button data-testid="google-signin" onClick={signInWithGoogle}>
        Sign in with Google
      </button>
      <button data-testid="apple-signin" onClick={signInWithApple}>
        Sign in with Apple
      </button>
      <button data-testid="signout" onClick={signOut}>
        Sign out
      </button>
    </div>
  )
}

// Component to test hook outside provider
function TestComponentOutsideProvider() {
  try {
    useAuth()
    return <div>Should not render</div>
  } catch (error) {
    return <div data-testid="error">Error: {(error as Error).message}</div>
  }
}

describe('AuthProvider', () => {
  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('Initialization', () => {
    it('should show loading state initially', () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      expect(screen.getByTestId('loading')).toHaveTextContent('loading')
    })

    it('should fetch initial session on mount', async () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      await waitFor(() => {
        expect(mockSupabase.auth.getSession).toHaveBeenCalled()
      })
    })

    it('should set up auth state change listener', async () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      await waitFor(() => {
        expect(mockSupabase.auth.onAuthStateChange).toHaveBeenCalled()
      })
    })
  })

  describe('User State Management', () => {
    it('should display user when authenticated', async () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('user')).toHaveTextContent('test@example.com')
        expect(screen.getByTestId('loading')).toHaveTextContent('loaded')
      })
    })

    it('should display no user when not authenticated', async () => {
      // Mock no session
      mockSupabase.auth.getSession.mockResolvedValueOnce({
        data: { session: null },
        error: null,
      })

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('user')).toHaveTextContent('no user')
        expect(screen.getByTestId('loading')).toHaveTextContent('loaded')
      })
    })

    it('should handle session error gracefully', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      
      mockSupabase.auth.getSession.mockResolvedValueOnce({
        data: { session: null },
        error: { message: 'Session error' },
      })

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Session error:', { message: 'Session error' })
        expect(screen.getByTestId('loading')).toHaveTextContent('loaded')
      })

      consoleSpy.mockRestore()
    })
  })

  describe('Authentication Methods', () => {
    beforeEach(() => {
      // Mock window.location for redirect URLs
      Object.defineProperty(window, 'location', {
        value: { origin: 'http://localhost:3005' },
        writable: true,
      })
    })

    it('should handle Google sign in', async () => {
      const user = userEvent.setup()
      
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('loaded')
      })

      await act(async () => {
        await user.click(screen.getByTestId('google-signin'))
      })

      expect(mockSupabase.auth.signInWithOAuth).toHaveBeenCalledWith({
        provider: 'google',
        options: {
          redirectTo: 'http://localhost:3005/',
        },
      })
    })

    it('should handle Apple sign in', async () => {
      const user = userEvent.setup()
      
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('loaded')
      })

      await act(async () => {
        await user.click(screen.getByTestId('apple-signin'))
      })

      expect(mockSupabase.auth.signInWithOAuth).toHaveBeenCalledWith({
        provider: 'apple',
        options: {
          redirectTo: 'http://localhost:3005/',
        },
      })
    })

    it('should handle sign out', async () => {
      const user = userEvent.setup()
      
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('loaded')
      })

      await act(async () => {
        await user.click(screen.getByTestId('signout'))
      })

      expect(mockSupabase.auth.signOut).toHaveBeenCalled()
    })

    it('should handle Google sign in error', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const user = userEvent.setup()
      
      mockSupabase.auth.signInWithOAuth.mockRejectedValueOnce(
        new Error('OAuth failed')
      )

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('loaded')
      })

      await expect(async () => {
        await act(async () => {
          await user.click(screen.getByTestId('google-signin'))
        })
      }).rejects.toThrow('OAuth failed')

      expect(consoleSpy).toHaveBeenCalledWith('❌ Google sign-in error:', expect.any(Error))
      consoleSpy.mockRestore()
    })

    it('should handle sign out error', async () => {
      const user = userEvent.setup()
      
      mockSupabase.auth.signOut.mockResolvedValueOnce({
        error: { message: 'Sign out failed' },
      })

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('loaded')
      })

      await expect(async () => {
        await act(async () => {
          await user.click(screen.getByTestId('signout'))
        })
      }).rejects.toThrow()
    })
  })

  describe('Auth State Changes', () => {
    it('should update user state on auth state change', async () => {
      let authStateChangeCallback: (event: string, session: any) => void

      mockSupabase.auth.onAuthStateChange.mockImplementationOnce((callback) => {
        authStateChangeCallback = callback
        return {
          data: { subscription: { unsubscribe: vi.fn() } }
        }
      })

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('loaded')
      })

      // Simulate auth state change
      const newSession = {
        user: { id: 'new-user', email: 'new@example.com' }
      }

      await act(async () => {
        authStateChangeCallback('SIGNED_IN', newSession)
      })

      await waitFor(() => {
        expect(screen.getByTestId('user')).toHaveTextContent('new@example.com')
      })
    })
  })

  describe('Hook Usage', () => {
    it('should throw error when used outside provider', () => {
      render(<TestComponentOutsideProvider />)
      
      expect(screen.getByTestId('error')).toHaveTextContent(
        'Error: useAuth must be used within an AuthProvider'
      )
    })
  })

  describe('Cleanup', () => {
    it('should unsubscribe from auth changes on unmount', async () => {
      const unsubscribeMock = vi.fn()
      
      mockSupabase.auth.onAuthStateChange.mockReturnValueOnce({
        data: { subscription: { unsubscribe: unsubscribeMock } }
      })

      const { unmount } = render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      unmount()

      expect(unsubscribeMock).toHaveBeenCalled()
    })
  })

  describe('Window Environment Handling', () => {
    it('should handle server-side rendering (no window)', async () => {
      // Mock window as undefined
      const originalWindow = global.window
      // @ts-ignore
      delete global.window

      const user = userEvent.setup()
      
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('loaded')
      })

      await act(async () => {
        await user.click(screen.getByTestId('google-signin'))
      })

      expect(mockSupabase.auth.signInWithOAuth).toHaveBeenCalledWith({
        provider: 'google',
        options: {
          redirectTo: 'http://localhost:3005/',
        },
      })

      // Restore window
      global.window = originalWindow
    })
  })
})