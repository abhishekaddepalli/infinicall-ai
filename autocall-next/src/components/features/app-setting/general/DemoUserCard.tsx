'use client'

import TextInput from '@/components/shared/TextInput'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { GeneralSettingsFormValues } from '@/types/settings'
import { useFormikContext } from 'formik'
import { useTranslation } from 'react-i18next'

const DemoUserCard = () => {
  const { t } = useTranslation()
  const { values, setFieldValue } = useFormikContext<GeneralSettingsFormValues>()

  return (
    <Card className="bg-bg-card border border-input-border-color rounded-radius overflow-hidden lg:col-span-1">
      <CardHeader className="sm:px-6 px-4 py-4 border-b border-input-border-color bg-bg-card">
        <div className="flex items-center justify-between w-full">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <CardTitle className="text-xl font-bold text-title">
                {t('demo_user_settings')}
              </CardTitle>
            </div>
          </div>
          <Switch
            checked={values.is_demo_mode}
            onCheckedChange={(checked) => setFieldValue('is_demo_mode', checked)}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-6 sm:p-6 p-4 pt-2!">
        <div className="grid grid-cols-1 gap-4 pt-2">
          <TextInput
            name="demo_user_email"
            label={t('demo_user_email')}
            placeholder="demo@example.com"
            className="transition-all duration-300"
          />
          <TextInput
            name="demo_user_password"
            label={t('demo_user_password')}
            placeholder="********"
            type="password"
            className="transition-all duration-300"
          />
        </div>
      </CardContent>
    </Card>
  )
}

export default DemoUserCard
