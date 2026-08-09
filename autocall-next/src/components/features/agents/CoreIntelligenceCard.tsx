'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textArea'
import { cn } from '@/lib/utils'
import { useGetAiModelsQuery } from '@/redux/api/aiModelApi'
import { CoreIntelligenceCardProps } from '@/types/agent'
import { User } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function CoreIntelligenceCard({
  name,
  setName,
  description,
  setDescription,
  language,
  setLanguage,
  llmModel,
  setLlmModel,
  type,
  voiceTone,
  setVoiceTone,
  personality,
  setPersonality,
  flowId,
  setFlowId,
  flowsData
}: CoreIntelligenceCardProps) {
  const { t } = useTranslation()
  const { data: modelsData, isLoading: isModelsLoading } = useGetAiModelsQuery()

  const activeModels = modelsData?.data?.filter((m) => m.status === 'active') || []

  return (
    <div className="relative bg-bg-card sm:p-6 p-4 rounded-radius border border-input-border-color transition-all duration-500">
      <h2 className="text-xl font-black flex items-center gap-2 mb-6">
        <span>{t('core_intelligence')}</span>
      </h2>

      <div className="space-y-6">
        {/* Agent Name */}
        <div className="space-y-3">
          <Label className="text-md font-medium text-title">
            {t('agent_name')}
          </Label>
          <div className="relative group">
            <Input
              placeholder={t('agent_name_placeholder')}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-10 pl-12 rounded-radius bg-input-color border-input-border-color font-bold focus:bg-input-color transition-all text-sm"
            />
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/30  transition-colors" />
          </div>
        </div>

        {/* Description */}
        <div className="space-y-3">
          <Label className="text-md font-medium text-title">
            {t('description')}
          </Label>
          <div className="relative group">
            <Textarea
              placeholder={t('agent_description_placeholder')}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="flex min-h-[80px] w-full rounded-radius bg-input-color border border-input-border-color px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
        </div>

        {/* Language & Model */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label className="text-md font-medium text-title">{t('language')}</Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="h-10 rounded-radius bg-input-color dark:bg-white/5 border-input-border-color dark:border-white/10 font-bold shadow-none">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-2xl shadow-2xl border-white/10">
                <SelectItem value="en" className="font-bold">{t('lang_english')}</SelectItem>
                <SelectItem value="es" className="font-bold">{t('lang_spanish')}</SelectItem>
                <SelectItem value="fr" className="font-bold">{t('lang_french')}</SelectItem>
                <SelectItem value="de" className="font-bold">{t('lang_german')}</SelectItem>
                <SelectItem value="hi" className="font-bold">{t('lang_hindi')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label className="text-md font-medium text-title">{t('ai_provider')}</Label>
            <Select value={llmModel} onValueChange={setLlmModel}>
              <SelectTrigger className="h-10 rounded-radius bg-input-color dark:bg-white/5 border-input-border-color dark:border-white/10 font-bold shadow-none">
                <SelectValue placeholder={t('select_model')} />
              </SelectTrigger>
              <SelectContent className="rounded-2xl shadow-2xl border-white/10 max-h-[250px]">
                {activeModels.map((model) => (
                  <SelectItem key={model.id || model._id} value={model._id || model.id} className="font-bold">
                    {model.display_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Dynamic Behavior Config Based on Type */}
        {type === 'incoming' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100 dark:border-white/5 animate-in fade-in slide-in-from-left-4 duration-300">
            <div className="space-y-3">
              <Label className="text-md font-medium text-title">{t('voice_tone')}</Label>
              <Select value={voiceTone} onValueChange={setVoiceTone}>
                <SelectTrigger className="h-10 rounded-radius bg-input-color dark:bg-white/5 border-input-border-color dark:border-white/10 font-bold shadow-none">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-2xl">
                  <SelectItem value="Professional" className="font-bold">{t('professional')}</SelectItem>
                  <SelectItem value="Friendly" className="font-bold">{t('friendly')}</SelectItem>
                  <SelectItem value="Serious" className="font-bold">{t('serious')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label className="text-md font-medium text-title">{t('personality')}</Label>
              <Select value={personality} onValueChange={setPersonality}>
                <SelectTrigger className="h-10 rounded-radius bg-input-color dark:bg-white/5 border-input-border-color dark:border-white/10 font-bold shadow-none">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-2xl">
                  <SelectItem value="Helpful" className="font-bold">{t('personality_helpful')}</SelectItem>
                  <SelectItem value="Analytical" className="font-bold">{t('personality_analytical')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        ) : (
          <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-white/5 animate-in fade-in slide-in-from-left-4 duration-300">
            <Label className="text-md font-medium text-title">{t('linked_flow')}</Label>
            <Select value={flowId} onValueChange={setFlowId}>
              <SelectTrigger className={cn("h-10 rounded-radius bg-input-color dark:bg-white/5 border-input-border-color dark:border-white/10 font-bold shadow-none", !flowId && "")}>
                <SelectValue placeholder={t('select_logic_flow')} />
              </SelectTrigger>
              <SelectContent className="rounded-2xl shadow-2xl max-h-[250px]">
                {flowsData?.data?.map((f: any) => (
                  <SelectItem key={f._id || f.id} value={f._id || f.id} className="font-bold py-2.5">
                    {f.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
    </div>
  )
}
