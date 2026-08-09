import { baseApi } from './baseApi'
import {
  GoogleSheetsResponse,
  GoogleSheetResponse,
  GoogleSheet,
} from '@/types/google-workspace'

export const googleSheetsApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getGoogleSheets: builder.query<GoogleSheetsResponse, void>({
      query: () => ({ url: '/google-sheets' }),
      providesTags: ['GoogleWorkspace'],
    }),
    getGoogleSheetById: builder.query<GoogleSheetResponse, string>({
      query: (id) => ({ url: `/google-sheets/${id}` }),
      providesTags: (_result, _err, id) => [{ type: 'GoogleWorkspace', id }],
    }),
    createGoogleSheet: builder.mutation<{ success: boolean; data: GoogleSheet }, Partial<GoogleSheet> & { create_in_google?: boolean }>({
      query: (body) => ({ url: '/google-sheets', method: 'POST', body }),
      invalidatesTags: ['GoogleWorkspace'],
    }),
    updateGoogleSheet: builder.mutation<{ success: boolean; data: GoogleSheet }, { id: string; data: Partial<GoogleSheet> }>({
      query: ({ id, data }) => ({ url: `/google-sheets/${id}`, method: 'PUT', body: data }),
      invalidatesTags: ['GoogleWorkspace'],
    }),
    // delete_from is passed as a query param: ?delete_from=google or ?delete_from=system
    deleteGoogleSheet: builder.mutation<{ success: boolean; message: string }, { id: string; delete_from: 'system' | 'google' }>({
      query: ({ id, delete_from }) => ({ url: `/google-sheets/${id}?delete_from=${delete_from}`, method: 'DELETE' }),
      invalidatesTags: ['GoogleWorkspace'],
    }),
    // delete_from and ids are both in the request body
    bulkDeleteGoogleSheets: builder.mutation<{ success: boolean; message: string }, { ids: string[]; delete_from: 'system' | 'google' }>({
      query: (body) => ({ url: '/google-sheets/bulk-delete', method: 'POST', body }),
      invalidatesTags: ['GoogleWorkspace'],
    }),
    syncGoogleSheets: builder.mutation<{ success: boolean; message?: string; sheets?: any[]; mode: 'list' | 'sync' }, { google_account_id: string; sheets?: { id: string; name: string }[] }>({
      query: (body) => ({ url: '/google-sheets/sync-sheets', method: 'POST', body }),
      invalidatesTags: (result) => result?.mode === 'sync' ? ['GoogleWorkspace'] : [],
    }),
    readSheet: builder.query<{ success: boolean; range: string; majorDimension: string; values: any[][] }, { id: string; range?: string }>({
      query: ({ id, range }) => ({ url: `/google-sheets/${id}/values${range ? `?range=${range}` : ''}` }),
      providesTags: (_result, _err, { id }) => [{ type: 'GoogleWorkspace', id: `SheetData-${id}` }],
    }),
    linkGoogleSheet: builder.mutation<{ success: boolean; data: GoogleSheet }, string>({
      query: (id) => ({ url: `/google-sheets/${id}/link`, method: 'POST' }),
      invalidatesTags: ['GoogleWorkspace'],
    }),
    writeSheet: builder.mutation<{ success: boolean; message: string; response: any }, { id: string; range: string; values: any[][]; majorDimension?: 'ROWS' | 'COLUMNS' }>({
      query: ({ id, ...body }) => ({ url: `/google-sheets/${id}/values`, method: 'POST', body }),
      invalidatesTags: (_result, _err, { id }) => [{ type: 'GoogleWorkspace', id: `SheetData-${id}` }],
    }),
  }),
})

export const {
  useGetGoogleSheetsQuery,
  useGetGoogleSheetByIdQuery,
  useCreateGoogleSheetMutation,
  useUpdateGoogleSheetMutation,
  useDeleteGoogleSheetMutation,
  useBulkDeleteGoogleSheetsMutation,
  useSyncGoogleSheetsMutation,
  useReadSheetQuery,
  useWriteSheetMutation,
  useLinkGoogleSheetMutation,
} = googleSheetsApi
