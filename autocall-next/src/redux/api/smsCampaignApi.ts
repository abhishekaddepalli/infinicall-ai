import { baseApi } from './baseApi';

export const smsCampaignApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getSmsCampaigns: builder.query<any, void | { search?: string; page?: number; limit?: number }>({
      query: (params: any) => ({
        url: '/sms-campaigns',
        params,
      }),
      providesTags: ['SmsCampaign'],
    }),
    getSmsCampaignById: builder.query<any, string>({
      query: (id) => ({
        url: `/sms-campaigns/${id}`,
      }),
      providesTags: ['SmsCampaign'],
    }),
    getSmsCampaignHistory: builder.query<any, { id: string; search?: string; page?: number; limit?: number }>({
      query: ({ id, ...params }) => ({
        url: `/sms-campaigns/${id}/history`,
        params,
      }),
      providesTags: ['SmsCampaign'],
    }),
    createSmsCampaign: builder.mutation<any, FormData>({
      query: (data) => ({
        url: '/sms-campaigns/create',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['SmsCampaign'],
    }),
    updateSmsCampaign: builder.mutation<any, { id: string; data: FormData }>({
      query: ({ id, data }) => ({
        url: `/sms-campaigns/${id}/update`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['SmsCampaign'],
    }),
    deleteSmsCampaign: builder.mutation<any, string>({
      query: (id) => ({
        url: `/sms-campaigns/${id}/delete`,
        method: 'DELETE',
      }),
      invalidatesTags: ['SmsCampaign'],
    }),
  }),
});

export const {
  useGetSmsCampaignsQuery,
  useGetSmsCampaignByIdQuery,
  useGetSmsCampaignHistoryQuery,
  useCreateSmsCampaignMutation,
  useUpdateSmsCampaignMutation,
  useDeleteSmsCampaignMutation,
} = smsCampaignApi;
