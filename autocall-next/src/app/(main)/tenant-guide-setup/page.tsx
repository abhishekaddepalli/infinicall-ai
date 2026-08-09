'use client'

import { DeleteConfirmationModal } from '@/components/reusable/DeleteConfirmationModal'
import { Loader2 } from '@/components/reusable/Loader2'
import SelectField from '@/components/shared/SelectField'
import TextAreaField from '@/components/shared/TextAreaField'
import TextInput from '@/components/shared/TextInput'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { usePermission } from '@/hooks/usePermission'
import { cn } from '@/lib/utils'
import {
  useCreateTenantGuideMutation,
  useDeleteGuideEndpointMutation,
  useDeleteTenantGuideMutation,
  useGetTenantGuidesQuery,
  useUpdateTenantGuideMutation,
} from '@/redux/api/tenantGuideApi'
import { ApiError } from '@/types/api'
import { TenantGuide } from '@/types/tenant-guide'
import { FieldArray, Form, Formik } from 'formik'
import { AlertTriangle, BookOpen, Code, FilePlus, Info, Plus, Terminal, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import * as Yup from 'yup'

const EMPTY_ENDPOINT = {
  sub_title: '', sub_description: '', http_method: 'GET',
  url_path: '', payload: '', response: '',
}

const METHOD_OPTIONS = [
  { label: 'GET', value: 'GET' },
  { label: 'POST', value: 'POST' },
  { label: 'PUT', value: 'PUT' },
  { label: 'DELETE', value: 'DELETE' },
  { label: 'PATCH', value: 'PATCH' },
]

const METHOD_COLOR: Record<string, string> = {
  GET: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  POST: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  PUT: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  DELETE: 'bg-rose-500/10 text-rose-600 border-rose-500/20',
  PATCH: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
}

function jsonValidator(t: (k: string, o?: any) => string) {
  return Yup.string().test('is-json', t('invalid_json_format'), (v) => {
    if (!v || !v.trim()) return true
    try { JSON.parse(v); return true } catch { return false }
  })
}

function guideToFormValues(guide?: Partial<TenantGuide>) {
  return {
    title: guide?.title || '',
    description: guide?.description || '',
    is_active: guide?.is_active ?? true,
    endpoints: (guide?.endpoints || []).map((ep: any) => ({
      _id: ep._id || undefined,
      sub_title: ep.sub_title || '',
      sub_description: ep.sub_description || '',
      http_method: ep.http_method || 'GET',
      url_path: ep.url_path || '',
      payload: ep.payload ? (typeof ep.payload === 'string' ? ep.payload : JSON.stringify(ep.payload, null, 2)) : '',
      response: ep.response ? (typeof ep.response === 'string' ? ep.response : JSON.stringify(ep.response, null, 2)) : '',
    })),
  }
}

function parseJson(str: string) {
  try { return JSON.parse(str) } catch { return {} }
}

export default function TenantGuideSetupPage() {
  const { t } = useTranslation()
  const { isAdmin } = usePermission()
  const isUserAdmin = isAdmin()
  const [activeGuide, setActiveGuide] = useState<TenantGuide | null>(null)
  const [isNewMode, setIsNewMode] = useState(false)
  const [deleteGuideId, setDeleteGuideId] = useState<string | null>(null)
  const [deletingEpId, setDeletingEpId] = useState<string | null>(null)

  const { data, isLoading: isLoadingList, refetch } = useGetTenantGuidesQuery({ page: 1, limit: 100 })
  const guides: TenantGuide[] = data?.tenantGuide || []

  const [createGuide, { isLoading: isCreating }] = useCreateTenantGuideMutation()
  const [updateGuide, { isLoading: isUpdating }] = useUpdateTenantGuideMutation()
  const [deleteGuide, { isLoading: isDeleting }] = useDeleteTenantGuideMutation()
  const [deleteEndpoint, { isLoading: isDeletingEp }] = useDeleteGuideEndpointMutation()

  const isSaving = isCreating || isUpdating

  // Auto-select first guide on load (if any)
  useEffect(() => {
    if (!isLoadingList && guides.length > 0 && !activeGuide && !isNewMode) {
      setActiveGuide(guides[0])
    }
    if (!isLoadingList && guides.length === 0) {
      setIsNewMode(true)
    }
  }, [isLoadingList, guides.length])

  // Scroll to top when the selected guide changes
  useEffect(() => {
    const mainScrollArea = document.querySelector('main');
    if (mainScrollArea) {
      mainScrollArea.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [activeGuide?._id, isNewMode]);

  const validationSchema = Yup.object({
    title: Yup.string().trim().required(t('title_required')),
    endpoints: Yup.array()
      .of(Yup.object({
        sub_title: Yup.string().trim().required(t('endpoint_title_required')),
        sub_description: Yup.string().trim().required(t('endpoint_desc_required')),
        http_method: Yup.string().oneOf(['GET', 'POST', 'PUT', 'DELETE', 'PATCH']).required(),
        url_path: Yup.string().trim().required(t('url_path_required')),
        payload: jsonValidator(t),
        response: jsonValidator(t),
      }))
      .min(1, t('at_least_one_endpoint')),
  })

  const handleSubmit = async (values: ReturnType<typeof guideToFormValues>, { resetForm }: any) => {
    const processedEndpoints = values.endpoints.map((ep) => ({
      ...ep,
      payload: ep.payload?.trim() ? parseJson(ep.payload) : {},
      response: ep.response?.trim() ? parseJson(ep.response) : {},
    }))

    const payload = { ...values, endpoints: processedEndpoints }

    try {
      if (activeGuide && !isNewMode) {
        const res = await updateGuide({ id: activeGuide._id, data: payload }).unwrap()
        toast.success(res.message || t('guide_updated_successfully'))
        refetch()
      } else {
        const res = await createGuide(payload).unwrap()
        toast.success(res.message || t('guide_created_successfully'))
        setIsNewMode(false)
        setActiveGuide((res as any).tenantGuide || null)
        refetch()
      }
    } catch (err) {
      toast.error((err as ApiError)?.data?.message || t('something_went_wrong'))
    }
  }

  const handleDeleteGuide = async () => {
    if (!deleteGuideId) return
    try {
      const res = await deleteGuide(deleteGuideId).unwrap()
      toast.success(res.message || t('guide_deleted_successfully'))
      setDeleteGuideId(null)
      setActiveGuide(null)
      setIsNewMode(true)
      refetch()
    } catch (err) {
      toast.error((err as ApiError)?.data?.message || t('something_went_wrong'))
    }
  }

  const handleDeleteEndpoint = async (guideId: string, endpointId: string, removeFromForm: () => void) => {
    if (!endpointId) { removeFromForm(); return }
    setDeletingEpId(endpointId)
    try {
      await deleteEndpoint({ guideId, endpointId }).unwrap()
      toast.success(t('endpoint_deleted'))
      removeFromForm()
    } catch (err) {
      toast.error((err as ApiError)?.data?.message || t('something_went_wrong'))
    } finally { setDeletingEpId(null) }
  }

  if (!isUserAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <AlertTriangle className="h-16 w-16 text-destructive" />
        <h1 className="text-2xl font-bold">{t('access_denied')}</h1>
        <p className="text-muted-foreground">{t('no_permission_settings')}</p>
      </div>
    )
  }

  const formKey = isNewMode ? 'new' : (activeGuide?._id ?? 'none')
  const formInitial = isNewMode ? guideToFormValues() : guideToFormValues(activeGuide || undefined)

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex items-center justify-between flex-wrap gap-4 pb-6">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-3xl font-bold text-title">{t('tenant_guide_setup')}</h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {(!isNewMode && !activeGuide) ? null : (
            <Button
              type="submit"
              form="tenant-guide-form"
              disabled={isSaving}
              className="px-6 bg-primary hover:bg-primary/95 text-white font-medium rounded-radius"
            >
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isNewMode ? t('create') : t('save_changes')}
            </Button>
          )}
          <Button
            onClick={() => { setActiveGuide(null); setIsNewMode(true) }}
            className="bg-primary hover:bg-primary/95 text-white font-medium rounded-radius gap-2 shadow-sm shadow-primary/20"
          >
            <FilePlus className="h-4 w-4" />
            {t('new_guide')}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        <div className="lg:col-span-1 bg-bg-card border border-input-border-color rounded-radius sm:p-6 p-4 lg:sticky lg:top-6 lg:z-10">
          <p className="text-base font-medium text-subtitle-color ">
            {t('existing_guides')} ({guides.length})
          </p>

          {isLoadingList ? (
            <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
          ) : guides.length === 0 ? (
            <div className="text-center py-8 text-xs text-subtitle-color">
              {t('no_guides_yet')}
            </div>
          ) : (
            <div className="space-y-1 max-h-[65vh] overflow-y-auto no-scrollbar pe-1 pt-3">
              {guides.map((g) => (
                <Button
                  key={g._id}
                  onClick={() => { setActiveGuide(g); setIsNewMode(false) }}
                  className={cn(
                    'w-full flex items-center justify-between text-start px-3 py-2.5 rounded-lg transition-all text-sm font-semibold gap-2',
                    !isNewMode && activeGuide?._id === g._id
                      ? 'bg-primary/10 text-primary border-s-[3px] border-primary ps-2.5'
                      : 'hover:bg-slate-50 bg-[unset] dark:hover:bg-slate-900 text-subtitle-color hover:text-slate-800 dark:hover:text-slate-200'
                  )}
                >
                  <span className="text-md truncate flex-1">{g.title}</span>
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* ── Right: Form Panel ──────────────────────────── */}
        <div className="lg:col-span-3">
          {(!isNewMode && !activeGuide) ? (
            <div className="flex flex-col items-center justify-center min-h-[50vh] bg-white dark:bg-slate-950/50 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
              <BookOpen className="h-12 w-12 text-slate-300 mb-3" />
              <p className="font-bold text-title">{t('select_guide_hint')}</p>
            </div>
          ) : (
            <Formik
              key={formKey}
              initialValues={formInitial}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
              enableReinitialize
            >
              {({ values, setFieldValue, errors, submitCount }) => (
                <Form id="tenant-guide-form" className="space-y-6">
                  {/* General Info Card */}
                  <div className="bg-bg-card rounded-radius border border-input-border-color sm:p-6 p-4 space-y-5">
                    <div className="flex flex-wrap items-center justify-between pb-3 border-b border-input-border-color">
                      <h2 className="font-bold text-lg text-title flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-primary" />
                        {isNewMode ? t('create_new_guide') : t('edit_guide')}
                      </h2>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3">
                          <Switch id="guide_active" checked={values.is_active}
                            onCheckedChange={(v) => setFieldValue('is_active', v)}
                            className="data-[state=checked]:bg-switch-background" />
                        </div>
                        {!isNewMode && activeGuide && (
                          <Button type="button" variant="ghost" size="sm"
                            className="text-destructive bg-destructive/10 hover:bg-destructive hover:text-white font-bold text-xs p-padding h-9 w-9 rounded-lg gap-1"
                            onClick={() => setDeleteGuideId(activeGuide._id)}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        )}
                      </div>
                    </div>

                    <TextInput name="title" label={t('title')}
                      placeholder={t('enter_guide_title')}
                      className="h-11 rounded-xl border-input-border-color focus:border-primary focus:ring-primary bg-input-color" />

                    <TextAreaField name="description" label={t('description')} rows={3}
                      placeholder={t('enter_guide_description')}
                      className="rounded-xl border-input-border-color focus:border-primary focus:ring-primary bg-input-color" />
                  </div>

                  {/* Endpoints Card */}
                  <div className="bg-bg-card rounded-radius border border-input-border-color sm:p-6 p-4">
                    <FieldArray name="endpoints">
                      {({ push, remove }) => (
                        <div className="space-y-5">
                          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between pb-3 border-b border-input-border-color">
                            <h2 className="font-bold text-title flex items-center gap-2 text-lg">
                              <Terminal className="h-4 w-4 text-primary" />
                              {t('endpoints_management')}
                              <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                                {values.endpoints.length}
                              </span>
                            </h2>
                            <Button type="button" onClick={() => push({ ...EMPTY_ENDPOINT })}
                              className="bg-primary/10 hover:bg-primary text-primary hover:text-white font-medium rounded-lg p-padding! gap-1.5 text-sm transition-all w-full sm:w-auto">
                              <Plus className="h-4 w-4" strokeWidth={2.5} />
                              {t('add_endpoint')}
                            </Button>
                          </div>

                          {typeof errors.endpoints === 'string' && submitCount > 0 && (
                            <div className="flex items-center gap-2 text-xs font-bold text-destructive p-3 bg-destructive/5 rounded-lg border border-destructive/20">
                              <Info className="h-4 w-4 shrink-0" />
                              {errors.endpoints}
                            </div>
                          )}

                          {values.endpoints.length === 0 && (
                            <div className="text-center py-12 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-subtitle-color text-sm">
                              {t('no_endpoints_yet')}
                            </div>
                          )}

                          <div className="space-y-5">
                            {values.endpoints.map((ep: any, idx) => (
                              <div key={idx}
                                className="sm:p-5 p-4 bg-subcard rounded-radius border border-input-border-color space-y-4 animate-in fade-in zoom-in-95 duration-200">
                                {/* Endpoint header */}
                                <div className="flex items-start justify-between gap-3">
                                  <div className="flex flex-wrap items-center gap-2 min-w-0 flex-1">
                                    <span className="text-[10px] font-extrabold text-primary uppercase tracking-widest bg-primary/10 px-2.5 py-1 rounded-lg shrink-0">
                                      {idx + 1}
                                    </span>
                                    {ep.http_method && (
                                      <span className={cn('text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md border tracking-wider shrink-0', METHOD_COLOR[ep.http_method] || 'bg-slate-100 text-slate-500 border-slate-200')}>
                                        {ep.http_method}
                                      </span>
                                    )}
                                    {ep.url_path && (
                                      <code className="text-xs text-slate-500 font-mono break-all whitespace-normal line-clamp-1">{ep.url_path}</code>
                                    )}
                                  </div>
                                  <Button type="button" variant="ghost" size="icon"
                                    disabled={isDeletingEp && deletingEpId === ep._id}
                                    onClick={() => {
                                      const remove_ = () => remove(idx)
                                      if (activeGuide && ep._id) {
                                        handleDeleteEndpoint(activeGuide._id, ep._id, remove_)
                                      } else {
                                        remove_()
                                      }
                                    }}
                                    className="h-9 w-9 text-destructive hover:bg-destructive hover:text-white bg-destructive/10 rounded-lg shrink-0">
                                    {isDeletingEp && deletingEpId === ep._id
                                      ? <Loader2 className="h-4 w-4 animate-spin" />
                                      : <Trash2 className="h-4 w-4" />}
                                  </Button>
                                </div>

                                {/* Fields grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                  <TextInput name={`endpoints[${idx}].sub_title`} label={t('title')}
                                    placeholder="e.g. Get Token"
                                    className="h-10 rounded-xl bg-white dark:bg-white/5 border-slate-200 dark:border-white/10" />
                                  <SelectField name={`endpoints[${idx}].http_method`}
                                    label={t('http_method')}
                                    options={METHOD_OPTIONS}
                                    className="rounded-xl bg-white dark:bg-white/5" />
                                  <TextInput name={`endpoints[${idx}].url_path`}
                                    label={t('url_path')}
                                    placeholder="/api/v1/auth/token"
                                    className="h-10 rounded-xl bg-white dark:bg-white/5 border-slate-200 dark:border-white/10" />
                                </div>

                                <TextInput name={`endpoints[${idx}].sub_description`} label={t('description')}
                                  placeholder="Describe what this endpoint does..."
                                  className="h-10 rounded-xl bg-white dark:bg-white/5 border-slate-200 dark:border-white/10" />

                                <div className={cn("grid grid-cols-1 gap-4", ep.http_method !== 'GET' && "md:grid-cols-2")}>
                                  {ep.http_method !== 'GET' && (
                                    <TextAreaField name={`endpoints[${idx}].payload`}
                                      label={<span className="flex items-center gap-1.5"><Code className="h-3.5 w-3.5 text-primary" />{t('request_payload')}</span>}
                                      placeholder={'{\n  "key": "value"\n}'} rows={5}
                                      className="font-mono text-xs rounded-xl bg-white dark:bg-white/5 border-slate-200 dark:border-white/10" />
                                  )}
                                  <TextAreaField name={`endpoints[${idx}].response`}
                                    label={<span className="flex items-center gap-1.5"><Code className="h-3.5 w-3.5 text-emerald-500" />{t('response_payload')}</span>}
                                    placeholder={'{\n  "success": true\n}'} rows={5}
                                    className="font-mono text-xs rounded-xl bg-white dark:bg-white/5 border-slate-200 dark:border-white/10" />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </FieldArray>
                  </div>
                </Form>
              )}
            </Formik>
          )}
        </div>
      </div>

      {/* Delete Guide Confirmation */}
      <DeleteConfirmationModal
        isOpen={!!deleteGuideId}
        onClose={() => setDeleteGuideId(null)}
        onConfirm={handleDeleteGuide}
        title={t('delete_guide_title')}
        description={t('delete_guide_desc')}
        isLoading={isDeleting}
      />
    </div>
  )
}
