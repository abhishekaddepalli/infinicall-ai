'use client'

import { Loader2 } from '@/components/reusable/Loader2'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { EmailTestModalProps } from '@/types/settings'
import { Send } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const EmailTestModal = ({ show, onClose, onSend, testEmail, setTestEmail, isTesting }: EmailTestModalProps) => {
  const { t } = useTranslation()

  return (
    <Dialog open={show} onOpenChange={onClose}>
      <DialogContent onOpenAutoFocus={(e) => e.preventDefault()} className="border-glass-border bg-light-body dark:bg-modal-bg-color backdrop-blur-2xl rounded-border-radius sm:p-6 p-4 sm:max-w-lg! max-w-[calc(100%-2rem)]! shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)]">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-xl font-medium">{t('send_test_email')}</DialogTitle>
          <DialogDescription className="font-medium text-left rtl:text-right">{t('enter_test_email_desc')}</DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          <div className="space-y-2 flex flex-col">
            <Label htmlFor="testEmail" className="text-md font-medium ml-1">
              {t('recipient_email')}
            </Label>
            <Input
              id="testEmail"
              type="email"
              placeholder="you@example.com"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              className="h-12 rounded-[8px] glass-card glass-dark-card focus:ring-primary/20"
            />
          </div>
        </div>
        <DialogFooter className="pt-2 gap-3 sm:gap-4 mt-2">
          <Button type="button" variant="outline" onClick={onClose} className="flex-1 p-padding! mr-0! rounded-radius border border-input-border-color bg-subcard dark:bg-subcard text-black dark:text-white text-md font-medium transition-all">
            {t('cancel')}
          </Button>
          <Button type="button" onClick={onSend} disabled={isTesting || !testEmail} className="flex-1 p-padding! rounded-radius border-none bg-primary text-white text-md font-medium transition-all shadow-sm">
            {isTesting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
            {t('send_test')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default EmailTestModal
