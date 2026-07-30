import { Form, FormResponse, SingleFormResponse, FormSubmissionsResponse } from '@/types/form';
import { baseApi } from './baseApi'

export const formApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getForms: builder.query<FormResponse, { page?: number; limit?: number; search?: string; status?: string; sortBy?: string; sortOrder?: string }>({
      query: (params) => ({
        url: '/forms',
        params,
      }),
      providesTags: ['Form'],
    }),
    getForm: builder.query<SingleFormResponse, string>({
      query: (id) => ({
        url: `/forms/${id}`,
      }),
      providesTags: (result, error, id) => [{ type: 'Form', id }],
    }),
    getFormResponses: builder.query<FormSubmissionsResponse, string>({
      query: (id) => ({
        url: `/forms/${id}/responses`,
      }),
      providesTags: (result, error, id) => [{ type: 'Form', id }],
    }),
    createForm: builder.mutation<SingleFormResponse, Partial<Form>>({
      query: (data) => ({
        url: '/forms',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Form'],
    }),
    updateForm: builder.mutation<SingleFormResponse, { id: string; data: Partial<Form> }>({
      query: ({ id, data }) => ({
        url: `/forms/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => ['Form', { type: 'Form', id }],
    }),
    deleteForms: builder.mutation<any, { formIds: string[] }>({
      query: (data) => ({
        url: '/forms/delete',
        method: 'DELETE',
        body: data,
      }),
      invalidatesTags: ['Form'],
    }),
  }),
})

export const {
  useGetFormsQuery,
  useGetFormQuery,
  useCreateFormMutation,
  useUpdateFormMutation,
  useDeleteFormsMutation,
  useGetFormResponsesQuery,
} = formApi
