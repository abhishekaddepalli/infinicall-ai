'use client'

import { cn } from '@/lib/utils'
import { TextAreaFieldProps } from '@/types/formFields'
import { useField } from 'formik'
import { Textarea } from '../ui/textArea'
import FormFieldWrapper from './FormFieldWrapper'

const TextAreaField = ({
  label,
  formGroupClass,
  labelClass,
  helperText,
  layout = 'vertical',
  ...props
}: TextAreaFieldProps) => {
  const [field, meta] = useField(props.name)

  return (
    <FormFieldWrapper
      label={label}
      id={props.id || props.name}
      name={props.name}
      error={meta.error}
      touched={meta.touched}
      helperText={helperText}
      layout={layout}
      labelClass={labelClass}
      formGroupClass={formGroupClass}
    >
      <Textarea
        {...field}
        {...props}
        id={props.id || props.name}
        className={cn(props.className, meta.touched && meta.error && 'border-destructive focus-visible:ring-destructive')}
        value={field.value ?? ''}
      />
    </FormFieldWrapper>
  )
}

export default TextAreaField
