'use client'

import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { TuningParametersCardProps } from '@/types/agent'
import { useTranslation } from 'react-i18next'

export function TuningParametersCard({
  temperature,
  setTemperature,
  intelligenceLevel,
  setIntelligenceLevel,
}: TuningParametersCardProps) {
  const { t } = useTranslation()

  return (
    <div className="bg-bg-card p-4 sm:p-6 rounded-radius border border-input-border-color transition-all duration-300">
      <h2 className="sm:text-xl text-lg font-black flex items-center gap-2.5 mb-2">
        <span>{t("core_intelligence")} & {t("tuning_parameters")}</span>
      </h2>
      <p className="text-sm text-muted-foreground mb-6">{t("tuning_parameters_desc")}</p>

      <div className="space-y-6 bg-input-color sm:p-6 p-4 rounded-radius border border-input-border-color">
        {/* Heat / Temperature Slider */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-md font-semibold text-subtitle-color">{t("heat_level")}</Label>
            <span className="bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary/95 px-3 py-1 rounded-radius text-xs font-black">{temperature}</span>
          </div>
          <Slider value={[temperature]} onValueChange={(v) => setTemperature(v[0])} max={1} step={0.01} className="py-2" />
        </div>

        {/* Intelligence Level Slider */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-md font-semibold text-subtitle-color">{t("intelligence_level")}</Label>
            <span className="bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary/95 px-3 py-1 rounded-radius text-xs font-black">{intelligenceLevel}</span>
          </div>
          <Slider value={[intelligenceLevel]} onValueChange={(v) => setIntelligenceLevel(v[0])} max={10} min={0} step={1} className="py-2" />
        </div>
      </div>
    </div>
  )
}
