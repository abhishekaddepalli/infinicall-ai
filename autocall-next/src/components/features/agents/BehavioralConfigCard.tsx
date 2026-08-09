'use client'

import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { BehavioralConfigCardProps } from '@/types/agent'
import { useTranslation } from 'react-i18next'

export function BehavioralConfigCard({
  empathyLevel,
  setEmpathyLevel,
  energyLevel,
  setEnergyLevel,
  accuracyPriority,
  setAccuracyPriority,
  responseLength,
  setResponseLength,
}: BehavioralConfigCardProps) {
  const { t } = useTranslation()

  return (
    <div className="bg-bg-card p-4 sm:p-6 rounded-radius border border-input-border-color transition-all duration-300">
      <h2 className="text-lg text-title font-black flex items-center gap-2.5 mb-6">
        <span>
          {t("behavioral_configuration")}
        </span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-input-color sm:p-6 p-4 rounded-radius border border-input-border-color">
        <div className="space-y-3">
          <Label className="text-md font-medium text-title">{t('empathy_level')}</Label>
          <Select value={empathyLevel} onValueChange={setEmpathyLevel}>
            <SelectTrigger className="h-10 rounded-radius bg-white dark:bg-zinc-900 border-input-border-color dark:border-white/10 font-bold shadow-none">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-2xl shadow-2xl border-white/10">
              <SelectItem value="low" className="font-bold">{t('low')}</SelectItem>
              <SelectItem value="medium" className="font-bold">{t('medium')}</SelectItem>
              <SelectItem value="high" className="font-bold">{t('high')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label className="text-md font-medium text-title">{t('energy_level')}</Label>
          <Select value={energyLevel} onValueChange={setEnergyLevel}>
            <SelectTrigger className="h-10 rounded-radius bg-white dark:bg-zinc-900 border-input-border-color dark:border-white/10 font-bold shadow-none">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-2xl shadow-2xl border-white/10">
              <SelectItem value="calm" className="font-bold">{t('calm')}</SelectItem>
              <SelectItem value="balanced" className="font-bold">{t('balanced')}</SelectItem>
              <SelectItem value="energetic" className="font-bold">{t('energetic')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label className="text-md font-medium text-title">{t('accuracy_priority')}</Label>
          <Select value={accuracyPriority} onValueChange={setAccuracyPriority}>
            <SelectTrigger className="h-10 rounded-radius bg-white dark:bg-zinc-900 border-input-border-color dark:border-white/10 font-bold shadow-none">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-2xl shadow-2xl border-white/10">
              <SelectItem value="balanced" className="font-bold">{t('balanced')}</SelectItem>
              <SelectItem value="high_accuracy" className="font-bold">{t('high_accuracy')}</SelectItem>
              <SelectItem value="low_latency" className="font-bold">{t('low_latency')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label className="text-md font-medium text-title">{t('response_length')}</Label>
          <Select value={responseLength} onValueChange={setResponseLength}>
            <SelectTrigger className="h-10 rounded-radius bg-white dark:bg-zinc-900 border-input-border-color dark:border-white/10 font-bold shadow-none">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-2xl shadow-2xl border-white/10">
              <SelectItem value="concise" className="font-bold">{t('concise')}</SelectItem>
              <SelectItem value="balanced" className="font-bold">{t('balanced')}</SelectItem>
              <SelectItem value="verbose" className="font-bold">{t('verbose')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
