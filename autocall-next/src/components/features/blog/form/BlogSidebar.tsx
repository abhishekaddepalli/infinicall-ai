import { Loader2 } from '@/components/reusable/Loader2'
import MultiSelectField from '@/components/shared/MultiSelectField'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { getImageUrl } from '@/lib/utils'
import { BlogSidebarProps } from '@/types/blog'
import { Image as ImageIcon, Upload } from 'lucide-react'
import Image from 'next/image'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'

export default function BlogSidebar({
  values,
  setFieldValue,
  touched,
  errors,
  categories,
  tags,
  thumbnailUrl,
  setThumbnailUrl,
  isLoading,
  isEditing,
  onClose,
}: BlogSidebarProps) {
  const { t } = useTranslation()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFieldValue('thumbnail', file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setThumbnailUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-500">
      <Card className="rounded-radius border border-input-border-color bg-bg-card overflow-hidden sm:p-6 p-4 space-y-8">
        <div className="space-y-8">
          {/* Thumbnail Selection */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-title">{t('thumbnail_image') || t('thumbnail_image')}</h4>
            <Input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-[200px] rounded-radius border-2 border-dashed border-input-border-color hover:border-primary/50 transition-all flex flex-col items-center justify-center cursor-pointer overflow-hidden relative group bg-subcard"
            >
              {thumbnailUrl ? (
                <>
                  <Image
                    src={thumbnailUrl.startsWith('data:') ? thumbnailUrl : getImageUrl(thumbnailUrl)}
                    alt="Thumbnail"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button type="button" variant="secondary" className="gap-2 h-12 bg-primary text-white rounded-lg font-bold shadow-lg">
                      <Upload className="w-4 h-4" /> {t('change_image')}
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center gap-3 text-zinc-400 p-8 text-center">
                  <div className="p-4 rounded-radius bg-primary/10">
                    <ImageIcon className="w-8 h-8 text-primary" />
                  </div>
                  <span className="text-sm font-bold tracking-tight">{t('click_to_upload') || t('click_to_upload_image')}</span>
                </div>
              )}
            </div>
            {(touched.thumbnail || Object.keys(touched).length > 0) && errors.thumbnail && (
              <span className="text-[10px] font-medium text-rose-500 mt-1.5 ml-1 block uppercase">
                {errors.thumbnail as string}
              </span>
            )}
          </div>

          {/* Categories & Tags */}
          <div className="space-y-6">
            <MultiSelectField
              label={t('categories')}
              placeholder={t('select_categories')}
              options={categories.map((c) => ({ label: c.name, value: c._id || c.id }))}
              value={values.categories}
              onChange={(val) => setFieldValue('categories', val)}
              error={touched.categories && errors.categories ? (errors.categories as string) : undefined}
            />

            <MultiSelectField
              label={t('tags')}
              placeholder={t('select_tags')}
              options={tags.map((tag) => ({ label: tag.title, value: tag._id || tag.id }))}
              value={values.tags}
              onChange={(val) => setFieldValue('tags', val)}
              error={touched.tags && errors.tags ? (errors.tags as string) : undefined}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between sm:p-5 p-4 bg-subcard rounded-radius border border-input-border-color dark:border-white/10 transition-colors">
              <div className="space-y-0.5">
                <span className="text-md font-bold text-title">{t('status')}</span>
                <p className="text-sm text-subtitle-color font-medium">{t('visibility_status')}</p>
              </div>
              <Switch
                checked={values.status}
                onCheckedChange={(checked) => setFieldValue('status', checked)}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full flex-1 h-12 rounded-lg bg-primary! text-white font-bold text-sm p-padding! transition-all flex items-center justify-center gap-2 group"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  {isEditing
                    ? t('save_changes')
                    : t('create')}
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={isLoading}
              className="w-full flex-1 h-12 bg-subcard! rounded-lg border border-input-border-color p-padding! font-bold text-sm transition-all"
            >
              {t('cancel_changes')}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
