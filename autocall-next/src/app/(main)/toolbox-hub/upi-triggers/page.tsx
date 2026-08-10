'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/components/reusable/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useSendPostCallUpiMutation } from '@/redux/api/automationApi';
import { IndianRupee, Send, QrCode, Copy, Check, MessageSquare, ShieldCheck, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function UpiTriggersPage() {
  const router = useRouter();
  const [customerName, setCustomerName] = useState('Rahul Sharma');
  const [customerPhone, setCustomerPhone] = useState('+919876543210');
  const [planName, setPlanName] = useState('Pro Scale Plan');
  const [amount, setAmount] = useState('999');

  const [copied, setCopied] = useState(false);
  const [upiResult, setUpiResult] = useState<any>(null);

  const [sendPostCallUpi, { isLoading }] = useSendPostCallUpiMutation();

  const handleGenerate = async () => {
    if (!customerPhone || !amount) {
      toast.error('Please enter customer phone and amount');
      return;
    }

    try {
      const res = await sendPostCallUpi({
        customer_name: customerName,
        customer_phone: customerPhone,
        plan_name: planName,
        amount: Number(amount),
        currency: 'INR',
      }).unwrap();

      if (res.data) {
        setUpiResult(res.data);
        toast.success(res.message || 'UPI Payment link generated!');
      }
    } catch (err: any) {
      console.error('UPI Link Error:', err);
      toast.error(err?.data?.message || 'Failed to generate UPI payment link');
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Payment URL copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto">
      <PageHeader
        title="Post-Call Instant UPI Payment Link Engine"
        showBackButton={true}
        onBack={() => router.push('/toolbox-hub')}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="bg-bg-card border border-input-border-color shadow-sm rounded-radius">
            <CardHeader className="border-b border-input-border-color/50 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <IndianRupee className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-title">UPI Payment Trigger</CardTitle>
                  <CardDescription className="text-xs text-subtitle-color">
                    Generate & dispatch post-call UPI payment links in Indian Rupees (₹)
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-title">Customer Name</label>
                <Input
                  placeholder="e.g. Rahul Sharma"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-title">Customer Phone Number *</label>
                <Input
                  placeholder="e.g. +919876543210"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-title">Product / Plan Name</label>
                <Input
                  placeholder="e.g. Pro Scale Plan"
                  value={planName}
                  onChange={(e) => setPlanName(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-title">Amount (₹ INR) *</label>
                <div className="relative">
                  <Input
                    type="number"
                    placeholder="999"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="pl-8 font-bold text-title"
                  />
                  <span className="absolute left-3 top-2.5 text-xs font-bold text-title">₹</span>
                </div>
              </div>

              <Button
                onClick={handleGenerate}
                disabled={isLoading}
                className="w-full h-12 bg-primary text-white font-bold rounded-radius gap-2 shadow-md hover:bg-primary/90 transition-all mt-2"
              >
                <Send className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                {isLoading ? 'Generating UPI Link...' : 'Generate & Send Post-Call UPI Link'}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: QR Code & Link Output */}
        <div className="lg:col-span-7 space-y-6">
          {upiResult ? (
            <Card className="bg-bg-card border border-input-border-color shadow-sm rounded-radius overflow-hidden space-y-6 p-6">
              <div className="flex items-center justify-between border-b border-input-border-color/50 pb-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-500" />
                  <span className="text-md font-bold text-title">UPI Payment Link Generated</span>
                </div>
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 uppercase text-[10px] font-bold">
                  Active Link
                </Badge>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-6 bg-subcard p-5 rounded-radius border border-input-border-color/50">
                {/* QR Code */}
                <div className="w-36 h-36 bg-white p-2 rounded-lg border border-input-border-color shadow-sm shrink-0 flex items-center justify-center">
                  <img
                    src={upiResult.qr_code_url}
                    alt="UPI Payment QR Code"
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="space-y-2 flex-1">
                  <p className="text-xs font-bold text-subtitle-color uppercase tracking-wider">Amount Payable</p>
                  <p className="text-3xl font-extrabold text-title">₹{upiResult.amount}</p>
                  <p className="text-xs text-subtitle-color">Product: <span className="font-bold text-title">{upiResult.plan_name || planName}</span></p>

                  <div className="pt-2 flex items-center gap-2">
                    <Input
                      readOnly
                      value={upiResult.upi_payment_url}
                      className="font-mono text-xs text-primary"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopy(upiResult.upi_payment_url)}
                      className="shrink-0 h-10 px-3 font-bold gap-1 text-xs"
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                      {copied ? 'Copied' : 'Copy'}
                    </Button>
                  </div>
                </div>
              </div>

              {/* SMS Preview Box */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-subtitle-color flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-primary" />
                  Automated Post-Call SMS Delivered to {upiResult.customer_phone}
                </span>
                <p className="p-4 bg-subcard/80 border border-input-border-color text-xs text-title font-medium rounded-lg leading-relaxed">
                  "{upiResult.sms_preview}"
                </p>
              </div>
            </Card>
          ) : (
            <Card className="bg-bg-card border border-input-border-color shadow-sm rounded-radius p-16 flex flex-col items-center justify-center text-center">
              <QrCode className="w-14 h-14 text-primary/30 mb-4" />
              <h3 className="text-lg font-bold text-title">Post-Call UPI Engine Ready</h3>
              <p className="text-xs text-subtitle-color max-w-sm mt-1">
                Enter customer phone and payment amount on the left to generate instant UPI payment links and SMS triggers.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
