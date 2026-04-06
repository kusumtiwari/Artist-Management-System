import React from 'react'
import { cn } from '../../utils/cn'

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  htmlFor: string
  className?: string
  required?: boolean
}

export function Label({ htmlFor, className, required, children, ...props }: LabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn('text-xs font-medium uppercase', className)}
      style={{ color: 'var(--text-default-secondary)' }}
      {...props}
    >
      {children}
      {required && <span style={{ color: 'var(--text-error)' }}> *</span>}
    </label>
  )
}