'use client'

import { Button } from '@/components/ui/button'
import { AgentHeaderProps } from '@/types/agent'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'

export function AgentHeader({ agentId, children, centerContent }: AgentHeaderProps) {
  const { t } = useTranslation()
  const router = useRouter()

  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight flex text-title items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-radius bg-primary/10 dark:bg-primary/20 text-primary transition-all duration-300 shadow-sm shrink-0 border-none border-primary/20"
            onClick={ (() => router.back())}
          >
            <ArrowLeft className="w-4 h-4 " />
          </Button>
          <span>
            {agentId ? t('edit_agent') : t('create_agent')}
          </span>
        </h1>
      </div>
      
      {centerContent && (
        <div className="flex flex-1 justify-center w-full">
          {centerContent}
        </div>
      )}

      <div className="flex items-center justify-end gap-3 w-full lg:w-auto">
        {children}
      </div>
    </div>
  )
}
