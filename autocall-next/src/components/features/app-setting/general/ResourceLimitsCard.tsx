'use client'

import SelectField from '@/components/shared/SelectField'
import TextInput from '@/components/shared/TextInput'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { generalResourceLimit } from '@/data/setting'
import { useGetWidgetsQuery } from '@/redux/api/widgetApi'
import { Widget } from '@/types/widget'
import { useTranslation } from 'react-i18next'

const NONE_WIDGET_VALUE = 'none'

const ResourceLimitsCard = () => {
  const { t } = useTranslation()
  const { data: widgetsData, isLoading: isLoadingWidgets } = useGetWidgetsQuery()

  const widgetOptions = [
    {
      label: t('login_widget_none'),
      value: NONE_WIDGET_VALUE,
    },
    ...(widgetsData?.data || []).map((widget: Widget) => ({
      label: widget.widget_key
        ? `${widget.name} (${widget.widget_key})`
        : widget.name,
      value: widget._id || widget.id || '',
    })).filter((option) => option.value !== ''),
  ]

  return (
    <Card className="bg-bg-card border border-input-border-color rounded-radius overflow-hidden lg:col-span-1">
      <CardHeader className="sm:px-6 px-4 py-4 border-b border-input-border-color bg-bg-card">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <CardTitle className="text-xl font-bold text-title">
              {t('resource_limits')}
            </CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 sm:p-6 p-4 pt-2!">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {generalResourceLimit.map((field) => (
            <div key={field.name} className="relative group/input">
              <TextInput
                name={field.name}
                label={
                  <div className="flex items-center gap-2">
                    <span>{t(field.label)}</span>
                    <span className="text-sm opacity-60 group-hover/input:opacity-100 transition-opacity">
                      {field.icon}
                    </span>
                  </div>
                }
                type="number"
                className="transition-all duration-300"
              />
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-input-border-color">
          <SelectField
            name="login_widget_key"
            label={t('login_widget')}
            placeholder={
              isLoadingWidgets
                ? t('loading')
                : t('select_login_widget')
            }
            helperText={t('login_widget_desc', {
              defaultValue: 'Choose the embeddable widget displayed on the login page.',
            })}
            options={widgetOptions}
          />
        </div>
      </CardContent>
    </Card>
  )
}

export default ResourceLimitsCard
