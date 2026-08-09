'use client'

import { Button } from '@/components/ui/button'
import { Plan, PlanFormProps } from '@/types/plans'
import { Form, Formik } from 'formik'
import { ArrowLeft, Package } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import * as Yup from 'yup'
import PlanBasicFields from './plan-modal/PlanBasicFields'

const DEFAULT_FORM: Partial<Plan> = {
  name: '',
  slug: '',
  description: '',
  billing_cycle: 'monthly',
  amount: 0,
  currency: 'USD',
  is_active: true,

  is_popular: false,
  sort_order: 0,
  total_credits: 0,
  agent_limit: 0,
  campaign_limit_per_day: 0,
  flow_limit: 0,
  knowledgebase_limit: 0,
  storage_limit: 0,
  contact_limit: 0,
}

const PlanForm = ({ plan, onSave, isLoading = false }: PlanFormProps) => {
  const { t } = useTranslation()
  const router = useRouter()
  const validationSchema = Yup.object({
    name: Yup.string().required(t('name_is_required')),
    slug: Yup.string().required(t('slug_is_required')),
    amount: Yup.number().required(t('amount_is_required')).min(0),
  })

  const handleSubmit = async (values: Partial<Plan>) => {
    await onSave(values)
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="relative overflow-hidden mb-3">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-1">
              <div className='flex items-center gap-2'>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => router.back()}
                  type="button"
                  className="h-10 w-10 bg-primary/10 text-primary hover:bg-primary/10 hover:text-primary dark:bg-primary/20 rounded-radius transition-all shrink-0 border-none!"
                >
                  <ArrowLeft className="h-4 w-4 text-primary" />
                </Button>
                <h1 className="text-3xl font-bold title-color">{plan ? t('edit_plan') : t('create_new_plan')}</h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Formik
        initialValues={plan ? { ...DEFAULT_FORM, ...plan } : DEFAULT_FORM}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, setFieldValue, dirty, isValid }) => (
          <Form className="space-y-8 w-full">
            <div className="space-y-10">
              <div className="sm:p-6 p-4 bg-bg-card rounded-radius border border-input-border-color min-h-137.5 relative overflow-hidden group">
                <div className="relative z-10 transition-all duration-500">
                  <div className="sm:mb-10 mb-6 flex items-center justify-between border-b border-input-border-color pb-4">
                    <div>
                      <h2 className="text-xl font-medium text-title-color dark:text-white flex items-center gap-3">
                        <Package className="w-6 h-6 text-primary" />
                        {t('basic_info')}
                      </h2>
                    </div>
                  </div>

                  <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
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
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-end gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => router.back()}
                  className="rounded-radius h-12 bg-subcard p-padding! text-subtitle-color font-medium border border-input-border-color"
                >
                  {t('cancel')}
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading || !isValid || !dirty}
                  className="rounded-radius h-12 bg-primary font-medium border border-input-border-color p-padding! text-white"
                >
                  {isLoading ? (
                    <>
                      {t('creating')}
                    </>
                  ) : (
                    <>
                      {plan ? t('save_changes') : t('create')}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default PlanForm
