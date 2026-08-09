"use client"

import MultiSelectField from "@/components/shared/MultiSelectField"
import TextAreaField from "@/components/shared/TextAreaField"
import TextInput from "@/components/shared/TextInput"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PricingSectionFormProps } from "@/types/landing"
import { Field, FieldProps } from "formik"
import React from "react"
import { ROUTES } from "@/constants/routes"

export const PricingSectionForm: React.FC<PricingSectionFormProps> = ({ t, planOptions }) => {
  return (
    <div className="animate-in fade-in duration-300">
      <CardHeader className="border-b border-input-border-color py-4 sm:px-6 px-4">
        <CardTitle className="sm:text-xl text-lg font-bold  text-title">
          {t("pricing_section_configuration")}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-6">
        <TextInput
          name="pricing.badge"
          label={t("section_badge")}
          placeholder={t('pricing_plans')}
        />
        <TextInput
          name="pricing.title"
          label={t("section_title")}
          placeholder={t('choose_the_right_plan')}
        />
        <TextAreaField
          name="pricing.description"
          label={t("section_description")}
          placeholder="A brief explanation details..."
          rows={3}
        />
        <Field name="pricing.plan_ids">
          {({ field, form, meta }: FieldProps) => (
            <MultiSelectField
              label={t("linked_plans")}
              options={planOptions}
              value={field.value || []}
              onChange={(val) => form.setFieldValue('pricing.plan_ids', val)}
              error={meta.touched && meta.error ? String(meta.error) : undefined}
              placeholder={t("choose_active_plans_to_feature_on_landing_page")}
              emptyStateTitle={t('no_plans_found', { defaultValue: 'No Plans Found' })}
              emptyStateDescription={t('no_plans_desc', { defaultValue: 'Please create a plan before configuring this section.' })}
              emptyStateActionLabel={t('add_plan', { defaultValue: 'Add Plan' })}
              onEmptyStateAction={() => window.location.href = ROUTES.PLANS}
            />
          )}
        </Field>
      </CardContent>
    </div>
  )
}
