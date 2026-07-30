'use client'

import SelectField from '@/components/shared/SelectField'
import TextAreaField from '@/components/shared/TextAreaField'
import TextInput from '@/components/shared/TextInput'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { ROUTES } from '@/constants/routes'
import { GuideFormProps } from '@/types/tenant-guide'
import { FieldArray, Form, Formik } from 'formik'
import { BookOpen, Code, Info, Plus, Terminal, Trash2 } from 'lucide-react';
import { Loader2 } from '@/components/reusable/Loader2';
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import * as Yup from 'yup'

export function GuideForm({ initialValues, onSubmit, isLoading, mode }: GuideFormProps) {
  const { t } = useTranslation()
  const router = useRouter()

  const defaultValues = {
    title: initialValues?.title || '',
    description: initialValues?.description || '',
    is_active: initialValues?.is_active ?? true,
    endpoints: initialValues?.endpoints?.map((ep) => ({
      sub_title: ep.sub_title || '',
      sub_description: ep.sub_description || '',
      http_method: ep.http_method || t('get'),
      url_path: ep.url_path || '',
      payload: ep.payload ? (typeof ep.payload === 'string' ? ep.payload : JSON.stringify(ep.payload, null, 2)) : '',
      response: ep.response ? (typeof ep.response === 'string' ? ep.response : JSON.stringify(ep.response, null, 2)) : '',
    })) || [
      {
        sub_title: '',
        sub_description: '',
        http_method: 'GET',
        url_path: '',
        payload: '',
        response: '',
      },
    ],
  }

  const jsonValidator = Yup.string().test(
    'is-valid-json',
    t('invalid_json_format'),
    (value) => {
      if (!value || value.trim() === '') return true
      try {
        JSON.parse(value)
        return true
      } catch {
        return false
      }
    }
  )

  const validationSchema = Yup.object().shape({
    title: Yup.string()
      .trim()
      .required(t('title_required')),
    description: Yup.string().trim(),
    endpoints: Yup.array()
      .of(
        Yup.object().shape({
          sub_title: Yup.string()
            .trim()
            .required(t('endpoint_title_required')),
          sub_description: Yup.string()
            .trim()
            .required(t('endpoint_desc_required')),
          http_method: Yup.string()
            .oneOf(['GET', 'POST', 'PUT', 'DELETE', 'PATCH'])
            .required(),
          url_path: Yup.string()
            .trim()
            .required(t('url_path_required')),
          payload: jsonValidator,
          response: jsonValidator,
        })
      )
      .min(1, t('at_least_one_endpoint')),
  })

  const handleFormSubmit = async (values: typeof defaultValues) => {
    // Process JSON strings back to objects before sending to backend API
    const processedEndpoints = values.endpoints.map((ep) => {
      let payloadObj = {}
      let responseObj = {}

      if (ep.payload && ep.payload.trim() !== '') {
        try {
          payloadObj = JSON.parse(ep.payload)
        } catch {
          payloadObj = {}
        }
      }

      if (ep.response && ep.response.trim() !== '') {
        try {
          responseObj = JSON.parse(ep.response)
        } catch {
          responseObj = {}
        }
      }

      return {
        ...ep,
        payload: payloadObj,
        response: responseObj,
      }
    })

    await onSubmit({
      ...values,
      endpoints: processedEndpoints,
    })
  }

  const methodOptions = [
    { label: 'GET', value: 'GET' },
    { label: 'POST', value: 'POST' },
    { label: 'PUT', value: 'PUT' },
    { label: 'DELETE', value: 'DELETE' },
    { label: 'PATCH', value: 'PATCH' },
  ]

  return (
    <Formik
      initialValues={defaultValues}
      validationSchema={validationSchema}
      onSubmit={handleFormSubmit}
      enableReinitialize
    >
      {({ values, setFieldValue, errors }) => (
        <Form className="space-y-8 pb-16">
          {/* General info card */}
          <div className="bg-white dark:bg-slate-950/50 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6 shadow-sm">
            <h2 className="text-lg font-bold text-title flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <span>{t('general_information')}</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TextInput
                name="title"
                label={t('title')}
                placeholder={t('enter_guide_title')}
                className="rounded-xl border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 shadow-sm focus:border-primary/50 transition-all h-11"
              />
              <div className="flex items-center gap-4 p-4 rounded-xl bg-input-color border border-input-border-color h-[46px] self-end">
                <Switch
                  id="is_active"
                  checked={values.is_active}
                  onCheckedChange={(checked) => setFieldValue('is_active', checked)}
                  className="data-[state=checked]:bg-switch-background dark:bg-switch-background"
                />
                <div className="flex flex-col">
                  <Label htmlFor="is_active" className="font-bold text-md cursor-pointer text-title">{t('active')}</Label>
                  <span className="text-[11px] text-subtitle-color">{t('guide_active_hint')}</span>
                </div>
              </div>
            </div>

            <TextAreaField
              name="description"
              label={t('description')}
              placeholder={t('enter_guide_description')}
              rows={4}
              className="rounded-radius border-input-border-color bg-input-color transition-all"
            />
          </div>

          {/* Endpoints builder */}
          <div className="bg-white dark:bg-slate-950/50 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6 shadow-sm">
            <FieldArray name="endpoints">
              {({ push, remove }) => (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                    <div className="space-y-1">
                      <h2 className="text-lg font-bold text-title flex items-center gap-2">
                        <Terminal className="h-5 w-5 text-primary" />
                        <span>{t('endpoints_management')}</span>
                      </h2>
                      <p className="text-xs text-subtitle-color">
                        {t('endpoints_desc')}
                      </p>
                    </div>

                    <Button
                      type="button"
                      onClick={() =>
                        push({
                          sub_title: '',
                          sub_description: '',
                          http_method: 'GET',
                          url_path: '',
                          payload: '',
                          response: '',
                        })
                      }
                      className="bg-primary/10 hover:bg-primary text-primary hover:text-white font-bold h-10 px-4 rounded-xl gap-1.5 transition-all"
                    >
                      <Plus className="h-4 w-4" />
                      <span>{t('add_endpoint')}</span>
                    </Button>
                  </div>

                  {errors.endpoints && typeof errors.endpoints === 'string' && (
                    <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-xs font-bold rounded-xl flex items-center gap-2">
                      <Info className="h-4 w-4" />
                      <span>{errors.endpoints}</span>
                    </div>
                  )}

                  <div className="space-y-6">
                    {values.endpoints.map((ep, idx) => (
                      <div
                        key={idx}
                        className="p-5 sm:p-6 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-6 relative group/card animate-in fade-in zoom-in-95 duration-200"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-extrabold text-primary uppercase tracking-widest bg-primary/10 px-3 py-1.5 rounded-lg">
                            {t('endpoint')} #{idx + 1}
                          </span>

                          {values.endpoints.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => remove(idx)}
                              className="h-8 w-8 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                              title={t('remove')}
                            >
                              <Trash2 className="h-4.5 w-4.5" />
                            </Button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                          <TextInput
                            name={`endpoints[${idx}].sub_title`}
                            label={t('title')}
                            placeholder={t('endpoint_title_placeholder')}
                            className="rounded-xl border-slate-200 dark:border-white/10 bg-white dark:bg-white/5"
                          />

                          <SelectField
                            name={`endpoints[${idx}].http_method`}
                            label={t('http_method')}
                            options={methodOptions}
                            className="rounded-xl bg-white dark:bg-white/5"
                          />

                          <TextInput
                            name={`endpoints[${idx}].url_path`}
                            label={t('url_path')}
                            placeholder={t('url_path_placeholder')}
                            className="rounded-xl border-slate-200 dark:border-white/10 bg-white dark:bg-white/5"
                          />
                        </div>

                        <TextInput
                          name={`endpoints[${idx}].sub_description`}
                          label={t('description')}
                          placeholder={t('endpoint_desc_placeholder')}
                          className="rounded-xl border-slate-200 dark:border-white/10 bg-white dark:bg-white/5"
                        />

                        {/* JSON Schema blocks */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <TextAreaField
                            name={`endpoints[${idx}].payload`}
                            label={
                              <div className="flex items-center gap-1.5">
                                <Code className="h-4 w-4 text-primary" />
                                <span>{t('request_payload')}</span>
                              </div>
                            }
                            placeholder={`{\n  "client_id": "abc",\n  "client_secret": "xyz"\n}`}
                            rows={6}
                            className="font-mono text-xs rounded-xl border-slate-200 dark:border-white/10 bg-white dark:bg-white/5"
                          />

                          <TextAreaField
                            name={`endpoints[${idx}].response`}
                            label={
                              <div className="flex items-center gap-1.5">
                                <Code className="h-4 w-4 text-emerald-500" />
                                <span>{t('response_payload')}</span>
                              </div>
                            }
                            placeholder={`{\n  "token": "eyJhb...",\n  "expires_in": 3600\n}`}
                            rows={6}
                            className="font-mono text-xs rounded-xl border-slate-200 dark:border-white/10 bg-white dark:bg-white/5"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </FieldArray>
          </div>

          {/* Form Actions */}
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(ROUTES.TENANT_GUIDE_SETUP)}
              disabled={isLoading}
              className="flex-1 h-12 font-bold rounded-xl"
            >
              {t('cancel')}
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 h-12 bg-primary hover:bg-primary/95 text-white font-bold rounded-xl"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {mode === 'create' ? t('create') : t('update')}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  )
}
