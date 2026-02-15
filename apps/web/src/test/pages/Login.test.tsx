import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { LoginPage } from '../../pages/Login'

const mockSignInWithGoogle = vi.fn()
const mockSignInWithEmail = vi.fn()
const mockSignUpWithEmail = vi.fn()
const mockNavigate = vi.fn()

// Mock useAuth hook
vi.mock('../../providers/AuthProvider', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useAuth: () => ({
    currentUser: null,
    userProfile: null,
    loading: false,
    signInWithGoogle: mockSignInWithGoogle,
    signInWithEmail: mockSignInWithEmail,
    signUpWithEmail: mockSignUpWithEmail,
  }),
}))

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render login form with all elements', () => {
      render(
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      )

      // Check for main elements
      expect(screen.getByText('🏋️ Shapeshift')).toBeInTheDocument()
      expect(screen.getByText('Welcome back!')).toBeInTheDocument()
      expect(screen.getByText('Continue with Google')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('your@email.com')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
    })

    it('should toggle between sign in and sign up modes', () => {
      render(
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      )

      // Initially in sign in mode
      expect(screen.getByText('Welcome back!')).toBeInTheDocument()
      expect(screen.queryByPlaceholderText('Enter your name')).not.toBeInTheDocument()

      // Click to switch to sign up
      fireEvent.click(screen.getByText("Don't have an account? Sign up"))

      // Now in sign up mode
      expect(screen.getByText('Create your account')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Enter your name')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument()

      // Switch back to sign in
      fireEvent.click(screen.getByText('Already have an account? Sign in'))
      expect(screen.getByText('Welcome back!')).toBeInTheDocument()
    })
  })
})
