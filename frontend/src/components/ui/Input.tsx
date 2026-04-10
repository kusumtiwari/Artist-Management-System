import * as React from 'react';
import { cn } from '../../utils/cn';
import FieldErrorMessage from './field-error-msg';
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  prefix?: string;
  suffix?: string;
  prefixIcon?: React.ElementType;
  prefixIconClassname?: string;
  error?: string;
  errorVariant?: 'default' | 'table' | 'tooltip';
  inputClassName?: string;
  containerClassName?: string;
  containerStyle?: React.CSSProperties;
  showErrorMessage?: boolean;
  addOnAfter?: React.ReactNode;
  intent?: 'default' | 'ghost';
  relativeErrorMessage?: boolean;
  errorClassName?: string;
  hidden?: boolean;
  // size?: 'default' | 'small';
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type,
      className,
      inputClassName,
      containerClassName,
      containerStyle,
      prefix,
      prefixIcon: PrefixIcon,
      prefixIconClassname,
      showErrorMessage = true,
      disabled,
      error,
      errorVariant = 'default',
      addOnAfter,
      suffix,
      intent = 'default',
      relativeErrorMessage = false,
      hidden,
      errorClassName="text-red-500 text-sm",

      // size = 'default',
      ...props
    },
    ref
  ) => {
    const inputStyles = cn(
      'flex-1 border-0 outline-none text-text-default w-full placeholder:text-default-tertiary placeholder:font-normal font-medium text-sm bg-transparent',
      inputClassName,
      disabled && 'cursor-not-allowed',
      intent === 'ghost' && 'bg-transparent border-0'
    );

    if (hidden) {
      return null;
    }

    return (
      <div className={cn(containerClassName)} style={containerStyle}>
        <div
          className={cn(
            'w-full inline-flex gap-2 items-center rounded-md border border-border text-default px-3 py-2.5 text-16 bg-background  focus-within:ring-[0.5px] focus-within:ring-offset-[0.5px] focus-within:ring-offset-background focus-within:ring-primary h-11',
            className,
            disabled && 'bg-tertiary',
            addOnAfter && 'py-0 pr-0',
            intent === 'ghost' && 'bg-transparent border-0 px-0 focus-within:ring-0 focus-within:ring-offset-0',
            error && 'border-error bg-surface-error focus-within:ring-0 focus-within:ring-offset-0'
            // size === 'small' ? 'h-9' : 'h-11'
          )}
        >
          {prefix && <span className="text-default mr-1  ">{prefix}</span>}
          {PrefixIcon && <PrefixIcon className={cn('size-5', prefixIconClassname)} />}
          <input type={type} className={inputStyles} ref={ref} disabled={disabled} {...props} />
          {suffix && <span className="text-default ml-1">{suffix}</span>}
          {addOnAfter && <div className="rounded-r-4 bg-teritary h-full place-content-center px-3">{addOnAfter}</div>}
        
        </div>
        {showErrorMessage && error && errorVariant === 'default' && (
          <FieldErrorMessage message={error} relative={relativeErrorMessage} className={errorClassName} />
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input };
