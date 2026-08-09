'use client'

import { GuideForm } from '@/components/features/tenant-guide-setup/GuideForm'
import Spinner from '@/components/reusable/Spinner'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/constants/routes'
import { usePermission } from '@/hooks/usePermission'
import { useGetTenantGuideByIdQuery, useUpdateTenantGuideMutation } from '@/redux/api/tenantGuideApi'
import { ApiError } from '@/types/api'
import { AlertTriangle, ArrowLeft, BookOpen } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

export default function EditTenantGuidePage() {
  const { t } = useTranslation()
  const router = useRouter()
  const { id } = useParams() as { id: string }
  const { isAdmin } = usePermission()

  const isUserAdmin = isAdmin()

  const { data, isLoading: isLoadingGuide } = useGetTenantGuideByIdQuery({ id }, {
    skip: !isUserAdmin || !id,
  })

  const [updateGuide, { isLoading: isUpdating }] = useUpdateTenantGuideMutation()

  const handleSubmit = async (values: any) => {
    try {
      const res = await updateGuide({
        id,
        data: values,
      }).unwrap()
      toast.success(res.message || t('guide_updated_successfully'))
      router.push(ROUTES.TENANT_GUIDE_SETUP)
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t('something_went_wrong'))
    }
  }

  if (!isUserAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <AlertTriangle className="h-16 w-16 text-destructive" />
        <h1 className="text-2xl font-bold">{t('access_denied')}</h1>
        <p className="text-muted-foreground">{t('no_permission_settings')}</p>
        <Button onClick={() => router.push(ROUTES.TENANT_GUIDE_SETUP)}>{t('go_back')}</Button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push(ROUTES.TENANT_GUIDE_SETUP)}
          className="h-10 w-10 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm"
        >
          <ArrowLeft className="h-5 w-5 text-slate-600 dark:text-slate-300" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-title flex items-center gap-2.5">
            <BookOpen className="h-6 w-6 text-primary" />
            <span>{t('edit_tenant_guide')}</span>
          </h1>
          <p className="text-sm text-subtitle-color mt-1">
            {t('edit_guide_desc_form')}
          </p>
        </div>
      </div>

      {isLoadingGuide ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-950/50 rounded-2xl border border-slate-200 dark:border-slate-800">
          <Spinner />
          <p className="text-sm text-subtitle-color mt-2">{t('loading')}</p>
        </div>
      ) : data?.tenantGuide ? (
        <GuideForm
          initialValues={data.tenantGuide}
          onSubmit={handleSubmit}
          isLoading={isUpdating}
          mode="edit"
        />
      ) : (
        <div className="text-center py-20 bg-white dark:bg-slate-950/50 rounded-2xl border border-slate-200 dark:border-slate-800">
          <p className="text-sm text-destructive font-bold">{t('guide_not_found')}</p>
        </div>
      )}
    </div>
  )
}
