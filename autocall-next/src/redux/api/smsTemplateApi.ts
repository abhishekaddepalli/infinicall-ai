import { baseApi } from './baseApi';

export const smsTemplateApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getSmsTemplates: builder.query<any, { search?: string, status?: string }>({
      query: (params: any) => ({
        url: '/sms-templates/self',
        params,
      }),
      providesTags: ['SmsTemplate'],
    }),
    createSmsTemplate: builder.mutation<any, any>({
      query: (data) => ({
        url: '/sms-templates/create',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['SmsTemplate'],
    }),
    updateSmsTemplate: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/sms-templates/${id}/update`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['SmsTemplate'],
    }),
    deleteSmsTemplate: builder.mutation<any, string>({
      query: (id) => ({
        url: `/sms-templates/${id}/delete`,
        method: 'DELETE',
      }),
      invalidatesTags: ['SmsTemplate'],
    }),
  }),
});

export const {
  useGetSmsTemplatesQuery,
  useCreateSmsTemplateMutation,
  useUpdateSmsTemplateMutation,
  useDeleteSmsTemplateMutation,
} = smsTemplateApi;
