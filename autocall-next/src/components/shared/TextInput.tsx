'use client'

import { cn } from '@/lib/utils'
import { TextInputProps } from '@/types/formFields'
import { useField } from 'formik'
import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { Input } from '../ui/input'
import FormFieldWrapper from './FormFieldWrapper'

const TextInput = ({
  label,
  icon: Icon,
  formGroupClass,
  labelClass,
  helperText,
  layout = 'vertical',
  ...props
}: TextInputProps) => {
  const [field, meta] = useField(props.name)
  const [showPassword, setShowPassword] = useState(false)

  const isPassword = props.type === 'password'
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : props.type

  const toggleVisibility = () => setShowPassword((prev) => !prev)

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
      <div className="relative w-full">
        {Icon && (
          <div
            className={cn(
              'absolute top-1/2 -translate-y-1/2 text-muted-foreground transition-all duration-300',
              props.className?.includes('rounded-full') ? 'left-5' : 'left-3',
            )}
          >
            <Icon size={18} className="opacity-70 group-focus-within:opacity-100" />
          </div>
        )}
        <Input
          {...field}
          {...props}
          type={inputType}
          id={props.id || props.name}
          className={cn(
            meta.touched && meta.error && 'border-destructive h-10 border-input-border-color focus-visible:ring-destructive',
            Icon && 'pl-10',
            isPassword && 'pr-10',
          )}
          value={field.value ?? ''}
        />
        {isPassword && (
          <div
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-subtitle-color transition-colors"
            onClick={toggleVisibility}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </div>
        )}
      </div>
    </FormFieldWrapper>
  )
}

export default TextInput
