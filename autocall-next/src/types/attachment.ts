export interface Attachment {
  id: string
  _id?: string
  name: string
  file_path: string
  file_type: string
  file_size: number
  mime_type: string
  created_at: string
  updated_at: string
}

export interface AttachmentResponse {
  attachments: Attachment[]
  totalPages: number
  currentPage: number
  total: number
}

export interface AttachmentUploadResponse {
  message: string
  attachments: Attachment[]
}

export interface MediaCardProps {
  attachment: Attachment
  onDelete?: (id: string) => void
  isSelected?: boolean
  onSelect?: (selected: boolean) => void
  selectionMode?: boolean
}

export interface MediaGridProps {
  attachments: Attachment[]
  onDelete: (id: string) => void
  selectedIds: string[]
  onSelect: (id: string, selected: boolean) => void
  selectionMode: boolean
}

export interface UploadMediaModalProps {
  isOpen: boolean
  onClose: () => void
}

export interface MediaPickerModalProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (attachment: Attachment) => void
  onUploadNew?: (file: File) => void
}