import { Category } from '@/types/blog';
import { baseApi } from './baseApi'

export const categoryApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getCategories: builder.query<{ categories: Category[] }, any>({
      query: (params) => ({
        url: '/blog-category',
        params,
      }),
      providesTags: ['Category'],
    }),
    getCategoryById: builder.query<Category, string>({
      query: (id) => `/category/${id}`,
      providesTags: (result, error, id) => [{ type: 'Category', id }],
    }),
    createCategory: builder.mutation<any, Partial<Category>>({
      query: (data) => ({
        url: '/blog-category',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Category'],
    }),
    updateCategory: builder.mutation<any, { id: string; data: Partial<Category> }>({
      query: ({ id, data }) => ({
        url: `/blog-category/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => ['Category', { type: 'Category', id }],
    }),
    deleteCategory: builder.mutation<any, string>({
      query: (id) => ({
        url: `/blog-category/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Category'],
    }),
  }),
})

export const {
  useGetCategoriesQuery,
  useGetCategoryByIdQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi
