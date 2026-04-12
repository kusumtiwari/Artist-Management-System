import { DayPicker } from 'react-day-picker'
import type { DayPickerProps } from 'react-day-picker'
import { ChevronLeftIcon } from '../../assets'
import { cn } from '../../utils/cn'
import { useState, useRef, useEffect } from 'react'

type CalendarProps = DayPickerProps
type CalendarView = 'days' | 'months' | 'years'

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
]

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  const selectedDate = (props as any).selected instanceof Date ? (props as any).selected as Date : null
  const [viewDate, setViewDate] = useState<Date>(selectedDate ?? new Date())
  const [calView, setCalView] = useState<CalendarView>('days')
  const yearGridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (selectedDate) setViewDate(selectedDate)
  }, [selectedDate?.getTime()])

  useEffect(() => {
    if (calView === 'years') {
      requestAnimationFrame(() => {
        const el = yearGridRef.current?.querySelector('[data-selected="true"]')
        el?.scrollIntoView({ block: 'center', behavior: 'instant' })
      })
    }
  }, [calView])

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 120 }, (_, i) => currentYear - i)

  const goToPrev = () => setViewDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1))
  const goToNext = () => setViewDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1))

  // rendered as JSX directly, not as a component reference
  const caption = (
    <div className="flex items-center justify-between px-1 mb-2">
      <button
        type="button"
        onClick={calView === 'days' ? goToPrev : undefined}
        className={cn(
          'h-7 w-7 flex items-center justify-center rounded-md transition-colors',
          calView === 'days' ? 'hover:bg-bg-surface cursor-pointer text-icon' : 'opacity-0 pointer-events-none'
        )}
      >
        <ChevronLeftIcon className="size-4" />
      </button>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => setCalView(v => v === 'months' ? 'days' : 'months')}
          className={cn(
            'text-sm font-medium px-2 py-0.5 rounded-md transition-colors cursor-pointer hover:bg-bg-surface',
            calView === 'months' ? 'text-fill-primary' : 'text-text-default'
          )}
        >
          {MONTHS[viewDate.getMonth()]}
        </button>
        <button
          type="button"
          onClick={() => setCalView(v => v === 'years' ? 'days' : 'years')}
          className={cn(
            'text-sm font-medium px-2 py-0.5 rounded-md transition-colors cursor-pointer hover:bg-bg-surface',
            calView === 'years' ? 'text-fill-primary' : 'text-text-default'
          )}
        >
          {viewDate.getFullYear()}
        </button>
      </div>

      <button
        type="button"
        onClick={calView === 'days' ? goToNext : undefined}
        className={cn(
          'h-7 w-7 flex items-center justify-center rounded-md transition-colors',
          calView === 'days' ? 'hover:bg-bg-surface cursor-pointer text-icon' : 'opacity-0 pointer-events-none'
        )}
      >
        <ChevronLeftIcon className="size-4 rotate-180" />
      </button>
    </div>
  )

  if (calView === 'months') {
    return (
      <div className={cn('px-3 py-3 w-[280px] bg-background rounded-lg border border-border shadow-md', className)}>
        {caption}
        <div className="grid grid-cols-3 gap-2">
          {MONTHS.map((month, i) => {
            const isSelected = selectedDate?.getMonth() === i && selectedDate?.getFullYear() === viewDate.getFullYear()
            const isCurrent = new Date().getMonth() === i && new Date().getFullYear() === viewDate.getFullYear()
            return (
              <button
                key={month}
                type="button"
                onClick={() => { setViewDate(new Date(viewDate.getFullYear(), i, 1)); setCalView('days') }}
                className={cn(
                  'py-2 rounded-md text-sm font-medium transition-colors cursor-pointer',
                  isSelected ? 'bg-fill-primary text-white'
                  : isCurrent ? 'text-fill-primary hover:bg-bg-surface'
                  : 'text-text-default hover:bg-bg-surface'
                )}
              >
                {month}
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  if (calView === 'years') {
    return (
      <div className={cn('px-3 py-3 w-[280px] bg-background rounded-lg border border-border shadow-md', className)}>
        {caption}
        <div
          ref={yearGridRef}
          className="grid grid-cols-3 gap-2 overflow-y-auto"
          style={{ maxHeight: '220px' }}
        >
          {years.map((year) => {
            const isSelected = selectedDate?.getFullYear() === year
            const isCurrent = currentYear === year
            return (
              <button
                key={year}
                type="button"
                data-selected={isSelected}
                onClick={() => { setViewDate(new Date(year, viewDate.getMonth(), 1)); setCalView('days') }}
                className={cn(
                  'py-2 rounded-md text-sm font-medium transition-colors cursor-pointer',
                  isSelected ? 'bg-fill-primary text-white'
                  : isCurrent ? 'text-fill-primary hover:bg-bg-surface'
                  : 'text-text-default hover:bg-bg-surface'
                )}
              >
                {year}
              </button>
            )
          })}
        </div>
      </div>
    )
  }

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
        month: 'space-y-1',
        month_caption: 'hidden',
        caption_label: 'hidden',
        nav: 'hidden',
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
        // render caption as a static function to avoid re-creation
        MonthCaption: () => caption,
        Chevron: () => null,
      }}
      {...props}
    />
  )
}

Calendar.displayName = 'Calendar'
export { Calendar }