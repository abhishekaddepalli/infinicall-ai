'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle
} from '@/components/ui/dialog'
import { EmbedModalProps } from '@/types/dashboard'
import DOMPurify from 'dompurify'
import { Check, Code2, Copy, FileText, Info, X } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

export function EmbedModal({ isOpen, onClose, embedCode }: EmbedModalProps) {
  const { t } = useTranslation()
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(embedCode)
      setCopied(true)
      toast.success(t('embed_code_copied'))
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Failed to copy code')
    }
  }

  const formatCode = (code: string) => {
    if (!code) return null
    return code.split('\n').map((line, idx) => {
      let formattedLine = line;

      formattedLine = DOMPurify.sanitize(
        line.replace(/'([^']*)'/g, "<span class='text-[#A3E635]'>'$1'</span>")
          .replace(/\b(function|window|document|createElement|appendChild|async|vw|init)\b/g, "<span class='text-[#38BDF8] font-medium'>$1</span>")
          .replace(/\b(w|d|s|o|f|js)\b/g, "<span class='text-[#FB923C]'>$1</span>"),
        { ALLOWED_TAGS: ['span'], ALLOWED_ATTR: ['class'] }
      )

      if (line.trim().startsWith('<!--') || line.trim().startsWith('//')) {
        formattedLine = `<span class="text-zinc-500">${line.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</span>`
      }
      else if (line.trim().startsWith('<script>') || line.trim().startsWith('</script>')) {
        formattedLine = `<span class="text-[#F472B6] font-medium">${line.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</span>`
      }

      return (
        <div key={idx} className="flex">
          <div className="text-right pr-6 select-none text-zinc-500 text-[13px] font-mono leading-[1.6] w-12 shrink-0">{idx + 1}</div>
          <div className="text-[13px] text-zinc-300 font-mono whitespace-pre leading-[1.6]" dangerouslySetInnerHTML={{ __html: formattedLine }} />
        </div>
      )
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl! max-w-[calc(100%-2rem)] p-0! gap-0! bg-bg-card border-none! max-h-[90vh] overflow-y-auto rounded-modal-radius shadow-2xl no-scrollbar [&>button]:hidden z-[9999]">

        <div className="sm:p-6 p-4 pb-4">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2 bg-primary/10 rounded-lg p-1 border border-primary/20">
              <span className="flex items-center justify-center w-8 h-8 rounded-md bg-primary/10 text-primary">
                <Code2 className="w-4 h-4" />
              </span>
              <span className="text-[11px] font-bold uppercase tracking-widest text-primary px-2">
                {t('html_snippet')}
              </span>
            </div>
            <Button
              onClick={onClose}
              variant="ghost"
              className="hover:bg-destructive/20 hover:text-destructive dark:hover:bg-white/5 dark:hover:text-zinc-500 p-1.5!"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <DialogTitle className="text-2xl font-bold text-title">
            {t('embed_code')}
          </DialogTitle>
          <DialogDescription className="text-md text-subtitle-color">
            {t('embed_instructions')}
          </DialogDescription>
        </div>

        <div className="sm:px-6 px-4 pb-6 w-full min-w-0">
          <div className="bg-header rounded-xl overflow-hidden border border-white/5 w-full flex flex-col min-w-0 shadow-lg">
            {/* Terminal Header */}
            <div className="flex flex-wrap gap-3 items-center justify-between px-5 py-4 border-b border-white/5 bg-white/[0.02] shrink-0">
              <div className="flex items-center gap-2 text-zinc-400 shrink-0 overflow-hidden">
                <FileText className="w-4 h-4 shrink-0" />
                <span className="text-xs font-semibold tracking-widest font-mono text-zinc-300 truncate">{t('widget_embed_html')}</span>
              </div>
              <Button
                onClick={handleCopy}
                className="bg-primary hover:opacity-90 text-white h-9 p-padding! rounded-lg flex items-center gap-2 font-semibold shadow-none transition-colors shrink-0 ml-2"
              >
                {copied ? <Check className="w-4 h-4 shrink-0" /> : <Copy className="w-4 h-4 shrink-0" />}
                {t('copy_embed_code')}
              </Button>
            </div>

            {/* Code Content */}
            <div className="sm:p-6 p-4 overflow-x-auto table-custom-scrollbar w-full min-w-0">
              <div className="min-w-max">
                {formatCode(embedCode)}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Tip */}
        <div className="sm:px-6 px-4 pb-6">
          <div className="bg-primary/[0.03] border border-primary/20 rounded-lg p-4 flex items-start gap-3">
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-bg-card border border-primary/30 text-primary shrink-0">
              <Info className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-base font-bold text-title mb-0.5">{t('tip')}</h4>
              <p className="text-md text-subtitle-color">
                {t('tip_place_code')} <code className="text-primary font-bold bg-primary/10 px-1.5 py-0.5 rounded">&lt;/body&gt;</code> {t('tag')}
              </p>
            </div>
          </div>
        </div>

      </DialogContent>
    </Dialog>
  )
}
