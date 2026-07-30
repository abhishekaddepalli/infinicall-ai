import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { DisconnectAccountModalProps } from '@/types/google-workspace'
import { useTranslation } from 'react-i18next'

export default function DisconnectAccountModal({
  isOpen,
  onClose,
  onConfirm,
  isDeleting,
}: DisconnectAccountModalProps) {
  const { t } = useTranslation()
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('disconnect_google_account')}</DialogTitle>
          <DialogDescription>
            {t('disconnect_google_account_desc')}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isDeleting}>
            {t('cancel')}
          </Button>
          <Button variant="destructive" onClick={onConfirm} isLoading={isDeleting}>
            {t('disconnect')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
