'use client'

import TextAreaField from '@/components/shared/TextAreaField'
import TextInput from '@/components/shared/TextInput'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { useTranslation } from 'react-i18next'

const AppInfoCard = () => {
  const { t } = useTranslation()
  return (
    <Card className="bg-bg-card border border-input-border-color rounded-radius">
      <CardHeader className="sm:px-6 px-4 py-4 border-b border-input-border-color bg-bg-card">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <CardTitle className="text-xl font-bold text-title">
              {t('app_information')}
            </CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 sm:p-6 p-4 pt-2">
        <TextInput name="app_name" label={t('app_name')} placeholder="e.g. Auto Call" />
        <TextAreaField name="app_description" label={t('app_description')} placeholder="Describe your app..." />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TextInput name="app_email" label={t('app_email')} placeholder="admin@example.com" type="email" />
          <TextInput name="support_email" label={t('support_email')} placeholder="support@example.com" type="email" />
        </div>
      </CardContent>
    </Card>
  )
}

export default AppInfoCard
