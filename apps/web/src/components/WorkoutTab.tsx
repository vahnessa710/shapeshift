import { Dispatch, SetStateAction, useState } from 'react'
import { Card, CardHeader, CardContent } from '@shapeshift/ui/Card'
import { Button } from '@shapeshift/ui/Button'
import { WorkoutLog, addWorkoutLog, deleteWorkoutLog } from '../lib/firestore'
import { User } from '@firebase/auth'

interface Exercise {
  name: string
  sets: number
  reps: number
  weight: number
}

interface WorkoutTabProps {
  workoutLogs: WorkoutLog[]
  exercises: Exercise[]
  setExercises: Dispatch<SetStateAction<Exercise[]>>
  workoutType: string
  setWorkoutType: Dispatch<SetStateAction<string>>
  currentUser: User | null
  onWorkoutAdded: () => Promise<void>
}

export const WorkoutTab = ({
  workoutLogs,
  exercises,
  setExercises,
  workoutType,
  setWorkoutType,
  currentUser,
  onWorkoutAdded,
}: WorkoutTabProps) => {
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleAddWorkout = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentUser) return

    const validExercises = exercises.filter(ex => ex.name.trim() !== '')
    if (validExercises.length === 0) return

    try {
      await addWorkoutLog(currentUser.uid, {
        workoutType,
        exercises: validExercises,
        date: new Date(),
      })
      setExercises([{ name: '', sets: 0, reps: 0, weight: 0 }])
      await onWorkoutAdded()
    } catch (error) {
      console.error('Error adding workout:', error)
    }
  }

  const handleDeleteWorkout = async (workoutId: string) => {
    if (!confirm('Are you sure you want to delete this workout?')) return

    setDeletingId(workoutId)
    try {
      await deleteWorkoutLog(workoutId)
      await onWorkoutAdded() // Refresh the list
    } catch (error) {
      console.error('Error deleting workout:', error)
      alert('Failed to delete workout')
    } finally {
      setDeletingId(null)
    }
  }

  const addExerciseRow = () => {
    setExercises([...exercises, { name: '', sets: 0, reps: 0, weight: 0 }])
  }

  // Corrected version
  const updateExercise = (index: number, field: keyof Exercise, value: string | number) => {
    const updated = [...exercises]

    // We use 'as any' here or a type assertion because TS sometimes struggles
    // to correlate the specific key with the specific value type in a generic update
    updated[index] = { ...updated[index], [field]: value }

    setExercises(updated)
  }

  const removeExercise = (index: number) => {
    setExercises(exercises.filter((_, i) => i !== index))
  }

  return (
    <div>
      <div className="space-y-6">
        {/* Log Form */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-bold">Log Workout</h2>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddWorkout} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Workout Type</label>
                <select
                  value={workoutType}
                  onChange={e => setWorkoutType(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="Full Body">Full Body</option>
                  <option value="Upper Body">Upper Body</option>
                  <option value="Lower Body">Lower Body</option>
                  <option value="Cardio">Cardio</option>
                </select>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium">Exercises</label>
                  <Button type="button" variant="outline" size="sm" onClick={addExerciseRow}>
                    + Add Exercise
                  </Button>
                </div>

                {exercises.map((exercise, index) => (
                  <div key={index} className="border rounded-md p-3 bg-gray-50 space-y-2">
                    <div className="flex justify-between items-center">
                      <input
                        type="text"
                        placeholder="Exercise name (e.g., Bench Press)"
                        value={exercise.name}
                        onChange={e => updateExercise(index, 'name', e.target.value)}
                        className="w-full px-2 py-1 border rounded-md"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeExercise(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </Button>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-xs text-gray-600">Sets</label>
                        <input
                          type="number"
                          min="0"
                          value={exercise.sets || ''}
                          onChange={e =>
                            updateExercise(index, 'sets', parseInt(e.target.value) || 0)
                          }
                          className="w-full px-2 py-1 border rounded-md [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600">Reps</label>
                        <input
                          type="number"
                          min="0"
                          value={exercise.reps || ''}
                          onChange={e =>
                            updateExercise(index, 'reps', parseInt(e.target.value) || 0)
                          }
                          className="w-full px-2 py-1 border rounded-md [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600">Weight (kg)</label>
                        <input
                          type="number"
                          min="0"
                          step="0.1"
                          value={exercise.weight || ''}
                          onChange={e =>
                            updateExercise(index, 'weight', parseFloat(e.target.value) || 0)
                          }
                          className="w-full px-2 py-1 border rounded-md [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Button type="submit" className="w-full">
                Save Workout
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Recent Workouts */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-bold">Recent Workouts</h2>
          </CardHeader>
          <CardContent>
            {workoutLogs.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No workouts logged yet</p>
            ) : (
              <div className="space-y-3">
                {workoutLogs.map(log => (
                  <div key={log.id} className="border rounded-md p-3 bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <span className="font-bold">{log.workoutType}</span>
                        <div className="text-sm text-gray-600">
                          {new Date(log.date).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-sm text-gray-600">
                          {log.exercises.length} exercise{log.exercises.length > 1 ? 's' : ''}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteWorkout(log.id!)}
                          disabled={deletingId === log.id}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          {deletingId === log.id ? 'Deleting...' : '❌'}
                        </Button>
                      </div>
                    </div>
                    <div className="mt-2 space-y-1">
                      {log.exercises.map((ex, i) => (
                        <div key={i} className="text-sm">
                          {ex.sets}x{ex.reps} @ {ex.weight}kg {ex.name}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
