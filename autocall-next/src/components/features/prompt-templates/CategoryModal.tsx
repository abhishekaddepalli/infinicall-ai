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
import { CategoryModalProps } from "@/types/prompt-template"
import { templateCategorySchemas } from "@/utils/validation-schemas"
import { Form, Formik } from "formik"
import { useTranslation } from "react-i18next"

export const CategoryModal = ({
  isOpen,
  onClose,
  onSave,
  category,
  isLoading,
}: CategoryModalProps) => {
  const { t } = useTranslation()

  const initialValues = {
    name: category?.name || "",
    description: category?.description || "",
  }

  const handleSubmit = (values: { name: string; description: string }) => {
    onSave(values)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="sm:max-w-125! max-w-[calc(100%-2rem)] bg-bg-card border-none shadow-2xl gap-0 rounded-modal-radius p-0 overflow-hidden"
      >
        <DialogHeader className="sm:px-6 px-4 pt-6 pb-4 bg-bg-card text-left rtl:text-right border-b border-input-border-color">
          <DialogTitle className="text-xl font-bold text-slate-800 dark:text-white">
            {category ? t("edit_category") : t("create_category")}
          </DialogTitle>
        </DialogHeader>
        <Formik
          initialValues={initialValues}
          validationSchema={templateCategorySchemas.create(t)}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ isSubmitting }) => (
            <Form className="p-4 space-y-6">
              <TextInput
                name="name"
                label={t("category_name")}
                placeholder={t("enter_category_name")}
                className="h-11 rounded-lg border-input-border-color bg-slate-50/50 dark:bg-white/5 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />

              <TextAreaField
                name="description"
                label={t("description")}
                placeholder={t("enter_category_description")}
                className="min-h-30 rounded-lg border-input-border-color bg-slate-50/50 dark:bg-white/5 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
              />

              <div className="flex justify-end gap-3 pt-4 border-t border-input-border-color">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isLoading || isSubmitting}
                  className="h-12 p-padding! flex-1 rounded-lg bg-subcard border-input-border-color text-subtitle-color"
                >
                  {t("cancel")}
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading || isSubmitting}
                  className="h-12 flex-1  p-padding! text-white border-input-border-color rounded-lg bg-primary font-bold transition-all"
                >
                   {category ? t("save_changes") : t("create")}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  )
}

