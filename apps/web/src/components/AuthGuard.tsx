import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../providers/AuthProvider'

interface AuthGuardProps {
  children: ReactNode
  requireRole?: 'TRAINEE' | 'TRAINER'
}

export const AuthGuard = ({ children, requireRole }: AuthGuardProps) => {
  const { currentUser, userProfile, loading } = useAuth()

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />
  }

  // If user has no role and is trying to access a protected route (not onboarding)
  if (!userProfile?.role && requireRole) {
    return <Navigate to="/onboarding" replace />
  }

  // If user has a role but is trying to access wrong dashboard
  if (requireRole && userProfile?.role && userProfile.role !== requireRole) {
    const redirectPath =
      userProfile.role === 'TRAINER' ? '/trainer/dashboard' : '/trainee/dashboard'
    return <Navigate to={redirectPath} replace />
  }

  return <>{children}</>
}
