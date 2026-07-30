'use client'


import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PlanModulesAndLimitsProps } from '@/types/plans'
import { useTranslation } from 'react-i18next'

const PlanModulesAndLimits = ({ formData, onChange }: PlanModulesAndLimitsProps) => {
  const { t } = useTranslation()

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="space-y-4 flex flex-col">
        <Label className="text-md font-medium text-light-text-color">{t('plan_limits')}</Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2 flex flex-col">
            <Label htmlFor="total_credits" className="text-md font-medium text-foreground">
              {t('total_credits')}
            </Label>
            <Input
              id="total_credits"
              type="number"
              value={formData.total_credits ?? ''}
              onChange={(e: any) => onChange('total_credits', e.target.value === '' ? '' : Number(e.target.value))}
              onBlur={() => {
                if ((formData.total_credits as any) === '' || formData.total_credits === null) {
                  onChange('total_credits', 0)
                }
              }}
              placeholder="0"
              className="h-10 rounded-radius border-input-border-color focus-visible:ring-primary/20 "
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlanModulesAndLimits
