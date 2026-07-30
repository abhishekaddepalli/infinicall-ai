import { Contact } from './contact'

export interface ContactGroup {
  _id?: string
  id?: string
  user_id?: string
  group_name: string
  group_description?: string
  group_contacts: Contact[] | string[]
  created_at?: string
  updated_at?: string
}

export interface ContactGroupListResponse {
  success: boolean
  data: ContactGroup[]
  pagination: {
    total: number
    page: number
    pages: number
  }
}

export interface ContactGroupMutationResponse {
  success: boolean
  message: string
  data?: ContactGroup
}

export interface CreateContactGroupPayload {
  group_name: string
  group_description?: string
  group_contacts: string[]
}

export interface UpdateContactGroupPayload {
  id: string
  data: Partial<CreateContactGroupPayload>
}

export interface ContactGroupModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (data: { group_name: string; group_description: string; group_contacts: string[] }) => void
  initialData?: ContactGroup | null
  isLoading?: boolean
}