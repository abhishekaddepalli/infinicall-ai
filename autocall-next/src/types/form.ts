export type FormFieldType = 'text' | 'number' | 'date' | 'time' | 'email';

export interface FormField {
  _id?: string;
  id?: string;
  label: string;
  key: string;
  question: string;
  required: boolean;
  type: FormFieldType;
}

export interface Form {
  id?: string;
  _id?: string;
  name: string;
  description?: string;
  fields: FormField[];
  status: 'active' | 'inactive';
  created_at?: string;
  updated_at?: string;
}

export interface FormResponse {
  success: boolean;
  data: Form[];
}

export interface SingleFormResponse {
  success: boolean;
  data: Form;
}

export interface FormSubmission {
  _id: string;
  form_id: string;
  user_id: string;
  call_id?: any;
  responses: Record<string, any>;
  created_at: string;
}

export interface FormSubmissionsResponse {
  success: boolean;
  data: FormSubmission[];
}


export interface FormResponsesModalProps {
  isOpen: boolean
  onClose: () => void
  formId: string | null
}