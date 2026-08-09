'use client'

import { Button } from '@/components/ui/button'
import { useGetImpersonationStatusQuery, useStopImpersonationMutation } from '@/redux/api/impersonationApi'
import { authUtils } from '@/utils/auth'
import { AlertTriangle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { ROUTES } from '@/constants/routes'

export default function ImpersonationBanner() {
  const { t } = useTranslation()
  const { data, isLoading } = useGetImpersonationStatusQuery(undefined, {
    refetchOnMountOrArgChange: true,
  })
  const [stopImpersonation, { isLoading: isStopping }] = useStopImpersonationMutation()

  if (isLoading || !data?.isImpersonating) return null

  const handleStop = async () => {
    try {
      const res = await stopImpersonation().unwrap()
      authUtils.setToken(res.token)
      if (res.originalUser) {
        authUtils.setUser(res.originalUser)
      }
      toast.success(t('impersonation_stopped', 'Impersonation stopped successfully'))
      window.location.href = ROUTES.DASHBOARD
    } catch (error: any) {
      toast.error(error?.data?.message || t('failed_to_stop_impersonation', 'Failed to stop impersonation'))
    }
  }

  return (
    <div className="bg-yellow-500 text-yellow-950 px-4 py-2 flex items-center justify-center gap-4 z-[60] sticky top-0 shadow-sm text-sm font-medium">
      <div className="flex items-center gap-2 flex-1 justify-center">
        <AlertTriangle className="w-5 h-5" />
        {t('impersonation_active_message', 'You are currently impersonating a user. Some actions may be restricted while this session is active.')}
      </div>
      <Button
        onClick={handleStop}
        disabled={isStopping}
        variant="destructive"
        size="sm"
        className="shrink-0 font-bold p-padding! h-10 hover:bg-destructive! hover:text-white"
      >
        {isStopping ? t('stopping', 'Stopping...') : t('stop_impersonation', 'Stop Impersonation')}
      </Button>
    </div>
  )
}
