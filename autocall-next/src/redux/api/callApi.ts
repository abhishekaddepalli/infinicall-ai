import { baseApi } from './baseApi'
import { CallLogsResponse, CallResponse, PlaceCallPayload } from '@/types/flow'

export const callApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    placeCall: builder.mutation<CallResponse, PlaceCallPayload>({
      query: (body) => ({
        url: '/calls/place',
        method: 'POST',
        body,
      }),
    }),
    getCallLogs: builder.query<CallLogsResponse, { page?: number; limit?: number; search?: string; status?: string; direction?: string; sortColumn?: string; sortOrder?: string; prioritizeRestricted?: boolean } | void>({
      query: (params) => {
        if (!params) return '/call-logs';
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append('page', params.page.toString());
        if (params.limit) queryParams.append('limit', params.limit.toString());
        if (params.search) queryParams.append('search', params.search);
        if (params.status) queryParams.append('status', params.status);
        if (params.direction) queryParams.append('direction', params.direction);
        if (params.sortColumn) queryParams.append('sortColumn', params.sortColumn);
        if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
        if (params.prioritizeRestricted) queryParams.append('prioritizeRestricted', 'true');
        
        const queryString = queryParams.toString();
        return queryString ? `/call-logs?${queryString}` : '/call-logs';
      },
      providesTags: ['CallLogs'],
    }),
  }),
})

export const { usePlaceCallMutation, useGetCallLogsQuery } = callApi
