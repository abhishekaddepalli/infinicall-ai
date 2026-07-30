'use client'

import { Loader2 } from '@/components/reusable/Loader2'
import TextInput from '@/components/shared/TextInput'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useCreateCategoryMutation, useUpdateCategoryMutation } from '@/redux/api/categoryApi'
import { ApiError } from '@/types/api'
import { CategoryModalProps } from '@/types/blog'
import { Form, Formik } from 'formik'
import { Image as ImageIcon, Upload } from 'lucide-react'
import Image from 'next/image'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import * as Yup from 'yup'

const CategoryModal = ({ isOpen, onClose, category }: CategoryModalProps) => {
  const { t } = useTranslation()
  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation()
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation()
  const imageInputRef = useRef<HTMLInputElement>(null)

  const [imageUrl, setImageUrl] = useState<string | null>(category?.image || null)

  const isEditing = !!category
  const isLoading = isCreating || isUpdating

  const validationSchema = Yup.object().shape({
    name: Yup.string().required(t('name_required')),
    slug: Yup.string().required(t('slug_required')),
    status: Yup.boolean(),
  })

  const initialValues = {
    name: category?.name || '',
    slug: category?.slug || '',
    status: category?.status ?? true,
    image: null as File | null,
  }

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      const formData = new FormData()
      formData.append('name', values.name)
      formData.append('slug', values.slug)
      formData.append('status', String(values.status))
      if (values.image) {
        formData.append('image', values.image)
      }

      if (isEditing && category) {
        await updateCategory({ id: category._id || category.id, data: formData as any }).unwrap()
        toast.success(t('category_updated_successfully'))
      } else {
        await createCategory(formData as any).unwrap()
        toast.success(t('category_created_successfully'))
      }
      onClose()
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t('something_went_wrong'))
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md! max-w-[calc(100%-2rem)] border-input-border-color bg-bg-card gap-0 max-h-[90vh] rounded-modal-radius shadow-2xl p-0 overflow-auto no-scrollbar">
        <DialogHeader className="sm:px-6 px-4 py-4 bg-bg-card border-b border-input-border-color mb-0">
          <DialogTitle className="text-lg text-left rtl:text-right font-bold tracking-tight ">
            {isEditing ? t('edit_category') : t('create_category')}
          </DialogTitle>
        </DialogHeader>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ setFieldValue, values }) => (
            <Form className="p-4 space-y-6">
              <div className="space-y-4">
                <TextInput
                  name="name"
                  label={t('name')}
                  placeholder={t('enter_category_name')}
                  className="h-11 rounded-xl border-zinc-200 dark:border-white/10 bg-zinc-50/50 dark:bg-white/5 font-semibold"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const val = e.target.value
                    setFieldValue('name', val)
                    if (!isEditing) {
                      setFieldValue('slug', val.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''))
                    }
                  }}
                />
                <TextInput
                  name="slug"
                  label={t('slug')}
                  placeholder={t('enter_category_slug')}
                  className="h-11 rounded-xl border-zinc-200 dark:border-white/10 bg-zinc-50/50 dark:bg-white/5 font-mono text-sm"
                />

                <div className="space-y-2">
                  <Label className="text-md font-bold text-title">{t('category_image') || t('category_image')}</Label>
                  <Input
                    type="file"
                    ref={imageInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        setFieldValue('image', file)
                        const reader = new FileReader()
                        reader.onloadend = () => setImageUrl(reader.result as string)
                        reader.readAsDataURL(file)
                      }
                    }}
                  />
                  <div
                    onClick={() => imageInputRef.current?.click()}
                    className="w-full aspect-video rounded-xl border-2 border-dashed border-zinc-200 dark:border-white/10 hover:border-primary/50 transition-all flex flex-col items-center justify-center cursor-pointer overflow-hidden relative bg-zinc-50/50 dark:bg-white/5 group"
                  >
                    {imageUrl ? (
                      <>
                        <Image
                          src={imageUrl.startsWith('data:') ? imageUrl : `${process.env.NEXT_PUBLIC_STORAGE_URL || ''}${imageUrl}`}
                          alt="Category"
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          unoptimized
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Upload className="w-6 h-6 text-white" />
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-zinc-400">
                        <ImageIcon className="w-8 h-8" />
                        <span className="text-sm font-bold">{t('click_to_upload')}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-subcard border border-input-border-color">
                <span className="text-xs font-bold text-subtitle-color">{t('status')}</span>
                <Switch
                  checked={values.status}
                  onCheckedChange={(checked) => setFieldValue('status', checked)}
                />
              </div>

              <div className="flex items-center gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isLoading}
                  className="h-11 flex-1 rounded-xl font-semibold border-zinc-200 dark:border-white/10 hover:bg-zinc-100 dark:hover:bg-white/5 "
                >
                  {t('cancel')}
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="h-11 flex-1 rounded-xl dark:border-white/10 font-semibold bg-primary text-white shadow-sm hover:bg-primary/90  gap-2"
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  {isEditing ? t('save_changes') : t('create')}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  )
}

export default CategoryModal
