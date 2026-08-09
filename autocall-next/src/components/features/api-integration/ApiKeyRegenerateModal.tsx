import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ApiKeyRegenerateModalProps } from '@/types/api-key'
import { AlertTriangle } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function ApiKeyRegenerateModal({
  isOpen,
  onClose,
  onConfirm,
  isRegenerating,
}: ApiKeyRegenerateModalProps) {
  const { t } = useTranslation()

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md! max-w-[calc(100%-2rem)] bg-bg-card border-none rounded-modal-radius sm:p-6 p-4">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2.5 text-title">
            <AlertTriangle className="h-5 w-5" />
            <span>{t('regenerate_api_key')}</span>
          </DialogTitle>
          <DialogDescription className="text-md text-left rtl:text-right font-medium text-subtitle-color pt-2">
            {t('regenerate_api_key_desc', {
              defaultValue: 'Regenerating this key will immediately revoke the existing key. Any system currently using it will fail to authenticate until updated. Do you want to continue?',
            })}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="pt-2 gap-3 sm:gap-4 mt-2">
          <Button type="button" variant="outline" onClick={onClose} disabled={isRegenerating} className="flex-1 p-padding! mr-0! rounded-radius border border-input-border-color bg-subcard dark:bg-subcard text-black dark:text-white text-md font-medium transition-all">
            {t('cancel')}
          </Button>
          <Button onClick={onConfirm} disabled={isRegenerating} className="flex-1 p-padding! rounded-radius border-none bg-primary text-white text-md font-medium transition-all shadow-sm">
            {t('regenerate')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
