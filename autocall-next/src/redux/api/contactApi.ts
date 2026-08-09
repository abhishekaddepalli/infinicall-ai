import { baseApi } from './baseApi'
import { 
  ContactListResponse, 
  ContactMutationResponse, 
  CreateContactPayload, 
  UpdateContactPayload,
  BulkDeletePayload,
  ImportContactResponse
} from '@/types/contact';

export const contactApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getContacts: builder.query<ContactListResponse, { page?: number; limit?: number; search?: string; sortBy?: string; sortOrder?: string }>({
      query: (params) => ({
        url: '/contacts',
        params,
      }),
      providesTags: ['ContactHub'],
    }),
    createContact: builder.mutation<ContactMutationResponse, CreateContactPayload>({
      query: (data) => ({
        url: '/contacts/create',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['ContactHub', 'Dashboard'],
    }),
    updateContact: builder.mutation<ContactMutationResponse, UpdateContactPayload>({
      query: ({ id, data }) => ({
        url: `/contacts/${id}/update`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['ContactHub', 'Dashboard'],
    }),
    bulkDeleteContacts: builder.mutation<ContactMutationResponse, BulkDeletePayload>({
      query: (data) => ({
        url: '/contacts/bulk-delete',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['ContactHub', 'Dashboard'],
    }),
    importContacts: builder.mutation<ImportContactResponse, FormData>({
      query: (formData) => ({
        url: '/contacts/import',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['ContactHub', 'Dashboard'],
    }),
    exportContacts: builder.query<Blob, void>({
      query: () => ({
        url: '/contacts/export/csv',
        responseHandler: (response) => response.blob(),
      }),
    }),
    downloadImportTemplate: builder.query<Blob, void>({
      query: () => ({
        url: '/contacts/import-template',
        responseHandler: (response) => response.blob(),
      }),
    }),
  }),
});

export const {
  useGetContactsQuery,
  useCreateContactMutation,
  useUpdateContactMutation,
  useBulkDeleteContactsMutation,
  useImportContactsMutation,
  useLazyExportContactsQuery,
  useLazyDownloadImportTemplateQuery,
} = contactApi;
