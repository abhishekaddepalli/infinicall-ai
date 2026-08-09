'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { DeleteConfirmationModalProps } from '@/types/reusable'
import { Trash2 } from 'lucide-react';
import { Loader2 } from '@/components/reusable/Loader2';
import React from 'react'
import { useTranslation } from 'react-i18next'

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  isLoading = false,
}) => {
  const { t } = useTranslation()

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px] max-w-[calc(100%-2rem)] p-6 overflow-hidden border-none rounded-2xl shadow-2xl bg-bg-card dark:border-white/10">
        <div >
          <DialogHeader className="mb-8">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-destructive/5 ring-1 ring-destructive/10 animate-in fade-in zoom-in duration-700">
              <div className="relative bg-destructive/10 p-4 rounded-full ring-8 ring-destructive/5">
                <Trash2 className="h-8 w-8 text-destructive" />
              </div>
            </div>

            <DialogTitle className="text-center text-2xl font-bold text-gray-900 dark:text-white leading-tight tracking-tight">{title}</DialogTitle>

            <DialogDescription className="text-center text-subtitle-color text-base leading-relaxed font-medium">
              {description}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex flex-row gap-4 sm:space-x-0">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 p-padding! mr-0! rounded-radius border border-input-border-color cursor-pointer bg-subcard dark:bg-subcard text-black dark:text-white text-md font-medium transition-all"
            >
              {t('cancel')}
            </Button>
            <Button
              variant="destructive"
              onClick={onConfirm}
              disabled={isLoading}
              className="flex-1 p-padding! mr-0! rounded-radius bg-destructive! text-white! cursor-pointer hover:text-white border border-input-border-color bg-subcard text-black dark:text-white text-md font-medium transition-all"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="size-4 animate-spin" />
                  <span>{t('deleting')}...</span>
                </div>
              ) : (
                <span>{t('delete')}</span>
              )}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}
