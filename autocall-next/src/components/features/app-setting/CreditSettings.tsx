'use client'

import Spinner from '@/components/reusable/Spinner'
import { PERMISSIONS } from '@/constants/permissions'
import { usePermission } from '@/hooks/usePermission'
import { useGetAdminSettingsQuery, useUpdateAdminSettingsMutation } from '@/redux/api/adminSettingApi'
import { ApiError } from '@/types/api'
import { adminSettingSchemas } from '@/utils/validation-schemas'
import { Form, Formik } from 'formik'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import CreditSettingsCard from './credits/CreditSettingsCard'

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
      formId: 'credit-settings-form',
    })
  }, [isUpdating, dirty, canUpdate, setSaveState])

  return null
}

const CreditSettings = ({ setSaveState }: { setSaveState: (state: any) => void }) => {
  const { t } = useTranslation()
  const { hasPermission } = usePermission()
  const canUpdate = hasPermission(PERMISSIONS.UPDATE_SETTINGS)
  const { data: settingsData, isLoading: isFetching } = useGetAdminSettingsQuery(undefined)
  const [updateSettings, { isLoading: isUpdating }] = useUpdateAdminSettingsMutation()

  const initialValues = {
    credit_deduction_type: 'per_call',
    credits_per_call: 1,
    credits_per_minute: 1,
    credits_per_sms: 1,
    free_credits_on_registration: 0,
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
    credits_per_sms: settings.credits_per_sms ?? initialValues.credits_per_sms,
  }

  return (
    <Formik
      initialValues={currentValues}
      enableReinitialize
      validationSchema={adminSettingSchemas.credits()}
      onSubmit={onSubmit}
    >
      {({ dirty }) => (
        <Form id="credit-settings-form" className="space-y-6 animate-in fade-in duration-700">
          <FormikStateConnector
            setSaveState={setSaveState}
            isUpdating={isUpdating}
            dirty={dirty}
            canUpdate={canUpdate}
          />
          <div className="grid grid-cols-1 gap-6">
            <CreditSettingsCard />
          </div>
        </Form>
      )}
    </Formik>
  )
}

export default CreditSettings
