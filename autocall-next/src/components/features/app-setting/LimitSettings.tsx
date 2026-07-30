'use client'

import Spinner from '@/components/reusable/Spinner'
import TextInput from '@/components/shared/TextInput'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PERMISSIONS } from '@/constants/permissions'
import { getLimitCards } from '@/data/setting'
import { usePermission } from '@/hooks/usePermission'
import { useGetAdminSettingsQuery, useUpdateAdminSettingsMutation } from '@/redux/api/adminSettingApi'
import { ApiError } from '@/types/api'
import { adminSettingSchemas } from '@/utils/validation-schemas'
import { Form, Formik } from 'formik'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

const FormikStateConnector = ({
  setSaveState,
  isUpdating,
  dirty,
  canUpdate,
}: {
  setSaveState: (state: any) => void
  isUpdating: boolean
  dirty: boolean
  canUpdate: boolean
}) => {
  useEffect(() => {
    setSaveState({
      isUpdating,
      canSave: dirty && canUpdate,
      formId: 'limit-settings-form',
    })
  }, [isUpdating, dirty, canUpdate, setSaveState])

  return null
}

const LimitSettings = ({ setSaveState }: { setSaveState: (state: any) => void }) => {
  const { t } = useTranslation()
  const limitCards = getLimitCards(t)
  const { data: settingsData, isLoading: isFetching } = useGetAdminSettingsQuery(undefined)
  const [updateSettings, { isLoading: isUpdating }] = useUpdateAdminSettingsMutation()
  const { hasPermission } = usePermission()

  const canUpdate = hasPermission(PERMISSIONS.UPDATE_SETTINGS)

  const initialValues = {
    default_agent_limit: 2,
    default_campaign_limit_per_day: 1,
    default_flow_limit: 2,
    default_knowledgebase_limit: 5,
    default_storage_limit: 20,
    default_contact_limit: 100,
    default_sms_agent_limit: 2,
    default_sms_campaign_limit_per_day: 1,
    default_campaign_sms_limit: 100,
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
    default_agent_limit: settings.default_agent_limit ?? initialValues.default_agent_limit,
    default_campaign_limit_per_day: settings.default_campaign_limit_per_day ?? initialValues.default_campaign_limit_per_day,
    default_flow_limit: settings.default_flow_limit ?? initialValues.default_flow_limit,
    default_knowledgebase_limit: settings.default_knowledgebase_limit ?? initialValues.default_knowledgebase_limit,
    default_storage_limit: settings.default_storage_limit ?? initialValues.default_storage_limit,
    default_contact_limit: settings.default_contact_limit ?? initialValues.default_contact_limit,
    default_sms_agent_limit: settings.default_sms_agent_limit ?? initialValues.default_sms_agent_limit,
    default_sms_campaign_limit_per_day: settings.default_sms_campaign_limit_per_day ?? initialValues.default_sms_campaign_limit_per_day,
    default_campaign_sms_limit: settings.default_campaign_sms_limit ?? initialValues.default_campaign_sms_limit,
  }

  return (

    <Formik
      initialValues={currentValues}
      enableReinitialize
      validationSchema={adminSettingSchemas.limits(t)}
      onSubmit={onSubmit}
    >

      {({ dirty, errors, touched }) => (
        <Form id="limit-settings-form" className="space-y-6 animate-in fade-in duration-700">
          <FormikStateConnector
            setSaveState={setSaveState}
            isUpdating={isUpdating}
            dirty={dirty}
            canUpdate={canUpdate}
          />
          <Card className="bg-bg-card border border-input-border-color rounded-radius overflow-hidden">
            <CardHeader className="px-4 sm:px-6 py-4 border-b border-input-border-color bg-bg-card">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-xl font-bold text-title">
                    {t('system_resource_limits')}
                  </CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="sm:p-6 p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {limitCards.map((card) => (
                  <Card key={card.name} className="relative bg-card-color border border-input-border-color rounded-radius shadow-none overflow-hidden transition-all duration-300 hover:border-zinc-300 dark:hover:border-white/20">
                    <CardHeader className="p-4 flex flex-row items-center gap-3 space-y-0 pb-2">
                      <div className="p-2 rounded-radius bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 shrink-0">
                        {card.icon}
                      </div>
                      <div className="min-w-0">
                        <span className="text-base font-bold text-title block">
                          {card.label}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-0! space-y-3">
                      <p className="text-md text-subtitle-color min-h-[32px] leading-relaxed">
                        {card.description}
                      </p>
                      <div className="relative">
                        <TextInput
                          name={card.name}
                          type="number"
                          placeholder={card.placeholder}
                          className="h-10 rounded-xl bg-white dark:bg-white/5 border-zinc-200 dark:border-white/10 pr-4 pl-4 text-sm focus:ring-primary/20 focus:border-primary shadow-none"
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </Form>
      )}
    </Formik>
  )
}

export default LimitSettings
