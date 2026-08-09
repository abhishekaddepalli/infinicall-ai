'use client'

import { ImageDropzone } from '@/components/shared/ImageDropzone'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textArea'
import { currencySymbols } from '@/data/plan'
import { useCreateManualSubscriptionMutation } from '@/redux/api/subscriptionApi'
import { ManualCheckoutStepProps } from '@/types/plans'
import { Landmark, Loader2 } from 'lucide-react'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

const ManualCheckoutStep = ({ plan, onComplete, onBack }: ManualCheckoutStepProps) => {
  const { t } = useTranslation()
  const [createManualSubscription, { isLoading }] = useCreateManualSubscriptionMutation()

  const [formData, setFormData] = useState({
    bank_holder_name: '',
    bank_name: '',
    payment_reference: '',
    payment_date: '',
    notes: '',
  })
  const [receiptFile, setReceiptFile] = useState<File | null>(null)

  const symbol = currencySymbols[plan?.currency || 'USD'] || (plan?.currency || '$')
  const amount = plan?.amount || 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!plan?.id) {
      toast.error(t('plan_not_found', 'Plan not found'))
      return
    }

    if (!receiptFile) {
      toast.error(t('receipt_required', 'Transaction receipt is required'))
      return
    }

    try {
      const data = new FormData()
      data.append('plan_id', plan._id || plan.id)
      data.append('manual_payment_type', 'bank_transfer')
      data.append('bank_holder_name', formData.bank_holder_name)
      data.append('bank_name', formData.bank_name)
      data.append('payment_reference', formData.payment_reference)
      data.append('payment_date', formData.payment_date)
      data.append('notes', formData.notes)
      data.append('transaction_receipt', receiptFile)

      await createManualSubscription(data).unwrap()

      onComplete()
    } catch (error: any) {
      toast.error(error?.data?.message || t('manual_payment_failed', 'Failed to submit manual payment details'))
    }
  }

  return (
    <div className="sm:p-6 p-4 bg-bg-card">
      <div className="sm:mb-6 mb-4">
        <h2 className="text-xl font-bold text-title">{t('bank_transfer', 'Bank Transfer')}</h2>
        <p className="text-md text-subtitle-color">{t('enter_payment_details', 'Please enter your payment details below')}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="p-4 rounded-lg bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/10 flex justify-between items-center sm:mb-6 mb-4">
          <div className="flex flex-col">
            <span className="text-md font-medium text-subtitle-color">{t('amount_to_pay', 'Amount to Pay')}</span>
            <span className="text-2xl font-black text-primary tracking-tight">{symbol}{Number(amount).toFixed(2)}</span>
          </div>
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Landmark className="w-6 h-6 text-primary" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="bank_holder_name">{t('account_holder_name', 'Account Holder Name')} <span className="text-red-500">*</span></Label>
            <Input
              id="bank_holder_name"
              required
              value={formData.bank_holder_name}
              onChange={(e) => setFormData({ ...formData, bank_holder_name: e.target.value })}
              placeholder="John Doe"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bank_name">{t('bank_name', 'Bank Name')} <span className="text-red-500">*</span></Label>
            <Input
              id="bank_name"
              required
              value={formData.bank_name}
              onChange={(e) => setFormData({ ...formData, bank_name: e.target.value })}
              placeholder="e.g. Chase Bank"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="payment_reference">{t('transaction_id', 'Transaction ID / Ref No.')} <span className="text-red-500">*</span></Label>
            <Input
              id="payment_reference"
              required
              value={formData.payment_reference}
              onChange={(e) => setFormData({ ...formData, payment_reference: e.target.value })}
              placeholder="e.g. TXN123456789"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="payment_date">{t('payment_date', 'Payment Date')} <span className="text-red-500">*</span></Label>
            <Input
              id="payment_date"
              type="date"
              required
              value={formData.payment_date}
              onChange={(e) => setFormData({ ...formData, payment_date: e.target.value })}
            />
          </div>
        </div>

        <ImageDropzone
          label={t('transaction_receipt', 'Transaction Receipt') + ' *'}
          accept="image/*,application/pdf"
          file={receiptFile}
          onUpload={(file) => setReceiptFile(file)}
          onRemove={() => setReceiptFile(null)}
        />

        <div className="space-y-2">
          <Label htmlFor="notes">{t('notes_optional', 'Notes (Optional)')}</Label>
          <Textarea
            id="notes"
            rows={3}
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder={t('additional_notes', 'Any additional notes...')}
            className="resize-none"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            className="flex-1 rounded-lg h-10 p-padding! bg-primary/10 text-primary hover:bg-primary hover:text-white border-none"
            onClick={onBack}
            disabled={isLoading}
          >
            {t('back', 'Back')}
          </Button>
          <Button
            type="submit"
            className="flex-1 rounded-lg h-10 bg-primary p-padding! text-white hover:opacity-90 transition-opacity"
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {t('save', 'Save')}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default ManualCheckoutStep
