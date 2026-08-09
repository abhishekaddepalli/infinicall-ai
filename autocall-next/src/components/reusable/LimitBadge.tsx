'use client'

import { useLimits } from '@/hooks/useLimits'
import { cn } from '@/lib/utils'
import { LimitBadgeProps } from '@/types/shared'
import { BookOpen, GitBranch, MessageSquareText, Send, Target, UserCheck, Users } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export const LimitBadge = ({ module, className }: LimitBadgeProps) => {
  const { t } = useTranslation()
  const { isUser, isLoading, limits } = useLimits()

  if (!isUser) return null
  if (isLoading) {
    return (
      <div className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-200/50 dark:border-zinc-850 bg-slate-50/50 dark:bg-zinc-900/50 animate-pulse text-xs text-muted-foreground/60 font-semibold",
        className
      )}>
        <span className="h-2 w-2 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
        <span>{t('remaining')}: -- / --</span>
      </div>
    )
  }

  const moduleInfo = limits[module]
  if (!moduleInfo) return null

  const { limit, remaining } = moduleInfo

  const icons = {
    agents: Users,
    campaigns: Target,
    flows: GitBranch,
    kb: BookOpen,
    contacts: UserCheck,
    sms_agents: MessageSquareText,
    sms_campaigns: Send
  }
  const Icon = icons[module as keyof typeof icons] || Users

  const ratio = limit > 0 ? remaining / limit : 0
  const isNearLimit = ratio <= 0.2
  const isAtLimit = remaining === 0

  const badgeColors = isAtLimit
    ? "bg-rose-500/10 border-rose-500/20 text-rose-500 dark:bg-rose-950/20 dark:border-rose-900/30"
    : isNearLimit
      ? "bg-amber-500/10 border-amber-500/20 text-amber-500 dark:bg-amber-950/20 dark:border-amber-900/30"
      : "bg-primary/5 border-primary/10 text-primary dark:bg-primary/10 dark:border-primary/20 dark:text-primary-foreground"

  return (
    <div className={cn(
      "inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border shadow-2xl transition-all duration-200 hover:shadow-xs",
      badgeColors,
      className
    )}>
      <Icon className="w-3.5 h-3.5" />
      <span className="text-xs font-bold whitespace-nowrap">
        {t('remaining')}: {remaining} / {limit}
      </span>
    </div>
  )
}
