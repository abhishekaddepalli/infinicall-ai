"use client"

import TextAreaField from "@/components/shared/TextAreaField"
import TextInput from "@/components/shared/TextInput"
import { Button } from "@/components/ui/button"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AutomateSectionFormProps } from "@/types/landing"
import { FieldArray } from "formik"
import { Plus, Trash } from "lucide-react"
import React from "react"

export const AutomateSectionForm: React.FC<AutomateSectionFormProps> = ({ t, values }) => {
  return (
    <div className="animate-in fade-in duration-300">
      <CardHeader className="border-b border-input-border-color py-4 sm:px-6 px-4">
        <CardTitle className="sm:text-xl text-lg font-bold  text-title">
          {t("automate_section_configuration")}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-6">
        <div className="space-y-6 border-b border-zinc-200 dark:border-white/10 pb-6">
          <h4 className="text-sm font-bold text-primary">{t("section_header")}</h4>
          <TextInput
            name="automate.heading"
            label={t('Heading')}
            placeholder={t('automate_customer_engagement_at_scale')}
          />
        </div>

        <div className="space-y-4">
          <FieldArray name="automate.cards">
            {({ push, remove }) => (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-title">{t("marquee_cards")}</h4>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-10 sm:h-11 p-padding! rounded-lg bg-primary text-white flex items-center gap-1.5 font-bold border-none"
                    onClick={() => push({
                      title: '',
                      description: '',
                      icon: 'Phone'
                    })}
                  >
                    <Plus className="w-4 h-4 text-white" />
                    {t("add_card")}
                  </Button>
                </div>
                {!values.automate?.cards || values.automate.cards.length === 0 ? (
                  <div className="text-center py-8 border border-dashed border-zinc-200 dark:border-white/10 rounded-2xl">
                    <p className="text-sm text-zinc-500 font-medium">{t("no_cards_added_yet")}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {values.automate.cards.map((_: any, index: number) => (
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
                            name={`automate.cards.${index}.title`}
                            label={t("card_title")}
                            placeholder={t('automated_outgoing_calls')}
                          />
                          <TextInput
                            name={`automate.cards.${index}.icon`}
                            label={t("icon_name")}
                            placeholder={t('phone')}
                          />
                        </div>
                        <TextAreaField
                          name={`automate.cards.${index}.description`}
                          label={t('Description')}
                          placeholder="Schedule and launch AI-powered..."
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
