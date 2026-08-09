import { baseApi as api } from '@/redux/api/baseApi'
import {
  ApiResponse,
  CreateRestrictedWordPayload,
  RestrictedWord,
  TakeActionPayload,
  UpdateRestrictedWordPayload,
} from '@/types/restricted-words'

export const restrictedWordsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getRestrictedWords: builder.query<ApiResponse<RestrictedWord[]> & { pagination?: any }, { page?: number; limit?: number; search?: string }>({
      query: (params) => ({
        url: '/restricted-words',
        method: 'GET',
        params,
      }),
      providesTags: ['RestrictedWords'],
    }),
    createRestrictedWord: builder.mutation<ApiResponse<RestrictedWord>, CreateRestrictedWordPayload>({
      query: (body) => ({
        url: '/restricted-words/create',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['RestrictedWords'],
    }),
    updateRestrictedWord: builder.mutation<ApiResponse<RestrictedWord>, UpdateRestrictedWordPayload>({
      query: ({ id, ...body }) => ({
        url: `/restricted-words/${id}/update`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['RestrictedWords'],
    }),
    deleteRestrictedWord: builder.mutation<ApiResponse<null>, string>({
      query: (id) => ({
        url: `/restricted-words/${id}/delete`,
        method: 'DELETE',
      }),
      invalidatesTags: ['RestrictedWords'],
    }),


    scanCallTranscript: builder.mutation<ApiResponse<{ violations: string[] }>, string>({
      query: (call_id) => ({
        url: `/restricted-words/users/${call_id}/scan`,
        method: 'POST',
      }),
      invalidatesTags: ['CallLogs'],
    }),
    takeAction: builder.mutation<ApiResponse<null>, TakeActionPayload>({
      query: ({ id, action }) => ({
        url: `/restricted-words/users/${id}/action`,
        method: 'POST',
        body: { action },
      }),
      invalidatesTags: ['CallLogs'],
    }),
  }),
})

export const {
  useGetRestrictedWordsQuery,
  useCreateRestrictedWordMutation,
  useUpdateRestrictedWordMutation,
  useDeleteRestrictedWordMutation,
  useScanCallTranscriptMutation,
  useTakeActionMutation,
} = restrictedWordsApi
