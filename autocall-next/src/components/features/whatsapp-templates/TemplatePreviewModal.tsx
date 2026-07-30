'use client'

import { TemplatePreviewModalProps } from '@/types/waba'
import { ArrowLeft, Image as ImageIcon, X } from 'lucide-react'
import { TemplatePreviewBubble } from './TemplatePreviewBubble'
import { Button } from '@/components/ui/button'
import { useTranslation } from 'react-i18next'

export const TemplatePreviewModal = ({
  template,
  isOpen,
  onClose,
}: TemplatePreviewModalProps) => {
  const { t } = useTranslation()

  if (!isOpen || !template) return null

  // Safely parse header configurations
  let headerFormat: 'none' | 'text' | 'image' | 'video' | 'document' | 'location' = 'none'
  let headerTextValue = ''
  let mediaUrlValue: string | null = null

  if (template.header) {
    try {
      const parsedHeader = typeof template.header === 'string' 
        ? JSON.parse(template.header) 
        : template.header
      
      const formatVal = parsedHeader?.format?.toLowerCase() || 'none'
      if (['text', 'image', 'video', 'document', 'location'].includes(formatVal)) {
        headerFormat = formatVal as any
      }
      
      if (headerFormat === 'text') {
        headerTextValue = parsedHeader?.text || ''
      } else {
        mediaUrlValue = parsedHeader?.media_url || null
      }
    } catch {
      // Fallback
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-zinc-950/70 backdrop-blur-xs transition-opacity" 
        onClick={onClose}
      />

      {/* Close button on Top Right of screen */}
      <Button
        onClick={onClose}
        className="absolute top-4 right-4 rtl:right-[unset] rtl:left-4 text-white p-0! transition-all w-9 h-9 rounded-full z-50"
      >
        <X size={24} />
      </Button>

      {/* Phone chassis container */}
      <div className="relative w-full max-w-77.5 bg-zinc-950 rounded-[2.5rem] p-1 border-2 border-zinc-800 shadow-2xl z-10 animate-in zoom-in-95 duration-200 ring-1 ring-zinc-700/50">
        
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-5.5 bg-zinc-950 rounded-b-2xl z-20 flex items-center justify-center">
          <div className="w-12 h-1 bg-zinc-800 rounded-full mb-1"></div>
        </div>

        {/* Screen Frame */}
        <div className="w-full bg-[#efeae2] dark:bg-zinc-950 rounded-[2.2rem] overflow-hidden flex flex-col h-[650px] max-h-[85vh] shadow-inner relative">
          
          {/* Header Bar */}
          <div className="bg-[#075e54] dark:bg-zinc-900 p-3 pt-7 flex items-center gap-2.5 shrink-0 border-b border-black/10 z-10">
            <ArrowLeft size={16} className="text-white cursor-pointer hover:opacity-80 shrink-0" onClick={onClose} />
            <div className="w-8 h-8 rounded-lg bg-emerald-800 dark:bg-zinc-800 flex items-center justify-center overflow-hidden border border-white/10 shrink-0">
              <ImageIcon size={14} className="text-emerald-200 dark:text-zinc-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-white text-md font-black truncate leading-tight mb-1">{t('your_brand')}</h4>
              <p className="text-sm text-white py-0 leading-none truncate">{t('business_account')}</p>
            </div>
          </div>

          {/* Interactive Chat Message Body */}
          <TemplatePreviewBubble
            templateType={headerFormat}
            headerText={headerTextValue}
            bodyText={template.message_body}
            footerText={template.footer_text || ''}
            fileUrl={mediaUrlValue}
          />
          
        </div>
      </div>
    </div>
  )
}
