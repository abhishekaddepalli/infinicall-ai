import { baseApi } from './baseApi';

export const emailLibraryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getEmailLibraryTemplates: builder.query<
      { data: any[]; total: number; page: number; limit: number },
      { page?: number; limit?: number; search?: string; type?: string }
    >({
      query: (params) => ({
        url: '/email-library',
        method: 'GET',
        params,
      }),
      providesTags: ['EmailLibrary'],
    }),
    getEmailLibraryTemplateById: builder.query<any, string>({
      query: (id) => ({
        url: `/email-library/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'EmailLibrary', id }],
    }),
    createEmailLibraryTemplate: builder.mutation<any, Partial<any>>({
      query: (body) => ({
        url: '/email-library',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['EmailLibrary'],
    }),
    updateEmailLibraryTemplate: builder.mutation<any, { id: string; data: Partial<any> }>({
      query: ({ id, data }) => ({
        url: `/email-library/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['EmailLibrary'],
    }),
    bulkDeleteEmailLibraryTemplates: builder.mutation<any, { ids: string[] }>({
      query: (body) => ({
        url: '/email-library/bulk-delete',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['EmailLibrary'],
    }),
  }),
})

export const {
  useGetEmailLibraryTemplatesQuery,
  useGetEmailLibraryTemplateByIdQuery,
  useCreateEmailLibraryTemplateMutation,
  useUpdateEmailLibraryTemplateMutation,
  useBulkDeleteEmailLibraryTemplatesMutation,
} = emailLibraryApi
