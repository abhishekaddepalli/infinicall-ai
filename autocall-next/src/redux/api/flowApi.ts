import {
  CreateFlowPayload,
  FlowDeleteResponse,
  FlowDetailResponse,
  FlowListResponse,
  FlowMutationResponse,
  FlowTestResponse,
  GetFlowsParams,
  TestFlowPayload,
  UpdateFlowPayload,
} from '@/types/flow'
import { baseApi } from './baseApi'

export const flowApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getFlows: builder.query<FlowListResponse, GetFlowsParams>({
      query: (params) => ({ url: '/flows', params }),
      providesTags: ['Flow'],
    }),
    getFlowById: builder.query<FlowDetailResponse, string>({
      query: (id) => ({ url: `/flows/${id}` }),
      providesTags: (_result, _err, id) => [{ type: 'Flow', id }],
    }),
    createFlow: builder.mutation<FlowMutationResponse, CreateFlowPayload>({
      query: (body) => ({ url: '/flows/create', method: 'POST', body }),
      invalidatesTags: ['Flow', 'Dashboard'],
    }),
    updateFlow: builder.mutation<FlowMutationResponse, UpdateFlowPayload>({
      query: ({ id, ...body }) => ({ url: `/flows/${id}`, method: 'PUT', body }),
      invalidatesTags: (_result, _err, { id }) => ['Flow', { type: 'Flow', id }, 'Dashboard'],
    }),
    deleteFlow: builder.mutation<FlowDeleteResponse, string>({
      query: (id) => ({ url: `/flows/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Flow', 'Dashboard'],
    }),
    bulkDeleteFlows: builder.mutation<FlowDeleteResponse, { ids: string[] }>({
      query: (body) => ({ url: '/flows/bulk-delete', method: 'DELETE', body }),
      invalidatesTags: ['Flow', 'Dashboard'],
    }),
    testFlow: builder.mutation<FlowTestResponse, TestFlowPayload>({
      query: (body) => ({ url: '/flows/test', method: 'POST', body }),
    }),
    uploadAudio: builder.mutation<{ success: boolean; message: string; filePath: string }, FormData>({
      query: (body) => ({ url: '/flows/upload-audio', method: 'POST', body }),
    }),
  }),
})

export const {
  useGetFlowsQuery,
  useGetFlowByIdQuery,
  useCreateFlowMutation,
  useUpdateFlowMutation,
  useDeleteFlowMutation,
  useBulkDeleteFlowsMutation,
  useTestFlowMutation,
  useUploadAudioMutation,
} = flowApi
