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
import SignupCustomizationCard from './signup-customization/SignupCustomizationCard'

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
      formId: 'signup-customization-settings-form',
    })
  }, [isUpdating, dirty, canUpdate, setSaveState])

  return null
}

const SignupCustomizationSettings = ({ setSaveState }: { setSaveState: (state: any) => void }) => {
  const { t } = useTranslation()
  const { hasPermission } = usePermission()
  const canUpdate = hasPermission(PERMISSIONS.UPDATE_SETTINGS)
  const { data: settingsData, isLoading: isFetching } = useGetAdminSettingsQuery(undefined)
  const [updateSettings, { isLoading: isUpdating }] = useUpdateAdminSettingsMutation()

  const initialValues = {
    signup_agreement_enabled: false,
    signup_agreement_prefix_text: 'I agree to the',
    signup_agreement_link_text: 'Privacy Policy',
    signup_agreement_target_page: '',
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
    signup_agreement_target_page: settings.signup_agreement_target_page || '',
  }

  return (
    <Formik
      initialValues={currentValues}
      enableReinitialize
      validationSchema={adminSettingSchemas.signupCustomization(t)}
      onSubmit={onSubmit}
    >
      {({ dirty }) => (
        <Form id="signup-customization-settings-form" className="space-y-6 animate-in fade-in duration-700">
          <FormikStateConnector
            setSaveState={setSaveState}
            isUpdating={isUpdating}
            dirty={dirty}
            canUpdate={canUpdate}
          />
          <div className="grid grid-cols-1 gap-6">
            <SignupCustomizationCard />
          </div>
        </Form>
      )}
    </Formik>
  )
}

export default SignupCustomizationSettings
