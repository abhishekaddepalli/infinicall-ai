'use client'

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textArea"
import { fileTypes } from "@/data/knowledgebase"
import { cn } from "@/lib/utils"
import { KnowledgeBaseWizardModalProps } from "@/types/knowledgeBase"
import { FileText, Upload, X } from 'lucide-react';
import { Loader2 } from '@/components/reusable/Loader2';
import { useRef, useState } from "react"
import { useTranslation } from "react-i18next"

const KnowledgeBaseWizardModal = ({
  isOpen,
  onClose,
  onSave,
  isLoading,
}: KnowledgeBaseWizardModalProps) => {
  const { t } = useTranslation()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: '',
    type: 'url' as 'url' | 'file' | 'text',
    url: '',
    content: '',
    file: null as File | null,
  })

  const resetForm = () => {
    setStep(1)
    setFormData({
      name: '',
      type: 'url',
      url: '',
      content: '',
      file: null,
    })
  }

  const handleClose = () => {
    if (isLoading) return
    resetForm()
    onClose()
  }

  const handleNext = () => {
    if (step < 3) setStep(step + 1)
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleSubmit = async () => {
    const data = new FormData()
    data.append('type', formData.type)
    data.append('name', formData.name)
    
    if (formData.type === 'url') data.append('url', formData.url)
    if (formData.type === 'text') data.append('content', formData.content)
    if (formData.type === 'file' && formData.file) data.append('file', formData.file)

    try {
      await onSave(data)
      resetForm()
    } catch {
      // Error handled by parent
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent onOpenAutoFocus={(e) => e.preventDefault()} className="sm:max-w-md! max-w-[calc(100%-2rem)]! gap-0 p-0 overflow-hidden bg-white [&>button]:hidden">
        <DialogHeader className="sm:p-6 p-4 pb-0!">
          <DialogTitle className="flex items-start sm:items-center justify-between gap-2">
            <span className="text-lg sm:text-xl font-bold text-title text-left rtl:text-right leading-tight mt-1 sm:mt-0">{t("create_knowledge_base")}</span>
            <div className="flex items-center gap-2 sm:gap-4 shrink-0">
              <span className="whitespace-nowrap text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-2 sm:px-3 py-1 rounded-md">Step {step} / 3</span>
              <Button onClick={handleClose} className="group text-gray-400 bg-unset p-1 sm:p-2 hover:bg-destructive/20 hover:text-destructive hover:text-gray-600 dark:hover:text-gray-200 transition-colors flex items-center justify-center h-auto">
                <X className="w-5 h-5 group-hover:text-destructive" strokeWidth={2} />
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="sm:p-6 p-4">
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-md font-bold text-title mb-2!">
                  {t("knowledge_base_name")}
                </Label>
                <Input id="name" placeholder={t("enter_name_placeholder")} value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="h-10 rounded-radius bg-input-color dark:bg-white/5 border-input-border-color" />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="grid grid-cols-1 gap-3 animate-in fade-in slide-in-from-right-4 duration-300">
              {fileTypes.map((typeItem) => (
                <Button key={typeItem.id} onClick={() => setFormData({ ...formData, type: typeItem.id as "url" | "file" | "text" })} className={cn("flex items-center h-auto min-h-[72px] justify-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl border text-left transition-all duration-300 whitespace-normal", formData.type === typeItem.id ? "border-primary bg-primary/5 shadow-[0_0_15px_rgba(61,240,204,0.1)]" : "border-input-border-color dark:border-white/10 bg-input-color dark:hover:bg-white/5")}>
                  <div className={cn("w-10 h-10 sm:w-12 sm:h-12 shrink-0 rounded-radius flex items-center justify-center transition-colors", formData.type === typeItem.id ? "bg-primary text-white dark:text-white" : "bg-slate-300 dark:bg-white/5 text-primary")}>{typeItem.icon}</div>
                  <div>
                    <h4 className="font-bold text-sm text-gray-900 dark:text-white">{typeItem.label}</h4>
                    <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 mt-0.5">{typeItem.description}</p>
                  </div>
                </Button>
              ))}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              {formData.type === "url" && (
                <div className="space-y-2">
                  <Label htmlFor="url" className="text-md font-bold text-title">
                    {t("website_url")}
                  </Label>
                  <Input id="url" type="url" placeholder="https://example.com/docs" value={formData.url} onChange={(e) => setFormData({ ...formData, url: e.target.value })} className="h-10 rounded-radius bg-input-color dark:bg-white/5 border-input-border-color dark:border-white/10 focus:ring-primary/20 focus:border-primary" />
                </div>
              )}

              {formData.type === "text" && (
                <div className="space-y-2">
                  <Label htmlFor="content" className="text-md font-bold text-title">
                    {t("content")}
                  </Label>
                  <Textarea id="content" placeholder="Paste or type the content you want the AI to learn from..." className="min-h-[150px] rounded-radius bg-input-color dark:bg-white/5 border-input-border-color dark:border-white/10 focus:ring-primary/20 focus:border-primary" value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} />
                </div>
              )}

              {formData.type === "file" && (
                <div className="space-y-2">
                  <Label className="text-md font-bold text-title mb-2">{t("upload_document")}</Label>

                  {/* Hidden file input */}
                  <Input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept=".pdf,.txt,.docx"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      setFormData({ ...formData, file });
                      e.target.value = "";
                    }}
                  />

                  <div
                    className={cn("border-2 border-dashed rounded-radius sm:p-10 p-4 text-center transition-all cursor-pointer group bg-gray-50 dark:bg-white/5", isDragging ? "border-primary bg-primary/5 scale-[1.01]" : " dark:border-white/10 border-primary/50")}
                    onClick={() => fileInputRef.current?.click()}
                    onDragEnter={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsDragging(true);
                    }}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsDragging(true);
                    }}
                    onDragLeave={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsDragging(false);
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsDragging(false);
                      const dropped = e.dataTransfer.files?.[0];
                      if (dropped) {
                        const allowed = [".pdf", ".txt", ".docx"];
                        const ext = "." + dropped.name.split(".").pop()?.toLowerCase();
                        if (allowed.includes(ext)) {
                          setFormData({ ...formData, file: dropped });
                        }
                      }
                    }}
                  >
                    {formData.file ? (
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 rounded-radius bg-primary/10 flex items-center justify-center text-primary">
                          <FileText className="w-8 h-8" />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-title max-w-[200px] truncate">{formData.file.name}</span>
                          <Button
                            type="button"
                            className="p-2 bg-unset w-[26px] h-[26px] hover:bg-destructive/20 dark:hover:bg-red-500/10 rounded-lg text-destructive transition-colors"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setFormData({ ...formData, file: null });
                            }}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                        <span className="text-sm text-subtitle-color font-bold uppercase">{(formData.file.size / (1024 * 1024)).toFixed(2)} MB</span>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className={cn("w-16 h-16 rounded-radius flex items-center justify-center mx-auto transition-all duration-300", isDragging ? "bg-primary/10 text-primary" : "text-primary bg-primary/5")}>
                          <Upload className="w-8 h-8" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-bold text-gray-900 dark:text-white">{isDragging ? "Drop your file here!" : "Click to upload or drag and drop"}</p>
                          <p className="text-xs text-gray-500 font-medium tracking-wide">{t("file_require")}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="pt-2 gap-3 sm:gap-4 mt-2 sm:p-6 p-4 pt-0! flex-row!">
          {step > 1 && (
            <Button type="button" variant="outline" onClick={handleBack} disabled={isLoading} className="flex-1 p-padding! mr-0! rounded-radius border border-input-border-color bg-subcard dark:bg-subcard text-black dark:text-white text-md font-medium transition-all">
              {t("back")}
            </Button>
          )}

          <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading} className="flex-1 p-padding! mr-0! rounded-radius border border-input-border-color bg-subcard dark:bg-subcard text-black dark:text-white text-md font-medium transition-all">
            {t("cancel")}
          </Button>

          {step < 3 ? (
            <Button onClick={handleNext} disabled={step === 1 && !formData.name} className="flex-1 p-padding! rounded-radius border-none bg-primary text-white text-md font-medium transition-all shadow-sm">
              {t("next")}
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={isLoading || (formData.type === "url" && !formData.url) || (formData.type === "text" && !formData.content) || (formData.type === "file" && !formData.file)} className="flex-1 p-padding! rounded-radius border-none bg-primary text-white text-md font-medium transition-all shadow-sm">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("processing")}
                </>
              ) : (
                t("create_knowledge")
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default KnowledgeBaseWizardModal
