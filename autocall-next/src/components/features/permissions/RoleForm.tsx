'use client'

import { Loader2 } from '@/components/reusable/Loader2'
import Spinner from '@/components/reusable/Spinner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textArea'
import { ROUTES } from '@/constants/routes'
import { cn } from '@/lib/utils'
import { useGetAllPermissionsQuery } from '@/redux/api/roleApi'
import { ApiError } from '@/types/api'
import { RoleFormProps } from '@/types/role'
import { ArrowLeft, Check, Save, ShieldCheck } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import PermissionPicker from './PermissionPicker'

const RoleForm = ({ initialValues, onSubmit, isLoading, mode }: RoleFormProps) => {
  const router = useRouter()
  const { t } = useTranslation();
  const { data: permissionsData, isLoading: isLoadingPermissions } = useGetAllPermissionsQuery()

  const [name, setName] = useState(initialValues?.name || '')
  const [description, setDescription] = useState(initialValues?.description || '')
  const [isActive, setIsActive] = useState(() => {
    if (initialValues?.system_reserved) return true;
    if (initialValues) return initialValues.is_active !== false;
    return true;
  });
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(initialValues?.permissions || [])
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handlePermissionsChange = useCallback((ids: string[]) => {
    setSelectedPermissions(ids)
    setErrors((p) => ({ ...p, permissions: '' }))
  }, [])

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!name.trim()) errs.name = 'Role name is required'
    if (selectedPermissions.length === 0) errs.permissions = 'Assign at least one permission'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) {
      toast.error('Please provide a name and at least one permission.')
      return
    }

    try {
      // The backend expects slugs for the single-API-call update
      const permissionsAsSlugs = selectedPermissions
        .map(id => permissionsData?.data?.find((p: any) => p._id === id || p.id === id)?.slug)
        .filter(Boolean) as string[];

      await onSubmit({
        name: name.trim(),
        description: description.trim(),
        status: isActive ? 'active' : 'inactive',
        is_active: isActive,
        permission_ids: selectedPermissions,
        permissions: permissionsAsSlugs,
      } as any)
    } catch (err) {
      const apiError = err as ApiError
      console.error('Submission error:', apiError)
      toast.error(apiError?.data?.message || t('failed_to_save_role'))
    }
  }

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-3 duration-700">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.push(ROUTES.PERMISSIONS)} className="h-9 w-9 rounded-radius bg-primary/10 dark:bg-primary/20 text-primary transition-all duration-300 shadow-sm shrink-0 border-none border-primary/20">
            <ArrowLeft size={18} />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-title ">{mode === "create" ? t('create_new_role') : "Edit Role"}</h1>
          </div>
        </div>
      </div>

      <form id="role-form" onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          {/* Sidebar - General Information */}
          <div className="xl:col-span-4 space-y-6">
            <div className="bg-bg-card rounded-radius border border-input-border-color  sm:p-6 p-4  transition-shadow">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-radius bg-primary/10 flex items-center justify-center text-primary">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold text-title">{t("general_information")}</h2>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="role-name" className="text-md font-medium  text-title mb-2">
                    {t("display_name")} <span className="text-rose-500">*</span>
                  </Label>
                  <Input
                    id="role-name"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setErrors((p) => ({ ...p, name: "" }));
                    }}
                    className={cn("h-10 bg-input-color  border-input-border-color dark:bg-white/5 dark:border-white/10 focus:ring-primary/20 transition-all rounded-radius font-medium", errors.name && "border-rose-500 focus:ring-rose-500/20")}
                    placeholder="e.g. System Administrator"
                    disabled={initialValues?.system_reserved}
                  />
                  {errors.name && <p className="text-rose-500 text-[10px] font-bold mt-1.5 px-1  tracking-wider">{errors.name}</p>}
                </div>

                <div className="space-y-3">
                  <Label htmlFor="role-description" className="text-md font-medium  text-title mb-2">
                    {t("role_description")}
                  </Label>
                  <Textarea id="role-description" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full min-h-30 p-4 bg-input-color  border border-input-border-color dark:bg-white/5 dark:border-white/10  outline-none! focus:shadow-none! focus:border-none! transition-all rounded-radius font-medium resize-none text-sm" placeholder="Briefly explain the responsibilities of this role..." />
                </div>

                <Label className={cn("flex items-center justify-between p-5 rounded-radius border border-input-border-color transition-all cursor-pointer group", initialValues?.system_reserved && "opacity-50 cursor-not-allowed")}>
                  <div className="flex-1">
                    <p className={cn("font-bold text-base transition-colors")}>
                      {t("active_status")}
                    </p>
                    <p className="text-md text-subtitle-color mt-0.5 font-medium  tracking-tight">{t('available_for_member_assignment')}</p>
                  </div>
                  <Switch checked={isActive} onCheckedChange={setIsActive} disabled={initialValues?.system_reserved} className="data-[state=checked]:bg-emerald-500" />
                </Label>
              </div>
            </div>
          </div>

          {/* Main Content - Access Permissions */}
          <div className="xl:col-span-8">
            <div className="bg-bg-card rounded-radius border border-input-border-color sm:p-6 p-4 h-full flex flex-col">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-radius bg-primary/10 flex items-center justify-center text-primary">
                    <Check className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-title">{t('access_permissions')}</h2>
                    {errors.permissions && <p className="text-rose-500 text-[10px] font-bold  tracking-wider mt-0.5 animate-pulse">{errors.permissions}</p>}
                  </div>
                </div>
              </div>

              <div className="flex-1">
                {isLoadingPermissions ? (
                  <div className="flex flex-col items-center justify-center py-32 bg-slate-50 dark:bg-slate-950/30 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                    <Spinner />
                    <p className="text-slate-500 text-sm font-bold  tracking-widest">{t("fetching_permissions")}</p>
                  </div>
                ) : (
                  <PermissionPicker permissions={permissionsData?.data || []} selectedIds={selectedPermissions} onChange={handlePermissionsChange} />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end flex-wrap gap-4 mt-8 ">
          <Button type="button" variant="ghost" onClick={() => router.push(ROUTES.PERMISSIONS)} className="p-padding! border-none h-11 rounded-lg border-input-border-color bg-primary/10 text-primary hover:bg-primary hover:text-white font-medium " disabled={isLoading}>
            {t("back")}
          </Button>
          <Button type="submit" className="p-padding! h-11 bg-primary  text-white  gap-2 dark:text-white font-medium transition-all" disabled={isLoading}>
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            {isLoading ? "Processing..." : mode === "create" ? t('create') : t('save_changes')}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default RoleForm
