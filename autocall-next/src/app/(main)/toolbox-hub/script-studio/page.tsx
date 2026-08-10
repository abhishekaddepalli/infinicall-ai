'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/components/reusable/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useGenerateAiScriptMutation } from '@/redux/api/automationApi';
import { Bot, Sparkles, Copy, Check, MessageSquare, ShieldAlert, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function ScriptStudioPage() {
  const router = useRouter();
  const [businessName, setBusinessName] = useState('');
  const [businessDomain, setBusinessDomain] = useState('Real Estate');
  const [targetAudience, setTargetAudience] = useState('Home Buyers & Investors');
  const [callGoal, setCallGoal] = useState('Schedule a 10-minute site visit demonstration');
  const [tone, setTone] = useState('Professional & Friendly');

  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [generatedScript, setGeneratedScript] = useState<any>(null);

  const [generateScript, { isLoading }] = useGenerateAiScriptMutation();

  const handleGenerate = async () => {
    if (!businessName || !callGoal) {
      toast.error('Please enter Business Name and Call Goal');
      return;
    }

    try {
      const res = await generateScript({
        business_name: businessName,
        business_domain: businessDomain,
        target_audience: targetAudience,
        call_goal: callGoal,
        tone: tone,
      }).unwrap();

      if (res.data) {
        setGeneratedScript(res.data);
        toast.success('AI System Prompt & Script generated successfully!');
      }
    } catch (err: any) {
      console.error('Generation Error:', err);
      toast.error(err?.data?.message || 'Failed to generate AI script');
    }
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto">
      <PageHeader
        title="AI System Prompt & Script Studio"
        showBackButton={true}
        onBack={() => router.push('/toolbox-hub')}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Input Form */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="bg-bg-card border border-input-border-color shadow-sm rounded-radius">
            <CardHeader className="border-b border-input-border-color/50 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-title">Business Inputs</CardTitle>
                  <CardDescription className="text-xs text-subtitle-color">
                    Describe your campaign to generate prompts & objection handlers
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-title">Business / Product Name *</label>
                <Input
                  placeholder="e.g. InfiniRealEstate"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-title">Industry Domain</label>
                <Input
                  placeholder="e.g. Real Estate / Healthcare / SaaS"
                  value={businessDomain}
                  onChange={(e) => setBusinessDomain(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-title">Target Audience</label>
                <Input
                  placeholder="e.g. First-time Home Buyers in Mumbai"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-title">Call Goal *</label>
                <Textarea
                  rows={2}
                  placeholder="e.g. Book a site visit and offer a 5% discount"
                  value={callGoal}
                  onChange={(e) => setCallGoal(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-title">Tone of Voice</label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full p-2.5 bg-background border border-input-border-color rounded-lg text-xs font-medium text-title focus:ring-1 focus:ring-primary"
                >
                  <option value="Professional & Friendly">Professional & Friendly</option>
                  <option value="Energetic & Persuasive">Energetic & Persuasive (Sales)</option>
                  <option value="Empathetic & Supportive">Empathetic & Supportive (Healthcare/Support)</option>
                  <option value="Direct & Formal">Direct & Formal (Corporate/Legal)</option>
                </select>
              </div>

              <Button
                onClick={handleGenerate}
                disabled={isLoading}
                className="w-full h-11 bg-primary text-white font-bold rounded-radius gap-2 shadow-md hover:bg-primary/90 transition-all mt-2"
              >
                <Sparkles className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                {isLoading ? 'Generating AI Prompt...' : 'Generate AI Calling Script'}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Output Display */}
        <div className="lg:col-span-7 space-y-6">
          {generatedScript ? (
            <div className="space-y-5">
              {/* System Prompt Box */}
              <Card className="bg-bg-card border border-input-border-color shadow-sm rounded-radius overflow-hidden">
                <CardHeader className="bg-subcard border-b border-input-border-color/50 py-3.5 px-5 flex flex-row items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bot className="w-4 h-4 text-primary" />
                    <CardTitle className="text-sm font-bold text-title">System Prompt (AI Agent Persona)</CardTitle>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopy(generatedScript.system_prompt, 'prompt')}
                    className="h-8 gap-1.5 text-xs font-bold text-primary"
                  >
                    {copiedKey === 'prompt' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedKey === 'prompt' ? 'Copied' : 'Copy Prompt'}
                  </Button>
                </CardHeader>
                <CardContent className="p-5">
                  <pre className="whitespace-pre-wrap font-sans text-xs text-title leading-relaxed bg-subcard/50 p-4 rounded-lg border border-input-border-color/40">
                    {generatedScript.system_prompt}
                  </pre>
                </CardContent>
              </Card>

              {/* Initial Greeting Box */}
              <Card className="bg-bg-card border border-input-border-color shadow-sm rounded-radius overflow-hidden">
                <CardHeader className="bg-subcard border-b border-input-border-color/50 py-3 px-5 flex flex-row items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-primary" />
                    <CardTitle className="text-sm font-bold text-title">Initial Greeting Line</CardTitle>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopy(generatedScript.initial_greeting, 'greeting')}
                    className="h-8 gap-1.5 text-xs font-bold text-primary"
                  >
                    {copiedKey === 'greeting' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedKey === 'greeting' ? 'Copied' : 'Copy'}
                  </Button>
                </CardHeader>
                <CardContent className="p-4 text-xs font-semibold text-title">
                  "{generatedScript.initial_greeting}"
                </CardContent>
              </Card>

              {/* Objection Handlers */}
              <Card className="bg-bg-card border border-input-border-color shadow-sm rounded-radius overflow-hidden">
                <CardHeader className="bg-subcard border-b border-input-border-color/50 py-3 px-5">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-amber-500" />
                    <CardTitle className="text-sm font-bold text-title">Objection Handling Strategies</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-4 space-y-3">
                  {generatedScript.objection_handling?.map((item: any, idx: number) => (
                    <div key={idx} className="p-3 bg-subcard rounded-lg border border-input-border-color/40 space-y-1">
                      <p className="text-xs font-bold text-amber-600 dark:text-amber-400">❓ Customer: "{item.objection}"</p>
                      <p className="text-xs text-title font-medium">💬 AI Response: "{item.response}"</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="bg-bg-card border border-input-border-color shadow-sm rounded-radius p-16 flex flex-col items-center justify-center text-center">
              <Sparkles className="w-14 h-14 text-primary/30 mb-4" />
              <h3 className="text-lg font-bold text-title">Ready to Generate AI Script</h3>
              <p className="text-xs text-subtitle-color max-w-sm mt-1">
                Fill in your business details on the left and click "Generate AI Calling Script" to generate high-converting system prompts.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
