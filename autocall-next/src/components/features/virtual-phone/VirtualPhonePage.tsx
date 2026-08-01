'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useGetAgentsQuery } from '@/redux/api/agentApi'
import { useGetCallLogsQuery, usePlaceCallMutation } from '@/redux/api/callApi'
import { useGetPhoneNumbersQuery } from '@/redux/api/phoneNumberApi'
import { motion } from 'framer-motion'
import {
  Activity,
  ArrowDownLeft,
  ArrowUpRight,
  Bot,
  CheckCircle2,
  Clock,
  Delete,
  Globe,
  Mic,
  MicOff,
  Pause,
  Phone,
  PhoneCall,
  PhoneForwarded,
  PhoneOff,
  Play,
  Radio,
  RefreshCw,
  Search,
  ShieldCheck,
  Signal,
  Sparkles,
  User,
  Volume2,
  VolumeX,
  Zap
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

export function VirtualPhonePage() {
  const [dialNumber, setDialNumber] = useState('')
  const [callerId, setCallerId] = useState('')
  const [selectedAgentId, setSelectedAgentId] = useState('')
  const [callState, setCallState] = useState<'idle' | 'calling' | 'connected' | 'on_hold'>('idle')
  const [callDuration, setCallDuration] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [isSpeakerOn, setIsSpeakerOn] = useState(true)
  const [isRecording, setIsRecording] = useState(false)
  const [isConnectedToDialer, setIsConnectedToDialer] = useState(true)
  const [activeTab, setActiveTab] = useState('dialpad')
  const [activitySearch, setActivitySearch] = useState('')

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // API Queries & Mutations
  const { data: numbersRes, isLoading: loadingNumbers } = useGetPhoneNumbersQuery({ limit: 100 })
  const { data: agentsRes } = useGetAgentsQuery({ limit: 100 })
  const { data: callActivityRes } = useGetCallLogsQuery({ limit: 10 })
  const [placeCall, { isLoading: isPlacingCall }] = usePlaceCallMutation()

  const phoneNumbers = numbersRes?.data || []
  const agents = agentsRes?.data || []
  const callLogs = callActivityRes?.data || []

  useEffect(() => {
    if (phoneNumbers.length > 0 && !callerId) {
      const firstNum = phoneNumbers[0] as any
      setCallerId(firstNum.phone_number || firstNum.number || firstNum.friendly_name || '')
    }
  }, [phoneNumbers, callerId])

  useEffect(() => {
    if (agents.length > 0 && !selectedAgentId) {
      setSelectedAgentId(agents[0].id || agents[0]._id || '')
    }
  }, [agents, selectedAgentId])

  // Timer Effect
  useEffect(() => {
    if (callState === 'connected') {
      timerRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1)
      }, 1000)
    } else {
      if (timerRef.current) clearInterval(timerRef.current)
      if (callState === 'idle') setCallDuration(0)
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [callState])

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleKeyPress = (num: string) => {
    setDialNumber((prev) => prev + num)
  }

  const handleDeleteDigit = () => {
    setDialNumber((prev) => prev.slice(0, -1))
  }

  const handleStartCall = async () => {
    if (!dialNumber.trim()) {
      toast.error('Please enter a destination phone number')
      return
    }
    if (!callerId) {
      toast.error('Please select an outbound Caller ID phone number')
      return
    }
    if (!isConnectedToDialer) {
      toast.error('Please connect to the dialer engine first')
      return
    }

    setCallState('calling')
    toast.info(`Initiating real call to ${dialNumber}...`)

    try {
      const res = await placeCall({
        phoneNumber: dialNumber,
        fromNumber: callerId,
        agentId: selectedAgentId || undefined,
        flowId: ''
      }).unwrap()

      setCallState('connected')
      toast.success(res?.message || 'Call Connected successfully!')
    } catch (err: any) {
      console.error('Place call error:', err)
      setCallState('idle')
      toast.error(err?.data?.message || err?.message || 'Failed to place call. Please check carrier credentials.')
    }
  }

  const handleEndCall = () => {
    setCallState('idle')
    setIsMuted(false)
    setIsRecording(false)
    toast.info('Call ended')
  }

  const toggleHold = () => {
    if (callState === 'connected') {
      setCallState('on_hold')
      toast.warning('Call placed on hold')
    } else if (callState === 'on_hold') {
      setCallState('connected')
      toast.success('Call resumed')
    }
  }

  const filteredLogs = callLogs.filter((log: any) =>
    (log.to_number || '').includes(activitySearch) || (log.from_number || '').includes(activitySearch)
  )

  const keypad = [
    { num: '1', sub: '' },
    { num: '2', sub: 'ABC' },
    { num: '3', sub: 'DEF' },
    { num: '4', sub: 'GHI' },
    { num: '5', sub: 'JKL' },
    { num: '6', sub: 'MNO' },
    { num: '7', sub: 'PQRS' },
    { num: '8', sub: 'TUV' },
    { num: '9', sub: 'WXYZ' },
    { num: '*', sub: '' },
    { num: '0', sub: '+' },
    { num: '#', sub: '' }
  ]

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-2 sm:p-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card/60 backdrop-blur-xl p-6 rounded-3xl border border-border shadow-xl">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20 text-primary">
            <PhoneCall className="w-8 h-8 animate-pulse" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              Virtual Softphone & AI Dialer
              <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 font-semibold">
                WebRTC Active
              </Badge>
            </h2>
            <p className="text-sm text-muted-foreground">
              Make & receive live calls, sync Carrier Caller IDs, and connect AI Agents in real-time.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Badge
            variant={isConnectedToDialer ? 'default' : 'destructive'}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl"
          >
            <Signal className="w-3.5 h-3.5" />
            {isConnectedToDialer ? 'Dialer Engine Connected' : 'Disconnected'}
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsConnectedToDialer(!isConnectedToDialer)}
            className="rounded-xl gap-2 hover:bg-accent"
          >
            <RefreshCw className="w-4 h-4" />
            Reconnect SIP
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Softphone Console */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="border-border shadow-2xl rounded-3xl bg-card/80 backdrop-blur-xl overflow-hidden">
            <CardHeader className="border-b border-border/50 pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Radio className="w-5 h-5 text-primary" />
                  Live Calling Console
                </CardTitle>

                {callState !== 'idle' && (
                  <Badge variant="secondary" className="animate-pulse bg-primary/10 text-primary border-primary/20">
                    {callState === 'calling' && 'Dialing Out...'}
                    {callState === 'connected' && `In Call • ${formatDuration(callDuration)}`}
                    {callState === 'on_hold' && 'Call On Hold'}
                  </Badge>
                )}
              </div>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
              {/* Outbound Settings Panel */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    Caller ID (From Number)
                  </label>
                  <Select value={callerId} onValueChange={setCallerId}>
                    <SelectTrigger className="rounded-xl border-border bg-background">
                      <SelectValue placeholder="Select Caller ID" />
                    </SelectTrigger>
                    <SelectContent>
                      {phoneNumbers.length > 0 ? (
                        phoneNumbers.map((num: any) => (
                          <SelectItem key={num.id || num._id} value={num.phone_number || num.number}>
                            {num.phone_number || num.number} ({num.friendly_name || num.provider || 'Carrier'})
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="demo">+1 (800) 555-0199 (Demo Carrier)</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                    <Bot className="w-4 h-4 text-primary" />
                    Connect AI Assistant (Voice)
                  </label>
                  <Select value={selectedAgentId} onValueChange={setSelectedAgentId}>
                    <SelectTrigger className="rounded-xl border-border bg-background">
                      <SelectValue placeholder="Select AI Agent" />
                    </SelectTrigger>
                    <SelectContent>
                      {agents.length > 0 ? (
                        agents.map((agent: any) => (
                          <SelectItem key={agent.id || agent._id} value={agent.id || agent._id}>
                            {agent.name} ({agent.voice || 'ElevenLabs Voice'})
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="none">No Agent Selected</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Number Display & Input */}
              <div className="relative">
                <Input
                  type="text"
                  value={dialNumber}
                  onChange={(e) => setDialNumber(e.target.value)}
                  placeholder="Enter phone number (+1...)"
                  className="text-center text-2xl font-bold tracking-wider py-7 rounded-2xl border-2 border-primary/20 bg-background/50 focus:border-primary shadow-inner"
                />
                {dialNumber && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleDeleteDigit}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <Delete className="w-5 h-5" />
                  </Button>
                )}
              </div>

              {/* Call Screen Visualizer when active */}
              {callState !== 'idle' ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-slate-950 text-white rounded-3xl p-6 space-y-6 border border-slate-800 shadow-2xl relative overflow-hidden"
                >
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-primary font-bold text-xl">
                        <User className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-slate-100">{dialNumber}</h4>
                        <p className="text-xs text-slate-400">Via Caller ID: {callerId}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-mono font-bold text-emerald-400">{formatDuration(callDuration)}</p>
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">WebRTC Stream</p>
                    </div>
                  </div>

                  {/* Audio Waveform Graphic */}
                  <div className="h-16 flex items-center justify-center gap-1.5 px-4 bg-slate-900/60 rounded-2xl border border-slate-800/80">
                    {[40, 70, 30, 90, 60, 100, 50, 80, 45, 95, 30, 70, 50, 85, 40].map((h, i) => (
                      <motion.div
                        key={i}
                        animate={{ height: isMuted ? '6px' : [`${h * 0.3}%`, `${h}%`, `${h * 0.4}%`] }}
                        transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.08 }}
                        className={`w-1.5 rounded-full ${isMuted ? 'bg-slate-700' : 'bg-primary'}`}
                      />
                    ))}
                  </div>

                  {/* In-Call Action Bar */}
                  <div className="grid grid-cols-4 gap-3 pt-2">
                    <Button
                      variant={isMuted ? 'destructive' : 'secondary'}
                      onClick={() => setIsMuted(!isMuted)}
                      className="rounded-2xl flex flex-col items-center py-6 h-auto gap-1"
                    >
                      {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                      <span className="text-[11px] font-medium">{isMuted ? 'Muted' : 'Mute'}</span>
                    </Button>

                    <Button
                      variant={callState === 'on_hold' ? 'warning' as any : 'secondary'}
                      onClick={toggleHold}
                      className="rounded-2xl flex flex-col items-center py-6 h-auto gap-1"
                    >
                      {callState === 'on_hold' ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
                      <span className="text-[11px] font-medium">{callState === 'on_hold' ? 'Resume' : 'Hold'}</span>
                    </Button>

                    <Button
                      variant={isSpeakerOn ? 'default' : 'secondary'}
                      onClick={() => setIsSpeakerOn(!isSpeakerOn)}
                      className="rounded-2xl flex flex-col items-center py-6 h-auto gap-1"
                    >
                      {isSpeakerOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                      <span className="text-[11px] font-medium">Speaker</span>
                    </Button>

                    <Button
                      variant={isRecording ? 'destructive' : 'secondary'}
                      onClick={() => setIsRecording(!isRecording)}
                      className="rounded-2xl flex flex-col items-center py-6 h-auto gap-1"
                    >
                      <Activity className={`w-5 h-5 ${isRecording ? 'animate-spin' : ''}`} />
                      <span className="text-[11px] font-medium">{isRecording ? 'REC On' : 'Record'}</span>
                    </Button>
                  </div>

                  <Button
                    variant="destructive"
                    size="lg"
                    onClick={handleEndCall}
                    className="w-full py-7 rounded-2xl font-bold text-lg shadow-lg shadow-rose-500/20 gap-2"
                  >
                    <PhoneOff className="w-6 h-6" />
                    End Call
                  </Button>
                </motion.div>
              ) : (
                <>
                  {/* Keypad Grid */}
                  <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
                    {keypad.map((item) => (
                      <Button
                        key={item.num}
                        variant="outline"
                        onClick={() => handleKeyPress(item.num)}
                        className="h-16 rounded-2xl border-border/60 hover:border-primary hover:bg-primary/5 flex flex-col items-center justify-center p-0 transition-all active:scale-95 shadow-sm"
                      >
                        <span className="text-xl font-bold text-foreground">{item.num}</span>
                        {item.sub && <span className="text-[9px] text-muted-foreground font-semibold">{item.sub}</span>}
                      </Button>
                    ))}
                  </div>

                  {/* Start Call Button */}
                  <Button
                    onClick={handleStartCall}
                    disabled={isPlacingCall}
                    className="w-full py-7 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-lg shadow-xl shadow-emerald-500/20 gap-2"
                  >
                    <Phone className="w-6 h-6 fill-current animate-bounce" />
                    {isPlacingCall ? 'Placing Outbound Call...' : 'Start Call'}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Call Activity & Live Logs */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-border shadow-xl rounded-3xl bg-card/80 backdrop-blur-xl">
            <CardHeader className="pb-3 border-b border-border/50">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Call Activity & History
                </CardTitle>
                <Badge variant="outline" className="text-xs">
                  Live Sync
                </Badge>
              </div>
              <CardDescription>Recent outbound & inbound calls logged in your account</CardDescription>

              <div className="relative pt-2">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Filter by phone number..."
                  value={activitySearch}
                  onChange={(e) => setActivitySearch(e.target.value)}
                  className="pl-9 text-xs rounded-xl bg-background border-border"
                />
              </div>
            </CardHeader>

            <CardContent className="p-4">
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {filteredLogs.length > 0 ? (
                  filteredLogs.map((log: any) => (
                    <div
                      key={log._id || log.id}
                      className="p-3.5 rounded-2xl border border-border/60 bg-background/50 hover:bg-accent/40 transition-all flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                            log.direction === 'inbound'
                              ? 'bg-emerald-500/10 text-emerald-500'
                              : 'bg-blue-500/10 text-blue-500'
                          }`}
                        >
                          {log.direction === 'inbound' ? (
                            <ArrowDownLeft className="w-5 h-5" />
                          ) : (
                            <ArrowUpRight className="w-5 h-5" />
                          )}
                        </div>

                        <div>
                          <p className="text-xs font-bold text-foreground">
                            {log.to_number || log.phoneNumber || 'Unknown'}
                          </p>
                          <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                            From: {log.from_number || 'Caller ID'}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <Badge
                          variant="outline"
                          className={`text-[10px] uppercase tracking-wider font-semibold ${
                            log.status === 'completed'
                              ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                              : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                          }`}
                        >
                          {log.status || 'Initiated'}
                        </Badge>
                        <p className="text-[10px] text-muted-foreground mt-1">
                          {log.created_at ? new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-muted-foreground text-xs space-y-2">
                    <PhoneForwarded className="w-8 h-8 mx-auto text-muted-foreground/40" />
                    <p>No recent call activity found.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
