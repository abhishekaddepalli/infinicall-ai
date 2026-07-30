import {
  AgentDeleteResponse,
  AgentDetailResponse,
  AgentListResponse,
  AgentMutationResponse,
  CreateAgentPayload,
  GetAgentsParams,
  UpdateAgentPayload
} from '@/types/agent'
import { baseApi } from './baseApi'

export const agentApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getAgents: builder.query<AgentListResponse, GetAgentsParams>({
      query: (params) => ({ url: '/agents', params }),
      providesTags: ['Agent'],
    }),
    getAgentById: builder.query<AgentDetailResponse, string>({
      query: (id) => ({ url: `/agents/${id}` }),
      providesTags: (_result, _err, id) => [{ type: 'Agent', id }],
    }),
    createAgent: builder.mutation<AgentMutationResponse, CreateAgentPayload>({
      query: (body) => ({ url: '/agents/create', method: 'POST', body }),
      invalidatesTags: ['Agent', 'Dashboard'],
    }),
    updateAgent: builder.mutation<AgentMutationResponse, UpdateAgentPayload>({
      query: ({ id, ...body }) => ({ url: `/agents/${id}`, method: 'PUT', body }),
      invalidatesTags: (_result, _err, { id }) => ['Agent', { type: 'Agent', id }, 'Dashboard'],
    }),
    deleteAgent: builder.mutation<AgentDeleteResponse, string>({
      query: (id) => ({ url: `/agents/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Agent', 'Dashboard'],
    }),
    bulkDeleteAgents: builder.mutation<AgentDeleteResponse, { ids: string[] }>({
      query: (body) => ({ url: '/agents/bulk-delete', method: 'DELETE', body }),
      invalidatesTags: ['Agent', 'Dashboard'],
    }),
  }),
})

export const {
  useGetAgentsQuery,
  useGetAgentByIdQuery,
  useCreateAgentMutation,
  useUpdateAgentMutation,
  useDeleteAgentMutation,
  useBulkDeleteAgentsAgentsMutation, // RTK Query naming can get long
  useBulkDeleteAgentsMutation,
} = agentApi as any // Using as any to avoid complex naming issues for now
