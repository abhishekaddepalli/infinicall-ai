
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { CustomTooltipProps } from '@/types/shared'

export function CustomTooltip({ children, title, side = 'top', align = 'center', className }: CustomTooltipProps) {
  if (!title) {
    return <>{children}</>
  }

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          {children}
        </TooltipTrigger>
        <TooltipContent side={side} align={align} className={className}>
          {title}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
