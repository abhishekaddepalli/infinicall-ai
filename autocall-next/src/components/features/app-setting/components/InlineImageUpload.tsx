'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { InlineImageUploadProps } from '@/types/settings'
import { getMediaUrl } from '@/utils/auth'
import { Image as ImageIcon, Upload, X } from 'lucide-react'
import Image from 'next/image'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

const InlineImageUpload = ({ label, currentUrl, onFileSelect, onRemove }: InlineImageUploadProps) => {
  const { t } = useTranslation()
  const [preview, setPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const displayUrl = preview || (currentUrl ? getMediaUrl(currentUrl) : null)

  return (
    <div className="space-y-2">
      <Label className="text-md font-medium text-title">{label}</Label>
      <div
        className="relative h-28 rounded-radius border border-dashed border-primary/20 hover:border-primary/50 bg-primary/5 flex items-center justify-center cursor-pointer overflow-hidden transition-all group"
        onClick={() => fileInputRef.current?.click()}
      >
        {displayUrl ? (
          <>
            <Image
              src={displayUrl}
              alt={label}
              width={100}
              height={100}
              className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-light-gray opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity backdrop-blur-[2px]">
              <div className="p-3 rounded-radius bg-primary text-white">
                <Upload className="w-4 h-4 " />
              </div>
            </div>
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-4 right-4 h-8 w-8 rounded-full bg-destructive/20 text-destructive hover:bg-destructive  hover:text-white opacity-0 group-hover:opacity-100 transition-all hover:scale-110 active:scale-90"
              onClick={(e) => {
                e.stopPropagation()
                setPreview(null)
                onRemove()
                if (fileInputRef.current) fileInputRef.current.value = ''
              }}
            >
              <X className="w-4 h-4" />
            </Button>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted-foreground/30 dark:text-primary transition-all duration-500">
            <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 scale-110 transition-all duration-500">
              <ImageIcon className="w-6 h-6 text-primary" />
            </div>
            <span className="text-md font-medium">{t('click_to_upload')}</span>
          </div>
        )}
        <Input
          type="file"
          ref={fileInputRef}
          className="hidden rounded-full"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) {
              onFileSelect(file)
              const reader = new FileReader()
              reader.onloadend = () => setPreview(reader.result as string)
              reader.readAsDataURL(file)
            }
          }}
        />
      </div>
    </div>
  )
}

export default InlineImageUpload
