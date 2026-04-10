
import type { ReactNode } from 'react'
import Topbar from './topbar'

interface DashboardLayoutProps {
  children: ReactNode
  username: string
  onLogout: () => void
  role?: string
}

export function DashboardLayout({ children, username, onLogout, role }: DashboardLayoutProps) {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: 'var(--bg-background)' }}
    >
      <Topbar username={username} onLogout={onLogout} role={role} />
      <main className="flex-1 px-6 py-6 max-w-7xl w-full mx-auto">
        {children}
      </main>
    </div>
  )
}
