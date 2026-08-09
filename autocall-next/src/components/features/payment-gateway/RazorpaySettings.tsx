'use client'

import { Loader2 } from '@/components/reusable/Loader2'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PERMISSIONS } from "@/constants/permissions"
import { usePermission } from "@/hooks/usePermission"
import { cn } from "@/lib/utils"
import {
  useGetGatewayByNameQuery,
  useToggleGatewayStatusMutation,
  useUpdateGatewayMutation
} from "@/redux/api/paymentGatewayApi"
import { useSyncPlansToGatewaysMutation } from "@/redux/api/planApi"
import { PaymentGatewayConfig } from "@/types/payment-gateway"
import { Eye, EyeOff, Save } from 'lucide-react'
import { useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import GatewayCard from "./GatewayCard"

const RazorpaySettings = () => {
  const { t } = useTranslation()
  const { hasPermission } = usePermission()
  const canUpdate = hasPermission(PERMISSIONS.UPDATE_PAYMENT_SETUP)

  const { data: gatewayData, isLoading } = useGetGatewayByNameQuery('razorpay')
  const [updateGateway, { isLoading: isUpdating }] = useUpdateGatewayMutation()
  const [toggleStatus] = useToggleGatewayStatusMutation()
  const [syncPlans] = useSyncPlansToGatewaysMutation()

  const config = useMemo(() => (gatewayData?.data || {}) as Partial<PaymentGatewayConfig>, [gatewayData?.data])

  const [settings, setSettings] = useState({
    razorpay_key_id: "",
    razorpay_key_secret: "",
  })

  const [showSk, setShowSk] = useState(false)

  useEffect(() => {
    if (config) {
      const timer = setTimeout(() => {
        setSettings({
          razorpay_key_id: config.razorpay_key_id || "",
          razorpay_key_secret: config.razorpay_key_secret || "",
        })
      }, 0)
      return () => clearTimeout(timer)
    }
  }, [config])

  const handleToggle = async () => {
    try {
      await toggleStatus('razorpay').unwrap()
      toast.success(t("gateway_status_updated"))
    } catch (error) {
      const err = error as { data?: { message?: string } }
      toast.error(err?.data?.message || t("gateway_toggle_error"))
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setSettings((prev) => ({ ...prev, [field]: value }))
  }

  const handleUpdate = async () => {
    try {
      await updateGateway({ name: 'razorpay', data: settings }).unwrap()
      toast.success(t("gateway_razorpay_updated"))

      // Sync plans to gateways after saving credentials
      try {
        await syncPlans().unwrap()
      } catch (syncErr) {
        console.error('Auto-sync failed:', syncErr)
      }
    } catch (error) {
      const err = error as { data?: { message?: string } }
      toast.error(err?.data?.message || t("gateway_razorpay_update_error"))
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
    razorpay_key_id: config.razorpay_key_id || "",
    razorpay_key_secret: config.razorpay_key_secret || "",
  })

  return (
    <GatewayCard title={t('razorpay')} enabled={config.is_enabled || false} onToggle={handleToggle}>
      <div className="flex flex-col gap-4 animate-in fade-in duration-300">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-2 flex flex-col">
            <Label className="text-md font-black text-title/80">
              {t('key_id')} <span className="text-destructive">*</span>
            </Label>
            <Input
              value={settings.razorpay_key_id}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("razorpay_key_id", e.target.value)}
              placeholder={t('enter_key_id')}
              className="h-10 text-xs rounded-radius bg-input-color border-input-border-color px-4 font-mono w-full transition-all focus:border-primary/50 focus:ring-1 focus:ring-primary/10 shadow-none!"
            />
          </div>

          <div className="space-y-2 flex flex-col">
            <Label className="text-md font-black text-title/80">
              {t('key_secret')} <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Input
                value={settings.razorpay_key_secret}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("razorpay_key_secret", e.target.value)}
                type={showSk ? "text" : "password"}
                placeholder={t('enter_key_secret')}
                className="h-10 text-xs rounded-radius bg-input-color border-input-border-color pr-10 pl-4 font-mono w-full transition-all focus:border-primary/50 focus:ring-1 focus:ring-primary/10 shadow-none!"
              />
              <Button
                type="button"
                onClick={() => setShowSk(!showSk)}
                className="absolute right-1 p-0! top-1 text-subtitle-color hover:text-title bg-[unset] hover:bg-transparent h-8 w-8 flex items-center justify-center rounded-md cursor-pointer transition-colors active:translate-y-0!"
                tabIndex={-1}
              >
                {showSk ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Informative Help Callout */}
        <div className="relative rounded-radius border border-indigo-500/10 bg-indigo-500/[0.02] p-5 mt-2 overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full translate-x-8 -translate-y-8 blur-xl pointer-events-none" />

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
                {t('razorpay_config')}
              </p>
              <p className="text-xs font-medium text-subtitle-color leading-relaxed">
                {t('razorpay_config_steps')}
                <a
                  href="https://dashboard.razorpay.com/app/keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary dark:text-primary font-bold hover:underline inline-flex items-center gap-0.5"
                >
                  {t('razorpay_dashboard_link')}
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-2.5 h-2.5">
                    <path d="M15 3h6v6" />
                    <path d="M10 14 21 3" />
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  </svg>
                </a>
                {t('razorpay_config_steps_continue')}
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
              'h-12 p-padding! bg-primary text-white font-bold text-xs rounded-radius transition-all duration-300 gap-2 flex items-center justify-center cursor-pointer select-none',
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

export default RazorpaySettings
