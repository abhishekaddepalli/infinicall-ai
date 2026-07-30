'use client'

import Spinner from '@/components/reusable/Spinner'
import SelectField from '@/components/shared/SelectField'
import TextInput from '@/components/shared/TextInput'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { PERMISSIONS } from '@/constants/permissions'
import { usePermission } from '@/hooks/usePermission'
import { useGetAdminSettingsQuery, useUpdateAdminSettingsMutation } from '@/redux/api/adminSettingApi'
import { ApiError } from '@/types/api'
import { adminSettingSchemas } from '@/utils/validation-schemas'
import { Field, FieldProps, Form, Formik } from 'formik'
import { Shield } from 'lucide-react'
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
      formId: 'storage-settings-form',
    })
  }, [isUpdating, dirty, canUpdate, setSaveState])

  return null
}

const StorageSettings = ({ setSaveState }: { setSaveState: (state: any) => void }) => {
  const { t } = useTranslation()
  const { data: settingsData, isLoading: isFetching } = useGetAdminSettingsQuery(undefined)
  const [updateSettings, { isLoading: isUpdating }] = useUpdateAdminSettingsMutation()
  const { hasPermission } = usePermission()

  const canUpdate = hasPermission(PERMISSIONS.UPDATE_SETTINGS)

  const initialValues = {
    storage_type: 'local',
    storage_limit_per_user: 20,
    aws_access_key_id: '',
    aws_secret_access_key: '',
    aws_region: '',
    aws_bucket_name: '',
    restore_storage_on_delete: true,
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
    storage_type: settings.storage_type || 'local',
    storage_limit_per_user: settings.storage_limit_per_user ?? 20,
    aws_access_key_id: settings.aws_access_key_id || '',
    aws_secret_access_key: settings.aws_secret_access_key || '',
    aws_region: settings.aws_region || '',
    aws_bucket_name: settings.aws_bucket_name || '',
    restore_storage_on_delete: settings.restore_storage_on_delete ?? true,
  }

  return (
    <Formik
      initialValues={currentValues}
      enableReinitialize
      validationSchema={adminSettingSchemas.storage(t)}
      onSubmit={onSubmit}
    >
      {({ dirty, values }) => (
        <Form id="storage-settings-form" className="space-y-6 animate-in fade-in duration-700">
          <FormikStateConnector
            setSaveState={setSaveState}
            isUpdating={isUpdating}
            dirty={dirty}
            canUpdate={canUpdate}
          />
          <Card className="bg-bg-card border border-input-border-color rounded-radius overflow-hidden">
            <CardHeader className="sm:px-6 px-4 py-4 border-b border-input-border-color bg-bg-card">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-xl font-bold text-title">
                    {t('storage_configuration')}
                  </CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="sm:p-6 p-4 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SelectField
                  name="storage_type"
                  label={t('storage_type')}
                  options={[
                    { label: t('local_filesystem'), value: 'local' },
                    { label: t('amazon_s3'), value: 'aws' },
                  ]}
                />
                <TextInput
                  name="storage_limit_per_user"
                  label={t('storage_limit_per_user')}
                  type="number"
                  placeholder="20"
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-radius bg-subcard border border-input-border-color">
                <div className="space-y-0.5">
                  <Label className="text-md font-semibold text-title">
                    {t('restore_storage_on_delete')}
                  </Label>
                  <p className="text-xs text-subtitle-color font-medium">
                    {t('restore_storage_desc')}
                  </p>
                </div>
                <Field name="restore_storage_on_delete">
                  {({ field, form }: FieldProps) => (
                    <Switch
                      checked={field.value}
                      onCheckedChange={(checked) => form.setFieldValue('restore_storage_on_delete', checked)}
                    />
                  )}
                </Field>
              </div>

              {values.storage_type === 'aws' && (
                <div className="pt-6 border-t border-zinc-200 dark:border-white/10 space-y-6 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-zinc-400 uppercase tracking-widest">
                    <Shield className="w-3.5 h-3.5" />
                    {t('aws_s3_credentials')}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <TextInput name="aws_access_key_id" label={t('aws_access_key_id_label')} placeholder="AKIA..." />
                    <TextInput name="aws_secret_access_key" label={t('aws_secret_access_key_label')} type="password" />
                    <TextInput name="aws_region" label={t('aws_region_label')} placeholder="us-east-1" />
                    <TextInput name="aws_bucket_name" label={t('aws_bucket_name_label')} />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </Form>
      )}
    </Formik>
  )
}

export default StorageSettings
