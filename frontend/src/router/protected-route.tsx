import { SpinnerLoading } from '../components/shared/spinner'
import { useAuth } from '../hooks/useAuth'
import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isChecking, isAuthenticated } = useAuth()

  if (isChecking) return (
    <div className="min-h-screen flex items-center justify-center">
      <SpinnerLoading/>
    </div>
  )

  if (!isAuthenticated) return <Navigate to="/login" replace />

  return <>{children}</>
}