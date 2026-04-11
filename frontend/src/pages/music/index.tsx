import { useParams } from 'react-router-dom'
import { DashboardLayout } from '../../components/layout/dashboard-layout'
import { SongsTable } from '../../components/dashboard/songs-table'
import { useMe, useLogout } from '../../queries/auth'
import { useArtist } from '../../queries/resources'

const ArtistMusicPage = () => {
  const { id } = useParams<{ id: string }>()
  const artistId = id ? parseInt(id, 10) : 0
  const { data: currentUser } = useMe()
  const { data: artist } = useArtist(artistId)
  const logout = useLogout()

  const username = currentUser ? `${currentUser.first_name} ${currentUser.last_name}` : 'Admin'
  const artistName = artist?.name || 'Unknown Artist'

  const handleLogout = () => {
    logout.mutate(undefined)
  }

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

  return (
    <DashboardLayout
      username={username}
      onLogout={handleLogout}
      role={currentUser?.isAdmin ? 'admin' : 'user'}
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-text-default">Artist Songs</h1>
          <p className="text-text-default-secondary">Manage songs for {artistName}</p>
        </div>
        <SongsTable artistId={artistId} artistName={artistName} />
      </div>
    </DashboardLayout>
  )
}

export default ArtistMusicPage