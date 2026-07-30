'use client'

import { Button } from "@/components/ui/button"
import { ROUTES } from "@/constants/routes"
import { TemplateActionBarProps } from "@/types/prompt-template"
import { useFormikContext } from "formik"
import { useRouter } from "next/navigation"
import { useTranslation } from "react-i18next"

export function TemplateActionBar({
  templateId,
  isCreating,
  isUpdating
}: TemplateActionBarProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const { isSubmitting } = useFormikContext()

  const isDisabled = isSubmitting || isCreating || isUpdating

  return (
    <div className="z-40 rounded-radius p-5 md:p-6 flex items-center justify-end gap-4 w-full transition-all duration-300">
      <div className="flex justify-end! items-center gap-4">

        <Button
          type="button"
          variant="ghost"
          onClick={() => router.push(ROUTES.PROMPT_TEMPLATES)}
          disabled={isDisabled}
          className="h-12 p-padding! bg-subcard text-sm rounded-lg border border-input-border-color font-black  text-subtitle-color transition-all"
        >
          {t('cancel')}
        </Button>

        <Button
          type="submit"
          disabled={isDisabled}
          className="h-12 px-8 bg-primary text-white dark:text-white font-bold transition-all"
        >
          {isDisabled ? (
            <>
              <span>{t('creating')}...</span>
            </>
          ) : (
            <>
              <span>{templateId ? t("save_changes") : t("create")}</span>
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
