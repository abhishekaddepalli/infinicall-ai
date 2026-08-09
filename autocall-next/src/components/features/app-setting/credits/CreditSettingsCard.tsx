'use client'

import TextInput from '@/components/shared/TextInput'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { cn } from '@/lib/utils'
import { useAppSelector } from '@/redux/hooks'
import { useField, useFormikContext } from 'formik'
import { Coins, Sparkles } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { CreditSettingsFormValues } from '@/types/settings'

const CreditSettingsCard = () => {
  const { t } = useTranslation()
  const [deductionField, , deductionHelpers] = useField<string>('credit_deduction_type')
  const direction = useAppSelector((state) => state.layout.direction)

  const { values } = useFormikContext<CreditSettingsFormValues>()

  const creditFields = [
    {
      name: 'credits_per_call',
      label: 'Credits Per Call',
      helper: 'Applied on each completed call when deduction type is Per Call.',
      color: 'text-violet-500',
      alwaysVisible: false,
    },
    {
      name: 'credits_per_minute',
      label: 'Credits Per Minute',
      helper: 'Applied per started minute when deduction type is Per Minute.',
      color: 'text-indigo-500',
      alwaysVisible: false,
    },
    {
      name: 'credits_per_sms',
      label: 'Credits Per SMS',
      helper: 'Credits deducted for each SMS message sent.',
      color: 'text-sky-500',
      alwaysVisible: true,
    },
    {
      name: 'free_credits_on_registration',
      label: 'Free Credits On Registration',
      helper: 'Initial credits added when a new user account is created.',
      color: 'text-emerald-500',
      alwaysVisible: true,
    },
  ] as const
  const visibleCreditFields = creditFields.filter((field) => {
    if (field.alwaysVisible) return true
    if (values.credit_deduction_type === 'per_call') return field.name === 'credits_per_call'
    return field.name === 'credits_per_minute'
  })

  return (
    <Card className="bg-bg-card border border-input-border-color rounded-lg overflow-hidden">
      <CardHeader className="sm:px-6 px-4 py-4 border-b border-input-border-color bg-bg-card">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-zinc-500" />
            <CardTitle className="text-xl font-semibold text-title">
              {t('credit_configuration')}
            </CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="sm:p-6 p-4 space-y-8">
        <div className="rounded-lg border border-input-border-color bg-subcard sm:p-5 p-4 space-y-3">
          <Label className="text-md font-bold text-subtitle-color">
            {t('credit_deduction_type')}
          </Label>
          <RadioGroup
            value={deductionField.value}
            onValueChange={(value) => deductionHelpers.setValue(value)}
            className="flex flex-wrap gap-4"
            dir={direction}
          >
            <div className={cn(
              'flex items-center space-x-2 rounded-lg border px-3 py-2',
              values.credit_deduction_type === 'per_call'
                ? 'border-primary bg-primary/5'
                : 'border-zinc-200 dark:border-white/10'
            )}>
              <RadioGroupItem value="per_call" id="credit_deduction_per_call" />
              <Label htmlFor="credit_deduction_per_call" className="font-medium cursor-pointer">{t('per_call')}</Label>
            </div>
            <div className={cn(
              'flex items-center space-x-2 rounded-lg border px-3 py-2',
              values.credit_deduction_type === 'per_minute'
                ? 'border-primary bg-primary/5'
                : 'border-zinc-200 dark:border-white/10'
            )}>
              <RadioGroupItem value="per_minute" id="credit_deduction_per_minute" />
              <Label htmlFor="credit_deduction_per_minute" className="font-medium cursor-pointer">{t('per_minute')}</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {visibleCreditFields.map((field) => (
            <div
              key={field.name}
              className="relative sm:p-5 p-4 rounded-lg border border-input-border-color bg-subcard hover:bg-zinc-50 dark:hover:bg-white/3 transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className={cn('flex items-center justify-center', field.color)}>
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <Label className="text-base font-bold text-title">
                    {field.label}
                  </Label>
                </div>
              </div>
              <p className="text-md text-subtitle-color mb-3">{field.helper}</p>
              <div className="relative">
                <TextInput
                  name={field.name}
                  type="number"
                  placeholder="0"
                  className="h-10 w-full px-3 pr-16 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-white/10 focus:ring-1 focus:ring-primary/20 transition-all rounded-lg text-sm"
                />
                <div className="absolute right-3 rtl:right-[unset] rtl:left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                  {t('credits')}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default CreditSettingsCard
