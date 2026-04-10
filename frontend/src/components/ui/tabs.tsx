import { cn } from '../../utils/cn'

export type Tab = {
  label: string
  value: string
}

interface TabsProps {
  tabs: Tab[]
  active: string
  onChange: (value: string) => void
}

export default function Tabs({ tabs, active, onChange }: TabsProps) {
  return (
    <div
      className="flex items-center gap-1 border-b w-full"
      style={{ borderColor: 'var(--border-border)' }}
    >
      {tabs.map((tab) => {
        const isActive = tab.value === active
        return (
          <button
            key={tab.value}
            onClick={() => onChange(tab.value)}
            className={cn(
              'px-4 py-2.5 text-sm cursor-pointer font-medium transition-all outline-none relative',
              'hover:text-text-default',
            )}
            style={{
              color: isActive ? 'var(--text-primary)' : 'var(--text-default-tertiary)',
              borderBottom: isActive ? '2px solid var(--bg-fill-primary)' : '2px solid transparent',
              marginBottom: '-1px',
            }}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}