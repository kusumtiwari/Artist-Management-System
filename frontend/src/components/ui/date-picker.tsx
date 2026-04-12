import * as React from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import { cn } from "../../utils/cn";
import { Calendar02Icon, XIcon } from "../../assets";
import FieldErrorMessage from "./field-error-msg";

interface DatePickerProps {
  className?: string;
  disabled?: boolean;
  value?: Date | null;
  placeholder?: string;
  id?: string;
  onChange?: (value: Date | null) => void;
  error?: boolean;
  errorMessage?: string;
  clearable?: boolean;
  calendarDisabled?: (date: Date) => boolean;
  placeholderClassName?: string;
}

export function DatePicker({
  className,
  disabled,
  value,
  onChange,
  placeholder = "Select date",
  id,
  error,
  errorMessage,
  clearable = false,
  calendarDisabled,
  placeholderClassName,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.(null);
  };

  return (
    <div className="w-full">
      <style>{`
        .rdp-custom .react-datepicker {
          border: 1px solid var(--border-border);
          border-radius: 8px;
          font-family: inherit;
          background: var(--bg-background);
          box-shadow: 0 8px 24px rgba(0,0,0,0.1);
          overflow: hidden;
          width: full;
        }
        .rdp-custom .react-datepicker__header {
          background: var(--bg-background);
          border-bottom: 1px solid var(--border-border);
          padding: 12px 8px 8px;
        }
        .rdp-custom .react-datepicker__current-month {
          display: none;
        }
        .rdp-custom .react-datepicker__navigation {
          top: 14px;
        }
        .rdp-custom .react-datepicker__navigation-icon::before {
          border-color: var(--icon-icon);
        }
        .rdp-custom .react-datepicker__month-select,
        .rdp-custom .react-datepicker__year-select {
          background: transparent;
          border: 1px solid var(--border-border);
          border-radius: 6px;
          color: var(--text-default);
          font-size: 13px;
          font-weight: 500;
          padding: 2px 4px;
          cursor: pointer;
          outline: none;
        }
        .rdp-custom .react-datepicker__month-dropdown-container,
        .rdp-custom .react-datepicker__year-dropdown-container {
          margin: 0 3px;
        }
        .rdp-custom .react-datepicker__day-names {
          margin-top: 6px;
        }
        .rdp-custom .react-datepicker__day-name {
          color: var(--text-default-tertiary);
          font-size: 11px;
          width: 32px;
          line-height: 32px;
        }
        .rdp-custom .react-datepicker__day {
          width: 32px;
          line-height: 32px;
          border-radius: 6px;
          color: var(--text-default-secondary);
          font-size: 13px;
          transition: background 0.1s;
        }
        .rdp-custom .react-datepicker__day:hover {
          background: var(--bg-surface);
          border-radius: 6px;
        }
        .rdp-custom .react-datepicker__day--selected,
        .rdp-custom .react-datepicker__day--selected:hover {
          background: #16a34a;
          color: white;
          border-radius: 6px;
          font-weight: 500;
        }
        .rdp-custom .react-datepicker__day--today {
          color: #16a34a;
          font-weight: 600;
        }
        .rdp-custom .react-datepicker__day--today.react-datepicker__day--selected {
          color: white;
        }
        .rdp-custom .react-datepicker__day--outside-month {
          color: var(--text-disabled);
          opacity: 0.4;
        }
        .rdp-custom .react-datepicker__day--disabled {
          color: var(--text-disabled);
          opacity: 0.4;
          cursor: not-allowed;
        }
        .rdp-custom .react-datepicker__month {
          padding: 4px 8px 8px;
          margin: 0;
        }
        .rdp-custom .react-datepicker__triangle {
          display: none;
        }
        .rdp-custom .react-datepicker-popper {
          z-index: 9999;
        }
        .rdp-custom .react-datepicker__year-option,
        .rdp-custom .react-datepicker__month-option {
          color: var(--text-default);
          background: var(--bg-background);
        }
        .rdp-custom .react-datepicker__year-option:hover,
        .rdp-custom .react-datepicker__month-option:hover {
          background: var(--bg-surface);
        }
      `}</style>

      <div className="rdp-custom w-full">
        <ReactDatePicker
          selected={value ?? null}
          onChange={(date) => {
            onChange?.(date ?? null);
          }}
          disabled={disabled}
          filterDate={
            calendarDisabled ? (date) => !calendarDisabled(date) : undefined
          }
          showMonthDropdown
          showYearDropdown
          scrollableYearDropdown
          yearDropdownItemNumber={60}
         dropdownMode="scroll" 
          popperPlacement="bottom-start"
          popperModifiers={[
            { name: "offset", options: { offset: [0, 8] } } as any,
            {
              name: "preventOverflow",
              options: {
                boundary: "viewport",
                padding: 16,
              },
            } as any,
            {
              name: "flip",
              options: {
                fallbackPlacements: ["bottom-start", "bottom-end", "bottom"],
              },
            } as any,
          ]}
          customInput={
            <button
              id={id}
              type="button"
              className={cn(
  "w-full h-11 flex items-center gap-2 px-3 rounded-md border text-left font-normal transition-colors",
  "border-border bg-transparent hover:bg-transparent",  // ← was border-border-border
  error && "border-border-error-solid",
  disabled && "cursor-not-allowed opacity-50",
  className,
)}
            >
              <Calendar02Icon
                className={cn(
                  "size-4 shrink-0",
                  open ? "text-fill-primary" : "text-icon",
                )}
              />
              <span className="flex-1 truncate text-sm">
                {value ? (
                  <span className="text-text-default">
                    {format(value, "MMM dd, yyyy")}
                  </span>
                ) : (
                  <span
                    className={cn(
                      "text-text-default-tertiary",
                      placeholderClassName,
                    )}
                  >
                    {placeholder}
                  </span>
                )}
              </span>
              {value && clearable && (
                <span
                  role="button"
                  onClick={handleClear}
                  className="shrink-0 size-5 rounded-full flex items-center justify-center text-icon hover:text-text-default"
                >
                  <XIcon className="size-3" />
                </span>
              )}
            </button>
          }
        />
      </div>

      {error && errorMessage && <FieldErrorMessage message={errorMessage} />}
    </div>
  );
}
