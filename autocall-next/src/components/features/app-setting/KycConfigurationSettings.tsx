'use client'

import Spinner from '@/components/reusable/Spinner'
import { PERMISSIONS } from '@/constants/permissions'
import { usePermission } from '@/hooks/usePermission'
import { useGetAdminSettingsQuery, useUpdateAdminSettingsMutation } from '@/redux/api/adminSettingApi'
import { ApiError } from '@/types/api'
import { Form, Formik } from 'formik'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import * as yup from 'yup'
import KycConfigurationCard from './kyc-configuration/KycConfigurationCard'

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
      formId: 'kyc-configuration-settings-form',
    })
  }, [isUpdating, dirty, canUpdate, setSaveState])

  return null
}

const KycConfigurationSettings = ({ setSaveState }: { setSaveState: (state: any) => void }) => {
  const { t } = useTranslation()
  const { hasPermission } = usePermission()
  const canUpdate = hasPermission(PERMISSIONS.UPDATE_SETTINGS)
  const { data: settingsData, isLoading: isFetching } = useGetAdminSettingsQuery(undefined)
  const [updateSettings, { isLoading: isUpdating }] = useUpdateAdminSettingsMutation()

  const initialValues = {
    kyc_allow_pdf_upload: true,
    kyc_required: true,
    kyc_max_files: 6,
    kyc_form_fields: [
      { label: 'Name', type: 'Text', placeholder: 'Enter your name', required: true },
      { label: 'Mobile', type: 'Text', placeholder: 'Enter mobile number', required: true },
      { label: 'Government ID Proof', type: 'File', placeholder: 'Passport, National ID, or Driver\'s License', required: true },
      { label: 'Business Registration Document', type: 'File', placeholder: 'Certificate of Incorporation or Business Registration', required: true },
      { label: 'Tax Identification Document', type: 'File', placeholder: 'VAT/Tax ID certificate or official tax registration', required: true },
      { label: 'Company Consent Letter', type: 'File', placeholder: 'A signed letter on company letterhead authorizing the purchase', required: true }
    ],
  }

  const kycSchema = yup.object().shape({
    kyc_max_files: yup.number().min(1, 'At least 1 file').max(20, 'Max 20 files').required('Required'),
    kyc_form_fields: yup.array().of(
      yup.object().shape({
        label: yup.string().required('Required'),
        type: yup.string().required('Required'),
        placeholder: yup.string(),
        required: yup.boolean(),
      })
    ).test('max-file-fields', 'Cannot exceed field limit', function (fields) {
      if (!fields) return true;
      if (fields.length > this.parent.kyc_max_files) {
        return this.createError({ message: `You can only add up to ${this.parent.kyc_max_files} KYC fields in total (based on the limit above).` });
      }
      return true;
    }),
  })

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
    kyc_form_fields: settings.kyc_form_fields || initialValues.kyc_form_fields,
  }

  return (
    <Formik
      initialValues={currentValues}
      enableReinitialize
      validationSchema={kycSchema}
      onSubmit={onSubmit}
    >
      {({ dirty }) => (
        <Form id="kyc-configuration-settings-form" className="space-y-6 animate-in fade-in duration-700">
          <FormikStateConnector
            setSaveState={setSaveState}
            isUpdating={isUpdating}
            dirty={dirty}
            canUpdate={canUpdate}
          />
          <div className="grid grid-cols-1 gap-6">
            <KycConfigurationCard />
          </div>
        </Form>
      )}
    </Formik>
  )
}

export default KycConfigurationSettings
