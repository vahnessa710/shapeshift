import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TrainerTab } from '../../components/TrainerTab'

// Mock firestore functions
vi.mock('../../lib/firestore', () => ({
  verifyTrainerCode: vi.fn(),
  connectToTrainer: vi.fn(),
  disconnectFromTrainer: vi.fn(),
}))

describe('TrainerTab', () => {
  const mockOnTrainerUpdated = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should show "not connected" message when no trainer is connected', () => {
    render(
      <TrainerTab
        currentUserId="user123"
        currentTrainerId={null}
        onTrainerUpdated={mockOnTrainerUpdated}
      />
    )

    expect(screen.getByText("You're not connected to a trainer")).toBeInTheDocument()
    expect(
      screen.getByText('Connect with a trainer to get personalized guidance and support')
    ).toBeInTheDocument()
  })

  it('should display trainer info when connected', () => {
    render(
      <TrainerTab
        currentUserId="user123"
        currentTrainerId="ABC123"
        onTrainerUpdated={mockOnTrainerUpdated}
      />
    )

    expect(screen.getByText('Connected to')).toBeInTheDocument()
    expect(screen.getByText(/Trainer Code:/)).toBeInTheDocument()
    expect(screen.getByText('ABC123')).toBeInTheDocument()
    expect(screen.getByText('Disconnect from Trainer')).toBeInTheDocument()
  })
})
