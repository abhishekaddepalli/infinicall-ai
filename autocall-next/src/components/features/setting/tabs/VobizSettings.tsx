'use client'

import TextInput from '@/components/shared/TextInput'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useTranslation } from 'react-i18next'

export default function VobizSettings() {
  const { t } = useTranslation()

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <Card className="bg-bg-card border border-input-border-color rounded-radius overflow-hidden">
        <CardHeader className="sm:px-6 px-4 py-5 border-b border-input-border-color bg-slate-50/30 dark:bg-zinc-900/10">
          <div className="flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <CardTitle className="sm:text-xl text-lg font-bold text-title">
                {t('vobiz_configuration', 'Vobiz AI Configuration')}
              </CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput
              name="vobiz_auth_id"
              label={t('vobiz_auth_id_label', 'Vobiz Auth ID')}
              placeholder="Enter Vobiz Auth ID"
            />
            <TextInput
              name="vobiz_auth_token"
              label={t('vobiz_auth_token_label', 'Vobiz Auth Token')}
              placeholder={t('enter_vobiz_token', 'Enter Vobiz Auth Token')}
              type="password"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
