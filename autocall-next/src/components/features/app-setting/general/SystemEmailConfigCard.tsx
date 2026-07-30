'use client'


import { Loader2 } from '@/components/reusable/Loader2'
import SelectField from '@/components/shared/SelectField'
import TextInput from '@/components/shared/TextInput'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { emailInstruction, emailInstructionSSL } from '@/data/setting'
import { useSendTestMailMutation } from '@/redux/api/adminSettingApi'
import { ApiError } from '@/types/api'
import { Info, Mail, Send } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

const SystemEmailConfigCard = () => {
  const { t } = useTranslation()
  const [testEmail, setTestEmail] = useState('')
  const [sendTestMail, { isLoading: isTesting }] = useSendTestMailMutation()

  const handleSendTestMail = async () => {
    if (!testEmail) {
      toast.error(t('please_enter_email'))
      return
    }

    try {
      const response = await sendTestMail({ to: testEmail }).unwrap()
      toast.success(response.message || t('test_email_sent_successfully'))
      setTestEmail('')
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t('failed_to_send_test_email'))
    }
  }

  return (
    <Card className="bg-bg-card border border-input-border-color rounded-radius overflow-hidden">
      <CardHeader className="sm:px-6 px-4 py-4 border-b border-input-border-color bg-bg-card">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-zinc-500" />
            <CardTitle className="text-xl font-bold text-title">{t('system_email')}</CardTitle>
          </div>
        </div>
      </CardHeader>

      <CardContent className="sm:p-6 p-4 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <TextInput name="smtp_host" label={t('smtp_host')} placeholder="smtp.mailtrap.io" />
          <TextInput name="smtp_port" label={t('smtp_port')} placeholder="587" type="number" />
          <SelectField
            name="mail_encryption"
            label={t('mail_encryption')}
            options={[
              { label: 'TLS', value: 'tls' },
              { label: 'SSL', value: 'ssl' },
            ]}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TextInput name="smtp_user" label={t('smtp_user')} placeholder={t('your_smtp_username')} />
          <TextInput name="smtp_pass" label={t('smtp_password')} placeholder="••••••••" type="password" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-8 border-b border-input-border-color">
          <TextInput name="mail_from_name" label={t('sender_name')} placeholder={t('auto_call_support')} />
          <TextInput name="mail_from_email" label={t('sender_email')} placeholder="noreply@autocall.com" type="email" />
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 text-primary font-medium  text-base">
            <Info className="w-4 h-4 text-primary" />
            {t('instruction')}
          </div>
          <div className="sm:p-6 p-4 rounded-radius bg-card-color border border-input-border-color space-y-6">
            <p className="text-sm font-medium text-destructive leading-relaxed">
              {t('when_setting_up_your_email_system')}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <h4 className="text-base font-medium text-title-color  dark:text-white">
                  {t('if_you_are_not_using_ssl')}
                </h4>
                <ul className="space-y-2">
                  {emailInstruction.map((item, i) => (
                    <li key={i} className="flex gap-3 text-sm font-medium text-subtitle-color">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/40 mt-1.5 shrink-0" />
                      {t(`email_instruction_${i + 1}`, { defaultValue: item })}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="text-base font-medium text-title-color dark:text-white">{t('if_you_are_using_ssl')}</h4>
                <ul className="space-y-2">
                  {emailInstructionSSL.map((item, i) => (
                    <li key={i} className="flex gap-3 text-sm font-medium text-subtitle-color">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/40 mt-1.5 shrink-0" />
                      {t(`email_instruction_ssl_${i + 1}`, { defaultValue: item })}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="sm:pt-6 pt-4 border-t border-input-border-color">
          <div className="flex items-center text-sm gap-2 mb-4 text-title font-semibold">
            <Send className="w-4 h-4" />
            {t('test_mail')}
          </div>

          <div className="flex flex-col sm:flex-row items-end gap-4 sm:p-6 p-4 rounded-radius border border-input-border-color bg-card-color">
            <div className="flex-1 space-y-2 w-full flex flex-col">
              <Label htmlFor="test_mail" className="text-md font-medium text-title">
                {t('to_mail')}
              </Label>
              <Input
                id="test_mail"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder={t('enter_email')}
                className="h-10 border-input-border-color focus:ring-primary/20 transition-all rounded-radius"
              />
            </div>
            <Button
              type="button"
              variant="default"
              onClick={handleSendTestMail}
              disabled={isTesting}
              className="h-10 sm:h-12 p-padding! dark:bg-white/5  dark:border-white/10 font-semibold rounded-radius transition-all bg-primary text-white hover:bg-primary/90"
            >
              {isTesting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              {t('send_test_mail')}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default SystemEmailConfigCard
