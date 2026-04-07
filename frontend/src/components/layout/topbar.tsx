import { Button } from '../ui/button'

interface TopbarProps {
  username?: string
  onLogout: () => void
}

export default function Topbar({ username = 'Admin', onLogout }: TopbarProps) {
  return (
    <header
      className="w-full h-14 px-6 flex items-center justify-between border-b"
      style={{
        background: 'var(--bg-background)',
        borderColor: 'var(--border-border)',
      }}
    >
      {/* logo */}
      <div className="flex items-center gap-2">
        <div
          className="w-6 h-6 rounded-sm"
          style={{ background: 'var(--bg-fill-primary)' }}
        />
        <span
          className="text-sm font-semibold tracking-wide uppercase"
          style={{ color: 'var(--text-default)' }}
        >
          AMS
        </span>
      </div>

      {/* right */}
      <div className="flex items-center gap-4">
        <p className="text-sm" style={{ color: 'var(--text-default-secondary)' }}>
          Welcome, <span style={{ color: 'var(--text-default)', fontWeight: 500 }}>{username}</span>
        </p>
        <Button intent="outline" size={1} onClick={onLogout}>
          Logout
        </Button>
      </div>
    </header>
  )
}