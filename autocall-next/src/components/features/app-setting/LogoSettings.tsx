'use client'

import Spinner from '@/components/reusable/Spinner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PERMISSIONS } from '@/constants/permissions'
import { usePermission } from '@/hooks/usePermission'
import { useGetAdminSettingsQuery, useUpdateAdminSettingsMutation } from '@/redux/api/adminSettingApi'
import { ApiError } from '@/types/api'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import ImageUploadItem from './components/ImageUploadItem'

const LogoSettings = ({ setSaveState }: { setSaveState: (state: any) => void }) => {
  const { t } = useTranslation()
  const { data: settingsData, isLoading: isFetching } = useGetAdminSettingsQuery(undefined)
  const [updateSettings, { isLoading: isUpdating }] = useUpdateAdminSettingsMutation()
  const { hasPermission } = usePermission()

  const canUpdate = hasPermission(PERMISSIONS.UPDATE_SETTINGS)

  const [files, setFiles] = useState<Record<string, File | 'null' | null>>({})
  const [saveVersion, setSaveVersion] = useState(0)

  const handleFileSelect = (key: string, file: File | null) => {
    setFiles((prev) => ({ ...prev, [key]: file }))
  }

  const handleRemove = (key: string) => {
    setFiles((prev) => ({ ...prev, [key]: 'null' }))
  }

  const onSubmit = async () => {
    try {
      const formData = new FormData()

      Object.entries(files).forEach(([key, value]) => {
        if (value === 'null') {
          formData.append(key, 'null')
        } else if (value instanceof File) {
          formData.append(key, value)
        }
      })

      if (Array.from(formData.entries()).length === 0) {
        toast.info(t('no_changes_to_save'))
        return
      }

      const res = await updateSettings(formData).unwrap()
      toast.success(
        res.message || t('logos_updated_successfully'),
      )
      setFiles({})
      setSaveVersion((v) => v + 1)
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t('failed_to_update_logos'))
    }
  }

  if (isFetching) {
    return <Spinner className="h-auto py-20" size="md" />
  }

  const settings = settingsData?.settings || {}

  const logoItems = [
    {
      key: 'favicon',
      label: t('logo_favicon'),
      description: t('logo_favicon_desc'),
      url: settings.favicon_url,
    },
    {
      key: 'logo_light',
      label: t('logo_light'),
      description: t('logo_light_desc'),
      url: settings.logo_light_url,
    },
    {
      key: 'logo_dark',
      label: t('logo_dark'),
      description: t('logo_dark_desc'),
      url: settings.logo_dark_url,
    },
    {
      key: 'sidebar_logo',
      label: t('logo_sidebar'),
      description: t('logo_sidebar_desc'),
      url: settings.sidebar_logo_url,
    },
    {
      key: 'mobile_logo',
      label: t('logo_mobile'),
      description: t('logo_mobile_desc'),
      url: settings.mobile_logo_url,
    },
    {
      key: 'landing_logo',
      label: t('logo_landing'),
      description: t('logo_landing_desc'),
      url: settings.landing_logo_url,
    },
    {
      key: 'favicon_notification_logo',
      label: t('logo_notification'),
      description: t('logo_notification_desc'),
      url: settings.favicon_notification_logo_url,
    },
    {
      key: 'onboarding_logo',
      label: t('logo_onboarding'),
      description: t('logo_onboarding_desc'),
      url: settings.onboarding_logo_url,
    },
  ]

  const hasChanges = Object.keys(files).length > 0;

  useEffect(() => {
    setSaveState({
      isUpdating,
      canSave: hasChanges && canUpdate,
      formId: 'logo-settings-form',
    })
  }, [isUpdating, hasChanges, setSaveState, canUpdate])

  return (
    <form
      id="logo-settings-form"
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit()
      }}
      className="space-y-6 animate-in fade-in duration-700"
    >
      <Card className="bg-bg-card border border-input-border-color rounded-radius overflow-hidden">
        <CardHeader className="sm:px-6 px-4 py-4 border-b border-input-border-color bg-bg-card">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <CardTitle className="text-xl font-bold text-title">
                {t('logo_branding')}
              </CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent className="sm:p-6 p-4 pt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {logoItems.map((item) => (
              <ImageUploadItem
                key={`${item.key}-${saveVersion}`}
                label={item.label}
                description={item.description}
                currentUrl={files[item.key] === 'null' ? null : files[item.key] instanceof File ? null : item.url}
                onFileSelect={(file) => handleFileSelect(item.key, file)}
                onRemove={() => handleRemove(item.key)}
                isUploading={isUpdating}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </form>
  )
}

export default LogoSettings
