'use client'

import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { useProfile } from '@/hooks/useProfile'
import { UserAIFeatureUsageProps } from '@/types/plans'
import { Info, RefreshCw } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const UserAIFeatureUsage = ({ sub }: UserAIFeatureUsageProps) => {
  const { t } = useTranslation()
  const { data: profileData } = useProfile()

  const user = profileData?.user || {}
  const plan = typeof sub.plan_id === 'object' ? sub.plan_id : null

  const totalCredits = user.total_credits || plan?.total_credits || 0
  const usedCredits = user.used_credits || 0
  const remainingCredits = Math.max(0, totalCredits - usedCredits)
  const usagePercentage = totalCredits > 0 ? Math.min(100, (usedCredits / totalCredits) * 100) : 0

  return (
    <Card className="w-full h-full bg-bg-card border border-input-border-color rounded-lg flex flex-col justify-between sm:p-6 p-4">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-title text-lg">{t('credits_usage', 'Credits Usage')}</h3>
            <Info className="w-4 h-4 text-subtitle-color" />
          </div>
          <div className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-bold">
            {usagePercentage.toFixed(0)}%
          </div>
        </div>

        <div className="space-y-2">
          <Progress value={usagePercentage} className="h-2.5 bg-primary/10" />
          <div className="text-sm mt-2">
            <span className="text-title font-bold">
              {usedCredits} / {totalCredits}
            </span>
            <span className="text-subtitle-color ml-1">{t('used', 'Used')}</span>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-input-border-color flex flex-col sm:flex-row sm:items-stretch justify-between gap-4 sm:gap-0">
        <div className="flex-1">
          <p className="text-md font-medium text-subtitle-color mb-1">{t('available_credits', 'Available Credits')}</p>
          <p className="text-3xl font-black text-title leading-none mt-1">{remainingCredits}</p>
        </div>

        <div className="hidden sm:block w-px bg-input-border-color shrink-0 mx-2"></div>

        <div className="flex-1 sm:text-right text-left flex flex-col sm:items-end items-start">
          <p className="text-md font-medium text-subtitle-color mb-1">{t('reset_cycle', 'Reset Cycle')}</p>
          <p className="text-base font-bold text-primary flex items-center gap-1.5 mt-0.5">
            <RefreshCw className="w-4 h-4" />
            {t('every', 'Every')} {t(sub.billing_cycle || 'month', 'Month')}
          </p>
        </div>
      </div>
    </Card>
  )
}

export default UserAIFeatureUsage
