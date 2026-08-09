'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { AgentTypeTabsProps } from '@/types/agent'
import { GitBranch, Sparkles } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function AgentTypeTabs({ type, setType }: AgentTypeTabsProps) {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col items-center justify-center space-y-3">
      <div className="relative flex p-1.5 bg-input-color rounded-radius border border-input-border-color dark:border-white/5 w-full max-w-lg gap-2">
        
        {/* Tab 1: Incoming */}
        <Button
          type="button"
          onClick={() => setType('incoming')}
          className={cn(
            "flex-1 flex items-center justify-center gap-2.5 p-padding h-10 rounded-radius font-black text-sm relative",
            type === 'incoming'
              ? "bg-primary text-white border border-primary/10"
              : "text-subtitle-color dark:text-zinc-400 dark:hover:text-white bg-transparent"
          )}
        >
          <Sparkles className={cn("w-4 h-4 transition-transform duration-300", type === 'incoming' ? "scale-110 text-white" : "text-slate-400 dark:text-zinc-500")} />
          <span>{t('incoming')}</span>
        </Button>

        {/* Tab 2: Flow Builder */}
        <Button
          type="button"
          onClick={() => setType('flow')}
          className={cn(
            "flex-1 flex items-center justify-center gap-2.5 p-padding h-10 rounded-radius font-black text-sm relative",
            type === 'flow'
               ? "bg-primary text-white border border-primary/10"
              : "text-subtitle-color dark:text-zinc-400 dark:hover:text-white bg-transparent"
          )}
        >
          <GitBranch className={cn("w-4 h-4 transition-transform duration-300", type === 'flow' ? "scale-110 text-white" : "text-slate-400 dark:text-zinc-500")} />
          <span>{t('outgoing')}</span>
        </Button>
      </div>
    </div>
  )
}
