'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Volume2, Sparkles, X, Bot } from 'lucide-react';
import { toast } from 'sonner';

interface LiveVoiceSphereModalProps {
  isOpen: boolean;
  onClose: () => void;
  agentName?: string;
}

export function LiveVoiceSphereModal({ isOpen, onClose, agentName = 'AI Voice Assistant' }: LiveVoiceSphereModalProps) {
  const [isListening, setIsListening] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [transcript, setTranscript] = useState('Click "Start Voice Test" and speak into your microphone...');
  const [aiState, setAiState] = useState<'idle' | 'listening' | 'thinking' | 'speaking'>('idle');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startVoiceTest = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioContextClass();
      audioCtxRef.current = audioCtx;

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      analyserRef.current = analyser;

      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      setIsListening(true);
      setAiState('listening');
      setTranscript('Listening... Speak to test response');
      toast.success('Microphone connected! Start speaking.');

      drawSphere();
    } catch (err: any) {
      console.error('Microphone error:', err);
      toast.error('Microphone access denied or not available.');
    }
  };

  const stopVoiceTest = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close();
    }
    setIsListening(false);
    setAiState('idle');
    setTranscript('Click "Start Voice Test" to begin.');
  };

  const drawSphere = () => {
    if (!canvasRef.current || !analyserRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);

    const render = () => {
      animFrameRef.current = requestAnimationFrame(render);
      analyserRef.current?.getByteFrequencyData(dataArray);

      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i];
      }
      const avg = sum / dataArray.length;
      setAudioLevel(avg);

      // Clear Canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const baseRadius = 60 + avg * 0.4;

      // Glow Mesh Gradients (Siri/Gemini Neon style)
      const gradient = ctx.createRadialGradient(centerX, centerY, 10, centerX, centerY, baseRadius + 30);
      gradient.addColorStop(0, '#6366F1'); // Indigo
      gradient.addColorStop(0.5, '#015482'); // Primary Blue
      gradient.addColorStop(1, 'rgba(1, 84, 130, 0)');

      // Draw Outer Glow Circle
      ctx.beginPath();
      ctx.arc(centerX, centerY, baseRadius + 20, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Draw Pulsing Core Sphere
      ctx.beginPath();
      ctx.arc(centerX, centerY, baseRadius, 0, Math.PI * 2);
      ctx.fillStyle = '#015482';
      ctx.shadowColor = '#6366F1';
      ctx.shadowBlur = 30;
      ctx.fill();
    };

    render();
  };

  useEffect(() => {
    return () => {
      stopVoiceTest();
    };
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="p-6 border border-primary/30 bg-bg-card/95 backdrop-blur-xl shadow-2xl rounded-radius max-w-md flex flex-col items-center text-center">
        <div className="flex items-center gap-2 mb-2">
          <Bot className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-bold text-title">{agentName} — Live Voice Test</h3>
        </div>
        <p className="text-xs text-subtitle-color mb-6">
          Real-time WebRTC audio test with 3D Siri/Gemini voice sphere
        </p>

        {/* 3D Voice Mesh Sphere Canvas */}
        <div className="relative w-56 h-56 flex items-center justify-center mb-6">
          <canvas
            ref={canvasRef}
            width={240}
            height={240}
            className="w-full h-full rounded-full border border-primary/20 shadow-inner"
          />
          {!isListening && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className="w-12 h-12 text-primary/40 animate-pulse" />
            </div>
          )}
        </div>

        {/* Live Transcript / Status */}
        <div className="w-full p-3 bg-subcard rounded-lg border border-input-border-color/60 mb-6 text-xs font-semibold text-title min-h-[50px] flex items-center justify-center">
          {transcript}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3 w-full">
          {!isListening ? (
            <Button
              onClick={startVoiceTest}
              className="flex-1 h-12 bg-primary text-white font-bold rounded-radius gap-2 shadow-md hover:bg-primary/90"
            >
              <Mic className="w-4 h-4" /> Start Voice Test
            </Button>
          ) : (
            <Button
              onClick={stopVoiceTest}
              variant="destructive"
              className="flex-1 h-12 font-bold rounded-radius gap-2 shadow-md"
            >
              <MicOff className="w-4 h-4" /> End Test Session
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
