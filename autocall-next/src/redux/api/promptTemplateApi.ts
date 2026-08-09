import { PromptTemplate, PromptTemplateResponse } from '@/types/prompt-template';
import { baseApi } from './baseApi'

export const promptTemplateApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getPromptTemplates: builder.query<PromptTemplateResponse, any>({
      query: (params) => ({
        url: '/prompt-template',
        params: { ...params, self: true },
      }),
      providesTags: ['PromptTemplate'],
    }),
    createPromptTemplate: builder.mutation<any, Partial<PromptTemplate>>({
      query: (data) => ({
        url: '/prompt-template',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['PromptTemplate'],
    }),
    updatePromptTemplate: builder.mutation<any, { id: string; data: Partial<PromptTemplate> }>({
      query: ({ id, data }) => ({
        url: `/prompt-template/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['PromptTemplate'],
    }),
    deletePromptTemplates: builder.mutation<any, { ids: string[] }>({
      query: (data) => ({
        url: '/prompt-template/delete',
        method: 'DELETE',
        body: data,
      }),
      invalidatesTags: ['PromptTemplate'],
    }),
  }),
})

export const {
  useGetPromptTemplatesQuery,
  useCreatePromptTemplateMutation,
  useUpdatePromptTemplateMutation,
  useDeletePromptTemplatesMutation,
} = promptTemplateApi
