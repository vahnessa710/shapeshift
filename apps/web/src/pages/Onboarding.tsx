import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { doc, updateDoc } from 'firebase/firestore'
import { Button } from '@shapeshift/ui/Button'
import { Card, CardHeader, CardContent } from '@shapeshift/ui/Card'
import { db } from '../lib/firebase'
import { useAuth } from '../providers/AuthProvider'
import { UserRole } from '@shapeshift/shared'

export const OnboardingPage = () => {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null)
  const [trainerCode, setTrainerCode] = useState('')
  const [loading, setLoading] = useState(false)
  const { currentUser, refreshUserProfile } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async () => {
    if (!currentUser || !selectedRole) return

    setLoading(true)
    try {
      const updates: {
        role: UserRole
        inviteCode?: string
        trainerId?: string
      } = { role: selectedRole }

      if (selectedRole === 'TRAINER') {
        // Generate unique 6-digit invite code
        updates.inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase()
      } else if (selectedRole === 'TRAINEE' && trainerCode) {
        updates.trainerId = trainerCode
      }

      await updateDoc(doc(db, 'users', currentUser.uid), updates)

      // Refresh the user profile in AuthProvider to get the updated role
      await refreshUserProfile()

      // Navigate to appropriate dashboard
      navigate(selectedRole === 'TRAINER' ? '/trainer/dashboard' : '/trainee/dashboard')
    } catch (error) {
      console.error('Error updating profile:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-50 p-4"
      data-testid="onboarding"
    >
      <Card className="w-full max-w-md">
        <CardHeader>
          <h1 className="text-2xl font-bold">Welcome to Shapeshift</h1>
          <p className="text-gray-600">Choose your role to get started</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Button
              onClick={() => setSelectedRole('TRAINEE')}
              variant={selectedRole === 'TRAINEE' ? 'default' : 'outline'}
              className="w-full h-20 text-lg"
            >
              🏋️ I'm a Trainee
            </Button>
            <Button
              onClick={() => setSelectedRole('TRAINER')}
              variant={selectedRole === 'TRAINER' ? 'default' : 'outline'}
              className="w-full h-20 text-lg"
            >
              💪 I'm a Trainer
            </Button>
          </div>

          {selectedRole === 'TRAINEE' && (
            <div>
              <label className="block text-sm font-medium mb-2">Trainer Code (Optional)</label>
              <input
                type="text"
                value={trainerCode}
                onChange={e => setTrainerCode(e.target.value.toUpperCase())}
                placeholder="Enter your trainer's code"
                className="w-full px-3 py-2 border rounded-md"
                maxLength={6}
              />
            </div>
          )}

          <Button onClick={handleSubmit} disabled={!selectedRole || loading} className="w-full">
            {loading ? 'Setting up...' : 'Continue'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
