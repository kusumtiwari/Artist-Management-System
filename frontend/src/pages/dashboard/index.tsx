import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DashboardLayout } from '../../components/layout/dashboard-layout'
import Tabs from '../../components/ui/tabs'
import type { Tab } from '../../components/ui/tabs'
import { useLogout, useMe } from '../../queries/auth'
import { ArtistsTable } from '../../components/dashboard/artist-table'
import { UsersTable } from '../../components/dashboard/user-table'

const TABS: Tab[] = [
  { label: 'Users', value: 'users' },
  { label: 'Artists', value: 'artists' },
]

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'users' | 'artists'>('users')
  const navigate = useNavigate()
  const { data: currentUser } = useMe();

  console.log(currentUser,'current user')
  const logout = useLogout()

  const username = currentUser ? `${currentUser.first_name} ${currentUser.last_name}` : 'Admin'

  if (currentUser && !currentUser.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-background)' }}>
        <div className="max-w-md w-full text-center p-6 rounded-lg shadow-sm bg-white">
          <h2 className="text-xl font-semibold">Access denied</h2>
          <p className="mt-4 text-sm text-default-secondary">
            You are signed in, but only admin users can access the dashboard.
          </p>
        </div>
      </div>
    )
  }

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => navigate('/login'),
      onError: () => navigate('/login'),
    })
  }

  return (
    <DashboardLayout username={username} onLogout={handleLogout} role={currentUser?.isAdmin ? 'admin' : 'user'}>
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: 'var(--text-default)' }}>
            Dashboard
          </h1>
          <p className="mt-2 text-sm text-text-default-secondary">
            Manage users and artists from separate table views.
          </p>
        </div>
      </div>

      {/* tabs */}
      <Tabs tabs={TABS} active={activeTab} onChange={(value) => setActiveTab(value as 'users' | 'artists')} />

      {/* table area */}
      <div className="mt-6">
        {activeTab === 'users' && <UsersTable />}
        {activeTab === 'artists' && <ArtistsTable />}
      </div>
    </DashboardLayout>
  )
}
