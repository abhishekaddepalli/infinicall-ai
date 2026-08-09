import { GenericResponse } from '@/types/api'
import { baseApi } from './baseApi'
import { SMSAgent } from '@/types/sms-campaign';

export const smsAgentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSMSAgents: builder.query<
      { success: boolean; data: SMSAgent[]; total: number; page: number; limit: number },
      { page: number; limit: number; search?: string; status?: string }
    >({
      query: (params) => ({
        url: '/sms-agents/self',
        params,
      }),
      providesTags: ['SMSAgent'],
    }),
    getSMSAgentById: builder.query<{ success: boolean; data: SMSAgent }, string>({
      query: (id) => ({
        url: `/sms-agents/${id}`,
      }),
      providesTags: (result, error, id) => [{ type: 'SMSAgent' as any, id }],
    }),
    createSMSAgent: builder.mutation<GenericResponse, any>({
      query: (data) => ({
        url: '/sms-agents/create',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['SMSAgent', 'Dashboard'],
    }),
    updateSMSAgent: builder.mutation<GenericResponse, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/sms-agents/${id}/update`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['SMSAgent', 'Dashboard'],
    }),
    deleteSMSAgent: builder.mutation<GenericResponse, string>({
      query: (id) => ({
        url: `/sms-agents/${id}/delete`,
        method: 'DELETE',
      }),
      invalidatesTags: ['SMSAgent', 'Dashboard'],
    }),
    bulkDeleteSMSAgents: builder.mutation<GenericResponse, { ids: string[] }>({
      query: (data) => ({
        url: '/sms-agents/bulk-delete',
        method: 'DELETE',
        body: data,
      }),
      invalidatesTags: ['SMSAgent', 'Dashboard'],
    }),
  }),
})

export const {
  useGetSMSAgentsQuery,
  useCreateSMSAgentMutation,
  useUpdateSMSAgentMutation,
  useDeleteSMSAgentMutation,
  useBulkDeleteSMSAgentsMutation,
} = smsAgentApi
