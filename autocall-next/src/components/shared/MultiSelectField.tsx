'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { MultiSelectFieldProps } from '@/types/shared'
import { Check, ChevronDown, Search, X } from 'lucide-react'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Input } from '../ui/input'
import { Label } from '../ui/label'

export default function MultiSelectField({
  label,
  options,
  value,
  onChange,
  placeholder,
  error,
  className,
  disabled,
  emptyStateTitle,
  emptyStateDescription,
  emptyStateActionLabel,
  onEmptyStateAction,
}: MultiSelectFieldProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')

  const safeValue = Array.isArray(value) ? value : []
  const selectedOptions = options.filter(opt => safeValue.includes(opt.value))
  const filteredOptions = options.filter(opt => opt.label.toLowerCase().includes(search.toLowerCase()))

  const toggleOption = (optionValue: string) => {
    const newValue = safeValue.includes(optionValue)
      ? safeValue.filter(v => v !== optionValue)
      : [...safeValue, optionValue]
    if (onChange) onChange(newValue)
  }

  const removeOption = (e: React.MouseEvent, optionValue: string) => {
    e.stopPropagation()
    if (onChange) onChange(safeValue.filter(v => v !== optionValue))
  }

  return (
    <div className={cn('space-y-3 flex flex-col', className)}>
      {label && (
        <Label className="text-md font-medium text-title">
          {label}
        </Label>
      )}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div
            className={cn(
              "flex min-h-[40px] h-auto w-full items-center  justify-between rounded-radius border border-input-border-color dark:border-white/10  bg-input-color! px-4 py-2 text-sm transition-all duration-200 hover:border-primary/50 placeholder:text-muted-foreground  disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
              error && "border-red-500/50",
              open && "border-primary ring-4 ring-primary/10",
              disabled && "opacity-50 cursor-not-allowed pointer-events-none"
            )}
          >
            <div className="flex flex-wrap gap-2 flex-1 items-center overflow-hidden">
              {selectedOptions.length > 0 ? (
                selectedOptions.map((option) => (
                  <Badge
                    key={option.value}
                    variant="secondary"
                    className="pl-3 pr-1.5 py-1 h-8 rounded-radius bg-primary/10 hover:bg-primary text-primary hover:text-white border-transparent flex items-center gap-1.5 transition-all group/badge"
                  >
                    <span className="text-[11px] font-bold leading-none">{option.label}</span>
                    <Button
                      onClick={(e) => removeOption(e, option.value)}
                      className="rounded-radius p-0! bg-unset h-5 w-5 text-current flex items-center justify-center transition-all"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </Badge>
                ))
              ) : (
                <span className="text-muted-foreground font-medium ml-1 italic">
                  {placeholder || `Select options...`}
                </span>
              )}
            </div>
            <ChevronDown className={cn(
              "ml-2 h-4 w-4 shrink-0 text-zinc-400 transition-transform duration-300",
              open && "rotate-180 text-primary"
            )} />
          </div>
        </PopoverTrigger>
        <PopoverContent
          className="w-(--radix-popover-trigger-width) p-2 rounded-radius bg-bg-body border border-input-border-color shadow-2xl z-9999 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200"
          align="start"
          sideOffset={8}
        >
          <div className="relative mb-2">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <Input
              placeholder="Search..."
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
              className="pl-10 h-10 bg-input-color border-primary/5 focus:border-primary/30 text-title transition-all"
            />
          </div>
          <div 
            className="max-h-60 overflow-y-auto custom-scrollbar overscroll-contain pointer-events-auto p-1 space-y-1"
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
          >
            {options.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 px-4 text-center">
                <h4 className="text-md font-bold text-title mb-1">{emptyStateTitle || t('no_results_found')}</h4>
                <p className="text-sm text-subtitle-color mb-4 leading-relaxed max-w-[200px]">{emptyStateDescription || t('no_results_description')}</p>
                {emptyStateActionLabel && onEmptyStateAction && (
                  <Button
                    type="button"
                    size="sm"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onEmptyStateAction();
                    }}
                    className="bg-primary text-white rounded-lg h-9 w-full font-bold"
                  >
                    {emptyStateActionLabel}
                  </Button>
                )}
              </div>
            ) : filteredOptions.length > 0 ? (
              filteredOptions.map((option) => {
                const isSelected = safeValue.includes(option.value)
                return (
                  <div
                    key={option.value}
                    onClick={() => toggleOption(option.value)}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-radius cursor-pointer transition-all group",
                      isSelected
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-primary/10 dark:hover:bg-white/5 text-zinc-600 dark:text-zinc-400"
                    )}
                  >
                    <div className={cn(
                      "w-5 h-5 rounded-radius border-2 flex items-center justify-center transition-all shrink-0 duration-300",
                      isSelected
                        ? "bg-white dark:bg-primary/15 dark:border-none border-white text-primary scale-110"
                        : "border-zinc-200 dark:border-white/10 group-hover:border-primary/50"
                    )}>
                      {isSelected && <Check className="w-3.5 h-3.5" strokeWidth={4} />}
                    </div>
                    <span className="text-sm font-bold tracking-tight">{option.label}</span>
                  </div>
                )
              })
            ) : (
              <div className="py-8 text-center">
                <p className="text-sm text-zinc-500 font-medium">{t('no_results_description')}</p>
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>

      {error && <p className="text-[11px] text-red-500 mt-1 font-bold uppercase tracking-wider ml-1">{error}</p>}
    </div>
  )
}
