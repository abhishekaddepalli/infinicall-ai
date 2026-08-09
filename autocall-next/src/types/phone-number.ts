export interface PhoneNumber {
  _id: string;
  id: string;
  phone_number: string;
  sid: string;
  type: 'verified' | 'purchased' | 'sip';
  sip_trunk_id?: string | { _id?: string; name?: string } | null;
  label?: string | null;
  is_system_pool: boolean;
  user_id?: any;
  provider: string;
  status: 'active' | 'inactive';
  is_synced_to_elevenlabs: boolean;
  elevenlabs_phone_number_id?: string;
  capabilities?: string[];
  purchase_price?: number;
  validity_days?: number;
  expires_at?: string | null;
  agent_id?: any;
  created_at: string;
  updated_at: string;
  purchase_request?: any; // Added to support pending requests in Purchase Numbers
}

export interface PhoneNumberListResponse {
  success: boolean;
  data: PhoneNumber[];
  total: number;
  page: number;
  limit: number;
}

export interface PhoneNumberMutationResponse {
  success: boolean;
  message: string;
  data?: PhoneNumber;
}

export interface CreatePhoneNumberPayload {
  phone_number: string;
  sid: string;
  type: 'verified' | 'purchased';
  is_system_pool?: boolean;
}

export interface UpdatePhoneNumberPayload {
  status?: 'active' | 'inactive';
  is_system_pool?: boolean;
  agent_id?: string | null;
  remove_agent?: boolean;
  type?: 'verified' | 'purchased' | 'sip';
  sip_trunk_id?: string;
  provider?: string;
  label?: string | null;
  purchase_price?: number;
  validity_days?: number;
}

export interface AssignSipPhoneNumberPayload {
  sip_trunk_id: string;
  type?: 'sip';
  provider?: 'sip';
  label?: string | null;
}

export interface PhoneNumberModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (data: import('./phone-number').PhoneNumber) => void
  initialData?: PhoneNumber | null
  isLoading?: boolean
}