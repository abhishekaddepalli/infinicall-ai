'use client'

import { Loader2 } from '@/components/reusable/Loader2'
import RichTextEditor from '@/components/shared/RichTextEditor'
import TextAreaField from '@/components/shared/TextAreaField'
import TextInput from '@/components/shared/TextInput'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { useCreatePageMutation, useUpdatePageMutation } from '@/redux/api/pageApi'
import { ApiError } from '@/types/api'
import { PageFormProps } from '@/types/pages'
import { authUtils } from '@/utils/auth'
import { pageSchemas } from '@/utils/validation-schemas'
import { Form, Formik } from 'formik'
import { ArrowLeft } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

export default function PageForm({ page, onClose }: PageFormProps) {
  const { t } = useTranslation()
  const [createPage, { isLoading: isCreating }] = useCreatePageMutation()
  const [updatePage, { isLoading: isUpdating }] = useUpdatePageMutation()
  const user = authUtils.getUser()

  const isEditing = !!page

  const initialValues = {
    title: page?.title || '',
    slug: page?.slug || '',
    content: page?.content || '',
    meta_title: page?.meta_title || '',
    meta_description: page?.meta_description || '',
    status: page?.status ?? true,
  }

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      if (isEditing && page) {
        const id = page._id || page.id
        const res = await updatePage({ id, ...values }).unwrap()
        toast.success(res.message || t('page_updated_successfully'))
      } else {
        const res = await createPage({ ...values, created_by: user?.id }).unwrap()
        toast.success(res.message || t('page_created_successfully'))
      }
      onClose()
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t('something_went_wrong'))
    }
  }

  const isLoading = isCreating || isUpdating

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-6 duration-500">
      <div className="flex flex-col md:flex-row md:items-center w-full justify-between gap-6">
        <div className="space-y-1">

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-10 w-10 bg-primary/10 text-primary hover:bg-primary/10 dark:bg-primary/20 hover:text-primary rounded-[8px] transition-all shrink-0"
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <div className="space-y-1">
              <h1 className="text-3xl font-bold text-title">
                {isEditing ? t('edit_page') : t('create_page')}
              </h1>
            </div>
          </div>
        </div>
      </div>

      <Formik
        initialValues={initialValues}
        enableReinitialize
        validationSchema={pageSchemas.create(t)}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue, values }) => (
          <Form className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2 space-y-8">
              <Card className="rounded-radius border border-input-border-color bg-bg-card overflow-hidden sm:p-6 p-4 space-y-8 ">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <TextInput
                        name="title"
                        label={t('page_title')}
                        placeholder={t('enter_page_title')}
                        className="h-12 rounded-xl bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 focus:border-primary/50 transition-all shadow-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <TextInput
                        name="slug"
                        label={t('page_slug')}
                        placeholder={t('enter_page_slug')}
                        className="h-12 rounded-xl bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 focus:border-primary/50 transition-all shadow-sm font-mono"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <RichTextEditor
                      label={t('page_content')}
                      value={values.content}
                      onChange={(val) => setFieldValue('content', val)}
                      placeholder={t('start_typing_content')}
                    />
                  </div>
                </div>
              </Card>


            </div>

            <div className="space-y-8 sticky top-24">
              <Card className="rounded-radius border border-input-border-color bg-bg-card sm:p-6 p-4 space-y-8">
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-input-color rounded-radius border border-input-border-color">
                    <div className="flex flex-col">
                      <span className="text-base font-bold text-gray-900 dark:text-white">
                        {t('page_visibility')}
                      </span>
                    </div>
                    <Switch
                      checked={values.status}
                      onCheckedChange={(checked) => setFieldValue('status', checked)}
                      className="data-[state=checked]:bg-switch-background dark:bg-switch-background"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={onClose}
                      disabled={isLoading}
                      className="w-full h-12 rounded-radius border-input-border-color bg-subcard p-padding text-subtitle-color font-bold transition-all"
                    >
                      {t('cancel_changes')}
                    </Button>
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full h-12 p-padding! rounded-radius text-sm font-bold bg-primary text-white transition-all flex items-center justify-center gap-2 mb-0"
                    >
                      {isLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <>
                          {isEditing ? t('save_changes') : t('publish_page_btn')}
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </Card>

              <Card className="rounded-radius border border-input-border-color bg-bg-card overflow-hidden sm:p-6 p-4 space-y-8">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-bold text-title">
                    {t('seo_optimization_settings')}
                  </h3>
                </div>

                <div className="space-y-1">
                  <TextInput
                    name="meta_title"
                    label={t('search_engine_title')}
                    placeholder={t('enter_meta_title')}
                    className="h-12 rounded-xl bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 focus:border-primary/50 transition-all shadow-sm"
                  />
                  <TextAreaField
                    name="meta_description"
                    label={t('search_engine_description')}
                    placeholder={t('enter_meta_description')}
                    rows={4}
                    className="rounded-radius bg-input-color border-input-border-color transition-all "
                  />
                </div>
              </Card>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}
