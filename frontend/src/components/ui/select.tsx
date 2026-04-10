import * as SelectPrimitive from "@radix-ui/react-select";
import * as React from "react";
import { cn } from "../../utils/cn";
import { Check02Icon, ChevronDownIcon } from "../../assets";

const Select = SelectPrimitive.Root;

const SelectGroup = SelectPrimitive.Group;

const SelectValue = SelectPrimitive.Value;

type SelectTriggerProps = React.ComponentPropsWithoutRef<
  typeof SelectPrimitive.Trigger
> & {
  hideChevronIcon?: boolean;
  iconStart?: React.ElementType;
  fullWidth?: boolean;
  intent?: "default" | "ghost";
};

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  SelectTriggerProps
>(
  (
    {
      className,
      children,
      iconStart: IconStart,
      hideChevronIcon,
      fullWidth = false,
      intent = "default",
      ...props
    },
    ref,
  ) => (
    <SelectPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex gap-2 items-center justify-between text-text-default rounded-md border text-sm border-border bg-background px-2.5 sm:px-3 py-2.5 font-medium ring-offset-background focus:outline-none focus:ring-[0.5px] focus:ring-primary focus:ring-offset-[0.5px] disabled:cursor-not-allowed disabled:bg-secondary [&>span]:line-clamp-1 [&[data-placeholder]>span]:text-default-tertiary [&[data-placeholder]>span]:font-normal",
        fullWidth && "w-full",
        className,
      )}
      {...props}
    >
      {IconStart && <IconStart className="size-4" />}
      {children}
      {!hideChevronIcon && (
        <SelectPrimitive.Icon asChild>
          <ChevronDownIcon className="size-4 flex-shrink-0" />
        </SelectPrimitive.Icon>
      )}
    </SelectPrimitive.Trigger>
  ),
);
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className,
    )}
    {...props}
  >
    <ChevronDownIcon className="h-4 w-4 rotate-180" />
  </SelectPrimitive.ScrollUpButton>
));
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className,
    )}
    {...props}
  >
    <ChevronDownIcon className="h-4 w-4" />
  </SelectPrimitive.ScrollDownButton>
));
SelectScrollDownButton.displayName =
  SelectPrimitive.ScrollDownButton.displayName;

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content> & {
    hideChevronIcon?: boolean;
  }
>(
  (
    {
      className,
      children,
      position = "popper",
      hideChevronIcon = true,
      ...props
    },
    ref,
  ) => (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        ref={ref}
        className={cn(
          "relative z-[299] max-h-[200px] text-sm scrollbar-thin min-w-[8rem] overflow-hidden rounded-md border border-border bg-background shadow-hard/2x-small data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          position === "popper" &&
            "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
          className,
        )}
        position={position}
        {...props}
      >
        {hideChevronIcon || <SelectScrollUpButton />}
        <SelectPrimitive.Viewport
          className={cn(
            "p-1",
            position === "popper" &&
              "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]",
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
        {hideChevronIcon || <SelectScrollDownButton />}
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  ),
);
SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className)}
    {...props}
  />
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;

type SelectItemProps = React.ComponentPropsWithoutRef<
  typeof SelectPrimitive.Item
> & {
  showCheckIcon?: boolean;
  tickIcon?: React.ElementType;
};

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  SelectItemProps
>(
  (
    {
      className,
      children,
      showCheckIcon = true,
      tickIcon: TickIcon = Check02Icon,
      ...props
    },
    ref,
  ) => (
    <SelectPrimitive.Item
      ref={ref}
      className={cn(
        "relative flex w-full cursor-pointer select-none items-center font-normal rounded-3 py-2 pl-8 pr-4 mb-1 last:mb-0 text-14 text-text-default outline-none  data-[state=checked]:bg-fill-disabled data-[state=checked]:font-medium focus:bg-fill-disabled data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className,
        !showCheckIcon && "pl-2.5",
      )}
      {...props}
    >
      {showCheckIcon && (
        <span className="absolute left-2 flex items-center justify-center">
          <SelectPrimitive.ItemIndicator>
            <TickIcon className="size-4 " />
          </SelectPrimitive.ItemIndicator>
        </span>
      )}

      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  ),
);
SelectItem.displayName = SelectPrimitive.Item.displayName;

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-soft", className)}
    {...props}
  />
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

const SelectNoResults = ({
  text = "No Results",
  className,
}: {
  text?: string;
  className?: string;
}) => {
  return <p className={cn("p-3", className)}>{text}</p>;
};

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
  SelectNoResults,
};
