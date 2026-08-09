'use client'

import { SmsAgentFormPage } from "@/components/features/sms-agents/SmsAgentFormPage"
import { useParams } from "next/navigation"

export default function SmsAgentEditRoutePage() {
  const params = useParams()
  const id = params.id as string

  return (
    <div className="space-y-6 w-full py-2">
      <SmsAgentFormPage isEdit={true} id={id} />
    </div>
  )
}
