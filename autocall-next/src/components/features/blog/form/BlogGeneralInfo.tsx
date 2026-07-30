'use client'

import CKEditorField from '@/components/shared/CKEditorField'
import TextAreaField from '@/components/shared/TextAreaField'
import TextInput from '@/components/shared/TextInput'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { BlogGeneralInfoProps } from '@/types/blog'
import { LayoutGrid } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function BlogGeneralInfo({ setFieldValue, values, isEditing, errors, touched }: BlogGeneralInfoProps) {
  const { t } = useTranslation()

  return (
    <Card className="rounded-radius border border-input-border-color bg-bg-card overflow-hidden sm:p-6 p-4 space-y-8">
      <div className="space-y-8">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <LayoutGrid className="h-5 w-5" />
          </div>
          <h2 className="text-lg font-bold text-title">{t('general_information')}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <TextInput
            name="title"
            label={t('title')}
            placeholder={t('enter_title')}
            className="h-14 rounded-2xl border-zinc-200 dark:border-white/10 bg-white dark:bg-white/5 font-bold transition-all focus:ring-primary/20"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const val = e.target.value
              setFieldValue('title', val)
              if (!isEditing) {
                setFieldValue('slug', val.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''))
              }
            }}
          />
          <TextInput
            name="slug"
            label={t('slug')}
            placeholder={t('enter_slug')}
            className="h-14 rounded-2xl border-zinc-200 dark:border-white/10 bg-white dark:bg-white/5 font-mono transition-all focus:ring-primary/20"
          />
        </div>

        <TextAreaField
          name="description"
          label={t('short_description')}
          rows={3}
          placeholder={t('enter_short_description')}
          className="rounded-2xl border-zinc-200 dark:border-white/10 bg-white dark:bg-white/5 transition-all focus:ring-primary/20"
        />

        <div className="space-y-4">
          <Label className="text-md font-bold text-zinc-500 dark:text-zinc-400 tracking-widest">{t('content')}</Label>
          <div className="rounded-radius border border-input-border-color dark:border-white/10 overflow-hidden bg-white dark:bg-white/5">
            <CKEditorField
              value={values.content}
              onChange={(val) => setFieldValue('content', val)}
              placeholder={t('start_typing_content')}
            />
          </div>
          {(touched?.content || Object.keys(touched || {}).length > 0) && errors?.content && (
            <span className="text-[10px] font-medium text-rose-500 mt-1.5 ml-1 block uppercase">
              {errors.content as string}
            </span>
          )}
        </div>
      </div>
    </Card>
  )
}
