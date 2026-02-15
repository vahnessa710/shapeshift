import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { WeightLogTab } from '../../components/WeightLogTab' // Adjust path
import { WeightLog } from '../../lib/firestore' // Adjust path

// 1. Mock the external dependency
vi.mock('../lib/firestore', () => ({
  deleteWeightLog: vi.fn(),
}))

describe('WeightLogTab', () => {
  // 2. Create valid mock data
  const mockLogs: WeightLog[] = [
    { id: '1', weight: 80, date: new Date(), userId: '123', createdAt: new Date() },
  ]

  // 3. Define props with the correct Interface
  const mockProps = {
    weightLogs: mockLogs,
    weightInput: '',
    setWeightInput: vi.fn(),
    weightDate: '2026-02-13',
    setWeightDate: vi.fn(),
    handleAddWeight: vi.fn(e => e.preventDefault()),
    onWeightDeleted: vi.fn(() => Promise.resolve()), // Essential: must return Promise
  }

  beforeEach(() => {
    vi.clearAllMocks()
    window.confirm = vi.fn(() => true)
  })

  it('calls setWeightInput when the weight field changes', () => {
    // Squiggles should be gone now!
    render(<WeightLogTab {...mockProps} />)

    const input = screen.getByPlaceholderText('75.5')
    fireEvent.change(input, { target: { value: '82.5' } })

    expect(mockProps.setWeightInput).toHaveBeenCalledWith('82.5')
  })
})
