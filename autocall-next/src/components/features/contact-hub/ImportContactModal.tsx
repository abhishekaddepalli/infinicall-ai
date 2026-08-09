'use client'

import { Loader2 } from '@/components/reusable/Loader2'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { ImportContactModalProps } from '@/types/contact'
import { FileUp, UploadCloud, X, Download } from 'lucide-react'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { useLazyDownloadImportTemplateQuery } from '@/redux/api/contactApi'

export function ImportContactModal({ isOpen, onClose, onConfirm, isLoading }: ImportContactModalProps) {
  const { t } = useTranslation()
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [triggerDownloadTemplate, { isFetching: isDownloading }] = useLazyDownloadImportTemplateQuery()

  const handleDownloadTemplate = async () => {
    try {
      const blob = await triggerDownloadTemplate().unwrap()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'import-template.csv'
      a.click()
      window.URL.revokeObjectURL(url)
    } catch {
      toast.error(t('download_template_failed', 'Failed to download template'))
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
        toast.error(t('only_csv_allowed'))
        return
      }
      setFile(selectedFile)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFile = e.dataTransfer.files?.[0]
    if (droppedFile) {
      if (droppedFile.type !== 'text/csv' && !droppedFile.name.endsWith('.csv')) {
        toast.error(t('only_csv_allowed'))
        return
      }
      setFile(droppedFile)
    }
  }

  const handleConfirm = () => {
    if (file) {
      onConfirm(file)
    }
  }

  const resetAndClose = () => {
    setFile(null)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={resetAndClose}>
      <DialogContent onOpenAutoFocus={(e) => e.preventDefault()} className="max-w-xl p-0 rounded-[2.5rem] border-none shadow-2xl bg-white  overflow-hidden flex flex-col">
        <DialogHeader className="p-10 pb-6 shrink-0 bg-gradient-to-b from-primary/5 to-transparent">
          <div className="space-y-1">
            <DialogTitle className="text-3xl font-black tracking-tight flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-2xl shadow-inner text-primary">
                <FileUp className="w-7 h-7" />
              </div>
              {t('import_contacts')}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground/60 font-bold text-sm ml-1 flex flex-col gap-2">
              <span>{t('import_contacts_desc')}</span>
              <Button type="button" onClick={handleDownloadTemplate} disabled={isDownloading} className="text-sm font-medium bg-[unset] p-0! text-primary hover:underline flex items-center gap-1.5 transition-colors w-fit mt-1 disabled:opacity-50 disabled:cursor-not-allowed">
                 {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                 {t("download_csv_format")}
              </Button>
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="flex-1 px-10 pb-10">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              "relative border-2 border-dashed rounded-[2rem] p-12 transition-all duration-500 cursor-pointer flex flex-col items-center justify-center gap-4 group",
              isDragging 
                ? "border-primary bg-primary/5 scale-[0.98]" 
                : "border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02] hover:border-primary/20 hover:bg-primary/[0.02]"
            )}
          >
            <Input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".csv"
              className="hidden"
            />
            
            {file ? (
              <div className="flex flex-col items-center gap-4 animate-in zoom-in-95 duration-300">
                <div className="p-5 rounded-2xl bg-primary/20 text-primary shadow-xl">
                  <FileUp className="w-10 h-10" />
                </div>
                <div className="text-center">
                  <p className="font-black text-lg tracking-tight">{file.name}</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 mt-1">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={(e) => { e.stopPropagation(); setFile(null); }}
                  className="rounded-xl hover:bg-rose-500/10 hover:text-rose-500 transition-all font-bold gap-2"
                >
                  <X className="w-4 h-4" />
                  {t('remove_file')}
                </Button>
              </div>
            ) : (
              <>
                <div className="p-6 rounded-[1.5rem] bg-white dark:bg-white/5 shadow-2xl transition-transform duration-500 group-hover:scale-110 group-hover:-translate-y-2">
                  <UploadCloud className="w-12 h-12 text-primary" />
                </div>
                <div className="text-center">
                  <p className="font-black text-lg tracking-tight">{t('drag_and_drop_csv')}</p>
                  <p className="text-xs font-bold text-muted-foreground/40 mt-2 leading-relaxed">
                    {t('csv_format_hint')}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        <DialogFooter className="pt-2 gap-3 sm:gap-4 mt-2 px-10 pb-10 pt-0 shrink-0">
          <Button type="button" variant="outline" onClick={resetAndClose} className="flex-1 p-padding! mr-0! rounded-radius border border-input-border-color bg-subcard dark:bg-subcard text-black dark:text-white text-md font-medium transition-all">
            {t('cancel')}
          </Button>
          <Button type="button" onClick={handleConfirm} disabled={isLoading || !file} className="flex-1 p-padding! rounded-radius border-none bg-primary text-white text-md font-medium transition-all shadow-sm">
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : t('start_import')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
