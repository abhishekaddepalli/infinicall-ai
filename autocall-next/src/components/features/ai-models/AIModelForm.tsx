'use client'

import { Loader2 } from '@/components/reusable/Loader2'
import SelectField from '@/components/shared/SelectField'
import TextAreaField from '@/components/shared/TextAreaField'
import TextInput from '@/components/shared/TextInput'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { ROUTES } from '@/constants/routes'
import { AIModelFormProps } from '@/types/ai-modal'
import { aiModelSchemas } from '@/utils/validation-schemas'
import { Form, Formik } from 'formik'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'

const AIModelForm = ({
  initialValues,
  onSubmit,
  isLoading,
  title,
  button
}: AIModelFormProps) => {
  const { t } = useTranslation()
  const router = useRouter()

  const defaultValues = {
    name: '',
    display_name: '',
    provider: 'openai',
    model_id: '',
    api_endpoint: '',
    api_version: '',
    status: 'active',
    is_default: false,
    description: '',
    ...initialValues,
  }

  const providerOptions = [
    { label: 'OpenAI', value: 'openai' },
    { label: 'Anthropic', value: 'anthropic' },
    { label: 'Google', value: 'google' },
    { label: 'Gemini', value: 'gemini' },
    { label: 'Cohere', value: 'cohere' },
    { label: 'Mistral', value: 'mistral' },
    { label: 'Groq', value: 'groq' },
    { label: 'DeepSeek', value: 'deepseek' },
    { label: 'xAI', value: 'xai' },
    { label: 'Custom Provider', value: 'custom' },
  ]


  return (
    <div className="space-y-6 py-2 animate-in fade-in duration-500">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" type="button" className="h-9 w-9 rounded-radius bg-primary/10 dark:bg-primary/20 text-primary transition-all duration-300 shadow-sm shrink-0 border-none border-primary/20" onClick={() => router.push(ROUTES.AI_MODELS)} title={t("create_ai_model_back")}>
          <ArrowLeft className="w-5 h-5 transition-transform " />
        </Button>
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold text-title">{title}</h1>
        </div>
      </div>

      <Formik initialValues={defaultValues} enableReinitialize validationSchema={aiModelSchemas.create(t)} onSubmit={onSubmit}>
        {({ values, setFieldValue, dirty }) => (
          <Form className="space-y-6">
            <Card className="bg-bg-card border-none shadow-none rounded-2xl overflow-hidden">
              <CardHeader className="sm:px-6 px-4 py-5 border-b border-input-border-color bg-bg-card">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-xl font-bold text-title">{t("ai_model_details")}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="sm:p-6 p-4 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <TextInput name="name" label={t("model_name")} placeholder={t("eg_gpt4o")} />
                  <TextInput name="display_name" label={t("display_name")} placeholder="e.g. GPT-4o" />
                  <SelectField name="provider" label={t("provider")} options={providerOptions} placeholder={t("select_ai_provider")} />
                  <TextInput name="model_id" label={t("model_id")} placeholder={t("eg_gpt4o_model_id")} />

                  {values.provider === "custom" && (
                    <>
                      <TextInput name="api_endpoint" label={t("api_endpoint")} placeholder={t("eg_api_endpoint")} />
                      <TextInput name="api_version" label={t("api_version")} placeholder={t("eg_api_version")} />
                    </>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2">
                    <TextAreaField className='min-h-40' name="description" label={t("description")} placeholder={t("model_description_placeholder")} rows={5} />
                  </div>
                  <div className="space-y-4 pt-6">
                    <div className="flex items-center justify-between p-4 bg-subcard border border-input-border-color rounded-xl h-[70px]">
                      <div>
                        <h3 className="font-bold text-title text-sm">{t("active")}</h3>
                        <p className="text-xs font-medium text-subtitle-color mt-0.5">{t("enable_for_users")}</p>
                      </div>
                      <Switch id="status" checked={values.status === "active"} onCheckedChange={(checked) => setFieldValue("status", checked ? "active" : "inactive")} className="bg-switch-background dark:bg-switch-background shadow-sm" />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-subcard border border-input-border-color rounded-xl h-[70px]">
                      <div>
                        <h3 className="font-bold text-title text-sm">{t("default")}</h3>
                        <p className="text-xs font-medium text-subtitle-color mt-0.5">{t("primary_system_language")}</p>
                      </div>
                      <Switch id="is_default" checked={values.is_default} onCheckedChange={(checked) => setFieldValue("is_default", checked)} className="bg-switch-background dark:bg-switch-background shadow-sm" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-3 pt-6 border-t border-input-border-color mt-4">
              <Button type="button" variant="outline" onClick={() => router.push(ROUTES.AI_MODELS)} disabled={isLoading} className="sm:h-12 h-10 p-padding! rounded-lg font-bold text-sm border-input-border-color bg-subcard text-title transition-all">
                {t("cancel")}
              </Button>
              <Button type="submit" disabled={isLoading || !dirty} className="sm:h-12 h-10 p-padding! rounded-lg font-bold text-sm bg-primary text-white transition-all flex items-center gap-2">
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {t("saving")}
                  </>
                ) : (
                  <>{button}</>
                )}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default AIModelForm
