'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Command, Bot, Phone, Plus, Cpu, IndianRupee, FileText, Settings, ShieldCheck, Sparkles, X, LayoutDashboard } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';

export function SpotlightCommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  // Keyboard shortcut listener: Ctrl+K or Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const actions = [
    { id: 'dash', title: 'Dashboard Overview', category: 'Navigation', icon: LayoutDashboard, path: '/dashboard' },
    { id: 'agents', title: 'AI Voice Assistants', category: 'Navigation', icon: Bot, path: '/ai-assistants' },
    { id: 'create_agent', title: 'Create New AI Assistant', category: 'Actions', icon: Plus, path: '/ai-assistants/create' },
    { id: 'n8n', title: 'n8n & Zapier Automation Connector', category: 'Toolbox', icon: Cpu, path: '/toolbox-hub/n8n-automation' },
    { id: 'script', title: 'AI Script & System Prompt Studio', category: 'Toolbox', icon: Sparkles, path: '/toolbox-hub/script-studio' },
    { id: 'upi', title: 'Post-Call Instant UPI Payment Link Engine', category: 'Toolbox', icon: IndianRupee, path: '/toolbox-hub/upi-triggers' },
    { id: 'plans', title: 'Plans & Pricing Management', category: 'Billing', icon: ShieldCheck, path: '/plans' },
    { id: 'numbers', title: 'Phone Numbers Hub', category: 'Telephony', icon: Phone, path: '/phone-numbers' },
    { id: 'settings', title: 'System & App Settings', category: 'System', icon: Settings, path: '/settings' },
  ];

  const filteredActions = actions.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (path: string) => {
    setOpen(false);
    setQuery('');
    router.push(path);
  };

  return (
    <>
      {/* Trigger Button in Header */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-lg bg-bg-card/80 border border-input-border-color/80 text-subtitle-color hover:text-title hover:border-primary/50 transition-all text-xs shadow-none backdrop-blur-sm"
      >
        <Search className="w-3.5 h-3.5 text-primary" />
        <span className="font-medium">Search or press</span>
        <kbd className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-subcard border border-input-border-color font-mono text-[10px] font-bold text-title">
          <Command className="w-2.5 h-2.5" /> K
        </kbd>
      </button>

      {/* Glassmorphism Command Palette Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="p-0 border border-primary/30 bg-bg-card/95 backdrop-blur-xl shadow-2xl shadow-primary/10 rounded-radius overflow-hidden max-w-xl">
          {/* Search Header Input */}
          <div className="flex items-center px-4 border-b border-input-border-color/60">
            <Search className="w-5 h-5 text-primary shrink-0" />
            <input
              autoFocus
              type="text"
              placeholder="Search features, tools, or press shortcuts..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full h-14 bg-transparent px-3 text-sm font-semibold text-title placeholder:text-subtitle-color/60 focus:outline-none"
            />
            <kbd className="px-2 py-1 bg-subcard border border-input-border-color rounded text-[10px] font-mono text-subtitle-color font-bold shrink-0">
              ESC
            </kbd>
          </div>

          {/* Options List */}
          <div className="max-h-[350px] overflow-y-auto p-2 space-y-1">
            {filteredActions.length > 0 ? (
              filteredActions.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelect(item.path)}
                    className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-primary/10 hover:border-primary/20 border border-transparent transition-all group text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-title group-hover:text-primary transition-colors">
                          {item.title}
                        </p>
                        <p className="text-[10px] font-medium text-subtitle-color">
                          {item.category}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-subtitle-color group-hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      Open ↵
                    </span>
                  </button>
                );
              })
            ) : (
              <div className="py-10 text-center text-subtitle-color text-xs">
                No matching features found for "{query}"
              </div>
            )}
          </div>

          {/* Footer Shortcuts */}
          <div className="p-2.5 px-4 bg-subcard border-t border-input-border-color/60 flex items-center justify-between text-[11px] text-subtitle-color font-medium">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-primary" /> InfiniCall AI Command Engine
            </span>
            <span>Use ↑ ↓ keys to navigate</span>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
