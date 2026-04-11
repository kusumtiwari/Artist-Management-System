import { DayPicker } from 'react-day-picker'
import type { DayPickerProps } from 'react-day-picker'
import { ChevronLeftIcon } from '../../assets'
import { cn } from '../../utils/cn'
import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'

type CalendarProps = DayPickerProps

interface YearDropdownProps {
  value: number
  years: number[]
  onChange: (year: number) => void
}

function YearDropdown({ value, years, onChange }: YearDropdownProps) {
  const [open, setOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const selectedRef = useRef<HTMLDivElement>(null)
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 })

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        listRef.current && !listRef.current.contains(e.target as Node) &&
        buttonRef.current && !buttonRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => {
    if (open) {
      const rect = buttonRef.current?.getBoundingClientRect()
      if (rect) {
        setCoords({
          top: rect.bottom + window.scrollY + 4,
          left: rect.left + window.scrollX,
          width: rect.width,
        })
      }
      requestAnimationFrame(() => {
        selectedRef.current?.scrollIntoView({ block: 'center', behavior: 'instant' })
      })
    }
  }, [open])

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen(!open)}
        className="text-sm font-medium cursor-pointer rounded px-2 py-0.5"
        style={{
          background: open ? 'var(--bg-surface)' : 'transparent',
          border: '1px solid var(--border-border)',
          color: 'var(--text-default)',
          minWidth: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '4px',
          transition: 'background 0.15s',
        }}
      >
        {value}
        <span style={{
          fontSize: '10px',
          opacity: 0.6,
          display: 'inline-block',
          transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.15s',
        }}>▾</span>
      </button>

      {open && createPortal(
        <div
          ref={listRef}
          style={{
            position: 'absolute',
            top: coords.top,
            left: coords.left,
            minWidth: Math.max(coords.width, 72),
            zIndex: 9999,
            background: 'var(--bg-background)',
            border: '1px solid var(--border-border)',
            borderRadius: '8px',
            maxHeight: '200px',
            overflowY: 'auto',
            overflowX: 'hidden',
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            padding: '4px',
          }}
        >
          {years.map((year) => {
            const isSelected = year === value
            return (
              <div
                key={year}
                ref={isSelected ? selectedRef : undefined}
                onClick={() => { onChange(year); setOpen(false) }}
                style={{
                  padding: '6px 10px',
                  fontSize: '13px',
                  cursor: 'pointer',
                  borderRadius: '5px',
                  background: isSelected ? '#16a34a' : 'transparent',
                  color: isSelected ? 'white' : 'var(--text-default)',
                  fontWeight: isSelected ? 500 : 400,
                  transition: 'background 0.1s',
                  userSelect: 'none',
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) e.currentTarget.style.background = 'var(--bg-surface)'
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) e.currentTarget.style.background = 'transparent'
                }}
              >
                {year}
              </div>
            )
          })}
        </div>,
        document.body
      )}
    </>
  )
}

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  const selectedDate = (props as any).selected instanceof Date ? (props as any).selected as Date : null

  const [viewDate, setViewDate] = useState<Date>(selectedDate ?? new Date())

  // sync viewDate when selected changes from outside (e.g. edit mode pre-fill)
  useEffect(() => {
    if (selectedDate) {
      setViewDate(selectedDate)
    }
  }, [selectedDate?.getTime()])

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i)
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ]

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      month={viewDate}
      onMonthChange={setViewDate}
      className={cn(
        'px-3 py-3 w-[280px] bg-background rounded-lg border border-border shadow-md font-normal',
        className
      )}
      classNames={{
        months: 'flex flex-col',
        month: 'space-y-3',
        month_caption: 'flex justify-center pt-1 relative items-center',
        caption_label: 'hidden',
        nav: 'flex items-center gap-1',
        button_previous: cn('absolute left-1 h-8 w-8 flex items-center justify-center rounded-md cursor-pointer'),
        button_next: cn('absolute right-1 h-8 w-8 flex items-center justify-center rounded-md cursor-pointer'),
        month_grid: 'w-full border-collapse',
        weekdays: 'flex py-2',
        weekday: 'text-text-default-tertiary w-9 font-normal text-xs text-center',
        week: 'flex w-full mt-1',
        day: 'w-9 h-9 p-0 relative flex items-center justify-center text-sm rounded-md cursor-pointer text-text-default-secondary',
        day_button: 'w-full h-full flex items-center justify-center rounded-md',
        selected: 'bg-fill-primary text-white hover:bg-fill-primary rounded-md',
        today: 'text-text-primary font-medium',
        outside: 'text-text-disabled opacity-50',
        disabled: 'text-text-disabled opacity-50 cursor-not-allowed',
        range_start: '!bg-fill-primary !text-white rounded-md',
        range_end: '!bg-fill-primary !text-white rounded-md',
        range_middle: 'bg-surface-primary text-text-default',
        hidden: 'invisible',
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) => (
          <ChevronLeftIcon className={cn('size-4 text-icon', orientation === 'right' && 'rotate-180')} />
        ),
        MonthCaption: ({ calendarMonth }) => (
          <div className="flex items-center justify-center gap-1 w-full px-8">
            <select
              value={calendarMonth.date.getMonth()}
              onChange={(e) => {
                const newDate = new Date(viewDate)
                newDate.setMonth(Number(e.target.value))
                setViewDate(newDate)
              }}
              className="text-sm font-medium cursor-pointer rounded px-1 py-0.5"
              style={{
                background: 'transparent',
                border: '1px solid var(--border-border)',
                color: 'var(--text-default)',
              }}
            >
              {months.map((month, i) => (
                <option key={month} value={i}>{month}</option>
              ))}
            </select>
            <YearDropdown
              value={calendarMonth.date.getFullYear()}
              years={years}
              onChange={(year) => {
                const newDate = new Date(viewDate)
                newDate.setFullYear(year)
                setViewDate(newDate)
              }}
            />
          </div>
        ),
      }}
      {...props}
    />
  )
}

Calendar.displayName = 'Calendar'
export { Calendar }