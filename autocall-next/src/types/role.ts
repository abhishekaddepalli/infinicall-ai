export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}
export interface Permission {
  _id: string;
  id: string;
  name: string;
  slug: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface PermissionModule {
  id: string;
  module: string;
  submodules: {
    id: string;
    name: string;
    slug: string;
    description?: string;
    access: "read" | "write";
  }[];
}

export interface TransformedPermission {
  _id: string;
  module: string;
  description?: string;
  submodules: {
    id: string;
    name: string;
    slug: string;
    description?: string;
  }[];
}

export interface Role {
  _id: string;
  name: string;
  description?: string;
  status: "active" | "inactive";
  is_active: boolean;
  sort_order?: number;
  system_reserved?: boolean;
  permissions?: string[]; // array of permission IDs
  created_at: string;
  updated_at: string;
}

export interface GetActiveRolesResponse {
  success: boolean;
  data: Role[];
}

export interface GetRolesParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  sort_by?: string;
  sort_order?: string;
}

export interface GetRolesResponse {
  success: boolean;
  data: {
    roles: Role[];
    pagination: PaginationInfo;
  };
}

export interface GetRoleByIdResponse {
  success: boolean;
  data: {
    role: Role;
    permissions: Permission[];
  };
}

export interface GetPermissionsResponse {
  success: boolean;
  data: Permission[];
}

export interface GroupedPermissionsResponse {
  success: boolean;
  data: {
    permissions: PermissionModule[];
  };
}

export interface AssignPermissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (permissions: { submodule: string; access: "read" | "write" }[]) => void;
  role: Role | null;
  isLoading?: boolean;
}

export interface CreateRoleRequest {
  name: string;
  description?: string;
  status?: "active" | "inactive";
  is_active?: boolean;
  sort_order?: number;
}

export type UpdateRoleRequest = Partial<CreateRoleRequest>;

export interface GroupedPermissionModule {
  id: string
  module: string
  submodules: {
    id: string
    name: string
    slug: string
    description?: string
  }[]
}
export interface RolePermissionsFormProps {
  roleId: string
  onSave: (permissions: { submodule: string; access: 'read' | 'write' }[]) => Promise<void>
  isLoading?: boolean
}

export interface RoleFormProps {
  initialValues?: Role & { permissions: string[] }
  onSubmit: (values: CreateRoleRequest & { permission_ids: string[] }) => Promise<void>
  isLoading: boolean
  mode: 'create' | 'edit'
}

export interface PermissionPickerProps {
  permissions: Permission[]
  selectedIds: string[]
  onChange: (ids: string[]) => void
}
