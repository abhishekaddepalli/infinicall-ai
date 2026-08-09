'use client'

import { Switch } from "@/components/ui/switch"
import { usePermission } from "@/hooks/usePermission"
import { PERMISSIONS } from "@/constants/permissions"
import { GatewayCardProps } from "@/types/payment-gateway"
import { useTranslation } from "react-i18next"

const GatewayCard = ({ title, enabled, onToggle, children }: GatewayCardProps) => {
  const { t } = useTranslation()
  const { hasPermission } = usePermission()
  const canUpdate = hasPermission(PERMISSIONS.UPDATE_PAYMENT_SETUP)

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between flex-wrap gap-4 pb-6 border-b border-input-border-color">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-bg-card border border-input-border-color">
            <span className="text-xl font-bold text-foreground">
              {title === 'Stripe' && <svg viewBox="0 0 32 32" className="w-8 h-8 rounded-lg" fill="none"><rect width="32" height="32" rx="6" fill="#635BFF" /><path d="M12.9 15.6c0-1.1 1.1-1.9 2.9-1.9 2.4 0 4.5.6 6.5 1.7v-5.2c-2.1-.9-4.2-1.3-6.5-1.3-5.3 0-8.8 2.7-8.8 7.6 0 7.6 10.5 6.8 10.5 9.6 0 1.1-1.2 2-3.2 2-2.4 0-5-1-7.3-2.3v5.4c2.3 1.1 5 1.5 7.3 1.5 5.4 0 9.1-2.6 9.1-7.6 0-7.9-10.5-6.9-10.5-9.5z" fill="#fff" transform="translate(3.1, -1.5) scale(0.85)" /></svg>}
              {title === 'Razorpay' && <svg viewBox="0 0 32 32" className="w-8 h-8 rounded-lg" fill="none"><rect width="32" height="32" rx="6" fill="#ffffff" /><g transform="translate(6, 4.6) scale(0.07)"><polygon fill="#3395FF" points="122.6338 105.6902 106.8778 163.6732 197.0338 105.3642 138.0748 325.3482 197.9478 325.4032 285.0458 0.4822"></polygon><path d="M25.5947,232.9246 L0.8077,325.4026 L123.5337,325.4026 C123.5337,325.4026 173.7317,137.3196 173.7457,137.2656 C173.6987,137.2956 25.5947,232.9246 25.5947,232.9246" fill="#072654"></path></g></svg>}
              {title === 'PayPal' && <svg viewBox="0 0 32 32" className="w-8 h-8 rounded-lg" fill="none"><rect width="32" height="32" rx="6" fill="#ffffff" /><g transform="translate(-12.3, -6.1) scale(1.8)"><path d="M11 7h4c2 0 3.5.5 3.5 2.5S17 12 15 12h-2l-.5 2.5H10L11 7z" fill="#003087" /><path d="M13 9h4c2 0 3.5.5 3.5 2.5S19 14 17 14h-2l-.5 2.5H12L13 9z" fill="#009cde" /></g></svg>}
            </span>
          </div>
          <div className="space-y-1">
            <h2 className="text-md font-black text-title leading-tight">
              {title} {t("configuration")}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-3 ml-auto rtl:ml-0 rtl:mr-auto rounded-radius">
          <Switch
            checked={enabled}
            onCheckedChange={onToggle}
            disabled={!canUpdate}
            className="data-[state=checked]:bg-emerald-500 shadow-sm"
          />
        </div>
      </div>

      <div className="flex-1 pt-6 transition-all duration-300">
        {children}
      </div>
    </div>
  )
}

export default GatewayCard
