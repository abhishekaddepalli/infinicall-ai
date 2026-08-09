import { cn } from '@/lib/utils'
import { TextareaProps } from '@/types/shared'
import * as React from 'react'

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        'flex min-h-20 bg-input-color w-full no-scrollbar rounded-radius   border border-input-border-color dark:border-white/10 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground/60 focus-visible:outline-none focus:shadow-none! focus:outline-none focus:border-primary! focus:ring-primary! disabled:cursor-not-allowed disabled:opacity-50 transition-all',
        className,
        'font-normal'
      )}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = 'Textarea'

export { Textarea }
