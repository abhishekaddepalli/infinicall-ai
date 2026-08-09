export interface GuideEndpoint {
  _id?: string;
  id?: string;
  sub_title: string;
  sub_description: string;
  http_method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  url_path: string;
  payload?: Record<string, unknown>;
  response?: Record<string, unknown>;
}

export interface TenantGuide {
  _id: string;
  id: string;
  title: string;
  description: string;
  endpoints: GuideEndpoint[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TenantGuideListResponse {
  success: boolean;
  message: string;
  tenantGuide: TenantGuide[];
  pagination: {
    totalRecords: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  };
}

export interface TenantGuideSingleResponse {
  success: boolean;
  message: string;
  tenantGuide: TenantGuide;
  pagination?: {
    totalRecords: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  };
}

export interface TenantGuideMutationResponse {
  success: boolean;
  message: string;
  tenantGuide: TenantGuide;
}

export interface GuideFormProps {
  initialValues?: Partial<TenantGuide>
  onSubmit: (values: any) => Promise<void>
  isLoading: boolean
  mode: 'create' | 'edit'
}