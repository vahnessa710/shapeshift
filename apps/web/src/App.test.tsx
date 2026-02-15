import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { App } from './App'

vi.mock('./pages/Login', () => ({
  LoginPage: () => <div data-testid="login">Login Page Content</div>,
}))
vi.mock('./pages/Onboarding', () => ({
  OnboardingPage: () => <div data-testid="onboarding">Onboarding Page Content</div>,
}))
vi.mock('./pages/TraineeDashboard', () => ({
  TraineeDashboard: () => <div data-testid="trainee-dash">Trainee Dashboard</div>,
}))
vi.mock('./pages/TrainerDashboard', () => ({
  TrainerDashboard: () => <div data-testid="trainer-dash">Trainer Dashboard Content</div>,
}))

vi.mock('./components/AuthGuard', () => ({
  AuthGuard: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

describe('App Component Routing', () => {
  it('renders the Login page by default (redirect from /)', async () => {
    render(<App />)

    const loginPage = await screen.findByTestId('login')
    expect(loginPage).toBeInTheDocument()
  })

  it('renders the Onboarding page when navigating to /onboarding', async () => {
    window.history.pushState({}, 'Onboarding', '/onboarding')

    render(<App />)
    const onboardingPage = await screen.findByTestId('onboarding')
    expect(onboardingPage).toBeInTheDocument()
  })

  it('renders the Trainee Dashboard when navigating to its path', async () => {
    window.history.pushState({}, 'Trainee', '/trainee/dashboard')

    render(<App />)

    const traineeDashboard = await screen.findByTestId('trainee-dash')
    expect(traineeDashboard).toBeInTheDocument()
  })

  it('renders the Trainer Dashboard when navigating to its path', async () => {
    window.history.pushState({}, 'Trainer', '/trainer/dashboard')

    render(<App />)
    const trainerDashboard = await screen.findByTestId('trainer-dash')
    expect(trainerDashboard).toBeInTheDocument()
  })
})
