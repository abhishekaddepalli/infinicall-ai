export interface SmsCampaignBasicInfoProps {
    campaignTypesOptions: { label: string; value: string }[];
    phoneNumbersOptions: { label: string; value: string }[];
    smsAgentsOptions: { label: string; value: string }[];
}

export interface SmsCampaignContentSectionProps {
    smsTemplatesOptions: { label: string; value: string; content: string; description?: string }[];
}

export interface SmsScheduleSectionProps {
    daysOfWeekOptions: { label: string; value: string }[];
}

export interface SMSAgentTransferToHuman {
    enabled: boolean
    transfer_keywords: string[]
    team_id: string | null
    member_id: string | null
}

export interface SMSAgent {
    _id: string
    user_id?: string
    name: string
    description?: string
    language: string
    llm_model?: string | { _id: string; name: string; display_name: string; model_id: string; provider: string; status: string } | null
    transfer_to_human?: SMSAgentTransferToHuman
    knowledge_base?: Array<string | { _id: string; name: string; type: string }>
    status: 'active' | 'inactive'
    created_at?: string
    updated_at?: string
}

export interface SmsAgentFormPageProps {
    isEdit: boolean
    id?: string
}

export interface SmsAgentItemProps {
    agent: SMSAgent
    viewMode: 'grid' | 'list'
    isLastItem?: boolean
    canUpdate?: boolean
    canDelete?: boolean
    onEdit: (id: string) => void
    onDelete: (id: string) => void
    selectable?: boolean
    isSelected?: boolean
    onSelectChange?: (checked: boolean) => void
}

export interface SmsCampaignItemProps {
    campaign: any
    viewMode: 'grid' | 'list'
    isLastItem?: boolean
    canUpdate?: boolean
    canDelete?: boolean
    canView?: boolean
    onStatusChange: (campaign: any, status: string) => void
    onHistory: (id: string) => void
    onEdit: (id: string) => void
    onDelete: (id: string) => void
}

export interface SmsTemplateItemProps {
    template: any
    viewMode: 'list' | 'grid'
    isLastItem?: boolean
    canUpdate: boolean
    canDelete: boolean
    onStatusToggle: (template: any) => void
    onEdit: (template: any) => void
    onDelete: (id: string) => void
}