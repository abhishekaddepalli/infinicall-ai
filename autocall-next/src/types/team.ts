export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface Team {
  _id: string;
  name: string;
  description?: string;
  status: "active" | "inactive";
  sort_order?: number;
  isAdmin?: boolean;
  permissions?: string[];
  created_at: string;
  updated_at: string;
}

export interface GetTeamsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  sort_by?: string;
  sort_order?: string;
}

export interface GetTeamsResponse {
  success: boolean;
  data: {
    teams: Team[];
    pagination: PaginationInfo;
  };
}

export interface GetTeamByIdResponse {
  success: boolean;
  data: Team & { permissions: string[] };
}

export interface CreateTeamRequest {
  name: string;
  description?: string;
  status?: "active" | "inactive";
  permissions?: string[]; // slugs
}

export type UpdateTeamRequest = Partial<CreateTeamRequest>;

export interface PermissionModule {
  _id?: string;
  id?: string;
  module: string;
  description?: string;
  submodules: {
    name: string;
    slug: string;
    description?: string;
  }[];
}

export interface GetTeamPermissionsResponse {
  success: boolean;
  data: PermissionModule[];
}

export interface TransferTeamSelectorProps {
  teamId: string | null
  setTeamId: (id: string | null) => void
  memberId: string | null
  setMemberId: (id: string | null) => void
  disabled?: boolean
}

export interface TeamMemberModalProps {
  isOpen: boolean
  onClose: () => void
  teamId: string
}


export interface TeamFormProps {
  initialValues?: {
    name: string
    description?: string
    status: 'active' | 'inactive'
    permissions: string[]
  }
  onSubmit: (values: CreateTeamRequest) => Promise<void>
  isLoading: boolean
  mode: 'create' | 'edit'
}

export interface ApiResponse<T> {
  success: boolean
  message?: string
  data: T
}



export interface TeamMemberProfileProps {
  user?: {
    _id?: string
    id?: string
    name?: string
    email?: string
    phone_number?: string
    avatar?: string
    status?: string
    role?: string
    permissions?: unknown[]
    permissionSlugs?: string[]
    user_id?: {
      _id?: string
      name?: string
      email?: string
    }
    teamDetails?: {
      _id?: string
      name?: string
      description?: string
      status?: string
    }
  } | null
}