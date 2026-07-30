'use client'

import { cn } from '@/lib/utils'
import { SpinnerProps } from '@/types/shared'

const Spinner = ({ className, size = 'lg', text }: SpinnerProps) => {
  const spinnerSizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  }

  return (
    <div className={cn('flex flex-col items-center justify-center w-full min-h-[calc(100vh-200px)] gap-4', className)}>
      <div 
        className={cn(
          'animate-spin rounded-full border-b-4 border-primary', 
          spinnerSizes[size]
        )} 
      />
      {text && (
        <p className={cn('text-muted-foreground font-bold uppercase tracking-wider animate-pulse', size === 'sm' ? 'text-xs' : 'text-sm')}>
          {text}
        </p>
      )}
    </div>
  )
}

export default Spinner
