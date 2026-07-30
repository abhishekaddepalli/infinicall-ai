import { Loader2 } from '@/components/reusable/Loader2'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CreateEditCalendarModalProps } from '@/types/google-workspace'
import { Calendar } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useGoogleCalendars } from './hooks/useGoogleCalendars'

export default function CreateEditCalendarModal({
  isOpen,
  onClose,
  calendarToEdit,
}: CreateEditCalendarModalProps) {
  const { t } = useTranslation()
  const { accounts, handleCreate, handleUpdate, isCreating, isUpdating } = useGoogleCalendars()

  const [formData, setFormData] = useState<{
    name: string;
    google_account_id: string;
    calendar_id: string;
    timezone: string;
    description: string;
  }>({
    name: '',
    google_account_id: '',
    calendar_id: '',
    timezone: 'UTC',
    description: '',
  })

  useEffect(() => {
    if (calendarToEdit) {
      setFormData({
        name: calendarToEdit.name,
        google_account_id: typeof calendarToEdit.google_account_id === 'object' ? calendarToEdit.google_account_id._id : calendarToEdit.google_account_id,
        calendar_id: calendarToEdit.calendar_id,
        timezone: calendarToEdit.timezone || t('utc'),
        description: calendarToEdit.description || '',
      })
    } else {
      setFormData({
        name: '',
        google_account_id: '',
        calendar_id: '',
        timezone: 'UTC',
        description: '',
      })
    }
  }, [calendarToEdit, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.google_account_id || !formData.calendar_id) return

    if (calendarToEdit) {
      await handleUpdate(calendarToEdit._id, formData)
    } else {
      await handleCreate(formData)
    }
    onClose()
  }

  const busy = isCreating || isUpdating

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open && !busy) onClose() }}>
      <DialogContent className="max-w-md p-0 overflow-hidden rounded-radius border-none shadow-xl flex flex-col">
        <DialogHeader className="px-6 py-5 border-b border-input-border-color shrink-0 bg-card">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary/10 rounded-lg shrink-0">
              <Calendar className="w-5 h-5 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold text-title-color">
                {calendarToEdit ? t('edit_google_calendar', 'Edit Google Calendar') : t('add_google_calendar', 'Add Google Calendar')}
              </DialogTitle>
              <p className="text-sm text-subtitle-color mt-0.5">
                {calendarToEdit ? t('update_the_details_for_this_calendar', 'Update the details for this calendar') : t('create_or_link_a_new_calendar', 'Create or link a new calendar')}
              </p>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="p-6 bg-card-color flex flex-col gap-5 overflow-y-auto max-h-[60vh]">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-title-color">{t('google_account', 'Google Account')} <span className="text-red-500">*</span></Label>
              <Select
                value={formData.google_account_id}
                onValueChange={(val) => setFormData(prev => ({ ...prev, google_account_id: val }))}
              >
                <SelectTrigger className="h-11 rounded-radius border-input-border-color bg-bg-card text-title-color">
                  <SelectValue placeholder={t('select_a_google_account', 'Select a Google Account')} />
                </SelectTrigger>
                <SelectContent className="rounded-radius border-input-border-color">
                  {accounts.map(acc => (
                    <SelectItem key={acc._id} value={acc._id}>{acc.email}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-title-color">{t('calendar_name', 'Calendar Name')} <span className="text-red-500">*</span></Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder={t('eg_my_primary_calendar', 'e.g. My Primary Calendar')}
                className="h-11 rounded-radius border-input-border-colorbg-bg-card text-title-color"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-title-color">{t('calendar_id', 'Calendar ID')} <span className="text-red-500">*</span></Label>
              <Input
                value={formData.calendar_id}
                onChange={(e) => setFormData(prev => ({ ...prev, calendar_id: e.target.value }))}
                placeholder={t('eg_primary_or_custom_id', 'e.g. primary or custom ID')}
                className="h-11 rounded-radius border-input-border-colorbg-bg-card text-title-color"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-title-color">{t('timezone', 'Timezone')}</Label>
              <Input
                value={formData.timezone}
                onChange={(e) => setFormData(prev => ({ ...prev, timezone: e.target.value }))}
                placeholder={t('eg_utc', 'e.g. UTC')}
                className="h-11 rounded-radius border-input-border-colorbg-bg-card text-title-color"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-title-color">{t('description', 'Description')}</Label>
              <Input
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder={t('optional_description', 'Optional description')}
                className="h-11 rounded-radius border-input-border-colorbg-bg-card text-title-color"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 px-6 py-4 border-t border-input-border-colorbg-bg-cardshrink-0">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={busy}
              className="rounded-radius h-11 hover:bg-destructive/10 hover:text-destructive px-6 text-subtitle-color font-medium transition-colors"
            >
              {t('cancel')}
            </Button>
            <Button
              type="submit"
              disabled={busy || !formData.name || !formData.google_account_id || !formData.calendar_id}
              className="rounded-radius h-11 bg-primary text-white font-medium border-none px-6 gap-2 hover:bg-primary/90 transition-colors"
            >
              {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {calendarToEdit ? t('save_changes') : t('create')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
