import { useState } from 'react'
import { Card, CardHeader, CardContent } from '@shapeshift/ui/Card'
import { Button } from '@shapeshift/ui/Button'
import { WeightProgressChart } from './WeightProgressChart'
import { WeightLog, deleteWeightLog } from '../lib/firestore'

interface WeightLogTabProps {
  weightLogs: WeightLog[]
  weightInput: string
  setWeightInput: (value: string) => void
  weightDate: string
  setWeightDate: (value: string) => void
  handleAddWeight: (e: React.FormEvent) => void
  onWeightDeleted: () => Promise<void> // Add this new prop
}

export const WeightLogTab = ({
  weightLogs,
  weightInput,
  setWeightInput,
  weightDate,
  setWeightDate,
  handleAddWeight,
  onWeightDeleted,
}: WeightLogTabProps) => {
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDeleteWeight = async (weightId: string) => {
    if (!confirm('Are you sure you want to delete this weight entry?')) return

    setDeletingId(weightId)
    try {
      await deleteWeightLog(weightId)
      await onWeightDeleted() // Refresh the list
    } catch (error) {
      console.error('Error deleting weight:', error)
      alert('Failed to delete weight entry')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Progress Chart - Full Width */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-bold">Weight Loss Progress</h2>
        </CardHeader>
        <CardContent>
          <WeightProgressChart weightLogs={weightLogs} />
        </CardContent>
      </Card>

      {/* Log Form and History */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <h2 className="text-xl font-bold">Log Weight</h2>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddWeight} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={weightInput}
                  onChange={e => setWeightInput(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="75.5"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <input
                  type="date"
                  value={weightDate}
                  onChange={e => setWeightDate(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Add Weight
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-bold">Weight History</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {weightLogs.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No weight logs yet</p>
              ) : (
                weightLogs.map(log => (
                  <div
                    key={log.id}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded hover:bg-gray-100 transition"
                  >
                    <div className="flex items-center gap-4">
                      <span className="font-bold text-lg">{log.weight} kg</span>
                      <span className="text-sm text-gray-600">{log.date.toLocaleDateString()}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteWeight(log.id!)}
                      disabled={deletingId === log.id}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      {deletingId === log.id ? 'Deleting...' : '🗑️'}
                    </Button>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
