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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAddBonusCreditsMutation } from '@/redux/api/userApi'
import { ApiError } from '@/types/api'
import { BonusCreditsModalProps } from '@/types/user'
import { Gift } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

export function BonusCreditsModal({ isOpen, onClose, user }: BonusCreditsModalProps) {
  const { t } = useTranslation()
  const [credits, setCredits] = useState<number | ''>('')
  const [addBonusCredits, { isLoading }] = useAddBonusCreditsMutation()

  useEffect(() => {
    if (isOpen) {
      setCredits('')
    }
  }, [isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !credits || credits <= 0) return

    try {
      const res = await addBonusCredits({
        id: user.id || (user as any)._id,
        amount: Number(credits)
      }).unwrap()
      toast.success(res.message || t('bonus_credits_added_successfully', 'Bonus credits added successfully'))
      onClose()
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t('failed_to_add_bonus_credits', 'Failed to add bonus credits'))
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md! gap-0! max-w-[calc(100%-2rem)]! sm:p-6 p-4 border-none rounded-modal-radius shadow-2xl bg-bg-card">
        <DialogHeader className="pb-3 border-b mb-0 border-input-border-color">
          <div className="flex items-center gap-3 mb-0">
            <DialogTitle className="text-xl font-bold text-title">{t('add_bonus_credits', 'Add Bonus Credits')}</DialogTitle>
          </div>
          <DialogDescription className="pt-2 text-subtitle-color text-left rtl:text-right font-medium">
            {t('add_bonus_credits_description', 'Enter the number of bonus credits you want to add for')} <span className="font-bold text-title">{user?.name}</span>.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="pt-5 space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="credits" className="text-md font-bold text-title">{t('bonus_credits', 'Bonus Credits')}</Label>
            <Input
              id="credits"
              type="number"
              min="1"
              value={credits}
              onChange={(e) => setCredits(e.target.value ? Number(e.target.value) : '')}
              placeholder={t('enter_credits', 'Enter credits')}
              className="rounded-radius border border-input-border-color h-11 w-full bg-transparent text-title placeholder:text-subtitle-color focus-visible:ring-1 focus-visible:ring-primary"
              required
            />
          </div>
          <DialogFooter className="pt-2 gap-3 sm:gap-4 mt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading} className="flex-1 p-padding! mr-0! ml-0! rounded-radius border border-input-border-color bg-subcard dark:bg-subcard text-title text-md font-medium transition-all hover:bg-black/5 dark:hover:bg-white/5">
              {t('cancel', 'Cancel')}
            </Button>
            <Button type="submit" disabled={isLoading || !credits || credits <= 0} className="flex-1 p-padding! rounded-radius border-none bg-primary text-white text-md font-medium transition-all hover:opacity-90">
              {isLoading ? (
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              ) : (
                <Gift className="h-4 w-4 mr-2 rtl:mr-0 rtl:ml-2" />
              )}
              {t('add_credits', 'Add Credits')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
