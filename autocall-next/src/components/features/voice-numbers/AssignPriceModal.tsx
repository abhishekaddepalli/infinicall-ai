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
import { AssignPriceModalProps } from '@/types/number-purchase-components'
import { CalendarDays, DollarSign } from 'lucide-react';
import { Loader2 } from '@/components/reusable/Loader2';
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function AssignPriceModal({
  isOpen,
  onClose,
  phoneNumber,
  onSubmit,
  isLoading,
}: AssignPriceModalProps) {
  const { t } = useTranslation()
  const [price, setPrice] = useState<string>('')
  const [validityDays, setValidityDays] = useState<string>('')

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isOpen && phoneNumber) {
        setPrice(phoneNumber.purchase_price?.toString() || '0')
        setValidityDays(phoneNumber.validity_days?.toString() || '0')
      } else {
        setPrice('')
        setValidityDays('')
      }
    }, 0)
    return () => clearTimeout(timer)
  }, [isOpen, phoneNumber])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!phoneNumber) return
    await onSubmit({
      purchase_price: Number(price) || 0,
      validity_days: Number(validityDays) || 0
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent onOpenAutoFocus={(e) => e.preventDefault()} className="sm:max-w-md! max-w-[calc(100%-2rem)]! rounded-modal-radius gap-0! border-none max-h-[90vh] no-scrollbar overflow-auto sm:p-6 p-4">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <DialogTitle className="text-xl">
              {t('assign_price', 'Assign Price')}
            </DialogTitle>
          </div>
          <DialogDescription className='text-subtitile-color text-left rtl:text-right'>
            {t('assign_price_desc', 'Set a purchase price for this phone number.')}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-semibold">{t('price_usd', 'Price (USD)')}</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-subtitle-color" />
              <Input
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="pl-9 bg-input-color"
                placeholder="0.00"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold">{t('validity_days', 'Validity Days (0 for lifetime)')}</Label>
            <div className="relative">
              <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-subtitle-color" />
              <Input
                type="number"
                min="0"
                step="1"
                value={validityDays}
                onChange={(e) => setValidityDays(e.target.value)}
                className="pl-9 bg-input-color"
                placeholder="0"
                required
              />
            </div>
          </div>
          <DialogFooter className="pt-2 gap-3 sm:gap-4 mt-2">
            <Button type="button" variant="outline" onClick={onClose} className="w-full flex-1  bg-subcard border border-input-border-color rounded-lg p-padding! mr-0">
              {t('cancel')}
            </Button>
            <Button type="submit" disabled={isLoading} className="w-full flex-1 bg-primary text-white rounded-lg p-padding!">
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {t('save')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
