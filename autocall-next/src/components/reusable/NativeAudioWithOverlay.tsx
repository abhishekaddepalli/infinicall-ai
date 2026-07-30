'use client'

import { useState, useRef } from "react"

export function NativeAudioWithOverlay({ src, durationInSeconds, className = "" }: { src: string, durationInSeconds: number, className?: string }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  const formatAudioTime = (seconds: number) => {
    if (!seconds) return "00:00"
    const m = Math.floor(seconds / 60)
    const s = Math.floor(seconds % 60)
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  // If the audio pauses, stops, or encounters an error (like user clicking Cancel on Twilio Auth),
  // we want to bring the overlay back if the audio is at 0:00.
  const checkState = () => {
    if (audioRef.current) {
      if ((audioRef.current.paused && audioRef.current.currentTime === 0) || audioRef.current.error) {
        setIsPlaying(false)
      }
    }
  }

  return (
    <div className="relative inline-flex items-center">
      <audio
        ref={audioRef}
        src={src}
        controls
        preload="none"
        onPlay={() => setIsPlaying(true)}
        onPause={checkState}
        onError={() => setIsPlaying(false)}
        onAbort={() => setIsPlaying(false)}
        onStalled={checkState}
        className={`h-8 w-[180px] rounded-lg bg-bg-card ${className}`}
      />
      {!isPlaying && (
        <div className="absolute left-[42px] top-1/2 -translate-y-1/2 bg-[#F1F3F4] dark:bg-[#202124] pointer-events-none flex items-center text-[13px] pl-1 pr-4 h-[26px] z-10" style={{ fontFamily: "Arial, sans-serif" }}>
          0:00 / {formatAudioTime(durationInSeconds)}
        </div>
      )}
    </div>
  )
}
