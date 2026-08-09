'use client'

import { useGetPublicWidgetByKeyQuery } from '@/redux/api/widgetApi'
import { VoiceWidgetPanelProps } from '@/types/voice-widget'
import { X } from 'lucide-react'
import { useVoiceWidgetCall } from './hooks/useVoiceWidgetCall'
import VoiceWidgetCallScreen from './VoiceWidgetCallScreen'
import { Button } from '@/components/ui/button'

const VoiceWidgetPanel = ({ widgetKey, onClose }: VoiceWidgetPanelProps) => {
  const { data: widgetResponse, isLoading, isError } = useGetPublicWidgetByKeyQuery(widgetKey)
  const widgetData = widgetResponse?.data

  const {
    callStatus,
    callTimer,
    endCall,
    toggleMute,
    isMuted,
    primaryColor,
    brandName,
  } = useVoiceWidgetCall(widgetKey, widgetData)

  if (isLoading) {
    return (
      <div className="flex h-[500px] items-center justify-center">
        <div className="text-center">
          <div className="mb-3 inline-block h-12 w-12 animate-spin rounded-full border-b-4 border-primary" />
          <p className="text-sm font-medium text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (isError || !widgetData) {
    return (
      <div className="flex h-[500px] items-center justify-center">
        <div className="p-6 text-center">
          <p className="mb-1 font-semibold text-gray-800">Failed to load</p>
          <p className="text-xs text-gray-600">Please try again</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-[500px] w-full flex-col overflow-hidden rounded-lg bg-bg-card">
      <div className="flex items-center justify-between border-b border-input-border-color bg-bg-card px-5 py-4">
        <div className="text-base font-semibold text-title">{brandName}</div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-8 w-8 rounded-full text-gray-500 transition-colors hover:bg-destructive/10 hover:text-destructive! focus-visible:ring-0"
          aria-label="Close widget"
        >
          <X className="h-5 w-5" strokeWidth={2} />
        </Button>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center sm:p-5 p-4 text-center">
        <VoiceWidgetCallScreen
          callStatus={callStatus}
          callTimer={callTimer}
          primaryColor={primaryColor}
          isMuted={isMuted}
          onToggleMute={toggleMute}
          onEndCall={() => {
            endCall()
            onClose()
          }}
        />
      </div>
    </div>
  )
}

export default VoiceWidgetPanel
