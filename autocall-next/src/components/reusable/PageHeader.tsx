'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { PageHeaderProps } from '@/types/shared'
import { ArrowLeft } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { LimitBadge } from './LimitBadge'

export const PageHeader = ({
  title,
  showBackButton = true,
  onBack,
  primaryAction,
  endContent,
}: PageHeaderProps) => {
  const router = useRouter()
  const pathname = usePathname()

  const getModuleKey = () => {
    if (pathname === '/ai-assistants') return 'agents'
    if (pathname === '/ai-campaign-hub') return 'campaigns'
    if (pathname === '/workflow-builder') return 'flows'
    if (pathname === '/intelligence-hub') return 'kb'
    if (pathname === '/contact-hub') return 'contacts'
    if (pathname === '/sms-assistants') return 'sms_agents'
    if (pathname === '/sms-campaigns') return 'sms_campaigns'
    return null
  }
  const moduleKey = getModuleKey()

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
      <div className="flex items-center gap-4">
        {showBackButton && (
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-radius bg-primary/10 dark:bg-primary/20 text-primary transition-all duration-300 shadow-sm shrink-0 border-none border-primary/20"
            onClick={onBack || (() => router.back())}
          >
            <ArrowLeft className="w-4 h-4 " />
          </Button>
        )}
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold text-title">
            {title}
          </h1>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full md:w-auto">
        {moduleKey && (
          <LimitBadge module={moduleKey} />
        )}

        {primaryAction && (
          <Button
            onClick={primaryAction.onClick}
            className={cn(
              'rounded-radius! p-padding! text-white font-medium transition-all duration-300 flex items-center justify-center gap-2',
              primaryAction.className,
            )}
          >
            {primaryAction.icon}
            <span>{primaryAction.label}</span>
          </Button>
        )}

        {endContent && (
          <div className="flex items-center gap-3">
            {endContent}
          </div>
        )}
      </div>
    </div>
  )
}
