'use client'

import { Loader2 } from '@/components/reusable/Loader2'
import Spinner from '@/components/reusable/Spinner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textArea'
import {
  useCreateEventMutation,
  useDeleteEventMutation,
  useListEventsQuery,
  useUpdateEventMutation,
} from '@/redux/api/googleCalendarsApi'
import { CalendarEvent, CalendarEventsModalProps } from '@/types/google-workspace'
import { format } from 'date-fns'
import { Calendar as CalendarIcon, Clock, Edit2, ExternalLink, MapPin, Plus, Save, Trash2, X } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import DeleteEventModal from './DeleteEventModal'

type FormMode = 'list' | 'create' | 'edit'

const EMPTY_FORM = {
  summary: '',
  description: '',
  location: '',
  startDate: '',
  startTime: '',
  endDate: '',
  endTime: '',
}

function toLocalInputs(dateTime?: string) {
  if (!dateTime) return { date: '', time: '' }
  const d = new Date(dateTime)
  const pad = (n: number) => String(n).padStart(2, '0')
  return {
    date: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`,
    time: `${pad(d.getHours())}:${pad(d.getMinutes())}`,
  }
}

export default function CalendarEventsModal({ isOpen, onClose, calendar }: CalendarEventsModalProps) {
  const [deleteConfirmEvent, setDeleteConfirmEvent] = useState<CalendarEvent | null>(null)
  const { t } = useTranslation()
  const calendarId = (calendar as any)?.id || calendar?._id || ''

  const { data, isLoading } = useListEventsQuery(
    { calendarId },
    { skip: !isOpen || !calendar }
  )

  const [createEvent, { isLoading: isCreating }] = useCreateEventMutation()
  const [updateEvent, { isLoading: isUpdating }] = useUpdateEventMutation()
  const [deleteEvent] = useDeleteEventMutation()

  const [mode, setMode] = useState<FormMode>('list')
  const [editingEventId, setEditingEventId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [form, setForm] = useState(EMPTY_FORM)

  const set = (k: keyof typeof EMPTY_FORM, v: string) => setForm(f => ({ ...f, [k]: v }))

  const openCreate = () => {
    setForm(EMPTY_FORM)
    setEditingEventId(null)
    setMode('create')
  }

  const openEdit = (event: CalendarEvent) => {
    const start = toLocalInputs(event.start?.dateTime)
    const end = toLocalInputs(event.end?.dateTime)
    setForm({
      summary: event.summary || '',
      description: event.description || '',
      location: event.location || '',
      startDate: start.date,
      startTime: start.time,
      endDate: end.date,
      endTime: end.time,
    })
    setEditingEventId(event.id || null)
    setMode('edit')
  }

  const cancelForm = () => {
    setMode('list')
    setForm(EMPTY_FORM)
    setEditingEventId(null)
  }

  const buildPayload = () => {
    const tz = calendar?.timezone || t('utc')
    return {
      summary: form.summary,
      description: form.description,
      location: form.location,
      start: { dateTime: new Date(`${form.startDate}T${form.startTime}`).toISOString(), timeZone: tz },
      end: { dateTime: new Date(`${form.endDate}T${form.endTime}`).toISOString(), timeZone: tz },
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!calendar) return
    try {
      if (mode === 'edit' && editingEventId) {
        await updateEvent({ calendarId, eventId: editingEventId, body: buildPayload() }).unwrap()
        toast.success(t('eventUpdated', 'Event updated successfully'))
      } else {
        await createEvent({ calendarId, body: buildPayload() }).unwrap()
        toast.success(t('eventCreated', 'Event created successfully'))
      }
      cancelForm()
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || t('operation_failed'))
    }
  }


  const handleDelete = async () => {
    if (!deleteConfirmEvent?.id) return

    setDeletingId(deleteConfirmEvent.id)

    try {
      await deleteEvent({
        calendarId,
        eventId: deleteConfirmEvent.id,
      }).unwrap()

      toast.success(t('eventDeleted', 'Event deleted successfully'))

      setDeleteConfirmEvent(null)
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || t('failed_to_delete_event'))
    } finally {
      setDeletingId(null)
    }
  }

  const isSaving = isCreating || isUpdating

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) { cancelForm(); onClose() } }}>
      <DialogContent hideCloseButton className="sm:max-w-4xl! max-w-[calc(100%-2rem)] gap-0 border-none max-h-[90vh] flex flex-col p-0 overflow-auto no-scrollbar">
        {/* ── Header ── */}
        <DialogHeader className="sm:px-6 px-4 mb-0 border-input-border-color py-4 border-b shrink-0">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                <CalendarIcon className="w-5 h-5 text-primary" />
              </div>
              <div className="min-w-0 flex-1 text-left rtl:text-right">
                <DialogTitle className="text-lg sm:text-xl font-semibold truncate text-title">
                  {mode === 'list' ? calendar?.name : (mode === 'edit' ? t('editEvent', 'Edit Event') : t('createEvent', 'Create New Event'))}
                </DialogTitle>
                <p className="text-xs sm:text-sm text-subtitle-color mt-0.5 truncate">
                  {mode === 'list'
                    ? `${calendar?.timezone || t('utc')} · ${data?.events?.length ?? 0} ${t('events', 'events')}`
                    : calendar?.name
                  }
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {mode === 'list' && (
                <Button onClick={openCreate} size="sm" className="rounded-radius! px-3 sm:px-4 text-white h-9 sm:h-10 font-bold transition-all duration-300 flex items-center justify-center gap-1.5 sm:gap-2">
                  <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">{t('addEvent', 'Add Event')}</span>
                  <span className="sm:hidden text-xs">{t('add', 'Add')}</span>
                </Button>
              )}

              <Button 
                variant="ghost" 
                size="icon" 
                onClick={mode === 'list' ? () => { cancelForm(); onClose() } : cancelForm} 
                className="shrink-0 rounded-lg h-9 w-9 text-subtitle-color hover:bg-destructive/10 hover:text-destructive transition-colors"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        {/* ── Body ── */}
        <div className={`no-scrollbar flex-1 overflow-y-auto sm:p-6 p-4 ${mode === 'list' ? 'bg-bg-card' : ''}`}>

          {/* ── Create / Edit Form ── */}
          {(mode === 'create' || mode === 'edit') && (
            <div className="w-full">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-title-color">{t('eventTitle', 'Event Title')} <span className="text-destructive">*</span></Label>
                  <Input
                    required
                    value={form.summary}
                    onChange={e => set('summary', e.target.value)}
                    placeholder="E.g., Team Standup, Client Call…"
                    className="h-11 rounded-radius border-input-border-color"
                  />
                </div>

                {/* Date-time grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-md font-medium text-title-color">{t('startDate', 'Start Date')} <span className="text-destructive">*</span></Label>
                    <Input type="date" required value={form.startDate} onChange={e => set('startDate', e.target.value)} className="h-11 rounded-radius border-input-border-color" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-md font-medium text-title-color">{t('startTime', 'Start Time')} <span className="text-destructive">*</span></Label>
                    <Input type="time" required value={form.startTime} onChange={e => set('startTime', e.target.value)} className="h-11 rounded-radius border-input-border-color" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-md font-medium text-title-color">{t('endDate', 'End Date')} <span className="text-destructive">*</span></Label>
                    <Input type="date" required value={form.endDate} onChange={e => set('endDate', e.target.value)} className="h-11 rounded-radius border-input-border-color" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-md font-medium text-title-color">{t('endTime', 'End Time')} <span className="text-destructive">*</span></Label>
                    <Input type="time" required value={form.endTime} onChange={e => set('endTime', e.target.value)} className="h-11 rounded-radius border-input-border-color" />
                  </div>
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <Label className="text-md font-medium text-title-color">{t('location', 'Location')}</Label>
                  <Input
                    value={form.location}
                    onChange={e => set('location', e.target.value)}
                    placeholder="Conference Room, Google Meet link…"
                    className="h-11 rounded-radius border-input-border-color"
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label className="text-md font-medium text-title-color">{t('description', 'Description')}</Label>
                  <Textarea
                    value={form.description}
                    onChange={(e: any) => set('description', e.target.value)}
                    placeholder="Add event details…"
                    rows={4}
                    className="w-full rounded-radius border border-input-border-color bg-input-color px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
                  />
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center justify-end gap-3 sm:pt-6 pt-4 mt-4">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={cancelForm}
                    disabled={isSaving}
                    className="rounded-radius h-12 bg-subcard p-padding! text-subtitle-color font-medium border border-input-border-color min-w-[120px]"
                  >
                    {t('cancel', 'Cancel')}
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSaving}
                    className="rounded-radius h-12 bg-primary font-medium border border-input-border-color p-padding! text-white min-w-[140px] flex items-center justify-center gap-2"
                  >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {mode === 'edit' ? t('updateEvent', 'Update Event') : t('saveEvent', 'Save Event')}
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* ── Event List ── */}
          {mode === 'list' && (
            <>
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground">
                  <Spinner />
                  <p className="text-sm">{t('loadingEvents', 'Loading events…')}</p>
                </div>
              ) : !data?.events?.length ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4 border border-dashed border-input-border-color rounded-lg bg-subcard">
                  <div className="p-4 bg-primary/10 rounded-lg">
                    <CalendarIcon className="w-8 h-8 text-primary" />
                  </div>
                  <div className="text-center space-y-1">
                    <p className="font-medium text-title text-xl">{t('noEventsYet', 'No events yet')}</p>
                    <p className="text-sm text-subtitle-color">{t('noEventsDesc', 'Create your first event to get started.')}</p>
                  </div>
                  
                </div>
              ) : (
                <div className="space-y-2.5">
                  {data.events.map((event: any) => {
                    const startStr = event.start?.dateTime
                      ? format(new Date(event.start.dateTime), 'MMM d, yyyy · h:mm a')
                      : event.start?.date
                    const endStr = event.end?.dateTime
                      ? format(new Date(event.end.dateTime), 'h:mm a')
                      : event.end?.date

                    return (
                      <div
                        key={event.id}
                        className="group bg-subcard border rounded-lg border-input-border-color p-4 transition-all duration-200 hover:border-primary/20"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
                          {/* Left content */}
                          <div className="flex items-start gap-3 min-w-0 flex-1 w-full">
                            <div className="w-1 self-stretch rounded-full bg-primary/60 shrink-0 mt-0.5" />
                            <div className="space-y-1.5 min-w-0 flex-1">
                              <div className="flex items-center gap-2 flex-wrap min-w-0">
                                <h4 className="font-semibold text-base text-title leading-tight truncate max-w-full">
                                  {event.summary || '(No title)'}
                                </h4>
                                {event.status === 'confirmed' && (
                                  <Badge className="text-[10px] px-1.5 py-0 h-4 bg-emerald-500/10 text-emerald-600 border-emerald-500/20 border font-medium rounded-full shrink-0">
                                    {t('confirmed')}
                                  </Badge>
                                )}
                              </div>

                              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-subtitle-color">
                                {startStr && (
                                  <span className="flex items-center gap-1 shrink-0">
                                    <Clock className="w-4 h-4 shrink-0" />
                                    {startStr}{endStr && ` → ${endStr}`}
                                  </span>
                                )}
                                {event.location && (
                                  <span className="flex items-center gap-1 min-w-0 max-w-full text-md">
                                    <MapPin className="w-4 h-4 shrink-0" />
                                    <span className="truncate">{event.location}</span>
                                  </span>
                                )}
                              </div>

                              {event.description && (
                                <p className="text-sm text-subtitle-color line-clamp-2 break-words whitespace-normal max-w-xl">
                                  {event.description}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Action buttons */}
                          <div className="flex items-center gap-2 sm:gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity shrink-0 self-end sm:self-auto">
                            {event.htmlLink && (
                              <Link
                                href={event.htmlLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 flex items-center justify-center bg-primary/10 rounded-lg text-primary hover:text-white hover:bg-primary transition-colors"
                                title={t('open_in_google_calendar')}
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </Link>
                            )}
                            <Button
                              type="button"
                              onClick={() => openEdit(event)}
                              className="w-9 h-9 flex items-center justify-center bg-edit/10 p-0! rounded-lg text-edit hover:text-white hover:bg-edit transition-colors"
                              title={t('edit_event')}
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              type="button"
                              onClick={() => setDeleteConfirmEvent(event)}
                              disabled={deletingId === event.id}
                              className="w-9 h-9 flex items-center justify-center bg-destructive/10 rounded-lg text-destructive p-0! hover:text-white hover:bg-destructive transition-colors disabled:opacity-40"
                              title={t('delete_event')}
                            >
                              {deletingId === event.id
                                ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                : <Trash2 className="w-3.5 h-3.5" />
                              }
                            </Button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </DialogContent>
      <DeleteEventModal
        open={!!deleteConfirmEvent}
        onClose={() => setDeleteConfirmEvent(null)}
        onConfirm={handleDelete}
        loading={deletingId === deleteConfirmEvent?.id}
        eventTitle={deleteConfirmEvent?.summary}
      />
    </Dialog>

  )
}
