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
import { Form, Formik } from "formik"
import { useTranslation } from "react-i18next"
import * as Yup from "yup"

export const SmsTemplateModal = ({
  isOpen,
  onClose,
  onSave,
  smsTemplate,
  isLoading,
}: any) => {
  const { t } = useTranslation()

  const initialValues = {
    name: smsTemplate?.name || "",
    description: smsTemplate?.description || "",
    content: smsTemplate?.content || "",
    status: smsTemplate?.status || "active",
  }

  const validationSchema = Yup.object().shape({
    name: Yup.string().required(t("name_required")),
    content: Yup.string().required(t("content_required")),
  })

  const handleSubmit = (values: any) => {
    onSave(values)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent onOpenAutoFocus={(e) => e.preventDefault()} className="sm:max-w-125! max-w-[calc(100%-2rem)] max-h-[90vh] no-scrollbar gap-0 bg-bg-card border-none shadow-2xl rounded-modal-radius p-0 overflow-auto">
        <DialogHeader className="sm:px-6 px-4 pt-6 pb-4 mb-0 bg-bg-card border-b border-input-border-color">
          <DialogTitle className="text-xl font-bold text-title text-left rtl:text-right">
            {smsTemplate ? t("edit_sms_template") : t("create_sms_template")}
          </DialogTitle>
        </DialogHeader>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ isSubmitting }) => (
            <Form className="p-4 space-y-6">
              <TextInput
                name="name"
                label={t("name")}
                placeholder={t("enter_name")}
                className="h-11 rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-white/5 dark:border-white/10 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />

              <TextAreaField
                name="description"
                label={t("description")}
                placeholder={t("enter_description")}
                className="min-h-[80px] rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-white/5 dark:border-white/10 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
              />

              <TextAreaField
                name="content"
                label={t("content")}
                placeholder={t("enter_content")}
                className="min-h-[120px] rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-white/5 dark:border-white/10 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
              />

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isLoading || isSubmitting}
                  className=" flex-1 p-padding! rounded-radius border border-input-border-color bg-subcard text-black dark:text-white text-md font-medium transition-all"
                >
                  {t("cancel")}
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading || isSubmitting}
                  className=" flex-1 rounded-xl bg-primary text-white font-bold  transition-all"
                >
                  {smsTemplate ? t("save_changes") : t("create")}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  )
}
