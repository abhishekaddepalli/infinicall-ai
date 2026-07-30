'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
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
import { cn } from '@/lib/utils'
import { TelephonyProvider, TelephonyVoiceCardProps } from '@/types/agent'
import { Check, X } from 'lucide-react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { TransferTeamSelector } from './TransferTeamSelector'

export function TelephonyVoiceCard({
  telephonyProvider,
  setTelephonyProvider,
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
        {/* ── Telephony Provider ── */}
        <div>
          <Label className="text-md mb-2 font-medium text-title block">
            {t('telephony_provider')}
          </Label>

          <div className="grid grid-cols-1 gap-4">
            {/* Option 1: Sarvam AI + Plivo (Recommended for India) */}
            <Button
              type="button"
              onClick={() => setTelephonyProvider(TelephonyProvider.SARVAM_PLIVO)}
              className={cn(
                'flex items-center h-12.5 py-8! justify-between p-5 rounded-[1.25rem] border text-left transition-all duration-300 relative group overflow-hidden',
                telephonyProvider === TelephonyProvider.SARVAM_PLIVO
                  ? 'border-primary bg-primary/3 shadow-md scale-[1.01]'
                  : 'border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-white/1 hover:border-slate-300 dark:hover:border-white/10',
              )}
            >
              <div className="space-y-1">
                <span className="block font-black text-md tracking-tight mb-0">Sarvam AI + Plivo Telephony (Telugu & Indian Voice)</span>
                <span className="block text-sm text-subtitle-color font-medium">Native Indian Regional Voices (Meera, Pavithra, Arvind) via Plivo Telephony</span>
              </div>
              <div
                className={cn(
                  'w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all',
                  telephonyProvider === TelephonyProvider.SARVAM_PLIVO
                    ? 'border-primary bg-primary text-black'
                    : 'border-slate-300 dark:border-white/10',
                )}
              >
                {telephonyProvider === TelephonyProvider.SARVAM_PLIVO && (
                  <Check className="text-white stroke-[3]" />
                )}
              </div>
            </Button>

            {/* Option 2: Sarvam AI + Twilio */}
            <Button
              type="button"
              onClick={() => setTelephonyProvider(TelephonyProvider.SARVAM_TWILIO)}
              className={cn(
                'flex items-center h-12.5 py-8! justify-between p-5 rounded-[1.25rem] border text-left transition-all duration-300 relative group overflow-hidden',
                telephonyProvider === TelephonyProvider.SARVAM_TWILIO
                  ? 'border-primary bg-primary/3 shadow-md scale-[1.01]'
                  : 'border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-white/1 hover:border-slate-300 dark:hover:border-white/10',
              )}
            >
              <div className="space-y-1">
                <span className="block font-black text-md tracking-tight mb-0">Sarvam AI + Twilio Telephony</span>
                <span className="block text-sm text-subtitle-color font-medium">Native Indian Voices via Twilio Voice Streams</span>
              </div>
              <div
                className={cn(
                  'w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all',
                  telephonyProvider === TelephonyProvider.SARVAM_TWILIO
                    ? 'border-primary bg-primary text-black'
                    : 'border-slate-300 dark:border-white/10',
                )}
              >
                {telephonyProvider === TelephonyProvider.SARVAM_TWILIO && (
                  <Check className="text-white stroke-[3]" />
                )}
              </div>
            </Button>

            {/* Option 3: ElevenLabs + Plivo */}
            <Button
              type="button"
              onClick={() => setTelephonyProvider(TelephonyProvider.ELEVENLABS_PLIVO)}
              className={cn(
                'flex items-center h-12.5 py-8! justify-between p-5 rounded-[1.25rem] border text-left transition-all duration-300 relative group overflow-hidden',
                telephonyProvider === TelephonyProvider.ELEVENLABS_PLIVO
                  ? 'border-primary bg-primary/3 shadow-md scale-[1.01]'
                  : 'border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-white/1 hover:border-slate-300 dark:hover:border-white/10',
              )}
            >
              <div className="space-y-1">
                <span className="block font-black text-md tracking-tight mb-0">ElevenLabs + Plivo Telephony</span>
                <span className="block text-sm text-subtitle-color font-medium">ElevenLabs Conversational AI via Plivo Carrier Network</span>
              </div>
              <div
                className={cn(
                  'w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all',
                  telephonyProvider === TelephonyProvider.ELEVENLABS_PLIVO
                    ? 'border-primary bg-primary text-black'
                    : 'border-slate-300 dark:border-white/10',
                )}
              >
                {telephonyProvider === TelephonyProvider.ELEVENLABS_PLIVO && (
                  <Check className="text-white stroke-[3]" />
                )}
              </div>
            </Button>

            {/* Option 4: ElevenLabs + Twilio */}
            <Button
              type="button"
              onClick={() => setTelephonyProvider(TelephonyProvider.ELEVENLABS_TWILIO)}
              className={cn(
                'flex items-center h-12.5 py-8! justify-between p-5 rounded-[1.25rem] border text-left transition-all duration-300 relative group overflow-hidden',
                telephonyProvider === TelephonyProvider.ELEVENLABS_TWILIO
                  ? 'border-primary bg-primary/3 shadow-md scale-[1.01]'
                  : 'border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-white/1 hover:border-slate-300 dark:hover:border-white/10',
              )}
            >
              <div className="space-y-1">
                <span className="block font-black text-md tracking-tight mb-0">{t('telephony_elevenlabs_label', 'ElevenLabs + Twilio Telephony')}</span>
                <span className="block text-sm text-subtitle-color font-medium">{t('telephony_elevenlabs_badge', 'Standard ElevenLabs Voice Agent via Twilio')}</span>
              </div>
              <div
                className={cn(
                  'w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all',
                  telephonyProvider === TelephonyProvider.ELEVENLABS_TWILIO
                    ? 'border-primary bg-primary text-black'
                    : 'border-slate-300 dark:border-white/10',
                )}
              >
                {telephonyProvider === TelephonyProvider.ELEVENLABS_TWILIO && (
                  <Check className="text-white stroke-[3]" />
                )}
              </div>
            </Button>

            {/* Option 5: Elevenlabs SIP */}
            <Button
              type="button"
              onClick={() => setTelephonyProvider(TelephonyProvider.ELEVENLABS_SIP)}
              className={cn(
                'flex items-center h-12.5 py-8! justify-between p-5 rounded-[1.25rem] border text-left transition-all duration-300 relative group overflow-hidden',
                telephonyProvider === TelephonyProvider.ELEVENLABS_SIP
                  ? 'border-primary bg-primary/3 shadow-md scale-[1.01]'
                  : 'border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-white/1 hover:border-slate-300 dark:hover:border-white/10',
              )}
            >
              <div className="space-y-1">
                <span className="block font-black text-md tracking-tight mb-0">{t('telephony_elevenlabs_sip_label', 'ElevenLabs SIP Trunking')}</span>
                <span className="block text-sm text-subtitle-color font-medium">{t('telephony_elevenlabs_sip_badge', 'Direct SIP trunking for custom PBX')}</span>
              </div>
              <div
                className={cn(
                  'w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all',
                  telephonyProvider === TelephonyProvider.ELEVENLABS_SIP
                    ? 'border-primary bg-primary text-black'
                    : 'border-slate-300 dark:border-white/10',
                )}
              >
                {telephonyProvider === TelephonyProvider.ELEVENLABS_SIP && (
                  <Check className="text-white stroke-[3]" />
                )}
              </div>
            </Button>

            {/* Option 6: Meta WhatsApp */}
            <Button
              type="button"
              onClick={() => setTelephonyProvider(TelephonyProvider.META_WHATSAPP)}
              className={cn(
                'flex items-center h-12.5 py-8! justify-between p-5 rounded-[1.25rem] border text-left transition-all duration-300 relative group overflow-hidden',
                telephonyProvider === TelephonyProvider.META_WHATSAPP
                  ? 'border-primary bg-primary/3 shadow-md scale-[1.01]'
                  : 'border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-white/1 hover:border-slate-300 dark:hover:border-white/10',
              )}
            >
              <div className="space-y-1">
                <span className="block font-black text-md tracking-tight mb-0">{t('telephony_meta_whatsapp_label', 'Meta WhatsApp Calling')}</span>
                <span className="block text-sm text-subtitle-color font-medium">{t('telephony_meta_whatsapp_badge', 'WhatsApp Voice Automation')}</span>
              </div>
              <div
                className={cn(
                  'w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all',
                  telephonyProvider === TelephonyProvider.META_WHATSAPP
                    ? 'border-primary bg-primary text-black'
                    : 'border-slate-300 dark:border-white/10',
                )}
              >
                {telephonyProvider === TelephonyProvider.META_WHATSAPP && (
                  <Check className="text-white stroke-[3]" />
                )}
              </div>
            </Button>
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
              {voicesData?.data?.map((voice: any) => (
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
