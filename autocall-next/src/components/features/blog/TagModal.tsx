'use client'

import { Loader2 } from '@/components/reusable/Loader2'
import TextInput from '@/components/shared/TextInput'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useCreateTagMutation, useUpdateTagMutation } from '@/redux/api/tagApi'
import { ApiError } from '@/types/api'
import { TagModalProps } from '@/types/blog'
import { Form, Formik } from 'formik'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import * as Yup from 'yup'

const TagModal = ({ isOpen, onClose, tag }: TagModalProps) => {
  const { t } = useTranslation()
  const [createTag, { isLoading: isCreating }] = useCreateTagMutation()
  const [updateTag, { isLoading: isUpdating }] = useUpdateTagMutation()

  const isEditing = !!tag
  const isLoading = isCreating || isUpdating

  const validationSchema = Yup.object().shape({
    title: Yup.string().required(t('title_required')),
  })

  const initialValues = {
    title: tag?.title || '',
  }

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      if (isEditing && tag) {
        await updateTag({ id: tag._id || tag.id, data: values }).unwrap()
        toast.success(t('tag_updated_successfully'))
      } else {
        await createTag(values).unwrap()
        toast.success(t('tag_created_successfully'))
      }
      onClose()
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t('something_went_wrong'))
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent onOpenAutoFocus={(e) => e.preventDefault()} className="sm:max-w-md! max-w-[calc(100%-2rem)] border-input-border-color bg-bg-card rounded-modal-radius gap-0 shadow-2xl p-0 overflow-hidden">
        <DialogHeader className="sm:px-6 px-4 py-4 bg-bg-card border-b border-input-border-color mb-0">
          <DialogTitle className="text-lg text-left rtl:text-right font-bold tracking-tight">
            {isEditing ? t('edit_tag') : t('create_tag')}
          </DialogTitle>
        </DialogHeader>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {() => (
            <Form className="p-4 space-y-6">
              <TextInput
                name="title"
                label={t('title')}
                placeholder={t('enter_tag_title')}
                className="h-11 rounded-xl border-zinc-200 dark:border-white/10 bg-zinc-50/50 dark:bg-white/5 font-semibold"
              />

              <div className="flex items-center gap-3 pt-4">
                <Button
                  className="h-11 rounded-xl font-semibold flex-1 border-zinc-200 dark:border-white/10 hover:bg-zinc-100 dark:hover:bg-white/5 transition-all"
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isLoading}
                >
                  {t('cancel')}
                </Button>
                <Button
                  className="h-11 rounded-xl font-semibold flex-1 bg-primary dark:border-white/10  text-white shadow-sm hover:bg-primary/90 transition-all gap-2"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
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

export default TagModal
