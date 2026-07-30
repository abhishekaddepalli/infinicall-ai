'use client'

import TextAreaField from '@/components/shared/TextAreaField'
import TextInput from '@/components/shared/TextInput'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { BlogSEOInfoProps } from '@/types/blog'
import { Image as ImageIcon, Upload } from 'lucide-react'
import Image from 'next/image'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'

export default function BlogSEOInfo({ setFieldValue, metaImageUrl, setMetaImageUrl }: BlogSEOInfoProps) {
  const { t } = useTranslation()
  const metaImageInputRef = useRef<HTMLInputElement>(null)

  const handleMetaImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFieldValue('meta_image', file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setMetaImageUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <Card className="rounded-radius border border-input-border-color bg-bg-card overflow-hidden sm:p-6 p-4 space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
      <div className="space-y-8">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white">{t('seo_optimization_settings')}</h2>
        </div>

        <div className="flex flex-col space-y-8">
          <div className="space-y-8">
            <TextInput
              name="meta_title"
              label={t('meta_title')}
              placeholder={t('enter_meta_title')}
              className="h-14 rounded-2xl border-zinc-200 dark:border-white/10 bg-white dark:bg-white/5 font-bold transition-all focus:ring-primary/20"
            />
            <TextAreaField
              name="meta_description"
              label={t('meta_description')}
              rows={4}
              placeholder={t('enter_meta_description')}
              className="rounded-2xl border-zinc-200 dark:border-white/10 bg-white dark:bg-white/5 transition-all focus:ring-primary/20"
            />
          </div>

          <div className="space-y-4">
            <Label className="text-md font-bold text-title">
              {t('meta_image')}
            </Label>
            <Input
              type="file"
              ref={metaImageInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleMetaImageChange}
            />
            <div
              onClick={() => metaImageInputRef.current?.click()}
              className="w-full h-[200px] rounded-radius border-2 border-dashed border-input-border-color dark:border-white/10 hover:border-primary/50 transition-all flex flex-col items-center justify-center cursor-pointer overflow-hidden relative group bg-white dark:bg-white/5"
            >
              {metaImageUrl ? (
                <>
                  <Image
                    src={metaImageUrl.startsWith('data:') ? metaImageUrl : `${process.env.NEXT_PUBLIC_STORAGE_URL || ''}${metaImageUrl}`}
                    alt="Meta Image"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button type="button" variant="secondary" className="gap-2 h-12 bg-primary text-white rounded-lg p-padding! font-bold shadow-lg">
                      <Upload className="w-4 h-4" /> {t('change_image')}
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center gap-3 text-zinc-400 p-8 text-center">
                  <div className="p-4 rounded-radius bg-primary/10">
                    <ImageIcon className="w-8 h-8 text-primary" />
                  </div>
                  <span className="text-md font-bold tracking-tight">{t('click_to_upload') || t('click_to_upload_meta_image')}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
