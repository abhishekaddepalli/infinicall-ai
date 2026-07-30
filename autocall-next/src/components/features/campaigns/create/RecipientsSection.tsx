'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RecipientsSectionProps } from "@/types/campaign"
import { FileText, Upload, Users, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"

export const RecipientsSection = ({
  selectedFile,
  setSelectedFile,
  existingFileName,
  onRemoveExisting
}: Pick<RecipientsSectionProps, "selectedFile" | "setSelectedFile"> & { existingFileName?: string, onRemoveExisting?: () => void }) => {
  const { t } = useTranslation()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isExistingRemoved, setIsExistingRemoved] = useState(false)

  useEffect(() => {
    setIsExistingRemoved(false)
  }, [existingFileName])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleRemoveExisting = () => {
    setIsExistingRemoved(true)
    if (onRemoveExisting) {
      onRemoveExisting()
    }
  }

  const actualExistingName = isExistingRemoved ? undefined : existingFileName;
  const hasFile = selectedFile || actualExistingName;
  const displayFileName = selectedFile ? selectedFile.name : (actualExistingName || t("click_to_upload_csv"));

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-title flex items-center gap-2.5 pb-4 mb-0 dark:text-white">
        <div className="w-10 h-10 rounded-radius bg-primary/10 flex items-center justify-center text-primary">
          <Users className="w-5 h-5 text-primary" />
        </div>
        <span>{t("leads_recipients")}</span>
      </h2>

      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-3">
          <Label className="text-md font-semibold text-title">
            {t("upload_contacts_csv")}
          </Label>

          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-input-border-color rounded-lg sm:p-8 p-4 flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all bg-subcard group"
          >
            <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
              <Upload className="w-7 h-7 text-primary transition-colors" />
            </div>
            <span className="text-base font-semibold text-slate-700 dark:text-slate-200">
              {displayFileName}
            </span>
            <span className="text-md text-subtitle-color">
              {t("only_csv_format")}
            </span>
            <Input
              type="file"
              ref={fileInputRef}
              accept=".csv"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          {hasFile && (
            <div className="flex items-center justify-between bg-subcard px-5 py-3 rounded-lg mt-3 border border-input-border-color">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <FileText className="w-4 h-4 text-primary" />
                </div>
                <div className="flex flex-col">
                  <span className="text-md font-semibold text-title break-all whitespace-normal line-clamp-1">
                    {displayFileName}
                  </span>
                  {selectedFile ? (
                    <span className="text-sm font-medium text-subtitle-color">{(selectedFile.size / 1024).toFixed(2)} KB</span>
                  ) : (
                    <span className="text-sm font-medium text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-md inline-flex w-fit mt-1">Already Uploaded</span>
                  )}
                </div>
              </div>
              {hasFile && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 text-destructive hover:text-white hover:bg-destructive bg-destructive/10 rounded-lg transition-colors"
                  onClick={selectedFile ? handleRemoveFile : handleRemoveExisting}
                >
                  <X className="w-5 h-5" />
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
