'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { AppointmentDetailModalProps } from '@/types/appointment'
import { Calendar as CalendarIcon, Clock, FileText, Phone, PhoneCall, Video } from 'lucide-react';
import { Loader2 } from '@/components/reusable/Loader2';
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'

export function AppointmentDetailModal({
  isOpen,
  onClose,
  appointment,
  onStatusChange,
  isUpdating,
}: AppointmentDetailModalProps) {
  const { t } = useTranslation()

  const [isRescheduling, setIsRescheduling] = useState(false)
  const [newDate, setNewDate] = useState('')
  const [newTime, setNewTime] = useState('')

  const [prevIsOpen, setPrevIsOpen] = useState(isOpen)
  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen)
    if (!isOpen) {
      setIsRescheduling(false)
    }
  }

  if (!appointment) return null

  const handleStatusSelect = (val: string) => {
    if (val === 'rescheduled') {
      setIsRescheduling(true)
      setNewDate(appointment.appointment_date ? new Date(appointment.appointment_date).toISOString().split('T')[0] : '')
      setNewTime(appointment.appointment_time || '')
    } else {
      setIsRescheduling(false)
      onStatusChange(val)
    }
  }

  // Get status color badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge variant="default" className="bg-edit/10 text-edit font-bold">{t('confirmed')}</Badge>
      case 'completed':
        return <Badge variant="default" className="bg-sky-500 hover:bg-sky-600 text-white font-bold">{t('completed')}</Badge>
      case 'rescheduled':
        return <Badge variant="default" className="bg-violet-500 hover:bg-violet-600 text-white font-bold">{t('rescheduled')}</Badge>
      case 'cancelled':
        return <Badge variant="destructive" className="font-bold">{t('cancelled')}</Badge>
      case 'scheduled':
      default:
        return <Badge variant="secondary" className="font-bold">{t('scheduled')}</Badge>
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="sm:max-w-md! max-w-[calc(100%-2rem)]! max-h-[90vh] overflow-y-auto no-scrollbar bg-bg-card border border-input-border-color p-4 sm:p-6 gap-0! rounded-modal-radius shadow-xl">
        <DialogHeader className='text-left rtl:text-right'>
          <div className="flex items-center gap-2 text-primary font-bold text-lg mb-1">
            <CalendarIcon className="w-5 h-5" />
            <span>{t('appointment_details')}</span>
          </div>
          <DialogTitle className="text-xl font-extrabold text-slate-900 dark:text-white leading-tight break-all whitespace-normal line-clamp-1">
            {appointment.name}
          </DialogTitle>
          <DialogDescription className="text-md break-all whitespace-normal line-clamp-2 text-subtitle-color font-semibold">
            {appointment.appointment_type || t('general')} {t('booking_info')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 my-2">
          {/* Main Info Blocks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-subcard border border-input-border-color p-3 rounded-lg">
              <div className="text-md text-title font-bold mb-1 truncate">{t('appointment_date')}</div>
              {isRescheduling ? (
                <Input 
                  type="date" 
                  value={newDate} 
                  onChange={(e) => setNewDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="h-9 rounded-lg mt-1" 
                />
              ) : (
                <div className="text-sm font-extrabold text-subtitle-color flex items-center gap-1.5 h-9">
                  <CalendarIcon className="w-4 h-4 text-primary shrink-0" />
                  {new Date(appointment.appointment_date).toLocaleDateString('en-US', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </div>
              )}
            </div>

            <div className="bg-subcard border border-input-border-color p-3 rounded-lg">
              <div className="text-md text-title font-bold mb-1 truncate">{t('appointment_time')}</div>
              {isRescheduling ? (
                <Input 
                  type="time" 
                  value={newTime} 
                  onChange={(e) => setNewTime(e.target.value)} 
                  className="h-9 rounded-lg mt-1"
                />
              ) : (
                <div className="text-sm font-extrabold text-subtitle-color flex items-center gap-1.5 h-9">
                  <Clock className="w-4 h-4 text-primary shrink-0" />
                  {appointment.appointment_time || 'N/A'}
                </div>
              )}
            </div>
          </div>

          {/* Status Selector */}
          <div className="bg-subcard border border-input-border-color p-3 rounded-lg space-y-2">
            <div className="text-md text-title font-bold break-all whitespace-normal line-clamp-1">{t('appointment_status')}</div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>{getStatusBadge(appointment.status)}</div>
              <div className="w-full sm:w-40">
                <Select
                  value={isRescheduling ? 'rescheduled' : appointment.status}
                  onValueChange={handleStatusSelect}
                  disabled={isUpdating}
                >
                  <SelectTrigger className="h-9 rounded-lg font-bold border-none bg-white dark:bg-zinc-800">
                    {isUpdating && !isRescheduling ? (
                      <Loader2 className="w-4 h-4 animate-spin text-primary" />
                    ) : (
                      <SelectValue />
                    )}
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="scheduled">{t('scheduled')}</SelectItem>
                    <SelectItem value="confirmed">{t('confirmed')}</SelectItem>
                    <SelectItem value="completed">{t('completed')}</SelectItem>
                    <SelectItem value="rescheduled">{t('rescheduled')}</SelectItem>
                    <SelectItem value="cancelled">{t('cancelled')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>



          {/* Details List */}
          <div className="space-y-3 font-medium">
            <div className="flex items-center gap-3 text-sm text-subtitle-color">
              <Phone className="w-4.5 h-4.5 text-slate-400 shrink-0" />
              <div>
                <span className="text-title font-bold text-md block leading-tight">{t('appointment_phone')}</span>
                <span className="font-bold text-subtitle-color text-sm">{appointment.phone}</span>
              </div>
            </div>

            {appointment.meet_link && (
              <div className="flex items-center gap-3 text-sm text-subtitle-color">
                <Video className="w-4.5 h-4.5 text-slate-400 shrink-0" />
                <div>
                  <span className="text-title font-bold text-md block leading-tight">{t('appointment_meet_link')}</span>
                  <Link
                    href={appointment.meet_link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary text-sm hover:underline font-extrabold flex items-center gap-1"
                  >
                    {t('join_google_meet')}
                  </Link>
                </div>
              </div>
            )}

            {appointment.notes && (
              <div className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300">
                <FileText className="w-4.5 h-4.5 text-slate-400 shrink-0 mt-1" />
                <div>
                  <span className="text-title font-bold text-md block leading-tight">{t('appointment_notes')}</span>
                  <p className="text-xs bg-slate-50 dark:bg-zinc-900/50 p-2 rounded-lg mt-1 border border-slate-100 dark:border-zinc-800/40 leading-relaxed font-medium max-h-24 overflow-y-auto">
                    {appointment.notes}
                  </p>
                </div>
              </div>
            )}

            {/* Populated objects call / flow */}
            {appointment.call_id && (
              <div className="flex items-center gap-3 text-sm text-subtitle-color border-t border-input-border-color pt-3 mt-2">
                <PhoneCall className="w-4.5 h-4.5 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-title font-bold text-md block leading-tight">{t('associated_twilio_call')}</span>
                  <span className="font-bold text-sm block text-subtitle-color mt-0.5 leading-relaxed">
                    {t('call_duration')} {(appointment.call_id as unknown as { duration?: string | number })?.duration || '0'}s
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="pt-2 flex flex-col sm:flex-row gap-2">
          {isRescheduling && (
            <Button type="button" onClick={() => setIsRescheduling(false)} variant="outline" className="flex-1 p-padding! rounded-radius border-input-border-color text-md font-medium transition-all shadow-sm w-full">
              {t('cancel')}
            </Button>
          )}
          <Button 
            type="button" 
            onClick={() => {
              if (isRescheduling) {
                onStatusChange('rescheduled', newDate, newTime).then(() => {
                  setIsRescheduling(false);
                }).catch(() => {});
              } else {
                onClose();
              }
            }} 
            disabled={isUpdating || (isRescheduling && (!newDate || !newTime))}
            className="flex-1 p-padding! rounded-radius border-none bg-primary text-white text-md font-medium transition-all shadow-sm w-full"
          >
            {isUpdating && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
            {isRescheduling ? t('save_reschedule', 'Save Reschedule') : t('close')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
