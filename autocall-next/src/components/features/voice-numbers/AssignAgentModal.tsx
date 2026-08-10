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
import { useGetAgentsQuery } from '@/redux/api/agentApi'
import { AssignAgentModalProps } from '@/types/voice'
import { Form, Formik } from 'formik'
import { Loader2 } from '@/components/reusable/Loader2';
import { useTranslation } from 'react-i18next'

const AssignAgentModal = ({
  isOpen,
  onClose,
  phoneNumber,
  onSubmit,
  isLoading,
}: AssignAgentModalProps) => {
  const { t } = useTranslation()

  const { data: agentsData, isLoading: isLoadingAgents } = useGetAgentsQuery(
    { limit: 100 },
    { skip: !isOpen },
  )

  const availableAgents = agentsData?.data ?? []

  const agentOptions = [
    {
      label: t('none', {
        defaultValue: 'None',
      }),
      value: 'none',
    },
    ...availableAgents
      .map((agent: { name: string; _id?: string; id?: string }) => ({
        label: agent.name,
        value: agent._id || agent.id || '',
      }))
      .filter((opt: { value: string }) => opt.value !== ''),
  ]

  const currentAgentId: string = (() => {
    if (!phoneNumber?.agent_id) return 'none'

    if (typeof phoneNumber.agent_id === 'object') {
      return phoneNumber.agent_id._id ?? phoneNumber.agent_id.id ?? 'none'
    }

    return phoneNumber.agent_id
  })()

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent onOpenAutoFocus={(e) => e.preventDefault()} className="sm:max-w-md! max-w-[calc(100%-2rem)] rounded-modal-radius gap-0! border-none max-h-[90vh] no-scrollbar overflow-auto sm:p-6 p-4">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <DialogTitle className="text-xl">
              {t('assign_agent')}
            </DialogTitle>
          </div>

          <DialogDescription className='text-subtitile-color text-left rtl:text-right'>
            {t('assign_agent_desc', {
              defaultValue:
                'Assign an incoming agent to {{number}}. Select "None" to remove the current assignment.',
              number: phoneNumber?.phone_number ?? '',
            })}
          </DialogDescription>
        </DialogHeader>

        <Formik
          initialValues={{
            agent_id: currentAgentId,
          }}
          enableReinitialize
          onSubmit={async (values, { resetForm }) => {
            await onSubmit({
              agent_id: values.agent_id === 'none' ? null : values.agent_id,
            })

            resetForm()
            onClose()
          }}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              <SelectField
                name="agent_id"
                label={t('incoming_agent', {
                  defaultValue: 'Incoming Agent',
                })}
                placeholder={
                  isLoadingAgents
                    ? t('loading')
                    : t('select_agent', {
                      defaultValue: 'Select Agent',
                    })
                }
                options={agentOptions}
                helperText={
                  !isLoadingAgents && availableAgents.length === 0
                    ? t('no_incoming_agents', {
                      defaultValue:
                        'No agents found. Create an AI assistant first.',
                    })
                    : undefined
                }
              />

              <DialogFooter className="pt-2 gap-3 sm:gap-4 mt-2">
                <Button type="button" variant="outline" onClick={onClose} className="flex-1 p-padding! mr-0! rounded-radius border border-input-border-color bg-subcard dark:bg-subcard text-black dark:text-white text-md font-medium transition-all">
                  {t('cancel')}
                </Button>

                <Button type="submit" disabled={isLoading || isSubmitting} className="flex-1 p-padding! rounded-radius border-none bg-primary text-white text-md font-medium transition-all shadow-sm">
                  {(isLoading || isSubmitting) && (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  )}
                  {t('save')}
                </Button>
              </DialogFooter>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  )
}

export default AssignAgentModal