'use client'

import { TemplatePreviewBubbleProps } from '@/types/waba'
import { FileText, Image as ImageIcon, MapPin, Video } from 'lucide-react'
import Image from 'next/image'
import DOMPurify from 'dompurify'

export const TemplatePreviewBubble = ({
  templateType,
  headerText,
  bodyText,
  footerText,
  fileUrl,
}: TemplatePreviewBubbleProps) => {
  const sanitizedContent = DOMPurify.sanitize(bodyText || "", {
    ALLOWED_TAGS: ['p', 'h1', 'h2', 'strong', 'ul', 'li', 'br'],
  })
  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 pt-6 bg-bg-card dark:bg-bg-color no-scrollbar flex flex-col justify-start relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0 opacity-40 dark:opacity-[0.15] dark:invert bg-[url('/assets/images/1.png')] bg-cover bg-center bg-no-repeat pointer-events-none"></div>

      {/* Interactive Chat Content */}
      <div className="relative z-10 flex flex-col flex-1">
        <div className="mx-auto w-fit px-2.5 py-0.5 bg-sky-100/90 dark:bg-sky-900/20 dark:border-sky-900/20 rounded-lg text-[9px] uppercase font-extrabold text-sky-700 dark:text-sky-400 shadow-xs border border-sky-200/50 shrink-0 mb-3 tracking-wider">
          Today
        </div>

        <div className="bg-subcard rounded-2xl rounded-tl-none shadow-md overflow-hidden min-w-[80%] max-w-[92%] w-fit border border-input-border-color shrink-0 self-start">
          {/* Media Header Render */}
          {templateType !== 'text' && templateType !== 'none' && (
            <div className="aspect-video bg-subcard flex items-center justify-center text-slate-400 overflow-hidden relative border-b border-input-border-color">
              {fileUrl ? (
                <Image
                  src={fileUrl}
                  alt="Media Header"
                  className="w-full h-full object-cover"
                  width={200}
                  height={120}
                  unoptimized
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-slate-400/70 p-4">
                  {templateType === 'image' && <ImageIcon size={28} className="text-primary" />}
                  {templateType === 'video' && <Video size={28} className="text-primary" />}
                  {templateType === 'document' && <FileText size={28} className="text-primary" />}
                  {templateType === 'location' && <MapPin size={28} className="text-primary" />}
                  <span className="text-sm font-bold text-subtitle-color">
                    {templateType} Header Preview
                  </span>
                </div>
              )}
              {fileUrl && (
                <div className="absolute inset-0 bg-black/10 flex items-center justify-center pointer-events-none">
                  <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-lg">
                    {templateType === 'image' && <ImageIcon size={16} />}
                    {templateType === 'video' && <Video size={16} />}
                    {templateType === 'document' && <FileText size={16} />}
                    {templateType === 'location' && <MapPin size={16} />}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Text Header Render */}
          {headerText && (
            <div className="p-3 pb-1.5 font-black text-sm text-title border-b border-input-border-color break-all leading-tight">
              {headerText}
            </div>
          )}

          {/* Message Body & Footer */}
          <div className="p-3.5 space-y-2">
            <div
              className="text-md text-title leading-relaxed whitespace-normal break-all font-medium"
              dangerouslySetInnerHTML={{
                __html: sanitizedContent || 'Type your message here...',
              }}
            />

            {footerText && (
              <div className="text-sm text-subtitle-color font-bold break-all border-t border-input-border-color pt-1.5 mt-2">
                {footerText}
              </div>
            )}

            <div className="text-xs text-subtitle-color text-right mt-1 font-bold">
              10:57 AM
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
