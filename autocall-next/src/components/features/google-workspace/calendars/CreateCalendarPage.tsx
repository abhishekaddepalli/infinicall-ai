'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textArea'
import { ROUTES } from '@/constants/routes'
import { ArrowLeft, CalendarDays, Cloud, Plus } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useGoogleCalendars } from './hooks/useGoogleCalendars'

export default function CreateCalendarPage() {
  const {t} = useTranslation();
  const router = useRouter()
  const { accounts, handleCreate, isCreating } = useGoogleCalendars()

  const [form, setForm] = useState({
    google_account_id: '',
    name: '',
    calendar_id: '',
    description: '',
    timezone: 'UTC',

    is_active: true,

    create_in_google: true,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.google_account_id) e.google_account_id = 'Please select a Google account'
    if (!form.name.trim()) e.name = 'Calendar name is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    try {
      await handleCreate({
        google_account_id: form.google_account_id,
        name: form.name.trim(),
        calendar_id: form.create_in_google ? undefined : form.calendar_id.trim(),
        description: form.description.trim(),
        timezone: form.timezone || t('utc'),

        is_active: form.is_active,

        create_in_google: form.create_in_google,
      })
      router.push(ROUTES.TOOLBOX_HUB_GOOGLE_WORKSPACE_CALENDERS)
    } catch {
      // error handled in hook
    }
  }

  const set = (key: keyof typeof form, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: '' }))
  }

  const TIMEZONES = [
    'UTC', 'Asia/Kolkata', 'America/New_York', 'America/Chicago',
    'America/Denver', 'America/Los_Angeles', 'Europe/London',
    'Europe/Paris', 'Asia/Tokyo', 'Asia/Singapore', 'Australia/Sydney',
  ]

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="relative overflow-hidden mb-3">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-1">
              <div className='flex items-center gap-4'>
                <Link href={ROUTES.TOOLBOX_HUB_GOOGLE_WORKSPACE_CALENDERS}>
                  <Button
                    variant="outline"
                    size="icon"
                    type="button"
                    className="h-10 w-10 bg-primary/10 text-primary hover:bg-primary/10 hover:text-primary dark:bg-primary/20 rounded-radius transition-all shrink-0 border-none!"
                  >
                    <ArrowLeft className="h-4 w-4 text-primary" />
                  </Button>
                </Link>
                <div>
                  <h1 className="text-3xl font-bold title-color flex items-center gap-2">
                    {t('create_google_calendar')}
                  </h1>
                  <p className="text-sm text-subtitle-color mt-0.5">
                    {t('connect_google_calendar')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-8 w-full">
        <div className="space-y-10">
          <div className="sm:p-6 p-4 rounded-radius border border-input-border-color relative overflow-hidden group bg-bg-card">
            <div className="relative z-10 transition-all duration-500">
              <div className="sm:mb-10 mb-6 flex items-center justify-between border-b border-input-border-color pb-4">
                <div>
                  <h2 className="text-xl font-medium text-title-color dark:text-white flex items-center gap-3">
                    <CalendarDays className="w-6 h-6 text-primary" />
                    {t('calendar_details')}
                  </h2>
                </div>
              </div>

              <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
                {/* Google Account */}
                <div className="space-y-2">
                  <Label htmlFor="google_account_id" className="text-sm font-medium text-title-color">
                    {t('google_account')} <span className="text-destructive">*</span>
                  </Label>
                  <Select value={form.google_account_id} onValueChange={(v) => set('google_account_id', v)}>
                    <SelectTrigger 
                      id="google_account_id" 
                      className={`h-11 rounded-lg shadow-none border-input-border-color ${errors.google_account_id ? 'border-destructive' : ''}`}
                    >
                      <SelectValue placeholder={t('select_a_google_account')} />
                    </SelectTrigger>
                    <SelectContent className="rounded-radius border-input-border-color">
                      {accounts.length === 0
                        ? <SelectItem value="__none__" disabled>{t('no_accounts_connected')}</SelectItem>
                        : accounts.map((acc) => (
                          <SelectItem key={acc._id} value={acc._id}>{acc.email}</SelectItem>
                        ))
                      }
                    </SelectContent>
                  </Select>
                  {errors.google_account_id && <p className="text-xs text-destructive">{errors.google_account_id}</p>}
                </div>

                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium text-title-color">
                    {t('calendar_name')} <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    placeholder="e.g. Appointments Calendar"
                    value={form.name}
                    onChange={(e) => set('name', e.target.value)}
                    className={`h-11 rounded-radius border-input-border-color ${errors.name ? 'border-destructive' : ''}`}
                  />
                  {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                </div>

                {/* Create in Google Toggle */}
                <div className={`flex flex-wrap items-start justify-between rounded-radius border sm:p-5 p-4 gap-4 transition-colors ${form.create_in_google
                  ? 'border-primary/50 bg-primary/5 dark:bg-primary/10'
                  : 'border-input-border-color'
                  }`}>
                  <div className="flex items-start gap-4">
                    <div className={`p-2.5 rounded-radius mt-0.5 ${form.create_in_google ? 'bg-primary/20' : 'bg-muted'}`}>
                      <Cloud className={`h-5 w-5 ${form.create_in_google ? 'text-primary' : 'text-muted-foreground'}`} />
                    </div>
                    <div>
                      <p className="text-base font-semibold text-title">{t('create_in_google_calendar')}</p>
                      <p className="text-sm text-subtitle-color mt-1">
                        {t('automatically_create_calendar_in_google_account')}
                      </p>
                    </div>
                  </div>
                  <Switch 
                    checked={form.create_in_google} 
                    onCheckedChange={(v) => set('create_in_google', v)} 
                    className="data-[state=checked]:bg-primary"
                  />
                </div>

                {/* Timezone */}
                <div className="space-y-2">
                  <Label htmlFor="timezone" className="text-sm font-medium text-title-color">{t('timezone')}</Label>
                  <Select value={form.timezone} onValueChange={(v) => set('timezone', v)}>
                    <SelectTrigger id="timezone" className="h-11 rounded-lg shadow-none border-input-border-color">
                      <SelectValue placeholder={t('select_timezone')} />
                    </SelectTrigger>
                    <SelectContent className="rounded-radius border-input-border-color">
                      {TIMEZONES.map((tz) => (
                        <SelectItem key={tz} value={tz}>{tz}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-medium text-title-color">{t('description')}</Label>
                  <Textarea
                    id="description"
                    placeholder={t('optional_description')}
                    value={form.description}
                    onChange={(e) => set('description', e.target.value)}
                    rows={4}
                    className="rounded-radius border-input-border-color resize-none p-3"
                  />
                </div>

                {/* Toggles */}
                <div className="flex items-center justify-between pt-6 border-t border-input-border-color">
                  <div>
                    <p className="text-base font-semibold text-title-color">{t('active')}</p>
                    <p className="text-sm text-subtitle-color mt-1">{t('enable_this_calendar_integration')}</p>
                  </div>
                  <Switch 
                    checked={form.is_active} 
                    onCheckedChange={(v) => set('is_active', v)} 
                    className="data-[state=checked]:bg-primary"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-3 mt-6">
            <Link href={ROUTES.TOOLBOX_HUB_GOOGLE_WORKSPACE_CALENDERS}>
              <Button 
                type="button" 
                variant="ghost" 
                disabled={isCreating} 
                className="rounded-radius h-12 bg-subcard p-padding! text-subtitle-color font-medium border border-input-border-color min-w-[120px]"
              >
                {t('cancel', 'Cancel')}
              </Button>
            </Link>
            <Button 
              type="submit" 
              isLoading={isCreating} 
              className="rounded-radius h-12 bg-primary font-medium border border-input-border-color p-padding! text-white min-w-[140px]"
            >
              {!isCreating && <Plus className="h-4 w-4 mr-2" />}
              {isCreating ? 'Creating…' : 'Create Calendar'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
