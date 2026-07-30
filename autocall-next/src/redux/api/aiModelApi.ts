import { AIModel } from '@/types/ai-modal';
import { baseApi } from './baseApi'

export const aiModelApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAiModels: builder.query<{ success: boolean; data: AIModel[] }, void>({
      query: () => ({
        url: '/ai-models',
      }),
      providesTags: ['AIModel'],
    }),
    getAiModel: builder.query<{ success: boolean; data: AIModel }, string>({
      query: (id) => ({
        url: `/ai-models/${id}`,
      }),
      providesTags: (result, error, id) => [{ type: 'AIModel', id }],
    }),
    createAiModel: builder.mutation<{ success: boolean; data: AIModel; message?: string }, Partial<AIModel>>({
      query: (body) => ({
        url: '/ai-models',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['AIModel'],
    }),
    updateAiModel: builder.mutation<{ success: boolean; data: AIModel; message?: string }, { id: string; body: Partial<AIModel> }>({
      query: ({ id, body }) => ({
        url: `/ai-models/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, { id }) => ['AIModel', { type: 'AIModel', id }],
    }),
    deleteAiModel: builder.mutation<{ success: boolean; message?: string }, string>({
      query: (id) => ({
        url: `/ai-models/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['AIModel'],
    }),
  }),
})

export const {
  useGetAiModelsQuery,
  useGetAiModelQuery,
  useCreateAiModelMutation,
  useUpdateAiModelMutation,
  useDeleteAiModelMutation,
} = aiModelApi
