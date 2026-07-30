'use client'

import { Card, CardContent } from "@/components/ui/card"
import { WABA_SETUP_STEPS } from "@/data/wabaSetupData"
import { WabaSetupGuideProps } from "@/types/waba"
import { AlertCircle, CheckCircle, ExternalLink, HelpCircle, Key, Laptop, Phone, Share2 } from "lucide-react"
import Link from "next/link"
import { useTranslation } from "react-i18next"

const iconMap = {
  Phone: <Phone size={18} />,
  Laptop: <Laptop size={18} />,
  Key: <Key size={18} />,
  Share2: <Share2 size={18} />,
  CheckCircle: <CheckCircle size={18} />,
}

export default function WabaSetupGuide({ isConnected }: WabaSetupGuideProps) {
  const { t } = useTranslation()

  return (
    <Card className="rounded-lg bg-bg-card border-input-border-color shadow-sm h-full flex flex-col">
      <div className="sm:px-6 px-4 py-5 border-b border-input-border-color">
        <h3 className="text-xl font-bold text-title flex items-center gap-2">
          {t("guide_main_title", "Getting Started With WhatsApp API")}
        </h3>
        <p className="text-md text-subtitle-color mt-1">
          {t("guide_main_subtitle", "Complete the required steps to activate your WhatsApp Business API")}
        </p>
      </div>

      <CardContent className="sm:p-6 p-4 flex-1 space-y-6">
        {/* Timeline Steps */}
        <div className="space-y-4">
          {WABA_SETUP_STEPS.map((step, index) => (
            <div key={step.id} className="flex gap-4 group relative">
              {/* Dashed connector line */}
              {index !== WABA_SETUP_STEPS.length - 1 && (
                <div className="absolute left-5 rtl:left-0 rtl:right-5 top-10 bottom-0 w-0 border-l border-dashed border-input-border-color transition-colors" />
              )}

              {/* Step Circle Icon */}
              <div
                className={`shrink-0 w-10 h-10 rounded-lg ${step.bgColor} ${step.color} flex items-center justify-center z-10  border border-input-border-color`}
              >
                {iconMap[step.iconName]}
              </div>

              {/* Step Content */}
              <div className="space-y-1 pb-5 flex-1 min-w-0 pt-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-title border border-input-border-color p-1.5 rounded-lg">
                    0{index + 1}
                  </span>
                  <h4 className="text-base font-bold text-title break-all whitespace-normal line-clamp-2">
                    {t(step.title, step.id === "step1" ? "Add Business Phone Number" : step.id === "step2" ? "Set Up Meta App" : step.id === "step3" ? "Generate Access Token" : step.id === "step4" ? t('set_up_webhook') : t('connection_check'))}
                  </h4>
                </div>
                <p className="text-md text-subtitle-color leading-relaxed font-medium break-all whitespace-normal line-clamp-5">
                  {t(
                    step.description,
                    step.id === "step1"
                      ? "Use a valid phone number that isn't linked to any existing WhatsApp account. This number will be registered under your Meta Business Manager for messaging."
                      : step.id === "step2"
                      ? "Create a new app on Meta for Developers, add the WhatsApp product, link your Business Manager account, and switch your app to LIVE mode."
                      : step.id === "step3"
                      ? "Generate a permanent access token by setting up a System User with the necessary WhatsApp permissions."
                      : step.id === "step4"
                      ? "Add your Webhook URL, set a verification token, and subscribe to message events to receive real-time updates."
                      : "After entering all required credentials, save your configuration and send a test message to confirm validation and check connection status."
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Support & Warnings */}
        <div className="pt-2 space-y-4">
          <div className="bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-800/30 rounded-lg p-4 flex items-start gap-3">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500">
              <HelpCircle size={16} />
            </div>
            <div className="space-y-0.5 flex-1 min-w-0">
              <h5 className="text-md font-black text-emerald-800 dark:text-emerald-400">
                {t("guide_help_title", "Help Guide!")}
              </h5>
              <p className="text-sm text-emerald-700/80 dark:text-emerald-500 leading-snug">
                {t("guide_help_desc", "For more details, ")}{" "}
                <Link
                  href="https://developers.facebook.com/docs/whatsapp/cloud-api"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-700 dark:text-blue-300 underline decoration-blue-300 dark:decoration-blue-700 underline-offset-2 hover:text-blue-800 transition-colors inline-flex items-center gap-0.5 font-bold"
                >
                  {t("guide_help_link", "WhatsApp Cloud API Documentation")}
                  <ExternalLink size={10} className="inline shrink-0" />
                </Link>
              </p>
            </div>
          </div>

          {!isConnected && (
            <div className="bg-amber-50/50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 rounded-lg p-4 space-y-3 animate-in fade-in duration-300">
              <div className="flex items-center gap-2 text-amber-700 dark:text-amber-500">
                <AlertCircle size={18} />
                <h5 className="text-md font-bold">{t("connection_status_notice", "Connection Status Notice")}</h5>
              </div>
              <p className="text-sm text-amber-600 dark:text-amber-500/80 leading-relaxed font-medium">
                {t(
                  "connection_notice_desc",
                  "Note: Webhook and templates sync require a fully configured and authenticated WABA connection. Please configure credentials and complete verification above."
                )}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
