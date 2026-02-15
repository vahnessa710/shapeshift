import { useState, useEffect } from 'react'
import { Button } from '@shapeshift/ui/Button'
import { Card, CardHeader, CardContent } from '@shapeshift/ui/Card'
import { useAuth } from '../providers/AuthProvider'
import {
  getTraineesForTrainer,
  getWeightLogs,
  getWorkoutLogs,
  WeightLog,
  WorkoutLog,
} from '../lib/firestore'
import { User } from '@shapeshift/shared'

export const TrainerDashboard = () => {
  const { userProfile, signOut } = useAuth()
  const [trainees, setTrainees] = useState<User[]>([])
  const [selectedTrainee, setSelectedTrainee] = useState<User | null>(null)
  const [traineeWeights, setTraineeWeights] = useState<WeightLog[]>([])
  const [traineeWorkouts, setTraineeWorkouts] = useState<WorkoutLog[]>([])
  const [loading, setLoading] = useState(true)
  const [showInviteCode, setShowInviteCode] = useState(false)

  useEffect(() => {
    loadTrainees()
  }, [userProfile])

  useEffect(() => {
    if (selectedTrainee) {
      loadTraineeData(selectedTrainee.id)
    }
  }, [selectedTrainee])

  const loadTrainees = async () => {
    if (!userProfile?.inviteCode) return
    setLoading(true)
    try {
      const data = await getTraineesForTrainer(userProfile.inviteCode)
      setTrainees(data as User[])
    } catch (error) {
      console.error('Error loading trainees:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadTraineeData = async (traineeId: string) => {
    try {
      const [weights, workouts] = await Promise.all([
        getWeightLogs(traineeId),
        getWorkoutLogs(traineeId),
      ])
      setTraineeWeights(weights.sort((a, b) => b.date.getTime() - a.date.getTime()))
      setTraineeWorkouts(workouts.sort((a, b) => b.date.getTime() - a.date.getTime()))
    } catch (error) {
      console.error('Error loading trainee data:', error)
    }
  }

  const copyInviteCode = () => {
    if (userProfile?.inviteCode) {
      navigator.clipboard.writeText(userProfile.inviteCode)
      setShowInviteCode(true)
      setTimeout(() => setShowInviteCode(false), 2000)
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">💪 Trainer Dashboard</h1>
            <p className="text-sm text-gray-600">Welcome, Coach {userProfile?.name}!</p>
          </div>
          <div className="flex items-center gap-4">
            <Button onClick={copyInviteCode} variant="outline" size="sm">
              {showInviteCode ? '✓ Copied!' : `Invite Code: ${userProfile?.inviteCode}`}
            </Button>
            <Button onClick={signOut} variant="outline" size="sm">
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-3">
          {/* Trainees List */}
          <Card className="md:col-span-1">
            <CardHeader>
              <h2 className="text-xl font-bold">My Trainees ({trainees.length})</h2>
            </CardHeader>
            <CardContent>
              {trainees.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p className="mb-2">No trainees yet</p>
                  <p className="text-sm">Share your invite code to get started!</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {trainees.map(trainee => (
                    <button
                      key={trainee.id}
                      onClick={() => setSelectedTrainee(trainee)}
                      className={`w-full text-left p-3 rounded-lg transition ${
                        selectedTrainee?.id === trainee.id
                          ? 'bg-blue-100 border-2 border-blue-500'
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <div className="font-medium">{trainee.name}</div>
                      <div className="text-sm text-gray-600">{trainee.email}</div>
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Trainee Details */}
          <div className="md:col-span-2 space-y-6">
            {!selectedTrainee ? (
              <Card>
                <CardContent className="text-center py-12 text-gray-500">
                  <p className="text-lg">Select a trainee to view their progress</p>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Weight Progress */}
                <Card>
                  <CardHeader>
                    <h2 className="text-xl font-bold">{selectedTrainee.name}'s Weight Progress</h2>
                  </CardHeader>
                  <CardContent>
                    {traineeWeights.length === 0 ? (
                      <p className="text-gray-500 text-center py-4">No weight logs yet</p>
                    ) : (
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {traineeWeights.slice(0, 10).map(log => (
                          <div
                            key={log.id}
                            className="flex justify-between items-center p-3 bg-gray-50 rounded"
                          >
                            <span className="font-bold text-lg">{log.weight} kg</span>
                            <span className="text-sm text-gray-600">
                              {log.date.toLocaleDateString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Recent Workouts */}
                <Card>
                  <CardHeader>
                    <h2 className="text-xl font-bold">{selectedTrainee.name}'s Recent Workouts</h2>
                  </CardHeader>
                  <CardContent>
                    {traineeWorkouts.length === 0 ? (
                      <p className="text-gray-500 text-center py-4">No workouts logged yet</p>
                    ) : (
                      <div className="space-y-3 max-h-64 overflow-y-auto">
                        {traineeWorkouts.slice(0, 5).map(log => (
                          <div key={log.id} className="p-3 bg-gray-50 rounded">
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-bold">{log.workoutType}</span>
                              <span className="text-sm text-gray-600">
                                {log.date.toLocaleDateString()}
                              </span>
                            </div>
                            <div className="space-y-1">
                              {log.exercises.map((ex, idx) => (
                                <div key={idx} className="text-sm text-gray-700">
                                  {ex.name}: {ex.sets}x{ex.reps} @ {ex.weight}kg
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
