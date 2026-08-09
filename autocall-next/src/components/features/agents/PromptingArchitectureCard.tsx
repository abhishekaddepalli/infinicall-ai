'use client'

import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textArea'
import { PromptingArchitectureCardProps } from '@/types/agent'
import { useTranslation } from 'react-i18next'

export function PromptingArchitectureCard({
  systemPrompt,
  setSystemPrompt,
  firstMessage,
  setFirstMessage,
  goodbyeMessage,
  setGoodbyeMessage
}: PromptingArchitectureCardProps) {
  const { t } = useTranslation()

  return (
    <div className="bg-bg-card p-4 sm:p-6 rounded-radius border border-input-border-color">
      <div className="flex items-center gap-3 mb-8 border-b border-slate-100 dark:border-white/5 pb-4">
        <div>
          <h2 className="text-xl font-black text-title flex items-center gap-1.5">
            <span>{t('instructions_architecture')}</span>
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {/* Core System Prompt */}
        <div className="flex flex-col h-full">
          <Label className="text-md font-medium text-title mb-3">
            {t('system_instruction')}
          </Label>
          <Textarea
            placeholder={t('system_prompt_placeholder')}
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            className="flex-1 min-h-[200px] rounded-radius bg-input-color border-input-border-color font-bold sm:p-6 p-4 text-sm leading-relaxed focus:bg-input-color transition-all resize-none"
          />
        </div>

        {/* Initial Contact Message */}
        <div className="flex flex-col h-full">
          <Label className="text-md font-medium text-title mb-3">
            {t('welcome_message')}
          </Label>
          <Textarea
            placeholder={t('first_message_placeholder')}
            value={firstMessage}
            onChange={(e) => setFirstMessage(e.target.value)}
            className="flex-1 min-h-[200px] rounded-radius bg-input-color border-input-border-color font-bold sm:p-6 p-4 text-sm leading-relaxed focus:bg-input-color transition-all resize-none"
          />
        </div>

        {/* Goodbye Message */}
        <div className="flex flex-col h-full">
          <Label className="text-md font-medium text-title mb-3 block">
            {t('goodbye_message')}
          </Label>
          <Textarea
            placeholder={t('goodbye_message_placeholder')}
            value={goodbyeMessage}
            onChange={(e) => setGoodbyeMessage(e.target.value)}
            className="flex-1 min-h-[200px] rounded-radius bg-input-color border-input-border-color font-bold sm:p-6 p-4 text-sm leading-relaxed focus:bg-input-color transition-all resize-none"
          />
        </div>
      </div>
    </div>
  )
}
