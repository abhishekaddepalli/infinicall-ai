'use client'

import Spinner from '@/components/reusable/Spinner'
import { PERMISSIONS } from '@/constants/permissions'
import { usePermission } from '@/hooks/usePermission'
import { useGetAdminSettingsQuery, useUpdateAdminSettingsMutation } from '@/redux/api/adminSettingApi'
import { ApiError } from '@/types/api'
import { adminSettingSchemas } from '@/utils/validation-schemas'
import { Form, Formik } from 'formik'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import AppInfoCard from './general/AppInfoCard'
import DemoUserCard from './general/DemoUserCard'
import MaintenanceModeCard from './general/MaintenanceModeCard'
import ResourceLimitsCard from './general/ResourceLimitsCard'
import SystemEmailConfigCard from './general/SystemEmailConfigCard'
import SystemPagesCard from './general/SystemPagesCard'

const NONE_WIDGET_VALUE = 'none'

const normalizeLoginWidgetKey = (loginWidgetKey: unknown): string => {
  if (!loginWidgetKey) return NONE_WIDGET_VALUE

  if (typeof loginWidgetKey === 'object') {
    const widget = loginWidgetKey as { _id?: string; id?: string }
    return widget._id || widget.id || NONE_WIDGET_VALUE
  }

  return String(loginWidgetKey)
}

const FormikStateConnector = ({
  setSaveState,
  isUpdating,
  dirty,
  hasFiles,
  canUpdate,
}: {
  setSaveState: (state: any) => void
  isUpdating: boolean
  dirty: boolean
  hasFiles: boolean
  canUpdate: boolean
}) => {
  useEffect(() => {
    setSaveState({
      isUpdating,
      canSave: (dirty || hasFiles) && canUpdate,
      formId: 'general-settings-form',
    })
  }, [isUpdating, dirty, hasFiles, canUpdate, setSaveState])

  return null
}

const GeneralSettings = ({ activeCard, setSaveState }: { activeCard: string; setSaveState: (state: any) => void }) => {
  const { t } = useTranslation()
  const { data: settingsData, isLoading: isFetching } = useGetAdminSettingsQuery(undefined)
  const [updateSettings, { isLoading: isUpdating }] = useUpdateAdminSettingsMutation()
  const { hasPermission } = usePermission()
  
  const canUpdate = hasPermission(PERMISSIONS.UPDATE_SETTINGS)

  const [files, setFiles] = useState<Record<string, File | 'null' | null>>({})

  const initialValues = {
    app_name: '',
    app_description: '',
    app_email: '',
    support_email: '',
    maintenance_mode: false,
    maintenance_title: '',
    maintenance_message: '',
    maintenance_image_url: '',
    maintenance_allowed_ips: [],
    page_404_title: '',
    page_404_content: '',
    page_404_image_url: '',
    no_internet_title: '',
    no_internet_content: '',
    no_internet_image_url: '',
    document_file_limit: 15,
    audio_file_limit: 15,
    video_file_limit: 20,
    image_file_limit: 10,
    multiple_file_share_limit: 10,
    smtp_host: '',
    smtp_port: 587,
    smtp_user: '',
    smtp_pass: '',
    mail_from_name: '',
    mail_from_email: '',
    mail_encryption: 'tls',
    session_expiration_days: 7,
    session_limit: 10,
    trial_days_limit: 14,

    login_widget_key: NONE_WIDGET_VALUE,
    demo_user_email: '',
    demo_user_password: '',
    is_demo_mode: false,
  }

  const onSubmit = async (values: typeof initialValues) => {
    try {
      const formData = new FormData()

      Object.entries(values).forEach(([key, value]) => {
        if (value === null || value === undefined) return
        if (key === 'login_widget_key' && (value === NONE_WIDGET_VALUE || value === '')) {
          formData.append(key, 'null')
          return
        }
        if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value))
        } else {
          formData.append(key, String(value))
        }
      })

      Object.entries(files).forEach(([key, value]) => {
        if (value === 'null') {
          formData.append(key, 'null')
        } else if (value instanceof File) {
          formData.append(key, value)
        }
      })

      const response = await updateSettings(formData).unwrap()
      toast.success(response.message || t('settings_updated_successfully'))
      setFiles({})
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
    maintenance_allowed_ips: Array.isArray(settings.maintenance_allowed_ips) ? settings.maintenance_allowed_ips : [],
    login_widget_key: normalizeLoginWidgetKey(settings.login_widget_key),
  }

  return (
    <Formik
      initialValues={currentValues}
      enableReinitialize
      validationSchema={adminSettingSchemas.general(t)}
      onSubmit={onSubmit}
    >
      {({ dirty }) => (
        <Form
          id="general-settings-form"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && e.target instanceof HTMLInputElement) {
              e.preventDefault();
            }
          }}
          className="space-y-6 animate-in fade-in duration-700"
        >
          <FormikStateConnector
            setSaveState={setSaveState}
            isUpdating={isUpdating}
            dirty={dirty}
            hasFiles={Object.keys(files).length > 0}
            canUpdate={canUpdate}
          />
          <div className="flex-1 min-w-0">
            {activeCard === 'app_info' && <AppInfoCard />}
            {activeCard === 'system_pages' && <SystemPagesCard files={files} setFiles={setFiles} settings={settings} />}
            {activeCard === 'maintenance' && <MaintenanceModeCard files={files} setFiles={setFiles} currentImageUrl={settings.maintenance_image_url} />}
            {activeCard === 'general_resource' && <ResourceLimitsCard />}
            {activeCard === 'demo_user' && <DemoUserCard />}
            {activeCard === 'system_email' && <SystemEmailConfigCard />}
          </div>
        </Form>
      )}
    </Formik>
  )
}

export default GeneralSettings
