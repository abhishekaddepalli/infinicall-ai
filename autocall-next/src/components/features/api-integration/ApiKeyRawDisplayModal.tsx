import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { ApiKeyRawDisplayModalProps } from '@/types/api-key'
import { AlertTriangle, Check, Copy } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

export function ApiKeyRawDisplayModal({
  isOpen,
  onClose,
  newRawKey,
}: ApiKeyRawDisplayModalProps) {
  const { t } = useTranslation()
  const [isCopied, setIsCopied] = useState(false)
  const [hasSaved, setHasSaved] = useState(false)

  const [isClosing, setIsClosing] = useState(false)

  // Reset isClosing when the modal opens
  if (isOpen && isClosing) {
    setIsClosing(false)
  }

  const handleCopy = async () => {
    if (!newRawKey) return
    try {
      await navigator.clipboard.writeText(newRawKey)
      setIsCopied(true)
      toast.success(t('copied_success'))
      setTimeout(() => setIsCopied(false), 2000)
    } catch {
      toast.error(t('copied_failed'))
    }
  }

  const handleDone = (open?: boolean) => {
    if (isClosing) return

    if (open === false || open === undefined) {
      if (!hasSaved) {
        toast.error(t('confirm_save_key'))
        return
      }
      setIsClosing(true)
      onClose(false)
      // reset states after close animation
      setTimeout(() => {
        setHasSaved(false)
        setIsCopied(false)
        setIsClosing(false)
      }, 300)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleDone}>
      <DialogContent
        className="sm:max-w-xl! max-w-[calc(100%-2rem)]! bg-white dark:bg-slate-900 border-none rounded-modal-radius shadow-xl gap-0 p-0 overflow-hidden"
        hideCloseButton
        onInteractOutside={(e) => {
          e.preventDefault()
          handleDone(false)
        }}
        onEscapeKeyDown={(e) => {
          e.preventDefault()
          handleDone(false)
        }}
      >
        <div className="bg-amber-500/10 sm:p-6 p-4 flex items-center gap-4 border-b border-amber-500/15">
          <div className="bg-amber-500 text-white p-2 rounded-lg shrink-0 shadow-md">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white">
              {t('copy_api_key')}
            </DialogTitle>
            <p className="text-sm text-amber-700 dark:text-amber-400 font-semibold mt-1">
              {t('raw_key_warning', {
                defaultValue: 'Please copy this key now. For security reasons, it will not be displayed again.',
              })}
            </p>
          </div>
        </div>
        <div className="sm:p-6 p-4 space-y-6">
          <div className="flex items-center gap-3 p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50 font-mono text-sm break-all font-semibold select-all text-slate-800 dark:text-slate-100">
            <span className="flex-1">{newRawKey}</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCopy}
              className="h-10 w-10 bg-primary/15 dark:bg-slate-800 hover:bg-primary hover:text-white text-primary rounded-lg"
            >
              {isCopied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
          <div className="flex items-start space-x-2 px-1">
            <Checkbox
              id="confirm-save-regenerate"
              checked={hasSaved}
              onChange={(checked) => setHasSaved(checked as boolean)}
              className="mt-1 shrink-0"
            />
            <Label htmlFor="confirm-save-regenerate" className="text-md font-medium text-slate-700 dark:text-white cursor-pointer">
              {t('i_have_securely_saved_key')}
            </Label>
          </div>
          <DialogFooter className="pt-2">
            <Button
              type="button"
              disabled={isClosing}
              onClick={() => handleDone(false)}
              className="flex-1 p-padding! rounded-radius border-none bg-primary text-white text-md font-medium transition-all shadow-sm w-full"
            >
              {t('done')}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}
