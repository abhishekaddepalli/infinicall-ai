import { 
  GetPermissionsResponse, 
  GroupedPermissionsResponse,
  GetRolesParams, 
  GetRolesResponse, 
  CreateRoleRequest, 
  UpdateRoleRequest, 
  GetRoleByIdResponse,
  GetActiveRolesResponse
} from '@/types/role';
import { baseApi } from './baseApi'

export const roleApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getRoles: builder.query<GetRolesResponse, GetRolesParams>({
      query: (params) => ({
        url: '/role',
        params,
      }),
      providesTags: ['Role'],
    }),

    getActiveRoles: builder.query<GetActiveRolesResponse, void>({
      query: () => ({
        url: '/role/active/all',
        method: 'GET',
      }),
      providesTags: ['Role'],
    }),
    
    getRoleById: builder.query<GetRoleByIdResponse, string>({
      query: (id) => ({
        url: `/role/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Role' as const, id }],
    }),

    createRole: builder.mutation<any, CreateRoleRequest>({
      query: (body) => ({
        url: '/role',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Role'],
    }),

    updateRole: builder.mutation<any, { id: string; data: UpdateRoleRequest }>({
      query: ({ id, data }) => ({
        url: `/role/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Role', id }, 'Role'],
    }),

    deleteRole: builder.mutation<any, string | { ids: string[] }>({
      query: (arg) => {
        const isBulk = typeof arg !== 'string'
        return {
          url: `/role/${isBulk ? 'bulk' : arg}`,
          method: 'DELETE',
          body: isBulk ? arg : undefined,
        }
      },
      invalidatesTags: ['Role'],
    }),

    getAllPermissions: builder.query<GetPermissionsResponse, void>({
      query: () => ({
        url: '/role/permissions/all',
        method: 'GET',
      }),
      providesTags: ['Permission'],
    }),

    getPermissions: builder.query<GroupedPermissionsResponse, any>({
      query: (params) => ({
        url: '/role/permissions/all',
        params,
      }),
      transformResponse: (response: { success: boolean; data: any[] }) => {
        if (!response.success || !response.data) return { success: true, data: { permissions: [] } };
        
        // Group submodules by their module name (second part of slug)
        const moduleMap: Record<string, any> = {};
        
        response.data.forEach((perm) => {
          const parts = perm.slug.split('.');
          const moduleName = parts[1] || 'general';
          const action = parts[0];
          
          if (!moduleMap[moduleName]) {
            moduleMap[moduleName] = {
              id: moduleName,
              module: moduleName,
              submodules: [],
            };
          }
          
          moduleMap[moduleName].submodules.push({
            id: perm.id,
            name: perm.name,
            slug: perm.slug,
            access: action === 'write' ? 'write' : 'read',
          });
        });
        
        return {
          success: true,
          data: {
            permissions: Object.values(moduleMap),
          },
        };
      },
      providesTags: ['Permission'],
    }),

    getRolePermissions: builder.query<any, string>({
      query: (id) => ({
        url: `/role/${id}/permissions`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Permission' as const, id }],
    }),

    updateRolePermissions: builder.mutation<any, { id: string; permission_ids: string[] }>({
      query: ({ id, permission_ids }) => ({
        url: `/role/${id}/permissions`,
        method: 'PUT',
        body: { permission_ids },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Role', id }, 'Role'],
    }),
  }),
})

export const {
  useGetRolesQuery,
  useGetActiveRolesQuery,
  useGetRoleByIdQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
  useGetAllPermissionsQuery,
  useGetPermissionsQuery,
  useGetRolePermissionsQuery,
  useUpdateRolePermissionsMutation,
} = roleApi
