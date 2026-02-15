import { Card, CardHeader, CardContent } from '@shapeshift/ui/Card'
import { WorkoutLog } from '../lib/firestore'

export const Calendar = ({ workoutLogs }: { workoutLogs: WorkoutLog[] }) => {
  // Get workout days for calendar
  const getWorkoutDays = () => {
    const days = new Set<string>()
    workoutLogs.forEach(log => {
      days.add(log.date.toISOString().split('T')[0])
    })
    return days
  }

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-bold">Workout Calendar</h2>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center font-bold text-sm p-2">
              {day}
            </div>
          ))}
          {Array.from({ length: 35 }, (_, i) => {
            const date = new Date()
            date.setDate(date.getDate() - date.getDay() - 7 + i)
            const dateStr = date.toISOString().split('T')[0]
            const hasWorkout = getWorkoutDays().has(dateStr)
            const isToday = dateStr === new Date().toISOString().split('T')[0]

            return (
              <div
                key={i}
                className={`aspect-square p-2 border rounded text-center text-sm ${
                  hasWorkout ? 'bg-green-100 border-green-500 font-bold' : 'bg-white'
                } ${isToday ? 'ring-2 ring-blue-500' : ''}`}
              >
                {date.getDate()}
                {hasWorkout && <div className="text-xs text-green-700">✓</div>}
              </div>
            )
          })}
        </div>
        <div className="mt-4 flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-100 border-green-500 border rounded"></div>
            <span>Workout Day</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-white border rounded"></div>
            <span>Rest Day</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
