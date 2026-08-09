'use client'

import { Progress } from "@/components/ui/progress"
import { StorageIndicatorProps } from "@/types/knowledgeBase"
import { useTranslation } from "react-i18next"

export const StorageIndicator = ({ used, limit }: StorageIndicatorProps) => {
  const { t } = useTranslation()
  const usedNum = parseFloat(used) || 0
  const limitNum = parseFloat(limit) || 20
  const percentage = Math.min((usedNum / limitNum) * 100, 100)

  return (
    <div className="bg-bg-card  border border-input-border-color rounded-radius px-4 py-3 flex flex-col gap-2 w-full sm:w-[260px]">
      <div className="flex justify-between items-center gap-2">
        <span className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">
          {t('storage_used')}
        </span>
        <div className="flex justify-end items-center gap-1">
          <span className="text-[12px] font-bold text-title">
            {usedNum.toFixed(2)} MB
          </span>
          <span className="text-[12px] text-gray-500 font-medium">
            / {limitNum.toFixed(2)} MB
          </span>
        </div>
      </div>
      <Progress value={percentage} className="h-1.5" />
    </div>
  )
}
