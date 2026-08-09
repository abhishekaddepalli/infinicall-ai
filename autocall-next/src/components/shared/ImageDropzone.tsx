import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn, getImageUrl } from "@/lib/utils"
import { ImageDropzoneProps } from "@/types/shared"
import { FileIcon, UploadCloud, X } from "lucide-react"
import Image from "next/image"
import React, { useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { Button } from "../ui/button"

export const ImageDropzone: React.FC<ImageDropzoneProps> = ({ label, name, onUpload, className, value, file, accept = "image/*", onRemove }) => {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      const isAccepted = accept === "*" || accept.includes(droppedFile.type) || (accept.includes("image/*") && droppedFile.type.startsWith("image/"));
      if (isAccepted) {
        onUpload(droppedFile);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    }
  };

  const [objectUrl, setObjectUrl] = useState<string | null>(null);

  useEffect(() => {
    if (file && file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setObjectUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    setObjectUrl(null);
  }, [file]);

  return (
    <div className={cn("mt-2", className)}>
      <Label className="block text-md font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
      </Label>
      <div
        className={cn(
          "relative h-32 w-full rounded-modal-radius border-2 border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-300 group/file overflow-hidden",
          isDragOver
            ? "border-primary bg-primary/10"
            : "border-input-border-color bg-muted/10 hover:border-primary/40 hover:bg-primary/5"
        )}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragEnter={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {value || file ? (
          <>
            {objectUrl || (value && typeof value === 'string') ? (
              <Image src={objectUrl || getImageUrl(value as string)} alt="Preview" width={500} height={500} unoptimized className="h-full w-full object-contain p-2" />
            ) : (
              <div className="flex flex-col items-center justify-center p-4">
                <div className="p-3 rounded-full bg-primary/10 text-primary mb-2">
                  <FileIcon className="w-8 h-8" />
                </div>
                <span className="font-semibold text-primary truncate max-w-[200px]">{file?.name || 'Document'}</span>
              </div>
            )}
            <div className="absolute inset-0 bg-subcard/40 flex flex-col items-center justify-center opacity-0 group-hover/file:opacity-100 transition-opacity">
              <p className="text-title font-medium">{t('drop_or_click_to_replace')}</p>
            </div>
            {onRemove && (
              <Button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove();
                }}
                className="absolute top-2 w-8 h-8 right-2 rtl:right-[unset] rtl:left-2 bg-destructive/10! hover:bg-destructive! hover:text-white! text-destructive! p-0! rounded-lg transition-colors"
                title={t('remove')}
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </>
        ) : (
          <>
            <div
              className={cn(
                "flex items-center justify-center h-10 w-10 rounded-lg",
                isDragOver
                  ? "bg-primary text-white"
                  : "bg-primary/15 text-primary "
              )}
            >
              <UploadCloud className="w-5 h-5" />
            </div>

            <div className="text-center px-4">
              <p className="text-md font-bold text-title">
                {isDragOver ? t('release_to_drop_image') : t('drop_or_click_image')}
              </p>
              <p className="text-sm text-subtitle-color font-medium">
                {t('supported_formats')}
              </p>
            </div>
          </>
        )}

        <Input
          type="file"
          accept={accept}
          name={name}
          className="hidden"
          ref={fileInputRef}
          onChange={handleImageUpload}
        />
      </div>
    </div>
  );
};
