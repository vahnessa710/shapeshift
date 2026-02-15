import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { WeightLog } from '../lib/firestore'

interface WeightProgressChartProps {
  weightLogs: WeightLog[]
}

export const WeightProgressChart = ({ weightLogs }: WeightProgressChartProps) => {
  // Prepare data for chart (sort by date ascending)
  const chartData = weightLogs
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .map(log => ({
      date: log.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      weight: log.weight,
      fullDate: log.date,
    }))

  // Calculate stats
  const getStats = () => {
    if (weightLogs.length === 0) return null

    const sortedLogs = [...weightLogs].sort((a, b) => a.date.getTime() - b.date.getTime())
    const firstWeight = sortedLogs[0].weight
    const lastWeight = sortedLogs[sortedLogs.length - 1].weight
    const weightChange = lastWeight - firstWeight
    const percentChange = ((weightChange / firstWeight) * 100).toFixed(1)

    // Calculate min and max for the period
    const minWeight = Math.min(...weightLogs.map(l => l.weight))
    const maxWeight = Math.max(...weightLogs.map(l => l.weight))

    return {
      firstWeight,
      lastWeight,
      weightChange,
      percentChange: parseFloat(percentChange),
      minWeight,
      maxWeight,
    }
  }

  const stats = getStats()

  if (weightLogs.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg mb-2">No weight data yet</p>
        <p className="text-sm">Start logging your weight to see your progress!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Current Weight</p>
            <p className="text-2xl font-bold text-blue-700">{stats.lastWeight} kg</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Starting Weight</p>
            <p className="text-2xl font-bold text-purple-700">{stats.firstWeight} kg</p>
          </div>
          <div
            className={`p-4 rounded-lg ${stats.weightChange <= 0 ? 'bg-green-50' : 'bg-orange-50'}`}
          >
            <p className="text-sm text-gray-600">Total Change</p>
            <p
              className={`text-2xl font-bold ${stats.weightChange <= 0 ? 'text-green-700' : 'text-orange-700'}`}
            >
              {stats.weightChange > 0 ? '+' : ''}
              {stats.weightChange.toFixed(1)} kg
            </p>
          </div>
          <div
            className={`p-4 rounded-lg ${stats.percentChange <= 0 ? 'bg-green-50' : 'bg-orange-50'}`}
          >
            <p className="text-sm text-gray-600">Percentage</p>
            <p
              className={`text-2xl font-bold ${stats.percentChange <= 0 ? 'text-green-700' : 'text-orange-700'}`}
            >
              {stats.percentChange > 0 ? '+' : ''}
              {stats.percentChange}%
            </p>
          </div>
        </div>
      )}

      {/* Chart */}
      <div className="bg-white p-4 rounded-lg border">
        <h3 className="text-lg font-semibold mb-4">Weight Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis
              domain={['dataMin - 2', 'dataMax + 2']}
              tick={{ fontSize: 12 }}
              label={{ value: 'Weight (kg)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip
              contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc' }}
              formatter={value => [`${value ?? 0} kg`, 'Weight']}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="weight"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ fill: '#3b82f6', r: 4 }}
              activeDot={{ r: 6 }}
              name="Weight"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Range Info */}
      {stats && (
        <div className="text-sm text-gray-600 text-center">
          <p>
            Weight range: <span className="font-semibold">{stats.minWeight} kg</span> -{' '}
            <span className="font-semibold">{stats.maxWeight} kg</span>
          </p>
        </div>
      )}
    </div>
  )
}
