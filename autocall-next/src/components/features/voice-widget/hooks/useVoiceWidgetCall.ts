'use client'

import { useLazyGetWidgetTokenByKeyQuery } from '@/redux/api/widgetApi'
import { Widget } from '@/types/widget'
import { Device, Call } from '@twilio/voice-sdk'
import { useCallback, useEffect, useRef, useState } from 'react'

export const useVoiceWidgetCall = (widgetKey: string, widgetData: Widget | undefined) => {
  const [callStatus, setCallStatus] = useState<string>('')
  const [callTimer, setCallTimer] = useState('00:00')
  const [isMuted, setIsMuted] = useState(false)

  const deviceRef = useRef<Device | null>(null)
  const activeCallRef = useRef<Call | null>(null)
  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const secondsRef = useRef(0)
  const initializedRef = useRef(false)

  const [fetchToken] = useLazyGetWidgetTokenByKeyQuery()

  const clearTimer = useCallback(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current)
      timerIntervalRef.current = null
    }
  }, [])

  const startTimer = useCallback(() => {
    clearTimer()
    secondsRef.current = 0
    timerIntervalRef.current = setInterval(() => {
      secondsRef.current += 1
      const mins = Math.floor(secondsRef.current / 60)
      const secs = secondsRef.current % 60
      setCallTimer(
        `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`,
      )
    }, 1000)
  }, [clearTimer])

  const makeCall = useCallback(async () => {
    if (!deviceRef.current) return

    const params = { widgetKey }
    const activeCall = await deviceRef.current.connect({ params })
    activeCallRef.current = activeCall

    activeCall.on('accept', () => {
      setCallStatus('In Call')
      startTimer()
    })

    activeCall.on('disconnect', () => {
      setCallStatus('Call ended')
      clearTimer()
    })

    activeCall.on('error', (error: { message: any }) => {
      setCallStatus(`Call error: ${error.message}`)
    })
  }, [widgetKey, startTimer, clearTimer])

  const startCall = useCallback(async () => {
    setCallStatus('Connecting...')

    try {
      const tokenResult = await fetchToken(widgetKey).unwrap()

      if (!tokenResult.success) {
        throw new Error(tokenResult.message || 'Failed to fetch token')
      }

      const device = new Device(tokenResult.token, {
        codecPreferences: [Call.Codec.Opus, Call.Codec.PCMU],
        fakeLocalAudio: true,
        enableIceRestart: true,
      } as ConstructorParameters<typeof Device>[1])

      deviceRef.current = device

      device.on('registered', () => {
        void makeCall()
      })

      device.on('error', (error: { message: any }) => {
        const errMsg = `Connection Error: ${JSON.stringify(error)} | ${error.message}`
        setCallStatus(errMsg)
      })

      device.register()
    } catch (err) {
      console.error('Failed to start call:', err)
      setCallStatus('Failed to connect')

    }
  }, [widgetKey, fetchToken, makeCall])

  const endCall = useCallback(() => {
    if (activeCallRef.current) {
      activeCallRef.current.disconnect()
    }
    if (deviceRef.current) {
      deviceRef.current.destroy()
      deviceRef.current = null
    }
    clearTimer()
  }, [clearTimer])

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const nextMuted = !prev
      if (activeCallRef.current) {
        activeCallRef.current.mute(nextMuted)
      }
      return nextMuted
    })
  }, [])

  useEffect(() => {
    if (!widgetData || initializedRef.current) return
    initializedRef.current = true

    const timer = setTimeout(() => {
      void startCall()
    }, 0)

    return () => clearTimeout(timer)
  }, [widgetData, startCall])

  useEffect(() => {
    return () => {
      if (activeCallRef.current) {
        activeCallRef.current.disconnect()
      }
      if (deviceRef.current) {
        deviceRef.current.destroy()
      }
      clearTimer()
    }
  }, [clearTimer])

  return {
    callStatus,
    callTimer,
    startCall,
    endCall,
    toggleMute,
    isMuted,
    primaryColor: widgetData?.branding?.primary_color || '#015482',
    brandName: widgetData?.branding.brand_name || 'AI Assistant',
  }
}
