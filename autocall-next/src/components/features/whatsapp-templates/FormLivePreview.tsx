'use client'

import { FormLivePreviewProps } from '@/types/waba'
import { ArrowLeft, Image as ImageIcon } from 'lucide-react'
import { useEffect, useMemo } from 'react'
import { TemplatePreviewBubble } from './TemplatePreviewBubble'
import { useTranslation } from 'react-i18next'

const resolveBody = (
  messageBody: string,
  variables_example: { key: string; example: string }[],
  defaultText: string
) => {
  if (!messageBody) return defaultText
  let text = messageBody
    .replace(/&nbsp;/g, ' ')
    .replace(/<p>/g, '')
    .replace(/<\/p>/g, '<br />')
    .replace(/<br\s*\/?>/g, '<br />')
  
  variables_example.forEach((v) => {
    const escapedKey = v.key.toString().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const replacement = v.example
      ? `<span class="bg-primary/10 text-primary border border-primary/20 rounded px-1 font-bold">${v.example}</span>`
      : `<span class="bg-slate-100 text-slate-500 border border-slate-200 rounded px-1 font-bold">{{${v.key}}}</span>`
    
    text = text.replace(new RegExp(`\\{\\{${escapedKey}\\}\\}`, 'g'), replacement)
  })

  return text.trim() || defaultText
}

export const FormLivePreview = ({
  templateType,
  headerText,
  messageBody,
  variables_example,
  footerText,
  headerFile,
  mediaUrl,
}: FormLivePreviewProps) => {
  const { t } = useTranslation()

  const fileUrl = useMemo(() => {
    if (headerFile) return URL.createObjectURL(headerFile)
    if (!mediaUrl) return null
    return mediaUrl
  }, [headerFile, mediaUrl])

  useEffect(() => {
    if (!fileUrl) return
    return () => {
      if (headerFile) {
        URL.revokeObjectURL(fileUrl)
      }
    }
  }, [fileUrl, headerFile])

  const bodyText = resolveBody(messageBody, variables_example, t('type_your_message_here'))

  return (
    <div className="w-full flex flex-col items-center max-w-sm mx-auto justify-center sticky top-6">
      <div className="w-full max-w-[310px] bg-zinc-950 rounded-[2.5rem] p-1 border-2 border-zinc-800 shadow-2xl relative ring-1 ring-zinc-700/50">
        {/* Phone Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-5.5 bg-zinc-950 rounded-b-2xl z-20 flex items-center justify-center">
          <div className="w-12 h-1 bg-zinc-800 rounded-full mb-1"></div>
        </div>

        {/* Screen Content */}
        <div className="w-full h-full bg-slate-50 dark:bg-bg-color rounded-[2.2rem] overflow-hidden flex flex-col min-h-[600px] max-h-[600px] shadow-inner relative">
          {/* Header Bar */}
          <div className="bg-[#075e54] dark:bg-bg-card p-3 pt-7 flex items-center gap-2.5 shrink-0 border-b border-input-border-color">
            <ArrowLeft size={16} className="text-white cursor-pointer hover:opacity-80" />
            <div className="w-8 h-8 rounded-full bg-emerald-800 dark:bg-input-color flex items-center justify-center overflow-hidden border border-white/10 shrink-0">
              <ImageIcon size={14} className="text-emerald-200 dark:text-subtitle-color" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-white text-xs font-black truncate leading-tight">{t('your_brand')}</h4>
              <p className="text-[9px] text-emerald-100/70 dark:text-zinc-500 py-0 leading-none">{t('business_account')}</p>
            </div>
          </div>

          {/* Bubble body list */}
          <TemplatePreviewBubble
            templateType={templateType}
            headerText={headerText}
            bodyText={bodyText}
            footerText={footerText}
            fileUrl={fileUrl}
          />
        </div>
      </div>
    </div>
  )
}
