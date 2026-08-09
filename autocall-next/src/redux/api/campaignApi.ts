import { 
  Campaign, 
  CampaignResponse, 
  CampaignType, 
  CampaignTypeResponse, 
  CampaignHistoryResponse 
} from '@/types/campaign'
import { baseApi } from './baseApi'

export const campaignApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // Campaign Types Endpoints
    getCampaignTypes: builder.query<CampaignTypeResponse, { page?: number; limit?: number; search?: string; sortBy?: string; sortOrder?: string }>({
      query: (params) => ({
        url: '/campaign-type',
        params,
      }),
      providesTags: ['CampaignType'],
    }),
    getCampaignTypeById: builder.query<{ campaignType: CampaignType }, string>({
      query: (id) => `/campaign-type/${id}`,
      providesTags: (_result, _err, id) => [{ type: 'CampaignType', id }],
    }),
    createCampaignType: builder.mutation<any, Partial<CampaignType>>({
      query: (data) => ({
        url: '/campaign-type/create',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['CampaignType'],
    }),
    updateCampaignType: builder.mutation<any, { id: string; data: Partial<CampaignType> }>({
      query: ({ id, data }) => ({
        url: `/campaign-type/${id}/update`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _err, { id }) => ['CampaignType', { type: 'CampaignType', id }],
    }),
    updateCampaignTypeStatus: builder.mutation<any, string>({
      query: (id) => ({
        url: `/campaign-type/${id}/update-status`,
        method: 'PUT',
      }),
      invalidatesTags: ['CampaignType'],
    }),
    deleteCampaignTypes: builder.mutation<any, { ids: string[] }>({
      query: (data) => ({
        url: '/campaign-type/delete',
        method: 'DELETE',
        body: data,
      }),
      invalidatesTags: ['CampaignType'],
    }),

    // Campaigns Endpoints
    getCampaigns: builder.query<CampaignResponse, { page?: number; limit?: number; search?: string }>({
      query: (params) => ({
        url: '/campaigns',
        params,
      }),
      providesTags: ['Campaign'],
    }),
    getCampaignById: builder.query<{ success: boolean; data: Campaign }, string>({
      query: (id) => `/campaigns/${id}`,
      providesTags: (_result, _err, id) => [{ type: 'Campaign', id }],
    }),
    createCampaign: builder.mutation<any, FormData | any>({
      query: (data) => ({
        url: '/campaigns/create',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Campaign', 'Dashboard'],
    }),
    updateCampaign: builder.mutation<any, { id: string; data: FormData | any }>({
      query: ({ id, data }) => ({
        url: `/campaigns/${id}/update`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _err, { id }) => ['Campaign', { type: 'Campaign', id }, 'Dashboard'],
    }),
    deleteCampaign: builder.mutation<any, string>({
      query: (id) => ({
        url: `/campaigns/${id}/delete`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Campaign', 'Dashboard'],
    }),
    getCampaignHistory: builder.query<CampaignHistoryResponse, string>({
      query: (id) => `/campaigns/${id}/history`,
      providesTags: (_result, _err, id) => [{ type: 'Campaign', id }],
    }),
  }),
})

export const {
  useGetCampaignTypesQuery,
  useGetCampaignTypeByIdQuery,
  useCreateCampaignTypeMutation,
  useUpdateCampaignTypeMutation,
  useUpdateCampaignTypeStatusMutation,
  useDeleteCampaignTypesMutation,
  useGetCampaignsQuery,
  useGetCampaignByIdQuery,
  useCreateCampaignMutation,
  useUpdateCampaignMutation,
  useDeleteCampaignMutation,
  useGetCampaignHistoryQuery,
} = campaignApi
