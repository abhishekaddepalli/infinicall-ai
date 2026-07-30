'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { ImportModalProps } from '@/types/shared'
import { ChevronRight, Download, FileSpreadsheet, Upload } from 'lucide-react';
import { Loader2 } from '@/components/reusable/Loader2';
import { useCallback, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Input } from '../ui/input'

export const ImportModal = ({
  isOpen,
  onClose,
  onImport,
  onDownloadTemplate,
  isLoading = false,
  title,
}: ImportModalProps) => {
  const { t } = useTranslation()
  const [dragOver, setDragOver] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      setDragOver(false)
      const file = e.dataTransfer.files[0]
      if (file && (file.name.endsWith('.xlsx') || file.name.endsWith('.csv') || file.name.endsWith('.xls'))) {
        setSelectedFile(file)
      } else {
        toast.error(t('valid_import_file_error'))
      }
    },
    [t],
  )

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setSelectedFile(file)
  }

  const handleSubmit = async () => {
    if (!selectedFile) return
    onImport(selectedFile)
    setSelectedFile(null)
  }

  const handleClose = () => {
    if (isLoading) return
    setSelectedFile(null)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-xl! max-w-[calc(100%-2rem)]! no-scrollbar overflow-auto max-h-[90vh] p-0 border-none rounded-modal-radius! bg-white dark:bg-white/5 dark:border-white/10">
        <div className="sm:p-6 p-4 space-y-8 w-full min-w-0 overflow-hidden">
          <DialogHeader className="relative">
            {/* Background glow Decoration */}
            <div className="flex flex-col relative z-10">
              <div className="flex items-center gap-4">
                <div>
                  <DialogTitle className="text-xl text-left rtl:text-right font-bold text-title dark:text-white">{title || t("import_data")}</DialogTitle>
                </div>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-6 mb-4">
            {onDownloadTemplate && (
              <div className="relative group overflow-hidden rounded-radius border border-primary/20 bg-gradient-to-br from-primary/[0.05] via-transparent to-primary/[0.02] dark:from-primary/10 dark:via-white/2 dark:to-transparent sm:p-5 p-4 transition-all duration-500 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/40">
                {/* Decorative background shapes */}
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/20 blur-3xl rounded-full pointer-events-none group-hover:bg-primary/30 transition-all duration-500" />
                <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-primary/10 blur-3xl rounded-full pointer-events-none group-hover:scale-150 transition-transform duration-700" />

                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                  <div className="flex items-start gap-4">
                    <div className="space-y-1">
                      <h4 className="text-base font-bold text-title dark:text-white group-hover:text-primary transition-colors duration-300">{t("setup_guide")}</h4>
                      <p className="text-md text-subtitle-color font-medium leading-relaxed">{t("setup_guide_desc")}</p>
                    </div>
                  </div>

                  <Button variant="outline" onClick={onDownloadTemplate} className="h-10 p-padding! bg-white dark:bg-slate-800 text-primary border border-primary/20 hover:bg-primary hover:text-white hover:border-primary font-bold text-sm gap-2 transition-all duration-300 rounded-radius shadow-sm group/btn sm:w-auto w-full flex items-center justify-center">
                    <Download size={16} />
                    <span>{t("get_template")}</span>
                  </Button>
                </div>
              </div>
            )}

            <div
              onDrop={handleDrop}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onClick={() => !isLoading && fileInputRef.current?.click()}
              className={cn("relative flex flex-col items-center justify-center gap-6 rounded-radius border-2 border-dashed sm:p-6 p-4 cursor-pointer transition-all duration-500 overflow-hidden group w-full min-w-0", dragOver ? "border-primary bg-primary/5 scale-[1.02] shadow-2xl shadow-primary/10" : " dark:border-white/5 bg-white/2 dark:bg-white/1 border-primary/40 hover:bg-primary/2", selectedFile && "border-primary bg-primary/3")}
            >
              {selectedFile ? (
                <div className="flex flex-col items-center gap-3 animate-in zoom-in duration-500 w-full min-w-0 px-2">
                  <div className="w-16 h-16 rounded-radius bg-primary/10 flex items-center justify-center relative shrink-0">
                    <FileSpreadsheet size={30} className="text-primary" />
                  </div>
                  <div className="text-center w-full min-w-0 overflow-hidden">
                    <p className="text-lg font-medium text-title dark:text-white truncate w-full">{selectedFile.name}</p>
                    <p className="text-sm text-subtitle-color mt-2 font-medium inline-block truncate w-full">
                      {(selectedFile.size / 1024).toFixed(1)} KB • {t("change_file")}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3 w-full min-w-0">
                  <div className={cn("w-16 h-16 rounded-radius flex items-center justify-center transition-all duration-500 relative shrink-0", dragOver ? "bg-primary text-black rotate-12" : "bg-primary/10 text-primary border border-white/8")}>
                    <Upload size={30} strokeWidth={2.5} />
                  </div>
                  <div className="text-center space-y-2 w-full min-w-0">
                    <p className="text-lg font-medium text-title mb-0 truncate">{dragOver ? t("ready_to_drop") : t("choose_a_file")}</p>
                    <p className="text-md text-subtitle-color font-bold truncate">{t("drag_drop_hint")}</p>
                  </div>
                </div>
              )}
              <Input ref={fileInputRef} type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={handleFileChange} />
            </div>
          </div>

          <div className="flex items-center gap-4 pt-4">
            <Button variant="ghost" onClick={handleClose} disabled={isLoading} className="flex-1 p-padding text-md font-medium rounded-radius bg-subcard text-black  dark:text-white border border-input-border-color transition-all duration-500  border-none">
              {t("cancel")}
            </Button>
            <Button onClick={handleSubmit} disabled={!selectedFile || isLoading} className="flex-1 p-padding rounded-radius bg-primary text-white transition-all active:scale-95 disabled:shadow-none text-md font-medium gap-2">
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {t("processing_data")}
                </>
              ) : (
                <>
                  <span>{t("start_import")}</span>
                  <div className=" flex items-center justify-center">
                    <ChevronRight size={18} />
                  </div>
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
