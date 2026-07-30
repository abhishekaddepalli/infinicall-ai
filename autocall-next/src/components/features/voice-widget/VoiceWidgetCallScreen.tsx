'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { VoiceWidgetCallScreenProps } from '@/types/voice-widget'
import { Mic, MicOff, PhoneOff } from 'lucide-react'

const VoiceWidgetCallScreen = ({
  callStatus,
  callTimer,
  primaryColor,
  isMuted,
  onToggleMute,
  onEndCall,
}: VoiceWidgetCallScreenProps) => {
  return (
    <div className="flex w-full flex-col items-center">
      <p className="mb-2 text-sm text-gray-500">{callStatus}</p>

      <div className="relative mb-10 flex h-[120px] w-[120px] items-center justify-center">
        <span
          className="absolute inset-0 animate-ping rounded-full opacity-30"
          style={{ backgroundColor: primaryColor }}
        />
        <div
          className="relative z-10 flex h-[120px] w-[120px] items-center justify-center rounded-full"
          style={{ backgroundColor: primaryColor }}
        >
          <Mic className="h-10 w-10 text-white" strokeWidth={2} />
        </div>
      </div>

      <p className="mb-10 text-2xl font-bold text-subtitle-color break-all whitespace-normal line-clamp-1">{callTimer}</p>

      <div className="flex gap-5">
        <Button
          type="button"
          onClick={onToggleMute}
          className={cn(
            'flex h-[50px] w-[50px] cursor-pointer items-center justify-center rounded-full border-none transition-colors hover:bg-gray-100',
            isMuted ? 'bg-destructive text-white hover:bg-destructive' : 'bg-primary/15 hover:bg-primary hover:text-white text-primary'
          )}
          aria-label="Toggle mute"
        >
          {isMuted ? <MicOff className="h-6 w-6" strokeWidth={2} /> : <Mic className="h-6 w-6" strokeWidth={2} />}
        </Button>
        <Button
          type="button"
          onClick={onEndCall}
          className={cn(
            'flex h-[50px] w-[50px] cursor-pointer items-center justify-center rounded-full',
            'border-none bg-destructive text-white shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-colors',
          )}
          aria-label="End call"
        >
          <PhoneOff className="h-6 w-6 text-white" strokeWidth={2} />
        </Button>
      </div>
    </div>
  )
}

export default VoiceWidgetCallScreen
