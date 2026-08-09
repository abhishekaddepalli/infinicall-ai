'use client'

import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { TelephonyProvider, TelephonyVoiceCardProps, VoiceProvider } from '@/types/agent'
import { X } from 'lucide-react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { TransferTeamSelector } from './TransferTeamSelector'

export function TelephonyVoiceCard({
  telephonyProvider,
  setTelephonyProvider,
  voiceProvider,
  setVoiceProvider,
  voiceId,
  setVoiceId,
  voicesData,
  idleTimeout,
  setIdleTimeout,
  maxCallDuration,
  setMaxCallDuration,
  enableCallTranscription,
  setEnableCallTranscription,
  enableCallRecording,
  setEnableCallRecording,
  transferEnabled,
  setTransferEnabled,
  transferKeywords,
  setTransferKeywords,
  teamId,
  setTeamId,
  memberId,
  setMemberId,
}: TelephonyVoiceCardProps) {
  const { t } = useTranslation()

  const handleKeywordAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      const val = e.currentTarget.value.trim()
      if (val && !transferKeywords.includes(val)) {
        setTransferKeywords([...transferKeywords, val])
        e.currentTarget.value = ''
      }
    }
  }

  const removeKeyword = (kw: string) => {
    setTransferKeywords(transferKeywords.filter((k) => k !== kw))
  }

  return (
    <div className="bg-bg-card p-4 sm:p-6 rounded-radius border border-input-border-color">
      <h2 className="text-title text-lg font-black flex items-center gap-2.5 mb-6">
        <span>{t('telephony_voice')}</span>
      </h2>

      <div className="space-y-6">
        {/* ── Providers ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label className="text-md font-medium text-title">{t('telephony_provider')}</Label>
            <Select value={telephonyProvider} onValueChange={(val) => setTelephonyProvider(val as TelephonyProvider)}>
              <SelectTrigger className="h-10 rounded-radius bg-input-color shadow-none border-input-border-color font-bold dark:bg-white/5 dark:border-white/10">
                <SelectValue placeholder={t('select_telephony_provider')} />
              </SelectTrigger>
              <SelectContent className="rounded-radius border-input-border-color">
                <SelectItem value={TelephonyProvider.TWILIO}>{t('twilio')}</SelectItem>
                <SelectItem value={TelephonyProvider.SIP}>{t('sip_trunk')}</SelectItem>
                <SelectItem value={TelephonyProvider.META_WHATSAPP}>{t('meta_whatsapp')}</SelectItem>
                <SelectItem value={TelephonyProvider.PLIVO}>{t('plivo', 'Plivo')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label className="text-md font-medium text-title">{t('voice_provider')}</Label>
            <Select value={voiceProvider} onValueChange={(val) => { setVoiceProvider(val as VoiceProvider); setVoiceId(''); }}>
              <SelectTrigger className="h-10 rounded-radius bg-input-color shadow-none border-input-border-color font-bold dark:bg-white/5 dark:border-white/10">
                <SelectValue placeholder={t('select_voice_provider')} />
              </SelectTrigger>
              <SelectContent className="rounded-radius border-input-border-color">
                <SelectItem value={VoiceProvider.ELEVENLABS}>{t('elevenlabs')}</SelectItem>
                <SelectItem value={VoiceProvider.DEEPGRAM}>{t('deepgram')}</SelectItem>
                <SelectItem value={VoiceProvider.SARVAM_AI}>{t('sarvam_ai')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* ── Voice ID Selection ── */}
        <div className="space-y-3 pt-6 border-t border-slate-100 dark:border-white/5">
          <Label className="text-md mb-2 font-medium text-title">{t('voice_id')}</Label>
          <Select value={voiceId} onValueChange={setVoiceId}>
            <SelectTrigger className="h-10 rounded-radius bg-input-color shadow-none border-input-border-color font-bold dark:bg-white/5 dark:border-white/10">
              <SelectValue placeholder={t('select_voice_agent')} />
            </SelectTrigger>
            <SelectContent className="rounded-radius border-input-border-color max-h-75 w-[var(--radix-select-trigger-width)]">
              {voicesData?.data?.filter((voice: any) => voice.provider === voiceProvider).map((voice: any) => (
                <SelectItem key={voice.voice_id} value={voice.voice_id} className="font-bold py-3">
                  <div className="flex flex-col gap-1 text-left overflow-hidden">
                    <span className="text-sm font-black truncate block w-full">{voice.name}</span>
                    <span className="text-[9px] text-muted-foreground/40 uppercase tracking-widest font-black truncate block w-full">
                      {voice.category?.toLowerCase() === 'premade' ? 'Predefined' : voice.category?.replace(/_/g, ' ')} • {voice.labels?.gender?.replace(/_/g, ' ')} • {voice.labels?.accent?.replace(/_/g, ' ')}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* ── Call Settings ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-100 dark:border-white/5">
          <div className="space-y-3">
            <Label className="text-md font-medium text-title">
              {t('idle_timeout')}
            </Label>
            <Input
              type="number"
              value={idleTimeout}
              onChange={(e) => setIdleTimeout(Number(e.target.value))}
              min={0}
              className="h-10 rounded-radius bg-input-color border-input-border-color font-bold focus:bg-input-color transition-all text-sm"
            />
          </div>
          <div className="space-y-3">
            <Label className="text-md font-medium text-title">
              {t('max_call_duration')}
            </Label>
            <Input
              type="number"
              value={maxCallDuration}
              onChange={(e) => setMaxCallDuration(Number(e.target.value))}
              min={1}
              className="h-10 rounded-radius bg-input-color border-input-border-color font-bold focus:bg-input-color transition-all text-sm"
            />
          </div>
        </div>

        {/* ── Toggles ── */}
        <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-white/5">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-md font-bold text-title">
                {t('enable_call_transcription')}
              </Label>
              <p className="text-[13px] text-muted-foreground">
                {t('enable_call_transcription_desc')}
              </p>
            </div>
            <Switch
              checked={enableCallTranscription}
              onCheckedChange={setEnableCallTranscription}
              className="data-[state=checked]:bg-primary shadow-sm"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-md font-bold text-title">
                {t('enable_call_recording')}
              </Label>
              <p className="text-[13px] text-muted-foreground">
                {t('enable_call_recording_desc')}
              </p>
            </div>
            <Switch
              checked={enableCallRecording}
              onCheckedChange={setEnableCallRecording}
              className="data-[state=checked]:bg-primary shadow-sm"
            />
          </div>
        </div>

        {/* ── Transfer to Human ── */}
        <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-white/5">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-md font-bold text-title">
                {t('transfer_to_human')}
              </Label>
              <p className="text-[13px] text-muted-foreground">
                {t('transfer_to_human_desc')}
              </p>
            </div>
            <Switch
              checked={transferEnabled}
              onCheckedChange={setTransferEnabled}
              className="data-[state=checked]:bg-primary shadow-sm"
            />
          </div>

          {transferEnabled && (
            <div className="space-y-6 bg-input-color p-4 rounded-radius border border-input-border-color mt-4 animate-in fade-in slide-in-from-top-2">
              <TransferTeamSelector
                teamId={teamId}
                setTeamId={setTeamId}
                memberId={memberId}
                setMemberId={setMemberId}
              />

              {/* Transfer Keywords */}
              <div className="space-y-3">
                <Label className="text-md font-medium text-title">
                  {t('transfer_keywords')}
                </Label>
                <Input
                  placeholder={t('transfer_keywords_placeholder')}
                  onKeyDown={handleKeywordAdd}
                  className="h-10 rounded-radius bg-input-color border-input-border-color font-bold focus:bg-input-color transition-all text-sm mb-2"
                />
                <div className="flex flex-wrap gap-2">
                  {transferKeywords.map((kw) => (
                    <Badge
                      key={kw}
                      variant="secondary"
                      className="px-2 py-1 flex items-center gap-1.5 text-xs font-bold rounded-lg bg-primary/10 text-primary max-w-full"
                    >
                      <span className="truncate max-w-[200px] block">{kw}</span>
                      <X
                        className="w-3 h-3 shrink-0 cursor-pointer transition-colors"
                        onClick={() => removeKeyword(kw)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
