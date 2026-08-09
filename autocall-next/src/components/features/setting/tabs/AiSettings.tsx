'use client'

import SelectField from '@/components/shared/SelectField'
import TextInput from '@/components/shared/TextInput'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AiSettingsProps } from '@/types/settings'
import { useTranslation } from 'react-i18next'

export default function AiSettings({ aiModelOptions }: AiSettingsProps) {
  const { t } = useTranslation()

  return (
    <Card className="bg-bg-card border border-input-border-color rounded-radius overflow-hidden animate-in fade-in duration-300">
      <CardHeader className="sm:px-6 px-4 py-5 border-b border-input-border-color bg-slate-50/30 dark:bg-zinc-900/10">
        <div className="flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <CardTitle className="sm:text-xl text-lg font-bold text-title ">
              {t('ai_provider_configuration')}
            </CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-6">
        <SelectField
          name="ai_model"
          label={t('ai_model')}
          options={aiModelOptions}
        />
        <TextInput
          name="ai_api_key"
          label={t('ai_api_key')}
          placeholder="sk-..."
          type="password"
        />
        <TextInput
          name="elevenlabs_api_key"
          label={t('elevenlabs_api_key_label')}
          placeholder={t('enter_elevenlabs_key')}
          type="password"
        />
        <TextInput
          name="deepgram_api_key"
          label={t('deepgram_api_key_label')}
          placeholder={t('enter_deepgram_key')}
          type="password"
        />
        <TextInput
          name="sarvam_ai_api_key"
          label={t('sarvam_ai_api_key_label')}
          placeholder={t('enter_sarvam_ai_key')}
          type="password"
        />

      </CardContent>
    </Card>
  )
}
