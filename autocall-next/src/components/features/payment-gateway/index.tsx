'use client'

import { GatewayId, gateways } from "@/data/payment"
import { cn } from "@/lib/utils"
import { useGetGatewaysQuery } from "@/redux/api/paymentGatewayApi"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import PayPalSettings from "./PayPalSettings"
import PaymentGatewayHeader from "./PaymentGatewayHeader"
import RazorpaySettings from "./RazorpaySettings"
import StripeSettings from "./StripeSettings"

const PaymentGatewayContainer = () => {
  const { t } = useTranslation()
  const [activeGateway, setActiveGateway] = useState<GatewayId>("stripe")
  const { data: gatewaysData, refetch, isFetching } = useGetGatewaysQuery()

  const handleRefresh = () => {
    refetch()
  }

  const getGatewayStatus = (id: GatewayId) => {
    const config = gatewaysData?.data?.find((g) => g.gateway_name === id)
    return config?.is_enabled || false
  }

  return (
    <div className="space-y-8">
      <PaymentGatewayHeader onRefresh={handleRefresh} isLoading={isFetching} />

      <div className="space-y-5">
        <div className="flex flex-col gap-1">
          <p className="text-md font-medium text-title/60">
            {t('select_payment_provider')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {gateways.map((gw) => {
            const isActive = activeGateway === gw.id
            const isEnabled = getGatewayStatus(gw.id)
            return (
              <div
                key={gw.id}
                onClick={() => setActiveGateway(gw.id)}
                className={cn(
                  'relative group flex flex-col items-start sm:p-6 p-4 rounded-lg border transition-all duration-300 cursor-pointer shadow-sm min-h-[160px] justify-between overflow-hidden',
                  isActive
                    ? 'border-primary bg-primary/[0.02] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.2)]'
                    : 'border-input-border-color bg-bg-card hover:border-primary/40 hover:bg-input-color/20',
                )}
              >
                {/* Background decorative active mesh */}
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
                )}

                {/* Status Badges */}
                <div className="absolute top-4 right-4 rtl:right-[unset] rtl:left-4  z-10">
                  {isEnabled ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wide uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      {t('active')}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wide uppercase bg-subtitle-color/10 text-subtitle-color border border-input-border-color">
                      <span className="w-1.5 h-1.5 rounded-full bg-subtitle-color/50" />
                      {t('inactive')}
                    </span>
                  )}
                </div>

                {/* Main Content */}
                <div className="w-full space-y-4">
                  <div className={cn(
                    'w-12 h-12 flex items-center justify-center rounded-radius transition-all duration-300 shadow-inner',
                    isActive ? 'bg-primary/10 text-primary scale-105' : 'bg-input-color text-subtitle-color group-hover:scale-105'
                  )}>
                    {gw.icon}
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-base font-black text-title flex items-center gap-2">
                      {gw.name}
                    </h3>
                    <p className="text-sm font-semibold text-subtitle-color">
                      {t(`gateway_subtitle_${gw.id}`, { defaultValue: gw.subtitle })}
                    </p>
                  </div>
                </div>

                {/* Active check indicator at bottom-right */}
                {isActive && (
                  <div className="absolute bottom-4 right-4 rtl:right-[unset] rtl:left-4 bg-primary text-white p-1 rounded-full shadow-md animate-in zoom-in-75 duration-200">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Settings Form Container */}
      <div className="relative bg-bg-card border border-input-border-color rounded-radius overflow-hidden transition-all duration-500">
        {/* Modern Accent line at the top */}

        <div className="sm:p-6 p-4">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            {activeGateway === 'stripe' && <StripeSettings />}
            {activeGateway === 'razorpay' && <RazorpaySettings />}
            {activeGateway === 'paypal' && <PayPalSettings />}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentGatewayContainer
