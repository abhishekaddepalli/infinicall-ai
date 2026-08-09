import { LucideIcon } from 'lucide-react'
import type { DecoupledEditor as DecoupledEditorType } from '@ckeditor/ckeditor5-editor-decoupled'
export interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string
  label?: React.ReactNode
  icon?: LucideIcon
  formGroupClass?: string
  labelClass?: string
  helperText?: string
  layout?: 'horizontal' | 'vertical'
}

export interface OtpInputProps {
  value: string[]
  onChange: (value: string[]) => void
  digits?: number
  className?: string
}

export interface FormFieldWrapperProps {
  label?: React.ReactNode
  id: string
  name: string
  error?: string
  touched?: boolean
  helperText?: string
  layout?: 'horizontal' | 'vertical'
  labelClass?: string
  formGroupClass?: string
  children: React.ReactNode
}

export interface TextAreaFieldProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  name: string
  label?: React.ReactNode
  formGroupClass?: string
  labelClass?: string
  helperText?: string
  layout?: 'horizontal' | 'vertical'
}

export interface SelectFieldProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'options'> {
  name: string
  label?: React.ReactNode
  placeholder?: string
  options: { label: string; value: string }[]
  formGroupClass?: string
  labelClass?: string
  helperText?: string
  layout?: 'horizontal' | 'vertical'
  emptyStateTitle?: string
  emptyStateDescription?: string
  emptyStateActionLabel?: string
  onEmptyStateAction?: () => void
}

export type EditorModules = {
  CKEditor: any
  DecoupledEditor: typeof DecoupledEditorType
  plugins: unknown[]
}