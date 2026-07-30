'use client'

import { Button } from '@/components/ui/button'
import { WidgetPreviewProps } from '@/types/dashboard'
import { HeartHandshake, Mic, MicOff, Phone, PhoneOff, RefreshCw } from 'lucide-react'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

export function WidgetPreview({ widgetData }: WidgetPreviewProps) {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [callState, setCallState] = useState<'idle' | 'connecting' | 'connected' | 'ended'>('idle')
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (callState === 'connected') {
      interval = setInterval(() => {
        setSeconds((s) => s + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [callState])

  const formatTime = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60)
    const s = totalSeconds % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  const branding = widgetData.branding || {
    brand_name: 'Your Company',
    button_label: 'VOICE CHAT',
    primary_color: '#015482',
    require_terms: false,
    terms_content: 'Please accept our terms and conditions before continuing.',
    icon_url: null,
  }

  const primaryColor = branding.primary_color || '#015482'
  const brandName = branding.brand_name || t('your_company')
  const buttonLabel = branding.button_label || t('voice_chat')
  const requireTerms = branding.require_terms || false
  const termsContent = branding.terms_content || 'Please accept our terms and conditions before continuing.'

  const handleStartCall = () => {
    setCallState('connecting')
    setSeconds(0)
    setTimeout(() => {
      setCallState('connected')
    }, 1500)
  }

  const handleEndCall = () => {
    setCallState('ended')
    setTimeout(() => {
      setCallState('idle')
      setIsOpen(false)
      setTermsAccepted(false)
    }, 2000)
  }

  return (
    <div className="relative self-end z-20 flex flex-col items-end max-w-full">
      {/* Widget Chat/Voice Window Popup */}
      {isOpen && (
        <div className="w-[280px] max-w-[calc(100vw-3rem)] sm:max-w-none h-[360px] bg-bg-card rounded-lg shadow-[0_10px_30px_rgba(0,0,0,0.15)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.5)] border border-slate-100 dark:border-slate-800 flex flex-col overflow-hidden mb-3 animate-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div
            style={{ backgroundColor: primaryColor }}
            className="px-4 py-3 flex items-center justify-between text-white"
          >
            <div className="flex items-center gap-2.5">
              {branding.icon_url ? (
                <Image src={branding.icon_url} width={24} height={24} alt="Logo" className="w-7 h-7 rounded-full object-cover bg-white" />
              ) : (
                <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center font-bold text-xs">
                  {brandName.charAt(0)}
                </div>
              )}
              <span className="font-black text-md">{brandName}</span>
            </div>
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setIsOpen(false)
                handleEndCall()
                setTermsAccepted(false)
              }}
              className="p-1! rounded-lg transition-colors text-white hover:bg-white/20 hover:text-white h-auto w-auto"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </Button>
          </div>

          {/* Body */}
          <div className="flex-1 flex flex-col p-4 bg-bg-card overflow-y-auto">
            {requireTerms && !termsAccepted ? (
              /* Terms screen */
              <div className="flex-1 flex flex-col justify-between py-2 text-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500">
                    <HeartHandshake className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200">
                    {t('accept_terms_to_continue')}
                  </h4>
                  <p className="text-[10px] text-slate-500 max-h-[140px] overflow-y-auto bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-2.5 rounded-lg text-left leading-relaxed">
                    {termsContent}
                  </p>
                </div>
                <Button
                  type="button"
                  onClick={() => setTermsAccepted(true)}
                  style={{ backgroundColor: primaryColor }}
                  className="w-full text-white text-xs h-9 rounded-xl hover:opacity-90 font-bold transition-all shadow-none mt-2"
                >
                  {t('accept_and_proceed')}
                </Button>
              </div>
            ) : (
              /* Voice  screen */
              <div className="flex-1 flex flex-col items-center justify-between py-2">
                {callState === 'idle' && (
                  <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center mt-6">
                    <div className="w-16 h-16 rounded-lg bg-subcard flex items-center justify-center text-slate-400 border border-input-border-color">
                      <MicOff className="w-8 h-8" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-bold text-md text-title">
                        {t('ready_to_talk')}
                      </p>
                      <p className="text-sm text-subtitle-color max-w-[200px] leading-normal">
                        {t('connect_to_speak')}
                      </p>
                    </div>
                  </div>
                )}

                {callState === 'connecting' && (
                  <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center mt-6">
                    <div className="relative flex items-center justify-center">
                      <div className="absolute w-16 h-16 rounded-full border-2 border-dashed animate-spin" style={{ borderColor: primaryColor }} />
                      <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-400">
                        <RefreshCw className="w-6 h-6 animate-spin text-slate-400" />
                      </div>
                    </div>
                    <p className="font-bold text-xs text-slate-800 dark:text-slate-200">
                      {t('connecting')}
                    </p>
                  </div>
                )}

                {callState === 'connected' && (
                  <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center mt-6">
                    {/* Pulser voice animation */}
                    <div className="relative flex items-center justify-center">
                      <div
                        style={{ backgroundColor: primaryColor }}
                        className="absolute w-20 h-20 rounded-full animate-ping opacity-15"
                      />
                      <div
                        style={{ backgroundColor: primaryColor }}
                        className="absolute w-16 h-16 rounded-full animate-pulse opacity-30"
                      />
                      <div
                        style={{ backgroundColor: primaryColor }}
                        className="w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg"
                      >
                        <Mic className="w-6 h-6 animate-bounce" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="font-bold text-md text-title">
                        {t('connected')}
                      </p>
                      <p className="text-sm text-emerald-500 font-bold tracking-wider uppercase">
                        {formatTime(seconds)}
                      </p>
                    </div>
                  </div>
                )}

                {callState === 'ended' && (
                  <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center mt-6">
                    <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-400">
                      <PhoneOff className="w-6 h-6 text-slate-400" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-bold text-md text-title">
                        {t('call_ended', 'Call Ended')}
                      </p>
                      <p className="text-sm text-subtitle-color font-bold tracking-wider uppercase">
                        {formatTime(seconds)}
                      </p>
                    </div>
                  </div>
                )}

                <div className="w-full mt-4">
                  {callState === 'idle' ? (
                    <Button
                      type="button"
                      onClick={handleStartCall}
                      style={{ backgroundColor: primaryColor }}
                      className="w-full text-white bg-primary! text-xs h-10 p-padding! rounded-lg font-bold transition-all flex items-center justify-center gap-2"
                    >
                      <Phone className="w-4 h-4" />
                      {t('start_call')}
                    </Button>
                  ) : callState === 'ended' ? null : (
                    <Button
                      type="button"
                      onClick={handleEndCall}
                      className="w-full text-white text-xs h-10 p-padding! rounded-lg bg-destructive font-bold transition-all flex items-center justify-center gap-2"
                    >
                      <PhoneOff className="w-4 h-4" />
                      {t('end_call')}
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Floating trigger widget button */}
      <Button
        type="button"
        onClick={() => {
          setIsOpen(!isOpen)
          if (isOpen) {
            handleEndCall()
            setTermsAccepted(false)
          }
        }}
        style={{
          backgroundColor: primaryColor,
          borderRadius: "32px 32px 32px 6px"
        }}
        className="w-14 h-14 p-0! text-white flex items-center justify-center shadow-[0_8px_20px_rgba(0,0,0,0.2)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer outline-none relative group"
      >
        {branding.icon_url ? (
          <Image width={28} height={28} src={branding.icon_url} alt="Logo" className="w-7 h-7 rounded-full object-cover bg-white" />
        ) : (
          <Mic className="w-6 h-6" />
        )}
        <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-gray-900 text-white text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-md">
          {buttonLabel}
        </div>
      </Button>
    </div>
  )
}
