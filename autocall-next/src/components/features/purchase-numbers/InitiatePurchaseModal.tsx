import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { InitiatePurchaseModalProps } from '@/types/number-purchase-components'
import { CreditCard } from 'lucide-react';
import { Loader2 } from '@/components/reusable/Loader2';
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function InitiatePurchaseModal({
  isOpen,
  onClose,
  phoneNumber,
  onSubmit,
  isLoading,
}: InitiatePurchaseModalProps) {
  const { t } = useTranslation()
  const [paymentMethod, setPaymentMethod] = useState<string>('stripe')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!phoneNumber) return
    const id = phoneNumber._id || phoneNumber.id
    await onSubmit({ phone_number_id: id, payment_gateway: paymentMethod })
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md! max-w-[calc(100%-2rem)]! rounded-modal-radius gap-0! border-none max-h-[90vh] no-scrollbar overflow-auto sm:p-6 p-4">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <DialogTitle className="text-xl">
              {t('purchase_number', 'Purchase Number')}
            </DialogTitle>
          </div>
          <DialogDescription className='text-subtitile-color text-left rtl:text-right'>
            {t('purchase_number_desc', 'Select a payment method to complete your purchase.')}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {phoneNumber && (
            <div className="bg-subcard p-4 rounded-lg border border-input-border-color">
              <div className="flex justify-between items-center mb-2">
                <span className="text-md font-semibold text-subtitle-color break-all whitespace-normal line-clamp-1">{t('selected_number', 'Selected Number')}</span>
                <span className="text-sm font-bold text-title dark:text-white">{phoneNumber.phone_number}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-md font-semibold text-subtitle-color break-all whitespace-normal line-clamp-1">{t('price', 'Price')}</span>
                <span className="text-sm font-black text-primary">${phoneNumber.purchase_price?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="flex justify-between items-center mt-2 pt-2 border-t border-input-border-color">
                <span className="text-md font-semibold text-subtitle-color break-all whitespace-normal line-clamp-1">{t('validity', 'Validity')}</span>
                <span className="text-sm font-bold text-title dark:text-white">
                  {phoneNumber.validity_days ? `${phoneNumber.validity_days} ${t('days', 'Days')}` : t('lifetime', 'Lifetime')}
                </span>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <Label className="text-md font-semibold">{t('payment_method', 'Payment Method')}</Label>
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
              <div className="flex flex-col gap-3">
                <Label htmlFor="stripe" className="flex items-center space-x-3 border border-input-border-color p-4 rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-white/5 transition-colors [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/5">
                  <RadioGroupItem value="stripe" id="stripe" />
                  <div className="flex items-center gap-2 cursor-pointer w-full font-bold">
                    <CreditCard className="w-5 h-5 text-primary" />
                    {t('pay_with_stripe', 'Pay with Stripe')}
                  </div>
                </Label>

                <Label htmlFor="paypal" className="flex items-center space-x-3 border border-input-border-color p-4 rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-white/5 transition-colors [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/5">
                  <RadioGroupItem value="paypal" id="paypal" />
                  <div className="flex items-center gap-2 cursor-pointer w-full font-bold">
                    <CreditCard className="w-5 h-5 text-[#003087]" />
                    {t('pay_with_paypal', 'Pay with PayPal')}
                  </div>
                </Label>

              </div>
            </RadioGroup>
          </div>

          <DialogFooter className="pt-2 gap-3 sm:gap-4 mt-4">
            <Button type="button" variant="outline" onClick={onClose} className="w-full flex-1 rounded-lg p-padding! bg-subcard border border-input-border-color mr-0">
              {t('cancel')}
            </Button>
            <Button type="submit" disabled={isLoading} className="w-full flex-1 rounded-lg p-padding! bg-primary text-white">
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {t('proceed_to_pay', 'Proceed to Pay')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
