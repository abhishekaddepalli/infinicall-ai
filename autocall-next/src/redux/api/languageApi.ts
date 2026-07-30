import { LanguageResponse } from '@/types/language';
import { baseApi } from './baseApi';

export const languageApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getLanguages: builder.query<LanguageResponse, any>({
      query: (params) => ({
        url: '/language',
        params,
      }),
      providesTags: ['Language'],
    }),
    getActiveLanguages: builder.query<LanguageResponse, any>({
      query: (params) => ({
        url: '/language',
        params: { ...params, is_active: 'true' },
      }),
      providesTags: ['Language'],
    }),
    getLanguageById: builder.query<any, string>({
      query: (id) => `/language/${id}`,
      providesTags: ['Language'],
    }),
    createLanguage: builder.mutation<any, FormData>({
      query: (body) => ({
        url: '/language',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Language'],
    }),
    updateLanguage: builder.mutation<any, { id: string; data: FormData }>({
      query: ({ id, data }) => ({
        url: `/language/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Language'],
    }),
    updateLanguageStatus: builder.mutation<any, { id: string }>({
      query: ({ id }) => ({
        url: `/language/${id}/toggle-status`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Language'],
    }),
    toggleDefaultLanguage: builder.mutation<any, string>({
      query: (id) => ({
        url: `/language/${id}/toggle-default`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Language'],
    }),
    deleteLanguages: builder.mutation<any, { ids: string[] }>({
      query: (body) => ({
        url: '/language',
        method: 'DELETE',
        body,
      }),
      invalidatesTags: ['Language'],
    }),
    getTranslations: builder.query<any, string>({
      query: (locale) => `/language/${locale}/translations`,
    }),
    updateTranslations: builder.mutation<any, { locale: string; translations: any }>({
      query: ({ locale, translations }) => ({
        url: `/language/${locale}/translations`,
        method: 'PUT',
        body: { translations },
      }),
    }),
  }),
})

export const {
  useGetLanguagesQuery,
  useGetActiveLanguagesQuery,
  useGetLanguageByIdQuery,
  useCreateLanguageMutation,
  useUpdateLanguageMutation,
  useUpdateLanguageStatusMutation,
  useToggleDefaultLanguageMutation,
  useDeleteLanguagesMutation,
  useGetTranslationsQuery,
  useUpdateTranslationsMutation,
} = languageApi
