'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Progress } from '@/components/ui/progress'
import { ROUTES } from '@/constants/routes'
import { useGetCreditBalanceQuery } from '@/redux/api/creditApi'
import { Eye, Wallet } from 'lucide-react';
import { Loader2 } from '@/components/reusable/Loader2';
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/navigation'
import { useMemo } from 'react'

const CreditBalanceDropdown = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const { data, isLoading } = useGetCreditBalanceQuery()

  const balance = data?.data || {}
  const totalCredits = Number(balance.total_credits || 0)
  const usedCredits = Number(balance.used_credits || 0)
  const availableCredits = Number(balance.available_credits || 0)

  const usagePercent = useMemo(() => {
    if (!totalCredits || totalCredits <= 0) return 0
    return Math.min(100, Math.max(0, (usedCredits / totalCredits) * 100))
  }, [totalCredits, usedCredits])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-10 px-3 rounded-md text-white/80 hover:text-white hover:bg-white/10 gap-2 inline-flex"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span className="font-semibold text-xs">{t('credits')}: {availableCredits}</span>}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[340px] p-0 rounded-2xl border border-input-border-color bg-bg-card overflow-hidden">
        <div className="p-4 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-base font-bold text-violet-600 dark:text-violet-300">{t('credits_overview')}</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">{t('usage_progress')}</p>
            </div>
            <Badge className="text-xs bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300 border-none shadow-none font-bold px-2 py-0.5">
              {usagePercent.toFixed(1)}%
            </Badge>
          </div>

          <Progress value={usagePercent} className="h-2" />

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-violet-50 dark:bg-violet-500/10 border border-violet-100 dark:border-violet-500/20">
              <p className="text-xs text-zinc-500 dark:text-zinc-400">{t('total')}</p>
              <p className="text-xl font-bold text-zinc-900 dark:text-white">{totalCredits}</p>
            </div>
            <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20">
              <p className="text-xs text-zinc-500 dark:text-zinc-400">{t('remaining')}</p>
              <p className="text-xl font-bold text-indigo-600 dark:text-indigo-300">{availableCredits}</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5"><Wallet className="w-4 h-4" /> {t('used_credits')}</span>
              <span className="font-semibold text-zinc-800 dark:text-zinc-100">{usedCredits}</span>
            </div>
          </div>

          <Button
            onClick={() => router.push(ROUTES.CREDIT_HISTORY)}
            className="w-full h-10 rounded-xl bg-primary text-white font-semibold"
          >
            <Eye className="w-4 h-4 mr-1" />
            {t('view_all')}
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default CreditBalanceDropdown
