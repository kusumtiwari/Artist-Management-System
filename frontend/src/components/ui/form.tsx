import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import type {
  SubmitHandler,
  UseFormReturn,
  FieldValues,
  SubmitErrorHandler,
  DefaultValues,
} from 'react-hook-form'
import { cn } from '../../utils/cn'

type FormProps<TFormValues extends FieldValues> = {
  onSubmit: SubmitHandler<TFormValues>
  onError?: SubmitErrorHandler<TFormValues>
  children: (methods: UseFormReturn<TFormValues>) => React.ReactNode
  defaultValues?: DefaultValues<TFormValues>
  className?: string
}

const Form = <TFormValues extends Record<string, any> = Record<string, any>>({
  onSubmit,
  onError,
  children,
  defaultValues,
  className,
}: FormProps<TFormValues>) => {
  const methods = useForm<TFormValues>({ defaultValues })

  return (
    <form
      noValidate
      onSubmit={methods.handleSubmit(onSubmit, onError)}
      className={className}
    >
      {children(methods)}
    </form>
  )
}

function FormContent({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex flex-col gap-5', className)}>
      {children}
    </div>
  )
}

function FormGroup({
  children,
  horizontal,
  className,
}: {
  children: React.ReactNode;
  horizontal?: boolean;
  className?: string;
}) {
  return (
    <div className={cn('flex flex-col gap-1.5', horizontal && 'flex-row gap-2.5 items-center', className)}>
      {children}
    </div>
  );
}


export { Form, FormContent, FormGroup }