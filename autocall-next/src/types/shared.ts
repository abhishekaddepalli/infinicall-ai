import { badgeVariants } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Editor } from '@tiptap/react'
import { VariantProps } from "class-variance-authority"
import { LucideIcon } from "lucide-react"
import { ReactNode } from 'react'
import { Agent } from './agent'
import { Campaign } from './campaign'
import { DataTableProps } from "./table"

export interface HistoryDetailDialogProps {
  item: Record<string, unknown>
  onClose: () => void
  promptLabel: string
  isCopied: boolean
  onCopy: (content: string) => void
  onDownload: (item: Record<string, unknown>) => void
}

export interface HistoryEmptyStateProps {
  startRoute: string
}

export interface HistoryTableProps {
  items: Record<string, unknown>[]
  isLoading: boolean
  isFetching: boolean
  page: number
  setPage: (fn: (p: number) => number) => void
  totalPages: number
  currentPage: number
  onView: (item: Record<string, unknown>) => void
  onCopy: (content: string) => void
  onDownload: (item: Record<string, unknown>) => void
}

export interface ConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  isLoading?: boolean
  variant?: 'primary' | 'destructive' | 'premium'
}

export interface CopyEmailCellProps {
  email: string
  truncate?: boolean
}

export interface CreditLimitPillProps {
  className?: string
}

export interface DataLoaderProps {
  className?: string
  height?: string
  text?: string
  size?: 'sm' | 'md' | 'lg'
  textClassName?: string
  fullPage?: boolean
  variant?: 'full' | 'spinner'
}

export interface FlagProps {
  countryCode: string // ISO 3166-1 alpha-2 code (e.g. "IN", "US")
  className?: string
  size?: number
}

export interface NoDataFoundProps {
  message?: string
  className?: string
  icon?: LucideIcon
  height?: string
}

export interface PageHeaderProps {
  title: string
  subtitle?: string
  showBackButton?: boolean
  onBack?: () => void
  icon?: React.ReactNode
  primaryAction?: {
    label: string
    onClick: () => void
    icon?: React.ReactNode
    className?: string
  }
  endContent?: React.ReactNode
}

export interface SpinnerProps {
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  text?: string
}

export interface SharedStatusSwitchProps {
  isActive: boolean
  onToggle: () => Promise<void>
  canManage: boolean
  disabled?: boolean
}

export interface TableLayoutProps<T> extends Omit<DataTableProps<T>, 'title'> {
  title: string
  subtitle?: string
  headerIcon?: React.ReactNode
  showBackButton?: boolean
  onBack?: () => void
  primaryAction?: {
    label: string
    onClick: () => void
    icon?: React.ReactNode
    className?: string
  }
  endContent?: React.ReactNode
  emptyStateTitle?: string
  emptyStateActionLabel?: string
  onEmptyStateAction?: () => void
}

export interface MenuButtonProps {
  onClick: () => void
  isActive?: boolean
  disabled?: boolean
  children: React.ReactNode
  className?: string
}

export interface ImportModalProps {
  isOpen: boolean
  onClose: () => void
  onImport: (file: File) => void
  onDownloadTemplate?: () => void
  isLoading?: boolean
  title?: string
}

export interface InquiryDetailModalProps {
  inquiryId: string | null
  isOpen: boolean
  onClose: () => void
}

export interface FormikPersistProps {
  name: string
  ignoreFields?: string[]
}

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> { }

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean
  isLoading?: boolean
}

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  onChange?: (checked: boolean) => void
  onCheckedChange?: (checked: boolean) => void
  indeterminate?: boolean
}

export interface PasswordInputProps extends React.ComponentProps<typeof Input> {
  icon?: React.ElementType
}

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>

export interface SectionRefsContextType {
  sectionRefs: React.MutableRefObject<Record<string, HTMLElement | null>>
  registerRef: (id: string, el: HTMLElement | null) => void
}

export interface ToolbarProps {
  editor: Editor | null
  isFullScreen: boolean
  setIsFullScreen: (val: boolean) => void
}

export interface RichTextEditorProps {
  label?: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  minHeight?: string
  maxHeight?: string
}

export interface CKEditorFieldProps {
  label?: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  error?: string
  onReady?: (editor: unknown) => void
  heightClass?: string
}
export interface Option {
  label: string
  value: string
}

export interface MultiSelectFieldProps {
  label?: string
  options: Option[]
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
  error?: string
  className?: string
  disabled?: boolean
  emptyStateTitle?: string
  emptyStateDescription?: string
  emptyStateActionLabel?: string
  onEmptyStateAction?: () => void
}

export interface DataLoaderProps {
  className?: string
  height?: string
  text?: string
  size?: 'sm' | 'md' | 'lg'
  textClassName?: string
  fullPage?: boolean
  variant?: 'full' | 'spinner'
}

export interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
}

export interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
  variant?: "glass" | "premium" | "default";
}

export interface SocialButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  className?: string;
}

export interface SidebarLogoProps {
  isCollapsed: boolean
  onClick?: () => void
}

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number
}

export interface CustomTooltipProps {
  children: React.ReactNode
  title: React.ReactNode
  side?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'start' | 'center' | 'end'
  className?: string
}

export interface LimitBadgeProps {
  module: 'agents' | 'campaigns' | 'flows' | 'kb' | 'contacts' | 'sms_agents' | 'sms_campaigns'
  className?: string
}

export interface LimitInfo {
  limit: number
  used: number
  remaining: number
}

