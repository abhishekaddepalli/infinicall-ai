'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TemplateCardProps } from '@/types/waba'
import { Eye, Pencil, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export const TemplateCard = ({
  template,
  onPreview,
  onEdit,
  onDelete,
}: TemplateCardProps) => {
  const { t } = useTranslation()

  // Securely strip HTML tags from body text preview
  const stripHtml = (html: string) => {
    if (!html) return t('no_text_content')
    const stripped = html.replace(/<[^>]*>/g, '')
    return stripped.trim() || t('no_text_content')
  }

  const getStatusBadge = (status: string) => {
    const s = status?.toUpperCase()
    switch (s) {
      case 'APPROVED':
        return (
          <Badge className="bg-edit/10 text-edit border-edit/20 px-2 py-0.5 text-[9px] font-black rounded-lg uppercase tracking-wider shrink-0">
            {t('approved')}
          </Badge>
        )
      case 'PENDING':
        return (
          <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 px-2 py-0.5 text-[9px] font-black rounded-lg uppercase tracking-wider shrink-0">
            {t('pending')}
          </Badge>
        )
      case 'REJECTED':
        return (
          <Badge className="bg-destructive/10 text-destructive border-destructive/20 px-2 py-0.5 text-[9px] font-black rounded-lg uppercase tracking-wider shrink-0">
            {t('rejected')}
          </Badge>
        )
      default:
        return (
          <Badge className="bg-slate-500/10 text-slate-400 border-slate-500/20 px-2 py-0.5 text-[9px] font-black rounded-lg uppercase tracking-wider shrink-0">
            {s ? t(s.toLowerCase(), { defaultValue: s }) : t('draft')}
          </Badge>
        )
    }
  }

  const getCategoryBadge = (category: string) => {
    const cat = category?.toUpperCase() || ''
    if (cat === 'UTILITY') {
      return (
        <Badge variant="outline" className="bg-blue-50/50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-900/50 text-[9px] font-black uppercase tracking-wider rounded-lg px-2 py-0.5">
          {t('utility')}
        </Badge>
      )
    }
    if (cat === 'AUTHENTICATION') {
      return (
        <Badge variant="outline" className="bg-purple-50/50 dark:bg-purple-950/20 text-purple-600 dark:text-purple-400 border-purple-100 dark:border-purple-900/50 text-[9px] font-black uppercase tracking-wider rounded-lg px-2 py-0.5">
          {t('authentication')}
        </Badge>
      )
    }
    return (
      <Badge variant="outline" className="bg-sky-50/50 dark:bg-sky-950/20 text-sky-600 dark:text-sky-400 border-sky-100 dark:border-sky-900/50 text-[9px] font-black uppercase tracking-wider rounded-lg px-2 py-0.5">
        {t('marketing')}
      </Badge>
    )
  }

  return (
    <div className="group relative bg-bg-card border border-input-border-color rounded-radius sm:p-5 p-4 transition-all duration-300 flex flex-col justify-between min-h-47.5 overflow-hidden">

      {/* Top Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3 border-b border-input-border-color pb-2 shrink-0">
          <span
            className="text-md font-black text-title truncate max-w-[70%] capitalize"
            title={template.template_name}
          >
            {template.template_name}
          </span>
          {getStatusBadge(template.status)}
        </div>

        {/* Stripped Content Body Preview */}
        <p className="text-sm text-subtitle-color font-semibold leading-relaxed line-clamp-3 select-none">
          {stripHtml(template.message_body)}
        </p>
      </div>

      {/* Bottom info section */}
      <div className="flex items-center justify-between gap-3 pt-3 border-t border-input-border-color  mt-2 shrink-0">
        {getCategoryBadge(template.category)}
        <span className="text-xs text-subtitle-color font-bold leading-none">
          {template.language}
        </span>
      </div>

      {/* Hover action overlay */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-slate-50/80 dark:bg-zinc-950/80 z-20 flex items-center justify-center gap-3 backdrop-blur-xs rounded-2xl">
        <Button
          type="button"
          onClick={() => onPreview(template)}
          className="w-9 h-9 p-0! rounded-lg bg-primary/10 hover:bg-primary hover:text-white! text-primary  flex items-center justify-center transition-all shrink-0"
          title={t('preview_template')}
        >
          <Eye className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          onClick={() => onEdit(template)}
          className="h-9 w-9 rounded-lg bg-edit/10 text-edit hover:bg-edit hover:text-white transition-all shrink-0 p-0!"
          title={t('edit_template')}
        >
          <Pencil className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          onClick={() => onDelete(template._id)}
          className="h-9 w-9 p-0! rounded-lg bg-destructive/10 text-destructive hover:bg-destructive hover:text-white transition-all"
          title={t('delete_template')}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

    </div>
  )
}
