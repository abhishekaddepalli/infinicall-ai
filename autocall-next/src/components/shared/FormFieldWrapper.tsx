'use client'

import { cn } from '@/lib/utils'
import { FormFieldWrapperProps } from '@/types/formFields'
import { Label } from '../ui/label'

const FormFieldWrapper = ({
  label,
  id,
  error,
  touched,
  helperText,
  layout = 'vertical',
  labelClass,
  formGroupClass,
  children,
}: FormFieldWrapperProps) => {
  const hasError = touched && !!error

  return (
    <div className={cn('space-y-1.5 flex flex-col', formGroupClass)}>
      {label && (
        <Label
          htmlFor={id}
          className={cn(
            'text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-title mb-2!',
            labelClass,
          )}
        >
          {label}
        </Label>
      )}
      <div className={cn('relative', layout === 'horizontal' && 'flex items-center gap-4')}>{children}</div>
      {(hasError || helperText) && (
        <div className="w-full pointer-events-none mt-1!">
          {hasError && <p className="text-[11px] font-bold text-destructive leading-tight tracking-wide">{error}</p>}
          {helperText && !hasError && <p className="text-[11px] text-muted-foreground leading-tight tracking-wide">{helperText}</p>}
        </div>
      )}
    </div>
  )
}

export default FormFieldWrapper
