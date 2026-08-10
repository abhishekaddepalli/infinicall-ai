'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/components/reusable/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useTestN8nWebhookMutation } from '@/redux/api/automationApi';
import { Cpu, Send, CheckCircle2, AlertCircle, ArrowLeft, Code, Sparkles, Layers } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function N8nAutomationPage() {
  const router = useRouter();
  const [webhookUrl, setWebhookUrl] = useState('');
  const [eventType, setEventType] = useState('call.completed');
  const [testResult, setTestResult] = useState<any>(null);

  const [testWebhook, { isLoading }] = useTestN8nWebhookMutation();

  const handleTestTrigger = async () => {
    if (!webhookUrl) {
      toast.error('Please enter your n8n or Zapier Webhook URL');
      return;
    }

    try {
      const res = await testWebhook({
        webhook_url: webhookUrl,
        event_type: eventType,
      }).unwrap();

      setTestResult(res);
      toast.success(res.message || 'n8n Webhook triggered successfully!');
    } catch (err: any) {
      console.error('Webhook Error:', err);
      const errMsg = err?.data?.message || err?.message || 'Failed to trigger webhook';
      toast.error(errMsg);
      setTestResult({
        success: false,
        message: errMsg,
        status_code: err?.status || 500,
        response_data: err?.data || {},
      });
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto">
      <PageHeader
        title="n8n & Zapier Automation Connector"
        showBackButton={true}
        onBack={() => router.push('/toolbox-hub')}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form Setup */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="bg-bg-card border border-input-border-color shadow-sm rounded-radius overflow-hidden">
            <CardHeader className="border-b border-input-border-color/50 pb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-title">Configure n8n Webhook</CardTitle>
                  <CardDescription className="text-sm text-subtitle-color">
                    Enter your n8n Webhook Node URL to receive real-time call payloads
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-bold text-title">n8n / Zapier / Make Webhook URL</label>
                <div className="relative">
                  <Input
                    placeholder="https://n8n.your-domain.com/webhook/c8293-call-event"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    className="font-mono text-xs pr-10"
                  />
                  <Code className="w-4 h-4 text-muted-foreground absolute right-3 top-3" />
                </div>
                <p className="text-xs text-subtitle-color">
                  Paste the Webhook URL copied from your n8n <code>Webhook Trigger Node</code>.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-title">Event Trigger Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'call.completed', label: 'Call Completed' },
                    { id: 'appointment.booked', label: 'Appointment Booked' },
                    { id: 'lead.qualified', label: 'Hot Lead Qualified' },
                    { id: 'payment.link_created', label: 'UPI Payment Link Sent' },
                  ].map((evt) => (
                    <button
                      key={evt.id}
                      type="button"
                      onClick={() => setEventType(evt.id)}
                      className={`p-3 rounded-lg border text-left text-xs font-semibold transition-all ${
                        eventType === evt.id
                          ? 'border-primary bg-primary/10 text-primary shadow-sm'
                          : 'border-input-border-color bg-subcard text-subtitle-color hover:border-primary/40'
                      }`}
                    >
                      {evt.label}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                onClick={handleTestTrigger}
                disabled={isLoading}
                className="w-full h-12 bg-primary text-white font-bold rounded-radius gap-2 shadow-md hover:bg-primary/90 transition-all"
              >
                <Send className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                {isLoading ? 'Triggering n8n Workflow...' : 'Test n8n Webhook Trigger'}
              </Button>
            </CardContent>
          </Card>

          {/* Quick Guide Box */}
          <Card className="bg-subcard border border-input-border-color rounded-radius p-5">
            <h4 className="text-sm font-bold text-title flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-primary" />
              How n8n Integration Works
            </h4>
            <ol className="text-xs text-subtitle-color space-y-1.5 list-decimal pl-4">
              <li>In your n8n instance, add a <strong>Webhook Trigger Node</strong> and select <code>HTTP Method: POST</code>.</li>
              <li>Paste the test Webhook URL above and click <strong>Test n8n Webhook Trigger</strong>.</li>
              <li>Your n8n canvas will instantly receive the live JSON payload containing call audio, customer phone, AI summary, and sentiment score!</li>
            </ol>
          </Card>
        </div>

        {/* Right Column: Live Result & JSON Debugger */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="bg-bg-card border border-input-border-color shadow-sm rounded-radius h-full flex flex-col">
            <CardHeader className="border-b border-input-border-color/50 pb-4 flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-primary" />
                <CardTitle className="text-md font-bold text-title">Response Debugger</CardTitle>
              </div>
              {testResult && (
                <Badge variant={testResult.success ? 'default' : 'destructive'} className="font-mono text-xs">
                  HTTP {testResult.status_code || 200}
                </Badge>
              )}
            </CardHeader>
            <CardContent className="p-5 flex-1 flex flex-col justify-between">
              {testResult ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm font-bold">
                    {testResult.success ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-rose-500" />
                    )}
                    <span className={testResult.success ? 'text-emerald-500' : 'text-rose-500'}>
                      {testResult.message}
                    </span>
                  </div>

                  {testResult.response_time_ms && (
                    <p className="text-xs text-subtitle-color font-medium">
                      Response Time: <span className="font-mono font-bold text-title">{testResult.response_time_ms} ms</span>
                    </p>
                  )}

                  <div className="space-y-1">
                    <span className="text-xs font-bold text-subtitle-color">Payload / Response Output:</span>
                    <pre className="p-3 bg-black/90 text-emerald-400 font-mono text-[11px] rounded-lg overflow-x-auto max-h-[350px] border border-white/10">
                      {JSON.stringify(testResult.response_data || testResult, null, 2)}
                    </pre>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center py-16 text-muted-foreground">
                  <Code className="w-12 h-12 text-primary/30 mb-3" />
                  <p className="text-sm font-medium text-title">No Trigger Sent Yet</p>
                  <p className="text-xs text-subtitle-color max-w-xs mt-1">
                    Enter your n8n Webhook URL on the left and click test to see live HTTP response details.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
