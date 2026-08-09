
export interface CampaignType {
  id?: string
  _id?: string
  name: string
  description?: string
  status: boolean
  user_id?: string
  created_at?: string
  updated_at?: string
}

export interface CampaignTypeResponse {
  message: string
  total: number
  totalPages: number
  page: number
  limit: number
  campaignTypes: CampaignType[]
}

export interface Campaign {
  id?: string
  _id?: string
  name: string
  typeId: string | { _id: string; name: string }
  description?: string
  agentId: string | { _id: string; name: string }
  phoneNumberId: string | { _id: string; phone_number: string }
  callSchedule?: {
    callStartTime: string
    callEndTime: string
    timeZone?: string
    dayOfWeek: string[]
  }
  autoRetrySettings?: {
    enabled: boolean
    maxAttempts: number
    retryInterval: string
    retryWhen: string[]
  }
  contactFile?: string
  contactIds?: string[]
  userId?: string
  campaignStatus: 'Draft' | 'Active' | 'Completed' | 'Failed' | 'Paused' | 'Cancelled'
  created_at?: string
  updated_at?: string
}

export interface CampaignResponse {
  success: boolean
  data: Campaign[]
  pagination: {
    total: number
    page: number
    pages: number
  }
}

export interface CampaignHistory {
  campaign: {
    _id: string
    name: string
    campaignStatus: string
    created_at: string
  }
  agent: import('./agent').Agent | null
  metrics: {
    totalLeads: number
    completedCount: number
    avgDuration: number
    successRate: number
  }
  calls: Array<{
    _id: string
    lead_name?: string
    to_number: string
    status: string
    duration?: number
    started_at?: string
    ended_at?: string
    fail_reason?: string
    recording_url?: string
    transcript?: string
  }>
}

export interface CampaignHistoryResponse {
  success: boolean
  data: CampaignHistory
}

export interface CampaignTypeModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: { name: string; description: string }) => Promise<void> | void
  campaignType?: CampaignType | null
  isLoading?: boolean
}

export interface AutoRetrySectionProps {
  retryWhenOptions: { label: string; value: string }[]
}

export interface BasicInfoSectionProps {
  campaignTypesOptions: { label: string; value: string }[]
  agentsOptions: { label: string; value: string }[]
  phoneNumbersOptions: { label: string; value: string }[]
}

export interface CallScheduleSectionProps {
  daysOfWeekOptions: { label: string; value: string }[]
}

export interface RecipientsSectionProps {
  contactsOptions: { label: string; value: string }[]
  selectedFile: File | null
  setSelectedFile: (file: File | null) => void
}

export interface CampaignItemProps {
  campaign: Campaign
  viewMode: 'grid' | 'list'
  isLastItem?: boolean
  onStatusChange: (campaign: Campaign, status: string) => void
  onHistory: (id: string) => void
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export interface ContactsSelectionSectionProps {
  contactsOptions: { label: string; value: string }[]
}