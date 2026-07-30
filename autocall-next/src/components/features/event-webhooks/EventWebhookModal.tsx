'use client'

import { Loader2 } from '@/components/reusable/Loader2'
import MultiSelectField from '@/components/shared/MultiSelectField'
import TextInput from '@/components/shared/TextInput'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { EVENT_OPTIONS } from '@/data/webhook'
import {
  useCreateWebhookMutation,
  useUpdateWebhookMutation,
} from '@/redux/api/eventWebhooksApi'
import { EventWebhookModalProps } from '@/types/event-webhook'
import { Form, Formik } from 'formik'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import * as Yup from 'yup'

export default function EventWebhookModal({ isOpen, onClose, webhookToEdit }: EventWebhookModalProps) {
  const { t } = useTranslation()
  const [createWebhook, { isLoading: isCreating }] = useCreateWebhookMutation()
  const [updateWebhook, { isLoading: isUpdating }] = useUpdateWebhookMutation()

  const isLoading = isCreating || isUpdating

  const validationSchema = Yup.object().shape({
    name: Yup.string().required(t('validation_required', 'This field is required')),
    endpoint_url: Yup.string().url(t('validation_url', 'Must be a valid URL')).required(t('validation_required', 'This field is required')),
    events: Yup.array().min(1, t('validation_min_events', 'Select at least one event')).required(t('validation_required', 'This field is required')),
  })

  const initialValues = {
    name: webhookToEdit?.name || '',
    endpoint_url: webhookToEdit?.endpoint_url || '',
    events: webhookToEdit?.events || [],
    is_active: webhookToEdit !== undefined ? webhookToEdit.is_active : true,
  }

  const handleSubmit = async (values: any) => {
    try {
      if (webhookToEdit) {
        await updateWebhook({ id: webhookToEdit.id || (webhookToEdit as any)._id, body: values }).unwrap()
        toast.success(t('webhook_updated_successfully', 'Webhook updated successfully'))
      } else {
        await createWebhook(values).unwrap()
        toast.success(t('webhook_created_successfully', 'Webhook created successfully'))
      }
      onClose()
    } catch (error: any) {
      toast.error(error?.data?.message || t('failed_to_save_webhook', 'Failed to save webhook'))
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]! max-w-[calc(100%-2rem)]! max-h-[90vh] overflow-auto no-scrollbar bg-bg-card border border-input-border-color p-0 gap-0!">
        <DialogHeader className="sm:px-6 px-4 py-4 border-b border-input-border-color mb-0 text-left rtl:text-right">
          <DialogTitle className="text-xl font-bold text-title">
            {webhookToEdit
              ? t('edit_webhook', 'Edit Webhook')
              : t('create_webhook', 'Create Webhook')}
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
                <TextInput
                  name="name"
                  label={t('name', 'Name')}
                  placeholder={t('enter_name', 'Enter name')}
                />

                <TextInput
                  name="endpoint_url"
                  label={t('webhook_url', 'Webhook URL')}
                  placeholder={t('enter_webhook_url', 'https://example.com/webhook')}
                />

                <MultiSelectField
                  label={t('hooks', 'Hooks')}
                  options={EVENT_OPTIONS.map(opt => ({ label: opt, value: opt }))}
                  value={values.events}
                  onChange={(val: any) => setFieldValue('events', val)}
                  placeholder={t('select_hooks', 'Select hooks')}
                />

                <div className="flex items-center justify-between p-4 rounded-lg bg-subcard border border-input-border-color">
                  <div className="space-y-1">
                    <Label className="text-md font-bold text-title">{t('status', 'Status')}</Label>
                    <p className="text-md text-subtitle-color font-medium">
                      {t('enable_disable_webhook', 'Enable or disable this webhook')}
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
                  {webhookToEdit ? t('update', 'Update') : t('create', 'Create')}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  )
}
