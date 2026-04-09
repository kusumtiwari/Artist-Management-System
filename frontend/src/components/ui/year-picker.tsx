import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../../utils/cn";
import { Button } from "./button";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Calendar02Icon } from "../../assets";
import { XIcon } from "../../assets";
import FieldErrorMessage from "./field-error-msg";

interface YearPickerProps {
  className?: string;
  disabled?: boolean;
  value?: number | null;
  placeholder?: string;
  id?: string;
  onChange?: (value: number | null) => void;
  error?: boolean;
  errorMessage?: string;
  clearable?: boolean;
  placeholderClassName?: string;
}

export function YearPicker({
  className,
  disabled,
  value,
  onChange,
  placeholder,
  id,
  error,
  errorMessage,
  clearable = false,
  placeholderClassName,
}: YearPickerProps) {
  const currentYear = new Date().getFullYear();
  const [displayYear, setDisplayYear] = React.useState(value || currentYear);
  const [open, setOpen] = React.useState(false);

  const startYear = Math.floor(displayYear / 10) * 10;
  const years = Array.from({ length: 10 }, (_, i) => startYear + i);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger disabled={disabled} asChild>
        <div>
          <Button
            id={id}
            intent="outline"
            size={2}
            className={cn(
              "w-full justify-start text-left font-normal",
              !value && "text-text-default-tertiary",
              error && "border-border-error-solid",
              disabled && "cursor-not-allowed opacity-50",
              className,
            )}
          >
            <Calendar02Icon className="size-5 text-icon-active" />
            {value && clearable && (
              <XIcon
                className="size-4 mx-2 ml-auto"
                onClick={(e) => {
                  e.preventDefault();
                  if (onChange) {
                    onChange(null);
                  }
                }}
              />
            )}
            <span className="flex-1">
              {value ? (
                <span>{value}</span>
              ) : (
                <span className={placeholderClassName}>{placeholder}</span>
              )}
            </span>
          </Button>
          {error && errorMessage && (
            <FieldErrorMessage message={errorMessage} />
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4 shadow-lg border border-border-default">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setDisplayYear(displayYear - 10)}
              className="p-1 hover:bg-bg-secondary rounded transition"
            >
              <ChevronLeft className="size-4" />
            </button>
            <span className="font-medium text-sm">
              {startYear} - {startYear + 9}
            </span>
            <button
              onClick={() => setDisplayYear(displayYear + 10)}
              className="p-1 hover:bg-bg-secondary rounded transition"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {years.map((year) => (
              <button
                key={year}
                onClick={() => {
                  onChange?.(year);
                  setOpen(false);
                }}
                className={cn(
                  "py-2 px-3 text-sm font-medium rounded transition",
                  value === year
                    ? "bg-primary text-white"
                    : "hover:bg-bg-secondary",
                )}
              >
                {year}
              </button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
