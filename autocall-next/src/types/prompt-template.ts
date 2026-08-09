export interface TemplateCategory {
  id?: string
  _id?: string
  name: string
  description: string
  is_system?: boolean
  user_id?: string
  created_at: string
  updated_at: string
}

export interface PromptTemplate {
  id?: string
  _id?: string
  name: string
  category: string | TemplateCategory
  content: string
  system_prompt: string
  welcome_message: string
  goodbye_message: string
  communication_style: string
  behavior_style: string
  is_public: boolean
  is_system?: boolean
  user_id?: string
  created_at: string
  updated_at: string
}

export interface TemplateCategoryResponse {
  categories: TemplateCategory[]
  total: number
  totalPages: number
  page: number
  limit: number
}

export interface PromptTemplateResponse {
  templates: PromptTemplate[]
  total: number
  totalPages: number
  page: number
  limit: number
}

export interface CategoryModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: { name: string; description: string }) => void
  category?: TemplateCategory | null
  isLoading?: boolean
}

export interface TemplateCardProps {
  template: PromptTemplate
  onEdit: (template: PromptTemplate) => void
  onDelete: (id: string) => void
}

export interface TemplateModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: Partial<PromptTemplate>) => void
  template?: PromptTemplate | null
  categories: TemplateCategory[]
  isLoading?: boolean
}

export interface GeneralInformationCardProps {
  categoryOptions: { label: string; value: string }[]
}

export interface TemplateActionBarProps {
  templateId: string | null
  isCreating: boolean
  isUpdating: boolean
}

export interface PromptTemplateItemProps {
  template: any
  viewMode: 'list' | 'grid'
  isLastItem?: boolean
  onEdit: (template: any) => void
  onDelete: (id: string) => void
}