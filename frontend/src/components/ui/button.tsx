import { forwardRef, type ComponentType, type ReactNode } from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cn } from '../../utils/cn'

type ButtonIntent =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'danger'
  | 'dangerOutline'
  | 'link'

type ButtonSize = 1 | 2 | 3

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  intent?: ButtonIntent
  size?: ButtonSize
  iconStart?: ComponentType<{ className?: string }>
  iconEnd?: ComponentType<{ className?: string }>
  iconStartClassName?: string
  iconEndClassName?: string
  isLoading?: boolean
  children?: ReactNode
}
const intentStyles: Record<ButtonIntent, string> = {
  primary:      'text-white disabled:opacity-50 hover:opacity-90 active:scale-[0.98]',
  secondary:    'text-white disabled:opacity-50 hover:opacity-90 active:scale-[0.98]',
  outline:      'bg-transparent border disabled:opacity-50 hover:bg-gray-50 active:scale-[0.98]',
  ghost:        'bg-transparent disabled:opacity-50 hover:bg-gray-100 active:scale-[0.98]',
  danger:       'text-white disabled:opacity-50 hover:opacity-90 active:scale-[0.98]',
  dangerOutline:'bg-transparent border disabled:opacity-50 hover:bg-red-50 active:scale-[0.98]',
  link:         'bg-transparent underline-offset-4 hover:underline disabled:opacity-50',
}

const intentInlineStyles: Record<ButtonIntent, React.CSSProperties> = {
  primary:      { background: 'var(--bg-fill-primary)', color: 'var(--text-primary-on-bg-fill)' },
  secondary:    { background: 'var(--bg-fill-secondary)', color: 'var(--text-primary-on-bg-fill)' },
  outline:      { borderColor: 'var(--border-solid)', color: 'var(--text-default)' },
  ghost:        { color: 'var(--text-default)' },
  danger:       { background: 'var(--bg-fill-error)', color: 'var(--text-primary-on-bg-fill)' },
  dangerOutline:{ borderColor: 'var(--border-error-solid)', color: 'var(--text-error)' },
  link:         { color: 'var(--text-primary)' },
}

const sizeStyles: Record<ButtonSize, string> = {
  1: 'text-xs px-2.5 py-1.5',
  2: 'text-sm px-3 py-2.5',
  3: 'text-sm px-5 py-2.5',
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>((
  {
    asChild = false,
    intent = 'primary',
    size = 2,
    iconStart: IconStart,
    iconEnd: IconEnd,
    iconStartClassName,
    iconEndClassName,
    isLoading = false,
    disabled,
    className,
    children,
    style,
    ...props
  },
  ref
) => {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      ref={ref}
      type={props.type || 'button'}
      disabled={disabled || isLoading}
      className={cn(
        'inline-flex items-center cursor-pointer justify-center gap-2 font-medium rounded-md outline-none transition-all',
        'focus:ring-2 focus:ring-offset-1 disabled:cursor-not-allowed',
        intentStyles[intent],
        sizeStyles[size],
        className
      )}
      style={{ ...intentInlineStyles[intent], ...style }}
      {...props}
    >
      {isLoading && (
        <svg
          className="animate-spin size-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
      )}
      {IconStart && !isLoading && (
        <IconStart className={cn('size-4', iconStartClassName)} />
      )}
      {children}
      {IconEnd && (
        <IconEnd className={cn('size-4', iconEndClassName)} />
      )}
    </Comp>
  )
})

Button.displayName = 'Button'

export { Button, type ButtonProps }