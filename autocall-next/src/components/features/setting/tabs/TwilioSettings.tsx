'use client'

import TextInput from '@/components/shared/TextInput'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useTranslation } from 'react-i18next'

export default function TwilioSettings() {
  const { t } = useTranslation()

  return (
    <Card className="bg-bg-card border border-input-border-color rounded-radius overflow-hidden animate-in fade-in duration-300">
      <CardHeader className="sm:px-6 px-4 py-5 border-b border-input-border-color bg-slate-50/30 dark:bg-zinc-900/10">
        <div className="flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <CardTitle className="sm:text-xl text-lg font-bold text-title">
              Telephony Configuration (Twilio & Plivo)
            </CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-6">
        <div>
          <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">Twilio Credentials</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput
              name="twilio_account_sid"
              label={t('twilio_account_sid_label', 'Twilio Account SID')}
              placeholder="AC..."
            />
            <TextInput
              name="twilio_auth_token"
              label={t('twilio_auth_token_label', 'Twilio Auth Token')}
              placeholder={t('enter_token', 'Enter Auth Token')}
              type="password"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-input-border-color">
          <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">Plivo Credentials (Indian Telephony)</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <TextInput
              name="plivo_auth_id"
              label="Plivo Auth ID"
              placeholder="MA..."
            />
            <TextInput
              name="plivo_auth_token"
              label="Plivo Auth Token"
              placeholder="Enter Auth Token"
              type="password"
            />
            <TextInput
              name="plivo_phone_number"
              label="Plivo Phone Number"
              placeholder="+91..."
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
