'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, Sparkles, Flame, Sun, Snowflake } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface NeonWaveformPlayerProps {
  audioUrl?: string;
  transcript?: { time: number; speaker: string; text: string }[];
  leadScore?: 'Hot Lead 🔥' | 'Warm ☀️' | 'Cold ❄️';
}

export function NeonWaveformPlayer({
  audioUrl,
  transcript = [
    { time: 0, speaker: 'AI Agent', text: "Hello! This is Alex calling from InfiniCall AI. Am I speaking with Rahul?" },
    { time: 4, speaker: 'Customer', text: "Yes, speaking! What is this regarding?" },
    { time: 8, speaker: 'AI Agent', text: "I'm calling to share details about our AI Conversational Voice Calling packages starting at ₹499 per month." },
    { time: 14, speaker: 'Customer', text: "That sounds very interesting. Can you send me the payment link on WhatsApp?" },
    { time: 20, speaker: 'AI Agent', text: "Absolutely! I have generated and texted your instant UPI Payment link. Thank you!" }
  ],
  leadScore = 'Hot Lead 🔥'
}: NeonWaveformPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const duration = 25; // seconds simulation
  const timerRef = useRef<any>(null);

  const togglePlay = () => {
    if (isPlaying) {
      clearInterval(timerRef.current);
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      timerRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            clearInterval(timerRef.current);
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
  };

  const activeIndex = transcript.findIndex((item, idx) => {
    const nextItem = transcript[idx + 1];
    return currentTime >= item.time && (!nextItem || currentTime < nextItem.time);
  });

  return (
    <div className="p-6 bg-bg-card border border-input-border-color shadow-sm rounded-radius space-y-6">
      {/* Header Info */}
      <div className="flex items-center justify-between border-b border-input-border-color/50 pb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <span className="text-md font-bold text-title">AI Call Player & Live Transcript</span>
        </div>

        {/* Lead Intelligence Score Badge */}
        <Badge
          className={`font-bold px-3 py-1 rounded-full border text-xs gap-1.5 uppercase ${
            leadScore.includes('Hot')
              ? 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/20 dark:text-rose-400'
              : leadScore.includes('Warm')
              ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400'
              : 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400'
          }`}
        >
          {leadScore.includes('Hot') && <Flame className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />}
          {leadScore.includes('Warm') && <Sun className="w-3.5 h-3.5 text-amber-500" />}
          {leadScore.includes('Cold') && <Snowflake className="w-3.5 h-3.5 text-blue-500" />}
          {leadScore}
        </Badge>
      </div>

      {/* Neon Waveform Controls */}
      <div className="p-4 bg-subcard rounded-lg border border-input-border-color/60 flex items-center gap-4">
        <button
          type="button"
          onClick={togglePlay}
          className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center shadow-md hover:scale-105 transition-transform shrink-0"
        >
          {isPlaying ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white ml-0.5" />}
        </button>

        {/* Animated Neon Waveform Bars */}
        <div className="flex-1 flex items-center gap-1 h-10 px-2 overflow-hidden">
          {Array.from({ length: 40 }).map((_, idx) => {
            const isActive = (idx / 40) * duration <= currentTime;
            const barHeight = Math.sin(idx * 0.5 + (isPlaying ? currentTime * 2 : 0)) * 15 + 20;
            return (
              <div
                key={idx}
                style={{ height: `${barHeight}px` }}
                className={`w-1.5 rounded-full transition-all duration-300 ${
                  isActive
                    ? 'bg-primary shadow-[0_0_10px_rgba(99,102,241,0.8)]'
                    : 'bg-input-border-color/40'
                }`}
              />
            );
          })}
        </div>

        <div className="text-xs font-mono font-bold text-title shrink-0">
          00:{currentTime < 10 ? `0${currentTime}` : currentTime} / 00:{duration}
        </div>
      </div>

      {/* Synchronized Transcript Bubbles */}
      <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
        <span className="text-xs font-bold text-subtitle-color uppercase tracking-wider">Synchronized Transcript</span>
        {transcript.map((item, idx) => {
          const isHighlighted = idx === activeIndex;
          const isAgent = item.speaker === 'AI Agent';
          return (
            <div
              key={idx}
              className={`p-3.5 rounded-lg border transition-all duration-300 text-xs ${
                isHighlighted
                  ? 'border-primary bg-primary/10 shadow-md ring-1 ring-primary/30'
                  : 'border-input-border-color/50 bg-subcard/50 text-subtitle-color'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`font-bold ${isAgent ? 'text-primary' : 'text-title'}`}>
                  {item.speaker}
                </span>
                <span className="text-[10px] font-mono text-subtitle-color">00:{item.time < 10 ? `0${item.time}` : item.time}</span>
              </div>
              <p className={`font-medium leading-relaxed ${isHighlighted ? 'text-title font-bold' : ''}`}>
                {item.text}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
