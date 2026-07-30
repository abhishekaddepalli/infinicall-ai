import { Testimonial, TestimonialResponse } from '@/types/testimonial'
import { baseApi } from './baseApi'

export const testimonialApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getTestimonials: builder.query<TestimonialResponse, any>({
      query: (params) => ({
        url: '/testimonial/list',
        params,
      }),
      providesTags: ['Testimonial'],
    }),
    getActiveTestimonials: builder.query<TestimonialResponse, void>({
      query: () => '/testimonial/all',
      providesTags: ['Testimonial'],
    }),
    getTestimonial: builder.query<{ testimonial: Testimonial }, string>({
      query: (id) => `/testimonial/${id}`,
      providesTags: (result, error, id) => [{ type: 'Testimonial', id }],
    }),
    createTestimonial: builder.mutation<any, FormData>({
      query: (data) => ({
        url: '/testimonial/create',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Testimonial'],
    }),
    updateTestimonial: builder.mutation<any, { id: string; data: FormData }>({
      query: ({ id, data }) => ({
        url: `/testimonial/${id}/update`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => ['Testimonial', { type: 'Testimonial', id }],
    }),
    updateTestimonialStatus: builder.mutation<any, { id: string; status: boolean }>({
      query: ({ id, status }) => ({
        url: `/testimonial/${id}/update-status`,
        method: 'PUT',
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => ['Testimonial', { type: 'Testimonial', id }],
    }),
    deleteTestimonials: builder.mutation<any, { ids: string[] }>({
      query: (data) => ({
        url: '/testimonial/delete',
        method: 'DELETE',
        body: data,
      }),
      invalidatesTags: ['Testimonial'],
    }),
  }),
})

export const {
  useGetTestimonialsQuery,
  useGetActiveTestimonialsQuery,
  useGetTestimonialQuery,
  useCreateTestimonialMutation,
  useUpdateTestimonialMutation,
  useUpdateTestimonialStatusMutation,
  useDeleteTestimonialsMutation,
} = testimonialApi
