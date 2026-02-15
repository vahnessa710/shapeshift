import { useState, useEffect } from 'react'
import { Card, CardHeader, CardContent } from '@shapeshift/ui/Card'
import { Button } from '@shapeshift/ui/Button'
import { connectToTrainer, disconnectFromTrainer, verifyTrainerCode } from '../lib/firestore'
import { User } from '@shapeshift/shared'

interface TrainerTabProps {
  currentUserId: string
  currentTrainerId: string | null | undefined
  onTrainerUpdated: () => Promise<void>
}

export const TrainerTab = ({
  currentUserId,
  currentTrainerId,
  onTrainerUpdated,
}: TrainerTabProps) => {
  const [trainerCode, setTrainerCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [trainerInfo, setTrainerInfo] = useState<User | null>(null)

  const loadTrainerInfo = async (code: string) => {
    try {
      const trainer = await verifyTrainerCode(code)
      setTrainerInfo(trainer)
    } catch (err) {
      console.error('Error loading trainer info:', err)
    }
  }

  // Load trainer info if connected
  useEffect(() => {
    if (currentTrainerId) {
      loadTrainerInfo(currentTrainerId)
    } else {
      setTrainerInfo(null) // Clear when no trainer
    }
  }, [currentTrainerId])

  const handleConnectTrainer = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const trainer = await connectToTrainer(currentUserId, trainerCode.toUpperCase())
      setTrainerInfo(trainer)
      setSuccess(`Successfully connected to Trainer: ${trainer.name}!`)
      setTrainerCode('')
      await onTrainerUpdated()
    } catch (err: string) {
      setError(err.message || 'Failed to connect to trainer')
    } finally {
      setLoading(false)
    }
  }

  const handleDisconnect = async () => {
    if (
      !confirm(
        'Are you sure you want to disconnect from your trainer? They will no longer be able to view your progress.'
      )
    ) {
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      await disconnectFromTrainer(currentUserId)
      await onTrainerUpdated()
      setTrainerInfo(null) // Clear trainer info after update
      setSuccess('Successfully disconnected from trainer')
    } catch (err) {
      setError('Failed to disconnect from trainer')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Current Trainer Status */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-bold">Trainer Connection</h2>
        </CardHeader>
        <CardContent>
          {currentTrainerId ? (
            <div className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Connected to</p>
                    <p className="text-lg font-bold text-green-700">
                      {trainerInfo ? trainerInfo.name : 'Your Trainer'}
                    </p>
                    {trainerInfo && <p className="text-sm text-gray-600">{trainerInfo.email}</p>}
                    <p className="text-sm text-gray-500 mt-2">
                      Trainer Code: <span className="font-mono font-bold">{currentTrainerId}</span>
                    </p>
                  </div>
                  <div className="text-3xl">💪</div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  ℹ️ Your trainer has <strong>read-only</strong> access to your weight logs and
                  workout history. They cannot edit or delete your data.
                </p>
              </div>

              <Button
                onClick={handleDisconnect}
                disabled={loading}
                variant="outline"
                className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                {loading ? 'Disconnecting...' : 'Disconnect from Trainer'}
              </Button>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">🏋️</div>
              <p className="text-gray-600 mb-2">You're not connected to a trainer</p>
              <p className="text-sm text-gray-500">
                Connect with a trainer to get personalized guidance and support
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Connect to Trainer Form */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-bold">
            {currentTrainerId ? 'Switch Trainer' : 'Connect to a Trainer'}
          </h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleConnectTrainer} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Trainer Invite Code</label>
              <input
                type="text"
                value={trainerCode}
                onChange={e => setTrainerCode(e.target.value.toUpperCase())}
                className="w-full px-4 py-3 border rounded-md font-mono text-lg tracking-wider uppercase"
                placeholder="ABCD12"
                maxLength={6}
                required
                disabled={loading}
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter the 6-character code provided by your trainer
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                ❌ {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md text-sm">
                ✅ {success}
              </div>
            )}

            <Button type="submit" disabled={loading || trainerCode.length !== 6} className="w-full">
              {loading
                ? 'Connecting...'
                : currentTrainerId
                  ? 'Switch Trainer'
                  : 'Connect to Trainer'}
            </Button>
          </form>

          {currentTrainerId && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-xs text-yellow-800">
                ⚠️ Switching trainers will disconnect you from your current trainer and connect you
                to the new one.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
