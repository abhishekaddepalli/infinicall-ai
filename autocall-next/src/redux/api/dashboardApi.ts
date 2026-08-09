import { baseApi } from './baseApi'

export const dashboardApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getAdminDashboardStats: builder.query<any, { dateRange?: string; startDate?: string; endDate?: string } | void>({
      query: (params) => ({
        url: '/dashboard',
        params: params || {},
      }),
      providesTags: ['Dashboard'],
    }),
    getUserDashboardStats: builder.query<any, { dateRange?: string; startDate?: string; endDate?: string } | void>({
      query: (params) => ({
        url: '/dashboard/user',
        params: params || {},
      }),
      providesTags: ['Dashboard'],
    }),
    getTeamMemberDashboardStats: builder.query<any, { dateRange?: string; startDate?: string; endDate?: string, search?: string } | void>({
      query: (params) => ({
        url: '/dashboard/team-member',
        params: params || {},
      }),
      providesTags: ['Dashboard'],
    }),
  }),
})

export const {
  useGetAdminDashboardStatsQuery,
  useGetUserDashboardStatsQuery,
  useGetTeamMemberDashboardStatsQuery,
} = dashboardApi
