'use client'

import { Loader2 } from '@/components/reusable/Loader2'
import Spinner from '@/components/reusable/Spinner'
import TextInput from '@/components/shared/TextInput'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PERMISSIONS } from '@/constants/permissions'
import { usePermission } from '@/hooks/usePermission'
import { useGetAdminSettingsQuery, useUpdateAdminSettingsMutation } from '@/redux/api/adminSettingApi'
import { ApiError } from '@/types/api'
import { Form, Formik } from 'formik'
import { Cpu, Key } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

const AIConfigSettings = () => {
  const { t } = useTranslation()
  const { data: settingsData, isLoading: isFetching } = useGetAdminSettingsQuery(undefined)
  const [updateSettings, { isLoading: isUpdating }] = useUpdateAdminSettingsMutation()
  const { hasPermission } = usePermission()

  const canUpdate = hasPermission(PERMISSIONS.UPDATE_SETTINGS)

  const initialValues = {
    openai_api_key: '',
    elevenlabs_api_key: '',
    sarvam_api_key: '',
    gemini_api_key: '',
    anthropic_api_key: '',
    twilio_account_sid: '',
    twilio_auth_token: '',
    plivo_auth_id: '',
    plivo_auth_token: '',
    plivo_phone_number: '',
  }

  const onSubmit = async (values: typeof initialValues) => {
    try {
      const response = await updateSettings(values).unwrap()
      toast.success(response.message || t('settings_updated_successfully'))
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t('failed_to_update_settings'))
    }
  }

  if (isFetching) {
    return <Spinner className="h-auto py-20" size="md" />
  }

  const settings = settingsData?.settings || {}
  const currentValues = {
    ...initialValues,
    ...settings,
  }

  return (
    <Formik
      initialValues={currentValues}
      enableReinitialize
      onSubmit={onSubmit}
    >
      {({ dirty }) => (
        <Form className="space-y-6 animate-in fade-in duration-700">
          <Card className="bg-bg-card border border-input-border-color rounded-radius shadow-sm overflow-hidden">
            <CardHeader className="sm:px-6 px-4 py-4 border-b border-input-border-color bg-bg-card">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-zinc-500" />
                  <CardTitle className="text-xl font-semibold text-title">
                    {t('ai_provider_configuration', 'AI & Voice Provider Configuration')}
                  </CardTitle>
                </div>
                <CardDescription className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  {t('manage_ai_keys_desc', 'Manage global API keys for OpenAI, ElevenLabs, Sarvam AI, Twilio & Plivo')}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="sm:p-6 p-4 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">
                    <Key className="w-3 h-3" />
                    {t('open_ai')}
                  </div>
                  <TextInput
                    name="openai_api_key"
                    label={t('openai_api_key_label')}
                    placeholder="sk-..."
                    type="password"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">
                    <Key className="w-3 h-3" />
                    Sarvam AI (Indian Languages & Telugu Voice)
                  </div>
                  <TextInput
                    name="sarvam_api_key"
                    label="Sarvam AI Subscription Key"
                    placeholder="Enter Sarvam Subscription Key"
                    type="password"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">
                    <Key className="w-3 h-3" />
                    {t('elevenlabs')}
                  </div>
                  <TextInput
                    name="elevenlabs_api_key"
                    label={t('elevenlabs_api_key_label')}
                    placeholder={t('enter_api_key')}
                    type="password"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">
                    <Key className="w-3 h-3" />
                    {t('gemini')}
                  </div>
                  <TextInput
                    name="gemini_api_key"
                    label={t('gemini_api_key_label')}
                    placeholder={t('enter_api_key')}
                    type="password"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-200 dark:border-white/10">
                <div className="flex items-center gap-2 text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4">
                  <Key className="w-3 h-3" />
                  Telephony Carrier Configuration (Twilio & Plivo)
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <TextInput
                    name="twilio_account_sid"
                    label="Twilio Account SID"
                    placeholder="AC..."
                  />
                  <TextInput
                    name="twilio_auth_token"
                    label="Twilio Auth Token"
                    placeholder="Enter Twilio Auth Token"
                    type="password"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <TextInput
                    name="plivo_auth_id"
                    label="Plivo Auth ID"
                    placeholder="MA..."
                  />
                  <TextInput
                    name="plivo_auth_token"
                    label="Plivo Auth Token"
                    placeholder="Enter Plivo Auth Token"
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

          {canUpdate && (
            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                disabled={isUpdating || !dirty}
                className="h-11 px-8 rounded-xl font-semibold text-sm bg-primary text-white shadow-sm hover:bg-primary/90 transition-all flex items-center gap-2"
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {t('updating')}
                  </>
                ) : (
                  <>
                    {t('save_settings')}
                  </>
                )}
              </Button>
            </div>
          )}
        </Form>
      )}
    </Formik>
  )
}

export default AIConfigSettings
