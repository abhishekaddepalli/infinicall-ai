export interface Contact {
  _id: string;
  id: string;
  user_id: string;
  phone_number: string;
  first_name: string;
  last_name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface ContactListResponse {
  success: boolean;
  data: Contact[];
  pagination: {
    total: number;
    page: number;
    pages: number;
  };
}

export interface ContactMutationResponse {
  success: boolean;
  message: string;
  data?: Contact;
}

export interface CreateContactPayload {
  phone_number: string;
  first_name?: string;
  last_name?: string;
  email?: string;
}

export interface UpdateContactPayload {
  id: string;
  data: Partial<CreateContactPayload>;
}

export interface BulkDeletePayload {
  contactIds: string[];
}

export interface ImportContactResponse {
  success: boolean;
  message: string;
  data: {
    processed: number;
    added: number;
  };
}

export interface ContactModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (data: any) => void
  initialData?: Contact | null
  isLoading?: boolean
}

export interface ImportContactModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (file: File) => void
  isLoading?: boolean
}