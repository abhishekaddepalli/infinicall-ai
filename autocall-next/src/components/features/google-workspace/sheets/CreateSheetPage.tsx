'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textArea'
import { ROUTES } from '@/constants/routes'
import { ArrowLeft, CheckCircle2, Cloud, FileSpreadsheet, Plus } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useGoogleSheets } from './hooks/useGoogleSheets'

export default function CreateSheetPage() {
  const { t } = useTranslation()
  const router = useRouter()
  const { accounts, handleCreate, isCreating } = useGoogleSheets()

  const [form, setForm] = useState({
    google_account_id: '',
    name: '',
    spreadsheet_id: '',
    sheet_name: 'Sheet1',
    range: 'A:E',
    headers: 'Name,Phone,Date,Time,Status',
    description: '',
    is_active: true,
    create_in_google: true,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.google_account_id) e.google_account_id = t('error_select_google_account')
    if (!form.name.trim()) e.name = t('error_connection_name_required')
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    if (!validate()) return

    try {
      const headersArray = form.headers
        .split(',')
        .map((h) => h.trim())
        .filter(Boolean)

      await handleCreate({
        google_account_id: form.google_account_id,
        name: form.name.trim(),
        spreadsheet_id: form.create_in_google ? undefined : form.spreadsheet_id.trim(),
        sheet_name: form.sheet_name.trim() || t('sheet1'),
        range: form.range.trim() || 'A:E',
        headers: headersArray.length > 0 ? headersArray : ['Name', 'Phone', 'Date', 'Time', 'Status'],
        description: form.description.trim(),
        is_active: form.is_active,
        create_in_google: form.create_in_google,
      })

      router.push(ROUTES.TOOLBOX_HUB_GOOGLE_WORKSPACE_SHEETS)
    } catch {
    }
  }

  const set = (key: keyof typeof form, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: '' }))
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="relative overflow-hidden mb-3">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-1">
              <div className='flex items-center gap-4'>
                <Link href={ROUTES.TOOLBOX_HUB_GOOGLE_WORKSPACE_SHEETS}>
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
                    {t('create_google_sheet')}
                  </h1>
                  <p className="text-sm text-subtitle-color mt-0.5">
                    {t('connect_or_create_google_sheet')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-8 w-full">
        <div className="space-y-10">
          <div className="sm:p-6 p-4 rounded-lg border border-input-border-color relative overflow-hidden group bg-bg-card">
            <div className="relative z-10 transition-all duration-500">
              <div className=" mb-4 flex items-center justify-between border-b border-input-border-color pb-4">
                <div>
                  <h2 className="text-xl font-bold text-title flex items-center gap-3">
                    <FileSpreadsheet className="w-6 h-6 text-primary" />
                    {t('sheet_details')}
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
                      <SelectValue placeholder={t('select_connected_google_account')} />
                    </SelectTrigger>
                    <SelectContent className="rounded-radius border-input-border-color">
                      {accounts.length === 0 ? (
                        <SelectItem value="__none__" disabled>{t('no_accounts_connected_prompt')}</SelectItem>
                      ) : (
                        accounts.map((acc) => (
                          <SelectItem key={acc._id} value={acc._id}>
                            {acc.email}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  {errors.google_account_id && (
                    <p className="text-xs text-destructive">{errors.google_account_id}</p>
                  )}
                </div>

                {/* Connection Name */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium text-title-color">
                    {t('connection_name')} <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    placeholder={t('eg_leads_tracking_sheet')}
                    value={form.name}
                    onChange={(e) => set('name', e.target.value)}
                    className={`h-11 rounded-lg shadow-none bg-input-color border-input-border-color ${errors.name ? 'border-destructive' : ''}`}
                  />
                  {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                </div>

                {/* Create in Google Toggle */}
                <div className={`flex flex-wrap items-start justify-between rounded-lg border sm:p-5 p-4 gap-4 transition-colors ${form.create_in_google
                  ? 'border-primary/50 bg-primary/5 dark:bg-primary/10'
                  : 'border-input-border-color'
                  }`}>
                  <div className="flex items-start gap-4">
                    <div className={`p-2.5 rounded-lg mt-0.5 ${form.create_in_google ? 'bg-primary/20' : 'bg-muted'}`}>
                      <Cloud className={`h-5 w-5 ${form.create_in_google ? 'text-primary' : 'text-muted-foreground'}`} />
                    </div>
                    <div>
                      <p className="text-base font-semibold text-title-color">{t('create_in_google_drive')}</p>
                      <p className="text-sm text-subtitle-color mt-1">
                        {t('automatically_create_a_new_spreadsheet_in_the_connected_google_account_and_link_it_here')}
                      </p>
                      {form.create_in_google && (
                        <p className="text-sm text-primary mt-2 flex items-center gap-1.5 font-medium">
                          <CheckCircle2 className="h-4 w-4" />
                          {t('a_new_google_sheet_will_be_created_automatically')}
                        </p>
                      )}
                    </div>
                  </div>
                  <Switch
                    checked={form.create_in_google}
                    onCheckedChange={(v) => set('create_in_google', v)}
                    className="data-[state=checked]:bg-primary"
                  />
                </div>

                {/* Sheet Name & Range */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="sheet_name" className="text-sm font-medium text-title-color">{t('sheet_tab_name')}</Label>
                    <Input
                      id="sheet_name"
                      placeholder={t('sheet1')}
                      value={form.sheet_name}
                      onChange={(e) => set('sheet_name', e.target.value)}
                      className="h-11 rounded-lg bg-input-color border-input-border-color"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="range" className="text-sm font-medium text-title-color">{t('data_range')}</Label>
                    <Input
                      id="range"
                      placeholder="A:E"
                      value={form.range}
                      onChange={(e) => set('range', e.target.value)}
                      className="h-11 rounded-lg bg-input-color border-input-border-color"
                    />
                  </div>
                </div>

                {/* Column Headers */}
                <div className="space-y-2">
                  <Label htmlFor="headers" className="text-sm font-medium text-title-color">{t('column_headers')}</Label>
                  <Input
                    id="headers"
                    placeholder="Name,Phone,Date,Time,Status"
                    value={form.headers}
                    onChange={(e) => set('headers', e.target.value)}
                    className="h-11 rounded-lg bg-input-color border-input-border-color"
                  />
                  <p className="text-xs text-subtitle-color">{t('comma_separated_headers')}</p>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-medium text-title-color">{t('description')}</Label>
                  <Textarea
                    id="description"
                    placeholder={t('optional_description_sheet')}
                    value={form.description}
                    onChange={(e) => set('description', e.target.value)}
                    rows={4}
                    className="rounded-lg bg-input-color border-input-border-color resize-none p-3"
                  />
                </div>

                {/* Active Status */}
                <div className="flex items-center justify-between pt-6 border-t border-input-border-color">
                  <div>
                    <p className="text-base font-semibold text-title">{t('active')}</p>
                    <p className="text-sm text-subtitle-color mt-1">{t('enable_this_sheet_integration_immediately')}</p>
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

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-end gap-3">
            <Link href={ROUTES.TOOLBOX_HUB_GOOGLE_WORKSPACE_SHEETS}>
              <Button
                type="button"
                variant="ghost"
                disabled={isCreating}
                className="rounded-lg h-11 bg-subcard p-padding! text-subtitle-color font-medium border border-input-border-color"
              >
                {t('cancel')}
              </Button>
            </Link>
            <Button
              type="submit"
              isLoading={isCreating}
              className="rounded-lg h-11 bg-primary font-medium border border-input-border-color p-padding! text-white"
            >
              {!isCreating && <Plus className="h-4 w-4 mr-2 rtl:mr-0 rtl:ml-2" />}
              {isCreating ? t('creating_sheet') : t('create_sheet')}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
