"use client"

import TextAreaField from "@/components/shared/TextAreaField"
import TextInput from "@/components/shared/TextInput"
import { Button } from "@/components/ui/button"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { IntegrationsSectionFormProps } from "@/types/landing"
import { FieldArray } from "formik"
import { Plus, Trash } from "lucide-react"
import React from "react"

export const IntegrationsSectionForm: React.FC<IntegrationsSectionFormProps> = ({ t, values }) => {
  return (
    <div className="animate-in fade-in duration-300">
      <CardHeader className="border-b border-input-border-color py-4 sm:px-6 px-4">
        <CardTitle className="text-xl font-bold  text-title">
          {t("integrations_ecosystem")}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-6">
        <div className="space-y-6 border-b border-zinc-200 dark:border-white/10 pb-6">
          <h4 className="text-sm font-bold text-primary">{t("section_titles")}</h4>
          <TextInput
            name="secondary_integrations.badge"
            label={t("section_badge")}
            placeholder={t('native_ecosystem')}
          />
          <TextInput
            name="secondary_integrations.title"
            label={t("section_title")}
            placeholder="Integrations & Ecosystem"
          />
          <TextAreaField
            name="secondary_integrations.subtitle"
            label={t("section_subtitle")}
            placeholder="Connect your telephone lines, messaging platforms..."
            rows={3}
          />
        </div>

        <div className="space-y-6">
          <FieldArray name="secondary_integrations.cards">
            {({ push, remove }) => (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-primary ">{t("integration_items")}</h4>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="sm:h-12 h-10 p-padding! rounded-lg bg-primary text-white flex items-center gap-1.5 font-bold border-none"
                    onClick={() => push({ title: '', description: '', tags: '' })}
                  >
                    <Plus className="w-4 h-4 text-white" />
                    {t("add_ecosystem_card")}
                  </Button>
                </div>
                {!values.secondary_integrations?.cards || values.secondary_integrations.cards.length === 0 ? (
                  <div className="text-center py-8 border border-dashed border-zinc-200 dark:border-white/10 rounded-2xl">
                    <p className="text-sm text-zinc-500 font-medium">{t("no_items_added_yet")}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {values.secondary_integrations.cards.map((_: any, index: number) => (
                      <div key={index} className="sm:p-4 p-2 rounded-radius bg-card-color border border-input-border-color relative group space-y-4">
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
                            name={`secondary_integrations.cards.${index}.title`}
                            label={t('Title')}
                            placeholder={t('whatsapp_suite')}
                          />
                          <TextInput
                            name={`secondary_integrations.cards.${index}.tags`}
                            label={t("tags_comma_separated")}
                            placeholder="e.g. Meta API, Templates"
                          />
                        </div>
                        <TextAreaField
                          name={`secondary_integrations.cards.${index}.description`}
                          label={t('Description')}
                          placeholder="Ecosystem item details..."
                          rows={2}
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
