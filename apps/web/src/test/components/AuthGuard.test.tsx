// At the top of AuthGuard.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { AuthGuard } from '../../components/AuthGuard'

// Create a mock function
const mockUseAuth = vi.fn()

// Mock the entire module
vi.mock('../../providers/AuthProvider', () => ({
  useAuth: () => mockUseAuth(),
}))

describe('AuthGuard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows loading spinner when auth is loading', () => {
    // Now this will work!
    mockUseAuth.mockReturnValue({
      currentUser: null,
      userProfile: null,
      loading: true,
    })

    render(
      <BrowserRouter>
        <AuthGuard>
          <div>Protected Content</div>
        </AuthGuard>
      </BrowserRouter>
    )

    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('redirects to /login if there is no currentUser', () => {
    mockUseAuth.mockReturnValue({
      currentUser: null,
      userProfile: null,
      loading: false,
    })

    render(
      <BrowserRouter>
        <AuthGuard>
          <div>Protected Content</div>
        </AuthGuard>
      </BrowserRouter>
    )

    // Should not show protected content
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
  })
})
