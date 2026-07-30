import { DataViewCard } from '@/components/reusable/data-view/DataViewCard'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PromptTemplateItemProps, TemplateCategory } from "@/types/prompt-template"
import { Copy, Edit2, Globe, Lock, Mic, ScrollText, Terminal, Trash2, User, Zap } from "lucide-react"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"

export function PromptTemplateItem({
  template,
  viewMode,
  isLastItem,
  onEdit,
  onDelete
}: PromptTemplateItemProps) {
  const { t } = useTranslation()
  const id = template.id || template._id

  const categoryName = template.category && typeof template.category === 'object'
    ? (template.category as TemplateCategory).name
    : (typeof template.category === 'string' ? template.category : t("general"))

  const extractVariables = (text: string) => {
    const regex = /{{(.*?)}}/g
    const matches = text.match(regex) || []
    return Array.from(new Set(matches.map(m => m.replace(/{{|}}/g, ""))))
  }

  const variables = Array.from(new Set([
    ...extractVariables(template.system_prompt || ""),
    ...extractVariables(template.welcome_message || ""),
    ...extractVariables(template.goodbye_message || "")
  ]))

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success(t("copied_to_clipboard"))
  }

  const icon = (
    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
      <ScrollText className="w-5 h-5 text-primary" />
    </div>
  )

  const tags = (
    <div className="flex items-center gap-2">
      <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 border-none rounded-lg px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold">
        {categoryName}
      </Badge>
      {viewMode === 'list' && (
        template.is_public ? (
          <div className="flex items-center gap-1 text-blue-500 bg-blue-500/10 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase" title={t("public_template")}>
            <Globe className="w-3 h-3" />
            <span>{t("public")}</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 text-subtitle-color bg-subcard px-1.5 py-0.5 rounded text-[10px] font-bold uppercase" title={t("private_template")}>
            <Lock className="w-3 h-3" />
            <span>{t("private")}</span>
          </div>
        )
      )}
    </div>
  )

  const listContent = (
    <div className="flex-1 flex flex-row items-center gap-6 px-6 min-w-0">
      {/* Center Left: Prompt & Variables */}
      <div className="flex-1 flex flex-col gap-1.5 min-w-0">
        <div className="text-sm text-subtitle-color leading-relaxed pr-4 break-all line-clamp-2 whitespace-normal max-w-[515px] font-medium">
          &quot;{template.system_prompt}&quot;
        </div>
        {variables.length > 0 && (
          <div className="flex flex-wrap gap-1 items-center">
            <Zap className="w-3 h-3 text-amber-500 mr-0.5" />
            {variables.slice(0, 4).map((v) => (
              <span key={v} className="text-[10px] bg-subcard text-subtitle-color px-1.5 py-0.5 rounded font-mono border border-input-border-color">
                {`{{${v}}}`}
              </span>
            ))}
            {variables.length > 4 && (
              <span className="text-[10px] text-slate-400 font-medium ml-1">
                +{variables.length - 4}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Center Right: Styles */}
      <div className="flex flex-col gap-2 shrink-0 w-[140px] border-l border-input-border-color pl-6 rtl:pl-0 rtl:pr-6 rtl:bordeer-l-0 rtl:border-r">
        {template.communication_style && (
          <div className="flex items-center gap-1.5 text-subtitle-color" title={t('communication_style')}>
            <Mic className="w-4 h-4 text-primary/70 shrink-0" />
            <span className="text-md truncate font-medium">{template.communication_style}</span>
          </div>
        )}
        {template.behavior_style && (
          <div className="flex items-center gap-1.5 text-subtitle-color" title={t('behavior_style')}>
            <User className="w-4 h-4 text-primary/70 shrink-0" />
            <span className="text-md truncate font-medium">{template.behavior_style}</span>
          </div>
        )}
      </div>
    </div>
  )

  const gridContent = (
    <div className="flex flex-col space-y-4">
      <div className="relative">
        <div className="absolute -top-2 -left-2 p-1.5 bg-slate-100 dark:bg-white/5 dark:border-white/10 rounded-lg text-slate-400">
          <Terminal className="w-3 h-3" />
        </div>
        <div className="p-4 pt-5 bg-slate-50 dark:bg-white/5 dark:border-white/10 rounded-xl border border-slate-100 dark:border-slate-700 min-h-[80px]">
          <p className="text-sm text-title line-clamp-3 leading-relaxed italic">
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
            <Mic className="w-4 h-4 text-primary" />
            <span className="text-md text-title truncate font-medium">
              {template.communication_style}
            </span>
          </div>
        )}
        {template.behavior_style && (
          <div className="flex items-center gap-2 border border-input-border-color rounded-radius p-3">
            <User className="w-4 h-4 text-primary" />
            <span className="text-md text-title truncate font-medium">
              {template.behavior_style}
            </span>
          </div>
        )}
      </div>
    </div>
  )

  const actions = (
    <div className="flex items-center gap-1">
      <>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onEdit(template)}
          className="h-9 w-9 rounded-lg bg-edit/10 text-edit hover:bg-edit hover:text-white transition-all"
          disabled={template?.is_system}
        >
          <Edit2 className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(id)}
          disabled={template?.is_system}
          className="h-9 w-9 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive hover:text-white transition-all"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => copyToClipboard(template.system_prompt || "")}
        className="h-9 w-9 rounded-lg bg-primary/10 text-primary hover:text-white hover:bg-primary transition-colors"
        title={t("copy_system_prompt")}
      >
        <Copy className="w-4 h-4" />
      </Button>
    </div>
  )

  const headerRight = viewMode === 'grid' ? (
    template.is_public ? (
      <div className="flex items-center gap-1.5 text-blue-500" title={t("public_template")}>
        <Globe className="w-3.5 h-3.5" />
        <span className="text-[10px] font-bold uppercase tracking-tight">{t("public")}</span>
      </div>
    ) : (
      <div className="flex items-center gap-1.5 text-slate-400" title={t("private_template")}>
        <Lock className="w-3.5 h-3.5" />
        <span className="text-[10px] font-bold uppercase tracking-tight">{t("private")}</span>
      </div>
    )
  ) : undefined

  return (
    <DataViewCard
      viewMode={viewMode}
      isLastItem={isLastItem}
      icon={icon}
      title={template.name}
      description={viewMode === 'grid' ? template.content : undefined}
      tags={tags}
      listContent={listContent}
      gridContent={gridContent}
      headerRight={headerRight}
      updatedAt={template.updated_at || template.created_at}
      actions={actions}
      gridHeightClass="min-h-[350px]"
    />
  )
}
