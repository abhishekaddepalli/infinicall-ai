import { PhoneNumber } from "./phone-number";

export interface Voice {
  id: string;
  voice_id: string;
  name: string;
  provider: string;
  category: string;
  preview_url: string | null;
  labels: {
    gender: string | null;
    age: string | null;
    accent: string | null;
    description: string | null;
  };
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface VoiceResponse {
  success: boolean;
  data: Voice[];
}

export interface VoiceCardProps {
  voice: Voice
}

export interface AssignAgentModalProps {
  isOpen: boolean
  onClose: () => void
  phoneNumber: PhoneNumber | null
  onSubmit: (values: { agent_id: string | null }) => Promise<void>
  isLoading?: boolean
}