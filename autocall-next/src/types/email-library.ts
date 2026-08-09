export interface EmailTemplate {
  _id: string
  id: string
  name: string
  subject: string
  body: string
  type: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface EmailTemplateFormData {
  name: string
  subject: string
  body: string
  type: string
  is_active: boolean
}

export interface EmailLibraryModalProps {
  isOpen: boolean
  onClose: () => void
  templateToEdit?: EmailTemplate
}

export interface EmailLibraryViewModalProps {
  isOpen: boolean
  onClose: () => void
  templateId?: string
}

export interface Shortcode {
  action: string;
  text: string;
}

export interface EmailTemplate {
  name: string;
  slug: string;
  description?: string;
  subject: string;
  content: string;
  status: boolean;
  default_subject?: string;
  default_content?: string;
  shortcodes?: Shortcode[];
}