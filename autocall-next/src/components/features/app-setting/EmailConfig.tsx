'use client'

import { Loader2 } from '@/components/reusable/Loader2'
import Spinner from '@/components/reusable/Spinner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  useGetAdminSettingsQuery,
  useSendTestMailMutation,
  useUpdateAdminSettingsMutation,
} from '@/redux/api/adminSettingApi'
import { ApiError } from '@/types/api'
import { EmailConfigForm } from '@/types/settings'
import { emailConfigSchemas } from '@/utils/validation-schemas'
import { Form, Formik } from 'formik'
import { Save, Send } from 'lucide-react'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import EmailProviderSelect from './email/EmailProviderSelect'
import EmailTestModal from './email/EmailTestModal'
import SendGridConfig from './email/SendGridConfig'
import SmtpConfig from './email/SmtpConfig'

const EmailConfig = () => {
  const { t } = useTranslation()
  const { data: adminData, isLoading: isFetching } = useGetAdminSettingsQuery(undefined)
  const [updateAdminSettings, { isLoading: isUpdating }] = useUpdateAdminSettingsMutation()
  const [testEmailConfig, { isLoading: isTesting }] = useSendTestMailMutation()

  const [showTestModal, setShowTestModal] = useState(false)
  const [testEmail, setTestEmail] = useState('')

  const initialValues: EmailConfigForm = {
    emailProvider: 'nodemailer',
    fromName: '',
    fromEmail: '',
    config: {
      smtp_host: '',
      smtp_port: '',
      smtp_user: '',
      smtp_pass: '',
      mail_encryption: 'tls',
      sendgrid_api_key: '',
    },
  }

  const formValues: EmailConfigForm = React.useMemo(() => {
    if (adminData?.settings) {
      const settings = adminData.settings
      return {
        emailProvider: 'nodemailer', // Default to nodemailer as backend only supports SMTP for now
        fromName: settings.mail_from_name || '',
        fromEmail: settings.mail_from_email || '',
        config: {
          smtp_host: settings.smtp_host || '',
          smtp_port: settings.smtp_port || '',
          smtp_user: settings.smtp_user || '',
          smtp_pass: settings.smtp_pass || '',
          mail_encryption: settings.mail_encryption || 'tls',
          sendgrid_api_key: '',
        },
      }
    }
    return initialValues
  }, [adminData])

  const onSubmit = async (values: EmailConfigForm) => {
    try {
      const payload = {
        mail_from_name: values.fromName,
        mail_from_email: values.fromEmail,
        smtp_host: values.config.smtp_host,
        smtp_port: values.config.smtp_port,
        smtp_user: values.config.smtp_user,
        smtp_pass: values.config.smtp_pass,
        mail_encryption: values.config.mail_encryption,
      }
      const res = await updateAdminSettings(payload).unwrap()
      toast.success(res.message || t('email_config_updated'))
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t('failed_to_update_email_config'))
    }
  }

  const handleTestEmail = async () => {
    if (!testEmail) {
      toast.error(t('enter_test_email'))
      return
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!emailRegex.test(testEmail)) {
      toast.error(t('invalid_email'))
      return
    }

    try {
      const res = await testEmailConfig({ to: testEmail }).unwrap()
      toast.success(res.message || t('test_email_sent'))
      setShowTestModal(false)
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t('failed_to_send_test_email'))
    }
  }

  if (isFetching) {
    return <Spinner className="py-20 h-auto" size="md" />
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <Card className="border-glass-border bg-light-body glass-card glass-dark-card dark:border-none rounded-border-radius overflow-hidden group hover:shadow-primary/5 transition-all duration-500">
        <CardHeader className="sm:p-6 p-4 pb-4 border-b border-glass-border/30">
          <div className="flex items-center gap-4">
            <div>
              <CardTitle className="text-lg font-medium text-title-color/90 dark:text-white">
                {t('configure_email_provider')}
              </CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent className="sm:p-6 p-4 pt-6">
          <Formik
            initialValues={formValues}
            enableReinitialize
            validationSchema={emailConfigSchemas.update(t)}
            onSubmit={onSubmit}
          >
            {({ values }) => (
              <Form className="space-y-10">
                <EmailProviderSelect />

                {values.emailProvider === 'nodemailer' && <SmtpConfig />}

                {values.emailProvider === 'sendgrid' && <SendGridConfig />}

                <div className="flex flex-col sm:flex-row justify-end gap-3 border-t border-glass-border/30">
                  <Button
                    type="button"
                    variant="glass"
                    onClick={() => setShowTestModal(true)}
                    disabled={!adminData?.settings?.smtp_host}
                    className="py-6 px-8 rounded-[8px] p-button-padding! btn-color sm:h-12 h-10 font-medium glass-dark-card text-sm group transition-all hover:bg-primary text-white"
                  >
                    <Send className="w-4 h-4 transition-transform" />
                    {t('test_configuration')}
                  </Button>
                  <Button
                    type="submit"
                    disabled={isUpdating}
                    variant="premium"
                    className="py-6 px-8 rounded-[8px] p-button-padding! btn-color sm:h-12 h-10 font-medium text-sm group transition-all shadow-none"
                  >
                    {isUpdating ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4 group-hover:scale-110 transition-all" />
                    )}
                    {t('save_configuration')}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </CardContent>
      </Card>

      <EmailTestModal
        show={showTestModal}
        onClose={() => setShowTestModal(false)}
        onSend={handleTestEmail}
        testEmail={testEmail}
        setTestEmail={setTestEmail}
        isTesting={isTesting}
      />
    </div>
  )
}

export default EmailConfig
