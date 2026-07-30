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
import { DeleteSourceModalProps } from '@/types/google-workspace'
import { AlertTriangle, CloudOff, MonitorX, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function DeleteSourceModal({
  isOpen,
  onClose,
  onConfirm,
  isDeleting = false,
  title = 'Delete Item',
  description = 'Choose where to delete this item from.',
  itemCount = 1,
}: DeleteSourceModalProps) {
  const [selected, setSelected] = useState<'system' | 'google'>('system')
    const { t } = useTranslation()

  const handleConfirm = () => {
    onConfirm(selected)
  }

  const handleClose = () => {
    if (!isDeleting) {
      setSelected('system')
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-md! max-w-[calc(100%-2rem)]! gap-0 overflow-auto max-h-[90vh] no-scrollbar border-none p-4! sm:p-6!">
        <DialogHeader className="text-left rtl:text-right pr-8 rtl:pr-0 rtl:pl-8">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-red-100 dark:bg-red-500/20 rounded-lg shrink-0 mt-0.5">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div className="flex flex-col gap-1 min-w-0">
              <DialogTitle className="text-lg font-semibold text-left rtl:text-right break-words">{title}</DialogTitle>
              <DialogDescription className="text-sm text-subtitle-color text-left rtl:text-right">
                {itemCount > 1
                  ? `You are about to delete ${itemCount} items. ${description}`
                  : description}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-3 mt-2">
          <p className="text-sm font-medium text-subtitle-color">{t('where_should_this_be_deleted_from')}</p>

          {/* Option 1: System Only */}
          <Button
            type="button"
            onClick={() => setSelected('system')}
            className={`w-full h-auto min-h-[103px] rounded-radius! flex items-start gap-3 p-4 rounded-lg border-2 text-left rtl:text-right transition-all ${
              selected === 'system'
                ? 'border-primary bg-primary/5 dark:bg-primary/10'
                : 'border-input-border-color! bg-subcard hover:border-primary/50 '
            }`}
          >
            <div className={`p-2 rounded-lg mt-0.5 shrink-0 ${selected === 'system' ? 'bg-primary/10' : 'bg-muted'}`}>
              <MonitorX className={`h-4 w-4 ${selected === 'system' ? 'text-primary' : 'text-muted-foreground'}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm break-words whitespace-normal">{t('remove_from_system_only')}</p>
              <p className="text-xs text-muted-foreground mt-0.5 break-words whitespace-normal">
                {t('remove_from_system_only_desc')}
              </p>
            </div>
            <div className={`ml-auto mt-1 h-4 w-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
              selected === 'system' ? 'border-primary bg-primary' : 'border-muted-foreground'
            }`}>
              {selected === 'system' && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
            </div>
          </Button>

          {/* Option 2: System + Google */}
          <Button
            type="button"
            onClick={() => setSelected('google')}
            className={`w-full h-auto min-h-[103px] rounded-radius! flex items-start gap-3 p-4 rounded-lg border-2 text-left rtl:text-right transition-all ${
              selected === 'google'
                ? 'border-red-500! bg-red-50! dark:bg-red-500/10!'
                : 'border-input-border-color! bg-subcard hover:border-red-400/50! !'
            }`}
          >
            <div className={`p-2 rounded-lg mt-0.5 shrink-0 ${selected === 'google' ? 'bg-red-100 dark:bg-red-500/20' : 'bg-muted'}`}>
              <CloudOff className={`h-4 w-4 ${selected === 'google' ? 'text-red-600 dark:text-red-400' : 'text-muted-foreground'}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-red-700 dark:text-red-400 break-words whitespace-normal">{t('delete_from_system_and_google')}</p>
              <p className="text-xs text-muted-foreground mt-0.5 break-words whitespace-normal">
                {t('delete_from_system_and_google_desc')}
              </p>
            </div>
            <div className={`ml-auto mt-1 h-4 w-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
              selected === 'google' ? 'border-red-500 bg-red-500' : 'border-muted-foreground'
            }`}>
              {selected === 'google' && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
            </div>
          </Button>
        </div>

        <DialogFooter className="mt-4 gap-2 sm:gap-0">
          <Button variant="outline" onClick={handleClose} disabled={isDeleting} className='w-full sm:w-auto rounded-radius! p-padding! text-subtitle-color bg-subcard border-input-border-color h-12 mr-0 font-bold transition-all duration-300 flex items-center justify-center gap-2'>
            {t('cancel')}
          </Button>
          <Button
            onClick={handleConfirm}
            isLoading={isDeleting}
            className="w-full sm:w-auto rounded-radius! p-padding! bg-destructive text-white h-12 font-bold transition-all duration-300 flex items-center justify-center gap-2"
          >
            {!isDeleting && <Trash2 className="h-4 w-4" />}
            {isDeleting ? t('deleting') : selected === 'google' ? t('delete_from_both') : t('remove_from_system')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
