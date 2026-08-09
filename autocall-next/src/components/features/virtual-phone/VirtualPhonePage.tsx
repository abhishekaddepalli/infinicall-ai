'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { DIALPAD_KEYS, getDeviceStatuses } from '@/data/dialpadData'
import { cn } from '@/lib/utils'
import { useGenerateDialerTokenMutation } from '@/redux/api/dialerApi'
import { useGetPhoneNumbersQuery } from '@/redux/api/phoneNumberApi'
import { useGetCallLogsQuery } from '@/redux/api/callApi'
import { Call, Device } from '@twilio/voice-sdk'
import { ChevronRight, Delete, Info, MicOff, Phone, PhoneOff, ShieldCheck, User, Loader2 } from 'lucide-react'
import { useSelector } from 'react-redux'
import { usePermission } from '@/hooks/usePermission'
import { PERMISSIONS } from '@/constants/permissions'
import { RootState } from '@/redux/store'
import { socketService } from '@/services/socketService'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

export default function VirtualPhonePage() {
  const { t } = useTranslation()
  const { hasPermission } = usePermission()

  const canConnectDialer = hasPermission(PERMISSIONS.INITIATE_CALL_VIRTUAL_PHONE)

  const [phoneNumberId, setPhoneNumberId] = useState<string>('')
  const [targetNumber, setTargetNumber] = useState<string>('')
  const [status, setStatus] = useState<string>('virtual_phone_offline')
  const [isMuted, setIsMuted] = useState(false)
  const [activeCall, setActiveCall] = useState<Call | null>(null)
  const [currentCallerId, setCurrentCallerId] = useState<string>('')
  const [currentProvider, setCurrentProvider] = useState<string>('')
  const [isRecordingEnabled, setIsRecordingEnabled] = useState(true)
  const [isPlivoCallActive, setIsPlivoCallActive] = useState(false)
  const [callDuration, setCallDuration] = useState<number>(0)
  const user = useSelector((state: RootState) => state.auth.user)
  const deviceRef = useRef<Device | null>(null)
  const plivoClientRef = useRef<any>(null)
  const pressTimer = useRef<NodeJS.Timeout | null>(null)
  const isLongPress = useRef(false)

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (status === 'virtual_phone_in_call') {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1)
      }, 1000)
    } else {
      setCallDuration(0)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [status])

  // Foolproof polling for Twilio call status since WebSockets can be blocked
  const { data: callLogs } = useGetCallLogsQuery(
    { limit: 1, sortColumn: 'created_at', sortOrder: 'desc' },
    {
      skip: !activeCall || isPlivoCallActive || (status !== 'virtual_phone_calling' && status !== 'virtual_phone_ringing'),
      pollingInterval: 1500
    }
  )

  useEffect(() => {
    if (callLogs?.data && callLogs.data.length > 0 && activeCall && !isPlivoCallActive) {
      const latestCall = callLogs.data[0]
      if (latestCall.status === 'in-progress') {
        setStatus('virtual_phone_in_call')
      } else if (latestCall.status === 'ringing' && status !== 'virtual_phone_in_call') {
        setStatus('virtual_phone_ringing')
      }
    }
  }, [callLogs, activeCall, isPlivoCallActive, status])

  useEffect(() => {
    const userId = user?.id || (user as any)?._id
    if (!userId) return

    const socket = socketService.connect()

    const handleCallStatus = (data: any) => {
      if (activeCall) {
        if (data.status === 'in-progress') {
          setStatus('virtual_phone_in_call')
        } else if (data.status === 'ringing') {
          setStatus('virtual_phone_ringing')
        }
      }
    }

    socket.on(`call-status-update-${userId}`, handleCallStatus)

    return () => {
      socket.off(`call-status-update-${userId}`, handleCallStatus)
    }
  }, [user?.id, (user as any)?._id, activeCall])

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const { data: phoneNumbersData, isLoading: isLoadingNumbers } = useGetPhoneNumbersQuery({ limit: 100 })
  const [generateToken, { isLoading: isGeneratingToken }] = useGenerateDialerTokenMutation()

  const phoneNumbers = phoneNumbersData?.data || []

  useEffect(() => {
    return () => {
      if (deviceRef.current) {
        deviceRef.current.destroy()
      }
      if (plivoClientRef.current) {
        plivoClientRef.current.logout()
      }
    }
  }, [])

  const handleConnect = async () => {
    if (!phoneNumberId) {
      toast.error(t('virtual_phone_select_caller_error'))
      return
    }

    try {
      setStatus('virtual_phone_initializing')
      const response = await generateToken({ phoneNumberId }).unwrap()

      if (response.provider === 'twilio' && response.token) {
        const device = new Device(response.token, {
          logLevel: 1,
        })

        device.on('ready', () => {
          setStatus('virtual_phone_ready')
          toast.success(t('virtual_phone_device_ready_msg'))
        })

        device.on('registered', () => {
          setStatus('virtual_phone_ready')
          toast.success(t('virtual_phone_device_ready_msg'))
        })

        device.on('error', (error) => {
          console.error('Twilio Error:', error)
          setStatus('virtual_phone_error')
          toast.error(error.message)
        })

        device.on('disconnect', () => {
          setStatus('virtual_phone_ready')
          setActiveCall(null)
          setTargetNumber('')
        })

        device.register()
        deviceRef.current = device
        setCurrentCallerId(response.number)
        setCurrentProvider(response.provider)
      } else if (response.provider === 'plivo' && response.username && response.password) {
        if (typeof window !== 'undefined') {
          try {
            if (!(window as any).plivoConsolePatched) {
              const originalConsoleError = console.error
              console.error = function (...args) {
                if (args[0] && typeof args[0] === 'string' && args[0].includes('PlivoSDK')) {
                  console.warn(...args)
                  return
                }
                originalConsoleError.apply(console, args)
              }
                ; (window as any).plivoConsolePatched = true
            }

            const mod = await import('plivo-browser-sdk')
            const PlivoSDK = mod.default || (mod as any)
            const plivoObj = new PlivoSDK({})
            const client = plivoObj.client

            client.on('onLogin', () => {
              setStatus('virtual_phone_ready')
              toast.success(t('virtual_phone_device_ready_msg'))
            })

            client.on('onLoginFailed', () => {
              setStatus('virtual_phone_error')
              toast.error('Plivo login failed')
            })

            client.on('onCallRemoteRinging', () => {
              setStatus('virtual_phone_ringing')
            })

            client.on('onCallAnswered', () => {
              setStatus('virtual_phone_in_call')
              setIsPlivoCallActive(true)
            })

            client.on('onCallTerminated', () => {
              setStatus('virtual_phone_ready')
              setIsPlivoCallActive(false)
              setIsMuted(false)
              setTargetNumber('')
            })

            client.on('onCallFailed', (cause: any) => {
              toast.error(t('virtual_phone_call_error', { error: cause || 'Call failed' }))
              setStatus('virtual_phone_ready')
              setIsPlivoCallActive(false)
            })

            client.login(response.username, response.password)
            plivoClientRef.current = client
            setCurrentCallerId(response.number)
            setCurrentProvider(response.provider)
          } catch (err: any) {
            console.error('Plivo SDK Load Error:', err)
            toast.error(`Failed to load Plivo SDK: ${err.message}`)
            setStatus('virtual_phone_error')
          }
        }
      } else {
        toast.error(t('virtual_phone_provider_unsupported', { provider: response.provider }))
        setStatus('virtual_phone_offline')
      }
    } catch (error) {
      const err = error as { data?: { message?: string } }
      console.error(error)
      setStatus('virtual_phone_error')
      toast.error(err?.data?.message || t('virtual_phone_init_failed'))
    }
  }

  const handleDial = async () => {
    if (!deviceRef.current && !plivoClientRef.current) {
      toast.error(t('virtual_phone_init_device_first'))
      return
    }
    if (!targetNumber) {
      toast.error(t('virtual_phone_enter_number'))
      return
    }

    try {
      if (currentProvider === 'twilio' && deviceRef.current) {
        const call = await deviceRef.current.connect({
          params: {
            To: targetNumber,
            callerId: currentCallerId,
            provider: currentProvider,
            record: isRecordingEnabled ? 'true' : 'false',
          },
        })

        call.on('accept', () => {
          // Do not set in_call here because Twilio accepts instantly to play ringing media.
          // Wait for Socket.io 'in-progress' status to accurately start the timer.
          setActiveCall(call)
        })

        call.on('ringing', () => {
          setStatus('virtual_phone_ringing')
        })

        call.on('disconnect', () => {
          setStatus('virtual_phone_ready')
          setActiveCall(null)
          setIsMuted(false)
          setTargetNumber('')
        })

        call.on('error', (error) => {
          toast.error(t('virtual_phone_call_error', { error: error.message }))
          setStatus('virtual_phone_ready')
          setActiveCall(null)
        })

        setStatus('virtual_phone_calling')
        setActiveCall(call)
      } else if (currentProvider === 'plivo' && plivoClientRef.current) {
        const extraHeaders = {
          'X-PH-callerId': currentCallerId,
          'X-PH-provider': currentProvider,
          'X-PH-record': isRecordingEnabled ? 'true' : 'false',
          'X-PH-To': targetNumber
        }
        plivoClientRef.current.call(targetNumber, extraHeaders)
        setStatus('virtual_phone_calling')
        setIsPlivoCallActive(true)
      }
    } catch (error: any) {
      toast.error(t('virtual_phone_error_establishing'))
      setStatus('virtual_phone_ready')
    }
  }

  const handleHangup = () => {
    if (activeCall) {
      activeCall.disconnect()
    } else if (deviceRef.current) {
      deviceRef.current.disconnectAll()
    }

    if (plivoClientRef.current && isPlivoCallActive) {
      plivoClientRef.current.hangup()
      setIsPlivoCallActive(false)
    }

    setStatus('virtual_phone_ready')
    setActiveCall(null)
    setTargetNumber('')
  }

  const toggleMute = () => {
    const newMuteState = !isMuted
    if (activeCall) {
      activeCall.mute(newMuteState)
    } else if (plivoClientRef.current && isPlivoCallActive) {
      if (newMuteState) {
        plivoClientRef.current.mute()
      } else {
        plivoClientRef.current.unmute()
      }
    }
    setIsMuted(newMuteState)
  }

  const handleDigitClick = (digit: string) => {
    setTargetNumber((prev) => prev + digit)
    if (activeCall) {
      activeCall.sendDigits(digit)
    } else if (plivoClientRef.current && isPlivoCallActive) {
      plivoClientRef.current.sendDtmf(digit)
    }
  }

  const handleBackspace = () => {
    setTargetNumber((prev) => prev.slice(0, -1))
  }


  return (
    <div className="h-full flex flex-col animate-in fade-in duration-500 md:overflow-hidden overflow-y-auto pb-4">
      <div className="flex items-center gap-4 mb-2 shrink-0">
        <div className="flex flex-col">
          <h1 className="text-text-3xl font-bold text-title">{t('virtual_phone', 'Virtual Phone')}</h1>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 lg:gap-10 w-full max-w-5xl mx-auto items-center md:items-stretch justify-center flex-1 min-h-0">

        {/* Connection Setup Card */}
        <Card className="w-full md:w-[340px] lg:w-[420px] shrink-0 bg-bg-card border border-input-border-color shadow-sm rounded-lg overflow-hidden flex flex-col">
          <div className="sm:p-6 p-4 flex flex-col gap-8 h-full">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-title">{t('virtual_phone_device_setup', 'Device Setup')}</h2>
              <div className={cn("flex items-center gap-2 px-3 py-1 rounded-full", status === 'virtual_phone_offline' ? "bg-zinc-100 dark:bg-zinc-800/50" : status === 'virtual_phone_error' ? "bg-destructive/10" : "bg-edit/10")}>
                <span className={cn("w-2 h-2 rounded-full", status === 'virtual_phone_offline' ? "bg-zinc-400 dark:bg-zinc-500" : status === 'virtual_phone_error' ? "bg-destructive" : "bg-edit")}></span>
                <span className={cn("text-xs font-semibold capitalize tracking-wide", status === 'virtual_phone_offline' ? "text-zinc-500 dark:text-zinc-400" : status === 'virtual_phone_error' ? "text-destructive" : "text-edit")}>
                  {status === 'virtual_phone_offline' ? t('virtual_phone_offline') : status === 'virtual_phone_error' ? t('virtual_phone_error') : t('online')}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-text-sm font-semibold text-title flex items-center gap-2">
                {t('virtual_phone_select_caller_id', 'Select Caller ID (Phone Number)')}
                <Info className="w-4 h-4 text-subtitle-color" />
              </Label>
              {isLoadingNumbers ? (
                <Skeleton className="h-12 w-full rounded-xl bg-zinc-100 dark:bg-zinc-800/50" />
              ) : (
                <Select value={phoneNumberId} onValueChange={setPhoneNumberId} disabled={!!deviceRef.current || !!plivoClientRef.current}>
                  <SelectTrigger className="h-12 bg-bg-card border-input-border-color rounded-xl text-text-md shadow-sm">
                    <SelectValue placeholder={t('virtual_phone_select_placeholder')} />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-input-border-color shadow-lg">
                    {phoneNumbers.map((number) => (
                      <SelectItem key={number.id || number._id} value={number.id || number._id} className="cursor-pointer py-3 px-4 rounded-lg focus:bg-primary/5 focus:text-primary transition-colors my-0.5">
                        <div className="flex items-center justify-between w-full gap-4">
                          <span className="font-semibold text-title text-text-base">{number.phone_number}</span>
                          <span className="text-xs font-medium text-subtitle-color bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded-md uppercase tracking-wider">{number.provider}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              <Button
                className="w-full h-12 mt-2 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium shadow-sm transition-all active:scale-[0.98]"
                disabled={!phoneNumberId || !!deviceRef.current || !!plivoClientRef.current || isGeneratingToken}
                onClick={handleConnect}
                title={!canConnectDialer ? t('permission_denied', 'You do not have permission to connect.') : ''}
              >
                {isGeneratingToken ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 rtl:mr-[unset] rtl:ml-2 animate-spin" /> {t('virtual_phone_connect_dialer', 'Connect to Dialer')}
                  </>
                ) : (
                  <>
                    <Phone className="w-4 h-4 mr-2 rtl:mr-[unset] rtl:ml-2" /> {t('virtual_phone_connect_dialer', 'Connect to Dialer')}
                  </>
                )}
              </Button>
            </div>

            <div className="space-y-4">
              <h3 className="text-base font-bold text-title">{t('virtual_phone_device_status', 'Device Status')}</h3>
              <div className="space-y-4">
                {getDeviceStatuses(t, status).map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-subtitle-color">
                      <item.icon className="w-4 h-4" />
                      <span className="text-md font-medium">{item.label}</span>
                    </div>
                    <span className={cn("text-xs font-semibold px-2.5 py-1 rounded-md capitalize", item.className)}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className=" sm:pt-6 pt-4">
              <div className="flex items-center justify-between bg-primary/10 p-4 rounded-lg border border-primary/20 cursor-pointer hover:bg-primary/10 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shadow-sm border border-primary/20">
                    <ShieldCheck className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-md font-semibold text-primary">{t('secure_connection')}</h4>
                    <p className="text-sm text-subtitle-color mt-0.5">{t('secure_connection_desc')}</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-primary" />
              </div>
            </div>
          </div>
        </Card>

        {/* Mobile Dialer Container */}
        <div className="flex-1 flex justify-center items-center w-full h-full rounded-lg bg-bg-card border border-input-border-color shadow-sm p-2 sm:p-6 max-w-md md:max-w-none">
          <div className="w-[280px] sm:w-[320px] h-[550px] sm:h-[600px] rounded-[36px] border-[8px] sm:border-[10px] border-zinc-900 bg-zinc-900 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.4)] relative overflow-hidden flex flex-col ring-1 ring-zinc-800/50 shrink-0">
            {/* Notch */}
            <div className="absolute top-0 inset-x-0 h-6 sm:h-7 flex justify-center z-20">
              <div className="w-28 sm:w-36 h-5 sm:h-6 bg-zinc-900 rounded-b-3xl"></div>
            </div>

            {/* Screen Content */}
            <div className="flex-1 flex flex-col bg-bg-body relative z-10 pt-8 sm:pt-10 pb-4">
              {/* Status Bar Fake */}
              <div className="absolute top-0 inset-x-0 h-10 sm:h-12 flex justify-between items-center px-5 sm:px-6 pt-1 text-[11px] sm:text-[12px] font-medium text-title/70">
                <span className=" text-md">9:41</span>
                <div className="flex gap-1.5 items-center">
                  <div className="w-4 h-3 bg-title/70 rounded-sm"></div>
                  <div className="w-3.5 h-3.5 rounded-full border-2 border-title/70"></div>
                </div>
              </div>

              {/* Display Area */}
              <div className="flex flex-col items-center mt-4 mb-0 px-4">
                {status === 'virtual_phone_calling' || status === 'virtual_phone_ringing' || status === 'virtual_phone_in_call' ? (
                  <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
                    <div className="relative mb-2 mt-0">
                      {status === 'virtual_phone_in_call' && (
                        <>
                          <div className="absolute inset-0 rounded-full border-[2px] border-primary/40 animate-ping" style={{ animationDuration: '2.5s' }}></div>
                          <div className="absolute inset-0 rounded-full border-[2px] border-primary/20 animate-ping" style={{ animationDuration: '2.5s', animationDelay: '1.2s' }}></div>
                        </>
                      )}
                      <div className="w-14 h-14 relative z-10 rounded-full flex items-center justify-center shadow-md border border-primary/30 bg-bg-card">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="w-5 h-5 text-primary" />
                        </div>
                      </div>
                    </div>
                    <h4 className="text-lg font-bold text-title mb-0.5 text-center truncate w-full px-2">
                      {targetNumber}
                    </h4>
                    <p className="text-[11px] font-medium text-subtitle-color">
                      {status === 'virtual_phone_in_call' ? formatDuration(callDuration)
                        : status === 'virtual_phone_ringing' ? t('ringing', 'Ringing...')
                          : t('connecting', 'Connecting...')}
                    </p>
                  </div>
                ) : (
                  <div className="w-full flex flex-col items-center mb-2 mt-2">
                    <div className="w-full relative group">
                      <Input
                        type="text"
                        value={targetNumber}
                        onChange={(e) => setTargetNumber(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && targetNumber && status === 'virtual_phone_ready' && !activeCall && !isPlivoCallActive) {
                            handleDial()
                          }
                        }}
                        placeholder={t('enter_number_short', '+1 (___) ___-____')}
                        className="w-full bg-transparent border-none outline-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 font-bold text-title text-lg! placeholder:text-subtitle-color text-center px-10 h-12"
                        disabled={status === 'virtual_phone_offline' || status === 'virtual_phone_error'}
                      />
                      {targetNumber && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={handleBackspace}
                          className="absolute right-0 top-0 bottom-0 my-auto flex items-center justify-center text-subtitle-color hover:text-title hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full h-12 w-12 shrink-0 opacity-60 hover:opacity-100 transition-opacity"
                        >
                          <Delete className="w-6 h-6" />
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Dialpad Keys */}
              <div className={cn("px-6 sm:px-8 mt-0 mb-3 sm:mb-4 transition-all duration-300", (status === 'virtual_phone_calling' || status === 'virtual_phone_ringing' || status === 'virtual_phone_in_call') ? "opacity-30 pointer-events-none" : "opacity-100")}>
                <div className="grid grid-cols-3 gap-x-4 sm:gap-x-5 gap-y-3 sm:gap-y-4">
                  {DIALPAD_KEYS.map((btn) => (
                    <Button
                      key={btn.key}
                      variant="ghost"
                      onPointerDown={() => {
                        if (btn.key === '0') {
                          isLongPress.current = false;
                          pressTimer.current = setTimeout(() => {
                            isLongPress.current = true;
                            handleDigitClick('+');
                          }, 500);
                        }
                      }}
                      onPointerUp={() => {
                        if (btn.key === '0') {
                          if (pressTimer.current) clearTimeout(pressTimer.current);
                          if (!isLongPress.current) handleDigitClick(btn.key);
                        } else {
                          handleDigitClick(btn.key);
                        }
                      }}
                      onPointerLeave={() => {
                        if (btn.key === '0' && pressTimer.current) {
                          clearTimeout(pressTimer.current);
                        }
                      }}
                      disabled={status === 'virtual_phone_offline' || status === 'virtual_phone_error'}
                      className="h-[52px] w-[52px] sm:h-[64px] sm:w-[64px] aspect-square rounded-full bg-subcard flex flex-col items-center justify-center hover:bg-input-color hover:text-title transition-colors cursor-pointer disabled:opacity-50 border-none p-0 mx-auto"
                    >
                      <span className="text-xl sm:text-2xl font-normal text-title leading-none mt-1">{btn.key}</span>
                      {btn.letters ? (
                        <span className="text-[10px] font-semibold text-subtitle-color mt-0.5 tracking-[0.15em] uppercase">
                          {btn.letters}
                        </span>
                      ) : (
                        <span className="h-[15px]"></span>
                      )}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center items-center gap-4 sm:gap-5 mt-auto pb-6 sm:pb-8 px-4 sm:px-6">
                {/* Mute Button */}
                <Button
                  variant="outline"
                  disabled={!activeCall && !isPlivoCallActive}
                  onClick={toggleMute}
                  style={{ borderRadius: '9999px' }}
                  className={cn(
                    "w-10 h-10 sm:w-12 sm:h-12 !rounded-full aspect-square p-0 shrink-0 border-none shadow-sm transition-all duration-200 flex items-center justify-center",
                    isMuted
                      ? "bg-amber-500/20 text-amber-600"
                      : "bg-subcard text-subtitle-color hover:bg-input-color hover:text-title"
                  )}
                >
                  <MicOff className="w-5 h-5" />
                </Button>

                {/* Call/Hangup Button */}
                {(!activeCall && !isPlivoCallActive) && status !== 'virtual_phone_calling' ? (
                  <Button
                    onClick={handleDial}
                    disabled={status !== 'virtual_phone_ready' || !targetNumber}
                    style={{ borderRadius: '9999px' }}
                    className="w-14 h-14 sm:w-16 sm:h-16 !rounded-full aspect-square p-0 shrink-0 bg-edit text-white shadow-[0_8px_20px_rgba(16,185,129,0.3)] transition-all duration-200 active:scale-95 disabled:opacity-50 flex items-center justify-center"
                  >
                    <Phone className="w-6 h-6 fill-white" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleHangup}
                    style={{ borderRadius: '9999px' }}
                    className="w-14 h-14 sm:w-16 sm:h-16 !rounded-full aspect-square p-0 shrink-0 bg-red-500 hover:bg-red-600 text-white shadow-[0_8px_20px_rgba(239,68,68,0.3)] transition-all duration-200 active:scale-95 flex items-center justify-center"
                  >
                    <PhoneOff className="w-6 h-6" />
                  </Button>
                )}

                {/* Record Button */}
                <Button
                  variant="outline"
                  disabled={(activeCall !== null || isPlivoCallActive) || status === 'virtual_phone_offline' || status === 'virtual_phone_error'}
                  onClick={() => setIsRecordingEnabled(!isRecordingEnabled)}
                  className={cn(
                    "w-10 h-10 sm:w-12 sm:h-12 !rounded-full aspect-square p-0 shrink-0 border-none shadow-sm transition-all duration-200 flex flex-col items-center justify-center gap-1",
                    isRecordingEnabled
                      ? "bg-destructive/10 text-destructive"
                      : "bg-subcard text-subtitle-color hover:bg-input-color hover:text-title"
                  )}
                  title={isRecordingEnabled ? t('recording_enabled') : t('recording_disabled')}
                >
                  <div className={cn("w-2! h-2! !rounded-full shrink-0 aspect-square", isRecordingEnabled ? "bg-destructive animate-[pulse_1.5s_ease-in-out_infinite]" : "bg-subtitle-color/50")}></div>
                  <span className="text-[10px] font-bold tracking-wider">{t('rec')}</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
