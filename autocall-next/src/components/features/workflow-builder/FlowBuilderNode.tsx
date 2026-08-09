'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textArea'
import { COLOR_MAP, ICON_MAP, LABEL_MAP } from '@/data/flow'
import { cn } from '@/lib/utils'
import { useUploadAudioMutation } from '@/redux/api/flowApi'
import { useGetFormsQuery } from '@/redux/api/formApi'
import { useGetGoogleCalendarsQuery } from '@/redux/api/googleCalendarsApi'
import { useGetGoogleSheetsQuery } from '@/redux/api/googleSheetsApi'
import { useGetConnectionsQuery } from '@/redux/api/whatsappApi'
import { useGetTemplatesQuery } from '@/redux/api/whatsappTemplateApi'
import { useGetEmailLibraryTemplatesQuery } from '@/redux/api/emailLibraryApi'
import { useGetAllTeamMembersQuery } from '@/redux/api/teamMemberApi'
import { NodeType } from '@/types/flow'
import { Handle, NodeProps, Position, useReactFlow } from '@xyflow/react'
import { MessageSquare, Plus, Trash2 } from 'lucide-react';
import { Loader2 } from '@/components/reusable/Loader2';
import { useState } from 'react'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function FlowBuilderNode({ id, data, selected }: NodeProps<any>) {
  const type = (data?.type as NodeType) || 'message_output'
  const Icon = ICON_MAP[type] || MessageSquare
  const color = COLOR_MAP[type] || 'bg-gray-600'
  const label = data?.label || LABEL_MAP[type] || type
  const { t } = useTranslation()

  const { setNodes, setEdges } = useReactFlow()

  const { data: formsResponse } = useGetFormsQuery({})
  const forms = formsResponse?.data || []

  const { data: connectionsResponse } = useGetConnectionsQuery()
  const connections = connectionsResponse?.data || []
  const selectedWabaId = connections.length > 0 ? connections[0]._id : null

  const { data: templatesResponse } = useGetTemplatesQuery(
    { waba_id: selectedWabaId, status: 'approved' },
    { skip: !selectedWabaId || type !== 'whatsapp_notice' }
  )
  const templates = templatesResponse?.data || []

  const { data: sheetsResponse, isLoading: isLoadingSheets } = useGetGoogleSheetsQuery(undefined, { skip: type !== 'book_slot' })
  const sheets = sheetsResponse?.data || []

  const { data: calendarsResponse, isLoading: isLoadingCalendars } = useGetGoogleCalendarsQuery(undefined, { skip: type !== 'book_slot' })
  const calendars = calendarsResponse?.data || []

  const { data: emailTemplatesResponse } = useGetEmailLibraryTemplatesQuery({ limit: 100 }, { skip: type !== 'email_notice' })
  const emailTemplates = emailTemplatesResponse?.data || []

  const { data: teamMembersResponse } = useGetAllTeamMembersQuery(undefined, { skip: type !== 'redirect_call' })
  const members = teamMembersResponse?.data || []

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadAudio, { isLoading: isUploading }] = useUploadAudioMutation()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return
    const formData = new FormData()
    formData.append('file', selectedFile)

    try {
      const res = await uploadAudio(formData).unwrap()
      if (res.success && res.filePath) {
        handleUpdate('audio_url', res.filePath)
        setSelectedFile(null)
        toast.success(res.message || t('audio_uploaded_successfully'))
      }
    } catch (err: any) {
      toast.error(err?.data?.message || t('failed_to_upload_audio'))
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleUpdate = (key: string, value: any) => {
    setNodes((nds) =>
      nds.map((n) => (n.id === id ? { ...n, data: { ...n.data, [key]: value } } : n))
    )
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    setNodes((nds) => nds.filter((n) => n.id !== id))
    setEdges((eds) => eds.filter((edge) => edge.source !== id && edge.target !== id))
  }

  return (
    <div className={cn(
      "min-w-[280px] w-[300px] bg-bg-subcard  rounded-2xl shadow-xl border-2 transition-all duration-300 overflow-visible",
      selected ? "border-primary shadow-primary/20 ring-4 ring-primary/5" : "border-gray-100 dark:border-white/5",
    )}>
      <Handle
        type="target"
        position={Position.Left}
        className="!w-3.5 !h-3.5 !bg-white !border-2 !border-primary !rounded-full -left-1.75 shadow-sm"
      />

      <div className={cn("px-4 py-3 flex items-center justify-between transition-colors", color, "rounded-t-xl")}>
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-1.5 rounded-lg backdrop-blur-sm">
            <Icon className="w-4 h-4 text-white" />
          </div>
          <span className="text-base font-black text-white max-w-[180px]">
            {t(label)}
          </span>
        </div>
        {selected && (
          <Button
            onClick={handleDelete}
            className="text-white/80 hover:text-white p-1.5 hover:bg-unset bg-unset rounded-radius transition-colors"
            title={t('delete_node')}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </div>

      <div className="p-4 bg-subcard flex flex-col gap-4 rounded-b-2xl">
        {selected ? (
          <div className="flex flex-col gap-4 nodrag cursor-default">
            <div className="space-y-1.5">
              <Label className="text-md font-black text-title/80 mb-2">{t('node_label')}</Label>
              <Input
                value={data.label || ''}
                onChange={(e) => handleUpdate('label', e.target.value)}
                placeholder={t('enter_label')}
                className="h-10 text-xs rounded-radius bg-input-color border-input-border-color"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-md font-black text-title/80 mb-2">
                {type === 'input_capture' ? t('question') : type === 'terminate_call' ? t('end_message') : t('description')}
              </Label>
              <Textarea
                value={data.description || ''}
                onChange={(e) => handleUpdate('description', e.target.value)}
                placeholder={type === 'input_capture' ? t('enter_question') : type === 'terminate_call' ? t('enter_end_message') : t('enter_description')}
                className="min-h-[60px] text-xs rounded-radius bg-input-color border-input-border-color resize-none"
              />
            </div>

            {type === 'decision_split' && (
              <>
                <div className="space-y-1.5 border-t border-input-border-color pt-4">
                  <Label className="text-md font-black text-title/80 mb-2">{t('condition')}</Label>
                  <Textarea
                    value={data.condition || ''}
                    onChange={(e) => handleUpdate('condition', e.target.value)}
                    placeholder={t('transfer_consent_example')}
                    className="min-h-[60px] font-mono text-xs rounded-lg bg-input-color dark:bg-white/5 border-input-border-color resize-none"
                  />
                </div>

                <div className="bg-primary/5 dark:bg-white/5 border border-primary/20 dark:border-white/10 p-3 rounded-lg flex flex-col gap-1.5 mt-2">
                  <span className="text-xs font-bold text-primary dark:text-white/80">{t('note')}</span>
                  <span className="text-[11px] font-medium text-subtitle-color leading-tight" dangerouslySetInnerHTML={{ __html: t('connect_node_note') }} />
                </div>
              </>
            )}

            {type === 'audio_playback' && (
              <div className="space-y-1.5 border-t border-input-border-color pt-4">
                <Label className="text-md font-bold text-title">{t('upload_audio')}</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="file"
                    accept="audio/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id={`file-upload-${id}`}
                  />
                  <Label
                    htmlFor={`file-upload-${id}`}
                    className="flex-1 h-10 px-3 flex items-center justify-center text-md font-bold rounded-radius bg-input-color border border-input-border-color cursor-pointer hover:bg-input-color/80 transition-colors truncate"
                  >
                    {selectedFile ? selectedFile.name : data.audio_url ? t('change_file') : t('select_audio_file')}
                  </Label>
                  <Button
                    disabled={!selectedFile || isUploading}
                    onClick={handleUpload}
                    className="h-10 p-padding text-white text-xs font-bold rounded-radius shrink-0"
                  >
                    {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : t('upload')}
                  </Button>
                </div>
                {data.audio_url && !selectedFile && (
                  <p className="text-[9px] text-muted-foreground break-all mt-1">
                    {t('current_file')}{data.audio_url}
                  </p>
                )}
              </div>
            )}

            {type === 'wait_delay' && (
              <div className="space-y-1.5 border-t border-input-border-color pt-4">
                <Label className="text-md font-bold text-title">{t('duration_seconds')}</Label>
                <Input
                  type="number"
                  min="1"
                  step="1"
                  value={data.duration || ''}
                  onKeyDown={(e) => {
                    if (['e', 'E', '+', '-', '.'].includes(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    if (val > 0) {
                      handleUpdate('duration', val);
                    } else if (e.target.value === '') {
                      handleUpdate('duration', '');
                    }
                  }}
                  placeholder="e.g., 5"
                  className="h-10 text-xs rounded-radius bg-input-color border-input-border-color"
                />
              </div>
            )}

            {type === 'book_slot' && (
              <>
                <div className="flex items-center justify-between border-t border-gray-100 dark:border-white/5 pt-4">
                  <div className="flex flex-col gap-0.5">
                    <Label className="text-md font-black  text-title/80">{t('wait_for_response')}</Label>
                    <span className="text-xs text-subtitle-color ">{t('pause_flow')}</span>
                  </div>
                  <Switch
                    checked={!!data.wait_for_response}
                    onCheckedChange={(checked) => handleUpdate('wait_for_response', checked)}
                  />
                </div>

                <div className="flex items-center justify-between border-t border-input-border-color dark:border-white/5 pt-4">
                  <div className="flex flex-col gap-0.5">
                    <Label className="text-md font-black  text-title/80">{t('send_google_meet_link_label')}</Label>
                    <span className="text-xs text-subtitle-color ">{t('send_meet_invitation')}</span>
                  </div>
                  <Switch
                    checked={!!data.send_google_meet_link}
                    onCheckedChange={(checked) => handleUpdate('send_google_meet_link', checked)}
                  />
                </div>

                <div className="space-y-1.5 border-t border-input-border-color pt-4">
                  <Label className="text-md font-black text-title/80 mb-2">{t('google_sheet')}</Label>
                  <Select
                    value={(data.google_sheet_id as string) || ''}
                    onValueChange={(val) => handleUpdate('google_sheet_id', val)}
                  >
                    <SelectTrigger className="h-10 text-xs rounded-radius bg-input-color border-input-border-color">
                      <SelectValue placeholder={isLoadingSheets ? t('loading') : t('select_google_sheet')} />
                    </SelectTrigger>
                    <SelectContent className="rounded-lg border-input-border-color bg-bg-card">
                      {sheets.map((s: any, index: number) => (
                        <SelectItem key={s.spreadsheet_id || s._id || `sheet-${index}`} value={s.spreadsheet_id || s._id || `sheet-${index}`} className="rounded-lg text-xs">
                          {s.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5 border-t border-gray-100 dark:border-white/5">
                  <Label className="text-md font-black text-title/80 mb-2">{t('google_calendar')}</Label>
                  <Select
                    value={(data.google_calendar_id as string) || ''}
                    onValueChange={(val) => handleUpdate('google_calendar_id', val)}
                  >
                    <SelectTrigger className="h-10 text-xs rounded-radius bg-input-color border-input-border-color">
                      <SelectValue placeholder={isLoadingCalendars ? t('loading') : t('select_google_calendar')} />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-gray-200 dark:border-white/10 bg-bg-card">
                      {calendars.map((c: any, index: number) => (
                        <SelectItem key={c.calendar_id || c._id || `calendar-${index}`} value={c.calendar_id || c._id || `calendar-${index}`} className="rounded-lg text-xs">
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {type === 'data_capture' && (
              <>
                <div className="space-y-1.5 border-t border-input-border-color pt-4">
                  <Label className="text-md font-bold text-title">{t('select_lead_form')}</Label>
                  <Select
                    value={data.form_id || ''}
                    onValueChange={(val) => handleUpdate('form_id', val)}
                  >
                    <SelectTrigger className="h-8 text-xs rounded-lg bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10">
                      <SelectValue placeholder={t('select_form')} />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-gray-200 dark:border-white/10 bg-bg-card">
                      {forms.map((f: any, index: number) => (
                        <SelectItem key={f.id || f._id || `form-${index}`} value={f.id || f._id || `form-${index}`} className="rounded-lg text-xs">
                          {f.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between border-t border-gray-100 dark:border-white/5 pt-4">
                  <div className="flex flex-col gap-0.5">
                    <Label className="text-md font-bold text-title">{t('wait_for_response')}</Label>
                    <span className="text-xs text-subtitle-color leading-none">{t('pause_flow')}</span>
                  </div>
                  <Switch
                    checked={!!data.wait_for_response}
                    onCheckedChange={(checked) => handleUpdate('wait_for_response', checked)}
                  />
                </div>
              </>
            )}

            {type === 'variable_map' && (
              <div className="space-y-1.5 border-t border-input-border-color pt-4">
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-md font-bold text-title">{t('variables')}</Label>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 rounded-full bg-primary/10 text-primary hover:bg-primary/20 shrink-0"
                    onClick={() => {
                      const currentVars = Array.isArray(data.variables) ? [...data.variables] : []
                      const canAdd = currentVars.every((v: any) => v.key?.trim() && v.value?.trim())
                      if (canAdd) {
                        currentVars.push({ key: '', value: '' })
                        handleUpdate('variables', currentVars)
                      } else {
                        toast.error('Please fill existing variable fields first')
                      }
                    }}
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </Button>
                </div>

                <div className="flex flex-col gap-2">
                  {(Array.isArray(data.variables) ? data.variables : []).map((v: any, index: number) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        placeholder={t('key')}
                        value={v.key}
                        onChange={(e) => {
                          const currentVars = [...data.variables]
                          currentVars[index] = { ...currentVars[index], key: e.target.value }
                          handleUpdate('variables', currentVars)
                        }}
                        className="h-8 text-xs rounded-lg bg-input-color border-input-border-color w-1/2"
                      />
                      <Input
                        placeholder={t('value')}
                        value={v.value}
                        onChange={(e) => {
                          const currentVars = [...data.variables]
                          currentVars[index] = { ...currentVars[index], value: e.target.value }
                          handleUpdate('variables', currentVars)
                        }}
                        className="h-8 text-xs rounded-lg bg-input-color border-input-border-color w-1/2"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 bg-destructive/10 shrink-0 text-destructive hover:text-white hover:bg-destructive rounded-lg"
                        onClick={() => {
                          const currentVars = data.variables.filter((_: any, i: number) => i !== index)
                          handleUpdate('variables', currentVars)
                        }}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  ))}
                  {(!data.variables || data.variables.length === 0) && (
                    <p className="text-[10px] text-muted-foreground/60 italic text-center py-2">
                      {t('no_variables_added')}
                    </p>
                  )}
                </div>
              </div>
            )}

            {type === 'whatsapp_notice' && (
              <div className="space-y-1.5 border-t border-input-border-color pt-4">
                <Label className="text-md font-bold text-title">{t('select_template')}</Label>
                <Select
                  value={data.template_id || ''}
                  onValueChange={(val) => handleUpdate('template_id', val)}
                >
                  <SelectTrigger className="h-8 text-xs rounded-lg bg-gray-50 dark:bg-white/5 border-input-border-color">
                    <SelectValue placeholder={t('select_approved_template')} />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-gray-200 dark:border-white/10 bg-bg-card">
                    {templates.map((t: any, index: number) => (
                      <SelectItem key={t.id || t._id || `template-${index}`} value={t.id || t._id || `template-${index}`} className="rounded-lg text-xs">
                        {t.template_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {type === 'email_notice' && (
              <>
                <div className="space-y-1.5 border-t border-input-border-color pt-4">
                  <Label className="text-md font-bold text-title">{t('email', 'Email Address')}</Label>
                  <Input
                    value={data.email || ''}
                    onChange={(e) => handleUpdate('email', e.target.value)}
                    placeholder={t('enter_email', 'Enter email address')}
                    className="h-10 text-xs rounded-radius bg-input-color border-input-border-color"
                  />
                </div>
                <div className="space-y-1.5 border-t border-input-border-color pt-4">
                  <Label className="text-md font-bold text-title">{t('select_template', 'Select Template')}</Label>
                  <Select
                    value={data.template_id || ''}
                    onValueChange={(val) => handleUpdate('template_id', val)}
                  >
                    <SelectTrigger className="h-8 text-xs rounded-lg bg-gray-50 dark:bg-white/5 border-input-border-color">
                      <SelectValue placeholder={t('select_template', 'Select template')} />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-gray-200 dark:border-white/10 bg-bg-card">
                      {emailTemplates.map((t: any, index: number) => (
                        <SelectItem key={t.id || t._id || `email-template-${index}`} value={t.id || t._id || `email-template-${index}`} className="rounded-lg text-xs">
                          {t.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {type === 'redirect_call' && (
              <>
                <div className="space-y-1.5 border-t border-input-border-color pt-4">
                  <Label className="text-md font-bold text-title">{t('member', 'Assign Member')}</Label>
                  <Select
                    value={data.member_id || 'none'}
                    onValueChange={(val) => handleUpdate('member_id', val === 'none' ? null : val)}
                  >
                    <SelectTrigger className="h-8 text-xs rounded-lg bg-gray-50 dark:bg-white/5 border-input-border-color">
                      <SelectValue placeholder={t('select_member', 'Select a member')} />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-gray-200 dark:border-white/10 bg-bg-card">
                      <SelectItem value="none" className="rounded-lg text-xs italic text-muted-foreground">
                        {t('no_member_assigned', 'No member assigned')}
                      </SelectItem>
                      {members.map((m: any, index: number) => (
                        <SelectItem key={m.id || m._id || `member-${index}`} value={m.id || m._id || `member-${index}`} className="rounded-lg text-xs">
                          {m.first_name} {m.last_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5 border-t border-input-border-color pt-4">
                  <Label className="text-md font-bold text-title">{t('phone_number', 'Phone Number')}</Label>
                  <Input
                    value={data.phone_number || ''}
                    onChange={(e) => handleUpdate('phone_number', e.target.value)}
                    placeholder={t('enter_phone_number', 'Enter phone number')}
                    className="h-10 text-xs rounded-radius bg-input-color border-input-border-color"
                  />
                </div>
              </>
            )}
          </div>
        ) : (
          <>
            <p className="text-md text-subtitle-color font-medium line-clamp-3">
              {data.description || (type === 'input_capture' ? t('no_question_provided') : type === 'terminate_call' ? t('no_end_message_provided') : t('no_description_provided'))}
            </p>

            {type === 'decision_split' && data.condition && (
              <div className="mt-2 p-2 rounded bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                <code className="text-[10px] font-mono text-primary/80 break-all">
                  {data.condition}
                </code>
              </div>
            )}

            {/* Quick preview of specific data based on type */}
            <div className="mt-2 pt-3 border-t border-input-border-color">
              {type === 'decision_split' && (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span className="text-[10px] font-black text-emerald-500/80 uppercase">{t('true_path')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    <span className="text-[10px] font-black text-rose-500/80 uppercase">{t('false_path')}</span>
                  </div>
                </div>
              )}
              {type === 'message_output' && (
                <div className="flex items-center gap-2 text-primary/40 italic text-[10px] font-bold uppercase">
                  {t('ready_to_send_message')}
                </div>
              )}
              {type === 'wait_delay' && (
                <div className="flex flex-col gap-1.5 pt-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-muted-foreground/60 uppercase">{t('duration')}</span>
                    <span className="text-[9px] font-black text-primary truncate max-w-[120px]">
                      {data.duration ? `${data.duration} ${t('seconds')}` : t('not_set')}
                    </span>
                  </div>
                </div>
              )}
              {type === 'variable_map' && (
                <div className="flex flex-col gap-1.5 pt-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-muted-foreground/60 uppercase">{t('variables')}</span>
                    <span className="text-[9px] font-black text-primary truncate max-w-[120px]">
                      {Array.isArray(data.variables) && data.variables.length > 0
                        ? `${data.variables.length} ${t('configured')}`
                        : t('none_configured')}
                    </span>
                  </div>
                </div>
              )}
              {type === 'audio_playback' && (
                <div className="flex flex-col gap-1.5 pt-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-muted-foreground/60 uppercase">{t('audio_file')}</span>
                    <span className="text-[9px] font-black text-primary truncate max-w-[120px]">
                      {data.audio_url ? t('uploaded') : t('not_uploaded')}
                    </span>
                  </div>
                </div>
              )}
              {type === 'book_slot' && (
                <div className="flex flex-col gap-1.5 pt-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-muted-foreground/60 uppercase">{t('wait_response')}</span>
                    <span className={cn(
                      "text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider",
                      data.wait_for_response ? "bg-emerald-500/10 text-emerald-500" : "bg-gray-100 dark:bg-white/5 text-muted-foreground/60"
                    )}>
                      {data.wait_for_response ? t('yes') : t('no')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-muted-foreground/60 uppercase">{t('meet_link')}</span>
                    <span className={cn(
                      "text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider",
                      data.send_google_meet_link ? "bg-emerald-500/10 text-emerald-500" : "bg-gray-100 dark:bg-white/5 text-muted-foreground/60"
                    )}>
                      {data.send_google_meet_link ? t('yes') : t('no')}
                    </span>
                  </div>
                  {data.google_sheet_id && (
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-muted-foreground/60 uppercase">{t('google_sheet')}</span>
                      <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 uppercase tracking-wider truncate max-w-[120px]" title={data.google_sheet_id as string}>
                        {t('configured')}
                      </span>
                    </div>
                  )}
                  {data.google_calendar_id && (
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-muted-foreground/60 uppercase">{t('google_calendar')}</span>
                      <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 uppercase tracking-wider truncate max-w-[120px]" title={data.google_calendar_id as string}>
                        {t('configured')}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {type === 'data_capture' && (
                <div className="flex flex-col gap-1.5 pt-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-muted-foreground/60 uppercase">{t('selected_form')}</span>
                    <span className="text-[9px] font-black text-primary truncate max-w-[120px]" title={forms.find((f: any) => (f.id || f._id) === data.form_id)?.name || t('none')}>
                      {forms.find((f: any) => (f.id || f._id) === data.form_id)?.name || t('none')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-muted-foreground/60 uppercase">{t('wait_response')}</span>
                    <span className={cn(
                      "text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider",
                      data.wait_for_response ? "bg-emerald-500/10 text-emerald-500" : "bg-gray-100 dark:bg-white/5 text-muted-foreground/60"
                    )}>
                      {data.wait_for_response ? t('yes') : t('no')}
                    </span>
                  </div>
                </div>
              )}

              {type === 'whatsapp_notice' && (
                <div className="flex flex-col gap-1.5 pt-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-muted-foreground/60 uppercase">{t('selected_template')}</span>
                    <span className="text-[9px] font-black text-primary truncate max-w-[120px]" title={templates.find((t: any) => (t.id || t._id) === data.template_id)?.template_name || t('none')}>
                      {templates.find((t: any) => (t.id || t._id) === data.template_id)?.template_name || t('none')}
                    </span>
                  </div>
                </div>
              )}

              {type === 'email_notice' && (
                <div className="flex flex-col gap-1.5 pt-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-muted-foreground/60 uppercase">{t('email', 'Email')}</span>
                    <span className="text-[9px] font-black text-primary truncate max-w-[120px]" title={data.email as string || t('none')}>
                      {data.email ? data.email as string : t('none')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-muted-foreground/60 uppercase">{t('template', 'Template')}</span>
                    <span className="text-[9px] font-black text-primary truncate max-w-[120px]" title={emailTemplates.find((t: any) => (t.id || t._id) === data.template_id)?.name || t('none')}>
                      {emailTemplates.find((t: any) => (t.id || t._id) === data.template_id)?.name || t('none')}
                    </span>
                  </div>
                </div>
              )}

              {type === 'redirect_call' && (
                <div className="flex flex-col gap-1.5 pt-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-muted-foreground/60 uppercase">{t('member', 'Member')}</span>
                    <span className="text-[9px] font-black text-primary truncate max-w-[120px]" title={members.find((m: any) => (m.id || m._id) === data.member_id) ? `${members.find((m: any) => (m.id || m._id) === data.member_id)?.first_name} ${members.find((m: any) => (m.id || m._id) === data.member_id)?.last_name}` : t('none')}>
                      {data.member_id ? (members.find((m: any) => (m.id || m._id) === data.member_id) ? `${members.find((m: any) => (m.id || m._id) === data.member_id)?.first_name} ${members.find((m: any) => (m.id || m._id) === data.member_id)?.last_name}` : t('unknown')) : t('none')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-muted-foreground/60 uppercase">{t('phone_number', 'Phone')}</span>
                    <span className="text-[9px] font-black text-primary truncate max-w-[120px]" title={data.phone_number as string || t('none')}>
                      {data.phone_number ? data.phone_number as string : t('none')}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="!w-3.5 !h-3.5 !bg-white !border-2 !border-primary !rounded-full -right-1.75 shadow-sm"
      />

      {type === 'decision_split' && (
        <>
          <Handle
            id="true"
            type="source"
            position={Position.Right}
            style={{ top: '30%' }}
            className="!w-4 !h-4 !bg-emerald-500 !border-2 !border-white !rounded-full shadow-md"
          />
          <Handle
            id="false"
            type="source"
            position={Position.Right}
            style={{ top: '70%' }}
            className="!w-4 !h-4 !bg-rose-500 !border-2 !border-white !rounded-full shadow-md"
          />
        </>
      )}
    </div>
  )
}
