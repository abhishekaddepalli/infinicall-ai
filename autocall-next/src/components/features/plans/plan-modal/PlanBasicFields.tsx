'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { currencies, limitFields, switchFields } from '@/data/setting'
import { PlanBasicFieldsProps } from '@/types/plans'
import { useTranslation } from 'react-i18next'

const PlanBasicFields = ({ formData, onChange }: PlanBasicFieldsProps) => {
  const { t } = useTranslation()

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <div className="space-y-2 flex flex-col">
        <Label htmlFor="name" className="text-md font-medium text-foreground">
          {t('plan_name')} <span className="text-destructive">*</span>
        </Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => onChange('name', e.target.value)}
          placeholder={t('enter_plan_name')}
          required
          className="h-10 rounded-lg border-input-border-color focus-visible:ring-primary/20 bg-input-color"
        />
      </div>

      <div className="space-y-2 flex flex-col">
        <Label htmlFor="slug" className="text-md font-medium text-foreground">
          {t('slug')} <span className="text-destructive">*</span>
        </Label>
        <Input
          id="slug"
          value={formData.slug}
          onChange={(e) => onChange('slug', e.target.value)}
          placeholder={t('enter_plan_slug')}
          required
          className="h-10 rounded-lg border-input-border-color focus-visible:ring-primary/20 bg-input-color"
        />
      </div>

      <div className="sm:col-span-2 space-y-2 flex flex-col">
        <Label htmlFor="description" className="text-md font-medium text-foreground">
          {t('description')}
        </Label>
        <Input
          id="description"
          value={formData.description || ''}
          onChange={(e) => onChange('description', e.target.value)}
          placeholder={t('enter_plan_description')}
          className="h-10 rounded-lg border-input-border-color focus-visible:ring-primary/20 bg-input-color"
        />
      </div>

      <div className="space-y-2 flex flex-col">
        <Label htmlFor="amount" className="text-md font-medium text-foreground">
          {t('price')} <span className="text-destructive">*</span>
        </Label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          value={formData.amount ?? ''}
          onChange={(e) => onChange('amount', e.target.value === '' ? '' : parseFloat(e.target.value))}
          onBlur={() => {
            if ((formData.amount as any) === '' || formData.amount === null || formData.amount === undefined) {
              onChange('amount', 0)
            }
          }}
          disabled={formData.billing_cycle === 'free_trial'}
          placeholder="0.00"
          required
          className="h-10 rounded-lg border-input-border-color focus-visible:ring-primary/20 "
        />
      </div>

      <div className="space-y-2 flex flex-col">
        <Label className="text-md font-medium text-foreground">{t('currency')}</Label>
        <Select value={formData.currency || 'USD'} onValueChange={(val: any) => onChange('currency', val)}>
          <SelectTrigger className="h-10 rounded-lg border-input-border-color shadow-none">
            <SelectValue placeholder={t('select_currency')} />
          </SelectTrigger>
          <SelectContent className="bg-white! dark:bg-bg-card!">
            {currencies(t).map((currency) => (
              <SelectItem key={currency.value} value={currency.value}>
                {currency.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2 flex flex-col">
        <Label className="text-md font-medium text-foreground">{t('plan_type', 'Plan Type')}</Label>
        <Select
          value={formData.plan_type || 'subscription'}
          onValueChange={(val: any) => {
            onChange('plan_type', val)
            setTimeout(() => {
              if (val === 'top_up') {
                onChange('billing_cycle', 'one_time')
              } else {
                onChange('billing_cycle', 'monthly')
              }
            }, 10)
          }}
        >
          <SelectTrigger className="h-10 rounded-lg border-input-border-color shadow-none">
            <SelectValue placeholder={t('select_plan_type', 'Select Plan Type')} />
          </SelectTrigger>
          <SelectContent className='bg-white! dark:bg-bg-card!'>
            <SelectItem value="subscription">{t('subscription', 'Subscription')}</SelectItem>
            <SelectItem value="top_up">{t('top_up', 'Top Up')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2 flex flex-col">
        <Label className="text-md font-medium text-foreground">{t('billing_cycle')}</Label>
        <Select
          value={formData.billing_cycle}
          onValueChange={(val: any) => {
            onChange('billing_cycle', val)
            if (val === 'free_trial') {
              setTimeout(() => {
                onChange('amount', 0)
              }, 10)
            }
          }}
        >
          <SelectTrigger className="h-10 rounded-lg border-input-border-color shadow-none">
            <SelectValue placeholder={t('select_cycle')} />
          </SelectTrigger>
          <SelectContent className='bg-white! dark:bg-bg-card!'>
            {formData.plan_type === 'top_up' ? (
              <SelectItem value="one_time">{t('one_time', 'One Time')}</SelectItem>
            ) : (
              <>
                <SelectItem value="monthly">{t('monthly')}</SelectItem>
                <SelectItem value="yearly">{t('yearly')}</SelectItem>
              </>
            )}
          </SelectContent>
        </Select>
      </div>

      {formData.plan_type === 'top_up' && (
        <div className="space-y-2 flex flex-col">
          <Label htmlFor="validity_days" className="text-md font-medium text-foreground">
            {t('validity_days', 'Validity Days')} <span className="text-destructive">*</span>
          </Label>
          <Input
            id="validity_days"
            type="number"
            value={formData.validity_days ?? ''}
            onChange={(e) => onChange('validity_days', e.target.value === '' ? null : parseInt(e.target.value))}
            placeholder={t('enter_validity_days', 'Enter validity days')}
            required
            className="h-10 rounded-lg border-input-border-color focus-visible:ring-primary/20 bg-input-color"
          />
        </div>
      )}

      <div className="sm:col-span-2 border-t border-zinc-100 dark:border-white/5 pt-4 my-2">
        <h4 className="text-base font-bold text-title">
          {t('plan_usage_limits')}
        </h4>
        <p className="text-md text-subtitle-color font-medium mt-0.5">
          {t('plan_usage_limits_desc')}
        </p>
      </div>

      <div className="sm:col-span-2 space-y-2 flex flex-col">
        <Label htmlFor="total_credits" className="text-md flex-wrap font-medium text-foreground">
          {t('total_credits')} <span className="text-xs text-muted-foreground font-normal ml-1">({t('credits_included_in_plan')})</span>
        </Label>
        <Input
          id="total_credits"
          type="number"
          value={formData.total_credits ?? 0}
          onChange={(e) => onChange('total_credits', e.target.value === '' ? 0 : Number(e.target.value))}
          placeholder="0"
          min={0}
          className="h-10 rounded-lg border-input-border-color focus-visible:ring-primary/20 bg-input-color"
        />
        <p className="text-xs text-muted-foreground">{t('total_credits_hint')}</p>
      </div>

      {formData.plan_type !== 'top_up' && limitFields(t).map(({ key, label }) => (
        <div key={key} className="space-y-2 flex flex-col">
          <Label htmlFor={key} className="text-md font-medium text-foreground">
            {label}
          </Label>

          <Input
            id={key}
            type="number"
            value={(formData as any)[key] ?? 0}
            onChange={(e) =>
              onChange(
                key,
                e.target.value === '' ? '' : parseInt(e.target.value)
              )
            }
            placeholder="0"
            className="h-10 rounded-lg border-input-border-color focus-visible:ring-primary/20 bg-input-color"
          />
        </div>
      ))}

      {switchFields(t).map((item) => (
        <div
          key={item.key}
          className="flex items-center justify-between p-4 rounded-lg bg-card-color border border-input-border-color"
        >
          <div className="space-y-0.5">
            <Label className="font-bold">{item.title}</Label>
            <p className="text-md text-subtitle-color line-clamp-1">
              {item.description}
            </p>
          </div>

          <Switch
            checked={(formData as any)[item.key]}
            onCheckedChange={(val: boolean) => onChange(item.key, val)}
          />
        </div>
      ))}
    </div>
  )
}

export default PlanBasicFields
