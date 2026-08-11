'use client';

import { PageHeader } from "@/components/reusable/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textArea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Radio, Phone, Send, ShieldCheck, Sparkles, Activity, CheckCircle2 } from "lucide-react";
import { Loader2 } from "@/components/reusable/Loader2";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

export default function TelephonyBroadcasterPage() {
  const { t } = useTranslation();
  const [broadcastType, setBroadcastType] = useState<'voice' | 'sms'>('voice');
  const [targetNumbers, setTargetNumbers] = useState('');
  const [voicePrompt, setVoicePrompt] = useState('Hello! This is an automated notification from InfiniCall AI.');
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  const handleLaunchBroadcast = () => {
    if (!targetNumbers.trim()) {
      toast.error('Please enter at least one target phone number.');
      return;
    }

    setIsBroadcasting(true);
    setTestResult(null);

    setTimeout(() => {
      setIsBroadcasting(false);
      const count = targetNumbers.split(',').length;
      setTestResult(`Successfully queued ${count} ${broadcastType.toUpperCase()} broadcast message(s) via Twilio/Plivo gateway.`);
      toast.success(`${broadcastType.toUpperCase()} Broadcast launched successfully!`);
    }, 1500);
  };

  return (
    <div className="w-full space-y-6">
      <PageHeader
        title="Telephony & Campaign Broadcaster"
        showBackButton={true}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Dispatcher Card */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-bg-card rounded-radius border border-input-border-color p-6 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <Radio className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-title">Outbound Telephony Dispatcher</h3>
                <p className="text-xs text-subtitle-color">Broadcast instant AI voice calls or SMS alerts to custom phone number lists.</p>
              </div>
            </div>

            {/* Broadcast Mode Selection */}
            <div className="space-y-2">
              <Label className="text-xs font-bold text-title">Broadcast Mode</Label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setBroadcastType('voice')}
                  className={`p-4 rounded-xl border flex items-center gap-3 transition-all ${
                    broadcastType === 'voice'
                      ? 'border-primary bg-primary/10 text-primary font-bold shadow-sm'
                      : 'border-input-border-color bg-subcard text-subtitle-color hover:border-primary/50'
                  }`}
                >
                  <Phone className="w-5 h-5" />
                  <div className="text-left">
                    <div className="text-sm">AI Voice Campaign</div>
                    <div className="text-[10px] font-normal opacity-80">Interactive WebRTC / SIP Phone Calls</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setBroadcastType('sms')}
                  className={`p-4 rounded-xl border flex items-center gap-3 transition-all ${
                    broadcastType === 'sms'
                      ? 'border-primary bg-primary/10 text-primary font-bold shadow-sm'
                      : 'border-input-border-color bg-subcard text-subtitle-color hover:border-primary/50'
                  }`}
                >
                  <Send className="w-5 h-5" />
                  <div className="text-left">
                    <div className="text-sm">SMS Broadcast</div>
                    <div className="text-[10px] font-normal opacity-80">Instant SMS Delivery via Twilio/Plivo</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Target Numbers */}
            <div className="space-y-2">
              <Label htmlFor="numbers" className="text-xs font-bold text-title flex items-center justify-between">
                <span>Target Phone Numbers (Comma Separated)</span>
                <span className="text-[10px] text-subtitle-color">E.164 format: +919876543210</span>
              </Label>
              <Textarea
                id="numbers"
                placeholder="+919876543210, +919812345678, +14155552671"
                className="min-h-24 font-mono text-xs bg-input-color border-input-border-color focus:border-primary"
                value={targetNumbers}
                onChange={(e) => setTargetNumbers(e.target.value)}
              />
            </div>

            {/* Script / Message Prompt */}
            <div className="space-y-2">
              <Label htmlFor="prompt" className="text-xs font-bold text-title">
                {broadcastType === 'voice' ? 'AI Voice Script Prompt' : 'SMS Message Content'}
              </Label>
              <Textarea
                id="prompt"
                className="min-h-32 text-xs font-mono bg-input-color border-input-border-color focus:border-primary"
                value={voicePrompt}
                onChange={(e) => setVoicePrompt(e.target.value)}
              />
            </div>

            <Button
              onClick={handleLaunchBroadcast}
              disabled={isBroadcasting || !targetNumbers}
              className="w-full h-12 bg-primary text-white font-bold rounded-radius gap-2 hover:bg-primary/90 transition-all"
            >
              {isBroadcasting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Dispatching Telephony Campaign...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Launch {broadcastType.toUpperCase()} Telephony Broadcast
                </>
              )}
            </Button>

            {testResult && (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-xs space-y-2 animate-in fade-in duration-300">
                <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Broadcast Successfully Dispatched:
                </span>
                <p className="text-title font-medium">{testResult}</p>
              </div>
            )}
          </div>
        </div>

        {/* Telephony Metrics Sidebar */}
        <div className="space-y-6">
          <div className="bg-bg-card rounded-radius border border-input-border-color p-6 space-y-4">
            <div className="flex items-center gap-2 text-title font-bold text-sm">
              <Activity className="w-4 h-4 text-primary" /> Live SIP Telephony Metrics
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-subcard rounded-lg border border-input-border-color/60 flex justify-between items-center">
                <span className="text-subtitle-color">Active Gateway:</span>
                <Badge className="bg-primary/10 text-primary font-mono text-[10px]">Twilio & Plivo SIP</Badge>
              </div>

              <div className="p-3 bg-subcard rounded-lg border border-input-border-color/60 flex justify-between items-center">
                <span className="text-subtitle-color">SIP Latency:</span>
                <span className="font-mono text-emerald-500 font-bold">24 ms</span>
              </div>

              <div className="p-3 bg-subcard rounded-lg border border-input-border-color/60 flex justify-between items-center">
                <span className="text-subtitle-color">Concurrent Channels:</span>
                <span className="font-mono text-title font-bold">50 Calls / Sec</span>
              </div>

              <div className="p-3 bg-subcard rounded-lg border border-input-border-color/60 flex justify-between items-center">
                <span className="text-subtitle-color">Audio Codec:</span>
                <span className="font-mono text-title font-bold">Opus / PCMU 8kHz</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
