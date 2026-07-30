'use client'

import { GeneralInformationCard } from "@/components/features/prompt-templates/create/GeneralInformationCard"
import { InstructionsArchitectureCard } from "@/components/features/prompt-templates/create/InstructionsArchitectureCard"
import { TemplateActionBar } from "@/components/features/prompt-templates/create/TemplateActionBar"
import { Button } from "@/components/ui/button"
import { ROUTES } from "@/constants/routes"
import {
  useCreatePromptTemplateMutation,
  useGetPromptTemplatesQuery,
  useUpdatePromptTemplateMutation
} from "@/redux/api/promptTemplateApi"
import { useGetTemplateCategoriesQuery } from "@/redux/api/templateCategoryApi"
import { PromptTemplate } from "@/types/prompt-template"
import { promptTemplateSchemas } from "@/utils/validation-schemas"
import { Form, Formik } from "formik"
import { ArrowLeft, Settings2 } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"

export default function CreatePromptTemplatePage() {
  const { t } = useTranslation()
  const router = useRouter()
  const searchParams = useSearchParams()
  const templateId = searchParams.get('id')

  const { data: categoriesResponse } = useGetTemplateCategoriesQuery({ limit: 100 })
  const categories = categoriesResponse?.categories || []

  const { data: templatesResponse, isLoading: isLoadingTemplates } = useGetPromptTemplatesQuery(
    { limit: 100 },
    { skip: !templateId }
  )

  const [createTemplate, { isLoading: isCreating }] = useCreatePromptTemplateMutation()
  const [updateTemplate, { isLoading: isUpdating }] = useUpdatePromptTemplateMutation()

  const template = templatesResponse?.templates?.find((t: any) => (t.id || t._id) === templateId)

  const initialValues = {
    name: template?.name || "",
    category: typeof template?.category === 'string'
      ? template.category
      : (template?.category?.id || template?.category?._id || ""),
    content: template?.content || "",
    system_prompt: template?.system_prompt || "",
    welcome_message: template?.welcome_message || "",
    goodbye_message: template?.goodbye_message || "",
    communication_style: template?.communication_style || "",
    behavior_style: template?.behavior_style || "",
    is_public: template?.is_public || false,
  }

  const categoryOptions = categories.map(cat => ({
    label: cat.name,
    value: cat.id || cat._id || ""
  }))

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      if (templateId) {
        await updateTemplate({
          id: templateId,
          data: values as Partial<PromptTemplate>
        }).unwrap()
        toast.success(t("template_updated_successfully"))
      } else {
        await createTemplate(values as Partial<PromptTemplate>).unwrap()
        toast.success(t("template_created_successfully"))
      }
      router.push(ROUTES.PROMPT_TEMPLATES)
    } catch (error: any) {
      toast.error(error?.data?.message || t("something_went_wrong"))
    }
  }

  if (templateId && isLoadingTemplates) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50/50">
        <div className="flex flex-col items-center gap-4 p-8 rounded-3xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-white/5 shadow-2xl animate-in fade-in zoom-in-95 duration-300">
          <Settings2 className="w-10 h-10 text-primary animate-spin" />
          <span className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-zinc-400">
            {t('loading')}...
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen  text-slate-900 dark:text-white space-y-8 w-full transition-colors duration-300">

      {/* Top Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1 flex itmes-center justify-center gap-4">
          <Button
            variant="ghost"
            onClick={() => router.push(ROUTES.PROMPT_TEMPLATES)}
            className="flex items-center gap-2 h-9 w-9 rounded-radius bg-primary/10 dark:bg-primary/20 text-primary transition-all duration-300 shadow-sm shrink-0 border-none border-primary/20"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>

          <h1 className="text-3xl font-black  flex items-center gap-3">

            <span>{templateId ? t("edit_template") : t("create_new_template")}</span>
          </h1>
        </div>
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={promptTemplateSchemas.create(t)}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {() => (
          <Form className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch animate-in fade-in slide-in-from-bottom-4 duration-500">

              {/* Left Column: Basic configuration (7 columns) */}
              <div className="lg:col-span-7 h-full">
                <GeneralInformationCard categoryOptions={categoryOptions} />
              </div>

              {/* Right Column: Prompt parameters (5 columns) */}
              <div className="lg:col-span-5 h-full">
                <InstructionsArchitectureCard />
              </div>
            </div>

            {/* Bottom Actions Bar */}
            <TemplateActionBar
              templateId={templateId}
              isCreating={isCreating}
              isUpdating={isUpdating}
            />
          </Form>
        )}
      </Formik>
    </div>
  )
}
