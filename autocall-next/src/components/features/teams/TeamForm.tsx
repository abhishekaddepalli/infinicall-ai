'use client'

import Spinner from '@/components/reusable/Spinner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textArea'
import { ROUTES } from '@/constants/routes'
import { cn } from '@/lib/utils'
import { useGetTeamPermissionsQuery } from '@/redux/api/teamApi'
import { ApiError } from '@/types/api'
import { TeamFormProps } from '@/types/team'
import { ArrowLeft, Check, ShieldCheck } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import PermissionPicker from '../permissions/PermissionPicker'


const TeamForm = ({ initialValues, onSubmit, isLoading, mode }: TeamFormProps) => {
  const router = useRouter()
  const { t } = useTranslation();
  const { data: permissionsData, isLoading: isLoadingPermissions } = useGetTeamPermissionsQuery()

  const [name, setName] = useState(initialValues?.name || '')
  const [description, setDescription] = useState(initialValues?.description || '')
  const [isActive, setIsActive] = useState(initialValues ? initialValues.status === 'active' : true)
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(initialValues?.permissions || [])
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handlePermissionsChange = useCallback((ids: string[]) => {
    setSelectedPermissions((prev) => {
      const newIds = [...ids]
      const justAddedHandleTransfer = newIds.includes('handleTransfer.calls') && !prev.includes('handleTransfer.calls')
      const justAddedReply = newIds.includes('reply.sms_inbox') && !prev.includes('reply.sms_inbox')

      if ((justAddedHandleTransfer || justAddedReply) && !newIds.includes('view.team_member_dashboard')) {
        newIds.push('view.team_member_dashboard')
      }
      return newIds
    })
    setErrors((p) => ({ ...p, permissions: '' }))
  }, [])

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!name.trim()) errs.name = t('team_name_required', 'Team name is required')
    if (selectedPermissions.length === 0) errs.permissions = t('assign_permission_error', 'Assign at least one permission')
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) {
      toast.error(t('form_validation_error', 'Please provide a name and at least one permission.'))
      return
    }

    try {
      await onSubmit({
        name: name.trim(),
        description: description.trim(),
        status: isActive ? 'active' : 'inactive',
        permissions: selectedPermissions,
      })
    } catch (err) {
      const apiError = err as ApiError
      console.error('Submission error:', apiError)
      toast.error(apiError?.data?.message || t('failed_to_save_team', 'Failed to save team'))
    }
  }

  const flattenedPermissions = useMemo(() => {
    if (!permissionsData?.data) return []
    return permissionsData.data.flatMap(mod =>
      mod.submodules.map(sub => ({
        _id: sub.slug,
        id: sub.slug,
        name: sub.name,
        slug: sub.slug,
        description: sub.description
      }))
    )
  }, [permissionsData])

  return (
    <div className="w-full pb-10 animate-in fade-in slide-in-from-bottom-3 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push(ROUTES.TEAMS)} className="h-9 w-9 rounded-radius bg-primary/10 dark:bg-primary/20 text-primary transition-all duration-300 shadow-sm shrink-0 border-none border-primary/20">
            <ArrowLeft size={18} />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-title">{mode === "create" ? t("create_new_team", "Create New Team") : t("edit_team", "Edit Team")}</h1>
          </div>
        </div>
      </div>

      <form id="team-form" onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          <div className="xl:col-span-4 space-y-6">
            <div className="bg-white dark:bg-white/5 rounded-radius border border-input-border-color sm:p-6 p-4 transition-shadow">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-radius bg-primary/10 flex items-center justify-center text-primary">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold text-title">{t("general_information")}</h2>
              </div>

              <div className="space-y-8">
                <div className="space-y-3">
                  <Label htmlFor="team-name" className="text-md font-medium text-title mb-2">
                    {t("team_name", "Team Name")} <span className="text-rose-500">*</span>
                  </Label>
                  <Input
                    id="team-name"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setErrors((p) => ({ ...p, name: "" }));
                    }}
                    className={cn("h-10 bg-input-color border-input-border-color dark:bg-white/5 dark:border-white/10 focus:ring-primary/20 transition-all rounded-radius font-medium", errors.name && "border-rose-500 focus:ring-rose-500/20")}
                    placeholder={t("team_name_placeholder", "e.g. Sales Team")}
                  />
                  {errors.name && <p className="text-rose-500 text-[10px] font-bold mt-1.5 px-1 tracking-wider">{errors.name}</p>}
                </div>

                <div className="space-y-3">
                  <Label htmlFor="team-description" className="text-md font-medium text-title mb-2">
                    {t("description")}
                  </Label>
                  <Textarea id="team-description" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full min-h-30 p-4 bg-input-color border border-input-border-color dark:bg-white/5 dark:border-white/10 outline-none! focus:shadow-none! transition-all rounded-radius font-medium resize-none text-sm" placeholder={t("team_description_placeholder", "Briefly explain the team...")} />
                </div>

                <Label className={cn("flex items-center justify-between p-5 rounded-xl transition-all cursor-pointer group shadow-sm")}>
                  <div className="flex-1">
                    <p className={cn("font-bold text-sm transition-colors")}>
                      {t("active_status")}
                    </p>
                  </div>
                  <Switch checked={isActive} onCheckedChange={setIsActive} className="data-[state=checked]:bg-emerald-500" />
                </Label>
              </div>
            </div>
          </div>

          <div className="xl:col-span-8">
            <div className="bg-white rounded-lg border border-input-border-color dark:bg-white/5 sm:p-6 p-4 h-full flex flex-col">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-radius bg-primary/10 flex items-center justify-center text-primary">
                    <Check className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-title">{t("access_permissions", "Access Permissions")}</h2>
                    {errors.permissions && <p className="text-rose-500 text-[10px] font-bold tracking-wider mt-0.5 animate-pulse">{errors.permissions}</p>}
                  </div>
                </div>
              </div>

              <div className="flex-1">
                {isLoadingPermissions ? (
                  <div className="flex flex-col items-center justify-center py-32 bg-slate-50 dark:bg-slate-950/30 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                    <Spinner />
                    <p className="text-slate-500 text-sm font-bold tracking-widest">{t("fetching_permissions")}</p>
                  </div>
                ) : (
                  <PermissionPicker permissions={flattenedPermissions} selectedIds={selectedPermissions} onChange={handlePermissionsChange} />
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end flex-wrap gap-4 mt-8">
          <Button type="button" variant="ghost" onClick={() => router.push(ROUTES.TEAMS)} className="p-padding! h-12 bg-primary/10 hover:bg-primary hover:text-white text-primary font-bold transition-all" disabled={isLoading}>
            {t("back")}
          </Button>
          <Button type="submit" className="p-padding! h-12 bg-primary text-white  dark:border-white/10 dark:text-white font-bold transition-all" disabled={isLoading}>
            {isLoading ? t("processing", "Processing...") : mode === "create" ? t("create", "Create") : t("save_changes", "Save Changes")}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default TeamForm
