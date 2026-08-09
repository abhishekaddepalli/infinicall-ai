'use client'

import SelectField from '@/components/shared/SelectField'
import TextInput from '@/components/shared/TextInput'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { FieldArray, useFormikContext } from 'formik'
import { FileText, Plus, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { kycFieldTypeOptions } from '@/data/setting'
import { KycFormValues } from '@/types/settings'

const KycConfigurationCard = () => {
  const { t } = useTranslation()
  const { values, setFieldValue, errors } = useFormikContext<KycFormValues>()

  return (
    <Card className="bg-bg-card border border-input-border-color rounded-lg overflow-hidden animate-in fade-in duration-300">
      <CardHeader className="sm:px-6 px-4 py-4 border-b border-input-border-color bg-bg-card">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-zinc-500" />
            <CardTitle className="text-xl font-semibold text-title">
              {t('kyc_configuration', 'KYC Configuration')}
            </CardTitle>
          </div>
        </div>
      </CardHeader>

      <CardContent className="sm:p-6 p-4 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative sm:p-5 p-4 rounded-lg border border-input-border-color bg-subcard hover:bg-zinc-50 dark:hover:bg-white/3 transition-all flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base font-bold text-title">{t('kyc_mandatory', 'Mandatory KYC')}</Label>
              <p className="text-md text-subtitle-color">{t('kyc_required_desc', 'Enforce KYC completion before users can use services.')}</p>
            </div>
            <Switch
              checked={values.kyc_required}
              onCheckedChange={(checked) => setFieldValue('kyc_required', checked)}
            />
          </div>

          <div className="relative sm:p-5 p-4 rounded-lg border border-input-border-color bg-subcard hover:bg-zinc-50 dark:hover:bg-white/3 transition-all flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base font-bold text-title">{t('enable_pdf_upload', 'Enable PDF Upload')}</Label>
              <p className="text-md text-subtitle-color">{t('kyc_allow_pdf_upload_desc', 'Allow users to upload PDF documents for KYC.')}</p>
            </div>
            <Switch
              checked={values.kyc_allow_pdf_upload}
              onCheckedChange={(checked) => setFieldValue('kyc_allow_pdf_upload', checked)}
            />
          </div>
        </div>

        <div className="relative sm:p-5 p-4 rounded-lg border border-input-border-color bg-subcard hover:bg-zinc-50 dark:hover:bg-white/3 transition-all">
          <div className="mb-4">
            <Label className="text-base font-bold text-title">{t('kyc_fields_limit', 'Maximum KYC Fields')}</Label>
            <p className="text-md text-subtitle-color mt-1">{t('kyc_max_fields_desc', 'Maximum number of total fields (text and files) allowed.')}</p>
          </div>
          <div className="max-w-md">
            <TextInput
              name="kyc_max_files"
              type="number"
              min={1}
              max={10}
              className="h-10 w-full px-3 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-white/10 focus:ring-1 focus:ring-primary/20 transition-all rounded-lg text-sm"
            />
          </div>
        </div>

        <div className="relative sm:p-5 p-4 rounded-lg border border-input-border-color bg-subcard transition-all space-y-6">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-title flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              {t('kyc_input_fields', 'KYC Input Fields')}
            </h3>
            <p className="text-md text-subtitle-color">{t('kyc_form_fields_desc', 'Define dynamic form fields to collect during KYC.')}</p>
          </div>

          <FieldArray name="kyc_form_fields">
            {({ remove, push }) => (
              <div className="space-y-4">
                {typeof errors.kyc_form_fields === 'string' && (
                  <div className="p-3 rounded-lg bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 text-sm font-semibold border border-red-200 dark:border-red-500/20">
                    {errors.kyc_form_fields}
                  </div>
                )}
                {values.kyc_form_fields && values.kyc_form_fields.length > 0 ? (
                  values.kyc_form_fields.map((field, index) => (
                    <div key={index} className="grid grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto_auto] gap-x-6 gap-y-4 items-end sm:p-5 p-3 rounded-lg border border-input-border-color bg-bg-card shadow-sm">
                      <div className="space-y-2 col-span-2 lg:col-span-1">
                        <Label className="text-sm font-semibold text-title">{t('input', 'Input')}</Label>
                        <TextInput name={`kyc_form_fields.${index}.label`} placeholder="Name" />
                      </div>
                      <div className="space-y-2 col-span-2 lg:col-span-1">
                        <Label className="text-sm font-semibold text-title">{t('format', 'Format')}</Label>
                        <SelectField
                          name={`kyc_form_fields.${index}.type`}
                          options={kycFieldTypeOptions}
                        />
                      </div>
                      <div className="space-y-2 col-span-2 lg:col-span-1">
                        <Label className="text-sm font-semibold text-title">{t('placeholder_text', 'Placeholder Text')}</Label>
                        <TextInput name={`kyc_form_fields.${index}.placeholder`} placeholder="Enter your name" />
                      </div>
                      <div className="space-y-2 flex flex-col justify-center h-[76px] pb-3 col-span-1">
                        <Label className="text-sm font-semibold text-title mb-2 lg:text-center text-left">{t('required', 'Required')}</Label>
                        <div className="flex lg:justify-center justify-start">
                          <Switch
                            checked={field.required}
                            onCheckedChange={(checked) => setFieldValue(`kyc_form_fields.${index}.required`, checked)}
                          />
                        </div>
                      </div>
                      <div className="flex items-center justify-end h-[76px] pb-1 col-span-1">
                        <Button
                          type="button"
                          variant="ghost"
                          className="h-9 w-9 p-0! rounded-lg bg-destructive/10 hover:bg-destructive text-destructive hover:text-white shadow-none border-none"
                          onClick={() => remove(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-subtitle-color rounded-lg border border-input-border-color border-dashed bg-white dark:bg-zinc-900">
                    {t('no_fields_added', 'No fields added yet.')}
                  </div>
                )}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    if (values.kyc_form_fields && values.kyc_form_fields.length >= values.kyc_max_files) {
                      toast.error(t('kyc_limit_reached', `You can only add up to ${values.kyc_max_files} KYC fields in total (based on the limit above).`))
                      return
                    }
                    push({ label: '', type: 'Text', placeholder: '', required: false })
                  }}
                  className="flex ml-auto rtl:ml-[unset] rtl:mr-auto items-center justify-center gap-2 border-input-border-color h-12 rounded-lg text-white font-semibold bg-primary p-padding! shadow-sm transition-all"
                >
                  <Plus className="w-4 h-4" />
                  {t('add_new_field', 'Add New Field')}
                </Button>
              </div>
            )}
          </FieldArray>
        </div>
      </CardContent>
    </Card>
  )
}

export default KycConfigurationCard
