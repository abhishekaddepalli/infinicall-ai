'use client'

import TextAreaField from "@/components/shared/TextAreaField"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { SmsCampaignContentSectionProps } from "@/types/sms-campaign"
import { useFormikContext } from "formik"
import { LayoutTemplate, MessageSquareText } from "lucide-react"
import { useState } from "react"
import { useTranslation } from "react-i18next"

export const SmsCampaignContentSection = ({ smsTemplatesOptions }: SmsCampaignContentSectionProps) => {
  const { t } = useTranslation()
  const { values, setFieldValue } = useFormikContext<any>()
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3 items-center justify-between border-b border-input-border-color pb-4">
        <h2 className="text-xl font-bold text-title flex items-center gap-2.5 dark:text-white">
          <MessageSquareText className="w-5 h-5 text-primary" />
          <span>{t("sms_content")}</span>
        </h2>

        {smsTemplatesOptions && smsTemplatesOptions.length > 0 && (
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="h-11 bg-primary text-white p-padding! gap-2 font-bold rounded-lg border-none">
                <LayoutTemplate className="w-4 h-4" />
                {t("select_template")}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-3xl max-w-[calc(100%-2rem)] max-h-[85vh] no-scrollbar gap-0! flex flex-col p-0 overflow-auto border-none">
              <DialogHeader className="sm:px-6 px-4 py-4 border-b mb-0 border-input-border-color shrink-0 bg-bg-card">
                <DialogTitle className="flex sm:text-2xl text-lg items-center gap-2">
                  {t("choose_sms_template")}
                </DialogTitle>
              </DialogHeader>

              <div className="flex-1 overflow-y-auto sm:p-6 p-4 no-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {smsTemplatesOptions.map((template) => (
                    <div
                      key={template.value}
                      onClick={() => {
                        setFieldValue("smsTemplateId", template.value)
                        setFieldValue("content", template.content)
                        setIsModalOpen(false)
                      }}
                      className={`cursor-pointer rounded-lg sm:p-5 p-4 border transition-all duration-300 ${values.smsTemplateId === template.value
                        ? "border-primary bg-primary/5 dark:bg-primary/10 shadow-sm ring-1 ring-primary/20 scale-[1.02]"
                        : "border-input-border-color hover:border-primary/40 bg-subcard"
                        }`}
                    >
                      <div className="flex flex-col gap-3 h-full">
                        <h4 className="text-md font-extrabold text-title break-all whitespace-normal line-clamp-1">
                          {template.label}
                        </h4>
                        {template.content && (
                          <div className="bg-input-color p-3 rounded-lg border border-slate-100 dark:border-white/5 mt-auto">
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 line-clamp-4 break-all whitespace-normal overflow-hidden">
                              {template.content}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="space-y-2">
        <TextAreaField
          name="content"
          label={t("message_content")}
          placeholder={t("enter_sms_content")}
          className="min-h-[160px] rounded-2xl bg-input-color border-input-border-color font-bold focus:bg-white dark:focus:bg-zinc-900 transition-all text-sm resize-none"
        />
        <div className="flex justify-end">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            {t("characters")}: {values.content?.length || 0}
          </span>
        </div>
      </div>
    </div>
  )
}
