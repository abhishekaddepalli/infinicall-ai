'use client'

import { PageHeader } from "@/components/reusable/PageHeader"
import { ROUTES } from "@/constants/routes"
import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { useTranslation } from "react-i18next"
import { TemplateTab } from "./TemplateTab"

const PromptTemplatesPage = () => {
  const { t } = useTranslation()
  const router = useRouter()

  const handleCreateOpen = () => {
    router.push(ROUTES.PROMPT_TEMPLATE_CREATE)
  }

  return (
    <div className="space-y-6 w-full">
      <PageHeader
        title={t("prompt_templates")}
        showBackButton={false}
        primaryAction={{
          label: t("create_template"),
          onClick: handleCreateOpen,
          icon: <Plus className="w-5 h-5" strokeWidth={2.5} />,
          className: 'bg-primary h-12 text-white font-black rounded-radius p-padding text-sm',
        }}
      />

      <div className="w-full">
        <TemplateTab />
      </div>
    </div>
  );
}

export default PromptTemplatesPage
