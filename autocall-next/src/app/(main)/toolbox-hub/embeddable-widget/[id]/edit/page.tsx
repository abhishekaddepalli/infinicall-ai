'use client'

import { WidgetManagerLayout } from '@/components/features/widgets/WidgetManagerLayout'
import { ROUTES } from '@/constants/routes'
import { useGetWidgetByIdQuery, useUpdateWidgetMutation } from '@/redux/api/widgetApi'
import { Widget } from '@/types/widget'
import { RefreshCw } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

export default function EditWidgetPage() {
  const { t } = useTranslation()
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const { data: widgetData, isLoading: isLoadingWidget } = useGetWidgetByIdQuery(id, {
    skip: !id,
  })
  const [updateWidget, { isLoading: isUpdating }] = useUpdateWidgetMutation()

  const handleSubmit = async (values: Partial<Widget>) => {
    try {
      await updateWidget({ id, ...values }).unwrap()
      toast.success(t('widget_updated_successfully'))
      router.push(ROUTES.TOOLBOX_EMBEDDED_WIDGETS)
    } catch (error: any) {
      toast.error(error?.data?.message || t('something_went_wrong'))
    }
  }

  if (isLoadingWidget) {
    return (
      <div className="w-full min-h-[400px] flex flex-col items-center justify-center gap-4">
        <RefreshCw className="w-8 h-8 text-primary animate-spin" />
        <p className="text-sm font-bold text-zinc-400 animate-pulse uppercase tracking-wider">
          {t('loading')}
        </p>
      </div>
    )
  }

  const initialWidgetValues = widgetData?.data || {}

  return (
    <WidgetManagerLayout
      title={
        <>
          {t('edit_widget')}
        </>
      }
      initialValues={initialWidgetValues}
      onSubmit={handleSubmit}
      isLoading={isUpdating}
    />
  )
}
