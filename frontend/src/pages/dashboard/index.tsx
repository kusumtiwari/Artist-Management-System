import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Topbar from '../../components/layout/topbar'
import Tabs from '../../components/ui/tabs'
import type { Tab } from '../../components/ui/tabs'

const TABS: Tab[] = [
  { label: 'Users', value: 'users' },
  { label: 'Artists', value: 'artists' },
]

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('users')
  const navigate = useNavigate()

  const handleLogout = () => {
    // TODO: clear token
    navigate('/')
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: 'var(--bg-background)' }}
    >
      <Topbar onLogout={handleLogout} />

      <main className="flex-1 px-6 py-6 max-w-7xl w-full mx-auto">
        {/* page title */}
        <h1
          className="text-xl font-semibold mb-6"
          style={{ color: 'var(--text-default)' }}
        >
          Dashboard
        </h1>

        {/* tabs */}
        <Tabs tabs={TABS} active={activeTab} onChange={setActiveTab} />

        {/* table area */}
        <div className="mt-6">
          {activeTab === 'users' && (
            <div>
              {/* Users table goes here */}
            </div>
          )}
          {activeTab === 'artists' && (
            <div>
              {/* Artists table goes here */}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}