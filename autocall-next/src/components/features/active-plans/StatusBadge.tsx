'use client'

import { Badge } from '@/components/ui/badge'
import { subscription_status_config } from '@/data/subscription'
import { cn } from '@/lib/utils'
import { HistoryStatusBadgeProps } from '@/types/subscriptions'
import { Clock, XCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export const StatusBadge = ({ status }: { status?: string }) => {
  const { t } = useTranslation()

  if (!status) {
    return <span className="text-sm text-subtitle-color font-medium italic">-</span>
  }

  const normalizedStatus = status.toLowerCase()
  const config = subscription_status_config[normalizedStatus]

  const label = config ? (t(config.labelKey) || config.labelKey) : (t(status) || status)
  const className = config ? config.className : 'bg-slate-500/10 text-slate-500 border-slate-500/20'
  const icon = config ? config.icon : <Clock className="w-3 h-3" />

  return (
    <Badge
      variant="outline"
      className={cn(
        'text-[11px] font-bold rounded-full px-2.5 h-6 flex items-center gap-1.5 capitalize w-fit',
        className,
      )}
    >
      {icon}
      {label}
    </Badge>
  )
}

export const HistoryStatusBadge = ({ status, isCanceled }: HistoryStatusBadgeProps) => {
  const { t } = useTranslation()
  if (isCanceled && status === 'active') {
    return (
      <Badge
        variant="outline"
        className="text-[10px] font-bold rounded-md px-2 h-6 flex items-center gap-1 w-fit bg-red-100 text-red-600 border-red-300"
      >
        <XCircle className="w-3 h-3" />
        {t('cancelling')}
      </Badge>
    )
  }
  return <StatusBadge status={status} />
}

export default StatusBadge
