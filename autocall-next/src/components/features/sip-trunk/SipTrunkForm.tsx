'use client'

import SelectField from '@/components/shared/SelectField'
import TextInput from '@/components/shared/TextInput'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ROUTES } from '@/constants/routes'
import { predefinedProviders, transportOptions } from '@/data/integration'
import {
  CreateSipTrunkPayload,
  SipTransport,
  SipTrunkFormProps,
  SipTrunkStatus,
} from '@/types/sip-trunk'
import { Form, Formik, useFormikContext } from 'formik'
import { ArrowLeft, Globe, Info, Lock } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import * as yup from 'yup'

const PresetHandler = () => {
  const { values, setValues } = useFormikContext<any>()
  const previousPreset = useRef(values.preset)

  useEffect(() => {
    if (values.preset && values.preset !== previousPreset.current) {
      previousPreset.current = values.preset
      if (values.preset === 'custom') {
        setValues({
          ...values,
          name: '',
          provider: '',
          engine: 'elevenlabs_sip',
          sip_host: '',
          port: '',
          transport: 'udp',
          auth_realm: '',
          default_caller_id: '',
          region: '',
          username: '',
          password: ''
        }, false)
      } else {
        const preset = predefinedProviders.find(p => p.value === values.preset)
        if (preset && preset.config) {
          setValues({
            ...values,
            ...preset.config
          }, false)
        }
      }
    }
  }, [values.preset])

  return null
}

const SipTrunkForm = ({
  initialValues,
  onSubmit,
  isLoading,
  title,
  subtitle,
  isEdit = false,
}: SipTrunkFormProps & { isEdit?: boolean }) => {
  const { t } = useTranslation()
  const router = useRouter()

  const defaultValues = {
    preset: 'custom',
    name: '',
    engine: 'vobiz_sip',
    provider: 'twilio',
    sip_host: '',
    port: 5061,
    transport: 'tls',
    username: '',
    password: '',
    auth_realm: '',
    default_caller_id: '',
    region: '',
    status: 'active',
    ...initialValues,
  }

  const validationSchema = yup.object({
    name: yup.string().required(t('field_required')),
    sip_host: yup.string().required(t('field_required')),
    port: yup.number().min(1).max(65535).required(),
  })

  return (
    <div className="space-y-6 py-2 animate-in fade-in duration-500">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          type="button"
          className="h-9 w-9 rounded-radius bg-primary/10 dark:bg-primary/20 text-primary transition-all duration-300 shadow-sm shrink-0 border-none border-primary/20"
          onClick={() => router.push(ROUTES.TRUNK_INTEGRATION)}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold text-title">{title}</h1>
          {subtitle && (
            <p className="text-xs sm:text-sm font-medium text-subtitle-color mt-1">{subtitle}</p>
          )}
        </div>
      </div>

      <Formik
        initialValues={defaultValues}
        enableReinitialize
        validationSchema={validationSchema}
        onSubmit={(values) => {
          const payload: CreateSipTrunkPayload = {
            name: values.name,
            engine: values.engine,
            provider: values.provider,
            sip_host: values.sip_host,
            port: Number(values.port),
            transport: values.transport as SipTransport,
            username: values.username?.trim() || null,
            password: values.password?.trim() || null,
            auth_realm: values.auth_realm?.trim() || null,
            default_caller_id: values.default_caller_id?.trim() || null,
            region: values.region?.trim() || null,
            status: values.status as SipTrunkStatus,
          }

          if (isEdit && !payload.password) {
            delete payload.password
          }

          return onSubmit(payload)
        }}
      >
        {() => {
          return (
            <Form className="space-y-6">
              <Card className="bg-bg-card border border-input-border-color rounded-radius mb-6">
                <CardContent className="sm:p-6 p-4">
                  <SelectField
                    name="preset"
                    label={t('sip_configuration_preset', 'SIP Configuration Template')}
                    options={predefinedProviders}
                  />
                  <PresetHandler />
                </CardContent>
              </Card>

              {/* General Information Card */}
              <Card className="bg-bg-card border border-input-border-color rounded-lg">
                <CardHeader className="sm:px-6 px-4 py-4 border-b border-input-border-color bg-bg-card">
                  <CardTitle className="text-lg font-bold text-title flex items-center gap-2">
                    <Info className="w-5 h-5 text-primary" />
                    {t('general_information', 'General Information')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="sm:p-6 p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <TextInput name="name" label={t('trunk_name')} placeholder={t('my_sip_trunk')} />
                    <SelectField
                      name="status"
                      label={t('status')}
                      options={[
                        { label: t('active'), value: 'active' },
                        { label: t('inactive'), value: 'inactive' },
                      ]}
                    />
                    <SelectField
                      name="engine"
                      label={t('engine', 'Voice / Trunk Engine')}
                      options={[
                        { label: 'Vobiz AI SIP Engine', value: 'vobiz_sip' },
                        { label: 'Sarvam AI SIP Engine', value: 'sarvam_sip' },
                        { label: 'ElevenLabs SIP Engine', value: 'elevenlabs_sip' },
                        { label: 'Deepgram SIP Engine', value: 'deepgram_sip' },
                        { label: 'Custom SIP Engine', value: 'custom' },
                      ]}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Connection Details Card */}
              <Card className="bg-bg-card border border-input-border-color rounded-lg">
                <CardHeader className="sm:px-6 px-4 py-4 border-b border-input-border-color bg-bg-card">
                  <CardTitle className="text-lg font-bold text-title flex items-center gap-2">
                    <Globe className="w-5 h-5 text-primary" />
                    {t('connection_details', 'Connection Details')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="sm:p-6 p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <TextInput name="sip_host" label={t('sip_host')} />
                    <TextInput name="region" label={t('region', 'Region')} />
                    <TextInput name="port" label={t('port', 'Port')} type="number" />
                    <SelectField
                      name="transport"
                      label={t('transport', 'Transport')}
                      options={transportOptions}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Authentication Settings Card */}
              <Card className="bg-bg-card border border-input-border-color rounded-lg">
                <CardHeader className="sm:px-6 px-4 py-4 border-b border-input-border-color bg-bg-card">
                  <CardTitle className="text-lg font-bold text-title flex items-center gap-2">
                    <Lock className="w-5 h-5 text-primary" />
                    {t('authentication_settings', 'Authentication Settings')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="sm:p-6 p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <TextInput name="username" label={t('username')} />
                    <TextInput
                      name="password"
                      label={t('password')}
                      type="password"
                      placeholder={isEdit ? t('leave_blank_to_keep') : ''}
                    />
                    <TextInput name="auth_realm" label={t('auth_realm', 'Auth Realm')} />
                    <TextInput name="default_caller_id" label={t('default_outbound_number', 'Default Outbound Number')} />
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="h-11 p-padding! rounded-lg bg-primary text-white font-bold"
                >
                  {isEdit ? t('save_changes') : t('create')}
                </Button>
              </div>
            </Form>
          )
        }}
      </Formik>
    </div>
  )
}

export default SipTrunkForm
