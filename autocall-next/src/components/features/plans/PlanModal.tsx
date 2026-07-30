'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Plan, PlanModalProps } from '@/types/plans'
import { Form, Formik } from 'formik'
import { Package } from 'lucide-react';
import { Loader2 } from '@/components/reusable/Loader2';
import { useTranslation } from 'react-i18next'
import * as Yup from 'yup'
import PlanBasicFields from './plan-modal/PlanBasicFields'

const DEFAULT_FORM: Partial<Plan> = {
  name: '',
  slug: '',
  description: '',
  billing_cycle: 'monthly',
  plan_type: 'subscription',
  amount: 0,
  currency: 'USD',
  module_access: [],
  validity_days: null,
  status: 'active',

  trial_period_days: 0,
  display_order: 0,
  features: {},
  paypal_plan_id_monthly: '',
  paypal_plan_id_yearly: '',
  stripe_price_id: '',
  razorpay_plan_id: '',
  agent_limit: 0,
  campaign_limit_per_day: 0,
  flow_limit: 0,
  knowledgebase_limit: 0,
  storage_limit: 0,
  contact_limit: 0,
}

const PlanModal = ({ isOpen, onClose, onSave, plan, isLoading = false }: PlanModalProps) => {
  const { t } = useTranslation()
  const validationSchema = Yup.object({
    name: Yup.string().required(t('name_is_required')),
    slug: Yup.string().required(t('slug_is_required')),
  })

  const handleSubmit = (values: Partial<Plan>) => {
    onSave(values)
  }

  const initialValues = plan ? {
    ...DEFAULT_FORM,
    ...plan,
    module_access: (plan.module_access || []).map((m: any) =>
      typeof m === 'object' && m !== null ? m.id || m._id : m
    )
  } : DEFAULT_FORM

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl! max-w-[calc(100%-2rem)]! max-h-[90vh] overflow-hidden flex flex-col border-none shadow-2xl rounded-border-radius! bg-light-body">
        <DialogHeader className=" flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Package className="w-6 h-6 text-primary" />
            </div>
            <DialogTitle className="text-xl font-medium text-title-color dark:text-white">
              {plan ? t('edit_plan') : t('create_plan')}
            </DialogTitle>
          </div>
        </DialogHeader>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ values, setFieldValue, dirty, isValid }) => (
            <Form className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto no-scrollbar space-y-6">
                <PlanBasicFields
                  formData={values}
                  isEdit={!!plan}
                  onChange={(field, val: any) => {
                    if (typeof field === 'object') {
                      Object.entries(field).forEach(([k, v]) => setFieldValue(k, v))
                    } else {
                      setFieldValue(field, val)
                      if (field === 'name' && !plan) {
                        setFieldValue('slug', val.toLowerCase().replace(/\s+/g, '-'))
                      }
                    }
                  }}
                />

              </div>

              <DialogFooter className="pt-2 gap-3 sm:gap-4 mt-2 sm:p-6 p-4 pb-0! px-0!">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="flex-1 p-padding! mr-0! rounded-radius border border-input-border-color bg-subcard dark:bg-subcard text-black dark:text-white text-md font-medium transition-all"
                >
                  {t('cancel')}
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading || !isValid || (!!plan && !dirty)}
                  className="flex-1 p-padding! rounded-radius border-none bg-primary text-white text-md font-medium transition-all shadow-sm"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t('saving')}...
                    </>
                  ) : plan ? (
                    t('update')
                  ) : (
                    t('save')
                  )}
                </Button>
              </DialogFooter>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  )
}

export default PlanModal
