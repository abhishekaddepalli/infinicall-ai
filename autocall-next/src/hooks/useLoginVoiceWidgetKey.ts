'use client'

import { useGetPublicSettingsQuery } from '@/redux/api/adminSettingApi'
import { Widget } from '@/types/widget'
import { useMemo } from 'react'

const extractWidgetKey = (loginWidgetKey: unknown): string => {
  if (!loginWidgetKey) return ''

  if (typeof loginWidgetKey === 'object') {
    const widget = loginWidgetKey as Widget
    return widget.widget_key || ''
  }

  return ''
}

export const useLoginVoiceWidgetKey = () => {
  const { data, isLoading, isError } = useGetPublicSettingsQuery(undefined)

  const widgetKey = useMemo(
    () => extractWidgetKey(data?.settings?.login_widget_key),
    [data?.settings?.login_widget_key],
  )

  return { widgetKey, isLoading, isError }
}
