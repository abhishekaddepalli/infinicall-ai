'use client'

import { Loader2 } from '@/components/reusable/Loader2'
import Spinner from '@/components/reusable/Spinner'
import { Button } from '@/components/ui/button'
import { PERMISSIONS } from '@/constants/permissions'
import { usePermission } from '@/hooks/usePermission'
import { cn } from '@/lib/utils'
import { useGetAiModelsQuery } from '@/redux/api/aiModelApi'
import { useGetUserSettingsQuery, useUpdateUserSettingsMutation } from '@/redux/api/userSettingApi'
import { ApiError } from '@/types/api'
import { Form, Formik } from 'formik'
import { Cpu, MessageSquare, Phone, PhoneCall, Shield } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import AiSettings from './tabs/AiSettings'
import FacebookAccountSettings from './tabs/FacebookAccountSettings'
import GoogleAccountSetting from './tabs/GoogleAccountSettings'
import TwilioSettings from './tabs/TwilioSettings'
import PlivoSettings from './tabs/PlivoSettings'
import WabaSettings from './tabs/WabaSettings'

const SettingPage = () => {
  const { t } = useTranslation()
  const { hasPermission } = usePermission()
  const canUpdate = hasPermission(PERMISSIONS.UPDATE_USER_SETTINGS)

  // Fetch all required data
  const { data: userSettingsData, isLoading: isUserLoading } = useGetUserSettingsQuery(undefined)
  const { data: aiModelsData, isLoading: isModelsLoading } = useGetAiModelsQuery(undefined)

  const [updateUserSettings, { isLoading: isUserUpdating }] = useUpdateUserSettingsMutation()

  const isUpdating = isUserUpdating
  const isLoading = isUserLoading || isModelsLoading

  const aiModelOptions = useMemo(() => {
    if (!aiModelsData?.data) return []
    return aiModelsData.data
      .filter(model => model.status === 'active')
      .map(model => ({
        label: `${model.name} (${model.provider})`,
        value: model.id
      }))
  }, [aiModelsData, t])

  const initialValues = {
    // AI Configuration (from user-settings)
    ai_model: '',
    ai_api_key: '',
    elevenlabs_api_key: '',
    deepgram_api_key: '',
    sarvam_ai_api_key: '',
    twilio_account_sid: '',
    twilio_auth_token: '',
    twilio_api_key: '',
    twilio_api_secret: '',
    twilio_app_sid: '',
    plivo_auth_id: '',
    plivo_auth_token: '',
    plivo_app_id: '',

    // Google Integration (from user-settings)
    google_client_id: '',
    google_client_secret: '',
    google_redirect_uri: '',
    google_calendar_id: '',
    google_sheet_id: '',

    // Facebook Integration (from user-settings)
    facebook_app_id: '',
    facebook_app_secret: '',
    facebook_redirect_uri: '',

    // WABA Configuration (from user-settings)
    whatsapp_app_id: '',
    whatsapp_app_secret: '',
    configuration_id: '',

    // Appointment Settings (from user-settings)
    appointment_settings: {
      allow_overlapping: false,
      buffer_time: 5,
      max_appointments_per_day: '',
      confirmation_channel: 'none',
      confirmation_message_template: '',
    }
  }

  const currentValues = useMemo(() => {
    const user = userSettingsData?.data || {}

    return {
      ...initialValues,
      // Map user settings
      ai_model: user.ai_model?._id || user.ai_model?.id || (typeof user.ai_model === 'string' ? user.ai_model : ''),
      ai_api_key: user.ai_api_key || '',
      elevenlabs_api_key: user.elevenlabs_api_key || '',
      deepgram_api_key: user.deepgram_api_key || '',
      sarvam_ai_api_key: user.sarvam_ai_api_key || '',
      twilio_account_sid: user.twilio_account_sid || '',
      twilio_auth_token: user.twilio_auth_token || '',
      twilio_api_key: user.twilio_api_key || '',
      twilio_api_secret: user.twilio_api_secret || '',
      twilio_app_sid: user.twilio_app_sid || '',
      plivo_auth_id: user.plivo_auth_id || '',
      plivo_auth_token: user.plivo_auth_token || '',
      plivo_app_id: user.plivo_app_id || '',
      google_client_id: user.google_client_id || '',
      google_client_secret: user.google_client_secret || '',
      google_redirect_uri: user.google_redirect_uri || '',
      google_calendar_id: user.google_calendar_id || '',
      google_sheet_id: user.google_sheet_id || '',
      facebook_app_id: user.facebook_app_id || '',
      facebook_app_secret: user.facebook_app_secret || '',
      facebook_redirect_uri: user.facebook_redirect_uri || '',
      whatsapp_app_id: user.whatsapp_app_id || '',
      whatsapp_app_secret: user.whatsapp_app_secret || '',
      configuration_id: user.configuration_id || '',
      appointment_settings: {
        ...initialValues.appointment_settings,
        ...(user.appointment_settings || {}),
        max_appointments_per_day: user.appointment_settings?.max_appointments_per_day || '',
      }
    }
  }, [userSettingsData])

  const onSubmit = async (values: typeof initialValues, { resetForm }: any) => {
    try {
      const userValues = {
        ai_model: values.ai_model || null,
        ai_api_key: values.ai_api_key,
        elevenlabs_api_key: values.elevenlabs_api_key,
        deepgram_api_key: values.deepgram_api_key,
        sarvam_ai_api_key: values.sarvam_ai_api_key,
        twilio_account_sid: values.twilio_account_sid,
        twilio_auth_token: values.twilio_auth_token,
        twilio_api_key: values.twilio_api_key,
        twilio_api_secret: values.twilio_api_secret,
        twilio_app_sid: values.twilio_app_sid,
        plivo_auth_id: values.plivo_auth_id,
        plivo_auth_token: values.plivo_auth_token,
        plivo_app_id: values.plivo_app_id,
        google_client_id: values.google_client_id,
        google_client_secret: values.google_client_secret,
        google_redirect_uri: values.google_redirect_uri,
        google_calendar_id: values.google_calendar_id,
        google_sheet_id: values.google_sheet_id,
        facebook_app_id: values.facebook_app_id,
        facebook_app_secret: values.facebook_app_secret,
        facebook_redirect_uri: values.facebook_redirect_uri,
        whatsapp_app_id: values.whatsapp_app_id,
        whatsapp_app_secret: values.whatsapp_app_secret,
        configuration_id: values.configuration_id,
        appointment_settings: values.appointment_settings,
      }

      await updateUserSettings(userValues).unwrap()

      toast.success(t('settings_updated_successfully'))

      resetForm({ values })
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t('failed_to_update_settings'))
    }
  }

  const TABS = [
    { id: 'ai', label: 'AI Provider', icon: Cpu, description: 'Model & API keys' },
    { id: 'twilio', label: 'Twilio', icon: Phone, description: 'Telephony Configuration' },
    { id: 'plivo', label: 'Plivo', icon: PhoneCall, description: 'Plivo API Credentials' },
    { id: 'waba', label: 'WABA Configuration', icon: MessageSquare, description: 'WhatsApp Credentials' },
    { id: 'google_account', label: 'Google Accounts', icon: Shield, description: 'Google Workspace Credentials' },
    { id: 'facebook_account', label: 'Facebook Accounts', icon: Shield, description: 'Facebook App Credentials' },
  ] as const

  type TabId = typeof TABS[number]['id']
  const [activeTab, setActiveTab] = useState<TabId>('ai')

  useEffect(() => {
    const mainScroll = document.querySelector('main')
    if (mainScroll) {
      mainScroll.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [activeTab])

  const renderTabContent = (values: typeof initialValues) => {
    switch (activeTab) {
      case 'ai':
        return <AiSettings aiModelOptions={aiModelOptions} />
      case 'twilio':
        return <TwilioSettings />
      case 'plivo':
        return <PlivoSettings />
      case 'waba':
        return <WabaSettings />
      case "google_account":
        return <GoogleAccountSetting />
      case "facebook_account":
        return <FacebookAccountSettings />
    }
  }

  if (isLoading) {
    return <Spinner className="h-auto py-20" size="md" />
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <Formik initialValues={currentValues} enableReinitialize onSubmit={onSubmit}>
        {({ dirty, values }) => (
          <Form className="space-y-6 flex flex-col min-h-full">
            {/* Page Header (Save settings inside formik) */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div>
                  <h1 className="text-3xl font-bold text-title">{t("setting")}</h1>
                </div>
              </div>

              {canUpdate && (
                <div className="flex flex-wrap items-center gap-2">
                  {dirty && <span className="text-sm text-amber-600 dark:text-amber-400 font-semibold px-2.5 py-1.5 bg-amber-500/10 rounded-radius border border-amber-500/20">{t("unsaved_changes", "Unsaved Changes")}</span>}
                  <Button type="submit" disabled={isUpdating || !dirty} className="p-padding! rounded-radius font-medium text-md bg-primary text-white transition-all flex items-center gap-2">
                    {isUpdating ? (
                      <>
                        <Loader2 className="w-4 h-4" />
                        {t("updating")}
                      </>
                    ) : (
                      <>
                        {t("save_settings")}
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>

            {/* Sidebar + Content Split Panel */}
            <div className="flex flex-col min-[1400px]:flex-row gap-6 flex-1 min-w-0">
              {/* Left Sidebar (Mobile Navigation Header Tabs) */}
              <div className="min-[1400px]:hidden mb-2 bg-bg-card rounded-lg  shadow-xs">
                <div className="overflow-x-auto table-custom-scrollbar">
                  <div className="flex gap-1.5 p-2 min-w-max">
                    {TABS.map(({ id, icon: Icon, label }) => {
                      const isActive = activeTab === id;
                      return (
                        <Button 
                          key={id} 
                          type="button" 
                          onClick={(e) => {
                            setActiveTab(id);
                            e.currentTarget.scrollIntoView({
                              behavior: 'smooth',
                              inline: 'center',
                              block: 'nearest'
                            });
                          }} 
                          className={`flex sm:h-12 h-10 items-center gap-2 p-padding! rounded-radius text-sm font-semibold transition-all duration-150 whitespace-nowrap shadow-none ${isActive ? "bg-primary text-white" : "text-slate-600 dark:text-zinc-400 bg-transparent hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-zinc-100"}`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          <span>{t(`settings_tabs_${id}`, label)}</span>
                        </Button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Left Sidebar (Desktop Navigation Sidebar List) */}
              <aside className="hidden min-[1400px]:block w-64 xl:w-80 shrink-0">
                <div className="sticky top-4 bg-bg-card border border-input-border-color rounded-modal-radius shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden p-3 py-4 space-y-1.5">
                  {TABS.map(({ id, icon: Icon, label, description }) => {
                    const isActive = activeTab === id;
                    return (
                      <Button key={id} type="button" onClick={() => setActiveTab(id)} className={`w-full flex items-center gap-3 py-3 px-3 rounded-radius text-left group shadow-none h-auto ${isActive ? "bg-primary text-white dark:text-zinc-50 font-semibold" : "text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800/30 hover:text-slate-900 dark:hover:text-zinc-100 font-medium bg-transparent"}`}>
                        <div className={`w-8 h-8 rounded-radius flex items-center justify-center shrink-0 transition-colors ${isActive ? "bg-white/20 text-white dark:text-zinc-100 " : "bg-subcard text-subtitle-color dark:text-zinc-400 group-hover:bg-slate-100 dark:group-hover:bg-zinc-800"}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0 text-left rtl:text-right">
                          <p className="text-md font-bold leading-tight">{t(`settings_tabs_${id}`, label)}</p>
                          <p className={cn("text-xs lg:text-sm truncate text-subtitle-color  hidden lg:block", isActive ? "text-white/80" : "text-subtitle-color")}>{t(`settings_tabs_${id}_desc`, description)}</p>
                        </div>
                      </Button>
                    );
                  })}
                </div>
              </aside>

              {/* Right Active Content Panel */}
              <div className="flex-1 min-w-0 space-y-6">{renderTabContent(values)}</div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default SettingPage
