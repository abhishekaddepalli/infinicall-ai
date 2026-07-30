"use client"

import MultiSelectField from "@/components/shared/MultiSelectField"
import TextAreaField from "@/components/shared/TextAreaField"
import TextInput from "@/components/shared/TextInput"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TestimonialsSectionFormProps } from "@/types/landing"
import { Field, FieldProps } from "formik"
import React from "react"
import { ROUTES } from "@/constants/routes"

export const TestimonialsSectionForm: React.FC<TestimonialsSectionFormProps> = ({ t, testimonialOptions }) => {
  return (
    <div className="animate-in fade-in duration-300">
      <CardHeader className="border-b border-input-border-color py-4 sm:px-6 px-4">
        <CardTitle className="sm:text-xl text-lg font-bold  text-title">
          {t("testimonials_configuration")}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-6">
        <TextInput
          name="testimonials.section_badge"
          label={t("section_badge")}
          placeholder={t('customer_stories')}
        />
        <TextInput
          name="testimonials.section_heading"
          label={t("section_heading_title")}
          placeholder={t('what_our_clients_say')}
        />
        <TextAreaField
          name="testimonials.section_subheading"
          label={t("section_subheading")}
          placeholder="Section description text..."
          rows={3}
        />
        <Field name="testimonials.testimonial_ids">
          {({ field, form, meta }: FieldProps) => (
            <MultiSelectField
              label={t("linked_testimonials")}
              options={testimonialOptions}
              value={field.value || []}
              onChange={(val) => form.setFieldValue('testimonials.testimonial_ids', val)}
              error={meta.touched && meta.error ? String(meta.error) : undefined}
              placeholder={t("choose_client_testimonials_to_feature")}
              emptyStateTitle={t('no_testimonials_found', { defaultValue: 'No Testimonials Found' })}
              emptyStateDescription={t('no_testimonials_desc', { defaultValue: 'Please create a testimonial before configuring this section.' })}
              emptyStateActionLabel={t('add_testimonial', { defaultValue: 'Add Testimonial' })}
              onEmptyStateAction={() => window.location.href = ROUTES.TESTIMONIALS}
            />
          )}
        </Field>
      </CardContent>
    </div>
  )
}
