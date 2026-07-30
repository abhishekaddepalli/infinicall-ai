'use client'

import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { VoiceAudioSettingsCardProps } from '@/types/agent'
import { useTranslation } from 'react-i18next'

export function VoiceAudioSettingsCard({
  responseDelay,
  setResponseDelay,
  speechSpeed,
  setSpeechSpeed,
  pitch,
  setPitch,
}: VoiceAudioSettingsCardProps) {
  const { t } = useTranslation()

  return (
    <div className="bg-bg-card p-4 sm:p-6 rounded-radius border border-input-border-color transition-all duration-300">
      <h2 className="sm:text-xl text-lg font-black flex items-center gap-2.5 mb-2">
        <span>{t("voice_audio_settings")}</span>
      </h2>
      <p className="text-sm text-muted-foreground mb-6">{t("voice_audio_settings_desc")}</p>

      <div className="space-y-6 bg-input-color sm:p-6 p-4 rounded-radius border border-input-border-color">
        {/* Latency Delay */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-md font-semibold text-subtitle-color">{t("latency_delay")}</Label>
            <span className="bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary/95 px-3 py-1 rounded-radius text-xs font-black">{responseDelay}s</span>
          </div>
          <Slider value={[responseDelay]} onValueChange={(v) => setResponseDelay(v[0])} max={5} step={0.1} className="py-2" />
        </div>

        {/* Speech Speed */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-md font-semibold text-subtitle-color">{t("speech_speed")}</Label>
            <span className="bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary/95 px-3 py-1 rounded-radius text-xs font-black">{speechSpeed}x</span>
          </div>
          <Slider value={[speechSpeed]} onValueChange={(v) => setSpeechSpeed(v[0])} min={0.5} max={2.0} step={0.1} className="py-2" />
        </div>

        {/* Pitch */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-md font-semibold text-subtitle-color">{t("pitch")}</Label>
            <span className="bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary/95 px-3 py-1 rounded-radius text-xs font-black">{pitch}</span>
          </div>
          <Slider value={[pitch]} onValueChange={(v) => setPitch(v[0])} min={-10} max={10} step={1} className="py-2" />
        </div>
      </div>
    </div>
  )
}
