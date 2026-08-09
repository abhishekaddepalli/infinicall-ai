import { baseApi } from './baseApi'
import { Attachment, AttachmentResponse, AttachmentUploadResponse } from '@/types/attachment'

export const attachmentApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getAttachments: builder.query<AttachmentResponse, { page?: number; limit?: number; type?: string; search?: string } | void>({
      query: (params) => ({
        url: '/attachment',
        params: params || {},
      }),
      providesTags: (result) =>
        result?.attachments
          ? [...result.attachments.map(({ id }) => ({ type: 'Attachment' as const, id })), { type: 'Attachment', id: 'LIST' }]
          : [{ type: 'Attachment', id: 'LIST' }],
    }),
    getAttachmentById: builder.query<Attachment, string>({
      query: (id) => `/attachment/${id}`,
      providesTags: (result, error, id) => [{ type: 'Attachment', id }],
    }),
    uploadAttachments: builder.mutation<AttachmentUploadResponse, FormData>({
      query: (formData) => ({
        url: '/attachment/upload',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: [{ type: 'Attachment', id: 'LIST' }],
    }),
    deleteAttachment: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/attachment/bulk`,
        method: 'DELETE',
        body: { ids: [id] },
      }),
      invalidatesTags: [{ type: 'Attachment', id: 'LIST' }],
    }),
    deleteBulkAttachments: builder.mutation<{ message: string }, string[]>({
      query: (ids) => ({
        url: '/attachment/bulk',
        method: 'DELETE',
        body: { ids },
      }),
      invalidatesTags: [{ type: 'Attachment', id: 'LIST' }],
    }),
  }),
})

export const {
  useGetAttachmentsQuery,
  useGetAttachmentByIdQuery,
  useUploadAttachmentsMutation,
  useDeleteAttachmentMutation,
  useDeleteBulkAttachmentsMutation,
} = attachmentApi
