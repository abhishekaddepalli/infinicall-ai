import {
  ContactGroupListResponse,
  ContactGroupMutationResponse,
  CreateContactGroupPayload,
  UpdateContactGroupPayload
} from '@/types/contact-group'
import { baseApi } from './baseApi'

export const contactGroupApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getContactGroups: builder.query<ContactGroupListResponse, { page?: number; limit?: number; search?: string; sortBy?: string; sortOrder?: string }>({
      query: (params) => ({
        url: '/contact-groups',
        params,
      }),
      providesTags: ['ContactGroup'],
    }),
    createContactGroup: builder.mutation<ContactGroupMutationResponse, CreateContactGroupPayload>({
      query: (data) => ({
        url: '/contact-groups/create',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['ContactGroup'],
    }),
    updateContactGroup: builder.mutation<ContactGroupMutationResponse, UpdateContactGroupPayload>({
      query: ({ id, data }) => ({
        url: `/contact-groups/${id}/update`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['ContactGroup'],
    }),
    deleteContactGroup: builder.mutation<ContactGroupMutationResponse, string>({
      query: (id) => ({
        url: `/contact-groups/${id}/delete`,
        method: 'DELETE',
      }),
      invalidatesTags: ['ContactGroup'],
    }),
  }),
})

export const {
  useGetContactGroupsQuery,
  useCreateContactGroupMutation,
  useUpdateContactGroupMutation,
  useDeleteContactGroupMutation,
} = contactGroupApi
