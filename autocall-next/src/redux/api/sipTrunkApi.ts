import {
  CreateSipTrunkPayload,
  SipTrunkListParams,
  SipTrunkListResponse,
  SipTrunkMutationResponse,
  UpdateSipTrunkPayload,
} from '@/types/sip-trunk';
import { baseApi } from './baseApi';

export const sipTrunkApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getSipTrunks: builder.query<SipTrunkListResponse, SipTrunkListParams | void>({
      query: (params) => ({
        url: '/sip-trunks',
        params: params || {},
      }),
      providesTags: ['SipTrunk'],
    }),
    createSipTrunk: builder.mutation<SipTrunkMutationResponse, CreateSipTrunkPayload>({
      query: (body) => ({
        url: '/sip-trunks/add',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['SipTrunk'],
    }),
    updateSipTrunk: builder.mutation<
      SipTrunkMutationResponse,
      { id: string; body: UpdateSipTrunkPayload }
    >({
      query: ({ id, body }) => ({
        url: `/sip-trunks/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['SipTrunk'],
    }),
    deleteSipTrunk: builder.mutation<SipTrunkMutationResponse, string>({
      query: (id) => ({
        url: `/sip-trunks/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['SipTrunk'],
    }),
  }),
})

export const {
  useGetSipTrunksQuery,
  useCreateSipTrunkMutation,
  useUpdateSipTrunkMutation,
  useDeleteSipTrunkMutation,
} = sipTrunkApi
