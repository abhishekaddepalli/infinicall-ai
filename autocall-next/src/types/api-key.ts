export interface ApiKey {
  _id: string;
  id: string;
  user_id: string | { _id: string; name: string; email: string };
  name: string;
  prefix?: string | null;
  permissions: Array<{
    _id: string;
    id: string;
    name: string;
    slug: string;
  }>;
  last_used_at: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ApiKeyListResponse {
  success: boolean;
  apiKeys: ApiKey[];
  pagination?: {
    total: number;
    page: number;
    pages: number;
  };
}

export interface ApiKeyMutationResponse {
  success: boolean;
  message: string;
  data: ApiKey & { raw_key?: string };
}

export interface ApiKeyRawDisplayModalProps {
  isOpen: boolean
  onClose: (open?: boolean) => void
  newRawKey: string | null
}

export interface ApiKeyRegenerateModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  isRegenerating: boolean
}

export interface ApiKeyViewModalProps {
  viewId: string | null
  onClose: () => void
}