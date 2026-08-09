'use client'

import { Button } from '@/components/ui/button'
import { currencySymbols, gateways } from '@/data/plan'
import { cn } from '@/lib/utils'
import { Gateway, GatewaySelectorProps } from '@/types/plans'
import { CheckCircle2 } from 'lucide-react';
import { Loader2 } from '@/components/reusable/Loader2';
import Image from 'next/image'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

const GatewaySelector = ({
  plan,
  billingCycle,
  selectedGateway,
  onSelectGateway,
  onProceed,
  isInitializing,
}: GatewaySelectorProps) => {
  const { t } = useTranslation()
  const isOneTime = plan?.plan_type === 'prepaid' || plan?.plan_type === 'lifetime' || billingCycle === 'one-time'
  const price = plan?.amount || 0

  const symbol = currencySymbols[plan?.currency || 'USD'] || (plan?.currency || '$')

  const availableGateways = gateways.filter((g) => {
    if (g.id === 'manual') return true;
    if (plan?.currency === 'INR') return g.id === 'stripe' || g.id === 'razorpay'
    if (plan?.currency === 'USD') return g.id === 'stripe' || g.id === 'paypal'
    return true
  })

  const activeGateway = availableGateways.find((g) => g.id === selectedGateway) || availableGateways[0]

  useEffect(() => {
    if (selectedGateway !== activeGateway.id) {
      onSelectGateway(activeGateway.id as Gateway)
    }
  }, [selectedGateway, activeGateway.id, onSelectGateway])

  return (
    <div>
      <div className="sm:px-6 px-4 py-4 border-b border-input-border-color flex items-center gap-3 bg-bg-card">

        <div>
          <h2 className="text-xl font-medium text-title font-medium">{t('select_payment_method')}</h2>
          <p className="text-md text-subtitle-color">
            {plan?.name} – {symbol}{Number(price).toFixed(2)}{isOneTime ? '' : `/${billingCycle === 'monthly' ? 'mo' : 'yr'}`}
          </p>
        </div>
      </div>

      <div className="sm:p-6 p-4 bg-bg-card space-y-4">
        <div className="p-4 flex-wrap rounded-lg bg-primary/5 dark:bg-modal-bg-color border border-input-border-color flex items-center justify-between">
          <div>
            <p className="text-md text-subtitle-color font-medium">{t('total_amount')}</p>
            <p className="font-medium text-title">
              {plan?.name} — {isOneTime ? 'One-time' : billingCycle}
            </p>
          </div>
          <div className="text-right rtl:text-left">
            <p className="text-2xl font-black text-primary">{symbol}{Number(price).toFixed(2)}</p>
            {!isOneTime && <p className="text-sm text-subtitle-color">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</p>}
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-md font-bold  text-subtitle-color">{t('choose_payment_method')}</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {availableGateways.map((gw) => (
              <Button
                key={gw.id}
                onClick={() => onSelectGateway(gw.id)}
                className={cn(
                  'relative p-4 rounded-radius border-2 flex flex-col items-center justify-center gap-2 transition-all duration-200',
                  selectedGateway === gw.id ? gw.activeClass : `border-input-border-color bg-card-color dark:bg-modal-bg-color ${gw.hoverClass}`,
                )}
              >
                {selectedGateway === gw.id && (
                  <div
                    className={cn(
                      'absolute top-3.5 right-2 w-4 h-4 rounded-full flex items-center justify-center',
                      gw.id === 'paypal' ? 'bg-blue-500' : gw.id === 'razorpay' ? 'bg-social-blue' : 'bg-primary',
                    )}
                  >
                    <CheckCircle2 className="w-3 h-3 text-white" />
                  </div>
                )}
                <Image src={gw.logo} alt={gw.label} width={100} height={100} unoptimized className="h-5 object-contain" />
              </Button>
            ))}
          </div>
        </div>

        <div className={cn('p-3 rounded-lg border text-sm', activeGateway.infoClass)}>{activeGateway.infoText}</div>

        <Button
          onClick={onProceed}
          disabled={isInitializing}
          className="w-full h-12 rounded-radius p-padding! text-base font-medium bg-primary! text-white dark:text-white! cursor-pointer transition-transform active:scale-95"
        >
          {isInitializing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {t('processing')}
            </>
          ) : (
            `Pay with ${selectedGateway.charAt(0).toUpperCase() + selectedGateway.slice(1)}`
          )}
        </Button>

        <p className="text-center text-md text-subtitle-color">
          {t('secure_encrypted_payments')}. {t('multi_currency_supported')}.
        </p>
      </div>
    </div>
  )
}

export default GatewaySelector
