'use client'

import { Button } from '@/components/ui/button'
import { ROUTES } from '@/constants/routes'
import { ArrowLeft, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import GoogleAccountsTable from './GoogleAccountsTable'
import { useGoogleWorkspace } from './hooks/useGoogleWorkspace'

export default function GoogleWorkspacePage() {
  const { handleConnect, isConnecting } = useGoogleWorkspace()
  const { t } = useTranslation()
  const router = useRouter()

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-title flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-radius bg-primary/10 dark:bg-primary/20 text-primary transition-all duration-300 shadow-sm shrink-0 border-none border-primary/20"
              onClick={(() => router.push(ROUTES.TOOLBOX))}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            {t('google_workspace')}
          </h1>
        </div>

        <Button
          onClick={handleConnect}
          disabled={isConnecting}
          className="rounded-radius! p-padding! text-white font-medium transition-all duration-300 flex items-center justify-center gap-2"
        >
          <Plus className="h-4 w-4" strokeWidth={2.5} />
          {t('connect_google_account')}
        </Button>
      </div>

      <GoogleAccountsTable />
    </div>
  )
}
