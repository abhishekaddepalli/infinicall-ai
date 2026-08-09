"use client"

import TextAreaField from "@/components/shared/TextAreaField"
import TextInput from "@/components/shared/TextInput"
import { Button } from "@/components/ui/button"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { HowItWorksSectionFormProps } from "@/types/landing"
import { FieldArray } from "formik"
import { Plus, Trash } from "lucide-react"
import React from "react"

export const HowItWorksSectionForm: React.FC<HowItWorksSectionFormProps> = ({ t, values }) => {
  return (
    <div className="animate-in fade-in duration-300">
      <CardHeader className="border-b border-input-border-color py-4 sm:px-6 px-4">
        <CardTitle className="sm:text-xl text-lg font-bold  text-title">
          {t("how_it_works_configuration")}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-6">
        <div className="space-y-6 border-b border-zinc-200 dark:border-white/10 pb-6">
          <h4 className="text-sm font-bold text-primary">{t("section_header")}</h4>
          <TextInput
            name="how_it_works.heading"
            label={t('Heading')}
            placeholder={t('how_autocall_works')}
          />
          <TextAreaField
            name="how_it_works.subtitle"
            label={t('Subtitle')}
            placeholder="A seamless journey from setup to results..."
            rows={2}
          />
        </div>

        <div className="space-y-4">
          <FieldArray name="how_it_works.steps">
            {({ push, remove }) => (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-title">{t('Steps')}</h4>
                  <div className="flex items-center gap-2">
                    {(values.how_it_works?.steps?.length || 0) >= 3 && (
                      <span className="text-xs text-destructive font-medium">
                        {t("maximum_3_steps_allowed")}
                      </span>
                    )}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-10 sm:h-11 p-padding! rounded-lg bg-primary text-white flex items-center gap-1.5 font-bold disabled:opacity-50 disabled:cursor-not-allowed border-none"
                      disabled={(values.how_it_works?.steps?.length || 0) >= 3}
                      onClick={() => push({
                        number: (values.how_it_works?.steps?.length || 0) + 1,
                        title: '',
                        description: '',
                        icon: 'UserPlus'
                      })}
                    >
                      <Plus className="w-4 h-4 text-white" />
                      {t("add_step")}
                    </Button>
                  </div>
                </div>
                {!values.how_it_works?.steps || values.how_it_works.steps.length === 0 ? (
                  <div className="text-center py-8 border border-dashed border-zinc-200 dark:border-white/10 rounded-2xl">
                    <p className="text-sm text-zinc-500 font-medium">{t("no_steps_added_yet")}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {values.how_it_works.steps.map((_: any, index: number) => (
                      <div key={index} className="p-4 rounded-radius bg-subcard dark:bg-white/[0.02] border border-zinc-200 dark:border-white/10 relative group space-y-4">
                        <div className="flex justify-between items-center border-b border-zinc-200 dark:border-white/5 pb-2">
                          <span className="text-sm font-bold text-title">Step {index + 1}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            className="h-9! w-9! p-0! text-destructive bg-destructive/10 rounded-radius hover:bg-destructive hover:text-white"
                            onClick={() => remove(index)}
                          >
                            <Trash className="w-4.5 h-4.5" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                          <TextInput
                            name={`how_it_works.steps.${index}.number`}
                            label={t("step_number")}
                            placeholder="1"
                          />
                          <TextInput
                            name={`how_it_works.steps.${index}.title`}
                            label={t('Title')}
                            placeholder={t('create_your_ai_agent')}
                          />
                          <TextInput
                            name={`how_it_works.steps.${index}.icon`}
                            label={t("icon_name")}
                            placeholder={t('userplus')}
                          />
                        </div>
                        <TextAreaField
                          name={`how_it_works.steps.${index}.description`}
                          label={t('Description')}
                          placeholder="Configure agent's personality..."
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
