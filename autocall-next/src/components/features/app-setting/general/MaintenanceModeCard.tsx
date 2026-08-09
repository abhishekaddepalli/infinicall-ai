'use client'

import TextAreaField from '@/components/shared/TextAreaField'
import TextInput from '@/components/shared/TextInput'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { GeneralSettingsFormValues, MaintenanceModeCardProps } from '@/types/settings'
import { useFormikContext } from 'formik'
import { X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import InlineImageUpload from '../components/InlineImageUpload'

const MaintenanceModeCard = ({ files, setFiles, currentImageUrl }: MaintenanceModeCardProps) => {
  const { t } = useTranslation()
  const { values, setFieldValue } = useFormikContext<GeneralSettingsFormValues>()

  return (
    <Card className="bg-bg-card border border-input-border-color rounded-radius overflow-hidden">
      <CardHeader className="sm:px-6 px-4 py-4 border-b border-input-border-color bg-bg-card">
        <div className="flex items-center justify-between w-full">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <CardTitle className="text-xl font-bold text-title">
                {t('maintenance_mode')}
              </CardTitle>
            </div>
          </div>
          <Switch
            checked={values.maintenance_mode}
            onCheckedChange={(checked) => setFieldValue('maintenance_mode', checked)}
          />
        </div>
      </CardHeader>
      <CardContent
        className={`pt-6 space-y-4 sm:p-6 p-4 transition-all duration-700 ${!values.maintenance_mode ? 'opacity-40 pointer-events-none filter grayscale-[0.8] scale-[0.98]' : ''}`}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-4 sm:col-span-1">
            <TextInput name="maintenance_title" label={t('maintenance_title')} placeholder={t('under_maintenance')} />
            <TextAreaField
              name="maintenance_message"
              label={t('maintenance_message')}
              placeholder="Tell users why..."
            />
            <TextInput
              name="maintenance_image_url"
              label={t('maintenance_image_url')}
              placeholder="https://example.com/image.png"
            />
          </div>
          <div className="sm:col-span-1">
            <InlineImageUpload
              label={t('maintenance_image_upload')}
              currentUrl={
                files.maintenance_image === 'null'
                  ? null
                  : files.maintenance_image instanceof File
                    ? null
                    : values.maintenance_image_url || currentImageUrl
              }
              onFileSelect={(file) => setFiles((prev) => ({ ...prev, maintenance_image: file }))}
              onRemove={() => setFiles((prev) => ({ ...prev, maintenance_image: 'null' }))}
            />
          </div>
        </div>
        <div className="pt-2 space-y-3">
          <div className="space-y-2 flex flex-col">
            <Label className="text-md font-medium text-foreground ">
              {t('allowed_ips')}
            </Label>
            <div className="flex flex-wrap gap-2 p-2 rounded-radius border border-input-border-color bg-input-color transition-all min-h-[44px]">
              {(values.maintenance_allowed_ips || []).map((ip: string, index: number) => (
                <div key={index} className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-zinc-100 dark:bg-white/10 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-white/10 text-[10px] font-bold">
                  {ip}
                  <Button
                    type="button"
                    onClick={() => {
                      const newIps = values.maintenance_allowed_ips.filter((_, i) => i !== index);
                      setFieldValue('maintenance_allowed_ips', newIps);
                    }}
                    className="hover:text-destructive transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ))}
              <Input
                className="flex-1 bg-transparent border-none outline-none h-[unset]! text-xs px-2 focus-visible:ring-0"
                placeholder={t('press_enter_to_add_ip')}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    const val = e.currentTarget.value.trim();
                    if (val && !values.maintenance_allowed_ips?.includes(val)) {
                      setFieldValue('maintenance_allowed_ips', [...(values.maintenance_allowed_ips || []), val]);
                      e.currentTarget.value = '';
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default MaintenanceModeCard
