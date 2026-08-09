'use client'

import { Loader2 } from '@/components/reusable/Loader2'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { useTakeActionMutation } from '@/redux/api/restrictedWordsApi'
import { CallLog } from '@/types/flow'
import { AlertCircle, Ban, MailWarning, Unlock, User } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

export default function TakeActionModal({ isOpen, onClose, user }: { isOpen: boolean, onClose: () => void, user: CallLog }) {
  const { t } = useTranslation()
  const [loadingAction, setLoadingAction] = useState<'warning' | 'block' | 'unblock' | null>(null)
  const [takeAction] = useTakeActionMutation()

  const isBlocked = user.contact_id?.is_blocked === true;

  const handleTakeAction = async (actionType: 'warning' | 'block' | 'unblock') => {
    try {
      setLoadingAction(actionType)
      await takeAction({ id: (user.id || user._id) as string, action: actionType }).unwrap()
      if (actionType === 'warning') toast.success(t('warning_sent_successfully') || 'Warning email sent successfully')
      else if (actionType === 'block') toast.success(t('user_blocked_successfully') || 'User blocked successfully')
      else toast.success(t('user_unblocked_successfully') || 'User unblocked successfully')
      onClose()
    } catch (error: any) {
      toast.error(error?.data?.error || t('failed_to_take_action'))
    } finally {
      setLoadingAction(null)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]! max-w-[calc(100%-2rem)]! border-none bg-bg-card max-h-[90vh] overflow-y-auto no-scrollbar p-0 rounded-modal-radius">
        <div className="sm:p-6 p-4">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-xl font-bold text-title flex items-center gap-2">
              {t('take_action')}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 p-3 bg-input-bg/50 rounded-lg border border-input-border-color">
                <div className={`h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0 ${isBlocked ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'}`}>
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-base font-medium text-subtitle-color break-all whitespace-normal line-clamp-1">
                    {t('user')}
                    {isBlocked && (
                      <span className="px-2 py-0.5 rounded-full bg-destructive text-white text-[10px] font-bold uppercase tracking-wider">
                        {t('blocked') || 'Blocked'}
                      </span>
                    )}
                  </p>
                  <p className="font-semibold text-title text-md break-all whitespace-normal line-clamp-1">
                    {user.contact_id ? `${user.contact_id.first_name} ${user.contact_id.last_name}` : t('unknown')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-destructive/5 rounded-lg border border-destructive/20">
                <div className="h-10 w-10 rounded-lg bg-destructive/10 flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <p className="text-base font-medium text-destructive break-all whitespace-normal line-clamp-1">{t('detected_words')}</p>
                  <p className="font-semibold text-destructive text-md break-all whitespace-normal line-clamp-1">
                    {user.detected_words?.join(', ') || t('none')}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-2 sm:pt-6 pt-4 border-t border-input-border-color">
              <Label className="text-base font-semibold text-title block mb-4">
                {t('select_action')}
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleTakeAction('warning')}
                  disabled={loadingAction !== null || isBlocked}
                  className={`relative h-auto py-5 flex flex-col items-center justify-center gap-3 border-2 transition-all rounded-lg ${isBlocked
                    ? 'border-input-border-color bg-input-bg/50 text-subtitle-color opacity-70 cursor-not-allowed'
                    : 'border-primary/20 hover:border-primary hover:bg-primary/5 text-primary'
                    }`}
                >
                  <MailWarning className="w-8 h-8" />
                  <div className="flex flex-col items-center">
                    <span className="font-semibold text-base">{t('send_warning') || 'Send Warning'}</span>
                    <span className={`text-md font-medium mt-1 ${isBlocked ? 'text-subtitle-color' : 'text-primary'}`}>{t('send_warning_email') || 'Email user a warning'}</span>
                  </div>
                  {loadingAction === 'warning' && (
                    <div className="absolute top-3 right-3">
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    </div>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleTakeAction(isBlocked ? 'unblock' : 'block')}
                  disabled={loadingAction !== null}
                  className={`relative h-auto py-5 flex flex-col items-center justify-center gap-3 border-2 transition-all rounded-xl shadow-sm hover:shadow-md ${isBlocked
                    ? 'border-primary/20 hover:border-primary hover:bg-primary/5 text-primary'
                    : 'border-destructive/20 hover:border-destructive hover:bg-destructive/5 text-destructive'
                    }`}
                >
                  {isBlocked ? <Unlock className="w-8 h-8" /> : <Ban className="w-8 h-8" />}
                  <div className="flex flex-col items-center">
                    <span className="font-semibold text-base">
                      {isBlocked ? (t('unblock_user') || 'Unblock User') : (t('block_user') || 'Block User')}
                    </span>
                    <span className={`text-md font-medium mt-1 ${isBlocked ? 'text-primary' : 'text-destructive'}`}>
                      {isBlocked ? (t('unblock_user_desc') || 'Restore user access') : (t('block_user_desc') || 'Prevent future access')}
                    </span>
                  </div>
                  {(loadingAction === 'block' || loadingAction === 'unblock') && (
                    <div className="absolute top-3 right-3">
                      <Loader2 className={`h-4 w-4 animate-spin ${isBlocked ? 'text-primary' : 'text-destructive'}`} />
                    </div>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
