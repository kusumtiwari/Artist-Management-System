import { DayPicker } from 'react-day-picker'
import type { DayPickerProps } from 'react-day-picker'
import { ChevronLeftIcon } from '../../assets'
import { cn } from '../../utils/cn'

type CalendarProps = DayPickerProps

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        'px-3 py-3 w-[280px] bg-background rounded-lg border border-border shadow-md font-normal',
        className
      )}
      classNames={{
        months: 'flex flex-col',
        month: 'space-y-3',
        month_caption: 'flex justify-center pt-1 relative items-center',
        caption_label: 'text-sm text-text-default font-medium',
        nav: 'flex items-center gap-1',
        button_previous: cn(
          'absolute left-1 h-8 w-8 flex items-center justify-center rounded-md cursor-pointer'
        ),
        button_next: cn(
          'absolute right-1 h-8 w-8 flex items-center justify-center rounded-md cursor-pointer'
        ),
        month_grid: 'w-full border-collapse',
        weekdays: 'flex py-2',
        weekday: 'text-text-default-tertiary w-9 font-normal text-xs text-center',
        week: 'flex w-full mt-1',
        day: 'w-9 h-9 p-0 relative flex items-center justify-center text-sm rounded-md cursor-pointer cursor-pointer text-text-default-secondary',
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
          <ChevronLeftIcon
            className={cn(
              'size-4 text-icon',
              orientation === 'right' && 'rotate-180'
            )}
          />
        ),
      }}
      {...props}
    />
  )
}

Calendar.displayName = 'Calendar'

export { Calendar }