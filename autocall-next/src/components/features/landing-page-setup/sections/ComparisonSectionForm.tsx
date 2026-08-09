"use client"

import { ImageDropzone } from "@/components/shared/ImageDropzone"
import TextInput from "@/components/shared/TextInput"
import { Button } from "@/components/ui/button"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useUploadImageMutation } from "@/redux/api/uploadApi"
import { ComparisonSectionFormProps } from "@/types/landing"
import { FieldArray, useFormikContext } from "formik"
import { Plus, Trash } from "lucide-react"
import React from "react"

export const ComparisonSectionForm: React.FC<ComparisonSectionFormProps> = ({ t, values }) => {
  const [uploadImage] = useUploadImageMutation()
  const { setFieldValue } = useFormikContext<any>()

  const handleFile = async (file: File) => {
    const formData = new FormData()
    formData.append('image', file)
    try {
      const result = await uploadImage(formData).unwrap()
      if (result.imagePath) {
        setFieldValue('comparison.robotImage', result.imagePath)
      }
    } catch (err) {
      console.error('Image upload error:', err)
    }
  }
  return (
    <div className="animate-in fade-in duration-300">
      <CardHeader className="border-b border-input-border-color py-4 sm:px-6 px-4">
        <CardTitle className="sm:text-xl text-lg font-bold  text-title">
          {t("comparison_section_configuration")}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-6">
        <div className="space-y-6 border-b border-zinc-200 dark:border-white/10 pb-6">
          <h4 className="text-sm font-bold text-primary">{t("section_header")}</h4>
          <TextInput
            name="comparison.heading"
            label={t('Heading')}
            placeholder={t('turn_every_call_into_an_opportunity_with_ai')}
          />
          <TextInput
            name="comparison.robotImage"
            label={t("robot_image_url")}
            placeholder="/uploads/landing-page/robot1.png"
          />
          <ImageDropzone
            label={t("upload_robot_image")}
            name="robotImageFile"
            onUpload={handleFile}
            value={values?.comparison?.robotImage}
            onRemove={() => setFieldValue('comparison.robotImage', '')}
          />
        </div>

        {/* Features List */}
        <div className="space-y-4 border-b border-zinc-200 dark:border-white/10 pb-6">
          <FieldArray name="comparison.features">
            {({ push, remove }) => (
              <div className="space-y-4">
                <div className="flex items-center flex-wrap gap-3 justify-between">
                  <h4 className="text-sm font-bold text-title">{t("feature_highlights")}</h4>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-10 sm:h-11 p-padding! rounded-lg bg-primary text-white flex items-center gap-1.5 font-bold border-none"
                    onClick={() => push('')}
                  >
                    <Plus className="w-4 h-4 text-white" />
                    {t("add_feature")}
                  </Button>
                </div>
                {!values.comparison?.features || values.comparison.features.length === 0 ? (
                  <div className="text-center py-8 border border-dashed border-zinc-200 dark:border-white/10 rounded-2xl">
                    <p className="text-sm text-zinc-500 font-medium">{t("no_features_added_yet")}</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {values.comparison.features.map((_: any, index: number) => (
                      <div key={index} className="flex items-center gap-3">
                        <TextInput
                          name={`comparison.features.${index}`}
                          label=""
                          placeholder="e.g. Available 24/7 without breaks"
                          formGroupClass="flex-1"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          className="h-9! w-9! p-0! text-destructive bg-destructive/10 rounded-radius hover:bg-destructive hover:text-white"
                          onClick={() => remove(index)}
                        >
                          <Trash className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </FieldArray>
        </div>

        {/* Traditional List */}
        <div className="space-y-4 border-b border-zinc-200 dark:border-white/10 pb-6">
          <FieldArray name="comparison.traditional">
            {({ push, remove }) => (
              <div className="space-y-4">
                <div className="flex items-center flex-wrap gap-3 justify-between">
                  <h4 className="text-sm font-bold text-title">{t("traditional_call_center_items")}</h4>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-10 sm:h-11 p-padding! rounded-lg bg-primary text-white flex items-center gap-1.5 font-bold border-none"
                    onClick={() => push('')}
                  >
                    <Plus className="w-4 h-4 text-white" />
                    {t("add_item")}
                  </Button>
                </div>
                {!values.comparison?.traditional || values.comparison.traditional.length === 0 ? (
                  <div className="text-center py-8 border border-dashed border-zinc-200 dark:border-white/10 rounded-2xl">
                    <p className="text-sm text-zinc-500 font-medium">{t("no_items_added_yet")}</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {values.comparison.traditional.map((_: any, index: number) => (
                      <div key={index} className="flex items-center gap-3">
                        <TextInput
                          name={`comparison.traditional.${index}`}
                          label=""
                          placeholder="e.g. High operational costs"
                          formGroupClass="flex-1"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          className="h-9! w-9! p-0! text-destructive bg-destructive/10 rounded-radius hover:bg-destructive hover:text-white"
                          onClick={() => remove(index)}
                        >
                          <Trash className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </FieldArray>
        </div>

        {/* AI Agents List */}
        <div className="space-y-4">
          <FieldArray name="comparison.aiAgents">
            {({ push, remove }) => (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-title">{t("ai_voice_agent_items")}</h4>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-10 sm:h-11 p-padding! rounded-lg bg-primary text-white flex items-center gap-1.5 font-bold border-none"
                    onClick={() => push('')}
                  >
                    <Plus className="w-4 h-4 text-white" />
                    {t("add_item")}
                  </Button>
                </div>
                {!values.comparison?.aiAgents || values.comparison.aiAgents.length === 0 ? (
                  <div className="text-center py-8 border border-dashed border-zinc-200 dark:border-white/10 rounded-2xl">
                    <p className="text-sm text-zinc-500 font-medium">{t("no_items_added_yet")}</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {values.comparison.aiAgents.map((_: any, index: number) => (
                      <div key={index} className="flex items-center gap-3">
                        <TextInput
                          name={`comparison.aiAgents.${index}`}
                          label=""
                          placeholder="e.g. Lower cost per interaction"
                          formGroupClass="flex-1"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          className="h-9! w-9! p-0! text-destructive bg-destructive/10 rounded-radius hover:bg-destructive hover:text-white"
                          onClick={() => remove(index)}
                        >
                          <Trash className="w-4 h-4" />
                        </Button>
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
