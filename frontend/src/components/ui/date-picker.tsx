import * as React from "react";
import { format } from "date-fns";

import { cn } from "../../utils/cn";
import { Button } from "./button";
import { Calendar } from "./calender";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Calendar02Icon } from "../../assets";
import { XIcon } from "../../assets";
import FieldErrorMessage from "./field-error-msg";

interface DatePickerProps {
  iconAlign?: "left" | "right";
  className?: string;
  disabled?: boolean;
  value?: Date | null;
  placeholder?: string;
  id?: string;
  onChange?: (value: Date | null) => void;
  error?: boolean;
  errorMessage?: string;
  iconEnd?: boolean;
  clearable?: boolean;
  calendarDisabled?: (date: Date) => boolean;
  intent?: "ghost" | "outline" | "plain" | "none";
  placeholderClassName?: string;
}

export function DatePicker({
  iconAlign,
  className,
  disabled,
  value,
  onChange,
  placeholder,
  id,
  error,
  errorMessage,
  clearable = false,
  iconEnd = false,
  calendarDisabled,
  intent = "outline",
  placeholderClassName,
}: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger disabled={disabled} asChild>
        <div>
          <Button
            id={id}
            intent="outline"
            size={2}
            className={cn(
              "w-full justify-start text-left font-normal hover:bg-transparent ",
              !value && "text-text-default-tertiary",
              error && "border-border-error-solid",
              disabled && "cursor-not-allowed opacity-50",
              className,
            )}
          >
            {!iconEnd && <Calendar02Icon className="size-5 text-icon-active" />}
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
                format(value, "MMM dd, yyyy")
              ) : (
                <span className={placeholderClassName}>{placeholder}</span>
              )}
            </span>
            {iconEnd && <Calendar02Icon className="size-5 text-icon-active" />}
          </Button>
          {error && errorMessage && (
            <FieldErrorMessage message={errorMessage} />
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto !p-0 shadow-none border-none"
        align="start"
      >
        <Calendar
          mode="single"
          selected={value ?? undefined}
          onSelect={(date) => {
            onChange?.(date ?? null);
          }}
          initialFocus
          disabled={calendarDisabled}
        />
      </PopoverContent>
    </Popover>
  );
}
