'use client'

import { Button } from '@/components/ui/button'
import { ROUTES } from '@/constants/routes'
import { FloatingActionBarProps } from '@/types/agent'
import { Settings2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'

export function FloatingActionBar({
  isCreating,
  isUpdating,
  isFormValid,
  agentId,
  onSubmit
}: FloatingActionBarProps) {
  const { t } = useTranslation()
  const router = useRouter()

  return (
    <div className="flex items-center gap-3 transition-all duration-300">
      <Button
        type="button"
        variant="ghost"
        onClick={() => router.push(ROUTES.AI_ASSISTANTS)}
        className="p-padding! rounded-radius font-medium  text-md text-subtitle-color bg-subcard border border-input-border-color transition-all"
      >
        {t('cancel')}
      </Button>

      <Button
        onClick={onSubmit}
        disabled={isCreating || isUpdating || !isFormValid}
        className="p-padding! rounded-radius bg-primary  text-white font-medium text-md disabled:opacity-35 transition-all flex items-center gap-2"
      >
        {isCreating || isUpdating ? (
          <>
            <Settings2 className="w-5 h-5 animate-spin" />
            <span>{t('updating')}...</span>
          </>
        ) : (
          <>
            <span>{agentId ? t('save_changes') : t('create')}</span>
          </>
        )}
      </Button>
    </div>
  )
}
