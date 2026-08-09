export const DIALPAD_KEYS = [
  { key: '1', letters: '' },
  { key: '2', letters: 'ABC' },
  { key: '3', letters: 'DEF' },
  { key: '4', letters: 'GHI' },
  { key: '5', letters: 'JKL' },
  { key: '6', letters: 'MNO' },
  { key: '7', letters: 'PQRS' },
  { key: '8', letters: 'TUV' },
  { key: '9', letters: 'WXYZ' },
  { key: '*', letters: '' },
  { key: '0', letters: '+' },
  { key: '#', letters: '' },
];

import { Globe, Mic, Signal, Volume2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export const getDeviceStatuses = (t: any, status: string) => [
  { icon: Mic, label: t('microphone'), value: t('connected'), className: "text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10" },
  { icon: Volume2, label: t('speaker'), value: t('connected'), className: "text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10" },
  { icon: Signal, label: t('network'), value: t('good'), className: "text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10" },
  { 
    icon: Globe, 
    label: t('virtual_phone'), 
    value: t(status), 
    className: cn(
      status === 'virtual_phone_offline' ? "text-zinc-500 bg-zinc-100 dark:bg-zinc-800/50" :
      status === 'virtual_phone_error' ? "text-red-600 bg-red-50 dark:bg-red-500/10" :
      "text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10"
    )
  }
];
