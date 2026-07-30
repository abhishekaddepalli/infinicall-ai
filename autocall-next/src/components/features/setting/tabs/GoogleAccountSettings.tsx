'use client'

import TextInput from '@/components/shared/TextInput'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useTranslation } from 'react-i18next'

export default function GoogleAccountSetting() {
  const { t } = useTranslation()
  return (
    <div className="w-full space-y-8 animate-in fade-in duration-700">
      <Card className="flex-1 h-fit bg-bg-card border-input-border-color rounded-radius overflow-hidden">
        <CardHeader className="sm:px-6 px-4 py-5 border-b border-input-border-color">
          <div className="flex items-center gap-2 text-primary">
            <CardTitle className="sm:text-xl text-lg font-bold text-title">
              {t('google_account_configuration')}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="sm:p-6 p-4 space-y-5">
          <TextInput
            name="google_client_id"
            label={t('google_client_id')}
            placeholder={t('google_client_id_placeholder')}
          />
          <TextInput
            name="google_client_secret"
            label={t('google_client_secret')}
            placeholder={t('google_client_secret_placeholder')}
            type="password"
          />
          <TextInput
            name="google_redirect_uri"
            label={t('google_redirect_uri')}
            placeholder={t('google_redirect_uri_placeholder')}
          />
        </CardContent>
      </Card>
    </div>
  )
}
