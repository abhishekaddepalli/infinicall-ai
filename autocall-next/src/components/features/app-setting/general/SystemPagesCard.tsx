'use client'

import TextAreaField from '@/components/shared/TextAreaField'
import TextInput from '@/components/shared/TextInput'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { GeneralSettingsFormValues, SystemPagesCardProps } from '@/types/settings'
import { useFormikContext } from 'formik'
import { useTranslation } from 'react-i18next'
import InlineImageUpload from '../components/InlineImageUpload'

const SystemPagesCard = ({ files, setFiles, settings }: SystemPagesCardProps) => {
  const { t } = useTranslation()
  const { values } = useFormikContext<GeneralSettingsFormValues>()

  return (
    <Card className="bg-bg-card border border-input-border-color rounded-radius overflow-hidden lg:col-span-1">
      <CardHeader className="sm:px-6 px-4 py-4 border-b border-input-border-color bg-bg-card">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <CardTitle className="text-xl font-bold text-title">
              {t('system_pages')}
            </CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-8 sm:p-6 p-4">
        <div className="group/page">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            <h4 className="text-sm font-bold text-subtitle-color">{t('error_page_identity')}</h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-4">
              <TextInput name="page_404_title" label={t('title')} placeholder={t('page_not_found')} />
              <TextAreaField
                name="page_404_content"
                label={t('content')}
                placeholder="The page you requested does not exist."
              />
              <TextInput
                name="page_404_image_url"
                label={t('image_url')}
                placeholder="https://example.com/404.png"
              />
            </div>
            <InlineImageUpload
              label={t('page_404_image_upload')}
              currentUrl={
                files.page_404_image === 'null'
                  ? null
                  : files.page_404_image instanceof File
                    ? null
                    : values.page_404_image_url || settings.page_404_image_url
              }
              onFileSelect={(file) => setFiles((prev) => ({ ...prev, page_404_image: file }))}
              onRemove={() => setFiles((prev) => ({ ...prev, page_404_image: 'null' }))}
            />
          </div>
        </div>

        <div className="h-px bg-zinc-100 dark:bg-white/5" />

        <div className="group/page">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
            <h4 className="text-sm font-bold text-subtitle-color">
              {t('no_internet_identity')}
            </h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-4">
              <TextInput name="no_internet_title" label={t('title')} placeholder={t('no_internet_connection')} />
              <TextAreaField
                name="no_internet_content"
                label={t('content')}
                placeholder="Please check your connection."
              />
              <TextInput
                name="no_internet_image_url"
                label={t('image_url')}
                placeholder="https://example.com/offline.png"
              />
            </div>
            <InlineImageUpload
              label={t('no_internet_image_upload')}
              currentUrl={
                files.no_internet_image === 'null'
                  ? null
                  : files.no_internet_image instanceof File
                    ? null
                    : values.no_internet_image_url || settings.no_internet_image_url
              }
              onFileSelect={(file) => setFiles((prev) => ({ ...prev, no_internet_image: file }))}
              onRemove={() => setFiles((prev) => ({ ...prev, no_internet_image: 'null' }))}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default SystemPagesCard
