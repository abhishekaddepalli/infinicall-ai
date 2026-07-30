'use client'

import { Loader2 } from '@/components/reusable/Loader2'
import { PageHeader } from '@/components/reusable/PageHeader'
import Spinner from '@/components/reusable/Spinner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textArea'
import { ROUTES } from '@/constants/routes'
import {
  useGetAppointmentSettingQuery,
  useUpdateAppointmentSettingMutation,
} from '@/redux/api/appointmentApi'
import { AppointmentSetting } from '@/types/appointment'
import { Bell, CalendarCheck, CalendarDays, Plus, Save, Settings2, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

export default function AppointmentSettingConfig() {
  const { t } = useTranslation()
  const router = useRouter()

  const { data: settingData, isLoading } = useGetAppointmentSettingQuery()
  const [updateSetting, { isLoading: isUpdating }] = useUpdateAppointmentSettingMutation()

  const [formData, setFormData] = useState<AppointmentSetting>({
    allow_overlapping: false,
    buffer_time: 5,
    max_appointments_per_day: null,
    confirmation_channel: 'none',
    confirmation_message_template: '',
    slots: [
      { day: 'monday', intervals: [{ from: '09:00', to: '17:00' }], is_enabled: true },
      { day: 'tuesday', intervals: [{ from: '09:00', to: '17:00' }], is_enabled: true },
      { day: 'wednesday', intervals: [{ from: '09:00', to: '17:00' }], is_enabled: true },
      { day: 'thursday', intervals: [{ from: '09:00', to: '17:00' }], is_enabled: true },
      { day: 'friday', intervals: [{ from: '09:00', to: '17:00' }], is_enabled: true },
      { day: 'saturday', intervals: [{ from: '09:00', to: '17:00' }], is_enabled: false },
      { day: 'sunday', intervals: [{ from: '09:00', to: '17:00' }], is_enabled: false },
    ],
  })

  useEffect(() => {
    if (settingData?.data) {
      const timer = setTimeout(() => {
        setFormData(settingData.data)
      }, 0)
      return () => clearTimeout(timer)
    }
  }, [settingData])

  const handleSwitchChange = (field: keyof AppointmentSetting, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [field]: checked }))
  }

  const handleInputChange = (field: keyof AppointmentSetting, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const toggleDay = (dayIndex: number) => {
    setFormData((prev) => {
      const newSlots = [...(prev.slots || [])]
      newSlots[dayIndex] = { ...newSlots[dayIndex], is_enabled: !newSlots[dayIndex].is_enabled }
      return { ...prev, slots: newSlots }
    })
  }

  const addInterval = (dayIndex: number) => {
    setFormData((prev) => {
      const newSlots = [...(prev.slots || [])]
      const newIntervals = [...(newSlots[dayIndex].intervals || []), { from: '09:00', to: '17:00' }]
      newSlots[dayIndex] = { ...newSlots[dayIndex], intervals: newIntervals }
      return { ...prev, slots: newSlots }
    })
  }

  const removeInterval = (dayIndex: number, intervalIndex: number) => {
    setFormData((prev) => {
      const newSlots = [...(prev.slots || [])]
      const newIntervals = newSlots[dayIndex].intervals.filter((_, i) => i !== intervalIndex)
      newSlots[dayIndex] = { ...newSlots[dayIndex], intervals: newIntervals }
      return { ...prev, slots: newSlots }
    })
  }

  const updateInterval = (
    dayIndex: number,
    intervalIndex: number,
    field: 'from' | 'to',
    value: string
  ) => {
    setFormData((prev) => {
      const newSlots = [...(prev.slots || [])]
      const newIntervals = [...newSlots[dayIndex].intervals]
      newIntervals[intervalIndex] = { ...newIntervals[intervalIndex], [field]: value }
      newSlots[dayIndex] = { ...newSlots[dayIndex], intervals: newIntervals }
      return { ...prev, slots: newSlots }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const enabledDays = formData.slots?.filter((s) => s.is_enabled)
    if (!enabledDays || enabledDays.length === 0) {
      toast.error(t('error_enable_at_least_one_day'))
      return
    }

    const hasIntervals = enabledDays.every((d) => d.intervals && d.intervals.length > 0)
    if (!hasIntervals) {
      toast.error(t('error_add_at_least_one_interval'))
      return
    }

    try {
      await updateSetting(formData).unwrap()
      toast.success(t('appointment_settings_updated_successfully'))
      router.push(`${ROUTES.TOOLBOX}/appointment-scheduling`)
    } catch (error: any) {
      toast.error(error?.data?.message || t('failed_to_update_settings'))
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Spinner />
          <p className="text-sm font-bold text-zinc-400 animate-pulse uppercase tracking-wider">
            {t("loading_settings")}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full space-y-6">
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-700 ease-out">
        <PageHeader
          title={t('appointment_settings')}
          showBackButton={true}
          onBack={() => router.push(`${ROUTES.TOOLBOX}/appointment-scheduling`)}
        />
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 ease-out delay-150 fill-mode-both">
        <div className="grid grid-cols-3 lg991:grid-cols-1 gap-6">
          <div className="col-span-1 group relative overflow-hidden bg-bg-card backdrop-blur-xl border border-input-border-color rounded-radius p-6 md767:p-4 transition-all duration-300 space-y-6">

            <div className="relative z-10">
              <div className="flex items-center gap-3 pb-4 border-b border-input-border-color">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <Settings2 className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold text-title tracking-tight">
                  {t('booking_rules')}
                </h2>
              </div>

              <div className="space-y-6 pt-6">
                <div className="flex items-center justify-between p-4 rounded-lg bg-subcard border border-input-border-color transition-colors">
                  <div className="pr-4">
                    <Label htmlFor="allow_overlapping" className="text-base font-bold text-title">
                      {t('allow_overlapping')}
                    </Label>
                    <p className="text-md font-medium text-subtitle-color mt-1 leading-relaxed">
                      {t('allow_overlapping_desc')}
                    </p>
                  </div>
                  <Switch
                    id="allow_overlapping"
                    checked={formData.allow_overlapping}
                    onCheckedChange={(val) => handleSwitchChange('allow_overlapping', val)}
                    className="data-[state=checked]:bg-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="buffer_time" className="text-md font-medium ">
                    {t('buffer_time')}
                  </Label>
                  <Input
                    id="buffer_time"
                    type="number"
                    value={formData.buffer_time}
                    onChange={(e) => handleInputChange('buffer_time', Number(e.target.value))}
                    min={0}
                    className=" w-full border-input-border-color rounded-radius bg-input-color focus-visible:ring-primary focus-visible:border-primary transition-all font-semibold px-4"
                    required
                  />
                  <p className="text-sm text-subtitle-color pl-1">
                    {t('buffer_time_desc')}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="max_appointments" className="text-md font-medium">
                    {t('max_appointments_per_day')}
                  </Label>
                  <Input
                    id="max_appointments"
                    type="number"
                    value={formData.max_appointments_per_day === null ? '' : formData.max_appointments_per_day}
                    onChange={(e) => handleInputChange('max_appointments_per_day', e.target.value === '' ? null : Number(e.target.value))}
                    min={1}
                    placeholder={t('unlimited')}
                    className=" w-full border-input-border-color rounded-radius bg-input-color focus-visible:ring-primary focus-visible:border-primary transition-all font-semibold px-4"
                  />
                  <p className="text-sm text-subtitle-color pl-1">
                    {t('max_appointments_per_day_desc')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-2 lg991:col-span-1 group relative overflow-hidden bg-bg-card backdrop-blur-xl border border-input-border-color rounded-radius p-6 md767:p-4 transition-all duration-300 space-y-6">
            <div className="relative z-10">
              <div className="flex items-center gap-3 pb-4 border-b border-input-border-color">
                <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <Bell className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold text-title tracking-tight">
                  {t('notifications')}
                </h2>
              </div>

              <div className="space-y-6 pt-6">
                <div className="space-y-2">
                  <Label htmlFor="confirmation_channel" className="text-md font-medium">
                    {t('confirmation_channel')}
                  </Label>
                  <Select
                    key={formData.confirmation_channel}
                    value={formData.confirmation_channel}
                    onValueChange={(val: any) => handleInputChange('confirmation_channel', val)}
                  >
                    <SelectTrigger className="h-10 w-full border-input-border-color rounded-radius shadow-none bg-input-color focus-visible:ring-primary focus-visible:border-primary transition-all font-semibold px-4">
                      <SelectValue placeholder={t('select_communication_channel')} />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-zinc-200 dark:border-white/10">
                      <SelectItem value="none" className="font-medium cursor-pointer py-2.5">{t('none')}</SelectItem>
                      <SelectItem value="sms" className="font-medium cursor-pointer py-2.5">{t('sms')}</SelectItem>
                      <SelectItem value="whatsapp" className="font-medium cursor-pointer py-2.5">{t('whatsapp')}</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-subtitle-color pl-1">
                    {t('confirmation_channel_desc')}
                  </p>
                </div>

                {formData.confirmation_channel !== 'none' && (
                  <div className="space-y-2 animate-in slide-in-from-top-2 fade-in duration-300 bg-subcard sm:p-5 p-4 rounded-lg border border-input-border-color">
                    <Label htmlFor="message_template" className="text-md font-medium">
                      {t('confirmation_message_template')}
                    </Label>
                    <Textarea
                      id="message_template"
                      rows={5}
                      value={formData.confirmation_message_template}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange('confirmation_message_template', e.target.value)}
                      placeholder={t('confirmation_message_placeholder')}
                      className="w-full border-input-border-color rounded-radius bg-input-color focus-visible:ring-primary focus-visible:border-primary transition-all font-medium p-4 resize-none leading-relaxed text-sm"
                      required
                    />
                    <div className="flex items-start gap-2 pt-1 text-xs text-subtitle-color">
                      <div className="bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded font-mono font-medium text-[10px] mt-0.5 shrink-0">
                        {t('info')}
                      </div>
                      <p className="text-sm">
                        {t('confirmation_message_template_desc')}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden bg-bg-card backdrop-blur-xl border border-input-border-color rounded-radius p-6 md767:p-4 transition-all duration-300 ">
          <div className="relative z-10">
            <div className="flex items-center gap-3 pb-6 border-b border-input-border-color mb-6">
              <div className="h-10 w-10 rounded-lg bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <CalendarDays className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-title tracking-tight">
                  {t('weekly_slots_availability')}
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-2 xl1615:grid-cols-1 gap-6">
              {formData.slots?.map((slot, dayIdx) => {
                const getDayColor = (isEnabled: boolean) => {
                  if (!isEnabled) {
                    return {
                      iconBlock: 'bg-slate-100 dark:bg-slate-800 text-slate-400 shadow-none',
                      btn: 'border-slate-200 text-slate-500 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800',
                      switchColor: 'data-[state=checked]:bg-slate-400',
                      intervalBg: 'bg-slate-50 dark:bg-zinc-800/50 text-slate-600 dark:text-slate-300'
                    }
                  }

                  return {
                    iconBlock: 'bg-primary/10 text-primary',
                    btn: 'bg-primary text-white',
                    switchColor: 'data-[state=checked]:bg-primary',
                    intervalBg: 'bg-primary/10 text-primary dark:text-primary'
                  }
                }
                const colors = getDayColor(slot.is_enabled)

                return (
                  <div
                    key={slot.day}
                    className={`p-5 md767:p-4 rounded-lg border border-input-border-color transition-all duration-300 flex flex-row lg991:flex-col items-center lg991:items-start justify-between gap-4 ${slot.is_enabled ? 'bg-subcard' : 'bg-slate-50/30 dark:bg-zinc-900/30 opacity-70'
                      }`}
                  >
                    <div className="flex items-center gap-4 shrink-0 w-48 lg991:w-full">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${colors.iconBlock}`}>
                        <CalendarCheck className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <span className={`text-base font-bold ${slot.is_enabled ? 'text-title' : 'text-slate-400'}`}>
                          {t(slot.day, { defaultValue: slot.day })}
                        </span>
                        <div className="flex items-center">
                          <Switch
                            checked={slot.is_enabled}
                            onCheckedChange={() => toggleDay(dayIdx)}
                            className={`scale-[0.8] origin-left ${colors.switchColor}`}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 flex flex-col gap-3 pl-16 lg991:pl-0 mt-0 lg991:mt-4 w-full max-h-[180px] overflow-y-auto no-scrollbar">
                      {!slot.is_enabled ? (
                        <div className="flex items-center justify-center bg-subcard py-1.5 px-4 rounded-full border border-input-border-color w-fit pointer-events-none opacity-50">
                          <span className="text-sm text-slate-500 font-bold flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="m4.9 4.9 14.2 14.2" /></svg>
                            {t('unavailable')}
                          </span>
                        </div>
                      ) : (
                        <div className="flex flex-wrap items-center gap-3">
                          {slot.intervals.length === 0 && (
                            <p className="text-xs text-slate-500 dark:text-slate-400 italic font-medium leading-9 bg-white/50 dark:bg-zinc-900/50 px-4 rounded-lg border border-slate-200/50 dark:border-white/5">
                              {t('no_intervals_added')}
                            </p>
                          )}

                          {slot.intervals.map((interval, intIdx) => (
                            <div key={intIdx} className="flex items-center gap-3 animate-in fade-in duration-300 w-full sm:w-auto">
                              <div className="flex items-center gap-2 flex-1">
                                <Input
                                  type="time"
                                  value={interval.from}
                                  onChange={(e) => updateInterval(dayIdx, intIdx, 'from', e.target.value)}
                                  className={`flex-1 min-w-0 w-full max-w-[105px] h-9 border-none rounded-lg focus-visible:ring-1 focus-visible:ring-opacity-50 transition-all font-bold text-sm text-center px-2 md767:px-1 ${colors.intervalBg}`}
                                  required
                                />
                                <span className="text-sm text-subtitle-color font-bold shrink-0 px-1 md767:px-0.5">
                                  {t('interval_to')}
                                </span>
                                <Input
                                  type="time"
                                  value={interval.to}
                                  onChange={(e) => updateInterval(dayIdx, intIdx, 'to', e.target.value)}
                                  className={`flex-1 min-w-0 w-full max-w-[105px] h-9 border-none rounded-lg focus-visible:ring-1 focus-visible:ring-opacity-50 transition-all font-bold text-sm text-center px-2 md767:px-1 ${colors.intervalBg}`}
                                  required
                                />
                              </div>
                              <div className="flex items-center shrink-0 ml-1 md767:ml-0">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  onClick={() => removeInterval(dayIdx, intIdx)}
                                  className="h-9 w-9 md767:w-8 md767:h-8 text-destructive hover:text-white hover:bg-destructive/90 rounded-lg transition-colors bg-destructive/10 border-none"
                                >
                                  <Trash2 size={14} className="md767:w-3.5 md767:h-3.5" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="shrink-0 flex items-center justify-end lg991:justify-start mt-0 lg991:mt-3">
                      {slot.is_enabled && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => addInterval(dayIdx)}
                          className={`h-10 p-padding! gap-1.5 text-sm font-bold border-none rounded-lg transition-all ${colors.btn}`}
                        >
                          <Plus size={14} strokeWidth={3} />
                          {t('add_interval')}
                        </Button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
        <div>
          <div className="flex flex-row md767:flex-col-reverse items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(`${ROUTES.TOOLBOX}/appointment-scheduling`)}
              className="p-padding! font-medium rounded-radius bg-subcard border border-input-border-color"
            >
              {t('cancel')}
            </Button>

            <Button
              type="submit"
              disabled={isUpdating}
              className="p-padding! font-medium rounded-radius bg-primary text-white transition-all flex items-center gap-2"
            >
              {isUpdating ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Save className="w-5 h-5" />
              )}
              <span>{t('save_settings')}</span>
            </Button>
          </div>

        </div>
      </form>
    </div>
  )
}
