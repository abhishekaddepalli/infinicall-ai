"use client"

import TextAreaField from "@/components/shared/TextAreaField"
import TextInput from "@/components/shared/TextInput"
import { Button } from "@/components/ui/button"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { FooterSectionFormProps } from "@/types/landing"
import { FieldArray } from "formik"
import { Plus, Trash } from "lucide-react"
import React from "react"

export const FooterSectionForm: React.FC<FooterSectionFormProps> = ({ t, values }) => {
  return (
    <div className="animate-in fade-in duration-300">
      <CardHeader className="border-b border-input-border-color py-4 sm:px-6 px-4">
        <CardTitle className="sm:text-xl text-lg font-bold  text-title">
          {t("footer_section_configuration")}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-6">
        <TextAreaField
          name="footer.tagline"
          label={t("brand_tagline")}
          placeholder="Describe your brand brief overview statement..."
          rows={3}
        />
        <TextInput
          name="footer.copyright"
          label={t("copyright_statement")}
          placeholder="© 2026 Autocall AI. All Rights Reserved."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <TextInput
            name="footer.email"
            label={t("footer_email_address")}
            placeholder="support@autocall.ai"
          />
          <TextInput
            name="footer.phone"
            label={t("footer_phone_number")}
          />
          <TextInput
            name="footer.address"
            label={t("footer_physical_address")}
          />
        </div>

        <div className="space-y-6 pt-6 border-t border-zinc-200 dark:border-white/10">
          <FieldArray name="footer.social_links">
            {({ push, remove }) => (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-md font-medium text-title">
                    {t("social_media_links")}
                  </Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-10 sm:h-11 rounded-lg bg-primary text-white p-padding! flex items-center gap-1.5 font-bold border-none"
                    onClick={() => push({ name: '', href: '#', icon: '' })}
                  >
                    <Plus className="w-4 h-4 text-white" />
                    {t("add_link")}
                  </Button>
                </div>
                {!values.footer?.social_links || values.footer.social_links.length === 0 ? (
                  <div className="text-center py-8 border border-dashed border-zinc-200 dark:border-white/10 rounded-2xl">
                    <p className="text-sm text-zinc-500 font-medium">{t("no_social_links_added_yet")}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {values.footer.social_links.map((_: any, index: number) => (
                      <div key={index} className="flex gap-4 items-end p-4 rounded-radius bg-card-color border border-input-border-color dark:border-white/10 relative group">
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 flex-1">
                          <TextInput
                            name={`footer.social_links.${index}.name`}
                            label={t("platform_name")}
                            placeholder="e.g. Facebook, Twitter"
                          />
                          <TextInput
                            name={`footer.social_links.${index}.href`}
                            label={t("link_destination_url")}
                            placeholder="e.g. https://twitter.com/..."
                          />
                          <TextInput
                            name={`footer.social_links.${index}.icon`}
                            label={t("icon_identifier_key")}
                          />
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          className="h-9! w-9! p-0! text-destructive bg-destructive/10 rounded-radius hover:bg-destructive hover:text-white"
                          onClick={() => remove(index)}
                        >
                          <Trash className="w-5 h-5" />
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
