"use client"

import MultiSelectField from "@/components/shared/MultiSelectField"
import TextAreaField from "@/components/shared/TextAreaField"
import TextInput from "@/components/shared/TextInput"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BlogSectionFormProps } from "@/types/landing"
import { Field, FieldProps } from "formik"
import React from "react"
import { ROUTES } from "@/constants/routes"

export const BlogSectionForm: React.FC<BlogSectionFormProps> = ({ t, blogOptions }) => {
  return (
    <div className="animate-in fade-in duration-300">
      <CardHeader className="border-b border-input-border-color py-4 sm:px-6 px-4">
        <CardTitle className="sm:text-xl text-lg font-bold  text-title">
          {t("blog_section_configuration")}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-6">
        <TextInput
          name="blog.badge"
          label={t("section_badge")}
          placeholder="News & Insights"
        />
        <TextInput
          name="blog.title"
          label={t("section_title")}
          placeholder={t('insights_for_smarter_customer_engagement')}
        />
        <TextAreaField
          name="blog.description"
          label={t("section_description")}
          placeholder="A brief explanation details..."
          rows={3}
        />
        <Field name="blog.blog_ids">
          {({ field, form, meta }: FieldProps) => (
            <MultiSelectField
              label={t("linked_blog_articles")}
              options={blogOptions}
              value={field.value || []}
              onChange={(val) => form.setFieldValue('blog.blog_ids', val)}
              error={meta.touched && meta.error ? String(meta.error) : undefined}
              placeholder={t("choose_blogs_to_highlight")}
              emptyStateTitle={t('no_blogs_found', { defaultValue: 'No Blogs Found' })}
              emptyStateDescription={t('no_blogs_desc', { defaultValue: 'Please create a blog post before configuring this section.' })}
              emptyStateActionLabel={t('add_blog', { defaultValue: 'Add Blog Post' })}
              onEmptyStateAction={() => window.location.href = ROUTES.BLOGS}
            />
          )}
        </Field>
      </CardContent>
    </div>
  )
}
