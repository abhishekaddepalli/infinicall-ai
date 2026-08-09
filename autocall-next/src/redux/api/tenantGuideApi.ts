import {
  TenantGuideListResponse,
  TenantGuideSingleResponse,
  TenantGuideMutationResponse,
  TenantGuide
} from '@/types/tenant-guide';
import { baseApi } from './baseApi';

export const tenantGuideApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getTenantGuides: builder.query<TenantGuideListResponse, { page?: number; limit?: number; search?: string; is_active?: boolean }>({
      query: (params) => ({
        url: '/tenant-guide',
        params,
      }),
      providesTags: ['TenantGuide'],
    }),
    getTenantGuideById: builder.query<TenantGuideSingleResponse, { id: string; search?: string; page?: number; limit?: number }>({
      query: ({ id, ...params }) => ({
        url: `/tenant-guide/${id}`,
        params,
      }),
      providesTags: (result, error, { id }) => [{ type: 'TenantGuide', id }, 'TenantGuide'],
    }),
    createTenantGuide: builder.mutation<TenantGuideMutationResponse, Partial<TenantGuide>>({
      query: (body) => ({
        url: '/tenant-guide/create',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['TenantGuide'],
    }),
    updateTenantGuide: builder.mutation<TenantGuideMutationResponse, { id: string; data: Partial<TenantGuide> }>({
      query: ({ id, data }) => ({
        url: `/tenant-guide/${id}/update`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'TenantGuide', id }, 'TenantGuide'],
    }),
    deleteTenantGuide: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `/tenant-guide/${id}/delete`,
        method: 'DELETE',
      }),
      invalidatesTags: ['TenantGuide'],
    }),
    deleteGuideEndpoint: builder.mutation<{ success: boolean; message: string }, { guideId: string; endpointId: string }>({
      // Route: /api/tenant-guide/[id]/endpoint/[endpointId]/delete — [id] = guideId
      query: ({ guideId, endpointId }) => ({
        url: `/tenant-guide/${guideId}/endpoint/${endpointId}/delete`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { guideId }) => [{ type: 'TenantGuide', id: guideId }, 'TenantGuide'],
    }),
  }),
});

export const {
  useGetTenantGuidesQuery,
  useGetTenantGuideByIdQuery,
  useCreateTenantGuideMutation,
  useUpdateTenantGuideMutation,
  useDeleteTenantGuideMutation,
  useDeleteGuideEndpointMutation,
} = tenantGuideApi;
