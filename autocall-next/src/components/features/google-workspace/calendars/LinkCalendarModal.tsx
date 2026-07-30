import { Loader2 } from '@/components/reusable/Loader2'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { LinkCalendarModalProps } from '@/types/google-workspace'
import { Link2, RefreshCw } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { useGoogleCalendars } from './hooks/useGoogleCalendars'

export default function LinkCalendarModal({ isOpen, onClose }: LinkCalendarModalProps) {
  const { t } = useTranslation()
  const { accounts, handleFetchCalendars, handleCreate, isCreating } = useGoogleCalendars()
  const [availableCalendars, setAvailableCalendars] = useState<any[]>([])
  const [isFetching, setIsFetching] = useState(false)
  const [isLinking, setIsLinking] = useState(false)

  const [currentAccountId, setCurrentAccountId] = useState('')
  const [currentCalendarId, setCurrentCalendarId] = useState('')

  const handleFetch = async (accountId: string) => {
    if (!accountId) return
    setCurrentAccountId(accountId)
    setIsFetching(true)
    try {
      const calendars = await handleFetchCalendars(accountId)
      setAvailableCalendars(calendars)
      setCurrentCalendarId('')
    } finally {
      setIsFetching(false)
    }
  }

  const submitLink = async () => {
    if (!currentAccountId || !currentCalendarId) return
    setIsLinking(true)
    try {
      const freshCalendars = await handleFetchCalendars(currentAccountId)

      const cal = freshCalendars.find((c: any) => c.id === currentCalendarId)
        ?? availableCalendars.find((c: any) => c.id === currentCalendarId)

      if (!cal) {
        toast.error('Selected calendar not found. Please click Fetch and try again.')
        return
      }

      await handleCreate({
        google_account_id: currentAccountId,
        calendar_id: cal.id,
        name: cal.summary,
        timezone: cal.timeZone || t('utc'),
        create_in_google: false,
      } as any)

      handleClose()
    } catch {
    } finally {
      setIsLinking(false)
    }
  }

  const handleClose = () => {
    onClose()
    setAvailableCalendars([])
    setCurrentAccountId('')
    setCurrentCalendarId('')
  }

  const busy = isFetching || isLinking || isCreating

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open && !busy) handleClose() }}>
      <DialogContent className="sm:max-w-md! max-w-[calc(100%-2rem)] max-h-[90vh] gap-0 p-0 overflow-auto no-scrollbar rounded-radius border-none shadow-xl flex flex-col">
        <DialogHeader className="sm:px-6 px-4 py-5 border-b border-input-border-color shrink-0 bg-bg-card mb-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary/10 rounded-lg shrink-0">
              <Link2 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-lg text-left rtl:text-right font-semibold text-title">
                {t('linked_google_calendars')}
              </DialogTitle>
              <p className="text-sm text-left rtl:text-right text-subtitle-color mt-0.5">
                {t('fetch_calendars_from_your_google_account_and_link_one_to_this_platform')}
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="sm:p-6 p-4 bg-bg-card flex flex-col gap-6">
          <div className="flex gap-4 items-end flex-col sm:flex-row">
            <div className="flex-1 space-y-2">
              <Label className="text-sm font-medium text-title">{t('select_google_account', 'Select Google Account')}</Label>
              <Select value={currentAccountId} onValueChange={(val) => {
                setCurrentAccountId(val)
                setAvailableCalendars([])
                setCurrentCalendarId('')
              }}>
                <SelectTrigger className="h-11 rounded-lg border-input-border-color bg-bg-card text-title shadow-none">
                  <SelectValue placeholder={t('select_a_google_account', 'Select a Google Account')} />
                </SelectTrigger>
                <SelectContent className="rounded-radius border-input-border-color">
                  {accounts.length === 0 ? (
                    <SelectItem value="__none__" disabled>{t('no_accounts_connected', 'No accounts connected')}</SelectItem>
                  ) : accounts.map(a => (
                    <SelectItem key={(a as any).id || a._id} value={(a as any).id || a._id}>{a.email}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              type="button"
              onClick={() => handleFetch(currentAccountId)}
              disabled={!currentAccountId || isFetching}
              className="h-11 rounded-radius bg-primary text-white font-medium border-none px-6 gap-2 hover:bg-primary/90 transition-colors"
            >
              {isFetching ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
              {isFetching ? t('fetching', 'Fetching…') : t('fetch', 'Fetch')}
            </Button>
          </div>

          {availableCalendars.length > 0 && (
            <div className="space-y-2">
              <Label className="text-sm font-medium text-title">{t('select_calendar_to_link', 'Select Calendar to Link')}</Label>
              <Select value={currentCalendarId} onValueChange={setCurrentCalendarId}>
                <SelectTrigger className="h-11 shadow-none rounded-radius border-input-border-color bg-bg-card text-title-color">
                  <SelectValue placeholder={t('select_a_calendar', 'Select a Calendar')} />
                </SelectTrigger>
                <SelectContent className="rounded-radius border-input-border-color max-h-[250px]">
                  {availableCalendars.map(c => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.summary}{c.primary ? ' (Primary)' : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {availableCalendars.length === 0 && currentAccountId && !isFetching && (
            <div className="bg-primary/5 border border-primary/20 rounded-radius p-4 flex items-start gap-3">
              <div className="p-1.5 bg-primary/10 rounded-md shrink-0">
                <RefreshCw className="w-4 h-4 text-primary" />
              </div>
              <p className="text-sm text-subtitle-color leading-relaxed">
                {t('click')} <span className="font-medium text-title-color">{t('fetch')}</span> {t('to_load_available_calendars_from_your_google_account')}.
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t border-input-border-color bg-bg-card shrink-0">
          <Button
            variant="ghost"
            onClick={handleClose}
            disabled={busy}
            className="rounded-lg border-input-border-color h-11 bg-subcard sm:px-6 px-4 text-subtitle-color font-medium transition-colors"
          >
            {t('cancel')}
          </Button>
          <Button
            type="button"
            onClick={submitLink}
            disabled={!currentCalendarId || busy}
            className="rounded-radius h-11 bg-primary text-white font-medium border-none px-6 gap-2 hover:bg-primary/90 transition-colors"
          >
            {(isLinking || isCreating) ? <Loader2 className="w-4 h-4 animate-spin" /> : <Link2 className="w-4 h-4" />}
            {(isLinking || isCreating) ? t('linking') : t('link_calendar')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
