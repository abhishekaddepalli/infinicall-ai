'use client'

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { VoiceCardProps } from "@/types/voice"
import { AudioWaveform, Globe, Pause, Play, Sparkles, User } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"

export const VoiceCard = ({ voice }: VoiceCardProps) => {
  const { t } = useTranslation()
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  const togglePlay = () => {
    if (!voice.preview_url) return

    if (!audioRef.current) {
      const audio = new Audio(voice.preview_url)
      audio.onended = () => setIsPlaying(false)
      audio.onerror = (err) => {
        console.error("Audio playback error:", err)
        setIsPlaying(false)
      }
      audioRef.current = audio
    }

    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      const playPromise = audioRef.current.play()
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch((err) => {
            console.error("Failed to play voice preview:", err)
            setIsPlaying(false)
          })
      } else {
        setIsPlaying(true)
      }
    }
  }

  const voiceDetails = [
    {
      key: 'gender',
      value: voice.labels.gender,
      icon: User,
    },
    {
      key: 'accent',
      value: voice.labels.accent,
      icon: Globe,
    },
    {
      key: 'age',
      value: voice.labels.age,
      icon: Sparkles,
    },
    {
      key: 'description',
      value: voice.labels.description,
      icon: AudioWaveform,
    },
  ]

  return (
    <Card className="group relative overflow-hidden bg-bg-card border border-input-border-color hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 rounded-lg h-full flex flex-col">
      {/* Dynamic Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <CardHeader className="sm:p-6 p-4 pb-4 relative z-10">
        <div className="flex justify-between items-start gap-4">
          <div className="space-y-3 flex-1">
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="bg-subcard border-input-border-color text-zinc-600 dark:text-zinc-300 text-[10px] uppercase tracking-wider font-semibold rounded-full px-2.5 py-0.5">
                {voice.category?.toLowerCase() === 'premade' ? 'Predefined' : voice.category?.replace(/_/g, ' ')}
              </Badge>
              <Badge variant="outline" className="bg-primary/10 border-transparent text-primary text-[10px] uppercase tracking-wider font-semibold rounded-full px-2.5 py-0.5 shadow-sm shadow-primary/10">
                {t(voice.provider)}
              </Badge>
            </div>
            <h3 className="sm:text-xl text-lg font-bold text-title group-hover:text-primary transition-colors line-clamp-2">
              {voice.name}
            </h3>
          </div>
          <Button
            size="icon"
            onClick={togglePlay}
            disabled={!voice.preview_url}
            className={`shrink-0 w-14 h-14 rounded-full transition-all duration-500 relative overflow-hidden ${isPlaying
              ? "bg-primary text-white scale-105 shadow-lg shadow-primary/30"
              : "bg-subcard text-zinc-600 dark:text-zinc-300 hover:bg-primary/10 hover:text-primary border border-input-border-color hover:border-primary/30"
              }`}
          >
            {isPlaying && (
              <span className="absolute inset-0 rounded-full animate-ping bg-primary/20" />
            )}
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-current relative z-10" />
            ) : (
              <Play className="w-5 h-5 fill-current relative z-10" />
            )}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="sm:p-6 p-4 pt-0 relative z-10 space-y-4 flex-1">
        <div className="flex flex-wrap gap-2">
          {voiceDetails.map(({ key, value, icon: Icon }) =>
            value && (
              <div
                key={key}
                className="flex items-center gap-1.5 rounded-full border border-input-border-color bg-subcard px-3 py-1.5 dark:border-white/5 dark:bg-white/5 backdrop-blur-sm transition-colors group-hover:border-zinc-300 dark:group-hover:border-white/10"
              >
                <Icon className="h-3.5 w-3.5 text-zinc-400 group-hover:text-primary/70 transition-colors" />
                <span className="text-xs font-medium text-zinc-600 dark:text-zinc-300 capitalize truncate max-w-[120px]">
                  {value}
                </span>
              </div>
            )
          )}
        </div>
      </CardContent>
    </Card>
  )
}
