"use client"

import TextAreaField from "@/components/shared/TextAreaField"
import TextInput from "@/components/shared/TextInput"
import { Button } from "@/components/ui/button"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ImageDropzone } from "@/components/shared/ImageDropzone"
import { useUploadImageMutation } from "@/redux/api/uploadApi"
import { FieldArray, useFormikContext } from "formik"
import { Plus, Trash } from "lucide-react"
import React from "react"

export const AddonsSectionForm: React.FC<{ t: any; values: any }> = ({ t, values }) => {
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
        <CardTitle className="sm:text-xl text-lg font-bold text-title">
          {t("add_ons_section_configuration")}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-6">
        <div className="space-y-6 border-b border-zinc-200 dark:border-white/10 pb-6">
          <h4 className="text-sm font-bold text-primary">{t("section_header")}</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput
              name="addons.badge"
              label={t('Badge')}
              placeholder={t('add_ons')}
            />
            <TextInput
              name="addons.title"
              label={t('Title')}
              placeholder={t('powerful_add_ons_for_your_business')}
            />
          </div>
          <TextAreaField
            name="addons.subtitle"
            label={t('Subtitle')}
            placeholder="Extend your platform capabilities..."
            rows={2}
          />
        </div>

        <div className="space-y-4">
          <FieldArray name="addons.cards">
            {({ push, remove }) => (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-title">{t("add_on_cards")}</h4>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-10 sm:h-11 p-padding! rounded-lg bg-primary text-white flex items-center gap-1.5 font-bold border-none"
                    onClick={() => push({
                      title: '',
                      description: '',
                      image: '',
                      badges: ''
                    })}
                  >
                    <Plus className="w-4 h-4 text-white" />
                    {t("add_card")}
                  </Button>
                </div>
                {!values.addons?.cards || values.addons.cards.length === 0 ? (
                  <div className="text-center py-8 border border-dashed border-zinc-200 dark:border-white/10 rounded-2xl">
                    <p className="text-sm text-zinc-500 font-medium">{t("no_cards_added_yet")}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {values.addons.cards.map((_: any, index: number) => (
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
                        <div className="grid grid-cols-1 gap-4">
                          <TextInput
                            name={`addons.cards.${index}.title`}
                            label={t("card_title")}
                            placeholder={t('sms_management')}
                          />
                        </div>
                        <TextAreaField
                          name={`addons.cards.${index}.description`}
                          label={t("card_description")}
                          placeholder="Send automated SMS..."
                          rows={2}
                        />
                        <TextInput
                          name={`addons.cards.${index}.badges`}
                          label={t("card_badges_comma_separated")}
                          placeholder="Role-Based Access, Admin Overview"
                        />
                        <TextInput
                          name={`addons.cards.${index}.image`}
                          label={t("card_image_url")}
                          placeholder="/uploads/landing-page/addon.png"
                        />
                        <ImageDropzone
                          label={t("upload_card_image")}
                          name={`addonImageFile${index}`}
                          onUpload={(file) => handleFile(file, `addons.cards.${index}.image`)}
                          value={values?.addons?.cards?.[index]?.image}
                          onRemove={() => setFieldValue(`addons.cards.${index}.image`, '')}
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
