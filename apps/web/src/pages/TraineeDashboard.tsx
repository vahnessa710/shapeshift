import { useState, useEffect } from 'react'
import { useAuth } from '../providers/AuthProvider'
import {
  addWeightLog,
  getWeightLogs,
  getWorkoutLogs,
  WeightLog,
  WorkoutLog,
} from '../lib/firestore'
import { Calendar } from '../components/Calendar'
import { WorkoutTab } from '../components/WorkoutTab'
import { NavBar } from '../components/NavBar'
import { WeightLogTab } from '../components/WeightLogTab'
import { Tabs } from '../components/Tabs'
import { TrainerTab } from '../components/TrainerTab'

export const TraineeDashboard = () => {
  const { currentUser, userProfile, refreshUserProfile } = useAuth()
  const [weightLogs, setWeightLogs] = useState<WeightLog[]>([])
  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLog[]>([])
  const [activeTab, setActiveTab] = useState<'weight' | 'workout' | 'calendar' | 'trainer'>(
    'weight'
  )
  const [loading, setLoading] = useState(true)

  // Weight form state
  const [weightInput, setWeightInput] = useState('')
  const [weightDate, setWeightDate] = useState(new Date().toISOString().split('T')[0])

  // Workout form state
  const [workoutType, setWorkoutType] = useState('Full Body')
  const [exercises, setExercises] = useState([{ name: '', sets: 0, reps: 0, weight: 0 }])

  useEffect(() => {
    loadData()
  }, [currentUser])

  const handleTrainerUpdate = async () => {
    await refreshUserProfile()
  }

  const loadData = async () => {
    if (!currentUser) return
    setLoading(true)
    try {
      const [weights, workouts] = await Promise.all([
        getWeightLogs(currentUser.uid),
        getWorkoutLogs(currentUser.uid),
      ])
      setWeightLogs(weights.sort((a, b) => b.date.getTime() - a.date.getTime()))
      setWorkoutLogs(workouts.sort((a, b) => b.date.getTime() - a.date.getTime()))
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddWeight = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentUser || !weightInput) return

    try {
      await addWeightLog(currentUser.uid, parseFloat(weightInput), new Date(weightDate))
      setWeightInput('')
      setWeightDate(new Date().toISOString().split('T')[0])
      await loadData()
    } catch (error) {
      console.error('Error adding weight:', error)
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50" data-testid="trainee-dash">
      <NavBar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-2 mb-6">
          <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>

        {activeTab === 'weight' && (
          <WeightLogTab
            weightLogs={weightLogs}
            weightInput={weightInput}
            setWeightInput={setWeightInput}
            weightDate={weightDate}
            setWeightDate={setWeightDate}
            handleAddWeight={handleAddWeight}
            onWeightDeleted={loadData}
          />
        )}

        {activeTab === 'workout' && (
          <WorkoutTab
            workoutLogs={workoutLogs}
            exercises={exercises}
            setExercises={setExercises}
            workoutType={workoutType}
            setWorkoutType={setWorkoutType}
            currentUser={currentUser}
            onWorkoutAdded={loadData}
          />
        )}

        {activeTab === 'calendar' && <Calendar workoutLogs={workoutLogs} />}

        {activeTab === 'trainer' && (
          <TrainerTab
            currentUserId={currentUser?.uid || ''}
            currentTrainerId={userProfile?.trainerId}
            onTrainerUpdated={handleTrainerUpdate}
          />
        )}
      </div>
    </div>
  )
}
