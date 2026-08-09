import { NodeItem, NodeType } from "@/types/flow"
import {
  CalendarCheck,
  Database,
  Hourglass,
  MessageCircle,
  MessageSquareDot,
  MousePointerClick,
  Music,
  PhoneOff,
  Shuffle,
  Sliders,
  Mail,
  PhoneForwarded
} from 'lucide-react'

// Logically rearranged node configuration with completely fresh icons and colors
export const COLOR_MAP: Record<NodeType, string> = {
  message_output: 'bg-cyan-700',
  whatsapp_notice: 'bg-green-700',
  email_notice: 'bg-blue-700',
  audio_playback: 'bg-teal-700',

  // 2. Logic & Flow Control
  decision_split: 'bg-orange-700',
  variable_map: 'bg-slate-700',
  wait_delay: 'bg-yellow-700',

  // 3. User & Capture Actions
  input_capture: 'bg-fuchsia-700',
  data_capture: 'bg-sky-700',
  book_slot: 'bg-emerald-700',

  // 5. Call & Routing Operations
  redirect_call: 'bg-purple-700',
  terminate_call: 'bg-red-700',
}

export const ICON_MAP: Record<NodeType, React.ElementType> = {
  message_output: MessageCircle,
  whatsapp_notice: MessageSquareDot,
  email_notice: Mail,
  audio_playback: Music,

  // 2. Logic & Flow Control
  decision_split: Shuffle,
  variable_map: Sliders,
  wait_delay: Hourglass,

  input_capture: MousePointerClick,
  data_capture: Database,
  book_slot: CalendarCheck,
  redirect_call: PhoneForwarded,
  terminate_call: PhoneOff,
}

export const LABEL_MAP: Record<NodeType, string> = {
  message_output: 'Message Output',
  whatsapp_notice: 'WhatsApp Notice',
  email_notice: 'Email Notice',
  audio_playback: 'Audio Playback',
  decision_split: 'Decision Split',
  variable_map: 'Variable Map',
  wait_delay: 'Wait Delay',
  input_capture: 'Input Capture',
  data_capture: 'Data Capture',
  book_slot: 'Book Slot',
  redirect_call: 'Redirect Call',
  terminate_call: 'Terminate Call',
}

export const NODES: NodeItem[] = (Object.keys(COLOR_MAP) as NodeType[]).map((type) => ({
  type,
  labelKey: LABEL_MAP[type],
  icon: ICON_MAP[type],
  color: COLOR_MAP[type]
}))