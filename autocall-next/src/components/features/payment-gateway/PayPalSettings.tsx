'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { usePermission } from "@/hooks/usePermission"
import { PERMISSIONS } from "@/constants/permissions"
import { cn } from "@/lib/utils"
import {
  useGetGatewayByNameQuery,
  useTestGatewayMutation,
  useToggleGatewayStatusMutation,
  useUpdateGatewayMutation
} from "@/redux/api/paymentGatewayApi"
import { useSyncPlansToGatewaysMutation } from "@/redux/api/planApi"
import { PaymentGatewayConfig } from "@/types/payment-gateway"
import { Eye, EyeOff, Save } from 'lucide-react';
import { Loader2 } from '@/components/reusable/Loader2';
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import GatewayCard from "./GatewayCard"

const PayPalSettings = () => {
  const { t } = useTranslation()
  const { hasPermission } = usePermission()
  const canUpdate = hasPermission(PERMISSIONS.UPDATE_PAYMENT_SETUP)

  const { data: gatewayData, isLoading } = useGetGatewayByNameQuery('paypal')
  const [updateGateway, { isLoading: isUpdating }] = useUpdateGatewayMutation()
  const [toggleStatus] = useToggleGatewayStatusMutation()
  const [testGateway, { isLoading: isTesting }] = useTestGatewayMutation()
  const [syncPlans] = useSyncPlansToGatewaysMutation()

  const config = (gatewayData?.data || {}) as Partial<PaymentGatewayConfig>

  const [settings, setSettings] = useState({
    paypal_client_id: "",
    paypal_client_secret: "",
    paypal_mode: "sandbox" as "sandbox" | "live",
  })

  const [showSk, setShowSk] = useState(false)

  useEffect(() => {
    if (config) {
      setSettings({
        paypal_client_id: config.paypal_client_id || "",
        paypal_client_secret: config.paypal_client_secret || "",
        paypal_mode: (config.paypal_mode as "sandbox" | "live") || "sandbox",
      })
    }
  }, [gatewayData])

  const handleToggle = async () => {
    try {
      await toggleStatus('paypal').unwrap()
      toast.success(t("gateway_status_updated"))
    } catch (error: any) {
      toast.error(error?.data?.message || t("gateway_toggle_error"))
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setSettings((prev) => ({ ...prev, [field]: value }))
  }

  const handleUpdate = async () => {
    try {
      await updateGateway({ name: 'paypal', data: settings }).unwrap()
      toast.success(t("gateway_paypal_updated"))

      // Sync plans to gateways after saving credentials
      try {
        await syncPlans().unwrap()
      } catch (syncErr) {
        console.error('Auto-sync failed:', syncErr)
      }
    } catch (error: any) {
      toast.error(error?.data?.message || t("gateway_paypal_update_error"))
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="flex flex-col items-center gap-3 text-muted-foreground italic">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm">{t("settings_loading")}</span>
        </div>
      </div>
    )
  }

  const hasChanges = JSON.stringify(settings) !== JSON.stringify({
    paypal_client_id: config.paypal_client_id || "",
    paypal_client_secret: config.paypal_client_secret || "",
    paypal_mode: (config.paypal_mode as "sandbox" | "live") || "sandbox",
  })

  return (
    <GatewayCard title={t('paypal')} enabled={config.is_enabled || false} onToggle={handleToggle}>
      <div className="flex flex-col gap-4 animate-in fade-in duration-300">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-2 flex flex-col">
            <Label className="text-md font-black text-title/80">
              {t('client_id')} <span className="text-destructive">*</span>
            </Label>
            <Input
              value={settings.paypal_client_id}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("paypal_client_id", e.target.value)}
              placeholder={t('enter_client_id')}
              className="h-10 text-xs rounded-radius bg-input-color border-input-border-color px-4 font-mono w-full transition-all focus:border-primary/50 focus:ring-1 focus:ring-primary/10 shadow-none!"
            />
          </div>

          <div className="space-y-2 flex flex-col">
            <Label className="text-md font-black text-title/80">
              {t('client_secret')} <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Input
                value={settings.paypal_client_secret}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("paypal_client_secret", e.target.value)}
                type={showSk ? "text" : "password"}
                placeholder={t('enter_client_secret')}
                className="h-10 text-xs rounded-radius bg-input-color border-input-border-color pr-10 pl-4 font-mono w-full transition-all focus:border-primary/50 focus:ring-1 focus:ring-primary/10 shadow-none!"
              />
              <Button
                type="button"
                onClick={() => setShowSk(!showSk)}
                className="absolute right-1 p-0! bg-[unset] top-1 text-subtitle-color hover:text-title hover:bg-transparent h-8 w-8 flex items-center justify-center rounded-md cursor-pointer transition-colors active:translate-y-0!"
                tabIndex={-1}
              >
                {showSk ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-3 flex flex-col">
          <Label className="text-md font-black text-title/80">
            {t('environment_mode')}
          </Label>

          <div className="flex flex-col sm:flex-row bg-input-color border border-input-border-color p-1 rounded-radius w-max shadow-inner select-none">
            <Button
              type="button"
              onClick={() => handleInputChange("paypal_mode", "sandbox")}
              className={cn(
                "h-8 px-4 text-xs font-bold rounded-radius transition-all duration-300 cursor-pointer flex items-center justify-center gap-1.5",
                settings.paypal_mode === "sandbox"
                  ? "bg-primary text-white shadow-sm"
                  : "bg-transparent text-subtitle-color hover:text-title hover:bg-black/5 dark:hover:bg-white/5"
              )}
            >
              <span className={cn("w-1.5 h-1.5 rounded-full", settings.paypal_mode === "sandbox" ? "bg-white" : "bg-subtitle-color/50")} />
              {t('sandbox_testing')}
            </Button>
            <Button
              type="button"
              onClick={() => handleInputChange("paypal_mode", "live")}
              className={cn(
                "h-8 px-4 text-xs font-bold rounded-radius transition-all duration-300 cursor-pointer flex items-center justify-center gap-1.5",
                settings.paypal_mode === "live"
                  ? "bg-primary text-white shadow-sm"
                  : "bg-transparent text-subtitle-color hover:text-title hover:bg-black/5 dark:hover:bg-white/5"
              )}
            >
              <span className={cn("w-1.5 h-1.5 rounded-full", settings.paypal_mode === "live" ? "bg-white" : "bg-subtitle-color/50")} />
              {t('production_live')}
            </Button>
          </div>

          <p className="text-xs font-semibold text-subtitle-color flex items-center gap-1.5">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 text-primary shrink-0">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4" />
              <path d="M12 8h.01" />
            </svg>
            {settings.paypal_mode === "sandbox"
              ? t('sandbox_desc')
              : t('live_desc')
            }
          </p>
        </div>

        {/* Informative Help Callout */}
        <div className="relative rounded-radius border border-primary/10 bg-primary/2 sm:p-5 p-4 mt-2 overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full translate-x-8 -translate-y-8 blur-xl pointer-events-none" />

          <div className="flex items-start gap-3">
            <div className="p-1.5 rounded-radius bg-primary/10 text-primary mt-0.5 animate-pulse-subtle">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <path d="M12 17h.01" />
              </svg>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-black text-title">
                {t('how_to_get_api_keys')}
              </p>
              <p className="text-xs font-medium text-subtitle-color leading-relaxed">
                {t('paypal_config_steps')}
                <a
                  href="https://developer.paypal.com/dashboard/applications"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline font-bold inline-flex items-center gap-0.5"
                >
                  {t('paypal_dashboard_link')}
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-2.5 h-2.5">
                    <path d="M15 3h6v6" />
                    <path d="M10 14 21 3" />
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  </svg>
                </a>
                {t('paypal_config_steps_continue')}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="flex items-center justify-end pt-6 border-t border-input-border-color mt-6 flex-wrap gap-4">
          <Button
            onClick={handleUpdate}
            disabled={isUpdating || !canUpdate || !hasChanges}
            className={cn(
              'h-12 p-padding! bg-primary text-white font-bold text-xs rounded-radius transition-all duration-300 shadow-sm gap-2 hover:bg-primary/95 flex items-center justify-center cursor-pointer select-none',
              (!canUpdate || !hasChanges || isUpdating) && 'opacity-50 cursor-not-allowed',
            )}
          >
            {isUpdating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            {t('common_save_changes')}
          </Button>
        </div>
      </div>
    </GatewayCard>
  )
}

export default PayPalSettings
