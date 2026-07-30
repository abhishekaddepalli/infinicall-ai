import { ApiResponse } from '@/types/team'
import { AddTeamMemberRequest, RemoveTeamMemberRequest, RemoveTeamMemberResponse, TeamMember } from '@/types/teamMember'
import { baseApi } from './baseApi'

export const teamMemberApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTeamMembers: builder.query<ApiResponse<TeamMember[]>, string>({
      query: (teamId) => ({
        url: `/team-members/${teamId}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'TeamMember' as any, id: `LIST-${id}` }, 'TeamMember' as any],
    }),
    getAllTeamMembers: builder.query<ApiResponse<TeamMember[]>, void>({
      query: () => ({
        url: `/team-members/all`,
        method: 'GET',
      }),
      providesTags: ['TeamMember' as any],
    }),
    getTransferTeams: builder.query<ApiResponse<any[]>, void>({
      query: () => ({
        url: `/team-members/transfer-teams`,
        method: 'GET',
      }),
      providesTags: ['Team' as any],
    }),
    addTeamMember: builder.mutation<ApiResponse<TeamMember>, AddTeamMemberRequest>({
      query: (data) => ({
        url: `/team-members/add`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (result, error, { teamId }) => [
        { type: 'TeamMember' as any, id: `LIST-${teamId}` },
        { type: 'TeamMember' as any, id: `TRANSFER-${teamId}` },
        'TeamMember' as any,
      ],
    }),
    removeTeamMember: builder.mutation<RemoveTeamMemberResponse, RemoveTeamMemberRequest>({
      query: (data) => ({
        url: `/team-members/remove`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (result, error, { teamId }) => [
        { type: 'TeamMember' as any, id: `LIST-${teamId}` },
        { type: 'TeamMember' as any, id: `TRANSFER-${teamId}` },
        'TeamMember' as any,
      ],
    }),
  }),
})

export const {
  useGetTeamMembersQuery,
  useGetAllTeamMembersQuery,
  useLazyGetTeamMembersQuery,
  useGetTransferTeamsQuery,
  useAddTeamMemberMutation,
  useRemoveTeamMemberMutation,
} = teamMemberApi
