'use client'

import SelectField from "@/components/shared/SelectField"
import TextAreaField from "@/components/shared/TextAreaField"
import TextInput from "@/components/shared/TextInput"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { ROUTES } from "@/constants/routes"
import { GeneralInformationCardProps } from "@/types/prompt-template"
import { Plus, Terminal, User } from "lucide-react"
import { useRouter } from "next/navigation"
import { useTranslation } from "react-i18next"

export function GeneralInformationCard({ categoryOptions }: GeneralInformationCardProps) {
  const { t } = useTranslation()
  const router = useRouter()

  return (
    <div className="bg-bg-card p-4 sm:p-6 rounded-radius border border-input-border-color space-y-6 h-full flex flex-col">
      <div className="flex items-center gap-3 pb-2 shrink-0">
        <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center">
          <Terminal className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        </div>
        <h2 className="text-xl font-bold text-title">
          {t("general_information")}
        </h2>
      </div>

      <div className="space-y-6">
        <div>
          <TextInput
            name="name"
            label={
              <span className="text-sm font-bold text-title">
                {t("template_name")} <span className="text-red-500">*</span>
              </span>
            }
            placeholder={t("template_name_placeholder")}
            className="h-11 rounded-radius bg-bg-card border-input-border-color font-medium focus:ring-1 focus:ring-primary/20 focus:border-primary transition-all text-[13px]"
            icon={User}
          />
        </div>
        <div>
          <Label className="block text-sm font-bold text-title mb-2">{t("category")}</Label>
          <div className="flex items-start flex-wrap gap-4">
            <div className="flex-1">
              <SelectField
                name="category"
                placeholder={t("select_category")}
                options={categoryOptions}
                className="h-11 rounded-radius bg-bg-card border-input-border-color font-medium focus:ring-1 focus:ring-primary/20 focus:border-primary transition-all text-[13px]"
                emptyStateTitle={t('no_categories_found', { defaultValue: 'No Categories Found' })}
                emptyStateDescription={t('no_categories_desc', { defaultValue: 'Please create a category before creating this record.' })}
                emptyStateActionLabel={t('create_category')}
                onEmptyStateAction={() => router.push(ROUTES.ATTRIBUTE_TEMPLATE_CATEGORY)}
              />
            </div>
            <Button
              type="button"
              onClick={() => router.push(ROUTES.ATTRIBUTE_TEMPLATE_CATEGORY)}
              className="h-12 gap-2 p-padding!  rounded-radius bg-primary text-white font-bold hover:bg-primary/90 transition-all text-[13px] whitespace-nowrap"
            >
              <Plus></Plus> {t("create_category")}
            </Button>
          </div>
        </div>
        <TextAreaField
          name="content"
          label={<span className="text-sm font-bold text-title">{t("description")}</span>}
          placeholder={t("brief_description_desc")}
          className="min-h-[120px] rounded-radius bg-bg-card border-input-border-color font-medium focus:ring-1 focus:ring-primary/20 focus:border-primary transition-all text-[13px] resize-none"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SelectField
            name="communication_style"
            label={<span className="text-sm font-bold text-title">{t("suggested_voice_tone")}</span>}
            placeholder={t("select_tone")}
            options={[
              { label: t("formal"), value: "formal" },
              { label: t("casual"), value: "casual" },
              { label: t("professional"), value: "professional" },
            ]}
            className="h-11 rounded-radius bg-bg-card border-input-border-color font-medium focus:ring-1 focus:ring-primary/20 focus:border-primary transition-all text-[13px]"
          />
          <TextInput
            name="behavior_style"
            label={<span className="text-sm font-bold text-title">{t("suggested_personality")}</span>}
            placeholder={t("e.g. Enthusiastic, Helpful")}
            className="h-11 rounded-radius bg-bg-card border-input-border-color font-medium focus:ring-1 focus:ring-primary/20 focus:border-primary transition-all text-[13px]"
            icon={User}
          />
        </div>
      </div>
    </div>
  )
}
