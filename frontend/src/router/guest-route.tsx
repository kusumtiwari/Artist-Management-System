import { useAuth } from '../hooks/useAuth'
import { Navigate } from 'react-router-dom'

export default function GuestRoute({ children }: { children: React.ReactNode }) {
  const { isChecking, isAuthenticated } = useAuth()

  if (isChecking) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-sm" style={{ color: 'var(--text-default-tertiary)' }}>
        Loading...
      </p>
    </div>
  )

  if (isAuthenticated) return <Navigate to="/dashboard" replace />

  return <>{children}</>
}