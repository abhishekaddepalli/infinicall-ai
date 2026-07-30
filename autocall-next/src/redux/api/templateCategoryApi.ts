import { TemplateCategory, TemplateCategoryResponse } from '@/types/prompt-template';
import { baseApi } from './baseApi'

export const templateCategoryApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getTemplateCategories: builder.query<TemplateCategoryResponse, any>({
      query: (params) => ({
        url: '/template-category',
        params: { ...params, self: true },
      }),
      providesTags: ['TemplateCategory'],
    }),
    createTemplateCategory: builder.mutation<any, Partial<TemplateCategory>>({
      query: (data) => ({
        url: '/template-category',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['TemplateCategory'],
    }),
    updateTemplateCategory: builder.mutation<any, { id: string; data: Partial<TemplateCategory> }>({
      query: ({ id, data }) => ({
        url: `/template-category/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['TemplateCategory'],
    }),
    deleteTemplateCategories: builder.mutation<any, { ids: string[] }>({
      query: (data) => ({
        url: '/template-category/delete',
        method: 'DELETE',
        body: data,
      }),
      invalidatesTags: ['TemplateCategory'],
    }),
  }),
})

export const {
  useGetTemplateCategoriesQuery,
  useCreateTemplateCategoryMutation,
  useUpdateTemplateCategoryMutation,
  useDeleteTemplateCategoriesMutation,
} = templateCategoryApi
