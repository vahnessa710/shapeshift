import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Tabs } from '../../components/Tabs'

describe('Tabs', () => {
  const mockSetActiveTab = vi.fn()

  it('should render all tab buttons', () => {
    render(<Tabs activeTab="weight" setActiveTab={mockSetActiveTab} />)

    expect(screen.getByText('Weight Log')).toBeInTheDocument()
    expect(screen.getByText('Workout Log')).toBeInTheDocument()
    expect(screen.getByText('Calendar')).toBeInTheDocument()
    expect(screen.getByText('Trainer')).toBeInTheDocument()
  })

  it('should call setActiveTab when a tab is clicked', () => {
    render(<Tabs activeTab="weight" setActiveTab={mockSetActiveTab} />)

    // Click on Workout Log tab
    fireEvent.click(screen.getByText('Workout Log'))
    expect(mockSetActiveTab).toHaveBeenCalledWith('workout')

    // Click on Calendar tab
    fireEvent.click(screen.getByText('Calendar'))
    expect(mockSetActiveTab).toHaveBeenCalledWith('calendar')

    // Click on Trainer tab
    fireEvent.click(screen.getByText('Trainer'))
    expect(mockSetActiveTab).toHaveBeenCalledWith('trainer')

    expect(mockSetActiveTab).toHaveBeenCalledTimes(3)
  })
})
