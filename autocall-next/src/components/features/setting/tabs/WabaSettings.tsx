'use client'

import TextInput from '@/components/shared/TextInput'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useTranslation } from 'react-i18next'

export default function WabaSettings() {
  const { t } = useTranslation()

  return (
    <Card className="bg-bg-card border border-input-border-color rounded-radius overflow-hidden animate-in fade-in duration-300">
      <CardHeader className="sm:px-6 px-4 py-5 border-b border-slate-100 dark:border-zinc-800/60">
        <div className="flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <CardTitle className="sm:text-xl text-lg font-bold text-title">
              {t('waba_configuration')}
            </CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-6">
        <TextInput
          name="whatsapp_app_id"
          label={t('whatsapp_app_id_label')}
          placeholder={t('enter_whatsapp_app_id')}
        />
        <TextInput
          name="whatsapp_app_secret"
          label={t('whatsapp_app_secret_label')}
          placeholder={t('enter_whatsapp_app_secret')}
          type="password"
        />
        <TextInput
          name="configuration_id"
          label={t('configuration_id_label')}
          placeholder={t('enter_configuration_id')}
        />
      </CardContent>
    </Card>
  )
}
