import { LucideIcon } from "lucide-react"

export interface ApiIntegrationForm {
  huggingface_api_key: string
  winston_api_key: string
  gemini_api_key: string
  openai_api_key: string
  groq_api_key: string
  openrouter_api_key: string
  grok_api_key: string
  stable_diffusion_api_key: string
  aiProvider: string
}

export interface ImageUploadItemProps {
  label: string
  description: string
  currentUrl: string | null | undefined
  onFileSelect: (file: File | null) => void
  onRemove: () => void
  isUploading: boolean
}

export interface InlineImageUploadProps {
  label: string
  currentUrl: string | null | undefined
  onFileSelect: (file: File | null) => void
  onRemove: () => void
}

export interface EmailTestModalProps {
  show: boolean
  onClose: () => void
  onSend: () => void
  testEmail: string
  setTestEmail: (email: string) => void
  isTesting: boolean
}

export interface GeneralSettingsFormValues {
  app_name: string;
  app_description: string;
  app_email: string;
  support_email: string;
  maintenance_mode: boolean;
  maintenance_title: string;
  maintenance_message: string;
  maintenance_image_url: string;
  maintenance_allowed_ips: string[];
  page_404_title: string;
  page_404_content: string;
  page_404_image_url: string;
  no_internet_title: string;
  no_internet_content: string;
  no_internet_image_url: string;
  document_file_limit: number;
  audio_file_limit: number;
  video_file_limit: number;
  image_file_limit: number;
  multiple_file_share_limit: number;
  smtp_host: string;
  smtp_port: number;
  smtp_user: string;
  smtp_pass: string;
  mail_from_name: string;
  mail_from_email: string;
  mail_encryption: string;
  session_expiration_days: number;
  session_limit: number;
  demo_user_email: string;
  demo_user_password: string;
  is_demo_mode: boolean;
}

export interface MaintenanceModeCardProps {
  files: Record<string, File | 'null' | null>
  setFiles: React.Dispatch<React.SetStateAction<Record<string, File | 'null' | null>>>
  currentImageUrl?: string | null
}

export interface SystemPagesCardProps {
  files: Record<string, File | 'null' | null>
  setFiles: React.Dispatch<React.SetStateAction<Record<string, File | 'null' | null>>>
  settings: Partial<GeneralSettingsFormValues>
}

type EmailProvider = 'nodemailer' | 'sendgrid'

export interface EmailConfigForm {
  emailProvider: EmailProvider
  fromName: string
  fromEmail: string
  config: {
    smtp_host: string
    smtp_port: string
    smtp_user: string
    smtp_pass: string
    mail_encryption: 'ssl' | 'tls'
    sendgrid_api_key: string
  }
}


export interface StatusPageProps {
  title: string
  description: string
  icon?: LucideIcon
  image?: string
  showHome?: boolean
  showRetry?: boolean
  onRetry?: () => void
  isRetrying?: boolean
  errorCode?: string
  isMaintenance?: boolean
  statusBadge?: string
}

export interface AiSettingsProps {
  aiModelOptions: { label: string; value: string }[]
}

export interface StorageSettingsProps {
  values: {
    storage_type: string
    [key: string]: unknown
  }
}