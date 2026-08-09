'use client'

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { AppointmentCalendarViewProps } from '@/types/appointment'
import { useTranslation } from 'react-i18next'

export function AppointmentCalendarView({
  events,
  onEventClick,
}: AppointmentCalendarViewProps) {
  const { t } = useTranslation()

  return (
    <div className="bg-bg-card border border-input-border-color rounded-radius overflow-hidden sm:p-6 p-4 animate-in fade-in duration-300">

      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay',
        }}
        buttonText={{
          today: t('today'),
          month: t('month'),
          week: t('week'),
          day: t('day'),
        }}
        events={events}
        eventClick={onEventClick}
        height="auto"
        eventTimeFormat={{
          hour: 'numeric',
          minute: '2-digit',
          meridiem: 'short',
        }}
        dayMaxEvents={true}
      />
    </div>
  )
}
