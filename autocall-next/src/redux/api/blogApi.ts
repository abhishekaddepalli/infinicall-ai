import { Blog, BlogResponse } from '@/types/blog';
import { baseApi } from './baseApi'

export const blogApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getBlogs: builder.query<BlogResponse, any>({
      query: (params) => ({
        url: '/blog',
        params,
      }),
      providesTags: ['Blog'],
    }),
    getBlogBySlug: builder.query<Blog, string>({
      query: (slug) => `/blog/slug/${slug}`,
      providesTags: (result, error, slug) => [{ type: 'Blog', id: slug }],
    }),
    getBlogById: builder.query<Blog, string>({
      query: (id) => `/blog/${id}`,
      providesTags: (result, error, id) => [{ type: 'Blog', id }],
    }),
    createBlog: builder.mutation<any, any>({
      query: (data) => ({
        url: '/blog',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Blog'],
    }),
    updateBlog: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/blog/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => ['Blog', { type: 'Blog', id }],
    }),
    deleteBlog: builder.mutation<any, string>({
      query: (id) => ({
        url: `/blog/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Blog'],
    }),
  }),
})

export const {
  useGetBlogsQuery,
  useGetBlogBySlugQuery,
  useGetBlogByIdQuery,
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
} = blogApi
