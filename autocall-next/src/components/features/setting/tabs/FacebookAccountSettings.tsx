'use client'

import TextInput from '@/components/shared/TextInput'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useTranslation } from 'react-i18next'

export default function FacebookAccountSettings() {
  const { t } = useTranslation()
  return (
    <div className="w-full space-y-8 animate-in fade-in duration-700">
      <Card className="flex-1 h-fit bg-bg-card border-input-border-color rounded-radius overflow-hidden">
        <CardHeader className="sm:px-6 px-4 py-5 border-b border-input-border-color">
          <div className="flex items-center gap-2 text-primary">
            <CardTitle className="sm:text-xl text-lg font-bold text-title">
              {t('facebook_account_configuration', 'Facebook Account Configuration')}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="sm:p-6 p-4 space-y-5">
          <TextInput
            name="facebook_app_id"
            label={t('facebook_app_id', 'Facebook App ID')}
            placeholder={t('facebook_app_id_placeholder', 'Enter Facebook App ID')}
          />
          <TextInput
            name="facebook_app_secret"
            label={t('facebook_app_secret', 'Facebook App Secret')}
            placeholder={t('facebook_app_secret_placeholder', 'Enter Facebook App Secret')}
            type="password"
          />
          <TextInput
            name="facebook_redirect_uri"
            label={t('facebook_redirect_uri', 'Facebook Redirect URI')}
            placeholder={t('facebook_redirect_uri_placeholder', 'Enter Facebook Redirect URI')}
          />
        </CardContent>
      </Card>
    </div>
  )
}
