import { SpinnerLoading } from '../components/shared/spinner'
import { useAuth } from '../hooks/useAuth'
import { Navigate } from 'react-router-dom'

export default function GuestRoute({ children }: { children: React.ReactNode }) {
  const { isChecking, isAuthenticated } = useAuth()

  console.log(isAuthenticated, isChecking,'authenticated or not ---')

  if (isChecking) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-sm" style={{ color: 'var(--text-default-tertiary)' }}>
       <SpinnerLoading/>
      </p>
    </div>
  )

  if (isAuthenticated) return <Navigate to="/" replace />

  return <>{children}</>
}