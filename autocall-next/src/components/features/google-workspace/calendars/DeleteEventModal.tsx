'use client'

import { Loader2 } from '@/components/reusable/Loader2';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { DeleteEventModalProps } from '@/types/google-workspace';
import { Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function DeleteEventModal({
  open,
  onClose,
  onConfirm,
  loading = false,
  eventTitle,
}: DeleteEventModalProps) {
  const { t } = useTranslation()

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v && !loading) onClose() }}>
      <DialogContent className="max-w-md p-0 overflow-hidden rounded-radius border-none shadow-xl flex flex-col">
        <DialogHeader className="px-6 py-5 border-b border-input-border-color shrink-0 bg-card">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-red-50 dark:bg-red-950/30 rounded-lg shrink-0">
              <Trash2 className="w-5 h-5 text-red-600 dark:text-red-500" />
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold text-title-color">
                {t('deleteEvent', 'Delete Event')}
              </DialogTitle>
              <p className="text-sm text-subtitle-color mt-0.5">
                {t('confirmDeleteEvent', 'Are you sure you want to delete this event?')}
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="p-6 bg-card-color flex flex-col gap-4">
          <p className="text-sm text-subtitle-color leading-relaxed">
            {t('this_action_cannot_be_undone_this_will_permanently_delete_the_event_from_your_google_calendar', 'This action cannot be undone. This will permanently delete the event from your Google Calendar.')}
          </p>

          <div className="rounded-radius border border-input-border-colorbg-bg-cardp-4 flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-title-color truncate">
                {eventTitle || t('no_title', '(No title)')}
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t border-input-border-colorbg-bg-cardshrink-0">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={loading}
            className="rounded-radius h-11 hover:bg-destructive/10 hover:text-destructive px-6 text-subtitle-color font-medium transition-colors"
          >
            {t('cancel', 'Cancel')}
          </Button>

          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={loading}
            className="rounded-radius h-11 bg-destructive hover:bg-destructive/90 text-white font-medium border-none px-6 gap-2 transition-colors"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
            {t('delete', 'Delete')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}