import { PhoneNumber } from "./phone-number"

export type SipTransport = 'auto' | 'udp' | 'tcp' | 'tls'
export type SipTrunkStatus = 'active' | 'inactive'

export interface SipTrunk {
  _id?: string
  id?: string
  name: string
  engine: string
  provider: string
  sip_host: string
  port: number
  transport: SipTransport
  username?: string | null
  password?: string | null
  auth_realm?: string | null
  default_caller_id?: string | null
  region?: string | null
  user_id?: string
  status: SipTrunkStatus
  created_at?: string
  updated_at?: string
}

export interface SipTrunkListResponse {
  success: boolean
  data: SipTrunk[]
  pagination: {
    total: number
    page: number
    limit: number
    total_pages: number
    has_next_page: boolean
    has_prev_page: boolean
  }
}

export interface SipTrunkMutationResponse {
  success: boolean
  message: string
  data: SipTrunk
}

export interface CreateSipTrunkPayload {
  name: string
  engine?: string
  provider?: string
  sip_host: string
  port?: number
  transport?: SipTransport
  username?: string | null
  password?: string | null
  auth_realm?: string | null
  default_caller_id?: string | null
  region?: string | null
  status?: SipTrunkStatus
}

export type UpdateSipTrunkPayload = Partial<CreateSipTrunkPayload>

export interface ImportSipPhoneNumberPayload {
  phone_number: string
  sip_trunk_id: string
  label?: string
}

export interface SipTrunkFormProps {
  initialValues?: Partial<SipTrunk>
  onSubmit: (values: CreateSipTrunkPayload) => void | Promise<void>
  isLoading?: boolean
  title: string
  subtitle?: string
}

export interface AssignSipModalProps {
  isOpen: boolean
  onClose: () => void
  phoneNumber: PhoneNumber | null
  onSubmit: (values: { sip_trunk_id: string }) => Promise<void>
  isLoading?: boolean
}

export interface SipImportModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (values: { phone_number: string; sip_trunk_id: string; label?: string }) => Promise<void>
  isLoading?: boolean
  initialPhoneNumber?: string
}

export interface SipTrunkListParams {
  page?: number
  limit?: number
  search?: string
  status?: string
  provider?: string
  engine?: string
  sort_by?: string
  sort_order?: 'asc' | 'desc'
}

export interface SipTrunkItemProps {
  trunk: SipTrunk
  viewMode: 'grid' | 'list'
  isLastItem?: boolean
  canUpdate?: boolean
  canDelete?: boolean
  onEdit: (trunk: SipTrunk) => void
  onDelete: (id: string) => void
}