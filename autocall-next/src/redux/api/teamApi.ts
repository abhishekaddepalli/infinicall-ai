import { 
  GetTeamsParams, 
  GetTeamsResponse, 
  CreateTeamRequest, 
  UpdateTeamRequest, 
  GetTeamByIdResponse,
  GetTeamPermissionsResponse
} from '@/types/team';
import { baseApi } from './baseApi'

export const teamApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getTeams: builder.query<GetTeamsResponse, GetTeamsParams>({
      query: (params) => ({
        url: '/teams',
        params,
      }),
      providesTags: ['Team' as any],
    }),
    
    getTeamById: builder.query<GetTeamByIdResponse, string>({
      query: (id) => ({
        url: `/teams/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Team' as any, id }],
    }),

    createTeam: builder.mutation<any, CreateTeamRequest>({
      query: (body) => ({
        url: '/teams/create',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Team' as any],
    }),

    updateTeam: builder.mutation<any, { id: string; data: UpdateTeamRequest }>({
      query: ({ id, data }) => ({
        url: `/teams/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Team' as any, id }, 'Team' as any],
    }),

    deleteTeam: builder.mutation<any, { ids: string[] }>({
      query: (body) => ({
        url: `/teams/delete`,
        method: 'DELETE',
        body,
      }),
      invalidatesTags: ['Team' as any],
    }),

    toggleTeamStatus: builder.mutation<any, string>({
      query: (id) => ({
        url: `/teams/${id}/toggle-status`,
        method: 'PATCH',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Team' as any, id }, 'Team' as any],
    }),

    getTeamPermissions: builder.query<GetTeamPermissionsResponse, void>({
      query: () => ({
        url: '/teams/permissions',
        method: 'GET',
      }),
      providesTags: ['Permission'],
    }),
  }),
})

export const {
  useGetTeamsQuery,
  useGetTeamByIdQuery,
  useCreateTeamMutation,
  useUpdateTeamMutation,
  useDeleteTeamMutation,
  useToggleTeamStatusMutation,
  useGetTeamPermissionsQuery,
} = teamApi
