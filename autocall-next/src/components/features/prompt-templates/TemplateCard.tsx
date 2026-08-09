'use client'

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { TemplateCardProps, TemplateCategory } from "@/types/prompt-template"
import { Copy, Edit2, Globe, Lock, Mic, Terminal, Trash2, User, Zap } from "lucide-react"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"

export const TemplateCard = ({ template, onEdit, onDelete }: TemplateCardProps) => {
  const { t } = useTranslation()
  const categoryName = template.category && typeof template.category === 'object'
    ? (template.category as TemplateCategory).name
    : (typeof template.category === 'string' ? template.category : t("general"))

  // Extract variables from system_prompt or welcome_message (regex for {{variable}})
  const extractVariables = (text: string) => {
    const regex = /{{(.*?)}}/g
    const matches = text.match(regex) || []
    return Array.from(new Set(matches.map(m => m.replace(/{{|}}/g, ""))))
  }

  const variables = Array.from(new Set([
    ...extractVariables(template.system_prompt),
    ...extractVariables(template.welcome_message || ""),
    ...extractVariables(template.goodbye_message || "")
  ]))

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success(t("copied_to_clipboard"))
  }

  return (
    <Card className="group flex flex-col h-full overflow-hidden rounded-radius bg-bg-card border border-input-border-color hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 rounded-2xl">
      <CardHeader className="p-5 pb-0 flex flex-row items-start justify-between space-y-0">
        <div className="space-y-1">
          <h3 className="font-bold text-lg text-slate-800 dark:text-white leading-tight group-hover:text-primary transition-colors">
            {template.name}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            {template.content}
          </p>
        </div>
        <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 border-none rounded-lg px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold">
          {categoryName}
        </Badge>
      </CardHeader>

      <CardContent className="p-5 flex-1 flex flex-col space-y-4">
        <div className="relative">
          <div className="absolute -top-2 -left-2 p-1.5 bg-slate-100 dark:bg-white/5 dark:border-white/10 rounded-lg text-slate-400">
            <Terminal className="w-3 h-3" />
          </div>
          <div className="p-4 pt-5 bg-slate-50 dark:bg-white/5 dark:border-white/10 rounded-xl border border-slate-100 dark:border-slate-700 min-h-[80px]">
            <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed italic">
              &quot;{template.system_prompt}&quot;
            </p>
          </div>
        </div>

        {variables.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <Zap className="w-3 h-3 text-amber-500" />
              {t("variables")}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {variables.slice(0, 3).map((v) => (
                <span key={v} className="text-[10px] bg-slate-100 dark:bg-white/5 dark:border-white/10 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-md font-mono border border-slate-200/50 dark:border-slate-700/50">
                  {`{{${v}}}`}
                </span>
              ))}
              {variables.length > 3 && (
                <span className="text-[10px] text-slate-400 font-medium pt-0.5">
                  +{variables.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 pt-1">
          {template.communication_style && (
            <div className="flex items-center gap-2 border border-input-border-color rounded-radius p-3">
              <Mic className="w-3.5 h-3.5 text-primary/70" />
              <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate font-medium">
                {template.communication_style}
              </span>
            </div>
          )}
          {template.behavior_style && (
            <div className="flex items-center gap-2 border border-input-border-color rounded-radius p-3">
              <User className="w-3.5 h-3.5 text-primary/70" />
              <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate font-medium">
                {template.behavior_style}
              </span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 bg-slate-50/30 dark:bg-white/5 dark:border-white/10 border-t border-slate-50 dark:border-slate-800/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {template.is_public ? (
            <div className="flex items-center gap-1.5 text-blue-500" title={t("public_template")}>
              <Globe className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-tight">{t("public")}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-slate-400" title={t("private_template")}>
              <Lock className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-tight">{t("private")}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {!template.is_system && (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(template)}
                className="h-8 w-8 rounded-lg bg-edit/10 text-edit hover:bg-edit hover:text-white transition-all"
              >
                <Edit2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(template.id || template._id || "")}
                className="h-8 w-8 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive hover:text-white transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => copyToClipboard(template.system_prompt)}
            className="h-8 w-8 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={t("copy_system_prompt")}
          >
            <Copy className="w-4 h-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