export interface FBAuthResponse {
  code?: string;
}

export interface FBLoginResponse {
  authResponse?: FBAuthResponse;
}

export interface FBLoginOptions {
  config_id: string;
  response_type: string;
  override_default_response_type: boolean;
  extras: {
    setup: Record<string, unknown>;
    sessionInfoVersion: number;
    featureType: string;
  };
}

export interface FBUiOptions {
  method: string;
  response_type: string;
  config_id: string;
  override_default_response_type: boolean;
  extras: {
    setup: Record<string, unknown>;
    sessionInfoVersion: number;
    featureType: string;
  };
}

export interface FBUiResponse {
  error_code?: string;
  error_message?: string;
}

export interface UserSettingsData {
  whatsapp_app_id?: string;
  configuration_id?: string;
}

export interface UserSettingsResponse {
  data?: UserSettingsData;
}

export interface AgentItemProps {
  agent: Agent
  viewMode: 'grid' | 'list'
  isLastItem?: boolean
  onStatusChange: (agent: Agent) => void
  onTestFlow: (agent: Agent) => void
  onEdit: (agent: Agent) => void
  onDelete: (id: string) => void
  getVoiceName: (voiceId: string) => string
}

export interface DataViewEmptyStateProps {
  icon?: ReactNode
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
}

export interface DataViewLayoutProps<T> {
  items: T[]
  isLoading?: boolean
  emptyState?: ReactNode
  viewMode: 'grid' | 'list'
  renderListItem: (item: T, index: number) => ReactNode
  renderGridItem: (item: T, index: number) => ReactNode
  loadingSkeleton?: ReactNode
}

export interface DataViewPaginationProps {
  currentPage: number
  totalItems: number
  itemsPerPage: number
  onPageChange: (page: number) => void
  onRowsPerPageChange?: (value: number) => void
}

export interface DataViewToolbarProps {
  search: string
  onSearchChange: (val: string) => void
  searchPlaceholder?: string
  viewMode: 'grid' | 'list'
  onViewModeChange: (mode: 'grid' | 'list') => void
  filterNode?: ReactNode
  selectedCount?: number
  onBulkDelete?: () => void
  isBulkDeleting?: boolean
  onSelectAll?: (checked: boolean) => void
  isAllSelected?: boolean
  hasItems?: boolean
}

export interface ProgressBarProps {
  value: number
  colorClass?: string
  trackColorClass?: string
  className?: string
  height?: number | string
}

export interface RadialProgressChartProps {
  value: number
  color?: string
  height?: number
  width?: number | string
  className?: string
  showLabel?: boolean
}

export interface SparklineChartProps {
  data?: number[]
  color?: string
  height?: number
  width?: string | number
  className?: string
}

export interface CampaignItemProps {
  campaign: Campaign
  viewMode: 'grid' | 'list'
  isLastItem?: boolean
  onActivate: (campaign: Campaign) => void
  onHistory: (id: string) => void
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export interface DataViewCardProps {
  viewMode: 'grid' | 'list'
  isLastItem?: boolean
  icon: ReactNode
  title: string
  statusBadge?: ReactNode
  headerRight?: ReactNode
  tags?: ReactNode
  description?: string | undefined | null
  listMetaContent?: ReactNode
  gridMetaContent?: ReactNode
  gridContent?: ReactNode
  listContent?: ReactNode
  updatedAt?: Date | string
  actions: ReactNode
  selectable?: boolean
  isSelected?: boolean
  onSelectChange?: (checked: boolean) => void
  gridHeightClass?: string
  listTitleWidthClass?: string
}

export interface ImageDropzoneProps {
  label: string;
  name?: string;
  onUpload: (file: File) => void;
  className?: string;
  value?: string;
  file?: File | null;
  accept?: string;
  onRemove?: () => void;
}export interface SmsSession {
  _id?: string;
  id?: string;
  first_name?: string;
  phone_number: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
  assigned_member_id?: {
    _id?: string;
    id?: string;
    first_name: string;
    last_name: string;
  } | null;
  contact_id?: {
    _id?: string;
    id?: string;
    first_name: string;
  } | null;
  status: 'active' | 'completed' | 'human_takeover';
}

export interface SmsMessage {
  _id?: string;
  id?: string;
  session_id: string;
  content: string;
  role: 'user' | 'ai' | 'human';
  status?: 'sent' | 'delivered' | 'failed';
  created_at: string;
}

export interface GetSmsSessionsParams {
  status?: 'active' | 'completed' | 'human_takeover';
  search?: string;
  assignedTo?: string;
}

export interface AssignSessionPayload {
  sessionId: string;
  member_id: string;
}

export interface ReplySessionPayload {
  sessionId: string;
  message: string;
}

export interface AssignDropdownProps {
  session: SmsSession;
}

export interface ChatHeaderProps {
  session: SmsSession;
  onToggleSidebar: () => void;
  isSidebarOpen?: boolean;
}

export interface ConversationItemProps {
  session: SmsSession;
  isSelected: boolean;
  onClick: () => void;
}

export interface ConversationListProps {
  selectedSessionId: string | null;
  onSelectSession: (id: string) => void;
  onCloseSidebar?: () => void;
}

export interface ConversationViewProps {
  sessionId: string | null;
  onToggleSidebar: () => void;
  isSidebarOpen?: boolean;
}

export interface MessageBubbleProps {
  message: SmsMessage;
}

export interface MessageComposerProps {
  sessionId: string;
}