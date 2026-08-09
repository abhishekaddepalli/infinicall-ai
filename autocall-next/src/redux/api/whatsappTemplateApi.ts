import { baseApi } from './baseApi';

export const whatsappTemplateApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getTemplates: builder.query<any, { waba_id: string; search?: string; status?: string }>({
      query: (params) => ({
        url: '/whatsapp-template',
        params,
      }),
      providesTags: ['WhatsAppTemplate'],
    }),
    getTemplateById: builder.query<any, string>({
      query: (id) => ({
        url: `/whatsapp-template/${id}`,
      }),
      providesTags: (result, error, id) => [{ type: 'WhatsAppTemplate', id }],
    }),
    getMetaTemplatesList: builder.query<any, { waba_id: string }>({
      query: (params) => ({
        url: '/whatsapp-template/meta-list',
        params,
      }),
    }),
    createTemplate: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: '/whatsapp-template/create',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['WhatsAppTemplate'],
    }),
    updateTemplate: builder.mutation<any, { id: string; data: FormData }>({
      query: ({ id, data }) => ({
        url: `/whatsapp-template/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'WhatsAppTemplate', id }, 'WhatsAppTemplate'],
    }),
    deleteTemplate: builder.mutation<any, string>({
      query: (id) => ({
        url: `/whatsapp-template/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['WhatsAppTemplate'],
    }),
    syncTemplates: builder.mutation<any, { waba_id: string; meta_template_ids: string[] }>({
      query: (body) => ({
        url: '/whatsapp-template/sync',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['WhatsAppTemplate'],
    }),
    syncTemplatesStatus: builder.mutation<any, { waba_id: string }>({
      query: (body) => ({
        url: '/whatsapp-template/sync-status',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['WhatsAppTemplate'],
    }),
  }),
});

export const {
  useGetTemplatesQuery,
  useGetTemplateByIdQuery,
  useGetMetaTemplatesListQuery,
  useCreateTemplateMutation,
  useUpdateTemplateMutation,
  useDeleteTemplateMutation,
  useSyncTemplatesMutation,
  useSyncTemplatesStatusMutation,
} = whatsappTemplateApi;
