import './style.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './providers/AuthProvider'
import { AuthGuard } from './components/AuthGuard'
import { LoginPage } from './pages/Login'
import { OnboardingPage } from './pages/Onboarding'
import { TraineeDashboard } from './pages/TraineeDashboard'
import { TrainerDashboard } from './pages/TrainerDashboard'

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/onboarding"
            element={
              <AuthGuard>
                <OnboardingPage />
              </AuthGuard>
            }
          />
          <Route
            path="/trainee/dashboard"
            element={
              <AuthGuard requireRole="TRAINEE">
                <TraineeDashboard />
              </AuthGuard>
            }
          />
          <Route
            path="/trainer/dashboard"
            element={
              <AuthGuard requireRole="TRAINER">
                <TrainerDashboard />
              </AuthGuard>
            }
          />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
