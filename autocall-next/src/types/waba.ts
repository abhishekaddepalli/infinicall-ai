

export interface ConnectionResponse {
    success: boolean;
    data?: unknown;
}

export interface PhoneNumber {
    _id: string;
    display_phone_number: string;
    verified_name?: string;
    quality_rating?: string;
    status?: string;
    created_at?: string;
}

export interface PhoneNumbersTableProps {
    phoneNumbers: PhoneNumber[]
    isLoading?: boolean
}

export interface WabaSetupStep {
    id: string
    iconName: "Phone" | "Laptop" | "Key" | "Share2" | "CheckCircle"
    title: string
    description: string
    color: string
    bgColor: string
}

export interface WabaSetupGuideProps {
    isConnected: boolean
}

export interface FormLivePreviewProps {
    templateType: 'none' | 'text' | 'image' | 'video' | 'document' | 'location'
    headerText: string
    messageBody: string
    variables_example: { key: string; example: string }[]
    footerText: string
    headerFile: File | null
    mediaUrl?: string
}

export interface TemplatePreviewBubbleProps {
    templateType: 'none' | 'text' | 'image' | 'video' | 'document' | 'location'
    headerText: string
    bodyText: string
    footerText: string
    fileUrl: string | null
}

export interface WhatsAppTemplateFormProps {
    templateId?: string;
}

export interface WABAConnection {
    _id: string;
    whatsapp_business_account_id: string;
    name: string;
    status: string;
}

export interface WhatsAppTemplate {
    _id: string;
    template_name: string;
    language: string;
    category: string;
    status: string;
    created_at?: string;
    footer_text?: string;
    message_body: string;
    header?: string;
}

export interface RouteParams {
    params: Promise<{
        id: string
    }>
}

export interface SyncTemplatesModalProps {
    isOpen: boolean
    onClose: () => void
    wabaId: string
    onSyncSuccess?: () => void
}

export interface MetaTemplate {
    id: string
    name: string
    category: string
    status: string
    language: string
}

export interface TemplateCardProps {
    template: WhatsAppTemplate
    onPreview: (template: WhatsAppTemplate) => void
    onEdit: (template: WhatsAppTemplate) => void
    onDelete: (id: string) => void
}

export interface TemplatePreviewModalProps {
    template: WhatsAppTemplate | null
    isOpen: boolean
    onClose: () => void
}
