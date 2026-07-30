import { Loader2 } from '@/components/reusable/Loader2'
import CKEditorField from '@/components/shared/CKEditorField'
import TextInput from '@/components/shared/TextInput'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  useCreateEmailLibraryTemplateMutation,
  useUpdateEmailLibraryTemplateMutation,
} from '@/redux/api/emailLibraryApi'
import { EmailLibraryModalProps, EmailTemplateFormData } from '@/types/email-library'
import { Form, Formik } from 'formik'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import * as Yup from 'yup'

export default function EmailLibraryModal({ isOpen, onClose, templateToEdit }: EmailLibraryModalProps) {
  const { t } = useTranslation()
  const [createTemplate, { isLoading: isCreating }] = useCreateEmailLibraryTemplateMutation()
  const [updateTemplate, { isLoading: isUpdating }] = useUpdateEmailLibraryTemplateMutation()

  const isLoading = isCreating || isUpdating

  const validationSchema = Yup.object().shape({
    name: Yup.string().required(t('validation_required', 'This field is required')),
    subject: Yup.string().required(t('validation_required', 'This field is required')),
    body: Yup.string().required(t('validation_required', 'This field is required')),
    type: Yup.string().required(t('validation_required', 'This field is required')),
  })

  const initialValues: EmailTemplateFormData = {
    name: templateToEdit?.name || '',
    subject: templateToEdit?.subject || '',
    body: templateToEdit?.body || '',
    type: templateToEdit?.type || 'standard',
    is_active: templateToEdit !== undefined ? templateToEdit.is_active : true,
  }

  const handleSubmit = async (values: EmailTemplateFormData) => {
    try {
      if (templateToEdit) {
        await updateTemplate({ id: templateToEdit._id || templateToEdit.id, data: values }).unwrap()
        toast.success(t('email_template_updated_successfully', 'Email template updated successfully'))
      } else {
        await createTemplate(values).unwrap()
        toast.success(t('email_template_created_successfully', 'Email template created successfully'))
      }
      onClose()
    } catch (error: any) {
      toast.error(error?.data?.message || t('failed_to_save_email_template', 'Failed to save email template'))
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[800px]! max-w-[calc(100%-2rem)]! max-h-[90vh] overflow-y-auto no-scrollbar bg-bg-card border border-input-border-color p-0 gap-0!">
        <DialogHeader className="sm:px-6 px-4 py-4 border-b border-input-border-color mb-0 text-left rtl:text-right">
          <DialogTitle className="text-xl font-bold text-title">
            {templateToEdit
              ? t('edit_email_template', 'Edit Email Template')
              : t('create_email_template', 'Create Email Template')}
          </DialogTitle>
        </DialogHeader>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ values, setFieldValue }) => (
            <Form className="flex flex-col h-full w-full">
              <div className="sm:p-6 p-4 space-y-6 w-full min-w-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <TextInput
                    name="name"
                    label={t('name', 'Name')}
                    placeholder={t('enter_name', 'Enter name')}
                  />
                  <TextInput
                    name="type"
                    label={t('type', 'Type')}
                    placeholder={t('enter_type', 'Enter type')}
                  />
                </div>

                <TextInput
                  name="subject"
                  label={t('subject', 'Email Subject')}
                  placeholder={t('enter_email_subject', 'Enter email subject')}
                />

                <CKEditorField
                  label={t('body', 'Email Body')}
                  value={values.body}
                  onChange={(val) => setFieldValue('body', val)}
                  heightClass="min-h-[300px]"
                />

                <div className="flex items-center justify-between p-4 rounded-lg bg-subcard border border-input-border-color">
                  <div className="space-y-1">
                    <Label className="text-md font-bold text-title">{t('status', 'Status')}</Label>
                    <p className="text-md text-subtitle-color font-medium">
                      {t('enable_disable_template', 'Enable or disable this template')}
                    </p>
                  </div>
                  <Switch
                    checked={values.is_active}
                    onCheckedChange={(val) => setFieldValue('is_active', val)}
                  />
                </div>
              </div>

              <div className="sm:p-6 p-4 pt-4 border-t border-input-border-color flex justify-end gap-3 bg-bg-card mt-auto rounded-b-lg">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="rounded-lg font-semibold text-md h-11 p-padding! shadow-none bg-subcard border-input-border-color text-title"
                >
                  {t('cancel', 'Cancel')}
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="rounded-lg font-semibold text-md h-11 p-padding! bg-primary text-white"
                >
                  {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {templateToEdit ? t('update', 'Update') : t('create', 'Create')}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  )
}
