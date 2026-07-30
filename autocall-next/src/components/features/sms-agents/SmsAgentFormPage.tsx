'use client'

import MultiSelectField from "@/components/shared/MultiSelectField"
import SelectField from "@/components/shared/SelectField"
import TextAreaField from "@/components/shared/TextAreaField"
import TextInput from "@/components/shared/TextInput"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { ROUTES } from "@/constants/routes"
import { useGetAiModelsQuery } from "@/redux/api/aiModelApi"
import { useGetKnowledgeBaseQuery } from "@/redux/api/knowledgeBaseApi"
import { smsAgentApi, useCreateSMSAgentMutation, useUpdateSMSAgentMutation } from "@/redux/api/smsAgentApi"
import { ApiError } from "@/types/api"
import { SmsAgentFormPageProps } from "@/types/sms-campaign"
import { Form, Formik } from "formik"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import * as Yup from "yup"

export const SmsAgentFormPage = ({ isEdit, id }: SmsAgentFormPageProps) => {
  const { t } = useTranslation()
  const router = useRouter()
  const [createSmsAgent, { isLoading: isCreating }] = useCreateSMSAgentMutation()
  const [updateSmsAgent, { isLoading: isUpdating }] = useUpdateSMSAgentMutation()

  const { data: response, isLoading: isLoadingAgent } = smsAgentApi.useGetSMSAgentByIdQuery(
    id as string,
    { skip: !isEdit || !id }
  )

  const { data: modelsRes } = useGetAiModelsQuery()
  const modelsOptions = ((modelsRes as any)?.aiModels || (modelsRes as any)?.data || []).map((m: any) => ({
    label: m.name,
    value: m.id || m._id || "",
  }))

  const { data: kbRes } = useGetKnowledgeBaseQuery({ page: 1, limit: 100 })
  const knowledgeBaseOptions = ((kbRes as any)?.knowledgeBase || (kbRes as any)?.data || []).map((kb: any) => ({
    label: kb.name || kb.title,
    value: kb._id || kb.id || "",
  }))

  const existingAgent = isEdit ? response?.data : null

  const initialValues = {
    name: existingAgent?.name || "",
    description: existingAgent?.description || "",
    language: existingAgent?.language || "en",
    llm_model: typeof existingAgent?.llm_model === 'object' ? (existingAgent?.llm_model as any)?._id || (existingAgent?.llm_model as any)?.id : existingAgent?.llm_model || "",
    status: existingAgent?.status || "active",
    transfer_to_human: {
      enabled: existingAgent?.transfer_to_human?.enabled || false,
      transfer_keywords: existingAgent?.transfer_to_human?.transfer_keywords?.join(', ') || "",
    },
    knowledge_base: existingAgent?.knowledge_base?.map((kb: any) => typeof kb === 'object' ? (kb._id || kb.id) : kb) || [],
  }

  const validationSchema = Yup.object().shape({
    name: Yup.string().required(t("name_is_required")),
    language: Yup.string().required(t("language_is_required")),
    status: Yup.string().required(t("status_is_required")),
  })

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      const payload = {
        ...values,
        transfer_to_human: {
          ...values.transfer_to_human,
          transfer_keywords: values.transfer_to_human.transfer_keywords
            ? values.transfer_to_human.transfer_keywords.split(',').map((k) => k.trim()).filter(Boolean)
            : [],
        }
      }

      if (isEdit && id) {
        await updateSmsAgent({ id, data: payload }).unwrap()
        toast.success(t("agent_updated_successfully"))
      } else {
        await createSmsAgent(payload).unwrap()
        toast.success(t("agent_created_successfully"))
      }
      router.push(ROUTES.SMS_AGENTS)
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t("something_went_wrong"))
    }
  }

  if (isEdit && isLoadingAgent) {
    return <div className="flex items-center justify-center h-64">{t("loading")}</div>
  }

  return (
    <div className="text-slate-900 dark:text-white space-y-8 transition-colors duration-300 animate-in fade-in slide-in-from-bottom-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => router.push(ROUTES.SMS_AGENTS)}
            className="h-10 w-10 rounded-xl bg-primary/10 dark:bg-primary/20 text-primary hover:bg-primary hover:text-white transition-all duration-300 shadow-sm shrink-0 border-none"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-title flex items-center gap-2">
              <span>{isEdit ? t("edit_sms_agent") : t("create_sms_agent")}</span>
            </h1>
          </div>
        </div>
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, setFieldValue, errors, isSubmitting }) => (
          <Form className="space-y-8">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
            <div className="xl:col-span-2 space-y-6">
              <div className="bg-bg-card sm:p-6 p-4 rounded-lg border border-input-border-color space-y-6">
                <h3 className="text-lg font-bold flex items-center gap-2 border-b border-input-border-color pb-4">
                  {t("basic_information")}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  <div className="md:col-span-12">
                    <TextInput
                      name="name"
                      label={t("name")}
                      placeholder={t("enter_agent_name")}
                    />
                  </div>

                  <div className="md:col-span-4">
                    <SelectField
                      name="status"
                      label={t("status")}
                      options={[
                        { label: t("active"), value: "active" },
                        { label: t("inactive"), value: "inactive" },
                      ]}
                      placeholder={t("select_status")}
                    />
                  </div>

                  <div className="md:col-span-4">
                    <SelectField
                      name="language"
                      label={t("language")}
                      options={[
                        { label: "English", value: "en" },
                        { label: "Spanish", value: "es" },
                        { label: "French", value: "fr" },
                        { label: "German", value: "de" },
                      ]}
                      placeholder={t("select_language")}
                    />
                  </div>

                  <div className="md:col-span-4">
                    <SelectField
                      name="llm_model"
                      label={t("ai_model")}
                      options={modelsOptions}
                      placeholder={t("select_model")}
                      emptyStateTitle={t('no_models_found', { defaultValue: 'No AI Models Found' })}
                      emptyStateDescription={t('no_models_desc', { defaultValue: 'Please add an AI model before creating this record.' })}
                    />
                  </div>
                </div>

                <TextAreaField
                  name="description"
                  label={t("description")}
                  placeholder={t("enter_description")}
                  rows={4}
                  className="min-h-[120px] bg-input-color border-input-border-color font-medium focus:bg-input-color transition-all text-sm resize-none"
                />
              </div>
            </div>

            <div className="xl:col-span-1 space-y-6">
              <div className="bg-bg-card sm:p-6 p-4 rounded-lg border border-input-border-color space-y-6">
                <div className="flex items-center justify-between border-b border-input-border-color pb-4">
                  <div>
                    <h3 className="text-lg font-bold flex items-center gap-2">
                      {t("transfer_to_human")}
                    </h3>
                    <p className="text-sm text-subtitle-color mt-1">
                      {t("transfer_to_human_desc")}
                    </p>
                  </div>
                  <Switch
                    checked={values.transfer_to_human.enabled}
                    onCheckedChange={(checked) => setFieldValue('transfer_to_human.enabled', checked)}
                  />
                </div>

                <div className="space-y-6 transition-all duration-300">
                  <div className="grid grid-cols-1 gap-6">
                    <TextInput
                      name="transfer_to_human.transfer_keywords"
                      label={t("transfer_keywords")}
                      placeholder={t("comma_separated_keywords")}
                      disabled={!values.transfer_to_human.enabled}
                    />
                  </div>
                </div>
              </div>

              <div className="bg-bg-card sm:p-6 p-4 rounded-lg border border-input-border-color space-y-6">
                <h3 className="text-lg font-bold flex items-center gap-2 border-b border-input-border-color pb-4">
                  {t("knowledge_base")}
                </h3>
                <MultiSelectField
                  label={t("select_knowledge_base")}
                  options={knowledgeBaseOptions}
                  placeholder={t("search_knowledge_base")}
                  value={values.knowledge_base}
                  onChange={(val) => setFieldValue('knowledge_base', val)}
                  error={errors.knowledge_base as string | undefined}
                  emptyStateTitle={t('no_kb_found', { defaultValue: 'No Knowledge Base Found' })}
                  emptyStateDescription={t('no_kb_desc', { defaultValue: 'Please create a knowledge base before creating this record.' })}
                  emptyStateActionLabel={t('add_knowledge_base', { defaultValue: 'Add Knowledge Base' })}
                  onEmptyStateAction={() => router.push(ROUTES.KNOWLEDGE_BASE)}
                />
              </div>
              </div>
            </div>

            {/* Bottom Actions Bar */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-end border-t border-input-border-color pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(ROUTES.SMS_AGENTS)}
                disabled={isCreating || isUpdating || isSubmitting}
                className="h-12 w-full sm:w-auto p-padding! border-input-border-color bg-subcard text-subtitle-color rounded-lg font-bold"
              >
                {t("cancel")}
              </Button>

              <Button
                type="submit"
                disabled={isCreating || isUpdating || isSubmitting}
                className="h-12 w-full sm:w-auto p-padding! rounded-lg font-bold text-white bg-primary flex items-center justify-center gap-2"
              >
                {isEdit ? t("save_changes") : t("create")}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}
