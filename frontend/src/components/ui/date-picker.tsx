import * as React from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, getYear, getMonth } from "date-fns";
import { cn } from "../../utils/cn";
import { Calendar02Icon, XIcon, ChevronLeftIcon } from "../../assets";
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

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

function YearSelect({
  value,
  years,
  onChange,
}: {
  value: number;
  years: number[];
  onChange: (y: number) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  const selectedRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  React.useEffect(() => {
    if (open) {
      requestAnimationFrame(() => {
        selectedRef.current?.scrollIntoView({
          block: "center",
          behavior: "instant",
        });
      });
    }
  }, [open]);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "4px",
          padding: "3px 8px",
          border: "1px solid var(--border-border)",
          borderRadius: "6px",
          background: "var(--bg-surface, #f5f5f5)",
          color: "var(--text-default)",
          fontSize: "13px",
          fontWeight: 500,
          cursor: "pointer",
          minWidth: "68px",
          justifyContent: "space-between",
        }}
      >
        {value}
        <span
          style={{
            fontSize: "9px",
            opacity: 0.6,
            transform: open ? "rotate(180deg)" : "none",
            display: "inline-block",
            transition: "transform 0.15s",
          }}
        >
          ▾
        </span>
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "110%",
            left: 0,
            zIndex: 99999,
            background: "var(--bg-background)",
            border: "1px solid var(--border-border)",
            borderRadius: "8px",
            maxHeight: "180px",
            overflowY: "auto",
            minWidth: "72px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
            padding: "4px",
          }}
        >
          {years.map((y) => (
            <div
              key={y}
              ref={y === value ? selectedRef : undefined}
              onClick={() => {
                onChange(y);
                setOpen(false);
              }}
              style={{
                padding: "6px 10px",
                fontSize: "13px",
                borderRadius: "5px",
                cursor: "pointer",
                background: y === value ? "#16a34a" : "transparent",
                color: y === value ? "white" : "var(--text-default)",
                fontWeight: y === value ? 600 : 400,
                userSelect: "none",
              }}
              onMouseEnter={(e) => {
                if (y !== value)
                  e.currentTarget.style.background = "rgba(22,163,74,0.08)";
              }}
              onMouseLeave={(e) => {
                if (y !== value)
                  e.currentTarget.style.background = "transparent";
              }}
            >
              {y}
            </div>
          ))}
        </div>
      )}
    </div>
  );
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
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.(null);
  };

  return (
    <div className="w-full">
      <style>{`
        .rdp-custom .react-datepicker-wrapper { width: 100%; }
        .rdp-custom .react-datepicker__input-container { width: 100%; }
        .rdp-custom .react-datepicker {
          border: 1px solid var(--border-border);
          border-radius: 10px;
          font-family: inherit;
          background: var(--bg-background);
          box-shadow: 0 8px 30px rgba(0,0,0,0.12);
          overflow: visible;
        }
        .rdp-custom .react-datepicker__triangle { display: none; }
        .rdp-custom .react-datepicker__header {
          background: var(--bg-background);
          border-bottom: 1px solid var(--border-border);
          border-radius: 10px 10px 0 0;
          padding: 12px 12px 10px;
        }
        .rdp-custom .react-datepicker__day-names {
          display: flex;
          justify-content: space-around;
          padding: 0 4px;
          margin: 0;
        }
        .rdp-custom .react-datepicker__day-name {
          color: var(--text-default-tertiary, #aaa);
          font-size: 11px;
          font-weight: 500;
          width: 34px;
          line-height: 28px;
          text-align: center;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }
        .rdp-custom .react-datepicker__month { padding: 8px 10px 10px; margin: 0; }
        .rdp-custom .react-datepicker__week {
          display: flex;
          justify-content: space-around;
          margin-bottom: 2px;
        }
        .rdp-custom .react-datepicker__day {
          width: 34px;
          height: 34px;
          line-height: 34px;
          border-radius: 8px;
          color: var(--text-default);
          font-size: 13px;
          text-align: center;
          transition: background 0.1s, color 0.1s;
          margin: 0;
        }
        .rdp-custom .react-datepicker__day:hover:not(.react-datepicker__day--selected):not(.react-datepicker__day--disabled) {
          background: rgba(22,163,74,0.08);
          color: #16a34a;
        }
        .rdp-custom .react-datepicker__day--selected,
        .rdp-custom .react-datepicker__day--selected:hover {
          background: #16a34a;
          color: white;
          font-weight: 600;
        }
        .rdp-custom .react-datepicker__day--today:not(.react-datepicker__day--selected) {
          color: #16a34a;
          font-weight: 700;
        }
        .rdp-custom .react-datepicker__day--outside-month { opacity: 0.35; }
        .rdp-custom .react-datepicker__day--disabled {
          opacity: 0.35;
          cursor: not-allowed;
        }
        .rdp-custom .react-datepicker-popper {
          z-index: 9999;
          padding-top: 6px !important;
        }

        /* custom header selects */
        .rdp-custom .rdp-select {
          appearance: none;
          background: var(--bg-surface, #f5f5f5);
          border: 1px solid var(--border-border);
          border-radius: 6px;
          color: var(--text-default);
          font-size: 13px;
          font-weight: 500;
          padding: 3px 22px 3px 8px;
          cursor: pointer;
          outline: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2.5'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 5px center;
          max-width: 120px;
        }
        .rdp-custom .rdp-select:hover,
        .rdp-custom .rdp-select:focus { border-color: #16a34a; }

        /* year select scrollable via size attribute */
        .rdp-custom .rdp-year-select {
          max-height: 180px;
        }
      `}</style>

      <div className="rdp-custom w-full">
        <ReactDatePicker
          selected={value ?? null}
          onChange={(date) => onChange?.(date ?? null)}
          disabled={disabled}
          maxDate={new Date()}
          filterDate={
            calendarDisabled ? (date) => !calendarDisabled(date) : undefined
          }
          popperPlacement="bottom-start"
          popperModifiers={[
            { name: "offset", options: { offset: [0, 6] } } as any,
            {
              name: "preventOverflow",
              options: { boundary: "viewport", padding: 16 },
            } as any,
            {
              name: "flip",
              options: { fallbackPlacements: ["bottom-start", "bottom-end"] },
            } as any,
          ]}
          renderCustomHeader={({
            date,
            changeYear,
            changeMonth,
            decreaseMonth,
            increaseMonth,
            prevMonthButtonDisabled,
            nextMonthButtonDisabled,
          }) => (
            <div className="flex items-center justify-between gap-2">
              {/* prev arrow */}
              <button
                type="button"
                onClick={decreaseMonth}
                disabled={prevMonthButtonDisabled}
                className="h-7 w-7 flex items-center justify-center rounded-md hover:bg-gray-100 disabled:opacity-30 cursor-pointer transition-colors"
              >
                <ChevronLeftIcon className="size-4 text-icon" />
              </button>

              <div className="flex items-center gap-2 flex-1 justify-center">
                {/* month select */}
                <select
                  className="rdp-select"
                  value={MONTHS[getMonth(date)]}
                  onChange={(e) => changeMonth(MONTHS.indexOf(e.target.value))}
                >
                  {MONTHS.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>

                <YearSelect
                  value={getYear(date)}
                  years={years}
                  onChange={(y) => changeYear(y)}
                />
              </div>

              {/* next arrow */}
              <button
                type="button"
                onClick={increaseMonth}
                disabled={nextMonthButtonDisabled}
                className="h-7 w-7 flex items-center justify-center rounded-md hover:bg-gray-100 disabled:opacity-30 cursor-pointer transition-colors"
              >
                <ChevronLeftIcon className="size-4 rotate-180 text-icon" />
              </button>
            </div>
          )}
          customInput={
            <button
              id={id}
              type="button"
              className={cn(
                "w-full h-11 flex items-center gap-2 px-3 rounded-md border text-left font-normal transition-colors",
                "border-border bg-transparent",
                error && "border-red-500",
                disabled && "cursor-not-allowed opacity-50",
                className,
              )}
            >
              <Calendar02Icon className="size-4 shrink-0 text-icon" />
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
                  className="shrink-0 size-5 rounded-full flex items-center justify-center text-icon hover:text-text-default transition-colors"
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
