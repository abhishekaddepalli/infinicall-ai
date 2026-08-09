'use client'

import { WidgetManagerLayout } from '@/components/features/widgets/WidgetManagerLayout'
import { ROUTES } from '@/constants/routes'
import { useCreateWidgetMutation } from '@/redux/api/widgetApi'
import { Widget } from '@/types/widget'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

const defaultWidgetValues: Partial<Widget> = {
  name: 'Website Chat Assistant',
  status: 'active',
  branding: {
    brand_name: 'Your Company',
    button_label: 'VOICE CHAT',
    primary_color: '#015482',
    require_terms: false,
    terms_content: 'Please accept our terms and conditions before continuing.',
    icon_url: null,
  },
  settings: {
    allowed_domains: [],
    max_duration: 300,
    cooldown: 0,
    max_sessions: 5,
    business_hours: {
      enabled: false,
      timezone: 'UTC',
      start_time: '09:00',
      end_time: '17:00',
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    },
  },
}

export default function CreateWidgetPage() {
  const { t } = useTranslation()
  const router = useRouter()
  const [createWidget, { isLoading }] = useCreateWidgetMutation()

  const handleSubmit = async (values: Partial<Widget>) => {
    try {
      await createWidget(values).unwrap()
      toast.success(t('widget_created_successfully'))
      router.push(ROUTES.TOOLBOX_EMBEDDED_WIDGETS)
    } catch (error: any) {
      toast.error(error?.data?.message || t('something_went_wrong'))
    }
  }

  return (
    <WidgetManagerLayout
      title={t('create_widget')}
      initialValues={defaultWidgetValues}
      onSubmit={handleSubmit}
      isLoading={isLoading}
    />
  )
}
