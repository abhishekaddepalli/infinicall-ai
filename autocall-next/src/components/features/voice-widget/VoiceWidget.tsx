'use client'

import { Button } from '@/components/ui/button'
import { VoiceWidgetProps } from '@/types/voice-widget'
import { Mic } from 'lucide-react'
import { useState } from 'react'
import VoiceWidgetPanel from './VoiceWidgetPanel'

const VoiceWidget = ({ widgetKey }: VoiceWidgetProps) => {
  const [isOpen, setIsOpen] = useState(false)

  if (!widgetKey) return null

  return (
    <>
      <Button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-[0_4px_20px_rgba(59,130,246,0.4)] transition-all duration-300 hover:scale-110 hover:bg-primary/50 hover:shadow-xl active:scale-95"
        aria-label="Open voice assistant"
      >
        <Mic className="h-6 w-6" strokeWidth={2} />
      </Button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          <div className="fixed bottom-20 right-4 left-4 sm:left-auto sm:bottom-24 sm:right-6 z-50 sm:w-[400px] overflow-hidden rounded-lg border border-input-border-color bg-bg-card shadow-2xl">
            <VoiceWidgetPanel widgetKey={widgetKey} onClose={() => setIsOpen(false)} />
          </div>
        </>
      )}
    </>
  )
}

export default VoiceWidget
