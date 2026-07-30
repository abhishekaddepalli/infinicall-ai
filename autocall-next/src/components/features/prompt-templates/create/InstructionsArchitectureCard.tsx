'use client'

import TextAreaField from "@/components/shared/TextAreaField"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useFormikContext } from "formik"
import { Activity } from "lucide-react"
import { useTranslation } from "react-i18next"

export function InstructionsArchitectureCard() {
  const { t } = useTranslation()
  const { values, setFieldValue } = useFormikContext<any>()

  return (
    <div className="bg-bg-card p-4 sm:p-6 rounded-radius border border-input-border-color space-y-6 h-full">
      <div className="flex items-center gap-3 pb-2">
        <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center">
          <Activity className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
        </div>
        <h2 className="text-xl font-bold text-title">
          {t("instructions_architecture")}
        </h2>
      </div>

      <div className="space-y-6">
        <TextAreaField
          name="system_prompt"
          label={<span className="text-sm font-bold text-title">{t("system_prompt")}</span>}
          placeholder={t("enter_system_prompt")}
          helperText={t("variable_usage_hint")}
          className="min-h-[120px] rounded-radius bg-bg-card border-input-border-color font-medium focus:ring-1 focus:ring-primary/20 focus:border-primary transition-all text-[13px] resize-none"
        />

        <TextAreaField
          name="welcome_message"
          label={<span className="text-sm font-bold text-title">{t("first_message_optional")}</span>}
          placeholder={t("e.g. Hello! Welcome to {{company}}. How can I help you today?")}
          className="min-h-[100px] rounded-radius bg-bg-card border-input-border-color font-medium focus:ring-1 focus:ring-primary/20 focus:border-primary transition-all text-[13px] resize-none"
        />

        <TextAreaField
          name="goodbye_message"
          label={<span className="text-sm font-bold text-title">{t("goodbye_message_optional")}</span>}
          placeholder={t("e.g. Thank you for calling {{company}}. Have a great day!")}
          className="min-h-[100px] rounded-radius bg-bg-card border-input-border-color font-medium focus:ring-1 focus:ring-primary/20 focus:border-primary transition-all text-[13px] resize-none"
        />

        <div className="flex items-center justify-between p-5 bg-emerald-50/50 dark:bg-emerald-500/5 rounded-radius border border-emerald-100 dark:border-emerald-500/10">
          <div className="space-y-1">
            <Label className="text-md font-bold text-title">
              {t("make_this_template_public")}
            </Label>
            <p className="text-sm text-subtitle-color">
              {t("public_template_desc")}
            </p>
          </div>
          <Switch
            checked={values.is_public || false}
            onCheckedChange={(checked) => setFieldValue("is_public", checked)}
            className="data-[state=checked]:bg-emerald-600 dark:data-[state=checked]:bg-emerald-500"
          />
        </div>
      </div>
    </div>
  )
}
