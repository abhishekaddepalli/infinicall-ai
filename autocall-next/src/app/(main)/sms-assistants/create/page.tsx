'use client'

import { SmsAgentFormPage } from "@/components/features/sms-agents/SmsAgentFormPage"

export default function SmsAgentCreateRoutePage() {
  return (
    <div className="space-y-6 w-full py-2">
      <SmsAgentFormPage isEdit={false} />
    </div>
  )
}
