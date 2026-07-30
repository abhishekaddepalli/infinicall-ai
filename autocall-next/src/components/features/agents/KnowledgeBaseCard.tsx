'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textArea'
import { ROUTES } from '@/constants/routes'
import { KnowledgeBaseCardProps } from '@/types/agent'
import { BookOpen, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'

export function KnowledgeBaseCard({
  knowledgeBase,
  toggleKb,
  kbData,
  customKnowledgeBase,
  setCustomKnowledgeBase
}: KnowledgeBaseCardProps) {
  const { t } = useTranslation()
  const router = useRouter()

  return (
    <div className="bg-bg-card p-4 sm:p-6 rounded-radius border border-input-border-color">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-black flex items-center gap-2.5">
          <span>{t('knowledge_base_integration')}</span>
        </h2>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <Label className="text-md font-medium text-title">
            {t('add_knowledge_sources')}
          </Label>

          <Select onValueChange={toggleKb}>
            <SelectTrigger className="h-10 rounded-radius bg-input-color  border-input-border-color dark:border-white/10 shadow-none font-bold">
              <SelectValue placeholder={t('add_knowledge_sources')} />
            </SelectTrigger>
            <SelectContent className="rounded-radius bg-bg-card">
              {!kbData?.data || kbData.data.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-6 px-4 text-center">
                  <h4 className="text-md font-bold text-title mb-1">{t('no_kb_found', { defaultValue: 'No Knowledge Base Found' })}</h4>
                  <p className="text-sm text-subtitle-color mb-4 leading-relaxed max-w-[200px]">{t('no_kb_desc', { defaultValue: 'Please create a knowledge base before creating this record.' })}</p>
                  <Button 
                    type="button" 
                    size="sm" 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      router.push(ROUTES.KNOWLEDGE_BASE);
                    }} 
                    className="bg-primary text-white rounded-lg h-9 w-full font-bold"
                  >
                    {t('add_knowledge_base', { defaultValue: 'Add Knowledge Base' })}
                  </Button>
                </div>
              ) : (
                kbData.data.map((kb: any) => (
                  <SelectItem key={kb._id || kb.id} value={kb._id || kb.id} className="font-bold py-2.5">
                    {kb.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Tag Badges wrapper */}
        <div className="p-4 rounded-radius bg-input-color border border-input-border-color min-h-22.5 flex flex-wrap gap-2.5 items-center">
          {knowledgeBase.length === 0 ? (
            <span className="text-sm font-medium text-title/70 flex items-center justify-center ">
              {t('no_sources_linked')}
            </span>
          ) : (
            knowledgeBase.map(id => {
              const kb = kbData?.data?.find((k: any) => (k._id || k.id) === id)
              return (
                <Badge
                  key={id}
                  variant="secondary"
                  className="bg-primary/10 hover:bg-primary/15 text-primary border border-primary/20 pl-3.5 pr-2.5 py-2 rounded-radius gap-2 font-black text-[10px] uppercase tracking-tight transition-colors shadow-sm"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{kb?.name || (typeof id === 'string' ? id.slice(-6) : 'Source')}</span>
                  <X
                    className="w-3.5 h-3.5 cursor-pointer hover:text-rose-500 transition-colors ml-1"
                    onClick={(e) => { e.stopPropagation(); toggleKb(id); }}
                  />
                </Badge>
              )
            })
          )}
        </div>

        <div className="space-y-3 pt-6 animate-in fade-in slide-in-from-top-2">
          <Label className="text-md font-medium text-title">
            {t('custom_knowledge_base')}
          </Label>
          <Textarea
            placeholder={t('custom_knowledge_base_placeholder')}
            value={customKnowledgeBase}
            onChange={(e) => setCustomKnowledgeBase(e.target.value)}
            className="flex min-h-[120px] w-full rounded-radius bg-input-color border border-input-border-color px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
      </div>
    </div>
  )
}
