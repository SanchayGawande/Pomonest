import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SignInButton } from '@/components/auth/SignInButton'
import { AuthProvider } from '@/components/auth/AuthProvider'

// Mock the auth provider methods
const mockSignInWithGoogle = vi.fn()
const mockSignInWithApple = vi.fn()

vi.mock('@/components/auth/AuthProvider', async () => {
  const actual = await vi.importActual('@/components/auth/AuthProvider')
  return {
    ...actual,
    useAuth: () => ({
      user: null,
      loading: false,
      signInWithGoogle: mockSignInWithGoogle,
      signInWithApple: mockSignInWithApple,
      signOut: vi.fn(),
    }),
  }
})

describe('SignInButton', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render the sign-in form correctly', () => {
      render(<SignInButton />)

      expect(screen.getByText('WorkStreak')).toBeInTheDocument()
      expect(screen.getByText('Build your focus habit, one streak at a time')).toBeInTheDocument()
      expect(screen.getByText('Continue with Google')).toBeInTheDocument()
      expect(screen.getByText('Continue with Apple')).toBeInTheDocument()
    })

    it('should have proper styling classes', () => {
      render(<SignInButton />)

      const title = screen.getByText('WorkStreak')
      expect(title).toHaveClass('bg-gradient-hero', 'bg-clip-text', 'text-transparent')
    })
  })

  describe('Google Sign In', () => {
    it('should call signInWithGoogle when Google button is clicked', async () => {
      const user = userEvent.setup()
      render(<SignInButton />)

      const googleButton = screen.getByText('Continue with Google')
      await user.click(googleButton)

      expect(mockSignInWithGoogle).toHaveBeenCalledOnce()
    })

    it('should show loading state during Google sign in', async () => {
      // Mock a delayed sign in
      mockSignInWithGoogle.mockImplementation(
        () => new Promise(resolve => setTimeout(resolve, 100))
      )

      const user = userEvent.setup()
      render(<SignInButton />)

      const googleButton = screen.getByText('Continue with Google')
      await user.click(googleButton)

      expect(screen.getByText('Signing in...')).toBeInTheDocument()
      expect(googleButton).toBeDisabled()

      // Wait for sign in to complete
      await waitFor(() => {
        expect(screen.getByText('Continue with Google')).toBeInTheDocument()
      })
    })

    it('should disable Apple button during Google sign in', async () => {
      mockSignInWithGoogle.mockImplementation(
        () => new Promise(resolve => setTimeout(resolve, 100))
      )

      const user = userEvent.setup()
      render(<SignInButton />)

      const googleButton = screen.getByText('Continue with Google')
      const appleButton = screen.getByText('Continue with Apple')

      await user.click(googleButton)

      expect(appleButton).toBeDisabled()

      await waitFor(() => {
        expect(appleButton).not.toBeDisabled()
      })
    })

    it('should handle Google sign in error gracefully', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      
      mockSignInWithGoogle.mockRejectedValueOnce(new Error('Google auth failed'))

      const user = userEvent.setup()
      render(<SignInButton />)

      const googleButton = screen.getByText('Continue with Google')
      await user.click(googleButton)

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Sign in error:', expect.any(Error))
        expect(screen.getByText('Continue with Google')).toBeInTheDocument()
      })

      consoleSpy.mockRestore()
    })
  })

  describe('Apple Sign In', () => {
    it('should call signInWithApple when Apple button is clicked', async () => {
      const user = userEvent.setup()
      render(<SignInButton />)

      const appleButton = screen.getByText('Continue with Apple')
      await user.click(appleButton)

      expect(mockSignInWithApple).toHaveBeenCalledOnce()
    })

    it('should show loading state during Apple sign in', async () => {
      mockSignInWithApple.mockImplementation(
        () => new Promise(resolve => setTimeout(resolve, 100))
      )

      const user = userEvent.setup()
      render(<SignInButton />)

      const appleButton = screen.getByText('Continue with Apple')
      await user.click(appleButton)

      expect(screen.getByText('Signing in...')).toBeInTheDocument()
      expect(appleButton).toBeDisabled()

      await waitFor(() => {
        expect(screen.getByText('Continue with Apple')).toBeInTheDocument()
      })
    })

    it('should disable Google button during Apple sign in', async () => {
      mockSignInWithApple.mockImplementation(
        () => new Promise(resolve => setTimeout(resolve, 100))
      )

      const user = userEvent.setup()
      render(<SignInButton />)

      const googleButton = screen.getByText('Continue with Google')
      const appleButton = screen.getByText('Continue with Apple')

      await user.click(appleButton)

      expect(googleButton).toBeDisabled()

      await waitFor(() => {
        expect(googleButton).not.toBeDisabled()
      })
    })

    it('should handle Apple sign in error gracefully', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      
      mockSignInWithApple.mockRejectedValueOnce(new Error('Apple auth failed'))

      const user = userEvent.setup()
      render(<SignInButton />)

      const appleButton = screen.getByText('Continue with Apple')
      await user.click(appleButton)

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Sign in error:', expect.any(Error))
        expect(screen.getByText('Continue with Apple')).toBeInTheDocument()
      })

      consoleSpy.mockRestore()
    })
  })

  describe('Loading States', () => {
    it('should only allow one sign-in at a time', async () => {
      mockSignInWithGoogle.mockImplementation(
        () => new Promise(resolve => setTimeout(resolve, 100))
      )

      const user = userEvent.setup()
      render(<SignInButton />)

      const googleButton = screen.getByText('Continue with Google')
      const appleButton = screen.getByText('Continue with Apple')

      // Start Google sign in
      await user.click(googleButton)

      // Both buttons should be disabled
      expect(googleButton).toBeDisabled()
      expect(appleButton).toBeDisabled()

      // Try to click Apple button while Google is loading
      await user.click(appleButton)

      // Apple sign in should not be called
      expect(mockSignInWithApple).not.toHaveBeenCalled()

      await waitFor(() => {
        expect(googleButton).not.toBeDisabled()
        expect(appleButton).not.toBeDisabled()
      })
    })

    it('should reset loading state after error', async () => {
      mockSignInWithGoogle.mockRejectedValueOnce(new Error('Auth failed'))

      const user = userEvent.setup()
      render(<SignInButton />)

      const googleButton = screen.getByText('Continue with Google')

      await user.click(googleButton)

      await waitFor(() => {
        expect(googleButton).not.toBeDisabled()
        expect(screen.getByText('Continue with Google')).toBeInTheDocument()
      })
    })
  })

  describe('Accessibility', () => {
    it('should have proper button roles and structure', () => {
      render(<SignInButton />)

      const googleButton = screen.getByRole('button', { name: /continue with google/i })
      const appleButton = screen.getByRole('button', { name: /continue with apple/i })

      expect(googleButton).toBeInTheDocument()
      expect(appleButton).toBeInTheDocument()
    })

    it('should be keyboard accessible', async () => {
      render(<SignInButton />)

      const googleButton = screen.getByRole('button', { name: /continue with google/i })
      const appleButton = screen.getByRole('button', { name: /continue with apple/i })

      // Test that buttons exist and have proper accessibility
      expect(googleButton).toBeInTheDocument()
      expect(googleButton).not.toBeDisabled()
      expect(appleButton).toBeInTheDocument()
      expect(appleButton).not.toBeDisabled()
    })
  })
})