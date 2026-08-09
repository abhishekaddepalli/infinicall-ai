
export interface VoiceWidgetProps {
  widgetKey: string
}

export interface VoiceWidgetPanelProps {
  widgetKey: string
  onClose: () => void
}

export interface VoiceWidgetCallScreenProps {
  callStatus: string
  callTimer: string
  primaryColor: string
  isMuted: boolean
  onToggleMute: () => void
  onEndCall: () => void
}