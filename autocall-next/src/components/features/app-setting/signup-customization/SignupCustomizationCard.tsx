'use client'

import TextInput from '@/components/shared/TextInput'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useFormikContext } from 'formik'
import { useTranslation } from 'react-i18next'
import SelectField from '@/components/shared/SelectField'
import { useGetPagesQuery } from '@/redux/api/pageApi'

const SignupCustomizationCard = () => {
  const { t } = useTranslation()
  const { values, setFieldValue } = useFormikContext<{
    signup_agreement_enabled: boolean
    signup_agreement_prefix_text: string
    signup_agreement_link_text: string
    signup_agreement_target_page: string
  }>()

  const { data: pagesData } = useGetPagesQuery({ page: 1, limit: 100 })
  const pages = pagesData?.pages || []

  const pageOptions = [
    { label: t('none'), value: '' },
    ...pages.map((p: any) => ({ label: `${p.title} (${p.slug})`, value: p.id || p._id || '' }))
  ]

  return (
    <Card className="bg-bg-card border border-input-border-color rounded-lg overflow-hidden">
      <CardHeader className="sm:px-6 px-4 py-4 border-b border-input-border-color">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <CardTitle className="text-xl font-semibold text-title">
              {t('signup_customization_card_title')}
            </CardTitle>
          </div>
          <p className="text-md text-subtitle-color">{t('signup_customization_card_desc')}</p>
        </div>
      </CardHeader>
      <CardContent className="sm:p-6 p-4 space-y-6">
        <div className="flex items-center justify-between border-b border-input-border-color pb-6">
          <div className="space-y-0.5">
            <Label className="text-base font-bold text-title">{t('enable_signup_agreement_line')}</Label>
            <p className="text-md text-subtitle-color">{t('enable_signup_agreement_line_desc')}</p>
          </div>
          <Switch
            checked={values.signup_agreement_enabled}
            onCheckedChange={(checked) => setFieldValue('signup_agreement_enabled', checked)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-title">{t('prefix_text')}</Label>
            <TextInput
              name="signup_agreement_prefix_text"
              placeholder={t('eg_i_agree_to_the')}
              disabled={!values.signup_agreement_enabled}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-title">{t('link_text')}</Label>
            <TextInput
              name="signup_agreement_link_text"
              placeholder={t('eg_privacy_policy')}
              disabled={!values.signup_agreement_enabled}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-semibold text-title">{t('target_dynamic_page')}</Label>
          <SelectField
            name="signup_agreement_target_page"
            options={pageOptions}
            placeholder={t('select_target_page')}
            disabled={!values.signup_agreement_enabled}
          />
        </div>
      </CardContent>
    </Card>
  )
}

export default SignupCustomizationCard
