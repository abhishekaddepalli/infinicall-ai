'use client'

import { PaymentGatewayHeaderProps } from "@/types/payment-gateway"
import { useTranslation } from "react-i18next"

const PaymentGatewayHeader = ({ isLoading, onRefresh }: PaymentGatewayHeaderProps) => {
  const { t } = useTranslation()

  return (
    <div className="flex items-center flex-wrap justify-between gap-6 mb-4 pb-2">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black text-title">
          {t("payment_setup")}
        </h1>
      </div>
    </div>
  )
}

export default PaymentGatewayHeader
