'use client'

import MultiSelectField from '@/components/shared/MultiSelectField'
import SelectField from '@/components/shared/SelectField'
import TextInput from '@/components/shared/TextInput'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'
import { useGetAgentsQuery } from '@/redux/api/agentApi'
import { WidgetFormProps } from '@/types/dashboard'
import { Widget } from '@/types/widget'
import { Form, Formik, FormikProps, useFormikContext } from 'formik'
import { ArrowRight, Clock, Palette, Settings, Timer } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import * as Yup from 'yup'

const timezones = [
  { label: 'UTC', value: 'UTC' },
  { label: 'EST (Eastern Standard Time)', value: 'EST' },
  { label: 'CST (Central Standard Time)', value: 'CST' },
  { label: 'PST (Pacific Standard Time)', value: 'PST' },
  { label: 'GMT (Greenwich Mean Time)', value: 'GMT' },
  { label: 'IST (Indian Standard Time)', value: 'IST' },
]

const daysOptions = [
  { label: 'Monday', value: 'Mon' },
  { label: 'Tuesday', value: 'Tue' },
  { label: 'Wednesday', value: 'Wed' },
  { label: 'Thursday', value: 'Thu' },
  { label: 'Friday', value: 'Fri' },
  { label: 'Saturday', value: 'Sat' },
  { label: 'Sunday', value: 'Sun' },
]

import { WidgetPreview } from './WidgetPreview'
import { useRouter } from 'next/navigation'
import { ROUTES } from '@/constants/routes'

const FormValuesObserver = ({ onValuesChange }: { onValuesChange: any }) => {
  const { values } = useFormikContext<any>()

  useEffect(() => {
    if (onValuesChange) {
      const allowed_domains = values.allowed_domains_string
        ? values.allowed_domains_string.split(',').map((d: string) => d.trim()).filter(Boolean)
        : []

      onValuesChange({
        name: values.name,
        agent_id: values.agent_id || null,
        status: values.status as 'active' | 'inactive',
        branding: {
          brand_name: values.branding.brand_name,
          button_label: values.branding.button_label,
          primary_color: values.branding.primary_color,
          icon_url: values.branding.icon_url || null,
          require_terms: values.branding.require_terms,
          terms_content: values.branding.terms_content,
        },
        settings: {
          allowed_domains,
          max_duration: Number(values.settings.max_duration),
          cooldown: Number(values.settings.cooldown),
          max_sessions: Number(values.settings.max_sessions),
          business_hours: {
            enabled: values.settings.business_hours.enabled,
            timezone: values.settings.business_hours.timezone,
            start_time: values.settings.business_hours.start_time,
            end_time: values.settings.business_hours.end_time,
            days: values.settings.business_hours.days,
          },
        },
      })
    }
  }, [values, onValuesChange])

  return null
}

