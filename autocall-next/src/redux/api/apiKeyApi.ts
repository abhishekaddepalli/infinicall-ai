import { ApiKeyListResponse, ApiKeyMutationResponse } from '@/types/api-key';
import { baseApi } from './baseApi';

export const apiKeyApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getApiKeys: builder.query<ApiKeyListResponse, { page?: number; limit?: number; search?: string; self?: boolean; sortBy?: string; sortOrder?: string }>({
      query: ({ self, ...params }) => ({
        url: self ? '/api-keys/self' : '/api-keys',
        params,
      }),
      providesTags: ['ApiKey'],
    }),
    createApiKey: builder.mutation<ApiKeyMutationResponse, { name: string; permissions: string[] }>({
      query: (body) => ({
        url: '/api-keys/create',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['ApiKey'],
    }),
    regenerateApiKey: builder.mutation<ApiKeyMutationResponse, string>({
      query: (id) => ({
        url: `/api-keys/${id}/regenerate`,
        method: 'PUT',
      }),
      invalidatesTags: ['ApiKey'],
    }),
    updateApiKeyStatus: builder.mutation<{ success: boolean; message: string }, { id: string; is_active: boolean }>({
      query: ({ id, is_active }) => ({
        url: `/api-keys/${id}/status`,
        method: 'PUT',
        body: { is_active },
      }),
      invalidatesTags: ['ApiKey'],
    }),
    deleteApiKey: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `/api-keys/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['ApiKey'],
    }),
    getApiKeyById: builder.query<{ success: boolean; apiKeys: any[] }, string>({
      query: (id) => ({
        url: `/api-keys/${id}`,
      }),
      providesTags: (result, error, id) => [{ type: 'ApiKey', id }],
    }),
  }),
});

export const {
  useGetApiKeysQuery,
  useCreateApiKeyMutation,
  useRegenerateApiKeyMutation,
  useUpdateApiKeyStatusMutation,
  useDeleteApiKeyMutation,
  useGetApiKeyByIdQuery,
} = apiKeyApi;
