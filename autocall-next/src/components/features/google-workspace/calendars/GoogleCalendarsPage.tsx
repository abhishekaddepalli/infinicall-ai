'use client'

import { Button } from '@/components/ui/button'
import { ROUTES } from '@/constants/routes'
import { GoogleCalendar } from '@/types/google-workspace'
import { ArrowLeft, Link2, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import CalendarEventsModal from './CalendarEventsModal'
import GoogleCalendarsTable from './GoogleCalendarsTable'
import LinkCalendarModal from './LinkCalendarModal'

export default function GoogleCalendarsPage() {
  const { t } = useTranslation()
  const router = useRouter()
  const [linkModalOpen, setLinkModalOpen] = useState(false)
  const [eventsModalOpen, setEventsModalOpen] = useState(false)
  const [calendarForEvents, setCalendarForEvents] = useState<GoogleCalendar | null>(null)

  const openEventsModal = (calendar: GoogleCalendar) => {
    setCalendarForEvents(calendar)
    setEventsModalOpen(true)
  }

  return (
    <div className="w-full  space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-title flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push(ROUTES.TOOLBOX_HUB_GOOGLE_WORKSPACE)}
              className="h-9 w-9 rounded-radius bg-primary/10 dark:bg-primary/20 text-primary transition-all duration-300 shadow-sm shrink-0 border-none border-primary/20"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            {t('googleCalendars', 'Google Calendars')}
          </h1>
        </div>

        <div className="flex gap-2 shrink-0">
          <Button
            onClick={() => setLinkModalOpen(true)}
            variant="outline"
            className="rounded-radius! p-padding! text-primary bg-primary/10 hover:bg-primary hover:text-white border-none font-medium transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Link2 className="h-4 w-4" />
            {t('linkCalendar', 'Link Calendar')}
          </Button>

          <Button
            onClick={() => router.push(ROUTES.TOOLBOX_HUB_GOOGLE_WORKSPACE_CALENDARS_CREATE)}
            className="rounded-radius! p-padding! text-white font-medium transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Plus className="h-4 w-4" strokeWidth={2.5} />
            {t('createCalendar', 'Create Calendar')}
          </Button>
        </div>
      </div>

      <GoogleCalendarsTable onViewEvents={openEventsModal} />

      <CalendarEventsModal
        isOpen={eventsModalOpen}
        onClose={() => { setEventsModalOpen(false); setCalendarForEvents(null) }}
        calendar={calendarForEvents}
      />

      <LinkCalendarModal
        isOpen={linkModalOpen}
        onClose={() => setLinkModalOpen(false)}
      />
    </div>
  )
}
