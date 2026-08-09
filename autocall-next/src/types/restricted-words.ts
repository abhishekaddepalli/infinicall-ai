export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
  violations?: string[];
}

export interface RestrictedWord {
  id: string
  _id?: string
  word: string
  severity_level: 'low' | 'medium' | 'high'
  is_active: boolean
  user_id?: string
  created_at?: string
  updated_at?: string
}

export interface CreateRestrictedWordPayload {
  word: string
  severity_level: 'low' | 'medium' | 'high'
  is_active: boolean
}

export interface UpdateRestrictedWordPayload {
  id: string
  word?: string
  severity_level?: 'low' | 'medium' | 'high'
  is_active?: boolean
}

export interface TakeActionPayload {
  id: string
  action: 'block' | 'warning' | 'unblock'
}

export interface RestrictedWordModalProps {
  isOpen: boolean
  onClose: () => void
  wordToEdit?: RestrictedWord
}