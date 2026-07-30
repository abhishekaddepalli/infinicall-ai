export interface AIModel {
  id: string;
  _id?: string;
  name: string;
  display_name: string;
  provider: 'openai' | 'anthropic' | 'google' | 'gemini' | 'cohere' | 'mistral' | 'groq' | 'deepseek' | 'xai' | 'custom';
  model_id: string;
  api_endpoint: string | null;
  api_version: string | null;
  status: 'active' | 'inactive';
  is_default: boolean;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AIModelFormProps {
  initialValues?: Partial<AIModel>
  onSubmit: (values: any) => Promise<void>
  isLoading: boolean
  title: string
  subtitle?: string
  button?: string
}