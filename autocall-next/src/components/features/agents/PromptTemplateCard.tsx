'use client'

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { PromptTemplateCardProps } from '@/types/agent'
import { TemplateCategory } from "@/types/prompt-template"
import { ChevronDown, ChevronUp, Sparkles, Terminal, Zap } from "lucide-react"
import { useState } from 'react'
import { useTranslation } from "react-i18next"

export function PromptTemplateCard({ template, onApplyTemplate }: PromptTemplateCardProps) {
  const { t } = useTranslation()
  const [isExpanded, setIsExpanded] = useState(false)
  const [variableValues, setVariableValues] = useState<Record<string, string>>({})

  const categoryName = template.category && typeof template.category === 'object'
    ? (template.category as TemplateCategory).name
    : (typeof template.category === 'string' ? template.category : t("general"))

  // Extract variables dynamically from system_prompt or welcome_message (regex for {{variable}})
  const extractVariables = (text: string) => {
    const regex = /{{(.*?)}}/g
    const matches = text.match(regex) || []
    return Array.from(new Set(matches.map(m => m.replace(/{{|}}/g, "").trim())))
  }

  const variables = Array.from(new Set([
    ...extractVariables(template.system_prompt),
    ...extractVariables(template.welcome_message || ""),
    ...extractVariables(template.goodbye_message || "")
  ]))

  const handleInputChange = (variable: string, val: string) => {
    setVariableValues(prev => ({
      ...prev,
      [variable]: val
    }))
  }

  const handleApply = () => {
    let updatedSystemPrompt = template.system_prompt
    let updatedWelcomeMessage = template.welcome_message || ""
    let updatedGoodbyeMessage = template.goodbye_message || ""

    variables.forEach(v => {
      const userValue = variableValues[v] || ""
      const regex = new RegExp(`{{${v}}}`, 'g')
      updatedSystemPrompt = updatedSystemPrompt.replace(regex, userValue)
      updatedWelcomeMessage = updatedWelcomeMessage.replace(regex, userValue)
      updatedGoodbyeMessage = updatedGoodbyeMessage.replace(regex, userValue)
    })

    onApplyTemplate(updatedSystemPrompt, updatedWelcomeMessage, updatedGoodbyeMessage)
    setIsExpanded(false)
  }

  return (
    <Card className="group flex flex-col overflow-hidden border border-input-border-color bg-subcard transition-all duration-300 rounded-radius">
      <CardHeader className="sm:p-6 p-4 pb-0 flex flex-col sm:flex-row items-start justify-between space-y-2 sm:space-y-0 gap-3 sm:gap-4">
        <div className="space-y-1 flex-1">
          <h3 className="font-black text-lg text-slate-800 dark:text-white leading-tight group-hover:text-primary transition-colors">
            {template.name}
          </h3>
          <p className="text-xs text-muted-foreground font-semibold leading-relaxed line-clamp-2">
            {template.content}
          </p>
        </div>
        <Badge variant="secondary" className="bg-primary/10 text-primary border-none rounded-lg px-2.5 py-1 text-[9px] uppercase tracking-wider font-bold shrink-0 self-start sm:self-auto">
          {categoryName}
        </Badge>
      </CardHeader>

      <CardContent className="sm:p-6 p-4 flex-1 flex flex-col space-y-5">
        {/* Prompt Preview Panel */}
        <div className="bg-input-color rounded-radius border border-input-border-color overflow-hidden flex flex-col">
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-input-border-color bg-bg-body">
            <Terminal className="w-3.5 h-3.5 text-muted-foreground/60" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground/60 font-black">
              {t('system_prompt')}
            </span>
          </div>
          <div className="sm:p-5 p-4 min-h-22.5">
            <p className="text-xs text-subtitle-color line-clamp-3 leading-relaxed font-mono">
              &quot;{template.system_prompt}&quot;
            </p>
          </div>
        </div>

        {/* Variables Preview Badges */}
        {variables.length > 0 && (
          <div className="space-y-2">
            <p className="text-[10px] font-black text-muted-foreground/50 uppercase tracking-widest flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              {t("variables")}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {variables.map((v) => (
                <span key={v} className="text-[10px] bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-zinc-400 px-2.5 py-1 rounded-lg font-mono border border-slate-200/50 dark:border-slate-800/50 font-black">
                  {`{{${v}}}`}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Use / Expandable Section */}
        {isExpanded && variables.length > 0 && (
          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-white/5 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="space-y-3">
              <p className="text-sm font-black text-primary">
                {t('configure_variables_values')}
              </p>

              {variables.map((v) => (
                <div key={v} className="space-y-1.5">
                  <Label className="text-md font-black uppercase tracking-wider text-muted-foreground/60 ml-0.5">
                    {v}
                  </Label>
                  <Input
                    placeholder={`Enter value for ${v}`}
                    value={variableValues[v] || ''}
                    onChange={(e) => handleInputChange(v, e.target.value)}
                    className="h-10 rounded-radius bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 font-bold focus:bg-white dark:focus:bg-zinc-900 transition-all text-xs"
                  />
                </div>
              ))}
            </div>

            <Button
              onClick={handleApply}
              className="w-full h-11 p-padding! rounded-radius bg-primary hover:bg-primary/90 text-white font-black text-sm transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-white" />
              <span>{t('apply_template')}</span>
            </Button>
          </div>
        )}
      </CardContent>

      <CardFooter className="p-4 bg-subcard border-t border-input-border-color dark:border-white/5 flex items-center justify-end">
        <Button
          onClick={() => {
            if (variables.length === 0) {
              handleApply()
            } else {
              setIsExpanded(!isExpanded)
            }
          }}
          variant="ghost"
          className={cn(
            "h-10 p-padding rounded-radius font-black  text-sm flex items-center gap-1.5 transition-all",
            isExpanded && variables.length > 0
              ? "text-destructive  hover:bg-destructive bg-destructive/20 hover:text-white"
              : "text-primary bg-primary/10 hover:bg-primary hover:text-white"
          )}
        >
          {variables.length === 0 ? (
            <>
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t('apply_template')}</span>
            </>
          ) : (
            <>
              <span>{isExpanded ? t('cancel') : t('use_template')}</span>
              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