export function WidgetForm({ initialValues, onSubmit, isLoading, onValuesChange }: WidgetFormProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'general' | 'branding' | 'duration' | 'hours'>('general')
  const formikRef = useRef<FormikProps<any>>(null)

  // Fetch agents to assign
  const { data: agentsData } = useGetAgentsQuery(undefined)
  const agents = agentsData?.data || []

  // Filter incoming type agents
  const incomingAgents = agents.filter((agent: any) => agent.type === 'incoming')
  const agentOptions = [
    { label: t('select_agent'), value: '' },
    ...incomingAgents.map((agent: any) => ({
      label: agent.name,
      value: agent._id || agent.id,
    })),
  ]

  const validationSchema = Yup.object().shape({
    name: Yup.string().required(t('name_required')),
    branding: Yup.object().shape({
      brand_name: Yup.string().required(t('brand_name_required')),
      button_label: Yup.string().required(t('button_label_required')),
      primary_color: Yup.string().required(t('primary_color_required')),
      terms_content: Yup.string().when('require_terms', {
        is: true,
        then: (schema) => schema.required(t('terms_content_required')),
        otherwise: (schema) => schema.optional(),
      }),
    }),
    settings: Yup.object().shape({
      max_duration: Yup.number().min(1, 'Must be greater than 0').required('Required'),
      cooldown: Yup.number().min(0, 'Cannot be negative').required('Required'),
      max_sessions: Yup.number().min(1, 'Must be greater than 0').required('Required'),
    }),
  })

  // Format initial values
  const formattedInitialValues = {
    name: initialValues.name || '',
    agent_id: initialValues.agent_id || '',
    status: initialValues.status || 'active',
    allowed_domains_string: initialValues.settings?.allowed_domains?.join(', ') || '',
    branding: {
      brand_name: initialValues.branding?.brand_name || t('your_company'),
      button_label: initialValues.branding?.button_label || t('voice_chat'),
      primary_color: initialValues.branding?.primary_color || '#3B82F6',
      icon_url: initialValues.branding?.icon_url || '',
      require_terms: initialValues.branding?.require_terms || false,
      terms_content: initialValues.branding?.terms_content || 'Please accept our terms and conditions before continuing.',
    },
    settings: {
      max_duration: initialValues.settings?.max_duration ?? 300,
      cooldown: initialValues.settings?.cooldown ?? 0,
      max_sessions: initialValues.settings?.max_sessions ?? 5,
      business_hours: {
        enabled: initialValues.settings?.business_hours?.enabled ?? false,
        timezone: initialValues.settings?.business_hours?.timezone ?? 'UTC',
        start_time: initialValues.settings?.business_hours?.start_time ?? '09:00',
        end_time: initialValues.settings?.business_hours?.end_time ?? '17:00',
        days: initialValues.settings?.business_hours?.days ?? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      },
    },
  }

  const handleSubmitForm = (values: typeof formattedInitialValues) => {
    const allowed_domains = values.allowed_domains_string
      ? values.allowed_domains_string.split(',').map((d) => d.trim()).filter(Boolean)
      : []

    const finalValues: Partial<Widget> = {
      name: values.name,
      agent_id: values.agent_id || null,
      status: values.status as 'active' | 'inactive',
      branding: {
        brand_name: values.branding.brand_name,
        button_label: values.branding.button_label,
        primary_color: values.branding.primary_color,
        icon_url: values.branding.icon_url || null,
        require_terms: values.branding.require_terms,
        terms_content: values.branding.terms_content,
      },
      settings: {
        allowed_domains,
        max_duration: Number(values.settings.max_duration),
        cooldown: Number(values.settings.cooldown),
        max_sessions: Number(values.settings.max_sessions),
        business_hours: {
          enabled: values.settings.business_hours.enabled,
          timezone: values.settings.business_hours.timezone,
          start_time: values.settings.business_hours.start_time,
          end_time: values.settings.business_hours.end_time,
          days: values.settings.business_hours.days,
        },
      },
    }

    onSubmit(finalValues)
  }

  const tabList = [
    {
      id: 'general',
      label: t('general_settings'),
      desc: 'Widget status & target domains',
      icon: Settings
    },
    {
      id: 'branding',
      label: t('branding_settings'),
      desc: 'Visual styles, colors & labels',
      icon: Palette
    },
    {
      id: 'duration',
      label: t('duration_settings'),
      desc: 'Call thresholds & limit settings',
      icon: Timer
    },
    {
      id: 'hours',
      label: t('business_hours_settings'),
      desc: 'Timezone-based dial availabilities',
      icon: Clock
    }
  ] as const

  return (
    <Formik
      initialValues={formattedInitialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmitForm}
      innerRef={formikRef}
    >
      {(formik) => {
        return (
          <Form className="space-y-0">
            {onValuesChange && <FormValuesObserver onValuesChange={onValuesChange} />}
            {/* Split layout inside the Left Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">

              {/* Left Column: Vertical Modern Tab Sidebar */}
              <div className="lg:col-span-4 xl:col-span-3 border border-input-border-color rounded-lg bg-bg-card p-4 sm:p-6 h-max flex flex-col gap-2">
                <div className="hidden lg:block pb-4 mb-2 border-b border-input-border-color">
                  <span className="text-md font-bold text-primary">
                    {t('configuration_menu', 'Configuration Menu')}
                  </span>
                </div>

                <div className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible gap-2 shrink-0 pb-2 custom-scrollbar">
                  {tabList.map((tab) => {
                    const TabIcon = tab.icon
                    const isTabActive = activeTab === tab.id
                    return (
                      <Button
                        key={tab.id}
                        type="button"
                        onClick={(e) => {
                          setActiveTab(tab.id)
                          e.currentTarget.scrollIntoView({
                            behavior: 'smooth',
                            block: 'nearest',
                            inline: 'center',
                          })
                        }}
                        className={cn(
                          'relative w-max lg:w-full h-15 text-left p-4 rounded-radius flex items-center gap-3.5 border transition-all duration-300 group shrink-0 min-w-[200px] lg:min-w-0 outline-none',
                          isTabActive
                            ? 'bg-primary/10 border-input-border-color'
                            : 'bg-transparent border-transparent hover:bg-subcard text-subtitle-color hover:text-title'
                        )}
                      >
                        {/* Dynamic Side accent line using the brand primary color */}
                        {isTabActive && (
                          <div
                            className="absolute bg-primary left-0 rtl:left-[unset] rtl:right-0 top-3 bottom-3 w-[4px] rounded-r-full"
                          />
                        )}

                        <div
                          className={cn(
                            'w-10 h-10 rounded-lg flex items-center text-white hover:text-white justify-center border transition-all duration-300',
                            isTabActive
                              ? 'border-transparent text-white! bg-primary'
                              : 'bg-primary dark:bg-white/5 border-primary dark:border-white/5 group-hover:scale-105'
                          )}
                        >
                          <TabIcon className="w-4.5 h-4.5" />
                        </div>

                        <div className="block text-left rtl:text-right truncate flex-1">
                          <h4 className={cn(
                            'text-md truncate font-bold',
                            isTabActive ? 'text-primary' : 'text-subtitle-color'
                          )}>
                            {tabList.find(t => t.id === tab.id)?.label}
                          </h4>
                          <p className="text-sm text-subtitle-color truncate mt-0.5 leading-1.5 font-medium leading-none">
                            {tab.desc}
                          </p>
                        </div>
                      </Button>
                    )
                  })}
                </div>
              </div>

              {/* Right Column: Dynamic Form Inputs Container */}
              <div className="lg:col-span-8 xl:col-span-9">
                <div className=" border border-input-border-color rounded-radius bg-bg-card sm:p-6 p-4 relative h-full min-h-[600px] flex flex-col">

                  {/* Fixed positioning for the WidgetPreview in bottom right of the screen */}
                  <div className="fixed bottom-8 right-8 rtl:right-[unset] rtl:left-8 z-[100]">
                    <WidgetPreview widgetData={formik.values as unknown as Partial<Widget>} />
                  </div>

                  {/* Dynamic Active Tab Label Header */}
                  <div className="flex items-center gap-2 pb-5 mb-5 border-b border-input-border-color">
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    <h3 className="text-base truncate font-bold text-title">
                      {tabList.find(t => t.id === activeTab)?.label}
                    </h3>
                  </div>

                  <div className="min-h-[280px]">
                    {activeTab === 'general' && (
                      <div className="space-y-5 animate-in fade-in duration-200">
                        <TextInput
                          name="name"
                          label={t('widget_name')}
                          placeholder={t('widget_name_placeholder')}
                        />

                        <SelectField
                          name="agent_id"
                          label={t('assigned_agent')}
                          options={agentOptions}
                          emptyStateTitle={t('no_agents_found', { defaultValue: 'No Agents Found' })}
                          emptyStateDescription={t('no_agents_desc', { defaultValue: 'Please add an agent before creating this record.' })}
                          emptyStateActionLabel={t('add_agent', { defaultValue: 'Add Agent' })}
                          onEmptyStateAction={() => router.push(ROUTES.AI_ASSISTANTS)}
                        />

                        <TextInput
                          name="allowed_domains_string"
                          label={t('allowed_domains')}
                          placeholder={t('allowed_domains_placeholder')}
                          helperText="Limit widget display to specific websites (comma separated)."
                        />

                        <div className="flex items-center justify-between pt-6 mt-6 border-t border-input-border-color gap-4">
                          <div className="space-y-0.5 flex-1">
                            <h4 className="text-md font-bold text-title">
                              {t('status', 'STATUS')}
                            </h4>
                            <p className="text-xs text-subtitle-color font-medium">
                              {t('widget_status_desc', 'Enable or disable widget on your digital assets.')}
                            </p>
                          </div>
                          <Switch
                            checked={formik.values.status === 'active'}
                            onCheckedChange={(checked) => formik.setFieldValue('status', checked ? 'active' : 'inactive')}
                          />
                        </div>
                      </div>
                    )}

                    {activeTab === 'branding' && (
                      <div className="space-y-5 animate-in fade-in duration-200">
                        <TextInput
                          name="branding.brand_name"
                          label={t('brand_name')}
                          placeholder={t('brand_name_placeholder')}
                        />

                        <TextInput
                          name="branding.button_label"
                          label={t('button_label')}
                          placeholder={t('button_label_placeholder')}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <TextInput
                            name="branding.icon_url"
                            label={t('logo_icon_url')}
                            placeholder={t('logo_icon_url_placeholder')}
                          />

                          <div className="space-y-1.5 flex flex-col">
                            <Label className="text-md font-medium leading-none text-title mb-2!">
                              {t('primary_color')}
                            </Label>
                            <div className="flex gap-3 items-start">
                              <div className="relative w-10 h-10 rounded-radius overflow-hidden border border-input-border-color shrink-0 shadow-sm transition-all hover:ring-primary/20">
                                <Input
                                  type="color"
                                  value={formik.values.branding.primary_color}
                                  onChange={(e) => formik.setFieldValue('branding.primary_color', e.target.value)}
                                  className="absolute -top-2 -left-2 w-16 h-16 cursor-pointer p-0 border-0 appearance-none bg-transparent outline-none"
                                />
                              </div>
                              <div className="flex-1">
                                <TextInput
                                  name="branding.primary_color"
                                  placeholder="#3B82F6"
                                  formGroupClass="mb-0!"
                                />
                              </div>
                            </div>
                          </div>
                        </div>


                      </div>
                    )}

                    {activeTab === 'duration' && (
                      <div className="space-y-5 animate-in fade-in duration-200">
                        <TextInput
                          name="settings.max_duration"
                          type="number"
                          label={t('max_duration')}
                          placeholder="300"
                        />

                        <TextInput
                          name="settings.cooldown"
                          type="number"
                          label={t('cooldown')}
                          placeholder="0"
                        />

                        <TextInput
                          name="settings.max_sessions"
                          type="number"
                          label={t('max_sessions')}
                          placeholder="5"
                        />
                      </div>
                    )}

                    {activeTab === 'hours' && (
                      <div className="space-y-5 animate-in fade-in duration-200">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <h4 className="text-md font-bold text-title">
                              {t('business_hours_enabled')}
                            </h4>
                            <p className="text-md text-subtitle-color font-medium">
                              {t('business_hours_enabled_desc')}
                            </p>
                          </div>
                          <Switch
                            checked={formik.values.settings.business_hours.enabled}
                            onCheckedChange={(checked) => formik.setFieldValue('settings.business_hours.enabled', checked)}
                          />
                        </div>

                          <div className={cn("space-y-5 sm:p-5 p-4 bg-subcard border border-input-border-color rounded-lg transition-opacity duration-300", !formik.values.settings.business_hours.enabled && "opacity-60 pointer-events-none")}>
                            <SelectField
                              name="settings.business_hours.timezone"
                              label={t('timezone')}
                              options={timezones}
                              disabled={!formik.values.settings.business_hours.enabled}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <TextInput
                                name="settings.business_hours.start_time"
                                type="time"
                                label={t('start_time')}
                                disabled={!formik.values.settings.business_hours.enabled}
                              />

                              <TextInput
                                name="settings.business_hours.end_time"
                                type="time"
                                label={t('end_time')}
                                disabled={!formik.values.settings.business_hours.enabled}
                              />
                            </div>

                            <MultiSelectField
                              label={t('available_days')}
                              options={daysOptions}
                              value={formik.values.settings.business_hours.days}
                              onChange={(val) => formik.setFieldValue('settings.business_hours.days', val)}
                              placeholder={t('select_active_days')}
                              disabled={!formik.values.settings.business_hours.enabled}
                            />
                          </div>
                      </div>
                    )}
                  </div>

                  {/* Form Footer Action */}
                  <div className="flex justify-end pt-6 mt-auto border-t border-input-border-color">
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="rounded-radius bg-primary p-padding h-11 text-white font-bold transition-all shadow-none hover:opacity-90 flex items-center justify-center sm:justify-start gap-2 w-full sm:w-auto"
                    >
                      {isLoading ? t('saving') : t('save_changes')}
                      <ArrowRight className="w-4.5 h-4.5" />
                    </Button>
                  </div>

                </div>
              </div>

            </div>
          </Form>
        )
      }}
    </Formik>
  )
}
