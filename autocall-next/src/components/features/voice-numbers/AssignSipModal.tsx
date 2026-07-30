'use client'

import SelectField from '@/components/shared/SelectField'
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
import { AssignSipModalProps } from '@/types/sip-trunk'
import { Form, Formik } from 'formik'
import { Loader2 } from '@/components/reusable/Loader2';
import { useTranslation } from 'react-i18next'
import * as yup from 'yup'

const AssignSipModal = ({
  isOpen,
  onClose,
  phoneNumber,
  onSubmit,
  isLoading,
}: AssignSipModalProps) => {
  const { t } = useTranslation()
  const { data: trunksData, isLoading: isLoadingTrunks } = useGetSipTrunksQuery(
    { limit: 100, status: 'active' },
    { skip: !isOpen },
  )

  const trunkOptions =
    trunksData?.data
      ?.map((trunk) => ({
        label: `${trunk.name} (${trunk.sip_host})`,
        value: trunk._id || trunk.id || '',
      }))
      .filter((opt) => opt.value !== '') || []

  const validationSchema = yup.object({
    sip_trunk_id: yup.string().required(t('field_required')),
  })

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md! max-w-[calc(100%-2rem)] border border-input-border-color! dark:border-white/5! rounded-radius sm:p-6 p-4">
        <DialogHeader>
          <DialogTitle className='text-left rtl:text-right'>{t('assign_sip')}</DialogTitle>
          <DialogDescription className="text-md font-medium  text-left rtl:text-right text-subtitle-color">
            {t('assign_sip_desc', {
              defaultValue: 'Assign a SIP trunk to {{number}}. The number type will be updated to SIP.',
              number: phoneNumber?.phone_number || '',
            })}
          </DialogDescription>
        </DialogHeader>

        <Formik
          initialValues={{ 
            sip_trunk_id: phoneNumber?.sip_trunk_id 
              ? (typeof phoneNumber.sip_trunk_id === 'string' 
                  ? phoneNumber.sip_trunk_id 
                  : phoneNumber.sip_trunk_id._id || '') 
              : '' 
          }}
          enableReinitialize
          validationSchema={validationSchema}
          onSubmit={async (values, { resetForm }) => {
            await onSubmit({ sip_trunk_id: values.sip_trunk_id })
            resetForm()
          }}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
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
                      defaultValue: 'Create a trunk integration before assigning SIP numbers.',
                    })
                    : undefined
                }
              />

              <DialogFooter className="pt-2 gap-3 sm:gap-4 mt-2">
                <Button type="button" variant="outline" onClick={onClose} className="flex-1 p-padding! mr-0! rounded-radius border border-input-border-color bg-subcard dark:bg-subcard text-black dark:text-white text-md font-medium transition-all">
                  {t('cancel')}
                </Button>
                <Button type="submit" disabled={isLoading || isSubmitting || trunkOptions.length === 0} className="flex-1 p-padding! rounded-radius border-none bg-primary text-white text-md font-medium transition-all ">
                  {(isLoading || isSubmitting) && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                  {t('assign')}
                </Button>
              </DialogFooter>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  )
}

export default AssignSipModal
