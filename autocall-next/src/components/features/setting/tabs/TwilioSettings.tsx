'use client'

import TextInput from '@/components/shared/TextInput'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useTranslation } from 'react-i18next'

export default function TwilioSettings() {
  const { t } = useTranslation()

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <Card className="bg-bg-card border border-input-border-color rounded-radius overflow-hidden">
        <CardHeader className="sm:px-6 px-4 py-5 border-b border-input-border-color bg-slate-50/30 dark:bg-zinc-900/10">
          <div className="flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <CardTitle className="sm:text-xl text-lg font-bold text-title">
                {t('twilio_configuration')}
              </CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput
              name="twilio_account_sid"
              label={t('twilio_account_sid_label', 'Twilio Account SID')}
              placeholder="AC..."
            />
            <TextInput
              name="twilio_auth_token"
              label={t('twilio_auth_token_label', 'Twilio Auth Token')}
              placeholder={t('enter_token', 'Enter Token')}
              type="password"
            />
            <TextInput
              name="twilio_api_key"
              label={t('twilio_api_key_label', 'Twilio API Key')}
              placeholder={t('enter_api_key', 'Enter API Key')}
            />
            <TextInput
              name="twilio_api_secret"
              label={t('twilio_api_secret_label', 'Twilio API Secret')}
              placeholder={t('enter_api_secret', 'Enter API Secret')}
              type="password"
            />
            <TextInput
              name="twilio_app_sid"
              label={t('twilio_app_sid_label', 'Twilio App SID')}
              placeholder="AP..."
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
