'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { SelectFieldProps } from '@/types/formFields'
import { useField } from 'formik'
import { Button } from '../ui/button'
import FormFieldWrapper from './FormFieldWrapper'

const SelectField = ({
  label,
  options,
  formGroupClass,
  labelClass,
  helperText,
  layout = 'vertical',
  ...props
}: SelectFieldProps) => {
  const [field, meta, helpers] = useField(props.name)

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
      <Select
        value={field.value}
        onValueChange={(value) => helpers.setValue(value)}
        disabled={props.disabled}
      >
        <SelectTrigger
          id={props.id || props.name}
          className={cn(
            'flex h-10 w-full rounded-radius px-3 text-sm shadow-none! border-input-border-color border bg-input-color dark:text-subtitle-color',
            meta.touched &&
              meta.error &&
              'border-destructive ring-destructive',
            props.className
          )}
        >
          <SelectValue placeholder={props.placeholder || 'Select option'} />
        </SelectTrigger>

        <SelectContent className="bg-white dark:bg-bg-card rounded-radius border-input-border-color dark:border-white/10">
          {options.filter((o: any) => o.value !== '').length > 0 ? (
            options
              .filter((option: { label: string; value: string }) => option.value !== '')
              .map(
                (
                  option: { label: string; value: string },
                  index: number
                ) => (
                  <SelectItem
                    key={`${option.value}-${index}`}
                    value={option.value}
                    className="rounded-radius text-title hover:bg-primary/10 focus:text-black dark:hover:bg-white/5 dark:focus:bg-white/5 dark:focus:text-white! data-[state=checked]:bg-switch-background cursor-pointer"
                  >
                    {option.label}
                  </SelectItem>
                )
              )
          ) : (
            <div className="flex flex-col items-center justify-center py-6 px-4 text-center">
              <h4 className="text-md font-bold text-title mb-1">{props.emptyStateTitle || 'No Data Found'}</h4>
              <p className="text-sm text-subtitle-color mb-4 leading-relaxed max-w-[200px]">{props.emptyStateDescription || 'No available options for this field.'}</p>
              {props.emptyStateActionLabel && props.onEmptyStateAction && (
                <Button 
                  type="button" 
                  size="sm" 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    props.onEmptyStateAction?.();
                  }} 
                  className="bg-primary text-white rounded-lg h-9 w-full font-bold"
                >
                  {props.emptyStateActionLabel}
                </Button>
              )}
            </div>
          )}
        </SelectContent>
      </Select>
    </FormFieldWrapper>
  )
}

export default SelectField
