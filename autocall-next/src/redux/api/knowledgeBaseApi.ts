import { KnowledgeBaseItem, KnowledgeBaseParams, KnowledgeBaseResponse } from '@/types/knowledgeBase';
import { baseApi } from './baseApi'

export const knowledgeBaseApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getKnowledgeBase: builder.query<KnowledgeBaseResponse, KnowledgeBaseParams>({
      query: (params) => ({
        url: '/knowledgebase',
        params,
      }),
      providesTags: ['KnowledgeBase'],
    }),
    createKnowledgeBase: builder.mutation<{ message: string; data: KnowledgeBaseItem }, FormData>({
      query: (data) => ({
        url: '/knowledgebase/create',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['KnowledgeBase', 'Dashboard'],
    }),
    bulkDeleteKnowledgeBase: builder.mutation<{ message: string }, { ids: string[] }>({
      query: (body) => ({
        url: '/knowledgebase/bulk-delete',
        method: 'DELETE',
        body,
      }),
      invalidatesTags: ['KnowledgeBase', 'Dashboard'],
    }),
    editKnowledgeBase: builder.mutation<{ message: string; data: KnowledgeBaseItem }, { id: string; data: FormData }>({
      query: ({ id, data }) => ({
        url: `/knowledgebase/edit/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['KnowledgeBase', 'Dashboard'],
    }),
  }),
})

export const {
  useGetKnowledgeBaseQuery,
  useCreateKnowledgeBaseMutation,
  useBulkDeleteKnowledgeBaseMutation,
  useEditKnowledgeBaseMutation,
} = knowledgeBaseApi
