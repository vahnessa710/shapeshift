import { render, screen } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { Calendar } from '../../components/Calendar'
import { WorkoutLog } from '../../lib/firestore'
import { ReactNode } from 'react'

// Mocking the UI components to avoid dependency issues in testing
vi.mock('@shapeshift/ui/Card', () => ({
  Card: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  CardHeader: ({ children }: { children: ReactNode }) => <header>{children}</header>,
  CardContent: ({ children }: { children: ReactNode }) => <main>{children}</main>,
}))

describe('Calendar Component', () => {
  const mockToday = new Date('2026-02-13T12:00:00Z')

  beforeEach(() => {
    // Lock the system time so "today" is always the same date in our tests
    vi.useFakeTimers()
    vi.setSystemTime(mockToday)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders workout indicators', () => {
    // Explicitly type the array so TS knows it matches the prop
    const workoutLogs: WorkoutLog[] = [
      {
        id: '123',
        date: new Date('2026-02-13T12:00:00Z'),
        userId: '123',
        workoutType: 'Cardio',
        exercises: [],
        createdAt: new Date('2026-02-13T12:00:00Z'),
      },
    ]

    // This should now be clear of red squiggles
    render(<Calendar workoutLogs={workoutLogs} />)
  })

  it('correctly identifies and highlights the current day', () => {
    render(<Calendar workoutLogs={[]} />)

    // Get the element for today's date (the 13th)
    // We look for the specific day number rendered in the grid
    const todayElement = screen
      .getAllByText('13')
      .find(el => el.className.includes('ring-2 ring-blue-500'))

    expect(todayElement).toBeDefined()
    expect(todayElement?.className).toContain('ring-blue-500')
  })
})
