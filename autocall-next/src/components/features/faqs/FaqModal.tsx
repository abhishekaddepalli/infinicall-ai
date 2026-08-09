
import { Loader2 } from '@/components/reusable/Loader2'
import TextAreaField from '@/components/shared/TextAreaField'
import TextInput from '@/components/shared/TextInput'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useCreateFaqMutation, useUpdateFaqMutation } from '@/redux/api/faqApi'
import { ApiError } from '@/types/api'
import { FaqModalProps } from '@/types/faq'
import { faqSchemas } from '@/utils/validation-schemas'
import { Form, Formik } from 'formik'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

export function FaqModal({ isOpen, onClose, faq }: FaqModalProps) {
  const { t } = useTranslation()
  const [createFaq, { isLoading: isCreating }] = useCreateFaqMutation()
  const [updateFaq, { isLoading: isUpdating }] = useUpdateFaqMutation()

  const isEditing = !!faq

  const initialValues = {
    title: faq?.title || '',
    description: faq?.description || '',
    status: faq?.status ?? true,
  }

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      if (isEditing && faq) {
        const res = await updateFaq({ id: faq.id, ...values }).unwrap()
        toast.success(res.message || t('faq_updated_successfully'))
      } else {
        const res = await createFaq(values).unwrap()
        toast.success(res.message || t('faq_created_successfully'))
      }
      onClose()
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t('something_went_wrong'))
    }
  }

  const isLoading = isCreating || isUpdating

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent onOpenAutoFocus={(e) => e.preventDefault()} className="sm:max-w-xl! max-w-[calc(100%-2rem)]! rounded-radius border-none bg-white gap-0 p-0 overflow-auto max-h-[90vh] no-scrollbar">
        <DialogHeader className="sm:px-6 text-left px-4 py-5 border-b border-input-border-color mb-0">
          <DialogTitle className="text-xl text-left rtl:text-right font-bold text-gray-900 dark:text-white">
            {isEditing ? t('edit_faq') : t('create_faq')}
          </DialogTitle>
        </DialogHeader>
        <Formik
          initialValues={initialValues}
          enableReinitialize
          validationSchema={faqSchemas.create(t)}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue, values }) => (
            <Form className="sm:px-6 px-4 pt-4 space-y-8">
              <div className="space-y-6">
                <TextInput
                  name="title"
                  label={t('title')}
                  placeholder={t('enter_faq_title')}
                  className="rounded-xl border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 shadow-sm focus:border-primary/50 transition-all h-11"
                />
                <TextAreaField
                  name="description"
                  label={t('description')}
                  placeholder={t('enter_faq_description')}
                  rows={5}
                  className="rounded-radius border-input-border-color bg-input-color transition-all"
                />
                <div className="flex items-center gap-4 sm:p-5 p-4 rounded-radius bg-input-color border border-input-border-color">
                  <Switch
                    id="status"
                    checked={values.status}
                    onCheckedChange={(checked) => setFieldValue('status', checked)}
                    className="data-[state=checked]:bg-switch-background dark:bg-switch-background"
                  />
                  <div className="flex flex-col">
                    <Label htmlFor="status" className="font-bold text-base cursor-pointer text-title">{t('active')}</Label>
                    <span className="text-md text-subtitle-color">{t('faq_status_hint')}</span>
                  </div>
                </div>
              </div>

              <DialogFooter className="pt-2 gap-3 sm:gap-4 mt-2 pb-4">
                <Button type="button" variant="outline" onClick={onClose} disabled={isLoading} className="flex-1 p-padding! mr-0! rounded-radius border border-input-border-color bg-subcard dark:bg-subcard text-black dark:text-white text-md font-medium transition-all">
                  {t('cancel')}
                </Button>
                <Button type="submit" disabled={isLoading} className="flex-1 p-padding! rounded-radius border-none bg-primary text-white text-md font-medium transition-all shadow-sm">
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isEditing ? t('save_changes') : t('create')}
                </Button>
              </DialogFooter>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  )
}
