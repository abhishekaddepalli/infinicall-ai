"use client"

import MultiSelectField from "@/components/shared/MultiSelectField"
import TextAreaField from "@/components/shared/TextAreaField"
import TextInput from "@/components/shared/TextInput"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FaqSectionFormProps } from "@/types/landing"
import { Field, FieldProps } from "formik"
import React from "react"
import { ROUTES } from "@/constants/routes"

export const FaqSectionForm: React.FC<FaqSectionFormProps> = ({ t, faqOptions }) => {
  return (
    <div className="animate-in fade-in duration-300">
      <CardHeader className="border-b border-input-border-color py-4 sm:px-6 px-4">
        <CardTitle className="sm:text-xl text-lg font-bold  text-title">
          {t("faq_section_configuration")}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-6">
        <TextInput
          name="faq.section_badge"
          label={t("section_badge")}
          placeholder={t('questions_and_answers')}
        />
        <TextInput
          name="faq.section_heading"
          label={t("section_heading_title")}
          placeholder={t('frequently_asked_questions')}
        />
        <TextAreaField
          name="faq.section_subheading"
          label={t("section_subheading")}
          placeholder="A brief subheading description details..."
          rows={3}
        />
        <Field name="faq.faq_ids">
          {({ field, form, meta }: FieldProps) => (
            <MultiSelectField
              label={t("linked_faqs")}
              options={faqOptions}
              value={field.value || []}
              onChange={(val) => form.setFieldValue('faq.faq_ids', val)}
              error={meta.touched && meta.error ? String(meta.error) : undefined}
              placeholder={t("choose_faqs_to_render")}
              emptyStateTitle={t('no_faqs_found', { defaultValue: 'No FAQs Found' })}
              emptyStateDescription={t('no_faqs_desc', { defaultValue: 'Please create an FAQ before configuring this section.' })}
              emptyStateActionLabel={t('add_faq', { defaultValue: 'Add FAQ' })}
              onEmptyStateAction={() => window.location.href = ROUTES.FAQ}
            />
          )}
        </Field>
      </CardContent>
    </div>
  )
}
