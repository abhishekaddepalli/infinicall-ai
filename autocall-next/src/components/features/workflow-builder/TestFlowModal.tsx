'use client'

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useGetAgentsQuery } from "@/redux/api/agentApi"
import { usePlaceCallMutation } from "@/redux/api/callApi"
import { TestFlowModalProps } from "@/types/flow"
import { Info, Phone, PhoneCall } from 'lucide-react';
import { Loader2 } from '@/components/reusable/Loader2';
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { toast } from 'sonner'

const TestFlowModal = ({ flow, isOpen, onClose }: TestFlowModalProps) => {
  const { t } = useTranslation()
  const [fromNumber, setFromNumber] = useState('')
  const [toNumber, setToNumber] = useState('')
  const [selectedAgentId, setSelectedAgentId] = useState<string>('')
  const [placeCall, { isLoading }] = usePlaceCallMutation()

  const { data: agentsData, isLoading: isLoadingAgents } = useGetAgentsQuery({ type: 'flow', status: 'active' })
  const agents = agentsData?.data || []

  const handleStartTestCall = async () => {
    if (!flow) return
    if (!fromNumber || !toNumber) {
      toast.error(t('please_enter_phone_numbers'))
      return
    }

    try {
      const res = await placeCall({
        flowId: flow._id || flow.id,
        fromNumber,
        phoneNumber: toNumber,
        agentId: selectedAgentId || undefined
      }).unwrap()

      if (res.success) {
        toast.success(t('call_initiated_successfully'))
        onClose()
      } else {
        toast.error(res.message || t('failed_to_initiate_call'))
      }
    } catch (err: any) {
      toast.error(err?.data?.message || t('failed_to_initiate_call'))
    }
  }

  const handleClose = () => {
    setFromNumber('')
    setToNumber('')
    setSelectedAgentId('')
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent onOpenAutoFocus={(e) => e.preventDefault()} className="sm:max-w-[480px]! max-w-[calc(100%-2rem)]! gap-0! max-h-[90vh]  w-[95vw] sm:w-full p-0 bg-bg-card border-input-border-color shadow-lg rounded-modal-radius overflow-auto no-scrollbar">
        <DialogHeader className="p-4 sm:p-6 pb-0! mb-4">
          <DialogTitle className="flex items-center gap-3 text-xl font-semibold text-title">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div className="flex flex-col text-left rtl:text-right">
              <span className="text-title">{t('test_flow_title', { name: flow?.name })}</span>
              <span className="text-md font-medium text-subtitle-color mt-0.5">{t('test_flow_description')}</span>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="p-4 sm:p-6 pt-0 space-y-5">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-title ml-0.5">
                {t('from_number')} <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <Phone className="w-4 h-4" />
                </div>
                <Input
                  placeholder="+1234567890"
                  value={fromNumber}
                  onChange={(e) => setFromNumber(e.target.value)}
                  className="rounded-radius bg-input-color border-input-border-color pl-10 text-sm focus:ring-primary/20 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-title ml-0.5">
                {t('to_number')} <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <Phone className="w-4 h-4" />
                </div>
                <Input
                  placeholder="+1987654321"
                  value={toNumber}
                  onChange={(e) => setToNumber(e.target.value)}
                  className="rounded-radius bg-input-color border-input-border-color pl-10 text-sm focus:ring-primary/20 transition-all"
                />
              </div>
              <p className="text-xs text-subtitle-color ml-0.5">{t('phone_number_hint')}</p>
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-title ml-0.5">
                {t('select_agent', { defaultValue: 'Select Agent' })} <span className="text-destructive">*</span>
              </Label>
              <Select value={selectedAgentId} onValueChange={setSelectedAgentId}>
                <SelectTrigger className="w-full shadow-none rounded-lg bg-input-color border-input-border-color text-sm focus:ring-primary/20 transition-all">
                  <SelectValue placeholder={isLoadingAgents ? t('loading_agents', { defaultValue: 'Loading...' }) : t('select_an_agent', { defaultValue: 'Select an agent' })} />
                </SelectTrigger>
                <SelectContent className="bg-bg-card border-input-border-color rounded-radius">
                  {agents.length === 0 ? (
                    <div className="p-3 text-center text-sm text-subtitle-color">
                      {t('no_active_flow_agents', { defaultValue: 'No active flow agents found.' })}
                    </div>
                  ) : (
                    agents.map((agent: any) => (
                      <SelectItem key={agent._id || agent.id} value={agent._id || agent.id} className="cursor-pointer focus:bg-primary/5 rounded-md text-sm">
                        {agent.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-lg bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/30 p-4 space-y-3">
            <p className="text-md font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5" />
              {t('what_happens_when_you_test')}
            </p>
            <ul className="space-y-2.5 ml-1">
              {[1, 2, 3, 4].map((step) => (
                <li key={step} className="flex gap-2.5 text-sm text-subtitle-color leading-relaxed">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400/60 dark:bg-blue-500/60 mt-1.5 shrink-0" />
                  {t(`test_step_${step}`)}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="p-4 sm:p-6 border-t border-input-border-color flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
          <Button
            variant="outline"
            onClick={handleClose}
            className="sm:w-24 p-padding! rounded-lg text-subtitle-color hover:text-title bg-subcard border border-input-border-color transition-all"
          >
            {t('cancel')}
          </Button>
          <Button
            onClick={handleStartTestCall}
            disabled={isLoading || !fromNumber || !toNumber || !selectedAgentId}
            className="sm:w-auto rounded-lg p-padding! bg-primary text-white font-medium hover:bg-primary/90 transition-all gap-2"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <PhoneCall className="w-4 h-4" />}
            {t('start_test_call')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default TestFlowModal
