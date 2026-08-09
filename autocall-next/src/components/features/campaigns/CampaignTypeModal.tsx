'use client'

import TextAreaField from "@/components/shared/TextAreaField"
import TextInput from "@/components/shared/TextInput"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { CampaignTypeModalProps } from "@/types/campaign"
import { campaignTypeSchemas } from "@/utils/validation-schemas"
import { Form, Formik } from "formik"
import { useTranslation } from "react-i18next"

export const CampaignTypeModal = ({
  isOpen,
  onClose,
  onSave,
  campaignType,
  isLoading,
}: CampaignTypeModalProps) => {
  const { t } = useTranslation()

  const initialValues = {
    name: campaignType?.name || "",
    description: campaignType?.description || "",
  }

  const handleSubmit = async (
    values: { name: string; description: string },
    { resetForm }: { resetForm: () => void }
  ) => {
    await onSave(values)
    resetForm()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent onOpenAutoFocus={(e) => e.preventDefault()} className="sm:max-w-[500px]! max-w-[calc(100%-2rem)] bg-bg-card gap-0! shadow-2xl rounded-modal-radius border-none p-0 overflow-hidden">
        <DialogHeader className="sm:px-6 px-4 pt-6 pb-4 bg-bg-card  border-b border-input-border-color">
          <DialogTitle className="text-xl  text-left rtl:text-right font-bold text-slate-800 dark:text-white">
            {campaignType ? t("edit_campaign_type") : t("create_campaign_type")}
          </DialogTitle>
        </DialogHeader>
        <Formik
          initialValues={initialValues}
          validationSchema={campaignTypeSchemas.create(t)}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ isSubmitting }) => (
            <Form className="p-4 space-y-6">
              <TextInput
                name="name"
                label={t("campaign_type_name")}
                placeholder={t("enter_campaign_type_name")}
                className="h-11 rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-white/5 dark:border-white/10 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />

              <TextAreaField
                name="description"
                label={t("description")}
                placeholder={t("enter_campaign_type_description")}
                className="min-h-[120px] rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-white/5 dark:border-white/10 focus:ring focus:ring-primary/20 focus:border-primary transition-all resize-none"
              />

              <div className="flex justify-end gap-3 pt-4 border-t border-input-border-color">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isLoading || isSubmitting}
                  className="h-11  flex-1 p-padding! rounded-lg bg-subcard border-input-border-color text-subtitle-color"
                >
                  {t("cancel")}
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading || isSubmitting}
                  className="h-11 flex-1 p-padding! rounded-lg bg-primary text-white font-bold transition-all"
                >
                  {campaignType ? t("save_changes") : t("create")}

                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  )
}
