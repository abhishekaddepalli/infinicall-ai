'use client'

import SelectField from '@/components/shared/SelectField'
import TextInput from '@/components/shared/TextInput'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useGetSipTrunksQuery } from '@/redux/api/sipTrunkApi'
import { SipImportModalProps } from '@/types/sip-trunk'
import { Form, Formik } from 'formik'
import { Loader2 } from '@/components/reusable/Loader2';
import { useTranslation } from 'react-i18next'
import * as yup from 'yup'

const SipImportModal = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  initialPhoneNumber = '',
}: SipImportModalProps) => {
  const { t } = useTranslation()
  const { data: trunksData, isLoading: isLoadingTrunks } = useGetSipTrunksQuery(
    { limit: 100, status: 'active' },
    { skip: !isOpen },
  )

  const trunkOptions =
    trunksData?.data?.map((trunk) => ({
      label: `${trunk.name} (${trunk.sip_host})`,
      value: trunk._id || trunk.id || '',
    })).filter((opt) => opt.value !== '') || []

  const validationSchema = yup.object({
    phone_number: yup
      .string()
      .matches(/^\+?[0-9]+$/, t('invalid_phone', { defaultValue: 'Please enter a valid phone number (only numbers and +).' }))
      .required(t('field_required')),
    sip_trunk_id: yup.string().required(t('field_required')),
  })

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md! rounded-modal-radius max-w-[calc(100%-2rem)] p-4 sm:p-6 gap-0 border-none max-h-[90vh] no-scrollbar overflow-auto">
        <DialogHeader className='text-left rtl:text-right'>
          <DialogTitle className='text-left rtl:text-right'>{t('sip_import')}</DialogTitle>
          <DialogDescription >
            {t('sip_import_desc', {
              defaultValue: 'Import a SIP phone number and sync it with ElevenLabs using a trunk integration.',
            })}
          </DialogDescription>
        </DialogHeader>

        <Formik
          initialValues={{
            phone_number: initialPhoneNumber,
            sip_trunk_id: '',
            label: '',
          }}
          enableReinitialize
          validationSchema={validationSchema}
          onSubmit={async (values, { resetForm }) => {
            await onSubmit({
              phone_number: values.phone_number.trim(),
              sip_trunk_id: values.sip_trunk_id,
              label: values.label?.trim() || undefined,
            })
            resetForm()
          }}
        >
          {({ isSubmitting, setFieldValue }) => (
            <Form className="space-y-4">
              <TextInput
                name="phone_number"
                label={t('phone_number')}
                placeholder="+1234567890"
                disabled={!!initialPhoneNumber}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const val = e.target.value.replace(/[^\+0-9]/g, '')
                  setFieldValue('phone_number', val)
                }}
              />
              <SelectField
                name="sip_trunk_id"
                label={t('sip_trunk')}
                placeholder={
                  isLoadingTrunks
                    ? t('loading')
                    : t('select_trunk')
                }
                options={trunkOptions}
                helperText={
                  trunkOptions.length === 0 && !isLoadingTrunks
                    ? t('no_trunks_available', {
                      defaultValue: 'Create a trunk integration before importing SIP numbers.',
                    })
                    : undefined
                }
              />
              <TextInput
                name="label"
                label={t('label')}
                placeholder={t('optional')}
              />

              <DialogFooter className="pt-2 gap-3 sm:gap-4 mt-2">
                <Button type="button" variant="outline" onClick={onClose} className="flex-1 p-padding! mr-0! rounded-radius border border-input-border-color bg-subcard dark:bg-subcard text-black dark:text-white text-md font-medium transition-all">
                  {t('cancel')}
                </Button>
                <Button type="submit" disabled={isLoading || isSubmitting || trunkOptions.length === 0} className="flex-1 p-padding! rounded-radius border-none bg-primary text-white text-md font-medium transition-all shadow-sm">
                  {(isLoading || isSubmitting) && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                  {t('import')}
                </Button>
              </DialogFooter>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  )
}

export default SipImportModal
