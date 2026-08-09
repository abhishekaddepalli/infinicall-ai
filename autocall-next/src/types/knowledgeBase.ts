export interface KnowledgeBaseItem {
  id: string;
  _id?: string;
  user_id: string;
  name: string;
  type: 'url' | 'file' | 'text';
  url?: string;
  content?: string;
  file_path?: string;
  file_size?: number;
  created_at: string;
  updated_at: string;
}

export interface KnowledgeBaseResponse {
  data: KnowledgeBaseItem[];
  total: number;
  page: number;
  limit: number;
  storageUsed: string;
  storageLimit: string;
}

export interface KnowledgeBaseParams {
  page?: number;
  limit?: number;
  search?: string;
  type?: string;
}

export interface KnowledgeBaseCardProps {
  item: KnowledgeBaseItem
  onDelete: (item: KnowledgeBaseItem) => void
  onEdit?: (item: KnowledgeBaseItem) => void
  isSelected?: boolean
  onSelect?: (id: string) => void
}

export interface KnowledgeBaseWizardModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (formData: FormData) => Promise<void>
  isLoading: boolean
}

export interface StorageIndicatorProps {
  used: string
  limit: string
}

export interface TestAgentFlowModalProps {
  agent: import('./agent').Agent | null
  isOpen: boolean
  onClose: () => void
}

export interface EditKnowledgeBaseModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (id: string, data: FormData) => Promise<void>
  isLoading: boolean
  initialData: KnowledgeBaseItem | null
}