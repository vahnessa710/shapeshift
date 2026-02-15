import { Button } from '@shapeshift/ui/Button'
import { useAuth } from '../providers/AuthProvider'

export const NavBar = () => {
  const { userProfile, signOut } = useAuth()
  return (
    <nav>
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">🏋️ Shapeshift</h1>
            <p className="text-sm text-gray-600">Welcome back, {userProfile?.name}!</p>
          </div>
          <div className="flex items-center gap-4">
            {userProfile?.trainerId && (
              <div className="text-sm text-gray-600">
                Your Trainer's Code:{' '}
                <span className="font-mono font-bold">{userProfile.trainerId}</span>
              </div>
            )}
            <Button onClick={signOut} variant="outline" size="sm">
              Sign Out
            </Button>
          </div>
        </div>
      </header>
    </nav>
  )
}
