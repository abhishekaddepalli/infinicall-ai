"use client"

import { ImageDropzone } from "@/components/shared/ImageDropzone"
import TextAreaField from "@/components/shared/TextAreaField"
import TextInput from "@/components/shared/TextInput"
import { Button } from "@/components/ui/button"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useUploadImageMutation } from "@/redux/api/uploadApi"
import { PrimaryFeaturesSectionFormProps } from "@/types/landing"
import { FieldArray, useFormikContext } from "formik"
import { Plus, Trash } from "lucide-react"
import React from "react"

export const PrimaryFeaturesSectionForm: React.FC<PrimaryFeaturesSectionFormProps> = ({ t, values }) => {
  const [uploadImage] = useUploadImageMutation()
  const { setFieldValue } = useFormikContext<any>()

  const handleFile = async (file: File, fieldName: string) => {
    const formData = new FormData()
    formData.append('image', file)
    try {
      const result = await uploadImage(formData).unwrap()
      if (result.imagePath) {
        setFieldValue(fieldName, result.imagePath)
      }
    } catch (err) {
      console.error('Image upload error:', err)
    }
  }
  return (
    <div className="animate-in fade-in duration-300">
      <CardHeader className="border-b border-input-border-color py-4 sm:px-6 px-4">
        <CardTitle className="sm:text-xl text-lg font-bold  text-title">
          {t("primary_features_configuration")}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-6">
        <div className="space-y-6 border-b border-zinc-200 dark:border-white/10 pb-6">
          <h4 className="text-sm font-bold text-primary">{t("section_titles")}</h4>
          <TextInput
            name="primary_features.badge"
            label={t("section_badge")}
            placeholder={t('platform_core')}
          />
          <TextInput
            name="primary_features.title"
            label={t("section_title")}
            placeholder={t('turn_conversations_into_customers')}
          />
          <TextAreaField
            name="primary_features.subtitle"
            label={t("section_subtitle")}
            placeholder="Transform customer communication with intelligent voice agents, automated workflows, and seamless business integrations."
            rows={3}
          />
        </div>

        <div className="space-y-6 border-b border-zinc-200 dark:border-white/10 pb-6">
          <h4 className="text-sm font-bold text-title">{t("left_featured_card")}</h4>
          <TextInput
            name="primary_features.left_card.title"
            label={t("featured_card_title")}
            placeholder={t('human_like_voice_conversations')}
          />
          <TextAreaField
            name="primary_features.left_card.description"
            label={t("featured_card_description")}
            placeholder="Our voice engine responds in under 500ms..."
            rows={3}
          />
          <TextInput
            name="primary_features.left_card.image"
            label={t("featured_card_image_url")}
            placeholder="/uploads/landing-page/subsecond-voice.png"
          />
          <ImageDropzone
            label={t("upload_featured_card_image")}
            name="leftCardImageFile"
            onUpload={(file) => handleFile(file, 'primary_features.left_card.image')}
            value={values?.primary_features?.left_card?.image}
            onRemove={() => setFieldValue('primary_features.left_card.image', '')}
          />
        </div>

        <div className="space-y-6">
          <FieldArray name="primary_features.cards">
            {({ push, remove }) => (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-title">{t("grid_cards")}</h4>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-10 sm:h-11 p-padding! rounded-lg bg-primary text-white flex items-center gap-1.5 font-bold border-none"
                    onClick={() => push({ key: '', title: '', description: '' })}
                  >
                    <Plus className="w-4 h-4 text-white" />
                    {t("add_card")}
                  </Button>
                </div>
                {!values.primary_features?.cards || values.primary_features.cards.length === 0 ? (
                  <div className="text-center py-8 border border-dashed border-zinc-200 dark:border-white/10 rounded-2xl">
                    <p className="text-sm text-zinc-500 font-medium">{t("no_cards_added_yet")}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {values.primary_features.cards.map((_: any, index: number) => (
                      <div key={index} className="p-4 rounded-radius bg-subcard dark:bg-white/[0.02] border border-zinc-200 dark:border-white/10 relative group space-y-4">
                        <div className="flex justify-between items-center border-b border-zinc-200 dark:border-white/5 pb-2">
                          <span className="text-sm font-bold text-title">Card {index + 1}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            className="h-9! w-9! p-0! text-destructive bg-destructive/10 rounded-radius hover:bg-destructive hover:text-white"
                            onClick={() => remove(index)}
                          >
                            <Trash className="w-4.5 h-4.5" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <TextInput
                            name={`primary_features.cards.${index}.key`}
                            label={t("icon_identifier_key")}
                            placeholder="e.g. builder"
                          />
                          <TextInput
                            name={`primary_features.cards.${index}.title`}
                            label={t("card_title")}
                            placeholder={t('visual_workflow_automation')}
                          />
                        </div>
                        <TextAreaField
                          name={`primary_features.cards.${index}.description`}
                          label={t("card_description")}
                          placeholder="Description details..."
                          rows={2}
                        />
                        <TextInput
                          name={`primary_features.cards.${index}.image`}
                          label={t("card_image_url")}
                          placeholder="/uploads/landing-page/workflow.png"
                        />
                        <ImageDropzone
                          label={t("upload_card_image")}
                          name={`cardImageFile${index}`}
                          onUpload={(file) => handleFile(file, `primary_features.cards.${index}.image`)}
                          value={values?.primary_features?.cards?.[index]?.image}
                          onRemove={() => setFieldValue(`primary_features.cards.${index}.image`, '')}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </FieldArray>
        </div>
      </CardContent>
    </div>
  )
}
