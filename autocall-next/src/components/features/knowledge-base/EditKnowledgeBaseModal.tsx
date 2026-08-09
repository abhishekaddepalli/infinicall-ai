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
import { cn } from "@/lib/utils"
import { EditKnowledgeBaseModalProps } from "@/types/knowledgeBase"
import { FileText, Upload, X } from 'lucide-react';
import { Loader2 } from '@/components/reusable/Loader2';
import { useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"

const EditKnowledgeBaseModal = ({
  isOpen,
  onClose,
  onSave,
  isLoading,
  initialData,
}: EditKnowledgeBaseModalProps) => {
  const { t } = useTranslation()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    content: '',
    url: '',
    file: null as File | null,
  })

  useEffect(() => {
    if (initialData && isOpen) {
      setFormData({
        name: initialData.name || '',
        content: initialData.content || '',
        url: initialData.url || '',
        file: null,
      })
    }
  }, [initialData, isOpen])

  const resetForm = () => {
    setFormData({
      name: '',
      content: '',
      url: '',
      file: null,
    })
  }

  const handleClose = () => {
    if (isLoading) return
    resetForm()
    onClose()
  }

  const handleSubmit = async () => {
    if (!initialData) return

    const itemId = initialData.id || initialData._id || ''
    if (!itemId) return

    const data = new FormData()
    if (formData.name) data.append('name', formData.name)
    if (initialData.type === 'text' && formData.content) {
      data.append('content', formData.content)
    }
    if (initialData.type === 'url' && formData.url) {
      data.append('url', formData.url)
    }
    if (initialData.type === 'file' && formData.file) {
      data.append('file', formData.file)
    }

    try {
      await onSave(itemId, data)
      resetForm()
    } catch {
      // Error handled by parent
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent onOpenAutoFocus={(e) => e.preventDefault()} className="sm:max-w-md! border-none max-w-[calc(100%-2rem)]! gap-0! p-0 overflow-hidden bg-white [&>button]:hidden">
        <DialogHeader className="sm:p-6 p-4 pb-0!">
          <DialogTitle className="flex items-start sm:items-center justify-between gap-2">
            <span className="text-lg sm:text-xl font-bold text-title text-left rtl:text-right leading-tight mt-1 sm:mt-0">
              {t("edit_knowledge_base")}
            </span>
            {/* <div className="flex items-center gap-2 sm:gap-4 shrink-0">
              <Button
                type="button"
                onClick={handleClose}
                className="group text-gray-400 p-1.5 hover:bg-destructive/10 hover:text-destructive rounded-lg transition-colors flex items-center justify-center"
              >
                <X className="w-5 h-5" strokeWidth={2} />
              </Button>
            </div> */}
          </DialogTitle>
        </DialogHeader>

        <div className="sm:p-6 p-4 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name" className="text-md font-bold text-title mb-2!">
                {t("knowledge_base_name")}
              </Label>
              <Input
                id="edit-name"
                placeholder={t("enter_name_placeholder")}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="h-10 rounded-radius bg-input-color dark:bg-white/5 border-input-border-color shadow-none"
              />
            </div>
          </div>

          {initialData?.type === "text" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-content" className="text-md font-bold text-title">
                  {t("content")}
                </Label>
                <Textarea
                  id="edit-content"
                  placeholder={t('kb_content_placeholder')}
                  className="min-h-[150px] rounded-radius bg-input-color dark:bg-white/5 border-input-border-color focus:ring-primary/20 focus:border-primary shadow-none"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                />
              </div>
            </div>
          )}

          {initialData?.type === "url" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-url" className="text-md font-bold text-title">
                  {t("website_url")}
                </Label>
                <Input
                  id="edit-url"
                  type="url"
                  placeholder="https://example.com/docs"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  className="h-10 rounded-radius bg-input-color dark:bg-white/5 border-input-border-color focus:ring-primary/20 focus:border-primary shadow-none"
                />
              </div>
            </div>
          )}

          {initialData?.type === "file" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-md font-bold text-title mb-2">
                  {t("upload_document_replace")}
                </Label>

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
                          className="p-2 bg-unset w-[26px] h-[26px] hover:bg-destructive/20 rounded-lg text-destructive transition-colors shadow-none"
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
                        <p className="text-sm font-bold text-gray-900 dark:text-white">
                          {isDragging ? t('drop_file_here') : t('click_to_upload_new_file')}
                        </p>
                        <p className="text-xs text-gray-500 font-medium tracking-wide">{t("file_require")}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="pt-2 gap-3 sm:gap-4 mt-2 sm:p-6 p-4 pt-0!">
          <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading} className="flex-1 p-padding! mr-0! rounded-radius border border-input-border-color bg-subcard dark:bg-subcard text-black dark:text-white text-md font-medium transition-all">
            {t("cancel")}
          </Button>

          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading || !formData.name || (initialData?.type === "text" && !formData.content) || (initialData?.type === "url" && !formData.url)}
            className="flex-1 p-padding! rounded-radius border-none bg-primary text-white text-md font-medium transition-all shadow-sm"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("processing")}
              </>
            ) : (
              t("save_changes")
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default EditKnowledgeBaseModal
