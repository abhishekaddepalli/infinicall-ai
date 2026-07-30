'use client'

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { usePlaceCallMutation } from "@/redux/api/callApi"
import { ApiError } from "@/types/api"
import { TestAgentFlowModalProps } from "@/types/knowledgeBase"
import { Phone, PhoneCall } from 'lucide-react';
import { Loader2 } from '@/components/reusable/Loader2';
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"

export function TestAgentFlowModal({ agent, isOpen, onClose }: TestAgentFlowModalProps) {
  const { t } = useTranslation()
  const [fromNumber, setFromNumber] = useState("")
  const [toNumber, setToNumber] = useState("")

  const [placeCall, { isLoading }] = usePlaceCallMutation()

  const handleTestFlowSubmit = async () => {
    if (!agent) return

    const flowId = typeof agent.flow_id === 'object' && agent.flow_id
      ? (agent.flow_id as any)._id || (agent.flow_id as any).id
      : agent.flow_id

    if (!flowId) {
      toast.error(t("agent_has_no_flow"))
      return
    }

    if (!fromNumber) {
      toast.error(t("please_enter_from_number"))
      return
    }

    if (!toNumber) {
      toast.error(t("please_enter_to_number"))
      return
    }

    try {
      const res = await placeCall({
        flowId: flowId,
        fromNumber: fromNumber,
        phoneNumber: toNumber,
        agentId: agent._id || agent.id
      }).unwrap()

      if (res.success) {
        toast.success(
          res.message || t("call_initiated_successfully")
        )
        handleClose()
      } else {
        toast.error(res.message || t("failed_to_initiate_call"))
      }
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t("failed_to_initiate_call"))
    }
  }

  const handleClose = () => {
    setFromNumber("")
    setToNumber("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[480px]! max-w-[calc(100%-2rem)] gap-0 p-0 bg-bg-card  border-gray-200 dark:border-white/10 shadow-2xl rounded-[2.5rem] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <DialogHeader className="sm:p-6 p-4 pb-0! mb-0 relative">
          <DialogTitle className="flex items-center gap-4 text-xl font-black tracking-tight text-gray-900 dark:text-white">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary shadow-inner">
              <PhoneCall className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="leading-tight">{t('test_flow')}</span>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="sm:p-6 p-4 pt-4 space-y-6">
          {/* From Number Input */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-muted-foreground ml-1">
              {t('from_number')} *
            </Label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/40">
                <Phone className="w-4 h-4" />
              </div>
              <Input
                placeholder="+1234567890"
                value={fromNumber}
                onChange={(e) => setFromNumber(e.target.value)}
                disabled={isLoading}
                className="rounded-radius bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 pl-12 font-bold text-sm focus:ring-primary/20 shadow-none"
              />
            </div>
          </div>

          {/* To Number Input */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-muted-foreground ml-1">
              {t('to_number')} *
            </Label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/40">
                <Phone className="w-4 h-4" />
              </div>
              <Input
                placeholder="+1987654321"
                value={toNumber}
                onChange={(e) => setToNumber(e.target.value)}
                disabled={isLoading}
                className="rounded-radius bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 pl-12 font-bold text-sm focus:ring-primary/20 shadow-none"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="sm:p-6 p-4 pt-0 flex gap-4">
          <Button
            variant="ghost"
            onClick={handleClose}
            disabled={isLoading}
            className="flex-1 p-padding! mr-0! rounded-radius border border-input-border-color bg-subcard dark:bg-subcard text-black dark:text-white text-md font-medium transition-all"
          >
            {t('cancel')}
          </Button>
          <Button
            onClick={handleTestFlowSubmit}
            disabled={isLoading || !fromNumber || !toNumber}
            className="flex-1 rounded-radius p-padding  bg-primary text-white font-medium  text-md transition-all gap-2"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <PhoneCall className="w-4 h-4" />}
            {isLoading ? t('testing') : t('test_flow')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
