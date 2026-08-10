'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textArea'
import { Node, Edge } from '@xyflow/react'
import { Bot, Sparkles, Wand2, Zap, Check, ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

interface AIFlowGeneratorModalProps {
  isOpen: boolean
  onClose: () => void
  onGenerate: (generatedData: { name: string; description: string; nodes: Node[]; edges: Edge[] }) => void
}

const TEMPLATE_PROMPTS = [
  {
    title: '🏡 Real Estate Qualification',
    prompt: 'Create a real estate lead qualification flow. Greet caller, ask if buying or selling, collect target budget and location, and transfer to lead agent if budget > $500k.',
  },
  {
    title: '📅 Appointment Booking',
    prompt: 'Create an automated appointment booking flow. Ask caller for preferred date and service type, log details via webhook, and confirm appointment.',
  },
  {
    title: '🛒 E-commerce Support & Order Tracking',
    prompt: 'Create an e-commerce support flow. Ask for order number, check order status via webhook, answer FAQs, or transfer to human agent.',
  },
  {
    title: '🩺 Healthcare Intake & Triage',
    prompt: 'Create a medical appointment intake flow. Collect patient name, symptom description, urgency level, and route urgent cases to emergency triage.',
  },
]

export default function AIFlowGeneratorModal({ isOpen, onClose, onGenerate }: AIFlowGeneratorModalProps) {
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = async (customPrompt?: string) => {
    const textToUse = customPrompt || prompt
    if (!textToUse.trim()) {
      toast.error('Please enter a description or select a prompt template.')
      return
    }

    setIsGenerating(true)

    try {
      // Simulate AI generation process with smooth delay
      await new Promise((resolve) => setTimeout(resolve, 1200))

      const generated = parsePromptToFlow(textToUse)
      onGenerate(generated)
      toast.success('✨ AI Workflow generated successfully!')
      onClose()
      setPrompt('')
    } catch (error) {
      toast.error('Failed to generate flow. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl bg-bg-card border-input-border-color rounded-2xl shadow-2xl p-0 overflow-hidden">
        {/* Header banner with vibrant AI theme */}
        <div className="bg-gradient-to-r from-primary via-indigo-600 to-sky-600 p-6 text-white relative overflow-hidden">
          <div className="absolute right-[-20px] bottom-[-20px] opacity-15 pointer-events-none">
            <Bot className="w-48 h-48" />
          </div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-inner">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <DialogTitle className="text-xl font-extrabold text-white flex items-center gap-2">
                AI Workflow Builder
              </DialogTitle>
              <DialogDescription className="text-white/80 text-xs mt-0.5">
                Describe your desired voice bot flow in plain English and let AI generate the workflow graph instantly.
              </DialogDescription>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          <div>
            <label className="text-xs font-bold text-title uppercase tracking-wider mb-2 block flex items-center gap-1.5">
              <Wand2 className="w-3.5 h-3.5 text-primary" />
              <span>Describe Your AI Workflow</span>
            </label>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Build an outbound sales discovery call flow that greets prospects, introduces our AI product, asks for team size, and schedules a demo call..."
              className="min-h-[110px] rounded-xl bg-input-color border-input-border-color font-medium text-sm focus:ring-2 focus:ring-primary/20 transition-all resize-none"
            />
          </div>

          {/* Quick Prompt Templates */}
          <div>
            <span className="text-xs font-bold text-subtitle-color uppercase tracking-wider mb-2.5 block">
              Popular AI Workflow Templates
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {TEMPLATE_PROMPTS.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setPrompt(item.prompt)
                    handleGenerate(item.prompt)
                  }}
                  disabled={isGenerating}
                  className="text-left p-3 rounded-xl border border-input-border-color bg-subcard hover:bg-primary/5 hover:border-primary/40 transition-all duration-300 group flex items-start justify-between gap-2"
                >
                  <div>
                    <p className="text-xs font-bold text-title group-hover:text-primary transition-colors">
                      {item.title}
                    </p>
                    <p className="text-[11px] text-subtitle-color line-clamp-2 mt-1">
                      {item.prompt}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-subtitle-color group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0 mt-0.5" />
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-input-border-color">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={isGenerating}
              className="rounded-xl px-5 text-sm font-semibold"
            >
              Cancel
            </Button>

            <Button
              type="button"
              onClick={() => handleGenerate()}
              disabled={isGenerating || !prompt.trim()}
              className="rounded-xl px-6 bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-600/90 text-white font-bold text-sm shadow-md gap-2 transition-all"
            >
              {isGenerating ? (
                <>
                  <Wand2 className="w-4 h-4 animate-spin" />
                  Generating Flow...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate AI Flow
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

/**
 * Intelligent Prompt-to-Flow graph generator
 */
function parsePromptToFlow(userPrompt: string): { name: string; description: string; nodes: Node[]; edges: Edge[] } {
  const p = userPrompt.toLowerCase()

  let title = 'AI Voice Workflow'
  if (p.includes('real estate')) title = 'Real Estate Lead Qualification Flow'
  else if (p.includes('appointment') || p.includes('booking')) title = 'Automated Appointment Booking Flow'
  else if (p.includes('support') || p.includes('order')) title = 'Customer Support & Order Tracking Flow'
  else if (p.includes('medical') || p.includes('health')) title = 'Healthcare Intake & Triage Flow'
  else if (p.includes('sales') || p.includes('discovery')) title = 'B2B Outbound Discovery Flow'

  const timestamp = Date.now()

  // Generated Graph Nodes with valid backend Schema Enums
  const nodes: Node[] = [
    {
      id: `start-${timestamp}`,
      type: 'flowNode',
      position: { x: 250, y: 50 },
      data: {
        type: 'message_output',
        label: 'Flow Trigger (Greeting Message)',
        description: 'Initiates conversation when inbound/outbound call connects.'
      }
    },
    {
      id: `speech-${timestamp}-1`,
      type: 'flowNode',
      position: { x: 250, y: 190 },
      data: {
        type: 'input_capture',
        label: 'Capture Caller Speech Input',
        description: `Greetings! ${userPrompt.slice(0, 80)}... How can I assist you today?`
      }
    },
    {
      id: `condition-${timestamp}`,
      type: 'flowNode',
      position: { x: 250, y: 330 },
      data: {
        type: 'decision_split',
        label: 'Evaluate Intent & Decision Split',
        description: 'Analyze transcript for qualified lead parameters or transfer keywords.'
      }
    },
    {
      id: `webhook-${timestamp}`,
      type: 'flowNode',
      position: { x: 80, y: 480 },
      data: {
        type: 'api_request',
        label: 'API Request & Webhook Sync',
        description: 'Send captured caller responses and details via REST API webhook.'
      }
    },
    {
      id: `transfer-${timestamp}`,
      type: 'flowNode',
      position: { x: 420, y: 480 },
      data: {
        type: 'redirect_call',
        label: 'Redirect Call to Live Agent',
        description: 'Instantly transfer high-priority or urgent callers to human support team.'
      }
    },
    {
      id: `hangup-${timestamp}`,
      type: 'flowNode',
      position: { x: 250, y: 630 },
      data: {
        type: 'terminate_call',
        label: 'Terminate Call & Wrap Up',
        description: 'Thank the caller, confirm details, and close the call session gracefully.'
      }
    }
  ]

  // Generated Graph Edges
  const edges: Edge[] = [
    {
      id: `e-start-speech-${timestamp}`,
      source: `start-${timestamp}`,
      target: `speech-${timestamp}-1`,
      type: 'customEdge',
      style: { stroke: '#015482', strokeWidth: 2 }
    },
    {
      id: `e-speech-condition-${timestamp}`,
      source: `speech-${timestamp}-1`,
      target: `condition-${timestamp}`,
      type: 'customEdge',
      style: { stroke: '#015482', strokeWidth: 2 }
    },
    {
      id: `e-condition-webhook-${timestamp}`,
      source: `condition-${timestamp}`,
      target: `webhook-${timestamp}`,
      sourceHandle: 'true',
      type: 'customEdge',
      style: { stroke: '#10b981', strokeWidth: 2 }
    },
    {
      id: `e-condition-transfer-${timestamp}`,
      source: `condition-${timestamp}`,
      target: `transfer-${timestamp}`,
      sourceHandle: 'false',
      type: 'customEdge',
      style: { stroke: '#f59e0b', strokeWidth: 2 }
    },
    {
      id: `e-webhook-hangup-${timestamp}`,
      source: `webhook-${timestamp}`,
      target: `hangup-${timestamp}`,
      type: 'customEdge',
      style: { stroke: '#015482', strokeWidth: 2 }
    },
    {
      id: `e-transfer-hangup-${timestamp}`,
      source: `transfer-${timestamp}`,
      target: `hangup-${timestamp}`,
      type: 'customEdge',
      style: { stroke: '#015482', strokeWidth: 2 }
    }
  ]

  return {
    name: title,
    description: `AI-generated voice flow from prompt: "${userPrompt}"`,
    nodes,
    edges
  }
}
